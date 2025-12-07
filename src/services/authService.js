import {
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    onAuthStateChanged,
    updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

/**
 * Sign in with email and password
 */
export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Get user profile from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (!userDoc.exists()) {
            throw new Error('Kullanıcı profili bulunamadı');
        }

        return {
            uid: user.uid,
            email: user.email,
            ...userDoc.data(),
        };
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

/**
 * Sign out current user
 */
export const logoutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error) {
        console.error('Password reset error:', error);
        throw error;
    }
};

/**
 * Get current user profile
 */
export const getCurrentUserProfile = async (uid) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', uid));

        if (!userDoc.exists()) {
            return null;
        }

        return {
            uid,
            ...userDoc.data(),
        };
    } catch (error) {
        console.error('Get user profile error:', error);
        throw error;
    }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (uid, data) => {
    try {
        await setDoc(doc(db, 'users', uid), data, { merge: true });

        // Update auth profile if display name changed
        if (data.full_name && auth.currentUser) {
            await updateProfile(auth.currentUser, {
                displayName: data.full_name,
            });
        }

        return true;
    } catch (error) {
        console.error('Update profile error:', error);
        throw error;
    }
};

/**
 * Listen to auth state changes
 */
export const onAuthChange = (callback) => {
    return onAuthStateChanged(auth, async (user) => {
        if (user) {
            const profile = await getCurrentUserProfile(user.uid);
            callback(profile);
        } else {
            callback(null);
        }
    });
};

/**
 * Check if user has role
 */
export const hasRole = (user, role) => {
    if (!user) return false;
    return user.role === role;
};

/**
 * Check if user is admin
 */
export const isAdmin = (user) => {
    return hasRole(user, 'admin');
};

/**
 * Check if user is staff
 */
export const isStaff = (user) => {
    return hasRole(user, 'staff');
};

/**
 * Check if user is resident
 */
export const isResident = (user) => {
    return hasRole(user, 'resident');
};
