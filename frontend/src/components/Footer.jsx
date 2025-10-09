import React from 'react';
import { Facebook, Instagram, Mail, Phone, FileText } from 'lucide-react';

function Footer() {
  return (
    <footer className="footer bg-neutral text-neutral-content p-10 flex flex-col sm:flex-row justify-around items-start kanit-medium">
      {/* เกี่ยวกับเว็บไซต์ */}
      <nav className="mb-6 sm:mb-0">
        <h6 className="footer-title text-lg font-semibold">เกี่ยวกับเว็บไซต์</h6>
        <p className="text-sm leading-relaxed">
          เว็บไซต์ระบบซื้อบัตรคอนเสิร์ตออนไลน์<br />
          เพื่ออำนวยความสะดวกให้ผู้ใช้สามารถเลือกคอนเสิร์ต จองที่นั่ง
          และชำระเงินได้อย่างรวดเร็วและปลอดภัย
        </p>
      </nav>

      {/* เมนูหลัก */}
      <nav className="mb-6 sm:mb-0">
        <h6 className="footer-title text-lg font-semibold">เมนูหลัก</h6>
        <a className="link link-hover">หน้าแรก</a>
        <a className="link link-hover">ตั๋วของฉัน</a>
        <a className="link link-hover">ข้อมูลส่วนตัว</a>
      </nav>

      {/* ติดต่อเรา */}
      <nav className="mb-6 sm:mb-0">
        <h6 className="footer-title text-lg font-semibold">ติดต่อเรา</h6>
        <div className="flex items-center gap-2">
          <Phone size={16} /> <span>088-888-8888</span>
        </div>
        <div className="flex items-center gap-2">
          <Mail size={16} /> <span>concertbook@ku.ac.th</span>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Facebook size={16} /> <span>ConcertTicketKU</span>
        </div>
        <div className="flex items-center gap-2">
          <Instagram size={16} /> <span>@concertticket_ku</span>
        </div>
      </nav>

      {/* แบบประเมินเว็บไซต์ */}
      <nav>
        <h6 className="footer-title text-lg font-semibold">แบบประเมินเว็บไซต์</h6>
        <p className="text-sm mb-2">
          โปรดช่วยประเมินความพึงพอใจในการใช้งานเว็บไซต์ของเรา
        </p>
        <a
          href="https://forms.gle/LmM7iDNs5gnJx4hx8"
          target="_blank"
          rel="noopener noreferrer"
          className=" mt-2 flex items-center gap-2"
        >
          <FileText size={16} />
          ทำแบบประเมิน
        </a>
      </nav>
    </footer>
  );
}

export default Footer;
