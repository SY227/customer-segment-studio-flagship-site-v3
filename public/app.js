'use strict';
(() => {
const content = window.STUDIO_CONTENT;
const logic = window.STUDIO_LOGIC;
if (!content || !logic) return; // Static page remains usable if optional story scripts fail.
const versioned = (path) => `${path}?v=${content.version}`;
const campaign = logic.campaign(new URL(document.baseURI).search, content.campaigns);
document.documentElement.dataset.campaign = campaign.key;
document.querySelector('[data-campaign-eyebrow]').textContent = campaign.eyebrow;
document.querySelector('[data-campaign-hook]').textContent = campaign.hook;

// Integration hook only. This does NOT send analytics or personal data to a server.
const signal = (action, item = '') => window.dispatchEvent(new CustomEvent('studio:engagement', {
  detail: { action, item, campaign: campaign.key }
}));

const experienceScreens = {
  field: {
    path: content.caseStudy.source, width: 3488, height: 2118,
    alt: 'Original Customer Segment Studio screen, with Dormant VIPs selected. Demo data.',
    kicker: '01 / SEE THE FIELD', title: 'One group within the whole picture.',
    copy: 'In this product example, Dormant VIPs account for 64 customers and 13% of historical revenue. Start by seeing that group in the context of the whole customer base.',
    question: 'Which group deserves a closer look?',
    visible: 'The customer mix, historical contribution, and different purchase patterns.',
    why: 'Do not give a dormant former buyer the same treatment as someone who just made a first purchase.'
  },
  group: {
    path: 'assets/story/dormant-vips-context', width: 1213, height: 751,
    alt: 'Unedited crop of the same Dormant VIPs screen: 64 customers, 13% revenue share and $161,200 of historical revenue in the demo.',
    kicker: '02 / UNDERSTAND THE GROUP', title: 'Past value. Present silence.',
    copy: 'The same group contributed $161,200 in the demo period. That history makes a focused review more useful than treating all inactive customers as one audience.',
    question: 'Why give this group a different treatment?',
    visible: '64 customers · 13% of historical revenue · a long purchase gap.',
    why: 'Historical spending helps frame the decision. It does not tell us why someone stopped buying or guarantee a return.'
  },
  move: {
    path: 'assets/story/dormant-vips-action', width: 1213, height: 905,
    alt: 'Unedited crop of the same Dormant VIPs screen showing its KPI, reactivation objective, action preview, messaging angle and tactic.',
    kicker: '03 / MAKE THE MOVE', title: 'Test a reason to return.',
    copy: 'The product suggests a relevant comeback reason before spending more to reactivate. Use the objective, channel, KPI and time horizon to frame a test.',
    question: 'What should we test next?',
    visible: 'Email · reactivation · a focused comeback message · a 14-day review.',
    why: 'A suggested action is a starting point for a business decision, not proof that a campaign will work.'
  }
};
const experience = document.querySelector('[data-experience-gallery]');
if (experience) {
  const tabs = [...experience.querySelectorAll('[data-experience]')];
  const panel = experience.querySelector('[role="tabpanel"]');
  const image = experience.querySelector('[data-experience-img]');
  const source = experience.querySelector('[data-experience-source]');
  const button = experience.querySelector('[data-experience-image]');
  const selectExperience = (key, focus = false) => {
    const screen = experienceScreens[key];
    if (!screen) return;
    tabs.forEach(tab => {
      const active = tab.dataset.experience === key;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focus) tab.focus();
    });
    panel.setAttribute('aria-labelledby', `experience-tab-${key}`);
    panel.dataset.view = key;
    source.srcset = versioned(`${screen.path}.webp`);
    image.src = versioned(`${screen.path}.png`);
    image.alt = screen.alt;
    image.width = screen.width;
    image.height = screen.height;
    button.dataset.lightboxSrc = versioned(`${screen.path}.png`);
    button.dataset.lightboxAlt = screen.alt;
    for (const field of ['kicker', 'title', 'copy', 'question', 'visible', 'why']) {
      experience.querySelector(`[data-experience-${field}]`).textContent = screen[field];
    }
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => { selectExperience(tab.dataset.experience); signal('product-tab', tab.dataset.experience); });
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); selectExperience(tabs[next].dataset.experience, true); }
    });
  });
  // Crops are small and preloaded for immediate, stable tab transitions.
  for (const screen of Object.values(experienceScreens)) { const i = new Image(); i.src = versioned(`${screen.path}.webp`); }
  selectExperience('field');
}

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

// One small story, then the real product screen. Never an app embed or a synthetic dashboard.
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const stage = document.querySelector('[data-story-stage]');
const controls = document.querySelector('[data-story-controls]');
if (stage && controls) {
  controls.hidden = false;
  const toggle = controls.querySelector('[data-story-toggle]');
  const stepButtons = [...controls.querySelectorAll('[data-story-step]')];
  let elapsed = logic.duration;
  let previous = 0;
  let frame = 0;
  let running = false;
  let lastPhase = 'product';
  let userInteracted = false;
  const draw = () => {
    const phase = logic.phaseAt(elapsed);
    stage.dataset.phase = phase;
    stage.classList.toggle('story-is-running', running);
    const imageButton = stage.querySelector('.image-button');
    imageButton.inert = phase !== 'product';
    imageButton.setAttribute('aria-hidden', String(phase !== 'product'));
    stepButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.storyStep === phase)));
    toggle.textContent = running ? 'Pause' : elapsed >= logic.duration ? 'Replay story' : motionQuery.matches ? 'Show product' : 'Continue';
    toggle.setAttribute('aria-label', running ? 'Pause the visual story' : elapsed >= logic.duration ? 'Replay the visual story' : motionQuery.matches ? 'Show the actual product screenshot' : 'Continue the visual story');
    if (phase !== lastPhase) lastPhase = phase;
  };
  const stop = () => { running = false; cancelAnimationFrame(frame); draw(); };
  const tick = now => {
    if (!running) return;
    if (previous) elapsed += Math.min(now - previous, 100);
    previous = now;
    if (elapsed >= logic.duration) { elapsed = logic.duration; stop(); return; }
    draw(); frame = requestAnimationFrame(tick);
  };
  const play = (restart = false) => {
    if (restart || elapsed >= logic.duration) elapsed = 0;
    running = true; previous = 0; draw(); frame = requestAnimationFrame(tick);
  };
  const showProduct = () => { elapsed = logic.duration; stop(); };
  toggle.addEventListener('click', () => {
    userInteracted = true;
    if (running) stop(); else if (motionQuery.matches) {
      // Reduced-motion users can inspect each still via the step controls.
      if (elapsed >= logic.duration) { elapsed = 0; draw(); } else showProduct();
    } else play();
    signal('story-toggle');
  });
  stepButtons.forEach(button => button.addEventListener('click', () => {
    userInteracted = true; elapsed = logic.phaseStart(button.dataset.storyStep); stop();
    signal('story-step', button.dataset.storyStep);
  }));
  controls.querySelector('[data-story-skip]').addEventListener('click', () => { userInteracted = true; showProduct(); signal('story-skip'); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  motionQuery.addEventListener?.('change', () => { if (motionQuery.matches) showProduct(); });
  let seen = false;
  try { seen = sessionStorage.getItem('studio-story-seen-v2.1') === '1'; } catch { /* Private browsing: storage is optional. */ }
  const startOnce = () => {
    if (seen || userInteracted || motionQuery.matches || campaign.key === 'direct') return;
    seen = true;
    try { sessionStorage.setItem('studio-story-seen-v2.1', '1'); } catch { /* No persistence required. */ }
    play(true);
  };
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) startOnce(); else if (running) stop();
      }
    }, { threshold: .25 });
    observer.observe(stage);
  } else startOnce();
  draw();
}

const groupButtons = [...document.querySelectorAll('[data-group]')];
const selectGroup = id => {
  const group = content.groups.find(g => g.id === id);
  if (!group) return;
  groupButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.group === id)));
  for (const [selector, value] of Object.entries({ name: group.name, signal: group.signal, action: group.action, move: group.move })) {
    document.querySelector(`[data-group-${selector}]`).textContent = value;
  }
  document.querySelector('.group-story').style.setProperty('--selected-accent', group.color);
};
groupButtons.forEach(button => button.addEventListener('click', () => { selectGroup(button.dataset.group); signal('group-story', button.dataset.group); }));

const review = document.querySelector('[data-review-dialog]');
const form = review?.querySelector('[data-review-form]');
const status = review?.querySelector('[data-review-status]');
document.querySelector('[data-open-review]')?.addEventListener('click', event => {
  if (!review || typeof review.showModal !== 'function') return; // mailto works without JS.
  event.preventDefault(); review.showModal(); signal('review-open');
});
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
  const brief = prepareBrief(); if (!brief) return;
  // The user sends the message in their own mail app. The website sends nothing.
  window.location.href = logic.mailto(content.reviewEmail, brief);
  status.textContent = 'Email draft requested. Send it in your email app. Nothing has been sent by this page. No mail app? Use Copy brief instead.';
  signal('review-email-draft');
});
review?.querySelector('[data-copy-review]')?.addEventListener('click', async () => {
  const brief = prepareBrief(); if (!brief) return;
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(`To: ${content.reviewEmail}\nSubject: Customer segmentation review\n\n${brief}`);
    status.textContent = 'Brief copied. Paste it into an email to Simon. Nothing has been sent.';
  } catch {
    const fallback = review.querySelector('[data-review-fallback]');
    fallback.hidden = false;
    const text = review.querySelector('[data-review-brief]');
    text.value = `To: ${content.reviewEmail}\n\n${brief}`;
    text.focus(); text.select();
    status.textContent = 'Copy the selected brief into your email app. Nothing has been sent.';
  }
  signal('review-copy');
});
document.querySelectorAll(`a[href="${content.productUrl}"]`).forEach(link => link.addEventListener('click', () => signal('try-studio')));

// Keep the reading surface visible immediately; only the small hero story animates.
document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
})();
