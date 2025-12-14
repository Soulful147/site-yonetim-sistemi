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
            block: userProfile?.block || '',
            flat_no: userProfile?.flat_no || '',
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
