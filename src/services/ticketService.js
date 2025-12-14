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
        console.log('Creating ticket with:', { ticketData, userId, userProfile });
        
        // Clean ticket data - remove undefined values
        const cleanTicketData = {
            title: ticketData.title || '',
            category: ticketData.category || '',
            description: ticketData.description || '',
            priority: ticketData.priority || 'medium',
        };

        // Safely extract block and flat_no
        let block = '';
        let flat_no = '';
        
        if (userProfile && userProfile.block !== undefined && userProfile.block !== null) {
            block = String(userProfile.block);
        }
        
        if (userProfile && userProfile.flat_no !== undefined && userProfile.flat_no !== null) {
            flat_no = String(userProfile.flat_no);
        }

        const ticket = {
            ...cleanTicketData,
            user_id: userId || '',
            block: block,
            flat_no: flat_no,
            status: 'new',
            assigned_to: '',
            created_at: Timestamp.now(),
            updated_at: Timestamp.now(),
            rating: 0,
            resolution_time: 0,
        };

        console.log('Ticket object before Firebase:', ticket);

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
