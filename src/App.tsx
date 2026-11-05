import React, { useState, useEffect } from 'react';
import { TabType, RespondentInfo, ScreeningResult } from './types';
import {
  evaluatePHQ9,
  evaluateGAD7,
  GAD7_PFA_GUIDE,
  getWITADateTime,
} from './data/questionnaires';
import { Navbar } from './components/Navbar';
import { HomeSection } from './components/HomeSection';
import { ScreeningWizard } from './components/ScreeningWizard';
import { ResultDashboard } from './components/ResultDashboard';
import { HistorySection } from './components/HistorySection';
import { EmergencyModal } from './components/EmergencyModal';
import { LoadingScreen } from './components/LoadingScreen';

const STORAGE_KEY = 'emap_screening_history_v2';

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [activeResult, setActiveResult] = useState<ScreeningResult | null>(null);
  const [history, setHistory] = useState<ScreeningResult[]>([]);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to load history from localStorage', e);
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (newResult: ScreeningResult) => {
    try {
      const updated = [newResult, ...history.filter((h) => h.id !== newResult.id)].slice(0, 50);
      setHistory(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear localStorage', e);
    }
  };

  // Screening Completion Handler
  const handleCompletePHQ9 = (respondent: RespondentInfo, answers: number[]) => {
    const evalData = evaluatePHQ9(answers);
    const wita = getWITADateTime();

    const result: ScreeningResult = {
      id: `PHQ9_${Date.now()}`,
      type: 'phq9',
      title: 'Skrining Depresi PHQ-9',
      respondent,
      answers,
      totalScore: evalData.totalScore,
      maxScore: 27,
      category: evalData.category,
      severityLevel: evalData.severityLevel,
      summaryDescription: evalData.summaryDescription,
      interpretationTitle: evalData.interpretationTitle,
      interpretationText: evalData.interpretationText,
      recommendations: evalData.recommendations,
      criticalAlert: evalData.criticalAlert,
      dateFullWita: wita.full,
      timestamp: Date.now(),
    };

    saveToHistory(result);
    setActiveResult(result);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteGAD7 = (respondent: RespondentInfo, answers: number[]) => {
    const evalData = evaluateGAD7(answers);
    const wita = getWITADateTime();

    const result: ScreeningResult = {
      id: `GAD7_${Date.now()}`,
      type: 'gad7',
      title: 'Skrining Kecemasan GAD-7',
      respondent,
      answers,
      totalScore: evalData.totalScore,
      maxScore: 21,
      category: evalData.category,
      severityLevel: evalData.severityLevel,
      summaryDescription: evalData.summaryDescription,
      interpretationTitle: evalData.interpretationTitle,
      interpretationText: evalData.interpretationText,
      recommendations: evalData.recommendations,
      criticalAlert: evalData.criticalAlert,
      pfaData: GAD7_PFA_GUIDE,
      dateFullWita: wita.full,
      timestamp: Date.now(),
    };

    saveToHistory(result);
    setActiveResult(result);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabChange = (tab: TabType) => {
    setCurrentTab(tab);
    // If user clicks a tab while viewing a result from another tab, reset active result
    if (tab === 'home' || tab === 'history') {
      setActiveResult(null);
    } else if (tab === 'phq9' && activeResult?.type !== 'phq9') {
      setActiveResult(null);
    } else if (tab === 'gad7' && activeResult?.type !== 'gad7') {
      setActiveResult(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f3f8f5] text-[#243b35] flex flex-col font-sans selection:bg-[#176b58]/20 selection:text-[#176b58]">
      {/* Real-time Feature Loading Screen */}
      {isLoading && <LoadingScreen onFinish={() => setIsLoading(false)} />}

      {/* Sticky Header */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleTabChange}
        historyCount={history.length}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onShowLoadingScreen={() => setIsLoading(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-8">
        {/* TAB 1: BERANDA / HOME */}
        {currentTab === 'home' && (
          <HomeSection
            onStartPHQ9={() => {
              setActiveResult(null);
              setCurrentTab('phq9');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onStartGAD7={() => {
              setActiveResult(null);
              setCurrentTab('gad7');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* TAB 2: SKRINING PHQ-9 */}
        {currentTab === 'phq9' && (
          <div>
            {activeResult && activeResult.type === 'phq9' ? (
              <ResultDashboard
                result={activeResult}
                onRestart={() => setActiveResult(null)}
                onOpenEmergency={() => setIsEmergencyOpen(true)}
              />
            ) : (
              <ScreeningWizard
                type="phq9"
                onComplete={handleCompletePHQ9}
                onCancel={() => setCurrentTab('home')}
              />
            )}
          </div>
        )}

        {/* TAB 3: SKRINING GAD-7 (FIXED & FULLY FUNCTIONAL) */}
        {currentTab === 'gad7' && (
          <div>
            {activeResult && activeResult.type === 'gad7' ? (
              <ResultDashboard
                result={activeResult}
                onRestart={() => setActiveResult(null)}
                onOpenEmergency={() => setIsEmergencyOpen(true)}
              />
            ) : (
              <ScreeningWizard
                type="gad7"
                onComplete={handleCompleteGAD7}
                onCancel={() => setCurrentTab('home')}
              />
            )}
          </div>
        )}

        {/* TAB 4: RIWAYAT SKRINING */}
        {currentTab === 'history' && (
          <HistorySection
            history={history}
            onSelectResult={(res) => {
              setActiveResult(res);
              setCurrentTab(res.type);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onClearHistory={handleClearHistory}
            onStartPHQ9={() => {
              setActiveResult(null);
              setCurrentTab('phq9');
            }}
            onStartGAD7={() => {
              setActiveResult(null);
              setCurrentTab('gad7');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#e0eae4] bg-white/70 py-8 px-4 text-center text-xs text-[#64756e]">
        <div className="max-w-2xl mx-auto space-y-3">
          <p className="italic font-medium text-[#243b35]">
            &ldquo;Ada peran penting bagi tindakan <em>&lsquo;watchful waiting&rsquo;</em> (pengawasan aktif) pada depresi dan kecemasan yang baru muncul. Seseorang dapat memantau gejalanya sendiri secara berkala di rumah.&rdquo;
          </p>
          <div className="text-[11px] font-semibold text-[#176b58]">
            — Kurt Kroenke, M.D., MACP (JAMA Network, Vol. 317, No. 7)
          </div>
          <div className="pt-3 border-t border-[#e0eae4] text-[11px] text-[#788a82]">
            © 2026 SHG E-MAP: Emotional and Mental Awareness Platform | SHG Binanga Sehat Jiwa | GEMA Difabel Sulawesi Barat | Pusat Rehabilitasi YAKKUM
          </div>
          <div className="pt-1">
            <button
              onClick={() => setIsLoading(true)}
              className="text-[11px] font-bold text-[#176b58] hover:text-[#104f42] hover:underline inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Lihat Animasi Pemrosesan Fitur Sistem</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Crisis / Emergency Helpline Modal */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />
    </div>
  );
}
