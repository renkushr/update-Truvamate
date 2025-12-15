import React, { useEffect } from 'react';
import { FileText, ShieldAlert, Scale, AlertTriangle, Copyright, Gavel, BookOpen } from 'lucide-react';
import { SEO, SEOPresets } from '../components/SEO';

export const Terms: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO {...SEOPresets.terms} />
      <div className="bg-slate-50 min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-brand-navy p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(#FFD700 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-black text-brand-gold uppercase tracking-tight mb-4">
              ข้อกำหนดและเงื่อนไขการใช้งานเว็บไซต์
            </h1>
            <p className="text-slate-300 max-w-2xl mx-auto font-medium">
              Terms & Conditions
            </p>
            <p className="text-xs text-slate-400 mt-2">Last Updated: December 2025</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12 space-y-10 text-slate-700 leading-relaxed text-sm md:text-base">
          
          {/* Company Info */}
          <div className="bg-brand-gold/10 p-6 rounded-xl border-l-4 border-brand-gold">
            <p className="text-slate-900 font-bold mb-2">บริษัท Truvamate จำกัด ("บริษัทฯ")</p>
            <p className="text-slate-600 text-sm">
              เว็บไซต์นี้จัดทำและดูแลโดยบริษัทฯ เพื่อให้ข้อมูลเกี่ยวกับบริการจัดซื้อ การประสานงาน และการดำเนินการแทนในต่างประเทศตามที่ได้รับการว่าจ้างเป็นรายกรณี บริษัทฯ กระทำการภายในขอบเขตที่ชอบด้วยกฎหมาย ไม่ขัดต่อศีลธรรมอันดีของประชาชน
            </p>
            <p className="text-slate-600 text-sm mt-2">
              ผู้ใช้งานเว็บไซต์ ("ผู้ใช้บริการ") โปรดอ่านข้อกำหนดนี้โดยละเอียด <strong>การเข้าชมเว็บไซต์ถือว่าท่านยอมรับข้อกำหนดทั้งหมดนี้ทันที</strong>
            </p>
          </div>

          <hr className="border-slate-200" />

          {/* 1. Purpose */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="text-brand-navy" size={24} />
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">1. วัตถุประสงค์ของเว็บไซต์และบริการ</h2>
            </div>
            <ul className="list-decimal pl-6 space-y-2">
              <li>เว็บไซต์นี้ใช้เพื่อเผยแพร่ข้อมูลเกี่ยวกับบริการของบริษัทฯ เท่านั้น</li>
              <li>บริษัทฯ เป็นเพียงตัวแทนดำเนินการแทนผู้ว่าจ้างในต่างประเทศตามคำสั่ง <strong>ไม่ใช่ผู้ขายสินค้า</strong> <strong>ไม่ใช่ผู้นำเข้าสินค้าเพื่อจำหน่ายทั่วไป</strong> และ<strong>ไม่ใช่ผู้ประกอบธุรกิจอีคอมเมิร์ซ</strong></li>
              <li>บริษัทฯ ไม่ได้เสนอขาย ชักชวน หรือโฆษณาการขายสินค้าใดแก่บุคคลทั่วไปผ่านเว็บไซต์นี้</li>
            </ul>
          </section>

          <hr className="border-slate-100" />

          {/* 2. Scope */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Scale className="text-brand-navy" size={24} />
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">2. ขอบเขตการให้บริการ</h2>
            </div>
            <ul className="list-decimal pl-6 space-y-2">
              <li>บริษัทฯ ดำเนินการจัดซื้อสินค้าในต่างประเทศ <strong>"ในนามของผู้ว่าจ้าง"</strong> เท่านั้น</li>
              <li>ความสัมพันธ์ระหว่างบริษัทฯ และผู้ว่าจ้างเป็นลักษณะของการว่าจ้างทำของหรือทำบริการเท่านั้น</li>
              <li>บริษัทฯ ไม่ใช่คู่สัญญาซื้อขาย และไม่ใช่ผู้มีส่วนได้เสียในสินค้า</li>
              <li>บริษัทฯ ปฏิบัติตามข้อมูลและคำสั่งที่ได้รับจากผู้ว่าจ้างเท่านั้น ผู้ว่าจ้างเป็นผู้รับผิดชอบข้อมูลทั้งหมดที่มอบให้บริษัทฯ</li>
            </ul>
          </section>

          <hr className="border-slate-100" />

          {/* 3. Fees */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="text-brand-navy" size={24} />
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">3. ค่าบริการและค่าใช้จ่าย</h2>
            </div>
            <p className="mb-3 font-bold text-slate-900">3.1 ผู้ว่าจ้างยินยอมรับผิดชอบ:</p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li>ค่าบริการตามอัตราที่บริษัทฯ กำหนด</li>
              <li>ค่าธรรมเนียมทั้งในประเทศและต่างประเทศ</li>
              <li>ค่าภาษี ค่าใช้จ่ายศุลกากร ค่าขนส่ง และค่าใช้จ่ายอื่นที่เกิดขึ้น</li>
            </ul>
            <p className="mb-2">3.2 บริษัทฯ ไม่มีหน้าที่สำรองจ่ายค่าใช้จ่ายใด หากไม่มียอดชำระจากผู้ว่าจ้างมาก่อน</p>
            <p>3.3 ค่าใช้จ่ายทั้งหมดเป็นภาระของผู้ว่าจ้างเท่านั้น</p>
          </section>

          <hr className="border-slate-100" />

          {/* 4. Liability */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-brand-gold" size={24} />
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">4. ความรับผิดชอบและข้อจำกัดความรับผิด</h2>
            </div>
            <div className="space-y-3">
              <p>4.1 บริษัทฯ ไม่รับประกันคุณภาพสินค้า ราคาสินค้า ความถูกต้องของข้อมูลจากผู้ขายต่างประเทศ หรือกำหนดการจัดส่ง</p>
              <div>
                <p className="font-bold mb-2">4.2 บริษัทฯ ไม่รับผิดชอบกรณีความล่าช้า ความเสียหาย หรือค่าเสียโอกาสใด ๆ ที่เกิดจาก:</p>
                <ul className="list-disc pl-8 space-y-1">
                  <li>การขนส่ง</li>
                  <li>การตรวจปล่อยศุลกากร</li>
                  <li>ผู้ขายสินค้า</li>
                  <li>หน่วยงานของรัฐ</li>
                  <li>ปัจจัยภายนอกที่อยู่นอกเหนือการควบคุม</li>
                </ul>
              </div>
              <p>4.3 ความรับผิดใด ๆ ของบริษัทฯ (ถ้ามี) จำกัดเพียงจำนวนเงินค่าบริการที่ผู้ว่าจ้างชำระเท่านั้น</p>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* 5. Website Usage */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <ShieldAlert className="text-brand-navy" size={24} />
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">5. การใช้งานเว็บไซต์</h2>
            </div>
            <ul className="list-decimal pl-6 space-y-2">
              <li>ผู้ใช้งานต้องไม่กระทำการใด ๆ ที่ทำให้เกิดความเสียหายต่อเว็บไซต์ หรือสร้างความเข้าใจผิดแก่บุคคลอื่น</li>
              <li>ห้ามดัดแปลง คัดลอก เผยแพร่ หรือใช้ข้อมูลของบริษัทฯ โดยไม่ได้รับอนุญาต</li>
              <li>บริษัทฯ มีสิทธิระงับการใช้งานหรือดำเนินการทางกฎหมาย หากพบพฤติกรรมที่ผิดวัตถุประสงค์หรือผิดกฎหมาย</li>
            </ul>
          </section>

          <hr className="border-slate-100" />

          {/* 6. Amendment */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Gavel className="text-brand-navy" size={24} />
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">6. การแก้ไขข้อกำหนด</h2>
            </div>
            <p>
              บริษัทฯ มีสิทธิแก้ไข เปลี่ยนแปลง หรือเพิ่มเติมข้อกำหนดนี้ได้ทุกเมื่อ โดยไม่ต้องแจ้งให้ทราบล่วงหน้า และมีผลทันทีเมื่อเผยแพร่บนเว็บไซต์
            </p>
          </section>

          <hr className="border-slate-200 my-12" />

          {/* PDPA Section */}
          <div className="bg-slate-900 -mx-8 md:-mx-12 px-8 md:px-12 py-10">
            <h1 className="text-2xl md:text-3xl font-black text-brand-gold mb-3">นโยบายคุ้มครองข้อมูลส่วนบุคคล</h1>
            <p className="text-slate-300 text-sm">ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (Privacy Policy / PDPA)</p>
          </div>

          {/* 7. Data Collection */}
          <section className="mt-10">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="text-brand-navy" size={24} />
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">7. การเก็บรวบรวมข้อมูลส่วนบุคคล</h2>
            </div>
            <p className="mb-3">บริษัทฯ อาจเก็บข้อมูลดังต่อไปนี้:</p>
            <ul className="list-disc pl-8 space-y-1">
              <li>ข้อมูลที่ผู้ใช้กรอกบนเว็บไซต์ เช่น ชื่อ–นามสกุล เบอร์โทร อีเมล</li>
              <li>ข้อมูลการติดต่อหรือการว่าจ้าง</li>
              <li>ข้อมูลจำเป็นเพื่อดำเนินการในต่างประเทศตามคำสั่งผู้ว่าจ้าง</li>
              <li>ข้อมูล Technical (เช่น IP Address, Browser, Cookie)</li>
            </ul>
          </section>

          <hr className="border-slate-100" />

          {/* 8. Purpose */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Scale className="text-brand-navy" size={24} />
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">8. วัตถุประสงค์ในการใช้ข้อมูล</h2>
            </div>
            <p className="mb-3">บริษัทฯ จะใช้ข้อมูลเพื่อ:</p>
            <ul className="list-disc pl-8 space-y-1 mb-4">
              <li>ให้บริการตามที่ผู้ว่าจ้างร้องขอ</li>
              <li>ติดต่อประสานงาน</li>
              <li>ออกเอกสาร ใบแจ้งหนี้ ใบเสร็จ หรือการดำเนินการตามกฎหมาย</li>
              <li>ป้องกันการทุจริตหรือการใช้งานผิดวัตถุประสงค์</li>
              <li>ปรับปรุงคุณภาพเว็บไซต์และการให้บริการ</li>
            </ul>
            <div className="bg-yellow-50 p-4 rounded border-l-4 border-brand-gold">
              <p className="text-slate-900"><strong>บริษัทฯ ไม่ขาย ไม่แลกเปลี่ยน และไม่เผยแพร่ข้อมูลส่วนบุคคลให้บุคคลภายนอก</strong> เว้นแต่:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
                <li>เป็นไปตามคำสั่งของผู้ว่าจ้าง</li>
                <li>จำเป็นต่อการดำเนินการในต่างประเทศ</li>
                <li>ต้องปฏิบัติตามกฎหมาย หน่วยงานรัฐ หรือคำสั่งศาล</li>
              </ul>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* 9. Data Security */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <ShieldAlert className="text-brand-navy" size={24} />
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">9. การเก็บรักษาและความปลอดภัยของข้อมูล</h2>
            </div>
            <p className="mb-3">บริษัทฯ ใช้มาตรการที่เหมาะสมเพื่อปกป้องข้อมูล เช่น:</p>
            <ul className="list-disc pl-8 space-y-1 mb-3">
              <li>ระบบรักษาความปลอดภัยข้อมูล</li>
              <li>การจำกัดสิทธิ์เข้าถึง</li>
              <li>การเก็บรักษาเท่าที่จำเป็นตามกฎหมาย</li>
            </ul>
            <p className="text-slate-600">ข้อมูลจะถูกลบหรือทำลายเมื่อหมดความจำเป็นในการใช้</p>
          </section>

          <hr className="border-slate-100" />

          {/* 10. Data Subject Rights */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Copyright className="text-brand-navy" size={24} />
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">10. สิทธิของเจ้าของข้อมูล (Data Subject Rights)</h2>
            </div>
            <p className="mb-3">ผู้ใช้บริการมีสิทธิตามกฎหมาย เช่น:</p>
            <ul className="list-disc pl-8 space-y-1 mb-3">
              <li>ขอเข้าถึงข้อมูลส่วนบุคคล</li>
              <li>ขอคัดลอกข้อมูล</li>
              <li>ขอแก้ไขข้อมูล</li>
              <li>ขอให้ลบหรือทำลายข้อมูล</li>
              <li>ขอระงับการใช้ข้อมูล</li>
              <li>ถอนความยินยอม (ในกรณีที่ให้ความยินยอมไว้)</li>
            </ul>
            <p className="text-slate-600">บริษัทฯ จะดำเนินการตามสิทธิภายในระยะเวลาที่กฎหมายกำหนด</p>
          </section>

          <hr className="border-slate-100" />

          {/* 11. Data Transfer */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-brand-gold" size={24} />
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">11. การโอนข้อมูลไปต่างประเทศ</h2>
            </div>
            <p>
              หากจำเป็นต้องส่งข้อมูลให้ผู้ขายหรือหน่วยงานในต่างประเทศ บริษัทฯ จะทำเพื่อวัตถุประสงค์ของการให้บริการเท่านั้น โดยอยู่ภายใต้หลักเกณฑ์ของ PDPA
            </p>
          </section>

          <hr className="border-slate-100" />

          {/* 12. Contact */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="text-brand-navy" size={24} />
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">12. ช่องทางการติดต่อ</h2>
            </div>
            <p className="mb-3">ผู้ใช้บริการสามารถติดต่อบริษัทฯ เรื่อง PDPA ได้ที่:</p>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-1 text-sm">
              <p><strong>ชื่อบริษัท:</strong> Truvamate จำกัด</p>
              <p><strong>อีเมลติดต่อ:</strong> support@truvamate.com</p>
              <p><strong>ที่อยู่สำนักงาน:</strong> [ที่อยู่บริษัท]</p>
              <p><strong>โทรศัพท์:</strong> [เบอร์โทรศัพท์]</p>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* 13. Acceptance */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Gavel className="text-brand-navy" size={24} />
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">13. การยอมรับข้อกำหนด</h2>
            </div>
            <div className="bg-brand-gold/10 p-6 rounded-xl border-l-4 border-brand-gold">
              <p className="font-bold text-slate-900 mb-3">การกด "ยอมรับ" หรือ "เข้าชมเว็บไซต์ต่อ" ถือว่าท่าน:</p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li>อ่านและเข้าใจข้อกำหนดและเงื่อนไขทั้งหมด</li>
                <li>ยินยอมให้นำข้อมูลไปใช้ตามนโยบาย PDPA นี้ทุกประการ</li>
              </ul>
            </div>
          </section>

          <div className="bg-slate-100 p-6 rounded-xl text-center mt-12">
            <h3 className="font-bold text-slate-900 mb-2">มีคำถามเพิ่มเติมเกี่ยวกับข้อกำหนดหรือนโยบายความเป็นส่วนตัว?</h3>
            <p className="text-slate-600 mb-4 text-sm">ทีมกฎหมายของเรายินดีให้คำปรึกษาและชี้แจงข้อสงสัย</p>
            <button className="text-brand-navy font-bold hover:underline">ติดต่อฝ่ายกฎหมาย</button>
          </div>

        </div>
      </div>
      </div>
    </>
  );
};
