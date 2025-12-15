
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Order, User, SiteContent, ToastNotification, SavedCard, PayoutAccount } from '../types';
import { getSiteContent, updateSiteContent as updateFirestoreContent } from '../services/cmsService';
import { getUserLocation, saveLocationData, getSavedLocation, logLocationAnalytics, type LocationData } from '../services/locationService';

// Default Mock Data for CMS
const DEFAULT_CONTENT: SiteContent = {
  hero: {
    badge: 'OFFICIAL US IMPORTER',
    titleLine1: 'สินค้าอเมริกา',
    titleLine2: 'ส่งตรงถึงบ้านคุณ',
    description: 'พบกับสินค้าแบรนด์ดังและสินค้าพิเศษจาก USA กว่า 10,000 รายการ บริการฝากซื้อที่เชื่อถือได้ที่สุด',
    backgroundImage: 'https://i.ibb.co/s9g0FvQd/3.png' // Default background
  },
  promoBanners: [
    { 
      id: 1, 
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070', 
      title: 'MEGA US SALE', 
      subtitle: 'สินค้าแบรนด์ดังลดสูงสุด 70%', 
      link: '/category/flash-sale' 
    },
    { 
      id: 2, 
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070', 
      title: 'NEW ARRIVALS', 
      subtitle: 'คอลเลคชั่นใหม่ส่งตรงจาก NYC', 
      link: '/category/new' 
    }
  ],
  categoryBanners: [
    { id: 1, title: 'Summer Collection', subtitle: 'สดใสรับซัมเมอร์', image: 'https://picsum.photos/800/500?random=101', link: '/category/fashion' },
    { id: 2, title: 'Vintage Vibes', subtitle: 'สไตล์วินเทจสุดคลาสสิค', image: 'https://picsum.photos/800/500?random=102', link: '/category/fashion' },
    { id: 3, title: 'Outdoor Living', subtitle: 'ตกแต่งสวนและมุมพักผ่อน', image: 'https://picsum.photos/800/500?random=103', link: '/category/home' },
    { id: 4, title: 'Gadget Zone', subtitle: 'เทคโนโลยีล้ำสมัย', image: 'https://picsum.photos/800/500?random=104', link: '/category/electronics' },
    { id: 5, title: 'Healthy Life', subtitle: 'วิตามินนำเข้าจาก USA', image: 'https://picsum.photos/800/500?random=105', link: '/category/vitamins' },
    { id: 6, title: 'Kids & Toys', subtitle: 'ของเล่นเสริมพัฒนาการ', image: 'https://picsum.photos/800/500?random=106', link: '/category/toys' }
  ]
};

interface GlobalContextType {
  cart: CartItem[];
  orders: Order[];
  wishlist: Product[];
  user: User | null;
  siteContent: SiteContent;
  isAuthenticated: boolean;
  notifications: ToastNotification[];
  savedCards: SavedCard[];
  payoutAccounts: PayoutAccount[];
  userLocation: LocationData | null;
  isLoadingLocation: boolean;
  addToCart: (product: Product, quantity?: number, option?: string) => void;
  removeFromCart: (id: string) => void;
  updateCartQty: (id: string, delta: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  placeOrder: (order: Order) => void;
  login: (email: string) => void;
  logout: () => void;
  updateSiteContent: (newContent: SiteContent) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  addSavedCard: (card: Omit<SavedCard, 'id'>) => void;
  removeSavedCard: (id: string) => void;
  addPayoutAccount: (account: Omit<PayoutAccount, 'id'>) => void;
  removePayoutAccount: (id: string) => void;
  refreshLocation: () => Promise<void>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Persist state with localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('truvamate_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('truvamate_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('truvamate_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('truvamate_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [savedCards, setSavedCards] = useState<SavedCard[]>(() => {
    const saved = localStorage.getItem('truvamate_cards');
    return saved ? JSON.parse(saved) : [];
  });

  const [payoutAccounts, setPayoutAccounts] = useState<PayoutAccount[]>(() => {
    const saved = localStorage.getItem('truvamate_payouts');
    return saved ? JSON.parse(saved) : [];
  });

  const [siteContent, setSiteContent] = useState<SiteContent>(DEFAULT_CONTENT);

  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  const [userLocation, setUserLocation] = useState<LocationData | null>(() => {
    return getSavedLocation();
  });

  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Load site content from Firestore on mount
  useEffect(() => {
    loadSiteContent();
  }, []);

  // Track user location on mount
  useEffect(() => {
    trackUserLocation();
  }, []);

  const loadSiteContent = async () => {
    const content = await getSiteContent();
    setSiteContent(content);
  };

  const trackUserLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const location = await getUserLocation();
      if (location) {
        setUserLocation(location);
        saveLocationData(location);
        logLocationAnalytics(location);
      }
    } catch (error) {
      console.error('Failed to track location:', error);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const refreshLocation = async () => {
    await trackUserLocation();
  };

  useEffect(() => {
    localStorage.setItem('truvamate_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('truvamate_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('truvamate_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (user) localStorage.setItem('truvamate_user', JSON.stringify(user));
    else localStorage.removeItem('truvamate_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('truvamate_cards', JSON.stringify(savedCards));
  }, [savedCards]);

  useEffect(() => {
    localStorage.setItem('truvamate_payouts', JSON.stringify(payoutAccounts));
  }, [payoutAccounts]);

  // Toast System
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  const removeToast = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Cart Logic
  const addToCart = (product: Product, quantity = 1, option = 'Standard') => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity, selectedOption: option }];
    });
    showToast(`เพิ่ม "${product.title}" ลงตะกร้าแล้ว`, 'success');
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
    showToast('ลบสินค้าออกจากตะกร้าแล้ว', 'info');
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  // Wishlist Logic
  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        showToast('ลบออกจากรายการโปรด', 'info');
        return prev.filter(p => p.id !== product.id);
      } else {
        showToast('เพิ่มในรายการโปรดแล้ว', 'success');
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(p => p.id === productId);
  };

  // Order Logic
  const placeOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
    showToast('ฝากซื้อสำเร็จ!', 'success');
  };

  // Saved Cards Logic
  const addSavedCard = (card: Omit<SavedCard, 'id'>) => {
    const newCard = { ...card, id: Date.now().toString() };
    setSavedCards(prev => [...prev, newCard]);
  };

  const removeSavedCard = (id: string) => {
    setSavedCards(prev => prev.filter(card => card.id !== id));
    showToast('ลบบัตรเครดิตเรียบร้อยแล้ว', 'info');
  };

  // Payout Accounts Logic
  const addPayoutAccount = (account: Omit<PayoutAccount, 'id'>) => {
    const newAccount = { ...account, id: Date.now().toString(), isDefault: payoutAccounts.length === 0 };
    setPayoutAccounts(prev => [...prev, newAccount]);
    showToast('เพิ่มบัญชีรับเงินสำเร็จ', 'success');
  };

  const removePayoutAccount = (id: string) => {
    setPayoutAccounts(prev => prev.filter(acc => acc.id !== id));
    showToast('ลบบัญชีเรียบร้อยแล้ว', 'info');
  };

  // Auth Logic
  const login = (email: string) => {
    setUser({
      name: 'Admin User',
      email: email,
      memberSince: new Date().getFullYear().toString(),
      avatar: 'https://i.pravatar.cc/150?img=11'
    });
    showToast(`ยินดีต้อนรับ, Admin User`, 'success');
  };

  const logout = () => {
    setUser(null);
    showToast('ออกจากระบบสำเร็จ', 'info');
  };

  const updateSiteContent = async (newContent: SiteContent) => {
    setSiteContent(newContent);
    const result = await updateFirestoreContent(newContent);
    if (result.success) {
      showToast('บันทึกการแก้ไขเว็บไซต์เรียบร้อย', 'success');
    } else {
      showToast('เกิดข้อผิดพลาด: ' + result.error, 'error');
    }
  };

  return (
    <GlobalContext.Provider value={{
      cart,
      orders,
      wishlist,
      user,
      siteContent,
      isAuthenticated: !!user,
      notifications,
      savedCards,
      payoutAccounts,
      addToCart,
      removeFromCart,
      updateCartQty,
      clearCart,
      toggleWishlist,
      isInWishlist,
      placeOrder,
      login,
      logout,
      updateSiteContent,
      showToast,
      removeToast,
      addSavedCard,
      removeSavedCard,
      addPayoutAccount,
      removePayoutAccount,
      userLocation,
      isLoadingLocation,
      refreshLocation
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
};
