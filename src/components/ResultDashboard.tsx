import React, { useState } from 'react';
import { ScreeningResult } from '../types';
import {
  PHQ9_QUESTIONS,
  GAD7_QUESTIONS,
  PHQ9_CLINICAL_REF,
  GAD7_CLINICAL_REF,
  WA_KADER_NUMBER,
  WA_KADER_DISPLAY,
} from '../data/questionnaires';
import { generateScreeningPDF } from '../utils/pdfGenerator';
import {
  Download,
  MessageCircle,
  RotateCcw,
  Printer,
  AlertTriangle,
  HeartCrack,
  CheckCircle,
  GraduationCap,
  Sparkles,
  HeartHandshake,
  Check,
  Calendar,
  User,
  ShieldAlert,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResultDashboardProps {
  result: ScreeningResult;
  onRestart: () => void;
  onOpenEmergency: () => void;
}

export const ResultDashboard: React.FC<ResultDashboardProps> = ({
  result,
  onRestart,
  onOpenEmergency,
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showBreathingModal, setShowBreathingModal] = useState(false);

  const isPHQ9 = result.type === 'phq9';
  const questions = isPHQ9 ? PHQ9_QUESTIONS : GAD7_QUESTIONS;
  const clinicalRef = isPHQ9 ? PHQ9_CLINICAL_REF : GAD7_CLINICAL_REF;

  // Trigger light celebration if score is minimal/normal
  React.useEffect(() => {
    if (result.severityLevel === 'minimal') {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#176b58', '#218069', '#76b8a0'],
        });
      } catch {
        // ignore if canvas not supported
      }
    }
  }, [result]);

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await generateScreeningPDF(result);
    } catch (err: unknown) {
      console.error('PDF error:', err);
      alert('Terjadi kendala saat menyusun PDF. Silakan coba lagi.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleSendWhatsApp = () => {
    let text = `Halo Kader Keswa SHG Binanga Sehat Jiwa,\n\nSaya telah melakukan screening mandiri menggunakan *${isPHQ9 ? 'PHQ-9 (Depresi)' : 'GAD-7 (Kecemasan)'}* melalui platform E-MAP.\n\n`;
    text += `*Data Responden:*\n`;
    text += `• Nama: ${result.respondent.name}\n`;
    text += `• Gender: ${result.respondent.gender || '-'}\n`;
    text += `• Usia: ${result.respondent.age || '-'} tahun\n`;
    text += `• Waktu: ${result.dateFullWita}\n\n`;
    text += `*Hasil Skrining:*\n`;
    text += `• Skor Total: *${result.totalScore} / ${result.maxScore}*\n`;
    text += `• Klasifikasi: *${result.category}*\n`;

    if (result.criticalAlert?.flagged) {
      text += `\n⚠️ *PERINGATAN:* ${result.criticalAlert.message}\n`;
    }

    text += `\nMohon petunjuk dan arahan pendampingan dari Kader Keswa. Terima kasih.`;

    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?phone=${WA_KADER_NUMBER}&text=${encoded}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  // Severity styles
  const severityColors = {
    minimal: {
      badge: 'bg-[#176b58] text-white',
      border: 'border-[#176b58]',
      card: 'bg-[#eaf6ef]',
      text: 'text-[#176b58]',
    },
    mild: {
      badge: 'bg-[#2b8a71] text-white',
      border: 'border-[#2b8a71]',
      card: 'bg-[#edf9f3]',
      text: 'text-[#2b8a71]',
    },
    moderate: {
      badge: 'bg-[#d97706] text-white',
      border: 'border-[#d97706]',
      card: 'bg-[#fffbeb]',
      text: 'text-[#d97706]',
    },
    'moderately-severe': {
      badge: 'bg-[#ea580c] text-white',
      border: 'border-[#ea580c]',
      card: 'bg-[#fff7ed]',
      text: 'text-[#ea580c]',
    },
    severe: {
      badge: 'bg-[#b42342] text-white',
      border: 'border-[#b42342]',
      card: 'bg-[#fff0f2]',
      text: 'text-[#b42342]',
    },
  }[result.severityLevel];

  return (
    <div className="space-y-6">
      {/* Top Main Result Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e0eae4] shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#e0eae4]">
          <div>
            <div className="text-[11px] font-extrabold tracking-widest uppercase text-[#176b58] mb-1">
              HASIL PENAPISAN MANDIRI • {isPHQ9 ? 'PHQ-9' : 'GAD-7'}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#243b35]">
              {result.category}
            </h1>
            <p className="text-xs text-[#64756e] mt-1">
              Evaluasi gejala dalam rentang waktu 2 minggu terakhir
            </p>
          </div>

          <div className="flex items-center gap-3">
            {result.criticalAlert?.flagged && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#b42342] text-white text-xs font-extrabold animate-pulse shadow-md">
                <AlertTriangle className="w-4 h-4" />
                <span>PERINGATAN KRITIS</span>
              </div>
            )}
            <div
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex flex-col items-center justify-center font-extrabold shadow-sm ${severityColors.badge}`}
            >
              <span className="text-3xl sm:text-4xl leading-none">{result.totalScore}</span>
              <span className="text-[10px] sm:text-xs opacity-90 mt-1">dari {result.maxScore}</span>
            </div>
          </div>
        </div>

        {/* Identity & Metadata Strip */}
        <div className="mt-5 p-4 rounded-2xl bg-[#f8fbf9] border border-[#e0eae4] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#176b58]" />
            <div>
              <span className="text-[#64756e] block text-[10px] uppercase font-bold">Responden</span>
              <strong className="text-[#243b35]">{result.respondent.name}</strong> ({result.respondent.gender || '-'}, {result.respondent.age || '-'} th)
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#176b58]" />
            <div>
              <span className="text-[#64756e] block text-[10px] uppercase font-bold">Waktu Pemeriksaan</span>
              <span className="text-[#243b35] font-semibold">{result.dateFullWita}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#176b58]" />
            <div>
              <span className="text-[#64756e] block text-[10px] uppercase font-bold">Status Privasi</span>
              <span className="text-[#176b58] font-bold">Lokal & Rahasia</span>
            </div>
          </div>
        </div>

        {/* Critical Safety Notice if triggered */}
        {result.criticalAlert && result.criticalAlert.flagged && (
          <div className="mt-5 p-5 rounded-2xl bg-[#fff0f2] border-2 border-[#f0c7d0] text-[#b42342] shadow-xs">
            <div className="flex items-start gap-3">
              <HeartCrack className="w-6 h-6 shrink-0 mt-0.5 text-[#b42342]" />
              <div>
                <h3 className="font-extrabold text-sm sm:text-base leading-snug">
                  {result.criticalAlert.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#8e1934] mt-1.5 leading-relaxed font-medium">
                  {result.criticalAlert.message}
                </p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  <button
                    onClick={onOpenEmergency}
                    className="px-4 py-2 rounded-xl bg-[#b42342] text-white font-extrabold text-xs shadow-md hover:bg-[#921933] transition-all"
                  >
                    Buka Kontak Bantuan Krisis & Darurat
                  </button>
                  <a
                    href={`https://wa.me/${WA_KADER_NUMBER}?text=Halo%20Kader%20Keswa%2C%20saya%20membutuhkan%20bantuan%20darurat%20dan%20pendampingan%20segera.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-white border border-[#b42342] text-[#b42342] font-extrabold text-xs hover:bg-[#ffe2e6] transition-all"
                  >
                    Hubungi Kader Keswa ({WA_KADER_DISPLAY})
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GAD-7 High score warning */}
        {!isPHQ9 && result.totalScore >= 10 && (
          <div
            className={`mt-5 p-5 rounded-2xl border ${
              result.totalScore >= 15
                ? 'bg-[#fff0f2] border-[#f0c7d0] text-[#b42342]'
                : 'bg-[#fff8e8] border-[#f3dfad] text-[#8a5b0f]'
            }`}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs sm:text-sm block font-extrabold">
                  {result.totalScore >= 15
                    ? 'Peringatan Tingkat Kecemasan Tinggi (Skor ≥ 15)'
                    : 'Peringatan Titik Rujukan Klinis (Skor ≥ 10)'}
                </strong>
                <p className="text-xs mt-1 leading-relaxed">
                  {result.totalScore >= 15
                    ? 'Kecemasan yang sangat tinggi dapat memicu serangan panik tiba-tiba atau ketegangan fisik yang intens. Sangat dianjurkan untuk segera berkonsultasi dengan dokter umum/psikiater untuk penanganan terstruktur.'
                    : 'Skor Anda mengindikasikan kecemasan klinis yang bermakna. Mulai pertimbangkan pendampingan konseling atau pemeriksaan ke fasilitas kesehatan terdekat.'}
                </p>
                <div className="mt-3">
                  <button
                    onClick={() => setShowBreathingModal(true)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-current text-xs font-bold hover:opacity-80 transition-all inline-flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Buka Panduan Latihan Relaksasi & Pernapasan</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Toolbar */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#176b58] hover:bg-[#104f42] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-98 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isGeneratingPdf ? 'Menyusun PDF...' : 'Unduh Ringkasan PDF'}</span>
          </button>

          <button
            onClick={handleSendWhatsApp}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#25D366] hover:bg-[#20b858] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-98"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Konsultasi WhatsApp</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-[#cfddd5] hover:bg-[#f8fbf9] text-[#243b35] font-bold text-xs sm:text-sm transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Hasil</span>
          </button>

          <button
            onClick={onRestart}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#eaf6ef] hover:bg-[#d8eedf] text-[#176b58] font-bold text-xs sm:text-sm transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Ulangi Skrining</span>
          </button>
        </div>
      </div>

      {/* Answer Breakdown Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e0eae4] shadow-xs overflow-hidden">
        <h3 className="text-base sm:text-lg font-extrabold text-[#243b35] mb-2">
          Tabel Rincian Jawaban Responden
        </h3>
        <p className="text-xs text-[#64756e] mb-4">
          Berikut adalah skor yang Anda pilih untuk masing-masing butir pertanyaan selama 2 minggu terakhir.
        </p>

        <div className="overflow-x-auto -mx-6 sm:mx-0">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#176b58] text-white">
                <th className="py-3 px-3 rounded-tl-xl w-10 text-center">No</th>
                <th className="py-3 px-3">Gejala Yang Dinilai</th>
                <th className="py-3 px-2 text-center w-20">0<br/><span className="text-[9px] font-normal">Tdk pernah</span></th>
                <th className="py-3 px-2 text-center w-20">1<br/><span className="text-[9px] font-normal">1-6 hari</span></th>
                <th className="py-3 px-2 text-center w-20">2<br/><span className="text-[9px] font-normal">7-11 hari</span></th>
                <th className="py-3 px-2 text-center w-20">3<br/><span className="text-[9px] font-normal">Tiap hari</span></th>
                <th className="py-3 px-3 rounded-tr-xl text-center w-14">Skor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0eae4]">
              {questions.map((q, idx) => {
                const ans = result.answers[idx] !== undefined ? result.answers[idx] : 0;
                const isQ9SelfHarm = isPHQ9 && idx === 8 && ans > 0;
                return (
                  <tr
                    key={idx}
                    className={`hover:bg-[#f8fbf9] transition-colors ${
                      isQ9SelfHarm ? 'bg-[#fff0f2] font-semibold' : idx % 2 === 0 ? 'bg-[#fafcfb]' : 'bg-white'
                    }`}
                  >
                    <td className="py-3 px-3 text-center font-bold text-[#64756e]">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-3 text-[#243b35] leading-relaxed">
                      {q}
                      {isQ9SelfHarm && (
                        <span className="block text-[11px] font-bold text-[#b42342] mt-0.5">
                          ⚠ Indikasi pikiran menyakiti diri / kematian
                        </span>
                      )}
                    </td>
                    {[0, 1, 2, 3].map((val) => {
                      const isSelected = ans === val;
                      return (
                        <td key={val} className="py-3 px-2 text-center">
                          {isSelected ? (
                            <span
                              className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white shadow-xs ${
                                isQ9SelfHarm ? 'bg-[#b42342]' : 'bg-[#176b58]'
                              }`}
                            >
                              <Check className="w-4 h-4 stroke-[3]" />
                            </span>
                          ) : (
                            <span className="text-[#a1b3aa] text-xs font-medium">{val}</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="py-3 px-3 text-center font-extrabold text-[#176b58]">
                      {ans}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clinical Reference Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e0eae4] shadow-xs">
        <div className="text-[11px] font-extrabold tracking-wider uppercase text-[#176b58] mb-1">
          Pedoman Medis & Psikiatri
        </div>
        <h3 className="text-base sm:text-lg font-extrabold text-[#243b35] mb-2">
          Tabel Rujukan Standar Klinis {isPHQ9 ? 'PHQ-9' : 'GAD-7'}
        </h3>
        <p className="text-xs text-[#64756e] mb-4">
          Baris berwarna kuning menandakan klasifikasi skor yang saat ini Anda peroleh.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-[#e0eae4] rounded-2xl overflow-hidden">
            <thead className="bg-[#176b58] text-white">
              <tr>
                <th className="py-2.5 px-4 w-28">Rentang Skor</th>
                <th className="py-2.5 px-4 w-44">Tingkat Keparahan</th>
                <th className="py-2.5 px-4">Rujukan & Rekomendasi Klinis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0eae4]">
              {clinicalRef.map((row, idx) => {
                const isCurrent =
                  result.totalScore >= row.minScore && result.totalScore <= row.maxScore;
                return (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      isCurrent
                        ? 'bg-[#fff3cd] font-bold text-[#856404]'
                        : idx % 2 === 0
                        ? 'bg-[#fafcfb]'
                        : 'bg-white text-[#33463f]'
                    }`}
                  >
                    <td className="py-3 px-4 font-extrabold">
                      {isCurrent && <span className="mr-1.5">▶</span>}
                      {row.scoreRange}
                    </td>
                    <td className="py-3 px-4 font-semibold">{row.severity}</td>
                    <td className="py-3 px-4 leading-relaxed">{row.action}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interpretation & Actionable Recommendations */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e0eae4] shadow-xs space-y-5">
        <div>
          <div className="text-[11px] font-extrabold tracking-wider uppercase text-[#176b58] mb-1">
            Penjelasan & Arahan
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-[#243b35]">
            {result.interpretationTitle}
          </h3>
          <p className="text-xs sm:text-sm text-[#4e625a] mt-2 leading-relaxed">
            {result.interpretationText}
          </p>
        </div>

        {/* Recommendations list */}
        <div className="p-5 rounded-2xl bg-[#eaf6ef] border border-[#b8d6c7]">
          <h4 className="font-extrabold text-xs sm:text-sm text-[#176b58] mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#176b58]" />
            <span>Rekomendasi Tindak Lanjut:</span>
          </h4>
          <ul className="text-xs sm:text-sm text-[#243b35] space-y-2.5 list-disc pl-5">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="leading-relaxed">
                {rec}
              </li>
            ))}
          </ul>
        </div>

        {/* PFA (Psychological First Aid) for GAD-7 */}
        {!isPHQ9 && result.pfaData && (
          <div className="p-5 rounded-2xl bg-[#e6f3f7] border border-[#a8d3de] text-[#165b6e]">
            <h4 className="font-extrabold text-xs sm:text-sm text-[#165b6e] mb-2 flex items-center gap-2">
              <HeartHandshake className="w-4 h-4" />
              <span>Panduan PFA (Pertolongan Pertama Emosional - Look, Listen, Link):</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mt-3">
              <div className="p-3 rounded-xl bg-white/80 border border-[#bce0ea]">
                <strong className="block text-[#0f4250] mb-1 font-extrabold">1. LOOK (Amati)</strong>
                <p className="text-[#33535d] leading-relaxed">{result.pfaData.look}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/80 border border-[#bce0ea]">
                <strong className="block text-[#0f4250] mb-1 font-extrabold">2. LISTEN (Dengar)</strong>
                <p className="text-[#33535d] leading-relaxed">{result.pfaData.listen}</p>
              </div>
              <div className="p-3 rounded-xl bg-white/80 border border-[#bce0ea]">
                <strong className="block text-[#0f4250] mb-1 font-extrabold">3. LINK (Hubungkan)</strong>
                <p className="text-[#33535d] leading-relaxed">{result.pfaData.link}</p>
              </div>
            </div>
          </div>
        )}

        {/* Academic References */}
        <div className="p-4 rounded-2xl bg-[#f8fbf9] border-l-4 border-[#176b58] text-[11px] text-[#64756e] space-y-1">
          <div className="font-extrabold text-[#176b58] flex items-center gap-1.5 text-xs mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Sumber Akademis & Validasi Ilmiah:</span>
          </div>
          {isPHQ9 ? (
            <p>
              <strong>PHQ-9:</strong> Kroenke, K., Spitzer, R. L., & Williams, J. B. (2001). The PHQ-9: validity of a brief depression severity measure. <em>Journal of General Internal Medicine</em>, 16(9), 606–613. Titik potong skor ≥ 10 memiliki sensitivitas dan spesifisitas tinggi dalam mendeteksi depresi klinis.
            </p>
          ) : (
            <p>
              <strong>GAD-7:</strong> Spitzer, R. L., Kroenke, K., Williams, J. B., & Löwe, B. (2006). A brief measure for assessing generalized anxiety disorder: the GAD-7. <em>Archives of Internal Medicine</em>, 166(10), 1092–1097. Titik potong skor ≥ 10 tervalidasi sebagai indikator klinis gangguan kecemasan umum.
            </p>
          )}
        </div>
      </div>

      {/* Relaxing Breathing Exercise Modal */}
      {showBreathingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#e0eae4] text-center">
            <h3 className="text-xl font-extrabold text-[#165b6e] mb-2">
              Latihan Pernapasan 4-7-8 & Grounding
            </h3>
            <p className="text-xs text-[#64756e] mb-6">
              Ketika rasa cemas atau panik memuncak, gunakan latihan fisik ini untuk menenangkan sistem saraf simpatik Anda.
            </p>

            <div className="space-y-4 text-left text-xs text-[#33463f] mb-6">
              <div className="p-3.5 rounded-xl bg-[#e6f3f7] border border-[#a8d3de]">
                <strong className="block text-[#165b6e] font-bold mb-1">Teknik Pernapasan 4-7-8:</strong>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>Tarik napas perlahan lewat hidung selama <strong>4 detik</strong>.</li>
                  <li>Tahan napas Anda di dalam dada selama <strong>7 detik</strong>.</li>
                  <li>Hembuskan perlahan lewat mulut dengan lembut selama <strong>8 detik</strong>.</li>
                  <li>Ulangi siklus ini 4 hingga 5 kali.</li>
                </ol>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f8fbf9] border border-[#e0eae4]">
                <strong className="block text-[#176b58] font-bold mb-1">Teknik Grounding 5-4-3-2-1:</strong>
                <p className="leading-relaxed">
                  Sebutkan dalam hati: <strong>5</strong> benda yang Anda lihat, <strong>4</strong> hal yang bisa disentuh, <strong>3</strong> suara yang terdengar, <strong>2</strong> aroma yang tercium, dan <strong>1</strong> hal positif tentang diri Anda saat ini.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowBreathingModal(false)}
              className="w-full py-3 rounded-xl bg-[#165b6e] text-white font-extrabold text-xs hover:bg-[#0f4250] transition-all"
            >
              Tutup Panduan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
