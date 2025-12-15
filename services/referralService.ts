import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where,
  orderBy,
  limit,
  Timestamp,
  increment
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface ReferralCode {
  code: string;
  userId: string;
  createdAt: string;
  totalReferrals: number;
  totalEarnings: number;
  isActive: boolean;
}

export interface Referral {
  id: string;
  referrerId: string;
  referrerCode: string;
  referredUserId: string;
  referredUserEmail: string;
  referredUserName: string;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
  commission: number;
  commissionPaid: boolean;
  orderValue?: number;
}

export interface ReferralStats {
  totalReferrals: number;
  completedReferrals: number;
  pendingReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
}

export interface ReferralSettings {
  commissionRate: number; // เปอร์เซ็นต์
  minOrderValue: number; // ยอดขั้นต่ำที่ได้ commission
  requireFirstPurchase: boolean; // ต้องซื้อก่อนถึงจะได้ commission
  maxCommissionPerReferral: number; // commission สูงสุดต่อคน
}

// Default settings
const DEFAULT_SETTINGS: ReferralSettings = {
  commissionRate: 10, // 10%
  minOrderValue: 500, // 500 บาท
  requireFirstPurchase: true,
  maxCommissionPerReferral: 500, // 500 บาท
};

/**
 * Generate unique referral code
 */
export const generateReferralCode = (userId: string): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  const userPrefix = userId.substring(0, 4).toUpperCase();
  return `${userPrefix}${randomStr}${timestamp}`.substring(0, 12);
};

/**
 * Create referral code for user
 */
export const createReferralCode = async (userId: string): Promise<ReferralCode> => {
  const code = generateReferralCode(userId);
  
  const referralCode: ReferralCode = {
    code,
    userId,
    createdAt: new Date().toISOString(),
    totalReferrals: 0,
    totalEarnings: 0,
    isActive: true,
  };

  await setDoc(doc(db, 'referralCodes', code), referralCode);
  
  // Update user document with referral code
  await updateDoc(doc(db, 'users', userId), {
    referralCode: code,
  });

  return referralCode;
};

/**
 * Get referral code by user ID
 */
export const getReferralCodeByUserId = async (userId: string): Promise<ReferralCode | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) return null;

    const userData = userDoc.data();
    if (!userData.referralCode) {
      // Create one if doesn't exist
      return await createReferralCode(userId);
    }

    const codeDoc = await getDoc(doc(db, 'referralCodes', userData.referralCode));
    if (!codeDoc.exists()) return null;

    return codeDoc.data() as ReferralCode;
  } catch (error) {
    console.error('Error getting referral code:', error);
    return null;
  }
};

/**
 * Validate referral code
 */
export const validateReferralCode = async (code: string): Promise<boolean> => {
  try {
    const codeDoc = await getDoc(doc(db, 'referralCodes', code));
    if (!codeDoc.exists()) return false;

    const data = codeDoc.data() as ReferralCode;
    return data.isActive;
  } catch (error) {
    console.error('Error validating referral code:', error);
    return false;
  }
};

/**
 * Register referral (when someone signs up with referral code)
 */
export const registerReferral = async (
  referralCode: string,
  newUserId: string,
  newUserEmail: string,
  newUserName: string
): Promise<void> => {
  try {
    // Get referral code data
    const codeDoc = await getDoc(doc(db, 'referralCodes', referralCode));
    if (!codeDoc.exists()) {
      throw new Error('Invalid referral code');
    }

    const codeData = codeDoc.data() as ReferralCode;

    // Create referral record
    const referralId = `${codeData.userId}_${newUserId}`;
    const referral: Referral = {
      id: referralId,
      referrerId: codeData.userId,
      referrerCode: referralCode,
      referredUserId: newUserId,
      referredUserEmail: newUserEmail,
      referredUserName: newUserName,
      status: 'pending',
      createdAt: new Date().toISOString(),
      commission: 0,
      commissionPaid: false,
    };

    await setDoc(doc(db, 'referrals', referralId), referral);

    // Update referral code stats
    await updateDoc(doc(db, 'referralCodes', referralCode), {
      totalReferrals: increment(1),
    });

    // Update new user with referrer info
    await updateDoc(doc(db, 'users', newUserId), {
      referredBy: codeData.userId,
      referredByCode: referralCode,
    });

  } catch (error) {
    console.error('Error registering referral:', error);
    throw error;
  }
};

/**
 * Process referral commission (after first purchase)
 */
export const processReferralCommission = async (
  userId: string,
  orderValue: number
): Promise<void> => {
  try {
    // Get user data to check if referred
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) return;

    const userData = userDoc.data();
    if (!userData.referredBy) return;

    // Get referral record
    const referralId = `${userData.referredBy}_${userId}`;
    const referralDoc = await getDoc(doc(db, 'referrals', referralId));
    if (!referralDoc.exists()) return;

    const referral = referralDoc.data() as Referral;
    if (referral.status !== 'pending') return;

    // Get settings
    const settingsDoc = await getDoc(doc(db, 'settings', 'referral'));
    const settings = settingsDoc.exists() 
      ? (settingsDoc.data() as ReferralSettings)
      : DEFAULT_SETTINGS;

    // Check if order value meets minimum
    if (orderValue < settings.minOrderValue) return;

    // Calculate commission
    let commission = (orderValue * settings.commissionRate) / 100;
    if (commission > settings.maxCommissionPerReferral) {
      commission = settings.maxCommissionPerReferral;
    }

    // Update referral record
    await updateDoc(doc(db, 'referrals', referralId), {
      status: 'completed',
      completedAt: new Date().toISOString(),
      commission,
      orderValue,
    });

    // Update referral code stats
    await updateDoc(doc(db, 'referralCodes', referral.referrerCode), {
      totalEarnings: increment(commission),
    });

    // Create commission transaction
    const transactionId = `commission_${referralId}_${Date.now()}`;
    await setDoc(doc(db, 'referralTransactions', transactionId), {
      id: transactionId,
      referralId,
      referrerId: userData.referredBy,
      amount: commission,
      type: 'commission',
      status: 'pending',
      createdAt: new Date().toISOString(),
      orderValue,
    });

  } catch (error) {
    console.error('Error processing referral commission:', error);
  }
};

/**
 * Get user's referrals
 */
export const getUserReferrals = async (userId: string): Promise<Referral[]> => {
  try {
    const q = query(
      collection(db, 'referrals'),
      where('referrerId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Referral);
  } catch (error) {
    console.error('Error getting user referrals:', error);
    return [];
  }
};

/**
 * Get referral statistics
 */
export const getReferralStats = async (userId: string): Promise<ReferralStats> => {
  try {
    const referrals = await getUserReferrals(userId);

    const stats: ReferralStats = {
      totalReferrals: referrals.length,
      completedReferrals: referrals.filter(r => r.status === 'completed').length,
      pendingReferrals: referrals.filter(r => r.status === 'pending').length,
      totalEarnings: referrals.reduce((sum, r) => sum + (r.commission || 0), 0),
      pendingEarnings: referrals
        .filter(r => r.status === 'completed' && !r.commissionPaid)
        .reduce((sum, r) => sum + (r.commission || 0), 0),
      paidEarnings: referrals
        .filter(r => r.commissionPaid)
        .reduce((sum, r) => sum + (r.commission || 0), 0),
    };

    return stats;
  } catch (error) {
    console.error('Error getting referral stats:', error);
    return {
      totalReferrals: 0,
      completedReferrals: 0,
      pendingReferrals: 0,
      totalEarnings: 0,
      pendingEarnings: 0,
      paidEarnings: 0,
    };
  }
};

/**
 * Get all referrals (Admin)
 */
export const getAllReferrals = async (): Promise<Referral[]> => {
  try {
    const q = query(
      collection(db, 'referrals'),
      orderBy('createdAt', 'desc'),
      limit(100)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Referral);
  } catch (error) {
    console.error('Error getting all referrals:', error);
    return [];
  }
};

/**
 * Get referral settings
 */
export const getReferralSettings = async (): Promise<ReferralSettings> => {
  try {
    const docRef = doc(db, 'settings', 'referral');
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return DEFAULT_SETTINGS;
    }
    return docSnap.data() as ReferralSettings;
  } catch (error) {
    console.error('Error getting referral settings:', error);
    return DEFAULT_SETTINGS;
  }
};

/**
 * Update referral settings (Admin)
 */
export const updateReferralSettings = async (settings: ReferralSettings): Promise<void> => {
  try {
    await setDoc(doc(db, 'settings', 'referral'), settings);
  } catch (error) {
    console.error('Error updating referral settings:', error);
    throw error;
  }
};

/**
 * Mark commission as paid (Admin)
 */
export const markCommissionAsPaid = async (referralId: string): Promise<void> => {
  try {
    await updateDoc(doc(db, 'referrals', referralId), {
      commissionPaid: true,
      paidAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error marking commission as paid:', error);
    throw error;
  }
};

export const referralService = {
  generateReferralCode,
  createReferralCode,
  getReferralCodeByUserId,
  validateReferralCode,
  registerReferral,
  processReferralCommission,
  getUserReferrals,
  getReferralStats,
  getAllReferrals,
  getReferralSettings,
  updateReferralSettings,
  markCommissionAsPaid,
};

export default referralService;
