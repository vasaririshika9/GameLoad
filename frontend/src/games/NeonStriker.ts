// Playable Neon Striker Pro: Cyber Soccer Target Shootout
export class NeonStrikerGame {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animId: number | null = null;
  private isRunning: boolean = false;
  private score: number = 0;
  private streak: number = 0;

  private ball = { x: 0.5, y: 0.85, vx: 0, vy: 0, radius: 14, inFlight: false };
  private goalKeeper = { x: 0.5, y: 0.22, vx: 0.005, width: 70, height: 18 };
  private targets: { x: number; y: number; r: number; points: number; hit: boolean }[] = [];
  private particles: { x: number; y: number; vx: number; vy: number; life: number; color: string }[] = [];

  public onScoreUpdate?: (score: number, streak: number) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.setupInputs();
    this.resetTargets();
  }

  private resetTargets() {
    this.targets = [
      { x: 0.22, y: 0.18, r: 24, points: 500, hit: false },
      { x: 0.78, y: 0.18, r: 24, points: 500, hit: false },
      { x: 0.50, y: 0.12, r: 20, points: 1000, hit: false },
    ];
  }

  private setupInputs() {
    this.canvas.addEventListener('click', this.handleClick);
  }

  private handleClick = (e: MouseEvent) => {
    if (!this.isRunning || this.ball.inFlight) return;
    const rect = this.canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / this.canvas.width;
    const clickY = (e.clientY - rect.top) / this.canvas.height;

    // Shoot ball toward target click
    const dx = clickX - this.ball.x;
    const dy = clickY - this.ball.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    this.ball.vx = (dx / dist) * 0.016;
    this.ball.vy = (dy / dist) * 0.016;
    this.ball.inFlight = true;
  };

  public shootAt(targetXRatio: number) {
    if (this.ball.inFlight) return;
    const dx = targetXRatio - this.ball.x;
    const dy = 0.18 - this.ball.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    this.ball.vx = (dx / dist) * 0.016;
    this.ball.vy = (dy / dist) * 0.016;
    this.ball.inFlight = true;
  }

  public start() {
    this.isRunning = true;
    this.score = 0;
    this.streak = 0;
    this.resetBall();
    this.resetTargets();
    this.loop();
  }

  public stop() {
    this.isRunning = false;
    if (this.animId) cancelAnimationFrame(this.animId);
  }

  public destroy() {
    this.stop();
    this.canvas.removeEventListener('click', this.handleClick);
  }

  private resetBall() {
    this.ball.x = 0.5;
    this.ball.y = 0.85;
    this.ball.vx = 0;
    this.ball.vy = 0;
    this.ball.inFlight = false;
  }

  private loop = () => {
    if (!this.isRunning) return;
    this.update();
    this.draw();
    this.animId = requestAnimationFrame(this.loop);
  };

  private update() {
    // Move Goalkeeper shield
    this.goalKeeper.x += this.goalKeeper.vx;
    if (this.goalKeeper.x < 0.25 || this.goalKeeper.x > 0.75) {
      this.goalKeeper.vx *= -1;
    }

    if (this.ball.inFlight) {
      this.ball.x += this.ball.vx;
      this.ball.y += this.ball.vy;

      // Check Goalkeeper block
      const w = this.canvas.width;
      const h = this.canvas.height;
      const bx = this.ball.x * w;
      const by = this.ball.y * h;
      const gx = this.goalKeeper.x * w;
      const gy = this.goalKeeper.y * h;

      if (
        Math.abs(bx - gx) < this.goalKeeper.width / 2 + this.ball.radius &&
        Math.abs(by - gy) < this.goalKeeper.height / 2 + this.ball.radius
      ) {
        // Blocked!
        this.streak = 0;
        this.resetBall();
      }

      // Check Target Hit
      for (const t of this.targets) {
        if (!t.hit) {
          const tx = t.x * w;
          const ty = t.y * h;
          const d = Math.sqrt((bx - tx) ** 2 + (by - ty) ** 2);
          if (d < t.r + this.ball.radius) {
            t.hit = true;
            this.streak++;
            const pts = t.points * Math.max(1, this.streak);
            this.score += pts;
            if (this.onScoreUpdate) this.onScoreUpdate(this.score, this.streak);

            // Explosive particles
            for (let i = 0; i < 20; i++) {
              this.particles.push({
                x: tx,
                y: ty,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 1.0,
                color: '#10b981'
              });
            }
            setTimeout(() => {
              this.resetBall();
              if (this.targets.every(tg => tg.hit)) this.resetTargets();
            }, 250);
            break;
          }
        }
      }

      // Out of bounds
      if (this.ball.y < 0.05 || this.ball.x < 0 || this.ball.x > 1) {
        this.resetBall();
      }
    }

    // Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.03;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
  }

  private draw() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    // Arena Turf Gradient
    const turf = ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, w * 0.7);
    turf.addColorStop(0, '#06281e');
    turf.addColorStop(1, '#03140e');
    ctx.fillStyle = turf;
    ctx.fillRect(0, 0, w, h);

    // Goal Frame
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
    ctx.lineWidth = 3;
    ctx.strokeRect(w * 0.15, h * 0.08, w * 0.7, h * 0.22);

    // Goal Net lines
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.15)';
    ctx.lineWidth = 1;
    for (let x = w * 0.15; x <= w * 0.85; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, h * 0.08);
      ctx.lineTo(x, h * 0.3);
      ctx.stroke();
    }

    // Targets
    for (const t of this.targets) {
      if (!t.hit) {
        ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(t.x * w, t.y * h, t.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(`+${t.points}`, t.x * w, t.y * h + 4);
      }
    }

    // Goalkeeper Barrier
    ctx.fillStyle = '#f59e0b';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 12;
    ctx.fillRect(
      this.goalKeeper.x * w - this.goalKeeper.width / 2,
      this.goalKeeper.y * h - this.goalKeeper.height / 2,
      this.goalKeeper.width,
      this.goalKeeper.height
    );
    ctx.shadowBlur = 0;

    // Ball
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#00f3ff';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(this.ball.x * w, this.ball.y * h, this.ball.radius, 0, Math.PI * 2);
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
