// Tunnel particle animation
const canvas = document.getElementById("tunnelCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.radius = 4;
    this.color = color;
    this.speed = Math.random() * 2 + 1;
  }
  update() {
    this.y -= this.speed;
    if (this.y < 0) {
      this.y = canvas.height;
      this.color = Math.random() > 0.5 ? "red" : "#00ffb4";
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 20;
    ctx.shadowColor = this.color;
    ctx.fill();
  }
}

let particles = [];
for (let i = 0; i < 40; i++) {
  particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height, "red"));
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animate);
}
animate();

// Login form handler
document.getElementById("loginForm").addEventListener("submit", function(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  alert(`Welcome to TunnelGuard, ${username}! 🔐`);
});
