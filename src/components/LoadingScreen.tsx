import React, { useState, useEffect } from 'react';
import {
  ClipboardCheck,
  Brain,
  FileCheck2,
  MessageCircle,
  ShieldCheck,
  Youtube,
  CheckCircle2,
  Loader2,
  Sparkles,
} from 'lucide-react';

interface LoadingScreenProps {
  onFinish: () => void;
}

interface FeatureLoadingStep {
  id: string;
  label: string;
  detail: string;
  icon: React.ElementType;
}

const FEATURE_STEPS: FeatureLoadingStep[] = [
  {
    id: 'phq9',
    label: 'Penapisan Mandiri PHQ-9',
    detail: 'Memuat 9 instrumen klinis depresi & deteksi peringatan Q9...',
    icon: ClipboardCheck,
  },
  {
    id: 'gad7',
    label: 'Penapisan Kecemasan GAD-7',
    detail: 'Menyiapkan 7 butir kecemasan umum & panduan PFA...',
    icon: Brain,
  },
  {
    id: 'pdf',
    label: 'Engine Ekspor PDF Resmi',
    detail: 'Menginisialisasi layout cetak medis, tabel klinis & margin rapi...',
    icon: FileCheck2,
  },
  {
    id: 'wa',
    label: 'Integrasi Kader Keswa',
    detail: 'Menghubungkan jalur konsultasi WhatsApp SHG Binanga Sehat Jiwa...',
    icon: MessageCircle,
  },
  {
    id: 'security',
    label: 'Sistem Keamanan & Privasi',
    detail: 'Mengaktifkan penyimpanan lokal 100% tanpa kirim data ke server luar...',
    icon: ShieldCheck,
  },
  {
    id: 'media',
    label: 'Podcast & Video Edukasi',
    detail: 'Menyinkronkan materi edukasi kesehatan jiwa inklusif...',
    icon: Youtube,
  },
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinish }) => {
  const [completedSteps, setCompletedSteps] = useState<number>(0);
  const [progress, setProgress] = useState<number>(10);
  const [isDone, setIsDone] = useState<boolean>(false);

  useEffect(() => {
    // Pace feature loading calmly so the user can comfortably read each feature
    const intervalTime = 850; // ms per step (total ~5.2 seconds for 6 features)
    const timer = setInterval(() => {
      setCompletedSteps((prev) => {
        const next = prev + 1;
        const newPercent = Math.min(100, Math.round((next / FEATURE_STEPS.length) * 100));
        setProgress(newPercent);

        if (next >= FEATURE_STEPS.length) {
          clearInterval(timer);
          // Allow user to comfortably view the 100% completed state
          setTimeout(() => {
            setIsDone(true);
            setTimeout(() => {
              onFinish();
            }, 500); // smooth fade out transition
          }, 850);
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#f3f8f5] flex items-center justify-center p-4 transition-opacity duration-400 overflow-y-auto ${
        isDone ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-7 border border-[#e0eae4] shadow-xl text-center my-6">
        {/* Brand Logo with pulse animation */}
        <div className="relative w-20 h-20 mx-auto rounded-2xl overflow-hidden border-2 border-[#b8d6c7] bg-[#eaf6ef] flex items-center justify-center shadow-md mb-3 animate-pulse">
          <img
            src="https://lh3.googleusercontent.com/d/1xY_kG3r90xhrlROj9puizqYV_R40lYH6"
            alt="Logo E-MAP"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://drive.google.com/thumbnail?id=1xY_kG3r90xhrlROj9puizqYV_R40lYH6&sz=w200';
            }}
          />
        </div>

        {/* Title & Version Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eaf6ef] text-[#176b58] text-[10px] font-extrabold tracking-widest uppercase border border-[#b8d6c7] mb-2">
          <Sparkles className="w-3 h-3" />
          <span>E-MAP • Versi 2.2.0</span>
        </div>

        <h2 className="text-xl font-extrabold text-[#243b35] leading-tight">
          Memuat Sistem E-MAP
        </h2>
        <p className="text-xs text-[#64756e] mt-1 mb-5">
          SHG Binanga Sehat Jiwa • Dignity INKLUSI Sulbar
        </p>

        {/* Progress bar */}
        <div className="space-y-1.5 mb-6 text-left">
          <div className="flex items-center justify-between text-xs font-bold text-[#176b58]">
            <span>
              {progress === 100
                ? 'Semua modul & instrumen siap digunakan!'
                : 'Memeriksa & menyiapkan kelengkapan fitur...'}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-[#e8f0eb] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#176b58] to-[#218069] transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Feature Processing Checklist */}
        <div className="space-y-2.5 text-left mb-5">
          {FEATURE_STEPS.map((step, idx) => {
            const isCompleted = idx < completedSteps;
            const isCurrent = idx === completedSteps;
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className={`p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                  isCompleted
                    ? 'bg-[#f4fbf7] border-[#b8d6c7]'
                    : isCurrent
                    ? 'bg-white border-[#176b58] shadow-xs'
                    : 'bg-[#fafcfb] border-[#e8f0eb] opacity-60'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isCompleted
                      ? 'bg-[#176b58] text-white'
                      : isCurrent
                      ? 'bg-[#eaf6ef] text-[#176b58]'
                      : 'bg-[#e8f0eb] text-[#8ea49b]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-xs font-bold truncate ${
                        isCompleted
                          ? 'text-[#176b58]'
                          : isCurrent
                          ? 'text-[#243b35]'
                          : 'text-[#64756e]'
                      }`}
                    >
                      {step.label}
                    </span>
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[#176b58] shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#176b58]" />
                        <span>Siap</span>
                      </span>
                    ) : isCurrent ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#176b58] shrink-0">
                        <Loader2 className="w-3 h-3 animate-spin text-[#176b58]" />
                        <span>Memuat</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#94a39b] font-medium shrink-0">
                        Menunggu
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#64756e] truncate mt-0.5">
                    {step.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Video / Mini Preview Box */}
        <div className="p-3 rounded-2xl bg-[#f8fbf9] border border-[#e0eae4] text-left text-xs mb-4">
          <div className="flex items-center gap-2 text-[#176b58] font-bold text-[11px] mb-1.5">
            <Youtube className="w-4 h-4 text-red-600" />
            <span>Podcast & Media Edukasi Terhubung</span>
          </div>
          <p className="text-[11px] text-[#64756e] leading-snug">
            Seri edukasi pemulihan jiwa berbasis komunitas oleh kader SHG Binanga Sehat Jiwa telah siap diakses.
          </p>
        </div>

        {/* Skip button for user convenience */}
        <button
          onClick={onFinish}
          className="w-full py-2.5 px-4 rounded-xl border border-[#cfddd5] hover:bg-[#f8fbf9] text-[#64756e] font-bold text-xs transition-colors"
        >
          Lewati & Masuk Langsung ke Aplikasi
        </button>
      </div>
    </div>
  );
};
