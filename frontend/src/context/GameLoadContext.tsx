import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Game, NetworkMode, PredictionResult } from '../types';
import { api } from '../services/api';

interface GameLoadContextType {
  games: Game[];
  loading: boolean;
  networkMode: NetworkMode;
  setNetworkMode: (mode: NetworkMode) => void;
  userProfile: string;
  setUserProfile: (profile: string) => void;
  prediction: PredictionResult | null;
  refreshPrediction: () => Promise<void>;
  refreshGames: () => Promise<void>;
  openOptimizationModal: boolean;
  setOpenOptimizationModal: (open: boolean) => void;
  cacheCapacityMb: number;
  setCacheCapacityMb: (cap: number) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  triggerQuickPrefetch: (gameId: string) => Promise<void>;
}

const GameLoadContext = createContext<GameLoadContextType | undefined>(undefined);

export const GameLoadProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [networkMode, setNetworkMode] = useState<NetworkMode>('fast');
  const [userProfile, setUserProfile] = useState<string>('racing_enthusiast');
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [openOptimizationModal, setOpenOptimizationModal] = useState(false);
  const [cacheCapacityMb, setCacheCapacityMb] = useState(500);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const refreshGames = async () => {
    try {
      const data = await api.getGames();
      setGames(data);
    } catch (err) {
      console.error('Error fetching games:', err);
    }
  };

  const refreshPrediction = async () => {
    try {
      const pred = await api.predictNextGame({
        user_profile: userProfile,
        last_played_game_id: 'cyber-sprint-x'
      });
      setPrediction(pred);
    } catch (err) {
      console.error('Error fetching prediction:', err);
    }
  };

  const triggerQuickPrefetch = async (gameId: string) => {
    try {
      showToast(`Prefetching high-priority assets for ${gameId}...`);
      await api.prefetchGames({ game_ids: [gameId], network_mode: networkMode });
      await refreshGames();
      showToast(`⚡ Assets ready in memory cache for ${gameId}!`);
    } catch (err) {
      showToast(`Error prefetching: ${err}`);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([refreshGames(), refreshPrediction()]);
      setLoading(false);
    };
    init();
  }, [userProfile]);

  return (
    <GameLoadContext.Provider
      value={{
        games,
        loading,
        networkMode,
        setNetworkMode,
        userProfile,
        setUserProfile,
        prediction,
        refreshPrediction,
        refreshGames,
        openOptimizationModal,
        setOpenOptimizationModal,
        cacheCapacityMb,
        setCacheCapacityMb,
        toastMessage,
        showToast,
        triggerQuickPrefetch
      }}
    >
      {children}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900/95 border border-cyan-500/50 text-cyan-200 px-5 py-3 rounded-xl shadow-2xl shadow-cyan-950/80 backdrop-blur-md animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-mono text-sm">{toastMessage}</span>
        </div>
      )}
    </GameLoadContext.Provider>
  );
};

export const useGameLoad = () => {
  const ctx = useContext(GameLoadContext);
  if (!ctx) throw new Error('useGameLoad must be used within GameLoadProvider');
  return ctx;
};
