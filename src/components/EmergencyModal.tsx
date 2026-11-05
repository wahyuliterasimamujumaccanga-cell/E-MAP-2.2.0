import React from 'react';
import { WA_KADER_NUMBER, WA_KADER_DISPLAY } from '../data/questionnaires';
import { X, Phone, HeartHandshake, ShieldAlert, MessageCircle, ExternalLink } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#e0eae4] relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-[#64756e] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#fff0f2] text-[#b42342] flex items-center justify-center shrink-0">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[#243b35]">
              Layanan Bantuan Krisis & Darurat
            </h3>
            <p className="text-xs text-[#64756e]">
              Anda tidak sendirian. Bantuan segera selalu tersedia.
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#4d6159] leading-relaxed mb-5">
          Jika Anda, keluarga, atau rekan terdekat mengalami krisis psikologis hebat, dorongan untuk mengakhiri hidup, atau serangan panik akut, mohon segera hubungi salah satu kontak di bawah ini:
        </p>

        <div className="space-y-3 mb-6">
          {/* Kader Keswa SHG Binanga */}
          <div className="p-4 rounded-2xl bg-[#eaf6ef] border border-[#b8d6c7] flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#176b58] tracking-wider block">
                Kader Pendamping Keswa Komunitas
              </span>
              <strong className="text-sm text-[#243b35]">SHG Binanga Sehat Jiwa</strong>
              <div className="text-xs text-[#176b58] font-bold mt-0.5">
                WhatsApp: {WA_KADER_DISPLAY}
              </div>
            </div>
            <a
              href={`https://wa.me/${WA_KADER_NUMBER}?text=Halo%20Kader%20Keswa%20SHG%20Binanga%20Sehat%20Jiwa%2C%20saya%20membutuhkan%20bantuan%20darurat.`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-[#25D366] text-white hover:bg-[#20b858] transition-colors shadow-xs"
              title="Chat WhatsApp Kader"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>

          {/* Hotline Kemenkes SEJIWA 119 */}
          <div className="p-4 rounded-2xl bg-[#f8fbf9] border border-[#e0eae4] flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#64756e] tracking-wider block">
                Hotline Kesehatan Jiwa Nasional Kemenkes RI
              </span>
              <strong className="text-sm text-[#243b35]">Layanan SEJIWA</strong>
              <div className="text-xs text-[#64756e] font-semibold mt-0.5">
                Telepon: 119 (Ekstensi 8) — Bebas Pulsa 24 Jam
              </div>
            </div>
            <a
              href="tel:119"
              className="p-2.5 rounded-xl bg-[#176b58] text-white hover:bg-[#104f42] transition-colors shadow-xs"
              title="Panggil 119"
            >
              <Phone className="w-5 h-5" />
            </a>
          </div>

          {/* IGD / Ambulans */}
          <div className="p-4 rounded-2xl bg-[#fff0f2] border border-[#f0c7d0] flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#b42342] tracking-wider block">
                Gawat Darurat Medis Langsung
              </span>
              <strong className="text-sm text-[#b42342]">Instalasi Gawat Darurat (IGD)</strong>
              <div className="text-xs text-[#8e1934] mt-0.5">
                Kunjungi RSUD atau Puskesmas Rawat Inap terdekat
              </div>
            </div>
            <a
              href="tel:112"
              className="p-2.5 rounded-xl bg-[#b42342] text-white hover:bg-[#921933] transition-colors shadow-xs"
              title="Panggil 112"
            >
              <Phone className="w-5 h-5" />
            </a>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-[#243b35] text-white font-extrabold text-xs hover:bg-[#162723] transition-all"
        >
          Tutup Jendela Ini
        </button>
      </div>
    </div>
  );
};
