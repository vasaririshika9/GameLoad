import React, { useState, useEffect } from 'react';
import { GameLoadProvider, useGameLoad } from './context/GameLoadContext';
import { Navbar } from './components/Navbar';
import { LobbyView } from './views/LobbyView';
import { InfrastructureView } from './views/InfrastructureView';
import { AnalyticsView } from './views/AnalyticsView';
import { QrLaunchView } from './views/QrLaunchView';
import { PlayView } from './views/PlayView';
import { GameDetailView } from './views/GameDetailView';
import { OptimizationPipelineModal } from './components/OptimizationPipelineModal';
import { QrModal } from './components/QrModal';
import { Game } from './types';

const MainApp: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('lobby');
  const [activeGameId, setActiveGameId] = useState<string>('cyber-sprint-x');
  const [inspectGameId, setInspectGameId] = useState<string>('cyber-sprint-x');
  const [qrModalGame, setQrModalGame] = useState<Game | null>(null);

  const { openOptimizationModal, setOpenOptimizationModal } = useGameLoad();

  // Parse direct URL path on mount (handles mobile QR launch e.g. /play/:gameId)
  useEffect(() => {
    const parseRoute = () => {
      const path = window.location.pathname;
      const parts = path.split('/').filter(Boolean);

      if (parts[0] === 'play' && parts[1]) {
        setActiveGameId(parts[1]);
        setCurrentTab('play');
      } else if (parts[0] === 'game' && parts[1]) {
        setInspectGameId(parts[1]);
        setCurrentTab('detail');
      } else if (parts[0] === 'infrastructure') {
        setCurrentTab('infrastructure');
      } else if (parts[0] === 'analytics') {
        setCurrentTab('analytics');
      } else if (parts[0] === 'scan' || parts[0] === 'qr') {
        if (parts[1]) setActiveGameId(parts[1]);
        setCurrentTab('scan');
      } else {
        setCurrentTab('lobby');
      }
    };

    parseRoute();
    window.addEventListener('popstate', parseRoute);
    return () => window.removeEventListener('popstate', parseRoute);
  }, []);

  const navigateToTab = (tab: string, urlPath?: string) => {
    setCurrentTab(tab);
    const path = urlPath || (tab === 'lobby' ? '/' : `/${tab}`);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlayGame = (gameId: string) => {
    setActiveGameId(gameId);
    navigateToTab('play', `/play/${gameId}`);
  };

  const handleInspectGame = (gameId: string) => {
    setInspectGameId(gameId);
    navigateToTab('detail', `/game/${gameId}`);
  };

  const handleOpenQrModal = (game: Game) => {
    setQrModalGame(game);
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={navigateToTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === 'lobby' && (
          <LobbyView
            onPlayGame={handlePlayGame}
            onInspectGame={handleInspectGame}
            onOpenQrModal={handleOpenQrModal}
          />
        )}

        {currentTab === 'play' && (
          <PlayView
            gameId={activeGameId}
            onExit={() => navigateToTab('lobby', '/')}
            onSwitchGame={handlePlayGame}
          />
        )}

        {currentTab === 'detail' && (
          <GameDetailView
            gameId={inspectGameId}
            onBack={() => navigateToTab('lobby', '/')}
            onPlay={handlePlayGame}
            onOpenQr={handleOpenQrModal}
          />
        )}

        {currentTab === 'infrastructure' && <InfrastructureView />}

        {currentTab === 'analytics' && <AnalyticsView />}

        {currentTab === 'scan' && (
          <QrLaunchView
            initialGameId={activeGameId}
            onLaunchGame={handlePlayGame}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-[#060910] py-6 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-slate-400 font-medium">GameLoad AI Platform</span>
            <span>•</span>
            <span>Predictive 500ms Gaming Infrastructure</span>
          </div>
          <p className="text-slate-400">
            Dijkstra Routing • 0/1 Knapsack Cache • Markov Intent AI
          </p>
        </div>
      </footer>

      {/* Global Orchestrator Modal ("Run Optimization") */}
      <OptimizationPipelineModal
        isOpen={openOptimizationModal}
        onClose={() => setOpenOptimizationModal(false)}
        onLaunchGame={handlePlayGame}
      />

      {/* Global Game QR Code Modal */}
      <QrModal
        game={qrModalGame}
        isOpen={!!qrModalGame}
        onClose={() => setQrModalGame(null)}
        onLaunch={handlePlayGame}
      />
    </div>
  );
};

export default function App() {
  return (
    <GameLoadProvider>
      <MainApp />
    </GameLoadProvider>
  );
}
