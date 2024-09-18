// Application
let winX = window.innerWidth - 20;
let winY = window.innerHeight - 100;
console.log(winX, winY);
// const X = Math.min(winX, 800);
// const Y = Math.min(winY, 600);
const X = 800;
const Y = 600;

// Environment
const N_PARTICLES = 10;

function symClip(x, v) {
  if (x < 0) {
    return Math.max(x, -v);
  }
  return Math.min(x, v);
}

class Particle {
  constructor(x, y, dx, dy) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.prevX = x;
    this.prevY = y;
    this.size = Math.random() * 10 + 5;
    this.TURB = 0.01;
    this.FRIC = 0.998;
    this.DRAG = 0.001;
    this.MAX_V = 10;
  }

  move() {
    this.prevX = this.x;
    this.prevY = this.y;
    let signX = this.dx >= 0 ? 1.0 : -1.0;
    let signY = this.dy >= 0 ? 1.0 : -1.0;
    this.dx += (Math.random() - 0.5) * 2 * this.TURB;
    this.dy += (Math.random() - 0.5) * 2 * this.TURB;
    this.dx = symClip(
      this.dx * this.FRIC - signX * this.DRAG * this.dx ** 2,
      this.MAX_V,
    );
    this.dy = symClip(
      this.dy * this.FRIC - signY * this.DRAG * this.dy ** 2,
      this.MAX_V,
    );
    this.x = (this.x + this.dx + X) % X;
    this.y = (this.y + this.dy + Y) % Y;
  }

  discrete() {
    let pX = (Math.round(this.x) + X) % X;
    let pY = (Math.round(this.y) + Y) % Y;
    return [pX, pY];
  }
}

function drawMotion(x1, y1, x2, y2, size, ctx) {
  const speed = (x2 - x1) ** 2 + (y2 - y1) ** 2;
  if (speed > 100) {
    return
  }
  // const color = `hsl(${Math.min(360 - Math.floor(speed) * 50, 360)}, 100%, 60%)`;
  // const color = `rgba(10, ${Math.min(speed * 400, 255)}, 200, 0.9)`;
  const color = `rgba(10, 200, 200, 0.9)`;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = 'rgba(230, 230, 230, 0.9)';
  ctx.beginPath();
  ctx.arc(x2, y2, size, 0, Math.PI * 2, true);
  ctx.fill();
}

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = X;
  canvas.height = Y;

  let particles = [];
  for (let i = 0; i < N_PARTICLES; i++) {
    particles.push(
      new Particle(
        Math.random() * X,
        Math.random() * Y,
        // 0, 0,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
      ),
    );
  }

  let fcount = 0;

  function run() {
    let tStart = performance.now();

    // // Clear the canvas for a re-render
    ctx.clearRect(0, 0, X, Y);

    // Move and draw each particle
    particles.forEach((p) => {
      p.move();
      drawMotion(p.prevX, p.prevY, p.x, p.y, p.size, ctx);
    });


    let tDelta = performance.now() - tStart;
    let fps = 1 / (tDelta / 1000);
    fcount++;
    if (fcount % 30 == 0) {
      console.log(
        `Rendered in ${tDelta.toFixed(1)}ms (${fps.toFixed(0)}fps) | ${fcount}`,
      );
    }
    console.log(particles[0]);

    requestAnimationFrame(run);
  }

  run();

});
