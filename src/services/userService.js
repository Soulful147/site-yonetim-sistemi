import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Get all users
 */
export const getAllUsers = async () => {
    try {
        const snapshot = await getDocs(collection(db, 'users'));
        return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Get all users error:', error);
        throw error;
    }
};

/**
 * Get users by role
 */
export const getUsersByRole = async (role) => {
    try {
        const q = query(collection(db, 'users'), where('role', '==', role));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Get users by role error:', error);
        throw error;
    }
};

/**
 * Get user by ID
 */
export const getUserById = async (uid) => {
    try {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            throw new Error('Kullanıcı bulunamadı');
        }

        return { uid: docSnap.id, ...docSnap.data() };
    } catch (error) {
        console.error('Get user error:', error);
        throw error;
    }
};

/**
 * Create user profile
 */
export const createUserProfile = async (uid, userData) => {
    try {
        await setDoc(doc(db, 'users', uid), {
            ...userData,
            created_at: new Date(),
        });
        return true;
    } catch (error) {
        console.error('Create user profile error:', error);
        throw error;
    }
};

/**
 * Update user
 */
export const updateUser = async (uid, updates) => {
    try {
        const docRef = doc(db, 'users', uid);
        await updateDoc(docRef, {
            ...updates,
            updated_at: new Date(),
        });
        return true;
    } catch (error) {
        console.error('Update user error:', error);
        throw error;
    }
};

/**
 * Delete user
 */
export const deleteUser = async (uid) => {
    try {
        await deleteDoc(doc(db, 'users', uid));
        return true;
    } catch (error) {
        console.error('Delete user error:', error);
        throw error;
    }
};

/**
 * Get staff members
 */
export const getStaffMembers = async () => {
    return getUsersByRole('staff');
};

/**
 * Get residents
 */
export const getResidents = async () => {
    return getUsersByRole('resident');
};
