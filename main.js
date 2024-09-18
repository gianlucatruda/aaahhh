// Application
let winX = window.innerWidth - 20;
let winY = window.innerHeight - 200;
console.log(winX, winY);
const X = Math.min(winX, 800);
const Y = Math.min(winY, 600);
const TIME = 45;
const MARGIN = 5;

// Environment
const N_PARTICLES = 10;

function symClip(x, v) {
  if (x < 0) {
    return Math.max(x, -v);
  }
  return Math.min(x, v);
}

class Particle {
  constructor(chaos) {
    this.C = chaos;
    this.x = Math.random() * X;
    this.y = Math.random() * Y;
    this.dx = (Math.random() * 2 - 1) * this.C;
    this.dy = (Math.random() * 2 - 1) * this.C;
    this.prevX = this.x;
    this.prevY = this.y;
    this.size = Math.random() * 10 + 5;
    this.TURB = (0.05) * this.C;
    this.FRIC = 0.998;
    this.DRAG = 0.001;
    this.MAX_V = 10;
    this.R = Math.floor(Math.random() * 255);
    this.G = Math.floor(Math.random() * 255);
    this.B = Math.floor(Math.random() * 255);
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

function drawParticle(p, ctx) {
  ctx.fillStyle = `rgba(${p.R}, ${p.G}, ${p.B}, 0.9)`;
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2, true);
  ctx.fill();
}


document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = X;
  canvas.height = Y;

  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  function playBeep(duration, frequency, volume, decay) {
    let oscillator = audioContext.createOscillator();
    let gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = "sine";
    oscillator.start();

    gainNode.gain.setValueAtTime(volume, audioContext.currentTime + decay);

    setTimeout(() => { oscillator.stop() }, duration);
  }

  function playTick() {
    playBeep(10, 1000, 0.1, 0.001);
  }
  function playPop() {
    playBeep(50, 250, 0.3, 0.004);
  }

  let score = 0;
  const scoreDisplay = document.getElementById('score');

  let remainingTime = TIME;
  const timerDisplay = document.getElementById('timer');

  let particles = [];
  for (let i = 0; i < N_PARTICLES; i++) {
    particles.push(
      new Particle(1),
    );
  }

  let fcount = 0;
  let gameActive = true;
  updateTimer();

  canvas.addEventListener('click', function(event) {
    if (!gameActive) {
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      const distance = Math.sqrt((p.x - x) ** 2 + (p.y - y) ** 2);
      if (distance < p.size + MARGIN) {
        playPop();
        particles.splice(i, 1); // Remove the particle
        score += 1; // Increment the score
        scoreDisplay.textContent = score; // Update score display
        break; // Stop checking once a particle has been found and removed
      }
    }
  });

  function updateTimer() {
    if (remainingTime > 0) {
      setTimeout(() => {
        remainingTime--;
        timerDisplay.textContent = remainingTime;
        playTick();
        updateTimer();
      }, 1000); // Update every second
    } else {
      gameActive = false;
      alert("Time's up! Your final score is: " + score);
      location.reload();
    }
  }

  function run() {
    let tStart = performance.now();

    // // Clear the canvas for a re-render
    ctx.clearRect(0, 0, X, Y);

    // Move and draw each particle
    particles.forEach((p) => {
      p.move();
      drawParticle(p, ctx);
    });

    if (particles.length < N_PARTICLES) {
      particles.push(new Particle(
        ((TIME - remainingTime) / TIME) * 10.0
      ));
    }

    let tDelta = performance.now() - tStart;
    let fps = 1 / (tDelta / 1000);
    fcount++;
    if (fcount % 30 == 0) {
      console.log(
        `Rendered in ${tDelta.toFixed(1)}ms (${fps.toFixed(0)}fps) | ${fcount}`,
      );
    }

    requestAnimationFrame(run);
  }

  run();

});
