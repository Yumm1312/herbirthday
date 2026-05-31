// ── Stars ──
  const sc = document.getElementById('starsContainer');
  for (let i = 0; i < 55; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const sz = 1.5 + Math.random() * 2.5;
    s.style.cssText = `width:${sz}px;height:${sz}px;top:${Math.random()*100}%;left:${Math.random()*100}%;--d:${2+Math.random()*3}s;--dl:${Math.random()*4}s;`;
    sc.appendChild(s);
  }

  // ── Cursor ──
  const cur = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  let mx = window.innerWidth/2, my = window.innerHeight/2;
  let rx = mx, ry = my;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function animC() {
    cur.style.left = mx+'px'; cur.style.top = my+'px';
    rx += (mx-rx)*0.13; ry += (my-ry)*0.13;
    ring.style.left = rx+'px'; ring.style.top = ry+'px';
    requestAnimationFrame(animC);
  })();

  // ── Confetti ──
  function boom(n=60) {
    const cc = document.getElementById('confettiContainer');
    const cols = ['#f43f7e','#c084fc','#f59e0b','#67e8f9','#4ade80','#fda4c1','#fde68a'];
    for (let i = 0; i < n; i++) {
      const p = document.createElement('div');
      p.className = 'cp';
      const c = cols[Math.floor(Math.random()*cols.length)];
      const circle = Math.random()>0.5;
      p.style.cssText = `left:${Math.random()*100}vw;top:-10px;background:${c};border-radius:${circle?'50%':'2px'};width:${6+Math.random()*8}px;height:${6+Math.random()*8}px;animation-duration:${2.5+Math.random()*2.5}s;animation-delay:${Math.random()*0.8}s;`;
      cc.appendChild(p);
      setTimeout(()=>p.remove(), 5000);
    }
  }

  // ── Questions ──
  const questions = [
    {
      emoji: '🧠',
      text: "I'm smarter than you, right?",
      yes: { emoji: '🎉', title: 'Obviously correct!', sub: 'Science agrees. Studies confirm. Case closed.' }
    },
    {
      emoji: '👑',
      text: "I'm the better-looking one between us, yeah?",
      yes: { emoji: '💅', title: 'Undeniably true!', sub: "Don't fight facts. It's just science again." }
    },
    {
      emoji: '🎂',
      text: "This is the best birthday gift you've ever received?",
      yes: { emoji: '😌', title: 'Correct answer!', sub: "You're welcome. No need to thank me... actually please do." }
    },
    {
      emoji: '🫂',
      text: "I'm your favourite person in the entire universe?",
      yes: { emoji: '💖', title: "And that's the truth!", sub: "Happy 27th, bestie. Love you to the moon and back 🌙" }
    }
  ];

  let qIdx = 0;

  // ── NO button logic ──
  const noBtn = document.getElementById('noBtn');
  const noPlaceholder = document.getElementById('noPlaceholder');

  const taunts = ['No 😤','Nope 🙅','Try again 😏','Nahhhh ✌️',"Can't catch me 🕺",'LOL no 😂','Byyye 👋','Nice try 😈','Not today 💨','Run run run 🏃'];
  let noX = 0, noY = 0;
  let isEscaping = false;

  function placeNoInitial() {
    // Position NO button right next to the placeholder
    const ph = noPlaceholder.getBoundingClientRect();
    noX = ph.left;
    noY = ph.top;
    noBtn.style.left = noX + 'px';
    noBtn.style.top  = noY + 'px';
    noBtn.style.transition = 'none';
    noBtn.textContent = 'No 😤';
  }

  function escapeFrom(mouseX, mouseY) {
    const bw = noBtn.offsetWidth;
    const bh = noBtn.offsetHeight;
    const margin = 20;
    const maxX = window.innerWidth  - bw - margin;
    const maxY = window.innerHeight - bh - margin;

    // Push away from cursor — pick a point far from cursor
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = noX + bw/2 - mouseX;
    const dy = noY + bh/2 - mouseY;
    const dist = Math.sqrt(dx*dx + dy*dy) || 1;

    // New position: push 250-400px away, clamped to screen
    const pushDist = 250 + Math.random() * 200;
    let nx = noX + (dx/dist) * pushDist + (Math.random()-0.5)*160;
    let ny = noY + (dy/dist) * pushDist + (Math.random()-0.5)*160;

    nx = Math.max(margin, Math.min(maxX, nx));
    ny = Math.max(margin, Math.min(maxY, ny));

    noX = nx; noY = ny;
    noBtn.style.transition = 'left 0.18s cubic-bezier(0.34,1.56,0.64,1), top 0.18s cubic-bezier(0.34,1.56,0.64,1)';
    noBtn.style.left = noX + 'px';
    noBtn.style.top  = noY + 'px';
    noBtn.textContent = taunts[Math.floor(Math.random()*taunts.length)];
  }

  noBtn.addEventListener('mouseenter', e => escapeFrom(e.clientX, e.clientY));
  noBtn.addEventListener('mousemove',  e => {
    const bRect = noBtn.getBoundingClientRect();
    const cx = bRect.left + bRect.width/2;
    const cy = bRect.top  + bRect.height/2;
    const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
    if (dist < 80) escapeFrom(e.clientX, e.clientY);
  });

  // Mobile: escape on touch near button
  document.addEventListener('touchmove', e => {
    const t = e.touches[0];
    const bRect = noBtn.getBoundingClientRect();
    const cx = bRect.left + bRect.width/2;
    const cy = bRect.top  + bRect.height/2;
    if (Math.hypot(t.clientX - cx, t.clientY - cy) < 100) {
      escapeFrom(t.clientX, t.clientY);
    }
  }, { passive: true });

  // ── Quiz logic ──
  function loadQ(idx) {
    const q = questions[idx];
    document.getElementById('progressText').textContent = `Question ${idx+1} of ${questions.length}`;
    document.getElementById('qEmoji').textContent = q.emoji;
    document.getElementById('qText').textContent = q.text;
    document.getElementById('qView').style.display = '';
    document.getElementById('resultView').classList.remove('show');
    document.getElementById('doneView').classList.remove('show');
    noBtn.style.display = 'block';
    // Slight delay so card renders first
    setTimeout(placeNoInitial, 60);
  }

  function answerYes() {
    const q = questions[qIdx];
    document.getElementById('qView').style.display = 'none';
    noBtn.style.display = 'none';
    document.getElementById('rEmoji').textContent = q.yes.emoji;
    document.getElementById('rTitle').textContent = q.yes.title;
    document.getElementById('rSub').textContent   = q.yes.sub;
    const isLast = qIdx === questions.length - 1;
    document.getElementById('btnNext').textContent = isLast ? 'See final result 🎊' : 'Next question →';
    document.getElementById('resultView').classList.add('show');
    boom(50);
  }

  function nextQuestion() {
    qIdx++;
    if (qIdx >= questions.length) {
      document.getElementById('resultView').classList.remove('show');
      document.getElementById('doneView').classList.add('show');
      noBtn.style.display = 'none';
      boom(100);
      setTimeout(()=>boom(70), 800);
    } else {
      loadQ(qIdx);
    }
  }

  function restartQuiz() {
    qIdx = 0;
    loadQ(0);
  }

  // Init
  loadQ(0);