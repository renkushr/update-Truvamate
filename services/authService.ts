import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider, facebookProvider } from '../config/firebase';
import { User } from '../types';
import { API_BASE_URL } from '../src/config/api';

// Register with Email & Password
export const registerWithEmail = async (
  email: string, 
  password: string, 
  displayName: string,
  role: 'customer' | 'seller' = 'customer'
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile
    await updateProfile(user, { displayName });

    // Create user document in Firestore
    const userData: any = {
      id: user.uid,
      email: user.email || '',
      name: displayName,
      role,
      createdAt: new Date().toISOString()
    };

    if (user.photoURL) {
      userData.avatar = user.photoURL;
    }

    await setDoc(doc(db, 'users', user.uid), userData);

    return { success: true, user: userData };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Login with Email & Password
export const loginWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.exists() ? userDoc.data() as User : null;

    return { success: true, user: userData };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Login with Google
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if user document exists
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      // Create new user document
      const userData: any = {
        id: user.uid,
        email: user.email || '',
        name: user.displayName || 'User',
        createdAt: new Date().toISOString()
      };
      
      if (user.photoURL) {
        userData.avatar = user.photoURL;
      }
      
      await setDoc(doc(db, 'users', user.uid), userData);
      return { success: true, user: userData };
    }

    return { success: true, user: userDoc.data() as User };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Login with Facebook
export const loginWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    const user = result.user;

    // Check if user document exists
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      // Create new user document
      const userData: any = {
        id: user.uid,
        email: user.email || '',
        name: user.displayName || 'User',
        createdAt: new Date().toISOString()
      };
      
      if (user.photoURL) {
        userData.avatar = user.photoURL;
      }
      
      await setDoc(doc(db, 'users', user.uid), userData);
      return { success: true, user: userData };
    }

    return { success: true, user: userDoc.data() as User };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Logout
export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Upgrade current user to seller role (calls backend)
export const registerSellerRole = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Not authenticated');
    }

    const token = await user.getIdToken();
    const res = await fetch(`${API_BASE_URL}/auth/register-seller`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to register seller');
    }

    // refresh ID token to pick up new custom claims
    await user.getIdToken(true);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Reset Password
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Get current user
export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};
