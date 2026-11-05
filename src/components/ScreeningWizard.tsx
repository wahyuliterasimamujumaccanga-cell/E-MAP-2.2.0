import React, { useState } from 'react';
import {
  RespondentInfo,
  GenderType,
} from '../types';
import {
  COMMON_OPTIONS,
  PHQ9_QUESTIONS,
  GAD7_QUESTIONS,
} from '../data/questionnaires';
import {
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  User,
  HeartHandshake,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface ScreeningWizardProps {
  type: 'phq9' | 'gad7';
  onComplete: (respondent: RespondentInfo, answers: number[]) => void;
  onCancel: () => void;
}

export const ScreeningWizard: React.FC<ScreeningWizardProps> = ({
  type,
  onComplete,
  onCancel,
}) => {
  const isPHQ9 = type === 'phq9';
  const questions = isPHQ9 ? PHQ9_QUESTIONS : GAD7_QUESTIONS;
  const totalQuestions = questions.length;

  // Wizard state: 'intro' | 'identity' | 'questionnaire'
  const [step, setStep] = useState<'intro' | 'identity' | 'questionnaire'>('intro');

  // Respondent Form State
  const [respondent, setRespondent] = useState<RespondentInfo>({
    name: '',
    gender: '',
    age: '',
    notes: '',
  });

  // Questionnaire Answers State
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(totalQuestions).fill(null)
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Theme configuration
  const theme = isPHQ9
    ? {
        primary: 'bg-[#176b58]',
        primaryHover: 'hover:bg-[#104f42]',
        primaryText: 'text-[#176b58]',
        borderActive: 'border-[#176b58]',
        bgLight: 'bg-[#eaf6ef]',
        accent: '#176b58',
        tag: 'PHQ-9 • Penapisan Depresi',
      }
    : {
        primary: 'bg-[#165b6e]',
        primaryHover: 'hover:bg-[#0f4250]',
        primaryText: 'text-[#165b6e]',
        borderActive: 'border-[#165b6e]',
        bgLight: 'bg-[#e6f3f7]',
        accent: '#165b6e',
        tag: 'GAD-7 • Penapisan Kecemasan',
      };

  // Handlers
  const handleIdentitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!respondent.name.trim()) {
      setValidationError('Silakan masukkan nama Anda.');
      return;
    }
    if (!respondent.gender) {
      setValidationError('Silakan pilih jenis kelamin.');
      return;
    }
    const ageNum = parseInt(respondent.age, 10);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      setValidationError('Silakan masukkan usia yang valid (1-120 tahun).');
      return;
    }

    setValidationError(null);
    setStep('questionnaire');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectOption = (score: number) => {
    setValidationError(null);
    const newAnswers = [...answers];
    newAnswers[currentIndex] = score;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (answers[currentIndex] === null) {
      setValidationError('Silakan pilih salah satu opsi jawaban sebelum melanjutkan.');
      return;
    }

    setValidationError(null);

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Completed!
      const finalAnswers = answers.map((a) => (a === null ? 0 : a));
      onComplete(respondent, finalAnswers);
    }
  };

  const handlePrevQuestion = () => {
    setValidationError(null);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 1. SUB-VIEW: INTRO / EXPLANATION
  if (step === 'intro') {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e0eae4] shadow-xs">
        <div className="flex items-center justify-between gap-3 mb-2">
          <span
            className={`text-[11px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full ${theme.bgLight} ${theme.primaryText}`}
          >
            {theme.tag}
          </span>
          <span className="text-xs text-[#64756e] font-semibold">
            {isPHQ9 ? '9 Pertanyaan' : '7 Pertanyaan'}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#243b35] mb-3">
          {isPHQ9
            ? 'Penjelasan Kuesioner PHQ-9 (Depresi)'
            : 'Penjelasan Kuesioner GAD-7 (Kecemasan)'}
        </h1>

        <p className="text-xs sm:text-sm text-[#4d6159] leading-relaxed mb-4">
          {isPHQ9 ? (
            <>
              <strong>PHQ-9 (Patient Health Questionnaire-9)</strong> adalah instrumen standar klinis tervalidasi secara internasional yang digunakan oleh dokter, psikolog, dan puskesmas untuk mengukur ada atau tidaknya serta tingkat keparahan gejala depresi selama <strong>2 minggu terakhir</strong>.
            </>
          ) : (
            <>
              <strong>GAD-7 (Generalized Anxiety Disorder 7-item)</strong> adalah instrumen standar klinis untuk mengukur tingkat keparahan kecemasan umum, kegelisahan batin, dan kekhawatiran yang berlebihan dalam kurun waktu <strong>2 minggu terakhir</strong>.
            </>
          )}
        </p>

        {/* Instructions */}
        <div className="bg-[#f8fbf9] p-5 rounded-2xl border border-[#e0eae4] space-y-3 mb-5">
          <h3 className="text-xs sm:text-sm font-extrabold text-[#243b35] flex items-center gap-2">
            <HelpCircle className={`w-4 h-4 ${theme.primaryText}`} />
            <span>Petunjuk Pengisian:</span>
          </h3>
          <ul className="text-xs text-[#556961] space-y-2 list-disc pl-5">
            <li>Bacalah setiap pertanyaan secara perlahan dan tenang.</li>
            <li>
              Pilih opsi yang paling menggambarkan kondisi atau perasaan Anda selama <strong>2 minggu terakhir</strong>.
            </li>
            <li>
              Jawablah sejujur mungkin. Tidak ada jawaban yang benar atau salah, dan tidak ada hal yang perlu dipermalukan.
            </li>
            <li>Hasil penapisan ini dapat diunduh dalam bentuk <strong>PDF resmi</strong> atau langsung didiskusikan via WhatsApp bersama kader kesehatan jiwa.</li>
          </ul>
        </div>

        {/* Privacy Note */}
        <div className="p-4 rounded-2xl bg-[#eaf6ef] border border-[#b8d6c7] text-[#176b58] text-xs flex items-start gap-3 mb-6">
          <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="leading-relaxed m-0">
            <strong>Privasi & Keamanan:</strong> Seluruh data identitas dan jawaban Anda diproses 100% secara lokal pada browser perangkat Anda. Tidak ada data yang dikirim atau disimpan ke server publik tanpa izin Anda.
          </p>
        </div>

        {/* Critical Safety Notice for PHQ-9 */}
        {isPHQ9 && (
          <div className="p-4 rounded-2xl bg-[#fff0f2] border border-[#f0c7d0] text-[#b42342] text-xs flex items-start gap-3 mb-6">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="leading-relaxed m-0">
              <strong>Peringatan Keselamatan:</strong> Pertanyaan nomor 9 berkaitan dengan pikiran untuk mengakhiri hidup atau melukai diri sendiri. Jika Anda atau orang terdekat saat ini sedang berada dalam kondisi bahaya langsung, segera hubungi layanan darurat medis (119 ext 8) atau dampingi ke IGD terdekat.
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setStep('identity')}
            className={`flex-1 py-3.5 px-6 rounded-xl text-white font-extrabold text-sm flex items-center justify-center gap-2 ${theme.primary} ${theme.primaryHover} shadow-md transition-all active:scale-98`}
          >
            <span>Mulai Mengisi Identitas & Kuesioner</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onCancel}
            className="py-3 px-5 rounded-xl border border-[#cfddd5] text-[#64756e] font-bold text-xs hover:bg-[#f8fbf9] transition-all"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  // 2. SUB-VIEW: RESPONDENT IDENTITY FORM
  if (step === 'identity') {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e0eae4] shadow-xs">
        <button
          onClick={() => setStep('intro')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#64756e] hover:text-[#243b35] mb-5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Penjelasan {isPHQ9 ? 'PHQ-9' : 'GAD-7'}</span>
        </button>

        <div className="text-[11px] font-extrabold tracking-wider uppercase text-[#176b58] mb-1">
          Langkah 1 dari 2
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#243b35] mb-2">
          Identitas Responden
        </h2>
        <p className="text-xs text-[#64756e] mb-6">
          Identitas ini akan dicantumkan pada lembar ringkasan hasil PDF resmi untuk mempermudah kader dan tenaga medis dalam memberikan pendampingan yang tepat.
        </p>

        {validationError && (
          <div className="mb-5 p-3.5 rounded-xl bg-[#fff0f2] border border-[#f0c7d0] text-[#b42342] text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        <form onSubmit={handleIdentitySubmit} className="space-y-5">
          {/* Nama Lengkap / Panggilan */}
          <div>
            <label className="block text-xs font-extrabold text-[#243b35] mb-1.5">
              Nama Lengkap / Nama Panggilan <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                maxLength={100}
                placeholder="Contoh: Rahmat / Siti"
                value={respondent.name}
                onChange={(e) => setRespondent({ ...respondent, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#cfddd5] focus:outline-hidden focus:border-[#176b58] focus:ring-2 focus:ring-[#176b58]/20 text-sm text-[#243b35]"
              />
              <User className="w-4 h-4 text-[#94a39b] absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* Jenis Kelamin */}
          <div>
            <label className="block text-xs font-extrabold text-[#243b35] mb-1.5">
              Jenis Kelamin <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['Laki-laki', 'Perempuan'] as GenderType[]).map((genderVal) => {
                const isSelected = respondent.gender === genderVal;
                return (
                  <button
                    type="button"
                    key={genderVal}
                    onClick={() => setRespondent({ ...respondent, gender: genderVal })}
                    className={`py-3 px-4 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                      isSelected
                        ? `${theme.bgLight} ${theme.borderActive} ${theme.primaryText} shadow-xs`
                        : 'border-[#cfddd5] bg-white text-[#556961] hover:bg-[#f8fbf9]'
                    }`}
                  >
                    <span>{genderVal}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Usia */}
          <div>
            <label className="block text-xs font-extrabold text-[#243b35] mb-1.5">
              Usia (Tahun) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              max={120}
              required
              placeholder="Contoh: 28"
              value={respondent.age}
              onChange={(e) => setRespondent({ ...respondent, age: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#cfddd5] focus:outline-hidden focus:border-[#176b58] focus:ring-2 focus:ring-[#176b58]/20 text-sm text-[#243b35]"
            />
          </div>

          {/* Catatan Tambahan (Opsional) */}
          <div>
            <label className="block text-xs font-extrabold text-[#243b35] mb-1.5">
              Keluhan Utama / Catatan Tambahan <span className="text-[#64756e] font-normal">(Opsional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="Ceritakan singkat hal yang paling membuat Anda tertekan atau cemas..."
              value={respondent.notes || ''}
              onChange={(e) => setRespondent({ ...respondent, notes: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#cfddd5] focus:outline-hidden focus:border-[#176b58] focus:ring-2 focus:ring-[#176b58]/20 text-xs sm:text-sm text-[#243b35]"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3.5 px-6 rounded-xl text-white font-extrabold text-sm flex items-center justify-center gap-2 ${theme.primary} ${theme.primaryHover} shadow-md transition-all active:scale-98 mt-6`}
          >
            <span>Lanjut ke Pertanyaan {isPHQ9 ? 'PHQ-9' : 'GAD-7'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    );
  }

  // 3. SUB-VIEW: QUESTIONNAIRE (Pertanyaan X dari Y)
  const currentQuestionText = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);
  const currentSelectedScore = answers[currentIndex];
  const isLastQuestion = currentIndex === totalQuestions - 1;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e0eae4] shadow-xs">
      {/* Top Navigation & Info */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <button
          onClick={() => setStep('identity')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#64756e] hover:text-[#243b35]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Ubah Identitas</span>
        </button>

        <span className="text-xs font-bold text-[#64756e]">
          Responden: <strong className="text-[#243b35]">{respondent.name}</strong> ({respondent.age} th)
        </span>
      </div>

      {/* Progress Track */}
      <div className="space-y-1.5 mb-6">
        <div className="flex items-center justify-between text-xs font-extrabold">
          <span className={theme.primaryText}>
            Pertanyaan {currentIndex + 1} dari {totalQuestions}
          </span>
          <span className="text-[#64756e]">{progressPercent}%</span>
        </div>
        <div className="w-full h-2.5 bg-[#e8f0eb] rounded-full overflow-hidden">
          <div
            className={`h-full ${theme.primary} transition-all duration-300 rounded-full`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[#f8fbf9] border border-[#e0eae4] mb-6">
        <div className="text-[11px] font-extrabold tracking-widest uppercase text-[#64756e] mb-2 flex items-center gap-1.5">
          <Sparkles className={`w-3.5 h-3.5 ${theme.primaryText}`} />
          <span>Dalam 2 minggu terakhir, seberapa sering Anda terganggu oleh:</span>
        </div>

        <h3 className="text-lg sm:text-xl font-extrabold text-[#243b35] leading-relaxed mb-6">
          {currentIndex + 1}. {currentQuestionText}
        </h3>

        {/* Options */}
        <div className="space-y-2.5">
          {COMMON_OPTIONS.map((opt) => {
            const isSelected = currentSelectedScore === opt.score;
            return (
              <button
                key={opt.score}
                type="button"
                onClick={() => handleSelectOption(opt.score)}
                className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-semibold transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? `${theme.bgLight} ${theme.borderActive} shadow-xs font-bold`
                    : 'bg-white border-[#e0eae4] text-[#3e524b] hover:bg-[#f1f7f4] hover:border-[#cfddd5]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold border transition-colors shrink-0 ${
                      isSelected
                        ? `${theme.primary} text-white border-transparent`
                        : 'border-[#b8c8bf] text-[#64756e] bg-white'
                    }`}
                  >
                    {opt.score}
                  </div>
                  <span className={isSelected ? theme.primaryText : 'text-[#243b35]'}>
                    {opt.text}
                  </span>
                </div>
                {isSelected && <CheckCircle2 className={`w-5 h-5 shrink-0 ${theme.primaryText}`} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Validation alert */}
      {validationError && (
        <div className="mb-5 p-3.5 rounded-xl bg-[#fff8e8] border border-[#f3dfad] text-[#8a5b0f] text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Question Navigation Buttons */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handlePrevQuestion}
          disabled={currentIndex === 0}
          className={`flex-1 py-3 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            currentIndex === 0
              ? 'opacity-40 cursor-not-allowed border-[#cfddd5] text-[#94a39b]'
              : 'border-[#b8d6c7] text-[#176b58] hover:bg-[#eaf6ef] bg-white'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Sebelumnya</span>
        </button>

        <button
          type="button"
          onClick={handleNextQuestion}
          className={`flex-1 py-3.5 px-6 rounded-xl text-white font-extrabold text-sm flex items-center justify-center gap-2 ${theme.primary} ${theme.primaryHover} shadow-md transition-all active:scale-98`}
        >
          <span>{isLastQuestion ? 'Selesai & Lihat Hasil' : 'Berikutnya'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
