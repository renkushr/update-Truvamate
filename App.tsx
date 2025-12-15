
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Layout/Header.tsx';
import { Footer } from './components/Layout/Footer.tsx';
import { BottomNav } from './components/Layout/BottomNav.tsx';
import { ToastContainer } from './components/ui/Toast.tsx';
import { Home } from './pages/Home.tsx';
import { ProductDetail } from './pages/ProductDetail.tsx';
import { Cart } from './pages/Cart.tsx';
import { Lotto } from './pages/Lotto.tsx';
import { Login } from './pages/Login.tsx';
import { CategoryListing } from './pages/CategoryListing.tsx';
import { Checkout } from './pages/Checkout.tsx';
import { Profile } from './pages/Profile.tsx';
import { SellerDashboard } from './pages/SellerDashboard.tsx';
import { SellerProducts } from './pages/SellerProducts.tsx';
import { SellerOrders } from './pages/SellerOrders.tsx';
import { SellerProductSettings } from './pages/SellerProductSettings.tsx';
import { AdminPanel } from './pages/AdminPanel.tsx';
import { Legal } from './pages/Legal.tsx';
import { Terms } from './pages/Terms.tsx';
import { HowToUse } from './pages/HowToUse.tsx';
import { LottoLegal } from './pages/LottoLegal.tsx';
import { LocationAnalytics } from './pages/LocationAnalytics.tsx';
import TicketPhotos from './pages/TicketPhotos.tsx';
import AdminPhotoUpload from './pages/AdminPhotoUpload.tsx';
import AdminDrivePhotos from './pages/AdminDrivePhotos.tsx';
import AdminLottoOrders from './pages/AdminLottoOrders.tsx';
import AdminUsers from './pages/AdminUsers.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import AdminPayments from './pages/AdminPayments.tsx';
import AdminPaymentSettings from './pages/AdminPaymentSettings.tsx';
import AdminTicketPricing from './pages/AdminTicketPricing.tsx';
import AdminSettings from './pages/AdminSettings.tsx';
import AdminOCRScanner from './pages/AdminOCRScanner.tsx';
import ReferralDashboard from './pages/ReferralDashboard.tsx';
import AdminReferrals from './pages/AdminReferrals.tsx';

// Alias for better naming
const SpecialProducts = Lotto;
const SpecialProductsLegal = LottoLegal;
import { GlobalProvider } from './context/GlobalContext.tsx';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isSellerRoute = location.pathname.startsWith('/seller');
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isSellerRoute || isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* Add padding bottom for mobile bottom nav */}
      <main className="flex-1 pb-16 md:pb-0">
        {children}
      </main>
      {/* Hide footer on mobile or keep it at very bottom, typically mobile apps might hide extensive footers */}
      <div className="hidden md:block">
        <Footer />
      </div>
      <BottomNav />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <GlobalProvider>
      <Router>
        <ToastContainer />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/category/:slug" element={<CategoryListing />} />
            <Route path="/category" element={<CategoryListing />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/referrals" element={<ReferralDashboard />} />
            <Route path="/special-products" element={<SpecialProducts />} />
            <Route path="/lotto" element={<SpecialProducts />} />
            <Route path="/special-products-legal" element={<SpecialProductsLegal />} />
            <Route path="/lotto-legal" element={<SpecialProductsLegal />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/how-to-use" element={<HowToUse />} />
            
            {/* Seller Routes */}
            <Route path="/seller" element={<SellerDashboard />} />
            <Route path="/seller/products" element={<SellerProducts />} />
            <Route path="/seller/products/new" element={<SellerProductSettings />} />
            <Route path="/seller/products/:id/edit" element={<SellerProductSettings />} />
            <Route path="/seller/orders" element={<SellerOrders />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/location" element={<LocationAnalytics />} />
            <Route path="/admin/photo-upload" element={<AdminPhotoUpload />} />
            <Route path="/admin/drive-photos" element={<AdminDrivePhotos />} />
            <Route path="/admin/lotto-orders" element={<AdminLottoOrders />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/payments" element={<AdminPayments />} />
            <Route path="/admin/payment-settings" element={<AdminPaymentSettings />} />
            <Route path="/admin/ticket-pricing" element={<AdminTicketPricing />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/ocr-scanner" element={<AdminOCRScanner />} />
            <Route path="/admin/referrals" element={<AdminReferrals />} />
            
            {/* Photo Routes */}
            <Route path="/ticket-photos/:orderNumber" element={<TicketPhotos />} />
            
            <Route path="*" element={<Home />} />
          </Routes>
        </Layout>
      </Router>
    </GlobalProvider>
  );
};

export default App;
