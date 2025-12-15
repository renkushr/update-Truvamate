
import React, { useEffect } from 'react';
import { Scale, Globe, FileSignature, Landmark, ShieldCheck, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const LottoLegal: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/special-products">
            <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent text-slate-500 hover:text-brand-navy">
                <ArrowLeft size={20} className="mr-2" /> กลับไปหน้าสินค้าพิเศษ
            </Button>
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-slate-900 p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Scale size={150} className="text-white" />
                </div>
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-brand-gold text-slate-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                        Messenger Service Agreement
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-4">
                        ข้อตกลงทางกฎหมาย<br/>บริการฝากซื้อสินค้าพิเศษ
                    </h1>
                    <p className="text-slate-300 max-w-2xl text-sm md:text-base leading-relaxed">
                        คำชี้แจงเกี่ยวกับสถานะทางกฎหมาย กรรมสิทธิ์ในสินค้าพิเศษ และเงื่อนไขการให้บริการ "รับฝากซื้อ" ของ Truvamate
                    </p>
                </div>
            </div>

            <div className="p-8 md:p-12 space-y-10 text-slate-700 leading-relaxed">
                
                {/* 1. Messenger Service Model */}
                <section>
                    <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-brand-navy">
                            <Globe size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-3">1. รูปแบบการให้บริการ (Messenger Service Model)</h2>
                            <p className="text-sm md:text-base text-slate-600 mb-3">
                                Truvamate ดำเนินการในฐานะ <strong>"ตัวแทนรับฝากซื้อ (Courier/Messenger)”</strong> เท่านั้น 
                                เราเป็นผู้ให้บริการฝากซื้อสินค้าจากอเมริกา ไม่ได้ทำหน้าที่เป็นผู้จำหน่ายหรือจัดจำหน่ายสินค้าเอง
                            </p>
                            <div className="bg-slate-50 border-l-4 border-brand-gold p-4 text-sm text-slate-700">
                                <strong>หน้าที่ของเราคือ:</strong> รับคำสั่งซื้อจากท่าน {'→'} สั่งให้ทีมงานในสหรัฐอเมริกาไปซื้อสินค้าพิเศษจากร้านค้าที่ได้รับอนุญาต {'→'} ส่งหลักฐานการซื้อให้ท่าน {'→'} เก็บรักษาไว้อย่างปลอดภัย
                            </div>
                        </div>
                    </div>
                </section>

                <hr className="border-slate-100" />

                {/* 2. Ownership */}
                <section>
                    <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-brand-navy">
                            <FileSignature size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-3">2. กรรมสิทธิ์ในสินค้า (Product Ownership)</h2>
                            <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-slate-600">
                                <li><strong>สินค้าเป็นของท่าน 100%:</strong> ทันทีที่ทีมงานทำการซื้อสินค้า กรรมสิทธิ์ในสินค้านั้นจะตกเป็นของผู้สั่งซื้อทันที</li>
                                <li><strong>หลักฐานการเป็นเจ้าของ:</strong> ไฟล์ภาพหลักฐานที่มีชื่อ/รหัสอ้างอิงของท่าน ถือเป็นหลักฐานยืนยันกรรมสิทธิ์</li>
                                <li><strong>การเก็บรักษา:</strong> สินค้าจริงจะถูกเก็บไว้ในตู้นิรภัยของบริษัทในรัฐที่ทำการซื้อ จนกว่าจะมีการจัดส่ง</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <hr className="border-slate-100" />

                {/* 3. Claims & Taxes */}
                <section>
                    <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-brand-navy">
                            <Landmark size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-3">3. การจัดส่งและภาษี (Delivery & Taxes)</h2>
                            
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div className="border border-slate-200 rounded-lg p-4">
                                    <h3 className="font-bold text-slate-900 mb-2">สินค้ามูลค่าต่ำ</h3>
                                    <p className="text-sm text-slate-600">ทางเราจะจัดส่งสินค้าและโอนเงินเข้าบัญชี Truvamate ของท่านตามมูลค่าสินค้า</p>
                                </div>
                                <div className="border border-slate-200 rounded-lg p-4">
                                    <h3 className="font-bold text-slate-900 mb-2">สินค้ามูลค่าสูง</h3>
                                    <p className="text-sm text-slate-600">ท่านต้องติดต่อทีมงานโดยตรง หรือมอบอำนาจให้ตัวแทนจัดการ โดยต้องเสียภาษีตามกฎหมายสหรัฐฯ</p>
                                </div>
                            </div>

                            <p className="text-sm text-slate-500 mb-2">
                                * <strong>ภาษีสหรัฐฯ (Federal & State Tax):</strong> ผู้ซื้อสินค้าที่เป็นชาวต่างชาติ อาจถูกหักภาษีตามกฎหมายสรรพากรสหรัฐฯ (IRS) สำหรับการนำเข้าสินค้าบางชนิด
                            </p>
                        </div>
                    </div>
                </section>

                <hr className="border-slate-100" />

                 {/* 4. Jurisdiction */}
                 <section>
                    <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-brand-navy">
                            <ShieldCheck size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-3">4. เขตอำนาจศาลและกฎหมาย (Jurisdiction)</h2>
                            <p className="text-sm md:text-base text-slate-600 mb-3">
                                บริการนี้ถือเป็นการทำธุรกรรมในเขตอำนาจศาลของสหรัฐอเมริกา (จุดที่ทำการซื้อขายสินค้า) Truvamate ทำหน้าที่เป็นเพียงผู้ประสานงานเท่านั้น
                            </p>
                            <div className="flex gap-2 items-start bg-yellow-50 text-yellow-800 p-3 rounded-lg text-sm">
                                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                                <p>ผู้ใช้งานตกลงว่าการซื้อสินค้านี้เป็นไปเพื่อความสะดวกสบายส่วนบุคคล และรับทราบว่าบางสินค้าพิเศษอาจมีข้อจำกัดในบางประเทศ ผู้ใช้งานมีหน้าที่ตรวจสอบกฎหมายในประเทศที่ตนพำนักอยู่</p>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
            
            <div className="bg-slate-50 p-6 text-center border-t border-slate-200">
                <p className="text-sm text-slate-500 mb-4">
                    หากมีข้อสงสัยด้านกฎหมายเพิ่มเติม กรุณาติดต่อฝ่ายกฎหมายของเรา
                </p>
                <div className="flex justify-center gap-4">
                    <Link to="/contact">
                        <Button variant="outline">ติดต่อเรา</Button>
                    </Link>
                    <Link to="/special-products">
                        <Button>ยอมรับและใช้บริการต่อ</Button>
                    </Link>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
