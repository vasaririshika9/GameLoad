import React, { useState, useEffect } from 'react';
import { X, QrCode, Copy, ExternalLink, Zap, RefreshCw } from 'lucide-react';
import { Game, QrResponse } from '../types';
import { api } from '../services/api';
import { useGameLoad } from '../context/GameLoadContext';

interface QrModalProps {
  game: Game | null;
  isOpen: boolean;
  onClose: () => void;
  onLaunch: (gameId: string) => void;
}

export const QrModal: React.FC<QrModalProps> = ({
  game,
  isOpen,
  onClose,
  onLaunch
}) => {
  const { showToast } = useGameLoad();
  const [qrData, setQrData] = useState<QrResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && game) {
      setLoading(true);
      api.generateQr(game.id)
        .then(setQrData)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isOpen, game]);

  if (!isOpen || !game) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0b1324] border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/90 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <QrCode className="w-5 h-5 text-cyan-400" />
            <h3 className="font-heading text-base font-bold text-white">
              Scan & Play: {game.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center text-center space-y-4">
          <div className="p-3 bg-[#070a12] rounded-2xl border border-cyan-500/30 shadow-xl">
            {loading ? (
              <div className="w-48 h-48 flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
              </div>
            ) : qrData ? (
              <img
                src={qrData.qr_data_url}
                alt="QR Code"
                className="w-48 h-48 rounded-lg object-contain"
              />
            ) : null}
          </div>

          <div>
            <span className="text-xs font-mono text-cyan-300">
              Scan with your phone to launch immediately
            </span>
            <p className="text-[11px] text-slate-400 font-mono mt-1">
              Cache Status on Device: <strong className="text-white">{game.cache_status}</strong>
            </p>
          </div>

          <div className="w-full flex items-center gap-2">
            <button
              onClick={() => {
                if (qrData?.launch_url) {
                  navigator.clipboard.writeText(qrData.launch_url);
                  showToast('Launch URL copied to clipboard!');
                }
              }}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Link</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onLaunch(game.id);
              }}
              className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Play on PC</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
