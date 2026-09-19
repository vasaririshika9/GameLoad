import React, { useState, useEffect, useRef } from 'react';
import { QrCode, Camera, Zap, CheckCircle2, ArrowRight, RefreshCw, Smartphone, Copy, AlertCircle, Link2 } from 'lucide-react';
import { Game, QrResponse } from '../types';
import { api } from '../services/api';
import { useGameLoad } from '../context/GameLoadContext';

interface QrLaunchViewProps {
  initialGameId?: string;
  onLaunchGame: (gameId: string) => void;
}

export const QrLaunchView: React.FC<QrLaunchViewProps> = ({
  initialGameId,
  onLaunchGame
}) => {
  const { games, showToast } = useGameLoad();

  const [selectedGameId, setSelectedGameId] = useState<string>(
    initialGameId || games[0]?.id || 'cyber-sprint-x'
  );

  const [qrData, setQrData] = useState<QrResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStatus, setCameraStatus] = useState<'idle' | 'active' | 'denied' | 'unavailable'>('idle');
  const [manualInputUrl, setManualInputUrl] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [scannedResult, setScannedResult] = useState<any>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const selectedGame = games.find(g => g.id === selectedGameId) || games[0];

  const fetchQr = async (gameId: string) => {
    setLoading(true);
    try {
      const data = await api.generateQr(gameId);
      setQrData(data);
    } catch (err) {
      console.error('Failed to generate QR:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedGameId) {
      fetchQr(selectedGameId);
    }
  }, [selectedGameId]);

  const startCamera = async () => {
    setValidationError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraStatus('unavailable');
      showToast('Camera API not available on this browser/insecure context.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
      setCameraStatus('active');
    } catch (err: any) {
      console.warn('Camera error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraStatus('denied');
        showToast('Camera permission was denied. Please allow camera access or use the URL fallback below.');
      } else {
        setCameraStatus('unavailable');
        showToast('Camera device unavailable or currently in use by another application.');
      }
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setCameraStatus('idle');
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const handleManualLaunch = async (inputStr: string) => {
    setValidationError(null);
    if (!inputStr.trim()) {
      setValidationError('Please enter a game ID or launch URL');
      return;
    }

    // Extract game_id from full URL or bare id
    let extractedId = inputStr.trim();
    if (extractedId.includes('/play/')) {
      const match = extractedId.match(/\/play\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) extractedId = match[1];
    }

    const matchedGame = games.find(g => g.id.toLowerCase() === extractedId.toLowerCase());
    if (!matchedGame) {
      setValidationError(`Game not found: "${extractedId}". Certified registry contains: ${games.map(g => g.id).join(', ')}`);
      return;
    }

    try {
      setLoading(true);
      const res = await api.resolveLaunch(matchedGame.id);
      setScannedResult(res);
      showToast(`Launching ${matchedGame.title} via validated URL...`);
    } catch (e: any) {
      setValidationError(`Launch resolution failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateScan = async (gameId: string) => {
    setValidationError(null);
    setLoading(true);
    try {
      const res = await api.resolveLaunch(gameId);
      setScannedResult(res);
      showToast(`Scan validated! Opening ${res.title}...`);
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-cyan-400" />
            <h1 className="font-heading text-2xl font-bold text-white">
              Scan & Play — QR Instant Launch
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Zero-delay mobile handoff: point camera at QR code, launch near-instantly with preheated cache token
          </p>
        </div>

        {/* Game Selector */}
        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
          <span className="text-xs font-mono text-slate-400">Select Game:</span>
          <select
            value={selectedGameId}
            onChange={(e) => setSelectedGameId(e.target.value)}
            className="bg-transparent text-xs font-mono text-cyan-300 focus:outline-none cursor-pointer"
          >
            {games.map((g) => (
              <option key={g.id} value={g.id} className="bg-slate-900">
                {g.title} ({g.cache_status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Split: Desktop QR Code Display vs Mobile Scanner */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Desktop QR Code Display */}
        <div className="rounded-2xl bg-slate-900/80 border border-cyan-500/20 p-6 flex flex-col items-center justify-between space-y-6 shadow-xl">
          <div className="text-center space-y-1">
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
              Desktop Lobby Display
            </span>
            <h2 className="font-heading text-xl font-bold text-white">
              {selectedGame?.title}
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Scan with any mobile phone to open directly at https://game-load.vercel.app
            </p>
          </div>

          {/* QR Code Graphic */}
          <div className="p-4 rounded-2xl bg-[#0a0e17] border-2 border-cyan-500/40 shadow-2xl shadow-cyan-950/60 relative group">
            {loading ? (
              <div className="w-56 h-56 flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
              </div>
            ) : qrData ? (
              <img
                src={qrData.qr_data_url}
                alt="QR Code"
                className="w-56 h-56 rounded-lg object-contain"
              />
            ) : null}

            <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900/90 border border-slate-700">
              <span className={`w-1.5 h-1.5 rounded-full ${selectedGame?.cache_status === 'Cached' ? 'bg-emerald-400' : 'bg-cyan-400'}`} />
              <span className="text-slate-300">{selectedGame?.cache_status}</span>
            </div>
          </div>

          {/* Target URL details */}
          <div className="w-full space-y-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-300 truncate max-w-[240px]">
                {qrData?.launch_url}
              </span>
              <button
                onClick={() => {
                  if (qrData?.launch_url) {
                    navigator.clipboard.writeText(qrData.launch_url);
                    showToast('Target URL copied to clipboard!');
                  }
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white"
              >
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </button>
            </div>

            <button
              onClick={() => onLaunchGame(selectedGameId)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:from-cyan-400 hover:to-blue-500 transition-all shadow-md shadow-cyan-500/20"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Launch On Desktop Client</span>
            </button>
          </div>
        </div>

        {/* Right: Camera Scanner & Robust Fallbacks */}
        <div className="rounded-2xl bg-slate-900/80 border border-purple-500/20 p-6 flex flex-col justify-between space-y-5 shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                Receiver Terminal
              </span>
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                Mobile Scanner & Fallback
              </span>
            </div>
            <h2 className="font-heading text-xl font-bold text-white">
              Scan & Verification Terminal
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Verify prefetch availability and launch directly upon scanning
            </p>
          </div>

          {/* Camera Viewport or Status Display */}
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950 border-2 border-dashed border-purple-500/40 flex flex-col items-center justify-center p-4 text-center">
            {isCameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="space-y-2 z-10 p-4">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-950/60 border border-purple-500/40 flex items-center justify-center text-purple-400">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-heading font-bold text-white text-sm">
                    {cameraStatus === 'denied'
                      ? 'Camera Permission Denied'
                      : cameraStatus === 'unavailable'
                      ? 'Camera Device Unavailable'
                      : 'Camera Scanner Ready'}
                  </p>
                  <p className="text-xs text-slate-400 font-mono max-w-xs mt-1">
                    {cameraStatus === 'denied'
                      ? 'Browser blocked camera access. Use the manual URL paste or simulator button below.'
                      : 'Click Start Camera or test the instant simulator action'}
                  </p>
                </div>
              </div>
            )}

            {/* Scanner Reticle Overlay */}
            <div className="absolute inset-6 border-2 border-cyan-400/40 rounded-xl pointer-events-none flex items-center justify-center">
              <div className="w-full h-0.5 bg-cyan-400 shadow-lg shadow-cyan-400 animate-scanline" />
            </div>
          </div>

          {/* Controls: Camera Toggle & 1-Click Scan Simulator */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <button
                onClick={isCameraActive ? stopCamera : startCamera}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center justify-center gap-2 transition-colors border border-slate-700"
              >
                <Camera className="w-4 h-4" />
                <span>{isCameraActive ? 'Stop Camera' : 'Start Camera'}</span>
              </button>

              <button
                onClick={() => handleSimulateScan(selectedGameId)}
                className="flex-1 py-2.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-300 text-xs font-mono flex items-center justify-center gap-2 border border-purple-500/40 transition-colors"
              >
                <Smartphone className="w-4 h-4" />
                <span>Simulate Scan Action</span>
              </button>
            </div>

            {/* Fallback 2: Manual URL / Game ID Paste (Requirement 10) */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-mono">
                <Link2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Paste Game Launch URL or Game ID Fallback:</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. /play/cyber-sprint-x or neon-striker-pro"
                  value={manualInputUrl}
                  onChange={(e) => setManualInputUrl(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={() => handleManualLaunch(manualInputUrl)}
                  className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono rounded-lg transition-colors"
                >
                  Verify & Open
                </button>
              </div>

              {validationError && (
                <p className="text-[11px] font-mono text-rose-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  <span>{validationError}</span>
                </p>
              )}
            </div>

            {/* Scanned Resolution Feedback Card */}
            {scannedResult && (
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-2 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-mono">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Validated: {scannedResult.title}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900 text-emerald-300">
                    {scannedResult.launch_mode === 'near_instant' ? '⚡ Sub-500ms Ready' : 'Optimized Progressive'}
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-mono">
                  Cache Status: <strong className="text-white">{scannedResult.cache_status}</strong> • Expected Launch: <strong className="text-cyan-400">{scannedResult.expected_load_time_ms} ms</strong>
                </p>

                <button
                  onClick={() => onLaunchGame(scannedResult.game_id)}
                  className="w-full mt-1.5 py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1 hover:bg-emerald-400 transition-colors"
                >
                  <span>Launch Playable Game Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
