const top_ = document.getElementById('top');
const name_ = document.getElementById('name');
const onScroll = () => { top_.classList.toggle('stuck', scrollY > 8); top_.classList.toggle('named', name_.getBoundingClientRect().bottom < 60); };
addEventListener('scroll', onScroll, { passive: true }); onScroll();

// the grid plays once the card is on screen AND its squares exist, whichever comes last
const act = document.querySelector('.act'); let gridLoaded = false;
const gridGo = () => {
  if (!gridLoaded || !act.hasAttribute('data-visible') || act.hasAttribute('data-go')) return;
  setTimeout(() => { act.setAttribute('data-go', ''); setTimeout(() => act.setAttribute('data-settled', ''), 1000); }, 450);
};

fetch('assets/contributions.json').then(r => { if (!r.ok) throw 0; return r.json(); }).then(d => {
  const cg = document.getElementById('cg'), months = document.getElementById('months'), tip = document.getElementById('tip');
  const WEEKS = 13, n = d.levels.length, from = Math.floor((n - 1) / 7) * 7 - (WEEKS - 1) * 7;
  const start = new Date(d.start + 'T00:00:00'); let total = 0;
  for (let i = from; i < n; i++) {
    const c = document.createElement('i'), l = d.levels[i]; if (l !== '0') c.dataset.l = l; total += d.counts[i];
    const day = new Date(start); day.setDate(day.getDate() + i);
    c.onmouseenter = () => tip.textContent = d.counts[i] + ' on ' + day.toLocaleDateString('en', { day: 'numeric', month: 'short' });
    c.style.setProperty('--col', Math.floor((i - from) / 7));
      cg.appendChild(c);
    if (day.getDate() <= 7 && day.getDay() === 0) { const s = document.createElement('span'); s.textContent = day.toLocaleString('en', { month: 'short' }); s.style.left = ((i - from) / 7 * 21) + 'px'; months.appendChild(s); }
  }
  cg.onmouseleave = () => tip.innerHTML = '&nbsp;';
  document.getElementById('total').textContent = total.toLocaleString('en');
  gridLoaded = true; gridGo();
}).catch(() => { document.querySelector('.act').hidden = true; });

// one-shot reveals: fire once, then drop the stagger delays so hovers answer at once
const seen = new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.setAttribute('data-visible', '');
  if (e.target === act) gridGo(); else setTimeout(() => e.target.setAttribute('data-settled', ''), 900);
  seen.unobserve(e.target);
}), { rootMargin: '0px 0px -12% 0px' });
document.querySelectorAll('.reveal, .act, .certs').forEach(el => seen.observe(el));

// phones lean a few degrees toward the pointer; fine pointers only, never under reduced motion
if (matchMedia('(hover: hover) and (pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.phones').forEach(box => {
    const scene = box.closest('.ch'); let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const step = () => {
      x += (tx - x) * .12; y += (ty - y) * .12;
      box.style.setProperty('--ry', (x * 7).toFixed(2) + 'deg'); box.style.setProperty('--rx', (-y * 5).toFixed(2) + 'deg');
      raf = Math.abs(tx - x) + Math.abs(ty - y) > .002 ? requestAnimationFrame(step) : 0;
    };
    const aim = (nx, ny) => { tx = nx; ty = ny; if (!raf) raf = requestAnimationFrame(step); };
    scene.addEventListener('pointermove', e => { const r = scene.getBoundingClientRect(); aim((e.clientX - r.left) / r.width - .5, (e.clientY - r.top) / r.height - .5); });
    scene.addEventListener('pointerleave', () => aim(0, 0));
  });
}

// copy the email address, with a label swap as feedback
document.querySelectorAll('[data-copy]').forEach(b => b.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(b.dataset.copy); } catch { location.href = 'mailto:' + b.dataset.copy; return; }
  b.classList.add('done'); clearTimeout(b._t); b._t = setTimeout(() => b.classList.remove('done'), 1600);
}));
