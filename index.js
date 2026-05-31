// Stars
    const starsLayer = document.getElementById('starsLayer');
    for (let i = 0; i < 60; i++) {
      const s = document.createElement('div');
      s.className = 'star';
      const size = 1.5 + Math.random() * 2.5;
      s.style.cssText = `
        width:${size}px; height:${size}px;
        top:${Math.random()*100}%; left:${Math.random()*100}%;
        --dur:${2+Math.random()*3}s;
        --del:${Math.random()*4}s;
        animation-delay:var(--del);
      `;
      starsLayer.appendChild(s);
    }

    // Cursor
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursorRing');
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    function animCursor() {
      cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(animCursor);
    }
    animCursor();

    // Confetti
    function launchConfetti(count = 80) {
      const layer = document.getElementById('confettiLayer');
      const colors = ['#f43f7e','#c084fc','#f59e0b','#67e8f9','#4ade80','#fda4c1','#a5f3fc','#fde68a'];
      for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'cp';
        const color = colors[Math.floor(Math.random() * colors.length)];
        const isCircle = Math.random() > 0.5;
        p.style.cssText = `
          left:${Math.random()*100}vw;
          top:-15px;
          background:${color};
          border-radius:${isCircle?'50%':'2px'};
          width:${6+Math.random()*8}px;
          height:${6+Math.random()*8}px;
          animation-duration:${2.5+Math.random()*2.5}s;
          animation-delay:${Math.random()*1.2}s;
        `;
        layer.appendChild(p);
        setTimeout(() => p.remove(), 6000);
      }
    }

    // Blow candles
    let blown = false;
    function blowCandles() {
      if (!blown) {
        blown = true;
        document.getElementById('cakeSvg').classList.add('blown');
        document.getElementById('blowBtn').textContent = '🎉 Blow again!';
        launchConfetti(100);
        setTimeout(() => launchConfetti(60), 900);
      } else {
        launchConfetti(80);
      }
    }

    // Wishes
    const wishes = [
      "May your 27th year be everything you've dreamed of and nothing you've feared. You are braver, kinder, and more brilliant than you know. 🌟",
      "Here's to 27: the year your confidence catches up with how incredible you've always been. Happy birthday to someone truly one of a kind. 💜",
      "27 looks absolutely stunning on you. May this year bring you adventures that take your breath away and people who bring it back. 🌸",
      "You've spent 27 years making the world a better place just by being yourself. Here's to 27 more of exactly that. Happy birthday! 🎂",
      "May this year be filled with sunsets that stop you mid-sentence, laughs that make your stomach hurt, and love that surprises you every day. ✨",
    ];
    let wishIdx = 0;

    function nextWish() {
      const el = document.getElementById('wishText');
      el.style.opacity = '0';
      setTimeout(() => {
        el.textContent = wishes[wishIdx % wishes.length];
        el.style.opacity = '1';
        wishIdx++;
      }, 300);
      launchConfetti(40);
    }
    // ── GALLERY LIGHTBOX ──
    let lbIndex = 0;

    function buildMediaList() {
      return Array.from(document.querySelectorAll('.gallery-item')).map(item => {
        const img = item.querySelector('img');
        const vid = item.querySelector('video');
        const cap = item.querySelector('.gallery-caption');
        return {
          type: vid ? 'video' : 'image',
          src: vid ? vid.src : img.src,
          alt: img ? img.alt : '',
          caption: cap ? cap.textContent : ''
        };
      });
    }

    function openLightbox(idx) {
      lbIndex = idx;
      renderLightbox();
      document.getElementById('lightbox').classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      const lb = document.getElementById('lightbox');
      lb.classList.remove('open');
      document.body.style.overflow = '';
      // Pause any video
      const vid = lb.querySelector('video');
      if (vid) vid.pause();
    }

    function closeLightboxOnBg(e) {
      if (e.target === document.getElementById('lightbox')) closeLightbox();
    }

    function shiftLightbox(dir) {
      const items = buildMediaList();
      lbIndex = (lbIndex + dir + items.length) % items.length;
      renderLightbox();
    }

    function renderLightbox() {
      const items = buildMediaList();
      const item = items[lbIndex];
      const inner = document.getElementById('lightboxInner');
      const cap = document.getElementById('lbCaption');

      // Remove old media
      inner.querySelectorAll('img, video').forEach(el => el.remove());

      if (item.type === 'video') {
        const v = document.createElement('video');
        v.src = item.src;
        v.controls = true;
        v.autoplay = true;
        v.style.maxWidth = '100%';
        v.style.maxHeight = '85vh';
        v.style.borderRadius = '16px';
        inner.insertBefore(v, cap);
      } else {
        const i = document.createElement('img');
        i.src = item.src;
        i.alt = item.alt;
        inner.insertBefore(i, cap);
      }

      cap.textContent = item.caption;
    }

    document.addEventListener('keydown', e => {
      if (!document.getElementById('lightbox').classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') shiftLightbox(1);
      if (e.key === 'ArrowLeft') shiftLightbox(-1);
    });