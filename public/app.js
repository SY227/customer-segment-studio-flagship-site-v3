'use strict';
(() => {
const content = window.STUDIO_CONTENT;
const logic = window.STUDIO_LOGIC;
if (!content || !logic) return;

const versioned = path => `${path}?v=${content.version}`;
const campaign = logic.campaign(new URL(document.baseURI).search, content.campaigns);
document.documentElement.dataset.campaign = campaign.key;
const campaignEyebrow = document.querySelector('[data-campaign-eyebrow]');
const campaignHook = document.querySelector('[data-campaign-hook]');
if (campaignEyebrow) campaignEyebrow.textContent = campaign.key === 'evergreen' ? 'SAME DATA. DIFFERENT STORIES.' : campaign.eyebrow;
if (campaignHook) campaignHook.textContent = campaign.hook;

// Integration hook only. Nothing here sends analytics or personal data to a server.
const signal = (action, item = '') => window.dispatchEvent(new CustomEvent('studio:engagement', {
  detail: { action, item, campaign: campaign.key }
}));

/* ---------- Primary product-story navigation ---------- */
const pageTabs = [...document.querySelectorAll('[data-page-tab]')];
const pagePanels = [...document.querySelectorAll('[data-page-panel]')];
const pageKeys = pageTabs.map(tab => tab.dataset.pageTab);

const selectPage = (key, { focus = false, updateUrl = true } = {}) => {
  if (!pageKeys.includes(key)) key = 'overview';
  pageTabs.forEach(tab => {
    const active = tab.dataset.pageTab === key;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active && focus) tab.focus({ preventScroll: true });
  });
  pagePanels.forEach(panel => {
    const active = panel.dataset.pagePanel === key;
    panel.hidden = !active;
    panel.classList.toggle('is-active', active);
  });
  document.body.dataset.page = key;
  if (updateUrl) {
    const url = new URL(location.href);
    url.hash = key === 'overview' ? '' : key;
    history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  }
  window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  signal('primary-tab', key);
};

pageTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectPage(tab.dataset.pageTab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % pageTabs.length;
    if (event.key === 'ArrowLeft') next = (index + pageTabs.length - 1) % pageTabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = pageTabs.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      selectPage(pageTabs[next].dataset.pageTab, { focus: true });
    }
  });
});

document.querySelectorAll('[data-page-open]').forEach(button => button.addEventListener('click', () => selectPage(button.dataset.pageOpen)));
const initialHash = location.hash.replace(/^#/, '');
selectPage(pageKeys.includes(initialHash) ? initialHash : 'overview', { updateUrl: false });

/* ---------- Lightbox ---------- */
const lightbox = document.querySelector('[data-lightbox]');
const lightboxImage = lightbox?.querySelector('[data-lightbox-image]');
document.querySelectorAll('[data-lightbox-src]').forEach(button => {
  button.addEventListener('click', () => {
    if (!lightbox || !lightboxImage || typeof lightbox.showModal !== 'function') return;
    lightboxImage.src = button.dataset.lightboxSrc || '';
    lightboxImage.alt = button.dataset.lightboxAlt || '';
    lightbox.showModal();
    signal('product-image');
  });
});
lightbox?.querySelector('[data-lightbox-close]')?.addEventListener('click', () => lightbox.close());
lightbox?.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });

/* ---------- Finite hero story ---------- */
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const stage = document.querySelector('[data-story-stage]');
const controls = document.querySelector('[data-story-controls]');
if (stage && controls) {
  const toggle = controls.querySelector('[data-story-toggle]');
  const stepButtons = [...controls.querySelectorAll('[data-story-step]')];
  const skip = controls.querySelector('[data-story-skip]');
  let elapsed = 0;
  let previous = 0;
  let frame = 0;
  let running = false;

  const draw = () => {
    const phase = logic.phaseAt(elapsed);
    stage.dataset.phase = phase;
    stage.classList.toggle('story-is-running', running);
    const imageButton = stage.querySelector('.product-image-button');
    if (imageButton) {
      imageButton.inert = phase !== 'product';
      imageButton.setAttribute('aria-hidden', String(phase !== 'product'));
    }
    stepButtons.forEach(button => {
      const active = button.dataset.storyStep === phase;
      button.setAttribute('aria-pressed', String(active));
      button.classList.toggle('is-active', active);
    });
    toggle.textContent = running ? 'Pause' : phase === 'product' ? 'Replay story' : 'Play story';
    toggle.setAttribute('aria-label', running ? 'Pause the visual story' : phase === 'product' ? 'Replay the visual story' : 'Play the visual story');
  };

  const stop = () => { running = false; cancelAnimationFrame(frame); draw(); };
  const tick = now => {
    if (!running) return;
    if (previous) elapsed += Math.min(now - previous, 100);
    previous = now;
    if (elapsed >= logic.duration) { elapsed = logic.duration; stop(); return; }
    draw();
    frame = requestAnimationFrame(tick);
  };
  const play = restart => {
    if (restart || elapsed >= logic.duration) elapsed = 0;
    running = true;
    previous = 0;
    draw();
    frame = requestAnimationFrame(tick);
  };
  const showProduct = () => { elapsed = logic.duration; stop(); };

  toggle.addEventListener('click', () => {
    if (running) stop();
    else if (motionQuery.matches) showProduct();
    else play(elapsed >= logic.duration);
    signal('story-toggle');
  });
  stepButtons.forEach(button => button.addEventListener('click', () => {
    elapsed = logic.phaseStart(button.dataset.storyStep);
    stop();
    signal('story-step', button.dataset.storyStep);
  }));
  skip?.addEventListener('click', () => { showProduct(); signal('story-skip'); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  motionQuery.addEventListener?.('change', () => { if (motionQuery.matches && running) stop(); });
  draw();
}

/* ---------- Nine-group interaction ---------- */
const groupButtons = [...document.querySelectorAll('[data-group]')];
const selectGroup = id => {
  const group = content.groups.find(item => item.id === id);
  if (!group) return;
  groupButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.group === id)));
  const fields = { name: group.name, signal: group.signal, action: group.action, move: group.move };
  for (const [selector, value] of Object.entries(fields)) {
    document.querySelectorAll(`[data-group-${selector}]`).forEach(node => { node.textContent = value; });
  }
  const avatar = document.querySelector('[data-group-avatar]');
  if (avatar) {
    avatar.src = versioned(`assets/characters/tiles/${group.id}.webp`);
    avatar.alt = `${group.name} character`;
  }
  document.documentElement.style.setProperty('--selected-group-accent', group.color);
};
groupButtons.forEach(button => button.addEventListener('click', () => {
  selectGroup(button.dataset.group);
  signal('group-story', button.dataset.group);
}));
document.querySelectorAll('[data-group-open]').forEach(button => button.addEventListener('click', () => {
  selectGroup(button.dataset.groupOpen);
  selectPage('group');
}));
selectGroup('dormant-vips');

/* ---------- Review request ---------- */
const review = document.querySelector('[data-review-dialog]');
const form = review?.querySelector('[data-review-form]');
const status = review?.querySelector('[data-review-status]');
document.querySelectorAll('[data-open-review]').forEach(link => link.addEventListener('click', event => {
  if (!review || typeof review.showModal !== 'function') return;
  event.preventDefault();
  review.showModal();
  signal('review-open');
}));
review?.querySelector('[data-close-review]')?.addEventListener('click', () => review.close());
review?.addEventListener('click', event => {
  const r = review.getBoundingClientRect();
  if (event.target === review && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) review.close();
});
const prepareBrief = () => {
  if (!form?.reportValidity()) return null;
  return logic.brief(Object.fromEntries(new FormData(form)));
};
form?.addEventListener('submit', event => {
  event.preventDefault();
  const brief = prepareBrief();
  if (!brief) return;
  window.location.href = logic.mailto(content.reviewEmail, brief);
  status.textContent = 'Email draft requested. Send it in your email app. Nothing has been sent by this page. No mail app? Use Copy brief instead.';
  signal('review-email-draft');
});
review?.querySelector('[data-copy-review]')?.addEventListener('click', async () => {
  const brief = prepareBrief();
  if (!brief) return;
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(`To: ${content.reviewEmail}\nSubject: Customer segmentation review\n\n${brief}`);
    status.textContent = 'Brief copied. Paste it into an email to Simon. Nothing has been sent.';
  } catch {
    const fallback = review.querySelector('[data-review-fallback]');
    fallback.hidden = false;
    const text = review.querySelector('[data-review-brief]');
    text.value = `To: ${content.reviewEmail}\n\n${brief}`;
    text.focus();
    text.select();
    status.textContent = 'Copy the selected brief into your email app. Nothing has been sent.';
  }
  signal('review-copy');
});

document.querySelectorAll(`a[href="${content.productUrl}"]`).forEach(link => link.addEventListener('click', () => signal('try-studio')));
})();
