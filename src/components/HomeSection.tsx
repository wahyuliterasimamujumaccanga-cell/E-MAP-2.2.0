import React from 'react';
import {
  ClipboardCheck,
  Brain,
  MessageCircle,
  Ear,
  Users,
  HandHeart,
  Stethoscope,
  ExternalLink,
  ShieldCheck,
  Info,
  Youtube,
  AlertTriangle,
} from 'lucide-react';
import { WA_KADER_NUMBER } from '../data/questionnaires';

interface HomeSectionProps {
  onStartPHQ9: () => void;
  onStartGAD7: () => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  onStartPHQ9,
  onStartGAD7,
}) => {
  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#124d3e] via-[#218069] to-[#459e83] text-white p-6 sm:p-8 md:p-10 shadow-lg border border-[#3b937c]">
        {/* Decorative background circle */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-[#c6f4df] text-[11px] font-extrabold tracking-widest uppercase mb-3 border border-white/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Ruang Aman Untuk Bertumbuh</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight mb-3">
            SHG Binanga Sehat Jiwa
          </h1>

          <p className="text-sm sm:text-base font-semibold text-[#cbf4e1] mb-2">
            Kelompok Binaan GEMA Difabel Sulawesi Barat & Pusat Rehabilitasi YAKKUM
          </p>

          <p className="text-xs sm:text-sm text-[#edf9f2] leading-relaxed mb-6 font-normal">
            Platform edukasi dan penapisan mandiri kesehatan jiwa berbasis komunitas yang inklusif, rahasia, dan setara. Saling mendengarkan tanpa menghakimi, mendampingi pemulihan, dan menghubungkan dengan layanan medis yang tepat.
          </p>

          {/* Action CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={onStartPHQ9}
              className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-white text-[#104f42] font-extrabold text-xs sm:text-sm shadow-md hover:bg-[#edf9f2] hover:shadow-lg transition-all active:scale-95"
            >
              <ClipboardCheck className="w-4 h-4 text-[#176b58]" />
              <span>Skrining PHQ-9 (Depresi)</span>
            </button>

            <button
              onClick={onStartGAD7}
              className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-[#165b6e] text-white font-extrabold text-xs sm:text-sm shadow-md hover:bg-[#0f4250] hover:shadow-lg transition-all active:scale-95 border border-white/25"
            >
              <Brain className="w-4 h-4 text-[#9ae0ef]" />
              <span>Skrining GAD-7 (Kecemasan)</span>
            </button>

            <a
              href={`https://wa.me/${WA_KADER_NUMBER}?text=Halo%20Kader%20Keswa%20SHG%20Binanga%20Sehat%20Jiwa%2C%20saya%20ingin%20berkonsultasi%20dan%20meminta%20pendampingan.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-[#25D366] text-white font-extrabold text-xs sm:text-sm shadow-md hover:bg-[#20b858] hover:shadow-lg transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Hubungi Kader Keswa</span>
            </a>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e0eae4] shadow-xs">
        <div className="text-[11px] font-extrabold tracking-wider uppercase text-[#176b58] mb-1">
          Tentang Kami
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#243b35] mb-4">
          Kesehatan Jiwa adalah Bagian Esensial dari Kesehatan Kita
        </h2>

        {/* Embedded Logo / Preview */}
        <div className="my-5 text-center">
          <div className="w-full max-w-sm h-60 mx-auto rounded-2xl overflow-hidden shadow-md border border-[#e0eae4] bg-[#f8fbf9] flex items-center justify-center">
            <iframe
              src="https://drive.google.com/file/d/1EiaIZghm0Rd1wFX7LCWzq-uDWhbFvTlg/preview"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allow="autoplay"
              title="Logo SHG Binanga Sehat Jiwa"
              className="w-full h-full"
            />
          </div>
          <div className="mt-2.5">
            <a
              href="https://drive.google.com/file/d/1EiaIZghm0Rd1wFX7LCWzq-uDWhbFvTlg/view?usp=drivesdk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#176b58] hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka Logo SHG Binanga Sehat Jiwa di Google Drive</span>
            </a>
          </div>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-[#465a53] leading-relaxed">
          <p>
            Setiap manusia dalam berbagai fase kehidupan dapat mengalami tekanan emosional berat, kelelahan mental, kecemasan berlebih, atau perubahan suasana hati. Mengakui kondisi yang sedang dihadapi dan mencari pertolongan merupakan langkah berani yang wajar, bukan tanda kelemahan.
          </p>
          <p>
            <strong>SHG (Self-Help Group) Binanga Sehat Jiwa</strong> menghadirkan pendekatan dukungan berbasis komunitas: mendengarkan tanpa menghakimi, merajut ikatan solidaritas, menyediakan edukasi kesehatan jiwa yang terpercaya, serta mendampingi warga mengakses layanan medis profesional (Puskesmas, psikolog, psikiater).
          </p>
          <p className="text-[11px] text-[#64756e]">
            Kelompok Binaan GEMA Difabel Sulawesi Barat dan Pusat Rehabilitasi YAKKUM pada Program Dignity INKLUSI: Kemitraan Indonesia dan Australia.
          </p>
        </div>

        {/* Quote Card */}
        <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-[#eaf6ef] border-l-4 border-[#176b58] text-[#1e4b39] text-xs sm:text-sm italic leading-relaxed">
          &ldquo;Kamu tidak harus menghadapi semuanya sendirian. Meminta bantuan bukanlah tanda kelemahan, melainkan salah satu langkah paling bermakna untuk menjaga diri dan masa depan.&rdquo;
          <div className="mt-2 not-italic font-bold text-[#176b58] text-xs">
            — Wahyu Santoso (Ketua SHG Binanga Sehat Jiwa)
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e0eae4] shadow-xs">
        <div className="text-[11px] font-extrabold tracking-wider uppercase text-[#176b58] mb-1">
          Nilai Yang Kami Jaga
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#243b35] mb-5">
          Mendengar, Mendampingi, dan Menguatkan
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#f8fbf9] border border-[#e0eae4] hover:border-[#b8d6c7] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#eaf6ef] text-[#176b58] flex items-center justify-center mb-3">
              <Ear className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#243b35] text-sm mb-1">Mendengarkan Tanpa Menghakimi</h3>
            <p className="text-xs text-[#64756e] leading-relaxed">
              Setiap orang berhak menceritakan isi hati dan perasaannya dalam suasana yang aman, bebas dari celaan dan rasa malu.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#f8fbf9] border border-[#e0eae4] hover:border-[#b8d6c7] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#eaf6ef] text-[#176b58] flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#243b35] text-sm mb-1">Pendampingan Komunitas Setara</h3>
            <p className="text-xs text-[#64756e] leading-relaxed">
              Dukungan sesama penyintas dan kader terlatih membantu seseorang menyadari bahwa ia tidak pernah berjuang sendirian.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#f8fbf9] border border-[#e0eae4] hover:border-[#b8d6c7] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#eaf6ef] text-[#176b58] flex items-center justify-center mb-3">
              <HandHeart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#243b35] text-sm mb-1">Inklusif dan Menjunjung Martabat</h3>
            <p className="text-xs text-[#64756e] leading-relaxed">
              Orang dengan disabilitas psikososial memiliki hak asasi manusia, martabat, dan potensi yang setara di tengah masyarakat.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#f8fbf9] border border-[#e0eae4] hover:border-[#b8d6c7] transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#eaf6ef] text-[#176b58] flex items-center justify-center mb-3">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#243b35] text-sm mb-1">Terhubung dengan Layanan Profesional</h3>
            <p className="text-xs text-[#64756e] leading-relaxed">
              Kader membantu memberikan panduan awal, navigasi rujukan BPJS/Puskesmas, serta jadwal temu dengan psikolog atau psikiater.
            </p>
          </div>
        </div>
      </section>

      {/* Anti-Stigma Section */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e0eae4] shadow-xs">
        <div className="text-[11px] font-extrabold tracking-wider uppercase text-[#b42342] mb-1">
          Melawan Stigma Sosial
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#243b35] mb-3">
          Jangan Reduksi Manusia Menjadi Label Diskriminatif
        </h2>

        <p className="text-xs sm:text-sm text-[#556961] leading-relaxed mb-4">
          Panggilan atau sebutan seperti <em>&ldquo;gila&rdquo;</em>, <em>&ldquo;kurang waras&rdquo;</em>, atau <em>&ldquo;cacat&rdquo;</em> yang dilontarkan untuk mencemooh memperkuat stigma, menimbulkan isolasi batin, dan mencegah seseorang mencari bantuan medis tepat waktu. Kondisi kesehatan jiwa adalah tantangan medis dan psikososial, bukan cela moral.
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1.5 rounded-xl bg-[#fff0f2] text-[#b42342] text-xs font-bold border border-[#f0c7d0] line-through">
            &ldquo;Gila&rdquo;
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-[#fff0f2] text-[#b42342] text-xs font-bold border border-[#f0c7d0] line-through">
            &ldquo;Bodoh&rdquo;
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-[#fff0f2] text-[#b42342] text-xs font-bold border border-[#f0c7d0] line-through">
            &ldquo;Cacat / Kurang Ingatan&rdquo;
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-[#eaf6ef] text-[#176b58] text-xs font-bold border border-[#b8d6c7]">
            ✓ Orang Dengan Masalah Kejiwaan (ODMK)
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-[#eaf6ef] text-[#176b58] text-xs font-bold border border-[#b8d6c7]">
            ✓ Orang Dengan Disabilitas Psikososial (ODDP)
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-[#fff8e8] border border-[#f3dfad] flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#b27b14] shrink-0 mt-0.5" />
          <p className="text-xs text-[#765013] leading-relaxed m-0 font-medium">
            <strong>Ingat:</strong> Kita tidak perlu memahami seluruh pengalaman batin seseorang untuk memperlakukannya dengan hormat dan kasih sayang. Dengarkan, jangan mengucilkan, dan bantu hubungkan dengan pertolongan profesional.
          </p>
        </div>
      </section>

      {/* Podcast & YouTube Video Series */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e0eae4] shadow-xs">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div>
            <div className="text-[11px] font-extrabold tracking-wider uppercase text-[#176b58]">
              Dengarkan & Pelajari
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#243b35]">
              Podcast & Video Edukasi Kesehatan Jiwa
            </h2>
          </div>
          <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
            <Youtube className="w-5 h-5" />
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#64756e] mb-4">
          Simak kumpulan seri video dan podcast edukasi kesehatan jiwa berikut untuk memperkaya wawasan, mengikis stigma di keluarga, dan menemukan panduan praktis koping sehari-hari.
        </p>

        <div className="rounded-2xl overflow-hidden border border-[#e0eae4] shadow-inner bg-black aspect-video max-h-[420px] w-full">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/videoseries?list=PLch5yKDAJkvk"
            title="Podcast Kesehatan Jiwa"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full"
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-[#64756e]">
          <span className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#176b58]" />
            Konten video merupakan hak cipta kreator aslinya.
          </span>
          <span className="font-semibold text-[#176b58]">SHG Binanga Sehat Jiwa Edukasi</span>
        </div>
      </section>
    </div>
  );
};
