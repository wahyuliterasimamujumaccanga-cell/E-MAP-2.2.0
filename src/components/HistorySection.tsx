import React from 'react';
import { ScreeningResult } from '../types';
import { generateScreeningPDF } from '../utils/pdfGenerator';
import {
  FileText,
  Download,
  Trash2,
  Calendar,
  User,
  ArrowRight,
  ClipboardCheck,
  Brain,
  ShieldCheck,
} from 'lucide-react';

interface HistorySectionProps {
  history: ScreeningResult[];
  onSelectResult: (result: ScreeningResult) => void;
  onClearHistory: () => void;
  onStartPHQ9: () => void;
  onStartGAD7: () => void;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  history,
  onSelectResult,
  onClearHistory,
  onStartPHQ9,
  onStartGAD7,
}) => {
  if (history.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#e0eae4] shadow-xs text-center max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-[#eaf6ef] text-[#176b58] mx-auto flex items-center justify-center mb-4">
          <FileText className="w-8 h-8" />
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#243b35] mb-2">
          Belum Ada Riwayat Skrining
        </h2>
        <p className="text-xs sm:text-sm text-[#64756e] mb-6 leading-relaxed">
          Hasil penapisan mandiri yang Anda lakukan di perangkat ini akan otomatis tersimpan di sini secara aman untuk memantau perkembangan kesehatan emosional Anda dari waktu ke waktu.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={onStartPHQ9}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#176b58] text-white font-extrabold text-xs shadow-md hover:bg-[#104f42] transition-all"
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>Mulai PHQ-9 (Depresi)</span>
          </button>
          <button
            onClick={onStartGAD7}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#165b6e] text-white font-extrabold text-xs shadow-md hover:bg-[#0f4250] transition-all"
          >
            <Brain className="w-4 h-4" />
            <span>Mulai GAD-7 (Kecemasan)</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e0eae4] shadow-xs space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e0eae4] pb-4">
        <div>
          <div className="text-[11px] font-extrabold tracking-wider uppercase text-[#176b58] mb-1">
            Pemantauan Mandiri (Watchful Waiting)
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#243b35]">
            Riwayat Skrining Tersimpan ({history.length})
          </h2>
        </div>

        <button
          onClick={() => {
            if (confirm('Apakah Anda yakin ingin menghapus seluruh riwayat skrining dari perangkat ini?')) {
              onClearHistory();
            }
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Hapus Semua Riwayat</span>
        </button>
      </div>

      <div className="p-3.5 rounded-xl bg-[#eaf6ef] border border-[#b8d6c7] text-[#176b58] text-xs flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 shrink-0" />
        <span>
          Data tersimpan secara privat di peramban lokal perangkat Anda dan tidak dibagikan ke server publik.
        </span>
      </div>

      <div className="space-y-3">
        {history.map((item) => {
          const isPHQ = item.type === 'phq9';
          return (
            <div
              key={item.id}
              className="p-4 sm:p-5 rounded-2xl border border-[#e0eae4] bg-[#fafcfb] hover:border-[#b8d6c7] hover:bg-white transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md ${
                      isPHQ
                        ? 'bg-[#eaf6ef] text-[#176b58] border border-[#b8d6c7]'
                        : 'bg-[#e6f3f7] text-[#165b6e] border border-[#bce0ea]'
                    }`}
                  >
                    {isPHQ ? 'PHQ-9 (Depresi)' : 'GAD-7 (Kecemasan)'}
                  </span>
                  <span className="text-xs font-bold text-[#243b35]">{item.category}</span>
                  {item.criticalAlert?.flagged && (
                    <span className="text-[10px] font-extrabold bg-[#fff0f2] text-[#b42342] px-2 py-0.5 rounded-md border border-[#f0c7d0]">
                      ⚠ Peringatan
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-[#64756e] pt-1">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[#176b58]" />
                    <strong className="text-[#243b35]">{item.respondent.name}</strong> ({item.respondent.age} th)
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#176b58]" />
                    {item.dateFullWita}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[#e0eae4]">
                <div className="text-right mr-2 hidden sm:block">
                  <div className="text-lg font-extrabold text-[#176b58]">
                    {item.totalScore} / {item.maxScore}
                  </div>
                  <div className="text-[10px] text-[#64756e] font-semibold">Skor Total</div>
                </div>

                <button
                  onClick={() => generateScreeningPDF(item)}
                  title="Unduh PDF Resmi"
                  className="p-2.5 rounded-xl border border-[#cfddd5] hover:bg-[#eaf6ef] hover:border-[#176b58] text-[#176b58] transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onSelectResult(item)}
                  className="px-3 py-2 rounded-xl bg-[#176b58] hover:bg-[#104f42] text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <span>Buka Hasil</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
