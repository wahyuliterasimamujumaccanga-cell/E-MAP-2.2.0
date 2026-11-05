import React from 'react';
import { TabType } from '../types';
import { Home, ClipboardCheck, Brain, History, HeartHandshake, PhoneCall } from 'lucide-react';
import { WA_KADER_NUMBER } from '../data/questionnaires';

interface NavbarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  historyCount: number;
  onOpenEmergency: () => void;
  onShowLoadingScreen?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  historyCount,
  onOpenEmergency,
  onShowLoadingScreen,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#e0eae4] shadow-xs">
      <div className="max-w-4xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <button
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-3 text-left group focus:outline-hidden"
        >
          <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-[#b8d6c7] bg-[#eaf6ef] flex items-center justify-center shadow-xs shrink-0">
            <img
              src="https://lh3.googleusercontent.com/d/1xY_kG3r90xhrlROj9puizqYV_R40lYH6"
              alt="Logo E-MAP"
              className="w-full h-full object-cover"
              onError={(e) => {
                // fallback if google drive thumbnail fails
                (e.currentTarget as HTMLImageElement).src =
                  'https://drive.google.com/thumbnail?id=1xY_kG3r90xhrlROj9puizqYV_R40lYH6&sz=w200';
              }}
            />
          </div>
          <div>
            <div className="font-extrabold text-[#176b58] text-base tracking-tight leading-tight flex items-center gap-1.5">
              <span>E-MAP</span>
              <span
                onClick={(e) => {
                  if (onShowLoadingScreen) {
                    e.stopPropagation();
                    onShowLoadingScreen();
                  }
                }}
                title="Klik untuk melihat status pemuatan sistem"
                className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-[#eaf6ef] text-[#176b58] border border-[#b8d6c7] hover:bg-[#d5eedf] transition-colors cursor-pointer"
              >
                v2.2
              </span>
            </div>
            <p className="text-[10px] font-bold text-[#64756e] tracking-wider uppercase leading-none mt-0.5">
              SHG BINANGA SEHAT JIWA
            </p>
          </div>
        </button>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-[#eef4f0] p-1 rounded-xl">
          <button
            onClick={() => onSelectTab('home')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentTab === 'home'
                ? 'bg-white text-[#176b58] shadow-xs'
                : 'text-[#64756e] hover:text-[#243b35]'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => onSelectTab('phq9')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentTab === 'phq9'
                ? 'bg-[#176b58] text-white shadow-xs'
                : 'text-[#64756e] hover:text-[#176b58]'
            }`}
          >
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>PHQ-9</span>
          </button>

          <button
            onClick={() => onSelectTab('gad7')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentTab === 'gad7'
                ? 'bg-[#165b6e] text-white shadow-xs'
                : 'text-[#64756e] hover:text-[#165b6e]'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>GAD-7</span>
          </button>

          <button
            onClick={() => onSelectTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 relative ${
              currentTab === 'history'
                ? 'bg-white text-[#176b58] shadow-xs'
                : 'text-[#64756e] hover:text-[#243b35]'
            }`}
            title="Riwayat Skrining"
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Riwayat</span>
            {historyCount > 0 && (
              <span className="bg-[#176b58] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {historyCount}
              </span>
            )}
          </button>
        </nav>

        {/* Quick Emergency / WhatsApp Kader */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenEmergency}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#b42342] bg-[#fff0f2] hover:bg-[#ffe2e6] border border-[#f0c7d0] transition-colors"
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Bantuan Krisis</span>
          </button>

          <a
            href={`https://wa.me/${WA_KADER_NUMBER}?text=Halo%20Kader%20Keswa%20SHG%20Binanga%20Sehat%20Jiwa%2C%20saya%20ingin%20berkonsultasi.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#176b58] bg-[#eaf6ef] hover:bg-[#d8eedf] border border-[#b8d6c7] transition-colors"
            title="Hubungi Kader via WhatsApp"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Kader Keswa</span>
          </a>
        </div>
      </div>
    </header>
  );
};
