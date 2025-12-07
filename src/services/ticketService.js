import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { generateId } from '../utils/helpers';

/**
 * Create a new ticket
 */
export const createTicket = async (ticketData, userId, userProfile) => {
    try {
        const ticket = {
            ...ticketData,
            user_id: userId,
            block: userProfile.block,
            flat_no: userProfile.flat_no,
            status: 'new',
            assigned_to: null,
            created_at: Timestamp.now(),
            updated_at: Timestamp.now(),
            rating: null,
            resolution_time: null,
        };

        const docRef = await addDoc(collection(db, 'tickets'), ticket);

        // Create log entry
        await addDoc(collection(db, 'logs'), {
            ticket_id: docRef.id,
            action: 'created',
            by_user: userId,
            timestamp: Timestamp.now(),
            details: 'Talep oluşturuldu',
        });

        return { id: docRef.id, ...ticket };
    } catch (error) {
        console.error('Create ticket error:', error);
        throw error;
    }
};

/**
 * Upload ticket photo
 */
export const uploadTicketPhoto = async (file, ticketId) => {
    try {
        const fileName = `${ticketId}_${Date.now()}_${file.name}`;
        const storageRef = ref(storage, `tickets/${fileName}`);

        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        return downloadURL;
    } catch (error) {
        console.error('Upload photo error:', error);
        throw error;
    }
};

/**
 * Get all tickets
 */
export const getAllTickets = async (filters = {}) => {
    try {
        let q = collection(db, 'tickets');
        const constraints = [];

        if (filters.status) {
            constraints.push(where('status', '==', filters.status));
        }

        if (filters.category) {
            constraints.push(where('category', '==', filters.category));
        }

        if (filters.block) {
            constraints.push(where('block', '==', filters.block));
        }

        if (filters.assigned_to) {
            constraints.push(where('assigned_to', '==', filters.assigned_to));
        }

        constraints.push(orderBy('created_at', 'desc'));

        if (filters.limit) {
            constraints.push(limit(filters.limit));
        }

        if (constraints.length > 0) {
            q = query(q, ...constraints);
        }

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Get all tickets error:', error);
        throw error;
    }
};

/**
 * Get user tickets
 */
export const getUserTickets = async (userId) => {
    try {
        const q = query(
            collection(db, 'tickets'),
            where('user_id', '==', userId),
            orderBy('created_at', 'desc')
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Get user tickets error:', error);
        throw error;
    }
};

/**
 * Get staff tickets (assigned to staff)
 */
export const getStaffTickets = async (staffId) => {
    try {
        const q = query(
            collection(db, 'tickets'),
            where('assigned_to', '==', staffId),
            orderBy('created_at', 'desc')
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Get staff tickets error:', error);
        throw error;
    }
};

/**
 * Get single ticket
 */
export const getTicket = async (ticketId) => {
    try {
        const docRef = doc(db, 'tickets', ticketId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            throw new Error('Talep bulunamadı');
        }

        return { id: docSnap.id, ...docSnap.data() };
    } catch (error) {
        console.error('Get ticket error:', error);
        throw error;
    }
};

/**
 * Update ticket
 */
export const updateTicket = async (ticketId, updates, userId) => {
    try {
        const docRef = doc(db, 'tickets', ticketId);

        const updateData = {
            ...updates,
            updated_at: Timestamp.now(),
        };

        await updateDoc(docRef, updateData);

        // Create log entry
        await addDoc(collection(db, 'logs'), {
            ticket_id: ticketId,
            action: 'updated',
            by_user: userId,
            timestamp: Timestamp.now(),
            details: Object.keys(updates).join(', ') + ' güncellendi',
        });

        return true;
    } catch (error) {
        console.error('Update ticket error:', error);
        throw error;
    }
};

/**
 * Assign ticket to staff
 */
export const assignTicket = async (ticketId, staffId, adminId) => {
    try {
        const docRef = doc(db, 'tickets', ticketId);

        await updateDoc(docRef, {
            assigned_to: staffId,
            status: 'assigned',
            updated_at: Timestamp.now(),
        });

        // Create log entry
        await addDoc(collection(db, 'logs'), {
            ticket_id: ticketId,
            action: 'assigned',
            from: null,
            to: staffId,
            by_user: adminId,
            timestamp: Timestamp.now(),
        });

        return true;
    } catch (error) {
        console.error('Assign ticket error:', error);
        throw error;
    }
};

/**
 * Update ticket status
 */
export const updateTicketStatus = async (ticketId, newStatus, userId) => {
    try {
        const docRef = doc(db, 'tickets', ticketId);
        const ticket = await getTicket(ticketId);

        const updateData = {
            status: newStatus,
            updated_at: Timestamp.now(),
        };

        // If resolving, add resolution time
        if (newStatus === 'resolved') {
            updateData.resolved_at = Timestamp.now();
        }

        await updateDoc(docRef, updateData);

        // Create log entry
        await addDoc(collection(db, 'logs'), {
            ticket_id: ticketId,
            action: 'status_change',
            from: ticket.status,
            to: newStatus,
            by_user: userId,
            timestamp: Timestamp.now(),
        });

        return true;
    } catch (error) {
        console.error('Update status error:', error);
        throw error;
    }
};

/**
 * Rate ticket
 */
export const rateTicket = async (ticketId, rating, userId) => {
    try {
        const docRef = doc(db, 'tickets', ticketId);

        await updateDoc(docRef, {
            rating,
            status: 'closed',
            updated_at: Timestamp.now(),
        });

        // Create log entry
        await addDoc(collection(db, 'logs'), {
            ticket_id: ticketId,
            action: 'rated',
            by_user: userId,
            timestamp: Timestamp.now(),
            details: `${rating} yıldız verildi`,
        });

        return true;
    } catch (error) {
        console.error('Rate ticket error:', error);
        throw error;
    }
};

/**
 * Delete ticket
 */
export const deleteTicket = async (ticketId) => {
    try {
        await deleteDoc(doc(db, 'tickets', ticketId));
        return true;
    } catch (error) {
        console.error('Delete ticket error:', error);
        throw error;
    }
};

/**
 * Get ticket logs
 */
export const getTicketLogs = async (ticketId) => {
    try {
        const q = query(
            collection(db, 'logs'),
            where('ticket_id', '==', ticketId),
            orderBy('timestamp', 'desc')
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Get ticket logs error:', error);
        throw error;
    }
};
