
import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Facebook, Mail, Lock, User, ArrowRight, X, FileText, CheckCircle2, Gift } from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { registerWithEmail, loginWithEmail, loginWithGoogle, loginWithFacebook, resetPassword, registerSellerRole } from '../services/authService';
import { validateReferralCode, registerReferral, createReferralCode } from '../services/referralService';

export const Login: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [referralValidated, setReferralValidated] = useState(false);
  const [registerAsSeller, setRegisterAsSeller] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  
  const navigate = useNavigate();
  const { login, showToast } = useGlobal();

  // Check for referral code in URL
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      setReferralCode(refCode);
      setIsLogin(false); // Switch to register mode
      validateReferral(refCode);
    }
  }, [searchParams]);

  const validateReferral = async (code: string) => {
    if (!code) {
      setReferralValidated(false);
      return;
    }
    
    try {
      const isValid = await validateReferralCode(code);
      setReferralValidated(isValid);
      if (isValid) {
        showToast('โค้ดแนะนำเพื่อนถูกต้อง!', 'success');
      } else {
        showToast('โค้ดแนะนำเพื่อนไม่ถูกต้อง', 'error');
      }
    } catch (error) {
      setReferralValidated(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // Login Flow
      setLoading(true);
      const result = await loginWithEmail(email, password);
      setLoading(false);
      
      if (result.success && result.user) {
        login(result.user.email);
        showToast('เข้าสู่ระบบสำเร็จ', 'success');
        navigate('/profile');
      } else {
        showToast(result.error || 'เข้าสู่ระบบไม่สำเร็จ', 'error');
      }
    } else {
      // Register Flow - Show Modal First
      if (!displayName.trim()) {
        showToast('กรุณากรอกชื่อ-นามสกุล', 'error');
        return;
      }
      setShowTermsModal(true);
    }
  };

  const handleConfirmRegistration = async () => {
    if (!acceptedTerms) return;
    
    setShowTermsModal(false);
    setLoading(true);
    const result = await registerWithEmail(email, password, displayName, registerAsSeller ? 'seller' : 'customer');
    setLoading(false);
    
    if (result.success && result.user) {
      // Create referral code for new user
      try {
        await createReferralCode(result.user.uid);
      } catch (error) {
        console.error('Error creating referral code:', error);
      }

      // Register referral if code was used
      if (referralCode && referralValidated) {
        try {
          await registerReferral(referralCode, result.user.uid);
        } catch (error) {
          console.error('Error registering referral:', error);
        }
      }

      // If registering as seller, call backend to set seller role (custom claim)
      if (registerAsSeller) {
        const sellerResult = await registerSellerRole();
        if (!sellerResult.success) {
          showToast('สมัครเป็นผู้ขายไม่สำเร็จ: ' + (sellerResult.error || 'Unknown error'), 'error');
        } else {
          showToast('เปิดสถานะผู้ขายสำเร็จ', 'success');
        }
      }

      login(result.user.email);
      showToast('สมัครสมาชิกสำเร็จ', 'success');
      navigate('/profile');
    } else {
      showToast(result.error || 'สมัครสมาชิกไม่สำเร็จ', 'error');
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const result = await loginWithGoogle();
    setLoading(false);
    
    if (result.success && result.user) {
      login(result.user.email);
      showToast('เข้าสู่ระบบด้วย Google สำเร็จ', 'success');
      navigate('/profile');
    } else {
      showToast(result.error || 'เข้าสู่ระบบไม่สำเร็จ', 'error');
    }
  };

  const handleFacebookLogin = async () => {
    setLoading(true);
    const result = await loginWithFacebook();
    setLoading(false);
    
    if (result.success && result.user) {
      login(result.user.email);
      showToast('เข้าสู่ระบบด้วย Facebook สำเร็จ', 'success');
      navigate('/profile');
    } else {
      showToast(result.error || 'เข้าสู่ระบบไม่สำเร็จ', 'error');
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      showToast('กรุณากรอกอีเมล', 'error');
      return;
    }
    
    setLoading(true);
    const result = await resetPassword(email);
    setLoading(false);
    
    if (result.success) {
      showToast('ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลแล้ว', 'success');
      setShowResetPassword(false);
    } else {
      showToast(result.error || 'ส่งลิงก์ไม่สำเร็จ', 'error');
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center bg-slate-50 py-12 px-4 relative">
      
      {/* Reset Password Modal */}
      {showResetPassword && (
        <div className="fixed inset-0 z-[900] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-brand-navy p-4 flex justify-between items-center">
              <h3 className="text-white font-bold flex items-center gap-2">
                <Lock className="text-brand-gold" size={20} /> รีเซ็ตรหัสผ่าน
              </h3>
              <button onClick={() => setShowResetPassword(false)} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-slate-600 text-sm">
                กรอกอีเมลของคุณ เราจะส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปให้
              </p>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={20} />
                </div>
                <input 
                  type="email" 
                  placeholder="อีเมล" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold text-slate-900"
                  required
                />
              </div>
              
              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1" onClick={() => setShowResetPassword(false)}>
                  ยกเลิก
                </Button>
                <Button className="flex-1" onClick={handleResetPassword} disabled={loading}>
                  {loading ? 'กำลังส่ง...' : 'ส่งลิงก์'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Terms & Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-[900] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="bg-brand-navy p-4 flex justify-between items-center shrink-0">
              <h3 className="text-white font-bold flex items-center gap-2">
                <FileText className="text-brand-gold" size={20} /> ข้อตกลงและเงื่อนไข
              </h3>
              <button onClick={() => setShowTermsModal(false)} className="text-slate-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto bg-slate-50 text-slate-600 text-sm leading-relaxed space-y-4">
              <p className="font-bold text-slate-900">โปรดอ่านและยอมรับเงื่อนไขก่อนสมัครสมาชิก</p>
              
              <div className="space-y-3">
                <p>1. <strong>ข้อมูลส่วนบุคคล:</strong> ข้าพเจ้ายินยอมให้ Truvamate เก็บข้อมูลส่วนบุคคลเพื่อใช้ในการให้บริการ จัดส่งสินค้า และติดต่อสื่อสาร ตามนโยบายความเป็นส่วนตัว (Privacy Policy)</p>
                <p>2. <strong>การใช้งานบัญชี:</strong> ข้าพเจ้ารับรองว่าข้อมูลที่ใช้สมัครเป็นความจริง และจะเก็บรักษารหัสผ่านไว้เป็นความลับ</p>
                <p>3. <strong>ข้อจำกัดอายุ (สำหรับสินค้าพิเศษ):</strong> หากข้าพเจ้าใช้บริการฝากซื้อสินค้าพิเศษจาก USA ข้าพเจ้ารับรองว่าข้าพเจ้ามีอายุครบ 20 ปีบริบูรณ์ขึ้นไป</p>
                <p>4. <strong>การยกเลิกและคืนเงิน:</strong> ข้าพเจ้าเข้าใจนโยบายการคืนสินค้าและการรับประกันของทางเว็บไซต์</p>
                <p>5. <strong>กฎหมาย:</strong> ข้าพเจ้าจะไม่ใช้บริการนี้เพื่อการกระทำที่ผิดกฎหมาย หรือละเมิดลิขสิทธิ์</p>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded text-xs text-yellow-800 mt-4">
                * การกด "ยืนยันการสมัคร" ถือว่าท่านได้อ่านและยอมรับข้อตกลงข้างต้นทั้งหมดแล้ว
              </div>
            </div>

            <div className="p-4 bg-white border-t border-slate-200 shrink-0 space-y-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${acceptedTerms ? 'bg-brand-gold border-brand-gold text-slate-900' : 'border-slate-300 bg-white group-hover:border-brand-gold'}`}>
                  {acceptedTerms && <CheckCircle2 size={16} />}
                </div>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
                <span className="text-sm font-medium text-slate-700 select-none">ข้าพเจ้ายอมรับเงื่อนไขและข้อตกลงการใช้งาน</span>
              </label>
              
              <div className="flex gap-3">
                <Button variant="ghost" className="flex-1" onClick={() => setShowTermsModal(false)}>ยกเลิก</Button>
                <Button 
                  className="flex-1 shadow-lg" 
                  disabled={!acceptedTerms}
                  onClick={handleConfirmRegistration}
                >
                  ยืนยันการสมัคร
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-brand-navy mb-2">
              {isLogin ? 'ยินดีต้อนรับกลับ' : 'สร้างบัญชีใหม่'}
            </h1>
            <p className="text-slate-500">
              {isLogin ? 'เข้าสู่ระบบเพื่อจัดการคำสั่งซื้อของคุณ' : 'สมัครสมาชิกเพื่อรับสิทธิพิเศษมากมาย'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User size={20} />
                </div>
                <input 
                  type="text" 
                  placeholder="ชื่อ - นามสกุล" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold text-slate-900"
                  required={!isLogin}
                />
              </div>
            )}
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail size={20} />
              </div>
              <input 
                type="email" 
                placeholder="อีเมล" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold text-slate-900"
                required
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={20} />
              </div>
              <input 
                type="password" 
                placeholder="รหัสผ่าน" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold text-slate-900"
                required
                minLength={6}
              />
            </div>

            {!isLogin && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Gift size={20} />
                </div>
                <input 
                  type="text" 
                  placeholder="โค้ดแนะนำเพื่อน (ไม่บังคับ)" 
                  value={referralCode}
                  onChange={(e) => {
                    setReferralCode(e.target.value);
                    if (e.target.value.length >= 12) {
                      validateReferral(e.target.value);
                    }
                  }}
                  className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-1 text-slate-900 ${
                    referralCode && referralValidated 
                      ? 'border-green-500 focus:border-green-500 focus:ring-green-500' 
                      : referralCode && !referralValidated
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : 'border-slate-300 focus:border-brand-gold focus:ring-brand-gold'
                  }`}
                />
                {referralCode && referralValidated && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <CheckCircle2 size={20} className="text-green-500" />
                  </div>
                )}
              </div>
            )}

            {!isLogin && (
              <label className="flex items-center gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={registerAsSeller}
                  onChange={(e) => setRegisterAsSeller(e.target.checked)}
                  className="w-4 h-4 text-brand-navy border-slate-300 rounded focus:ring-brand-navy"
                />
                ต้องการสมัครเป็นผู้ขาย (Seller)
              </label>
            )}

            {isLogin && (
              <div className="flex justify-end">
                <button 
                  type="button"
                  onClick={() => setShowResetPassword(true)} 
                  className="text-sm text-brand-blue hover:underline"
                >
                  ลืมรหัสผ่าน?
                </button>
              </div>
            )}

            <Button className="w-full py-3 text-lg mt-2" type="submit" disabled={loading}>
              {loading ? 'กำลังดำเนินการ...' : (isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก')} <ArrowRight size={20} className="ml-2" />
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">หรือดำเนินการต่อด้วย</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              type="button"
              onClick={handleFacebookLogin}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium text-slate-700 disabled:opacity-50"
            >
              <Facebook size={20} className="text-blue-600" /> Facebook
            </button>
            <button 
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium text-slate-700 disabled:opacity-50"
            >
              <span className="font-bold text-red-500">G</span> Google
            </button>
          </div>
        </div>
        
        <div className="bg-slate-50 p-4 text-center text-sm text-slate-600 border-t border-slate-100">
          {isLogin ? 'ยังไม่มีบัญชีผู้ใช้?' : 'มีบัญชีอยู่แล้ว?'}
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setShowTermsModal(false);
              setAcceptedTerms(false);
            }} 
            className="text-brand-navy font-bold ml-1 hover:underline"
          >
            {isLogin ? 'สมัครสมาชิก' : 'เข้าสู่ระบบ'}
          </button>
        </div>
      </div>
    </div>
  );
};
