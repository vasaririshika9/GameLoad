// Playable Cyber Sprint X: 2D Perspective Synthwave Highway Racer with Web Audio
export class CyberSprintGame {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animId: number | null = null;
  private audioCtx: AudioContext | null = null;

  private isRunning: boolean = false;
  private score: number = 0;
  private speed: number = 220; // km/h
  private playerX: number = 0.5; // 0 (left) to 1 (right)
  private playerTargetX: number = 0.5;
  private enemies: { x: number; y: number; speed: number; lane: number; color: string }[] = [];
  private orbs: { x: number; y: number; size: number }[] = [];
  private particles: { x: number; y: number; vx: number; vy: number; life: number; color: string }[] = [];
  private lastTime: number = 0;
  private roadOffset: number = 0;
  private keys: Record<string, boolean> = {};

  public onScoreUpdate?: (score: number, speed: number) => void;
  public onGameOver?: (finalScore: number) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.setupInputs();
  }

  private initAudio() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) this.audioCtx = new AudioCtx();
    }
  }

  private playTone(freq: number, type: OscillatorType = 'sine', duration: number = 0.15) {
    if (!this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  private setupInputs() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    this.keys[e.code] = true;
    this.initAudio();
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    this.keys[e.code] = false;
  };

  public moveLeft() {
    this.playerTargetX = Math.max(0.15, this.playerTargetX - 0.22);
  }

  public moveRight() {
    this.playerTargetX = Math.min(0.85, this.playerTargetX + 0.22);
  }

  public start() {
    this.isRunning = true;
    this.score = 0;
    this.speed = 220;
    this.playerX = 0.5;
    this.playerTargetX = 0.5;
    this.enemies = [];
    this.orbs = [];
    this.particles = [];
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  public stop() {
    this.isRunning = false;
    if (this.animId) cancelAnimationFrame(this.animId);
  }

  public destroy() {
    this.stop();
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  private spawnEnemy() {
    const lanes = [0.2, 0.4, 0.6, 0.8];
    const lane = lanes[Math.floor(Math.random() * lanes.length)];
    const colors = ['#f43f5e', '#a855f7', '#fb923c'];
    this.enemies.push({
      x: lane,
      y: 0,
      speed: 0.003 + Math.random() * 0.004,
      lane: lane,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }

  private spawnOrb() {
    const lanes = [0.25, 0.5, 0.75];
    const lane = lanes[Math.floor(Math.random() * lanes.length)];
    this.orbs.push({ x: lane, y: 0, size: 10 });
  }

  private loop = (time: number) => {
    if (!this.isRunning) return;
    const dt = Math.min(50, time - this.lastTime);
    this.lastTime = time;

    this.update(dt);
    this.draw();

    this.animId = requestAnimationFrame(this.loop);
  };

  private update(dt: number) {
    // Controls
    if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
      this.playerTargetX = Math.max(0.15, this.playerTargetX - 0.0015 * dt);
    }
    if (this.keys['ArrowRight'] || this.keys['KeyD']) {
      this.playerTargetX = Math.min(0.85, this.playerTargetX + 0.0015 * dt);
    }

    // Smooth lerp
    this.playerX += (this.playerTargetX - this.playerX) * 0.18;

    this.roadOffset += 0.008 * (this.speed / 100);
    this.score += Math.floor(dt * 0.2);

    // Spawns
    if (Math.random() < 0.02) this.spawnEnemy();
    if (Math.random() < 0.015) this.spawnOrb();

    // Update Enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      e.y += e.speed * dt * 0.12;

      // Collision check
      if (e.y > 0.75 && e.y < 0.95 && Math.abs(e.x - this.playerX) < 0.12) {
        // Crash!
        this.playTone(150, 'sawtooth', 0.3);
        this.speed = Math.max(80, this.speed - 60);
        // Spawn sparks
        for (let p = 0; p < 12; p++) {
          this.particles.push({
            x: this.playerX * this.canvas.width,
            y: this.canvas.height * 0.85,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            life: 1.0,
            color: '#ff0055'
          });
        }
        this.enemies.splice(i, 1);
        continue;
      }

      if (e.y > 1.2) this.enemies.splice(i, 1);
    }

    // Update Orbs
    for (let i = this.orbs.length - 1; i >= 0; i--) {
      const o = this.orbs[i];
      o.y += 0.004 * dt * 0.12;

      if (o.y > 0.75 && o.y < 0.95 && Math.abs(o.x - this.playerX) < 0.14) {
        this.playTone(660, 'triangle', 0.15);
        this.speed = Math.min(340, this.speed + 15);
        this.score += 500;
        for (let p = 0; p < 10; p++) {
          this.particles.push({
            x: this.playerX * this.canvas.width,
            y: this.canvas.height * 0.85,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            life: 1.0,
            color: '#00f3ff'
          });
        }
        this.orbs.splice(i, 1);
        continue;
      }

      if (o.y > 1.2) this.orbs.splice(i, 1);
    }

    // Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.04;
      if (p.life <= 0) this.particles.splice(i, 1);
    }

    if (this.onScoreUpdate) {
      this.onScoreUpdate(this.score, Math.round(this.speed));
    }
  }

  private draw() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    // Dark cyberpunk gradient sky
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.45);
    sky.addColorStop(0, '#040711');
    sky.addColorStop(1, '#1e1035');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h * 0.45);

    // Synthwave Sun on horizon
    const sunY = h * 0.38;
    const sunGrad = ctx.createLinearGradient(0, sunY - 50, 0, sunY + 50);
    sunGrad.addColorStop(0, '#f43f5e');
    sunGrad.addColorStop(0.6, '#fb923c');
    sunGrad.addColorStop(1, '#fde047');
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(w * 0.5, sunY, 55, 0, Math.PI * 2);
    ctx.fill();

    // Horizon line
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.45);
    ctx.lineTo(w, h * 0.45);
    ctx.stroke();

    // Road (perspective trapezoid)
    ctx.fillStyle = '#080d1a';
    ctx.beginPath();
    ctx.moveTo(w * 0.35, h * 0.45);
    ctx.lineTo(w * 0.65, h * 0.45);
    ctx.lineTo(w * 0.95, h);
    ctx.lineTo(w * 0.05, h);
    ctx.closePath();
    ctx.fill();

    // Perspective Road Grid Lines
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.4)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i <= 6; i++) {
      const topX = w * (0.35 + (0.3 * i) / 6);
      const botX = w * (0.05 + (0.9 * i) / 6);
      ctx.beginPath();
      ctx.moveTo(topX, h * 0.45);
      ctx.lineTo(botX, h);
      ctx.stroke();
    }

    // Horizontal moving scanlines on road
    const scanStep = 24;
    for (let y = h * 0.45; y < h; y += scanStep) {
      const progress = (y - h * 0.45) / (h * 0.55);
      const shiftedY = y + ((this.roadOffset * 120 * progress) % scanStep);
      if (shiftedY < h) {
        ctx.strokeStyle = `rgba(168, 85, 247, ${progress * 0.4})`;
        ctx.beginPath();
        ctx.moveTo(0, shiftedY);
        ctx.lineTo(w, shiftedY);
        ctx.stroke();
      }
    }

    // Draw Orbs
    for (const o of this.orbs) {
      const oy = h * (0.45 + 0.55 * o.y);
      const leftBound = w * (0.35 - 0.3 * o.y);
      const rightBound = w * (0.65 + 0.3 * o.y);
      const ox = leftBound + (rightBound - leftBound) * o.x;
      const size = 6 + o.y * 14;

      ctx.fillStyle = '#00f3ff';
      ctx.shadowColor = '#00f3ff';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(ox, oy, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Draw Enemies
    for (const e of this.enemies) {
      const ey = h * (0.45 + 0.55 * e.y);
      const leftBound = w * (0.35 - 0.3 * e.y);
      const rightBound = w * (0.65 + 0.3 * e.y);
      const ex = leftBound + (rightBound - leftBound) * e.x;
      const size = 12 + e.y * 26;

      ctx.fillStyle = e.color;
      ctx.shadowColor = e.color;
      ctx.shadowBlur = 10;
      ctx.fillRect(ex - size / 2, ey - size / 2, size, size);
      ctx.shadowBlur = 0;
    }

    // Draw Player Hovercar
    const py = h * 0.84;
    const px = w * (0.05 + 0.9 * this.playerX);
    const carW = 48;
    const carH = 26;

    // Thruster glow
    ctx.fillStyle = '#00f3ff';
    ctx.shadowColor = '#00f3ff';
    ctx.shadowBlur = 20;
    ctx.fillRect(px - carW * 0.35, py + carH * 0.6, carW * 0.7, 8);

    // Car body
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(px - carW / 2, py, carW, carH, 6);
    ctx.fill();
    ctx.stroke();

    // Cockpit windshield
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.roundRect(px - carW * 0.3, py + 4, carW * 0.6, 10, 3);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Particles
    for (const p of this.particles) {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.fillRect(p.x, p.y, 4, 4);
    }
    ctx.globalAlpha = 1.0;
  }
}
