import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Order } from '../types';

// Create new order
export const createOrder = async (
  userId: string, 
  orderData: Omit<Order, 'id'>
): Promise<{ success: boolean; orderId?: string; error?: string }> => {
  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return { success: true, orderId: docRef.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Get user orders
export const getUserOrders = async (userId: string): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    } as Order));
  } catch (error) {
    console.error('Error getting user orders:', error);
    return [];
  }
};

// Get order by ID
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const docRef = doc(db, 'orders', orderId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { ...docSnap.data(), id: docSnap.id } as Order : null;
  } catch (error) {
    console.error('Error getting order:', error);
    return null;
  }
};

// Update order status
export const updateOrderStatus = async (
  orderId: string, 
  status: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, {
      status,
      updatedAt: Timestamp.now()
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Get all orders (for admin)
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    } as Order));
  } catch (error) {
    console.error('Error getting all orders:', error);
    return [];
  }
};

// Get seller orders
export const getSellerOrders = async (sellerId: string): Promise<Order[]> => {
  try {
    // This assumes orders have a sellerId field
    const q = query(
      collection(db, 'orders'),
      where('sellerId', '==', sellerId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    } as Order));
  } catch (error) {
    console.error('Error getting seller orders:', error);
    return [];
  }
};

// Update order tracking
export const updateOrderTracking = async (
  orderId: string,
  trackingNumber: string,
  carrier: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, {
      trackingNumber,
      carrier,
      status: 'shipped',
      shippedAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
