// Playable StarVoid Arcade: Space Interceptor Bullet-Hell mini-game
export class StarVoidGame {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animId: number | null = null;
  private isRunning: boolean = false;
  private score: number = 0;
  private shield: number = 100;

  private player = { x: 0.5, y: 0.85, vx: 0, width: 36, height: 36 };
  private bullets: { x: number; y: number; vy: number }[] = [];
  private enemies: { x: number; y: number; vx: number; vy: number; hp: number; size: number }[] = [];
  private stars: { x: number; y: number; speed: number; size: number }[] = [];
  private particles: { x: number; y: number; vx: number; vy: number; life: number; color: string }[] = [];

  private keys: Record<string, boolean> = {};
  public onScoreUpdate?: (score: number, shield: number) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.setupStars();
    this.setupInputs();
  }

  private setupStars() {
    this.stars = [];
    for (let i = 0; i < 60; i++) {
      this.stars.push({
        x: Math.random(),
        y: Math.random(),
        speed: 0.001 + Math.random() * 0.003,
        size: Math.random() * 2 + 1
      });
    }
  }

  private setupInputs() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('click', this.fireBullet);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    this.keys[e.code] = true;
    if (e.code === 'Space') {
      this.fireBullet();
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    this.keys[e.code] = false;
  };

  private handleMouseMove = (e: MouseEvent) => {
    if (!this.isRunning) return;
    const rect = this.canvas.getBoundingClientRect();
    this.player.x = (e.clientX - rect.left) / this.canvas.width;
  };

  public fireBullet = () => {
    if (!this.isRunning) return;
    this.bullets.push(
      { x: this.player.x - 0.02, y: this.player.y - 0.02, vy: -0.015 },
      { x: this.player.x + 0.02, y: this.player.y - 0.02, vy: -0.015 }
    );
  };

  public start() {
    this.isRunning = true;
    this.score = 0;
    this.shield = 100;
    this.bullets = [];
    this.enemies = [];
    this.particles = [];
    this.loop();
  }

  public stop() {
    this.isRunning = false;
    if (this.animId) cancelAnimationFrame(this.animId);
  }

  public destroy() {
    this.stop();
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.canvas.removeEventListener('click', this.fireBullet);
  }

  private loop = () => {
    if (!this.isRunning) return;
    this.update();
    this.draw();
    this.animId = requestAnimationFrame(this.loop);
  };

  private update() {
    if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
      this.player.x = Math.max(0.08, this.player.x - 0.012);
    }
    if (this.keys['ArrowRight'] || this.keys['KeyD']) {
      this.player.x = Math.min(0.92, this.player.x + 0.012);
    }

    // Stars parallax
    for (const s of this.stars) {
      s.y += s.speed;
      if (s.y > 1) s.y = 0;
    }

    // Bullets
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      this.bullets[i].y += this.bullets[i].vy;
      if (this.bullets[i].y < -0.05) this.bullets.splice(i, 1);
    }

    // Spawn enemies
    if (Math.random() < 0.035) {
      this.enemies.push({
        x: 0.1 + Math.random() * 0.8,
        y: -0.05,
        vx: (Math.random() - 0.5) * 0.003,
        vy: 0.003 + Math.random() * 0.004,
        hp: 2,
        size: 26
      });
    }

    const w = this.canvas.width;
    const h = this.canvas.height;

    // Update Enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      e.y += e.vy;
      e.x += e.vx;

      // Check collision with bullets
      const ex = e.x * w;
      const ey = e.y * h;
      for (let b = this.bullets.length - 1; b >= 0; b--) {
        const bx = this.bullets[b].x * w;
        const by = this.bullets[b].y * h;
        if (Math.abs(bx - ex) < e.size && Math.abs(by - ey) < e.size) {
          e.hp--;
          this.bullets.splice(b, 1);
          if (e.hp <= 0) {
            this.score += 250;
            if (this.onScoreUpdate) this.onScoreUpdate(this.score, this.shield);
            for (let p = 0; p < 14; p++) {
              this.particles.push({
                x: ex,
                y: ey,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 1.0,
                color: '#a855f7'
              });
            }
            this.enemies.splice(i, 1);
            break;
          }
        }
      }

      // Check collision with player
      const px = this.player.x * w;
      const py = this.player.y * h;
      if (Math.abs(px - ex) < e.size + 15 && Math.abs(py - ey) < e.size + 15) {
        this.shield = Math.max(0, this.shield - 20);
        if (this.onScoreUpdate) this.onScoreUpdate(this.score, this.shield);
        this.enemies.splice(i, 1);
      }

      if (e.y > 1.1) this.enemies.splice(i, 1);
    }

    // Particles
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

    // Space Void
    ctx.fillStyle = '#050711';
    ctx.fillRect(0, 0, w, h);

    // Stars
    ctx.fillStyle = '#ffffff';
    for (const s of this.stars) {
      ctx.fillRect(s.x * w, s.y * h, s.size, s.size);
    }

    // Bullets (Plasma cyan lasers)
    ctx.fillStyle = '#00f3ff';
    ctx.shadowColor = '#00f3ff';
    ctx.shadowBlur = 10;
    for (const b of this.bullets) {
      ctx.fillRect(b.x * w - 2, b.y * h - 10, 4, 16);
    }
    ctx.shadowBlur = 0;

    // Enemies (Alien Swarm)
    for (const e of this.enemies) {
      ctx.fillStyle = '#a855f7';
      ctx.shadowColor = '#ec4899';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(e.x * w, e.y * h + e.size / 2);
      ctx.lineTo(e.x * w - e.size / 2, e.y * h - e.size / 2);
      ctx.lineTo(e.x * w + e.size / 2, e.y * h - e.size / 2);
      ctx.closePath();
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    // Player Ship (Interceptor)
    const px = this.player.x * w;
    const py = this.player.y * h;

    ctx.fillStyle = '#38bdf8';
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(px, py - 20);
    ctx.lineTo(px - 18, py + 14);
    ctx.lineTo(px, py + 8);
    ctx.lineTo(px + 18, py + 14);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Engine plume
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(px - 4, py + 10, 8, 8);

    // Particles
    for (const p of this.particles) {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.fillRect(p.x, p.y, 4, 4);
    }
    ctx.globalAlpha = 1.0;
  }
}
