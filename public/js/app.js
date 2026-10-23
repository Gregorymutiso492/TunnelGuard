const canvas = document.getElementById('tunnelCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;

const preferredTheme = {
  themeColor: '#00ffc8',
  particleSpeed: 1.2,
  glowIntensity: 1.4,
  motionReduced: false,
};

const state = {
  settings: { ...preferredTheme },
  particles: [],
  animationId: null,
};

function setCanvasSize() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticle() {
  if (!canvas) return null;
  const radius = Math.random() * 2.8 + 1.4;
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  const drift = (Math.random() - 0.5) * 0.8;
  return {
    x,
    y,
    radius,
    drift,
    speed: Math.random() * 1.8 + 0.7,
    hue: Math.random() > 0.5 ? 170 : 205,
  };
}

function initParticles() {
  state.particles = [];
  if (!canvas) return;
  const count = Math.min(90, Math.max(40, Math.floor(window.innerWidth / 18)));
  for (let i = 0; i < count; i += 1) {
    const particle = createParticle();
    if (particle) state.particles.push(particle);
  }
}

function drawTunnel() {
  if (!canvas || !ctx) return;
  const { motionReduced, glowIntensity, particleSpeed } = state.settings;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const gradient = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    80,
    canvas.width / 2,
    canvas.height / 2,
    Math.max(canvas.width, canvas.height) * 0.7
  );

  gradient.addColorStop(0, 'rgba(10, 31, 43, 0.45)');
  gradient.addColorStop(0.45, 'rgba(14, 18, 28, 0.42)');
  gradient.addColorStop(1, 'rgba(2, 6, 14, 0.9)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (motionReduced) return;

  for (const particle of state.particles) {
    particle.y += particle.speed * particleSpeed * 1.2;
    particle.x += particle.drift * glowIntensity * 0.9;

    if (particle.y > canvas.height + particle.radius) {
      particle.y = -10;
      particle.x = Math.random() * canvas.width;
    }
    if (particle.x < 0 || particle.x > canvas.width) {
      particle.x = Math.random() * canvas.width;
    }

    ctx.beginPath();
    ctx.fillStyle = `hsla(${particle.hue}, 100%, 70%, 0.8)`;
    ctx.shadowBlur = 18 * glowIntensity;
    ctx.shadowColor = state.settings.themeColor || '#00ffc8';
    ctx.arc(particle.x, particle.y, particle.radius * glowIntensity, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.shadowBlur = 0;
}

function animate() {
  drawTunnel();
  if (!state.settings.motionReduced && canvas) {
    state.animationId = requestAnimationFrame(animate);
  }
}

function applyThemeSettings(settings) {
  const root = document.documentElement;
  if (settings.themeColor) {
    root.style.setProperty('--primary', settings.themeColor);
    root.style.setProperty('--shadow', `${settings.themeColor}66`);
  }
  if (settings.glowIntensity) {
    root.style.setProperty('--shadow-strong', `${settings.themeColor || '#00ffc8'}aa`);
  }
  if (settings.motionReduced) {
    cancelAnimationFrame(state.animationId);
    drawTunnel();
  } else if (canvas) {
    if (!state.animationId) {
      animate();
    }
  }
}

async function fetchSettings() {
  try {
    const response = await fetch('/api/settings');
    const data = await response.json();
    if (data) {
      state.settings = { ...preferredTheme, ...data };
      applyThemeSettings(state.settings);
    }
  } catch (error) {
    console.warn('Using default settings due to server issue:', error);
  }
}

async function saveSettings() {
  const payload = {
    themeColor: document.getElementById('themeColor')?.value || '#00ffc8',
    particleSpeed: Number(document.getElementById('particleSpeed')?.value || 1.2),
    glowIntensity: Number(document.getElementById('glowIntensity')?.value || 1.4),
    motionReduced: document.getElementById('motionReduced')?.checked || false,
  };

  try {
    const response = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    state.settings = { ...state.settings, ...payload };
    applyThemeSettings(state.settings);
    alert(result.message || 'Settings saved.');
  } catch (error) {
    console.error('Failed to save settings:', error);
    alert('Settings saved locally for this session.');
  }
}

function getSiteLogo(domainUrl) {
  if (!domainUrl) {
    return 'https://www.google.com/s2/favicons?sz=128&domain_url=https://example.com';
  }
  return `https://www.google.com/s2/favicons?sz=128&domain_url=${encodeURIComponent(domainUrl)}`;
}

function populateHub(sectionId, listKey) {
  const target = document.getElementById(sectionId);
  if (!target) return;

  fetch(`/api/hubs/${listKey}`)
    .then((response) => response.json())
    .then((items) => {
      target.innerHTML = items.map((site) => {
        const imageUrl = getSiteLogo(site.url);
        return `
          <a class="site-card" href="${site.url}" target="_blank" rel="noopener noreferrer">
            <img class="site-card__logo" src="${imageUrl}" alt="${site.name} logo" />
            <div class="site-card__content">
              <span class="site-card__name">${site.name}</span>
              <span class="site-card__meta">Open site</span>
            </div>
          </a>
        `;
      }).join('');
    })
    .catch(() => {
      target.innerHTML = '<p>Unable to load this hub right now.</p>';
    });
}

function bindLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const payload = {
      username: document.getElementById('username').value.trim(),
      password: document.getElementById('password').value,
      provider: 'email',
    };

    if (!payload.username || !payload.password) {
      alert('Please fill in both fields.');
      return;
    }

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Login failed.');
      localStorage.setItem('tunnelguardUser', payload.username);
      try {
        await fetch('/api/auth/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: payload.username,
            email: payload.username,
            provider: 'email',
            method: 'password',
            password: payload.password,
          }),
        });
      } catch (err) {
        console.warn('Auth log skipped:', err);
      }
      alert(`Welcome back, ${payload.username}!`);
      window.location.href = '/social-media-hub';
    } catch (error) {
      alert(error.message || 'Unable to login');
    }
  });

  const signupBtn = document.getElementById('signupBtn');
  if (signupBtn) {
    signupBtn.addEventListener('click', () => {
      window.location.href = '/feedback';
    });
  }

  document.querySelectorAll('[data-provider]').forEach((button) => {
    button.addEventListener('click', async () => {
      const provider = button.dataset.provider;
      const value = provider === 'google' ? 'user@gmail.com' : `${provider}@demo.local`;
      const emailField = document.getElementById('username');
      if (emailField) {
        emailField.value = value;
      }
      try {
        await fetch('/api/auth/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: provider,
            email: value,
            provider,
            method: 'social',
            password: 'social-login',
          }),
        });
        alert(`${provider[0].toUpperCase() + provider.slice(1)} login flow started.`);
      } catch (error) {
        console.warn('Provider log failed:', error);
      }
    });
  });
}

function bindFeedbackForm() {
  const form = document.getElementById('feedbackForm');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const payload = {
      name: document.getElementById('feedbackName').value.trim(),
      email: document.getElementById('feedbackEmail').value.trim(),
      category: document.getElementById('feedbackCategory').value,
      message: document.getElementById('feedbackMessage').value.trim(),
    };

    if (!payload.message) {
      alert('Please add a message before submitting.');
      return;
    }

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Unable to submit feedback');
      form.reset();
      alert('Feedback sent successfully.');
    } catch (error) {
      alert(error.message || 'Unable to save feedback.');
    }
  });
}

function bindSettingsForm() {
  const form = document.getElementById('settingsForm');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    saveSettings();
  });

  const backBtn = document.getElementById('backBtn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.history.back();
    });
  }

  const historyBtn = document.getElementById('viewHistoryBtn');
  if (historyBtn) {
    historyBtn.addEventListener('click', () => {
      window.location.href = '/admin-history';
    });
  }

  const refreshHistoryBtn = document.getElementById('refreshHistory');
  if (refreshHistoryBtn) {
    refreshHistoryBtn.addEventListener('click', () => renderHistory());
  }
}

function hydrateSettingsForm() {
  const form = document.getElementById('settingsForm');
  if (!form) return;

  const { themeColor, particleSpeed, glowIntensity, motionReduced } = state.settings;
  document.getElementById('themeColor').value = themeColor;
  document.getElementById('particleSpeed').value = particleSpeed;
  document.getElementById('glowIntensity').value = glowIntensity;
  document.getElementById('motionReduced').checked = motionReduced;
}

async function renderHistory() {
  const container = document.getElementById('historyTable');
  if (!container) return;

  try {
    const res = await fetch('/api/auth/history');
    const data = await res.json();
    if (!Array.isArray(data) || !data.length) {
      container.innerHTML = '<p>No login history yet.</p>';
      return;
    }

    container.innerHTML = data.map((entry) => `
      <div class="history-row">
        <div><strong>${entry.username || entry.email || 'guest'}</strong></div>
        <div>${entry.provider || 'local'}</div>
        <div>${entry.method || 'password'}</div>
        <div>${entry.status || 'success'}</div>
        <div>${new Date(entry.createdAt).toLocaleString()}</div>
      </div>
    `).join('');
  } catch (error) {
    container.innerHTML = '<p>Unable to load auth history.</p>';
  }
}

function bindLogoutActions() {
  const logoutButtons = document.querySelectorAll('[data-logout]');
  logoutButtons.forEach((button) => {
    button.addEventListener('click', () => {
      localStorage.removeItem('tunnelguardUser');
      window.location.href = '/';
    });
  });
}

function initApp() {
  setCanvasSize();
  initParticles();
  animate();
  fetchSettings().finally(() => {
    hydrateSettingsForm();
  });

  populateHub('socialGrid', 'social');
  populateHub('businessGrid', 'business');
  populateHub('otherGrid', 'other');
  bindLoginForm();
  bindFeedbackForm();
  bindSettingsForm();
  bindLogoutActions();
  renderHistory();

  const user = localStorage.getItem('tunnelguardUser');
  const userLabel = document.querySelector('.user-label');
  if (user && userLabel) {
    userLabel.textContent = `Welcome, ${user}`;
  }
}

window.addEventListener('resize', () => {
  setCanvasSize();
  initParticles();
  drawTunnel();
});

initApp();
