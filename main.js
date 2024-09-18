// Application
let winX = window.innerWidth - 20;
let winY = window.innerHeight - 100;
console.log(winX, winY);
// const X = Math.min(winX, 800);
// const Y = Math.min(winY, 600);
const X = 800;
const Y = 600;

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = X;
  canvas.height = Y;

  let fcount = 0;

  function run() {
    let tStart = performance.now();

    // // Clear the canvas for a re-render
    ctx.clearRect(0, 0, X, Y);

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
