import { QuestionOption, ClinicalReferenceRow } from '../types';

export const WA_KADER_NUMBER = '6285111422246';
export const WA_KADER_DISPLAY = '0851-1142-2246';

export const COMMON_OPTIONS: QuestionOption[] = [
  { text: 'Tidak pernah (0 hari)', score: 0 },
  { text: 'Beberapa hari (1-6 hari)', score: 1 },
  { text: 'Lebih dari separuh waktu (7-11 hari)', score: 2 },
  { text: 'Hampir setiap hari (12-14 hari)', score: 3 },
];

export const PHQ9_QUESTIONS: string[] = [
  'Kurang berminat atau tidak ada kesenangan dalam melakukan sesuatu.',
  'Merasa murung, muram, atau putus asa.',
  'Sulit tidur atau mudah terbangun, atau terlalu banyak tidur.',
  'Merasa lelah atau kurang bertenaga.',
  'Kurang nafsu makan atau makan terlalu banyak.',
  'Merasa buruk tentang diri sendiri, merasa gagal, atau mengecewakan diri sendiri maupun keluarga.',
  'Sulit berkonsentrasi pada sesuatu, seperti membaca atau menonton televisi.',
  'Bergerak atau berbicara sangat lambat sehingga orang lain menyadarinya, atau sebaliknya sangat gelisah dan tidak bisa diam.',
  'Memiliki pikiran bahwa Anda lebih baik mati atau ingin melukai diri sendiri.',
];

export const GAD7_QUESTIONS: string[] = [
  'Merasa gugup, cemas, was-was, atau gelisah.',
  'Tidak mampu menghentikan atau mengontrol rasa khawatir.',
  'Terlalu mengkhawatirkan berbagai macam hal yang berbeda.',
  'Sulit untuk bersantai, tenang, atau merasa rileks.',
  'Sangat gelisah sehingga sulit untuk duduk tenang.',
  'Mudah merasa jengkel, kesal, sensitif, atau lekas marah.',
  'Merasa takut seolah-olah sesuatu yang buruk akan segera terjadi.',
];

export const PHQ9_CLINICAL_REF: ClinicalReferenceRow[] = [
  {
    scoreRange: '0 - 4',
    minScore: 0,
    maxScore: 4,
    severity: 'Minimal / Normal',
    action: 'Tidak memerlukan tindakan khusus; pertahankan pola hidup sehat dan edukasi kesehatan mental berkala.',
  },
  {
    scoreRange: '5 - 9',
    minScore: 5,
    maxScore: 9,
    severity: 'Ringan (Mild)',
    action: 'Observasi/pemantauan klinis mandiri (watchful waiting); edukasi manajemen stres atau konseling ringan jika berlanjut.',
  },
  {
    scoreRange: '10 - 14',
    minScore: 10,
    maxScore: 14,
    severity: 'Sedang (Moderate)',
    action: 'Titik Rujukan Klinis (Cut-off >= 10): Pertimbangkan rujukan ke dokter fasilitas kesehatan/Puskesmas atau psikolog klinis.',
  },
  {
    scoreRange: '15 - 19',
    minScore: 15,
    maxScore: 19,
    severity: 'Moderat Berat (Moderately Severe)',
    action: 'Rujukan aktif dan pendampingan segera ke dokter spesialis kedokteran jiwa (psikiater) atau psikolog klinis.',
  },
  {
    scoreRange: '20 - 27',
    minScore: 20,
    maxScore: 27,
    severity: 'Sangat Berat (Severe)',
    action: 'Memerlukan intervensi medis komprehensif, evaluasi psikiatrik segera, dan pendampingan ketat keluarga/kader.',
  },
];

export const GAD7_CLINICAL_REF: ClinicalReferenceRow[] = [
  {
    scoreRange: '0 - 4',
    minScore: 0,
    maxScore: 4,
    severity: 'Minimal / Normal',
    action: 'Kecemasan dalam batas wajar adaptif; tidak membutuhkan tindakan khusus, lanjutkan aktivitas dan kebiasaan sehat.',
  },
  {
    scoreRange: '5 - 9',
    minScore: 5,
    maxScore: 9,
    severity: 'Ringan (Mild Anxiety)',
    action: 'Pemantauan berkala; terapkan latihan relaksasi pernapasan (box breathing), kurangi stimulan (kafein/begadang).',
  },
  {
    scoreRange: '10 - 14',
    minScore: 10,
    maxScore: 14,
    severity: 'Sedang (Moderate Anxiety)',
    action: 'Titik Rujukan Klinis (Cut-off >= 10): Indikasi kecemasan klinis bermakna. Dianjurkan konseling profesional atau dokter.',
  },
  {
    scoreRange: '15 - 21',
    minScore: 15,
    maxScore: 21,
    severity: 'Berat (Severe Anxiety)',
    action: 'Rujukan aktif segera; berisiko memicu serangan panik berulang atau gangguan fungsi harian parah. Butuh evaluasi medis/psikologis.',
  },
];

export const GAD7_PFA_GUIDE = {
  look: 'Periksa keamanan diri dan amati respon fisik (napas terengah-engah, dada sesak, tangan gemetar, telapak dingin) atau kepanikan berlebih.',
  listen: 'Dengarkan perasaan tanpa menyela atau menghakimi; lakukan teknik pernapasan terarah (Tarik napas 4 detik, tahan 4 detik, hembuskan 6 detik) atau grounding 5-4-3-2-1.',
  link: 'Hubungkan dengan kader kesehatan jiwa SHG Binanga Sehat Jiwa, orang tepercaya, atau puskesmas/psikolog terdekat untuk stabilisasi lanjutan.',
};

export function evaluatePHQ9(answers: number[]) {
  const totalScore = answers.reduce((sum, v) => sum + (v || 0), 0);
  const q9Score = answers[8] || 0;

  let category = '';
  let severityLevel: 'minimal' | 'mild' | 'moderate' | 'moderately-severe' | 'severe' = 'minimal';
  let summaryDescription = '';
  let interpretationTitle = '';
  let interpretationText = '';
  let recommendations: string[] = [];

  if (totalScore <= 4) {
    category = 'Gejala Depresi Minimal';
    severityLevel = 'minimal';
    summaryDescription = 'Hasil penapisan menunjukkan gejala depresi tingkat minimal atau tidak ada depresi signifikan.';
    interpretationTitle = 'Hasil Skrining: Gejala Depresi Minimal atau Tidak Ada';
    interpretationText = 'Skor berada dalam rentang normal (0–4). Keluhan yang Anda alami kemungkinan merupakan respons emosi harian yang wajar dan belum mengarah pada gangguan depresi.';
    recommendations = [
      'Pertahankan rutinitas harian yang menyehatkan: tidur teratur 7-8 jam, makan bergizi, dan olahraga ringan.',
      'Jaga komunikasi dan hubungan positif dengan keluarga, teman, atau komunitas.',
      'Luangkan waktu untuk hobi atau aktivitas rekreasi yang menyegarkan pikiran.',
      'Lakukan penapisan mandiri berkala jika suatu saat merasakan perubahan suasana hati yang berkepanjangan.',
    ];
  } else if (totalScore <= 9) {
    category = 'Gejala Depresi Ringan';
    severityLevel = 'mild';
    summaryDescription = 'Hasil penapisan menunjukkan gejala depresi tingkat ringan (skor 5–9). Kondisi ini dapat dipantau dan diimbangi dengan menjaga pola hidup sehat.';
    interpretationTitle = 'Hasil Skrining: Gejala Depresi Ringan';
    interpretationText = 'Hasil penapisan menunjukkan adanya beberapa gejala emosional yang perlu diperhatikan. Pada tahap ini, pengawasan aktif (watchful waiting) dan dukungan sosial sangat membantu meredakan gejala.';
    recommendations = [
      'Bagikan apa yang Anda rasakan kepada sahabat, keluarga, atau orang yang Anda percayai.',
      'Coba identifikasi faktor pemicu stres saat ini dan atur batasan beban kerja/kegiatan.',
      'Terapkan kebiasaan tidur yang disiplin serta batasi penggunaan gawai menjelang tidur.',
      'Jika gejala bertahan lebih dari 2 minggu atau bertambah berat, segera berkonsultasi dengan kader atau dokter umum di Puskesmas.',
    ];
  } else if (totalScore <= 14) {
    category = 'Gejala Depresi Sedang';
    severityLevel = 'moderate';
    summaryDescription = 'Hasil penapisan menunjukkan gejala depresi tingkat sedang (skor 10-14). Ini merupakan titik potong rujukan klinis yang sebaiknya ditindaklanjuti.';
    interpretationTitle = 'Hasil Skrining: Gejala Depresi Sedang (Titik Rujukan Klinis)';
    interpretationText = 'Skor Anda telah mencapai atau melampaui titik rujukan klinis (skor >= 10). Gejala depresi sedang sering kali mulai mempengaruhi produktivitas, interaksi sosial, atau konsentrasi harian Anda.';
    recommendations = [
      'Sangat dianjurkan untuk berkonsultasi dengan dokter umum di Puskesmas, psikolog klinis, atau psikiater.',
      'Hubungi kader kesehatan jiwa SHG Binanga Sehat Jiwa untuk mendapatkan arahan dan pendampingan navigasi faskes.',
      'Mintalah anggota keluarga atau orang terdekat untuk mendampingi saat berkonsultasi ke fasilitas pelayanan kesehatan.',
      'Hindari membuat keputusan besar saat perasaan sedang sangat kalut atau tertekan.',
    ];
  } else if (totalScore <= 19) {
    category = 'Gejala Depresi Sedang Berat';
    severityLevel = 'moderately-severe';
    summaryDescription = 'Hasil penapisan menunjukkan gejala depresi tingkat sedang berat (skor 15-19). Sangat disarankan untuk segera melakukan konsultasi dengan profesional kesehatan jiwa.';
    interpretationTitle = 'Hasil Skrining: Gejala Depresi Sedang Berat';
    interpretationText = 'Gejala yang Anda rasakan cukup signifikan dan kemungkinan besar menimbulkan hambatan nyata dalam kehidupan pribadi, sosial, atau pekerjaan. Bantuan medis profesional sangat penting.';
    recommendations = [
      'Segera jadwalkan konsultasi dengan psikiater (dokter spesialis kedokteran jiwa) atau psikolog klinis terdekat.',
      'Jangan memendam beban sendirian; beritahukan orang tepercaya mengenai kondisi yang Anda alami.',
      'Kader kesehatan jiwa SHG Binanga Sehat Jiwa siap mendampingi proses konsultasi awal Anda.',
      'Fasilitasi diri dengan lingkungan yang aman dan kurangi tekanan pekerjaan sementara waktu.',
    ];
  } else {
    category = 'Gejala Depresi Berat';
    severityLevel = 'severe';
    summaryDescription = 'Hasil penapisan menunjukkan gejala depresi tingkat berat (skor 20-27). Kondisi ini memerlukan intervensi klinis profesional secara cepat dan tepat.';
    interpretationTitle = 'Hasil Skrining: Gejala Depresi Berat';
    interpretationText = 'Skor total Anda menunjukkan tingkat keparahan yang memerlukan evaluasi klinis intensif segera. Penanganan medis dan psikoterapi terstruktur terbukti efektif memulihkan kondisi ini.';
    recommendations = [
      'Segera datangi Puskesmas, rumah sakit, atau klinik psikiatri terdekat bersama pendamping.',
      'Hubungi kader kesehatan jiwa SHG Binanga Sehat Jiwa sekarang untuk bantuan pendampingan darurat.',
      'Pastikan Anda berada di sekitar orang yang dapat memberikan rasa aman dan tidak sendirian.',
      'Ingatlah bahwa kondisi ini dapat diobati dan Anda berhak mendapatkan bantuan terbaik.',
    ];
  }

  const criticalAlert = q9Score > 0 ? {
    flagged: true,
    title: 'PERINGATAN KESELAMATAN DIRI (PERTANYAAN KE-9)',
    message: `Jawaban pada pertanyaan kesembilan menunjukkan adanya pikiran tentang kematian atau melukai diri (Skor item: ${q9Score}/3). Evaluasi keselamatan diri wajib segera dilakukan terlepas dari berapapun total skor Anda. Jangan sendirian, segera hubungi orang tepercaya atau layanan darurat.`,
    scoreVal: q9Score,
  } : undefined;

  return {
    totalScore,
    category,
    severityLevel,
    summaryDescription,
    interpretationTitle,
    interpretationText,
    recommendations,
    criticalAlert,
  };
}

export function evaluateGAD7(answers: number[]) {
  const totalScore = answers.reduce((sum, v) => sum + (v || 0), 0);

  let category = '';
  let severityLevel: 'minimal' | 'mild' | 'moderate' | 'moderately-severe' | 'severe' = 'minimal';
  let summaryDescription = '';
  let interpretationTitle = '';
  let interpretationText = '';
  let recommendations: string[] = [];

  if (totalScore <= 4) {
    category = 'Kecemasan Minimal / Normal';
    severityLevel = 'minimal';
    summaryDescription = 'Hasil penapisan menunjukkan tingkat kecemasan minimal (skor 0-4). Rasa cemas berada dalam ambang adaptif normal.';
    interpretationTitle = 'Hasil Skrining: Kecemasan Minimal';
    interpretationText = 'Tingkat kekhawatiran dan ketegangan Anda berada pada tingkat normal. Rasa cemas sesekali merupakan reaksi alami tubuh menghadapi tantangan sehari-hari.';
    recommendations = [
      'Pertahankan kebiasaan hidup sehat: tidur cukup, aktivitas fisik teratur, dan pola makan seimbang.',
      'Terapkan manajemen waktu yang baik agar tidak merasa kewalahan.',
      'Lakukan teknik relaksasi ringan seperti meditasi atau pernapasan dalam saat menghadapi beban kerja.',
    ];
  } else if (totalScore <= 9) {
    category = 'Kecemasan Ringan';
    severityLevel = 'mild';
    summaryDescription = 'Hasil penapisan menunjukkan tingkat kecemasan ringan (skor 5-9). Gejala dapat dikendalikan dengan strategi koping mandiri.';
    interpretationTitle = 'Hasil Skrining: Kecemasan Ringan';
    interpretationText = 'Anda mengalami sejumlah gejala kegelisahan atau kekhawatiran yang mulai terasa mengganggu, namun umumnya masih dapat dikompensasi dengan teknik relaksasi dan dukungan sosial.';
    recommendations = [
      'Kurangi konsumsi kafein, minuman berenergi, atau nikotin yang dapat memicu detak jantung cepat dan gelisah.',
      'Lakukan latihan pernapasan dalam (misal: teknik 4-7-8) saat rasa was-was mulai muncul.',
      'Ceritakan kecemasan Anda kepada orang dekat untuk mendapatkan sudut pandang yang lebih menenangkan.',
      'Pantau keluhan selama 2 minggu ke depan; ulangi skrining jika gejala tidak kunjung mereda.',
    ];
  } else if (totalScore <= 14) {
    category = 'Kecemasan Sedang';
    severityLevel = 'moderate';
    summaryDescription = 'Hasil penapisan menunjukkan tingkat kecemasan sedang (skor 10-14). Ini merupakan batas rujukan klinis yang perlu ditindaklanjuti.';
    interpretationTitle = 'Hasil Skrining: Kecemasan Sedang (Titik Rujukan Klinis GAD-7)';
    interpretationText = 'Skor Anda berada pada ambang batas klinis signifikan (skor >= 10). Rasa cemas dan sulit mengontrol kekhawatiran kemungkinan mulai mengganggu konsentrasi, pola tidur, atau interaksi sosial.';
    recommendations = [
      'Dianjurkan untuk berkonsultasi dengan dokter di Puskesmas atau psikolog klinis untuk evaluasi lebih lanjut.',
      'Hubungi kader kesehatan jiwa SHG Binanga Sehat Jiwa untuk berdiskusi dan mendapatkan dukungan komunitas.',
      'Pelajari teknik "grounding" 5-4-3-2-1 ketika pikiran cemas mulai berputar tak terkendali.',
      'Pertimbangkan untuk menyusun jadwal istirahat berkala di sela-sela aktivitas harian.',
    ];
  } else {
    category = 'Kecemasan Berat';
    severityLevel = 'severe';
    summaryDescription = 'Hasil penapisan menunjukkan tingkat kecemasan berat (skor 15-21). Diperlukan pendampingan dan intervensi profesional segera.';
    interpretationTitle = 'Hasil Skrining: Kecemasan Berat';
    interpretationText = 'Skor menunjukkan kecemasan yang intens dan berisiko memicu serangan panik, insomnia berat, atau keluhan psikosomatik (jantung berdebar, pusing, gangguan lambung). Bantuan medis sangat dianjurkan.';
    recommendations = [
      'Segera jadwalkan konsultasi dengan psikiater atau dokter spesialis untuk evaluasi penanganan medis/terapi kognitif.',
      'Hubungi kader kesehatan jiwa SHG Binanga Sehat Jiwa untuk bantuan panduan krisis dan rujukan faskes.',
      'Hindari isolasi diri; tetap bersama keluarga atau pendamping yang memberikan rasa aman.',
      'Jika mengalami serangan panik hebat atau sesak napas yang tak mereda, segera kunjungi instalasi gawat darurat (IGD).',
    ];
  }

  const criticalAlert = totalScore >= 15 ? {
    flagged: true,
    title: 'PERINGATAN KLINIS: KECEMASAN TINGKAT TINGGI (SKOR >= 15)',
    message: 'Skor GAD-7 Anda mengindikasikan tingkat kecemasan berat yang berisiko mengganggu kestabilan fungsi harian dan memicu serangan panik. Diperlukan evaluasi dan stabilisasi segera oleh tenaga kesehatan profesional.',
    scoreVal: totalScore,
  } : (totalScore >= 10 ? {
    flagged: false,
    title: 'PERHATIAN: TITIK RUJUKAN KLINIS TERPENUHI (SKOR >= 10)',
    message: 'Skor Anda mencapai batas rujukan klinis untuk Generalized Anxiety Disorder (GAD). Dianjurkan berkonsultasi untuk penanganan dini yang efektif.',
    scoreVal: totalScore,
  } : undefined);

  return {
    totalScore,
    category,
    severityLevel,
    summaryDescription,
    interpretationTitle,
    interpretationText,
    recommendations,
    criticalAlert,
  };
}

export function getWITADateTime() {
  const now = new Date();
  // WITA is UTC+8
  const witaTime = new Date(now.getTime() + (now.getTimezoneOffset() + 480) * 60000);
  const d = String(witaTime.getDate()).padStart(2, '0');
  const m = String(witaTime.getMonth() + 1).padStart(2, '0');
  const y = witaTime.getFullYear();
  const h = String(witaTime.getHours()).padStart(2, '0');
  const min = String(witaTime.getMinutes()).padStart(2, '0');
  const sec = String(witaTime.getSeconds()).padStart(2, '0');

  const monthNamesId = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const monthName = monthNamesId[witaTime.getMonth()];

  return {
    date: `${d}/${m}/${y}`,
    dateLong: `${d} ${monthName} ${y}`,
    time: `${h}:${min} WITA`,
    full: `${d} ${monthName} ${y}, ${h}:${min} WITA`,
    datetimeFile: `${y}${m}${d}_${h}${min}${sec}`,
  };
}
