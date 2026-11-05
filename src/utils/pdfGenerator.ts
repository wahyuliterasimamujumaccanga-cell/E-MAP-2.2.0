import { jsPDF } from 'jspdf';
import { ScreeningResult } from '../types';
import {
  PHQ9_QUESTIONS,
  GAD7_QUESTIONS,
  PHQ9_CLINICAL_REF,
  GAD7_CLINICAL_REF,
  WA_KADER_DISPLAY,
} from '../data/questionnaires';

/**
 * Sanitizes any string to ensure 100% compatibility with standard jsPDF fonts (WinAnsi/Latin-1).
 * Eliminates character corruption such as '✓' turning to ''', '▶' turning to '%¶',
 * and '≥' turning to '"e' which caused lines to break out of margins.
 */
function toPdfAscii(text: string): string {
  if (!text) return '';
  return text
    .replace(/[≥]/g, '>=')
    .replace(/[≤]/g, '<=')
    .replace(/[▶►]/g, '>')
    .replace(/[✓✔]/g, 'V')
    .replace(/[•●]/g, '-')
    .replace(/[–—]/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[…]/g, '...')
    .replace(/[⚠]/g, '[!]');
}

export async function generateScreeningPDF(result: ScreeningResult): Promise<void> {
  const isPHQ9 = result.type === 'phq9';
  const questions = isPHQ9 ? PHQ9_QUESTIONS : GAD7_QUESTIONS;
  const clinicalRef = isPHQ9 ? PHQ9_CLINICAL_REF : GAD7_CLINICAL_REF;

  // Primary Theme Colors (RGB)
  // PHQ-9: Forest Emerald / GAD-7: Ocean Teal
  const primaryColor: [number, number, number] = isPHQ9 ? [16, 79, 66] : [18, 88, 108];
  const primaryDark: [number, number, number] = isPHQ9 ? [10, 52, 43] : [12, 60, 74];
  const primaryLight: [number, number, number] = isPHQ9 ? [234, 246, 239] : [230, 244, 248];
  const accentBorder: [number, number, number] = isPHQ9 ? [180, 215, 198] : [175, 210, 222];
  const textDark: [number, number, number] = [30, 48, 42];
  const textMuted: [number, number, number] = [95, 112, 105];
  const dangerColor: [number, number, number] = [180, 35, 66];
  const dangerBg: [number, number, number] = [255, 240, 243];

  const doc = new jsPDF({
    unit: 'mm',
    format: 'a4',
    orientation: 'portrait',
  });

  const PAGE_W = 210;
  const PAGE_H = 297;
  const MARGIN_X = 14;
  const CONTENT_W = PAGE_W - MARGIN_X * 2; // Exactly 182 mm
  const BOTTOM_LIMIT = 270; // Guaranteed space for footer

  let y = 14;
  let pageNumber = 1;

  // Safe text splitting helper using clean ASCII text
  function splitText(text: string, maxW: number): string[] {
    const clean = toPdfAscii(text);
    return doc.splitTextToSize(clean, maxW);
  }

  // Draw Header Bar
  function drawHeaderBanner(isFirstPage: boolean) {
    if (isFirstPage) {
      const bannerH = 28;

      // Top Primary Header Banner
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.roundedRect(MARGIN_X, y, CONTENT_W, bannerH, 3, 3, 'F');

      // White Badge: E-MAP (Left side)
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(MARGIN_X + 5, y + 4, 22, 20, 2, 2, 'F');
      doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.text('E-MAP', MARGIN_X + 16, y + 14.5, { align: 'center' });
      doc.setFontSize(6.5);
      doc.setFont('helvetica', 'normal');
      doc.text('KESWA', MARGIN_X + 16, y + 19, { align: 'center' });

      // Right Metadata Pill (Separated, fixed width 42mm, prevents any overlapping)
      const rightBoxW = 44;
      const rightBoxX = PAGE_W - MARGIN_X - rightBoxW - 4;
      doc.setFillColor(primaryDark[0], primaryDark[1], primaryDark[2]);
      doc.roundedRect(rightBoxX, y + 4, rightBoxW, 20, 2, 2, 'F');
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(0.2);
      doc.roundedRect(rightBoxX, y + 4, rightBoxW, 20, 2, 2, 'S');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text('DOKUMEN RAHASIA', rightBoxX + rightBoxW / 2, y + 9.5, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      const safeId = toPdfAscii(result.id.slice(0, 16));
      doc.text(`ID: ${safeId}`, rightBoxX + rightBoxW / 2, y + 14.5, { align: 'center' });
      doc.text('Pemrosesan Lokal', rightBoxX + rightBoxW / 2, y + 19, { align: 'center' });

      // Center Title & Organization details (Safe width: MARGIN_X + 31 to rightBoxX - 4 = 105mm)
      const centerStartX = MARGIN_X + 31;
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      const titleText = isPHQ9
        ? 'HASIL PENAPISAN MANDIRI PHQ-9 (DEPRESI)'
        : 'HASIL PENAPISAN MANDIRI GAD-7 (KECEMASAN)';
      doc.text(toPdfAscii(titleText), centerStartX, y + 9);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(230, 245, 240);
      doc.text(
        'SHG Binanga Sehat Jiwa - Binaan GEMA Difabel & PR YAKKUM',
        centerStartX,
        y + 14.5
      );
      doc.setFontSize(7);
      doc.setTextColor(205, 230, 220);
      doc.text(
        'Program Dignity INKLUSI: Kemitraan Indonesia - Australia',
        centerStartX,
        y + 19.5
      );

      y += bannerH + 4;
    } else {
      // Compact Running Header for Page 2+
      doc.setFillColor(primaryLight[0], primaryLight[1], primaryLight[2]);
      doc.roundedRect(MARGIN_X, y, CONTENT_W, 9, 2, 2, 'F');
      doc.setDrawColor(accentBorder[0], accentBorder[1], accentBorder[2]);
      doc.setLineWidth(0.3);
      doc.roundedRect(MARGIN_X, y, CONTENT_W, 9, 2, 2, 'S');

      doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      const cleanRespName = toPdfAscii(result.respondent.name).slice(0, 30);
      doc.text(
        `E-MAP | Hasil Skrining ${isPHQ9 ? 'PHQ-9' : 'GAD-7'} - ${cleanRespName}`,
        MARGIN_X + 5,
        y + 6
      );

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
      doc.text(`Waktu: ${toPdfAscii(result.dateFullWita)}`, PAGE_W - MARGIN_X - 5, y + 6, {
        align: 'right',
      });

      y += 13;
    }
  }

  // Draw Page Footer
  function drawFooter() {
    doc.setDrawColor(210, 222, 216);
    doc.setLineWidth(0.3);
    doc.line(MARGIN_X, PAGE_H - 16, PAGE_W - MARGIN_X, PAGE_H - 16);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    const quote = isPHQ9
      ? '"Watchful waiting (pengawasan aktif) penting pada gejala awal; pemantauan mandiri berkala di rumah." - K. Kroenke, M.D.'
      : '"Beri ruang bagi jiwamu untuk beristirahat dan pulih. Jangan menunggu kelelahan untuk mulai peduli." - Wahyu Santoso';
    doc.text(toPdfAscii(quote), MARGIN_X, PAGE_H - 11);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(`Halaman ${pageNumber}`, PAGE_W - MARGIN_X, PAGE_H - 11, { align: 'right' });

    doc.setFontSize(6.8);
    doc.text(
      'Dokumen ini dicetak otomatis dari Platform E-MAP untuk penapisan awal, bukan pengganti diagnosis medis resmi.',
      MARGIN_X,
      PAGE_H - 7
    );
  }

  // Page Break Guard
  function ensureSpace(neededHeight: number) {
    if (y + neededHeight > BOTTOM_LIMIT) {
      drawFooter();
      doc.addPage();
      pageNumber++;
      y = 14;
      drawHeaderBanner(false);
    }
  }

  // Initialize Page 1 Header
  drawHeaderBanner(true);

  // SECTION 1: RESPONDENT INFO & SUMMARY CARD
  ensureSpace(28);

  const leftW = CONTENT_W * 0.62;
  const rightW = CONTENT_W - leftW - 3;
  const summaryBoxH = 24;

  // Left: Respondent Data Box
  doc.setFillColor(252, 254, 253);
  doc.setDrawColor(accentBorder[0], accentBorder[1], accentBorder[2]);
  doc.setLineWidth(0.3);
  doc.roundedRect(MARGIN_X, y, leftW, summaryBoxH, 2.5, 2.5, 'FD');

  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('DATA RESPONDEN', MARGIN_X + 5, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  const cleanName = toPdfAscii(result.respondent.name);
  doc.text(`Nama Lengkap : ${cleanName}`, MARGIN_X + 5, y + 11);
  const cleanGender = toPdfAscii(result.respondent.gender || '-');
  const cleanAge = toPdfAscii(result.respondent.age || '-');
  doc.text(
    `Jenis Kelamin : ${cleanGender}     |     Usia : ${cleanAge} Tahun`,
    MARGIN_X + 5,
    y + 16
  );
  doc.text(`Waktu Skrining : ${toPdfAscii(result.dateFullWita)}`, MARGIN_X + 5, y + 21);

  // Right: Score Result Box
  const scoreBoxX = MARGIN_X + leftW + 3;
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.roundedRect(scoreBoxX, y, rightW, summaryBoxH, 2.5, 2.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('SKOR HASIL PENAPISAN', scoreBoxX + rightW / 2, y + 5.5, { align: 'center' });

  doc.setFontSize(16);
  doc.text(`${result.totalScore} / ${result.maxScore}`, scoreBoxX + rightW / 2, y + 14, {
    align: 'center',
  });

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text(toPdfAscii(result.category.toUpperCase()), scoreBoxX + rightW / 2, y + 20, {
    align: 'center',
  });

  y += summaryBoxH + 4;

  // SECTION 2: CRITICAL WARNING / ALERTS (If triggered)
  if (result.criticalAlert && result.criticalAlert.flagged) {
    const splitAlert = splitText(result.criticalAlert.message, CONTENT_W - 14);
    const alertBoxH = 12 + splitAlert.length * 4.2;

    ensureSpace(alertBoxH);

    doc.setFillColor(dangerBg[0], dangerBg[1], dangerBg[2]);
    doc.setDrawColor(dangerColor[0], dangerColor[1], dangerColor[2]);
    doc.setLineWidth(0.8);
    doc.roundedRect(MARGIN_X, y, CONTENT_W, alertBoxH, 2.5, 2.5, 'FD');

    doc.setTextColor(dangerColor[0], dangerColor[1], dangerColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(`[!] ${toPdfAscii(result.criticalAlert.title)}`, MARGIN_X + 5, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.8);
    doc.setTextColor(120, 20, 35);
    doc.text(splitAlert, MARGIN_X + 5, y + 11.5);

    y += alertBoxH + 4;
  } else if (!isPHQ9 && result.totalScore >= 10) {
    // GAD-7 Clinical notice
    const alertText =
      result.totalScore >= 15
        ? 'PERINGATAN KLINIS: Skor GAD-7 >= 15 menunjukkan kecemasan berat. Sangat disarankan untuk segera berkonsultasi dengan profesional kesehatan untuk stabilisasi dan mencegah serangan panik.'
        : 'PERHATIAN KLINIS: Skor GAD-7 >= 10 menunjukkan kecemasan klinis bermakna (titik rujukan klinis). Disarankan evaluasi lebih lanjut.';
    const splitAlert = splitText(alertText, CONTENT_W - 14);
    const alertH = 8 + splitAlert.length * 4;

    ensureSpace(alertH);

    const isHigh = result.totalScore >= 15;
    const bgCol = isHigh ? dangerBg : [255, 248, 230];
    const bdrCol = isHigh ? dangerColor : [220, 160, 40];
    const textCol = isHigh ? dangerColor : [140, 90, 10];

    doc.setFillColor(bgCol[0], bgCol[1], bgCol[2]);
    doc.setDrawColor(bdrCol[0], bdrCol[1], bdrCol[2]);
    doc.setLineWidth(0.6);
    doc.roundedRect(MARGIN_X, y, CONTENT_W, alertH, 2, 2, 'FD');

    doc.setTextColor(textCol[0], textCol[1], textCol[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.8);
    doc.text(splitAlert, MARGIN_X + 5, y + 5.5);

    y += alertH + 4;
  }

  // SECTION 3: TABEL JAWABAN LENGKAP
  ensureSpace(24);

  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('TABEL JAWABAN & RINCIAN GEJALA (2 MINGGU TERAKHIR)', MARGIN_X, y + 4.5);
  y += 7;

  // Geometry:
  // CONTENT_W = 182
  // Col 1 (No): 8 mm
  // Col 2 (Pertanyaan): 94 mm
  // Col 3 (0: Tdk Pernah): 20 mm
  // Col 4 (1: Beberapa Hari): 20 mm
  // Col 5 (2: Separuh Waktu): 20 mm
  // Col 6 (3: Tiap Hari): 20 mm
  const colW = {
    no: 8,
    q: 94,
    c0: 20,
    c1: 20,
    c2: 20,
    c3: 20,
  };

  const colX = {
    no: MARGIN_X,
    q: MARGIN_X + colW.no,
    c0: MARGIN_X + colW.no + colW.q,
    c1: MARGIN_X + colW.no + colW.q + colW.c0,
    c2: MARGIN_X + colW.no + colW.q + colW.c0 + colW.c1,
    c3: MARGIN_X + colW.no + colW.q + colW.c0 + colW.c1 + colW.c2,
  };

  // Table Header
  const tableHeaderH = 9;
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(MARGIN_X, y, CONTENT_W, tableHeaderH, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);

  doc.text('No.', colX.no + colW.no / 2, y + 5.5, { align: 'center' });
  doc.text('Pertanyaan Gejala', colX.q + 3, y + 5.5);
  doc.text('0 (Tdk Pernah)', colX.c0 + colW.c0 / 2, y + 5.5, { align: 'center' });
  doc.text('1 (1-6 Hari)', colX.c1 + colW.c1 / 2, y + 5.5, { align: 'center' });
  doc.text('2 (7-11 Hari)', colX.c2 + colW.c2 / 2, y + 5.5, { align: 'center' });
  doc.text('3 (12-14 Hari)', colX.c3 + colW.c3 / 2, y + 5.5, { align: 'center' });

  y += tableHeaderH;

  // Table Body Rows
  questions.forEach((questionText, idx) => {
    const chosenVal = result.answers[idx] !== undefined ? result.answers[idx] : 0;
    const lines = splitText(questionText, colW.q - 5);
    const rowH = Math.max(lines.length * 3.8 + 3.5, 7.5);

    ensureSpace(rowH + 4);

    const isEven = idx % 2 === 0;
    const isQ9Trigger = isPHQ9 && idx === 8 && chosenVal > 0;

    // Background fill
    if (isQ9Trigger) {
      doc.setFillColor(255, 238, 240);
    } else if (isEven) {
      doc.setFillColor(250, 253, 251);
    } else {
      doc.setFillColor(255, 255, 255);
    }
    doc.rect(MARGIN_X, y, CONTENT_W, rowH, 'F');

    // Horizontal bottom border
    doc.setDrawColor(220, 232, 226);
    doc.setLineWidth(0.2);
    doc.line(MARGIN_X, y + rowH, MARGIN_X + CONTENT_W, y + rowH);

    // Text column: No
    doc.setFont('helvetica', isQ9Trigger ? 'bold' : 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(
      isQ9Trigger ? dangerColor[0] : primaryDark[0],
      isQ9Trigger ? dangerColor[1] : primaryDark[1],
      isQ9Trigger ? dangerColor[2] : primaryDark[2]
    );
    doc.text(`${idx + 1}.`, colX.no + colW.no / 2, y + 4.8, { align: 'center' });

    // Text column: Question text
    doc.setFont('helvetica', isQ9Trigger ? 'bold' : 'normal');
    doc.setTextColor(
      isQ9Trigger ? 160 : textDark[0],
      isQ9Trigger ? 20 : textDark[1],
      isQ9Trigger ? 30 : textDark[2]
    );
    doc.text(lines, colX.q + 3, y + 4.5);

    // Columns 0, 1, 2, 3
    const cols = [colX.c0, colX.c1, colX.c2, colX.c3];
    cols.forEach((colStart, colIndex) => {
      const centerX = colStart + 10;
      const centerY = y + rowH / 2;

      if (chosenVal === colIndex) {
        // Crisp selected badge (No unicode '✓' character that causes apostrophe corruption)
        const circleCol = isQ9Trigger ? dangerColor : primaryColor;
        doc.setFillColor(circleCol[0], circleCol[1], circleCol[2]);
        doc.roundedRect(centerX - 6, centerY - 2.8, 12, 5.6, 2, 2, 'F');

        // Draw clean white vector checkmark
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(0.4);
        doc.line(centerX - 4.2, centerY, centerX - 3.2, centerY + 1.2);
        doc.line(centerX - 3.2, centerY + 1.2, centerX - 1.8, centerY - 1.2);

        // Bold number beside checkmark
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.text(`${colIndex}`, centerX + 1.8, centerY + 1, { align: 'center' });
      } else {
        doc.setTextColor(150, 165, 158);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.text(`${colIndex}`, centerX, centerY + 1, { align: 'center' });
      }
    });

    y += rowH;
  });

  y += 5;

  // SECTION 4: INTERPRETASI & REKOMENDASI KLINIS
  const interpLines = splitText(result.interpretationText, CONTENT_W - 14);
  const interpBoxH = 10 + interpLines.length * 4.2;

  ensureSpace(interpBoxH + 10);

  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('INTERPRETASI KLINIS & SARAN TINDAK LANJUT', MARGIN_X, y + 4);
  y += 6;

  // Interpretation Card
  doc.setFillColor(254, 250, 240);
  doc.setDrawColor(230, 200, 140);
  doc.setLineWidth(0.4);
  doc.roundedRect(MARGIN_X, y, CONTENT_W, interpBoxH, 2.5, 2.5, 'FD');

  doc.setTextColor(160, 80, 10);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.text(toPdfAscii(result.interpretationTitle), MARGIN_X + 5, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.6);
  doc.setTextColor(textDark[0], textDark[1], textDark[2]);
  doc.text(interpLines, MARGIN_X + 5, y + 10.5);

  y += interpBoxH + 3.5;

  // Recommendations Card
  let recLinesTotal = 0;
  const processedRecs: string[][] = [];
  result.recommendations.forEach((rec) => {
    const sp = splitText(rec, CONTENT_W - 16);
    processedRecs.push(sp);
    recLinesTotal += sp.length;
  });

  const recBoxH = 10 + recLinesTotal * 4.2 + result.recommendations.length * 1.5;
  ensureSpace(recBoxH);

  doc.setFillColor(primaryLight[0], primaryLight[1], primaryLight[2]);
  doc.setDrawColor(accentBorder[0], accentBorder[1], accentBorder[2]);
  doc.setLineWidth(0.4);
  doc.roundedRect(MARGIN_X, y, CONTENT_W, recBoxH, 2.5, 2.5, 'FD');

  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.text('Rekomendasi Langkah Nyata:', MARGIN_X + 5, y + 5);

  let curRecY = y + 10;
  processedRecs.forEach((lines) => {
    // Vector bullet (never breaks font encoding)
    doc.setFillColor(primaryDark[0], primaryDark[1], primaryDark[2]);
    doc.circle(MARGIN_X + 6, curRecY - 1, 0.7, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(textDark[0], textDark[1], textDark[2]);
    doc.text(lines, MARGIN_X + 9, curRecY);

    curRecY += lines.length * 4 + 1.5;
  });

  y += recBoxH + 4;

  // SECTION 5: PFA (PSYCHOLOGICAL FIRST AID) FOR GAD-7 (If Applicable)
  if (!isPHQ9 && result.pfaData) {
    const pfaH = 26;
    ensureSpace(pfaH);

    doc.setFillColor(242, 250, 252);
    doc.setDrawColor(18, 88, 108);
    doc.setLineWidth(0.4);
    doc.roundedRect(MARGIN_X, y, CONTENT_W, pfaH, 2.5, 2.5, 'FD');

    doc.setTextColor(18, 88, 108);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(
      'PANDUAN PERTOLONGAN PERTAMA PSIKOLOGIS (PFA - LOOK, LISTEN, LINK):',
      MARGIN_X + 5,
      y + 5
    );

    doc.setFontSize(7.3);
    // Look
    doc.setFont('helvetica', 'bold');
    doc.text('LOOK (Amati):', MARGIN_X + 5, y + 10);
    doc.setFont('helvetica', 'normal');
    const lookLines = splitText(result.pfaData.look, CONTENT_W - 35);
    doc.text(lookLines, MARGIN_X + 30, y + 10);

    // Listen
    doc.setFont('helvetica', 'bold');
    doc.text('LISTEN (Dengar):', MARGIN_X + 5, y + 15.5);
    doc.setFont('helvetica', 'normal');
    const listenLines = splitText(result.pfaData.listen, CONTENT_W - 35);
    doc.text(listenLines, MARGIN_X + 30, y + 15.5);

    // Link
    doc.setFont('helvetica', 'bold');
    doc.text('LINK (Hubungkan):', MARGIN_X + 5, y + 21);
    doc.setFont('helvetica', 'normal');
    const linkLines = splitText(result.pfaData.link, CONTENT_W - 35);
    doc.text(linkLines, MARGIN_X + 30, y + 21);

    y += pfaH + 4;
  }

  // SECTION 6: TABEL RUJUKAN KLINIS RESMI (FIXED GEOMETRY & NO TEXT OVERFLOW)
  ensureSpace(42);

  doc.setTextColor(primaryDark[0], primaryDark[1], primaryDark[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(`TABEL RUJUKAN STANDAR KLINIS (${isPHQ9 ? 'PHQ-9' : 'GAD-7'})`, MARGIN_X, y + 4);
  y += 6;

  // Geometry:
  // CONTENT_W = 182 mm
  // Col 1 (Rentang Skor): 26 mm (from MARGIN_X to MARGIN_X + 26)
  // Col 2 (Tingkat Keparahan): 42 mm (from MARGIN_X + 26 to MARGIN_X + 68)
  // Col 3 (Tindakan & Rekomendasi): 114 mm (from MARGIN_X + 68 to MARGIN_X + 182)
  const clinW = {
    col1: 26,
    col2: 42,
    col3: 114,
  };
  const clinX = {
    col1: MARGIN_X,
    col2: MARGIN_X + clinW.col1,
    col3: MARGIN_X + clinW.col1 + clinW.col2,
  };

  // Table header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(MARGIN_X, y, CONTENT_W, 7, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.text('Rentang Skor', clinX.col1 + 3, y + 4.8);
  doc.text('Tingkat Keparahan', clinX.col2 + 3, y + 4.8);
  doc.text('Tindakan & Rekomendasi Klinis', clinX.col3 + 3, y + 4.8);

  y += 7;

  clinicalRef.forEach((row, rowIdx) => {
    const isCurrentTier = result.totalScore >= row.minScore && result.totalScore <= row.maxScore;

    // Available text width inside col3 is 114 - 6 = 108 mm. Text is guaranteed to wrap neatly inside.
    const actionLines = splitText(row.action, clinW.col3 - 6);
    const severityLines = splitText(row.severity, clinW.col2 - 6);

    const lineCount = Math.max(actionLines.length, severityLines.length);
    const rowH = Math.max(lineCount * 3.8 + 4, 8);

    ensureSpace(rowH + 2);

    if (isCurrentTier) {
      // Highlight row for respondent's active tier
      doc.setFillColor(255, 245, 215);
      doc.rect(MARGIN_X, y, CONTENT_W, rowH, 'F');
      doc.setDrawColor(240, 195, 110);
      doc.setLineWidth(0.4);
      doc.rect(MARGIN_X, y, CONTENT_W, rowH, 'S');
    } else {
      const isEven = rowIdx % 2 === 0;
      doc.setFillColor(isEven ? 250 : 255, isEven ? 253 : 255, isEven ? 251 : 255);
      doc.rect(MARGIN_X, y, CONTENT_W, rowH, 'F');
      doc.setDrawColor(220, 230, 225);
      doc.setLineWidth(0.2);
      doc.line(MARGIN_X, y + rowH, MARGIN_X + CONTENT_W, y + rowH);
    }

    // Column 1: Rentang Skor
    if (isCurrentTier) {
      doc.setFillColor(180, 80, 10);
      doc.circle(clinX.col1 + 4, y + 4, 1.3, 'F');

      doc.setTextColor(160, 70, 0);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.text(toPdfAscii(row.scoreRange), clinX.col1 + 7.5, y + 4.5);

      doc.setFontSize(6.2);
      doc.text('(Hasil Anda)', clinX.col1 + 7.5, y + 8);
    } else {
      doc.setTextColor(textDark[0], textDark[1], textDark[2]);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.2);
      doc.text(toPdfAscii(row.scoreRange), clinX.col1 + 4, y + 4.8);
    }

    // Column 2: Tingkat Keparahan
    doc.setFont('helvetica', isCurrentTier ? 'bold' : 'normal');
    doc.setTextColor(
      isCurrentTier ? 160 : textDark[0],
      isCurrentTier ? 70 : textDark[1],
      isCurrentTier ? 0 : textDark[2]
    );
    doc.setFontSize(7.2);
    doc.text(severityLines, clinX.col2 + 3, y + 4.5);

    // Column 3: Tindakan & Rekomendasi Klinis (Wrapped tightly inside 108mm, never overflows!)
    doc.setFont('helvetica', isCurrentTier ? 'bold' : 'normal');
    doc.setTextColor(
      isCurrentTier ? 140 : textDark[0],
      isCurrentTier ? 60 : textDark[1],
      isCurrentTier ? 0 : textDark[2]
    );
    doc.setFontSize(7.2);
    doc.text(actionLines, clinX.col3 + 3, y + 4.5);

    y += rowH;
  });

  y += 5;

  // SECTION 7: KONTAK KADER & CATATAN RAHASIA
  ensureSpace(24);

  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.roundedRect(MARGIN_X, y, CONTENT_W, 20, 2.5, 2.5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.text(
    'LAYANAN KONSULTASI & PENDAMPINGAN KADER KESEHATAN JIWA',
    MARGIN_X + 6,
    y + 5.5
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text(
    `SHG Binanga Sehat Jiwa | WhatsApp: ${WA_KADER_DISPLAY} (Wahyu Santoso & Tim Kader Keswa)`,
    MARGIN_X + 6,
    y + 11
  );
  doc.text(
    'Bawa dokumen ini saat berkonsultasi ke Puskesmas, dokter keluarga, psikolog klinis, atau psikiater.',
    MARGIN_X + 6,
    y + 16
  );

  y += 24;

  // Final Footer on Last Page
  drawFooter();

  // Save the PDF with clean naming
  const safeName =
    toPdfAscii(result.respondent.name).replace(/[^a-zA-Z0-9]/g, '_').slice(0, 25) || 'Responden';
  const prefix = isPHQ9 ? 'E-MAP_PHQ9' : 'E-MAP_GAD7';
  const fileName = `${prefix}_${safeName}_${result.totalScore}pts.pdf`;

  doc.save(fileName);
}
