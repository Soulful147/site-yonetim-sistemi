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
        // Safely handle all fields to prevent undefined values
        const ticket = {
            title: String(ticketData?.title || ''),
            category: String(ticketData?.category || ''),
            description: String(ticketData?.description || ''),
            priority: String(ticketData?.priority || 'medium'),
            user_id: String(userId || ''),
            block: String(userProfile?.block || ''),
            flat_no: String(userProfile?.flat_no || ''),
            status: 'new',
            assigned_to: '',
            created_at: Timestamp.now(),
            updated_at: Timestamp.now(),
            rating: 0,
            resolution_time: 0,
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
 * Get all tickets
 */
export const getAllTickets = async () => {
    try {
        const q = query(
            collection(db, 'tickets'),
            orderBy('created_at', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const tickets = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        return tickets;
    } catch (error) {
        console.error('Get all tickets error:', error);
        return [];
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
        const querySnapshot = await getDocs(q);
        const tickets = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        return tickets;
    } catch (error) {
        console.error('Get user tickets error:', error);
        return [];
    }
};
/**
 * Upload ticket photo
 */
export const uploadTicketPhoto = async (file, ticketId) => {
    try {
        const storageRef = ref(storage, `tickets/${ticketId}/${file.name}`);
        await uploadBytes(storageRef, file);
        const photoUrl = await getDownloadURL(storageRef);
        return photoUrl;
    } catch (error) {
        console.error('Upload ticket photo error:', error);
        throw error;
    }
};

/**
 * Get staff assigned tickets
 */
export const getStaffTickets = async (staffId) => {
    try {
        const q = query(
            collection(db, 'tickets'),
            where('assigned_to', '==', staffId),
            orderBy('created_at', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const tickets = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        return tickets;
    } catch (error) {
        console.error('Get staff tickets error:', error);
        return [];
    }
};

/**
 * Update ticket
 */
export const updateTicket = async (ticketId, updates) => {
    try {
        const ticketRef = doc(db, 'tickets', ticketId);
        const updateData = {
            ...updates,
            updated_at: Timestamp.now(),
        };
        
        await updateDoc(ticketRef, updateData);
        
        return { id: ticketId, ...updateData };
    } catch (error) {
        console.error('Update ticket error:', error);
        throw error;
    }
};

