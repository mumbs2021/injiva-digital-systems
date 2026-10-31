'use strict';
// Progressive enhancement: HTML content and native disclosures work without JS.
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('#primary-nav');
if (toggle && nav) {
  const narrow = matchMedia('(max-width:1060px)');
  const groups = [...nav.querySelectorAll('details')];
  const closeGroups = () => groups.forEach(group => { group.open = false; });
  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    if (narrow.matches) nav.hidden = true;
    closeGroups();
  };
  const sync = () => {
    const focusWasInside = nav.contains(document.activeElement);
    toggle.hidden = !narrow.matches;
    nav.hidden = narrow.matches;
    toggle.setAttribute('aria-expanded', 'false');
    closeGroups();
    if (narrow.matches && focusWasInside) toggle.focus();
  };
  sync();
  narrow.addEventListener('change', sync);
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav.hidden = open;
    if (open) closeGroups();
  });
  groups.forEach(group => group.addEventListener('toggle', () => {
    if (group.open) groups.forEach(other => { if (other !== group) other.open = false; });
  }));
  document.addEventListener('click', event => {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const opened = groups.find(group => group.open);
    if (opened) { opened.open = false; opened.querySelector('summary').focus(); }
    else if (narrow.matches && !nav.hidden) { closeMenu(); toggle.focus(); }
  });
}

const form = document.querySelector('#enquiry-form');
if (form) {
  const internship = form.dataset.enquiryKind === 'internship';
  const recipient = internship ? 'internships@injivadigitalsystems.com' : 'info@injivadigitalsystems.com';
  const subject = (internship ? 'Internship enquiry' : 'Project enquiry') + ' — INJIVA Digital Systems';
  const prepare = document.querySelector('#prepare-button');
  const panel = document.querySelector('#draft-panel');
  const draft = document.querySelector('#draft-text');
  const emailLink = document.querySelector('#email-draft');
  const status = document.querySelector('#form-status');
  const field = internship ? 'track' : 'service';
  const choice = new URLSearchParams(location.search).get(field);
  if (choice && [...form.elements[field].options].some(option => option.value === choice)) {
    form.elements[field].value = choice;
  }
  prepare.disabled = false;
  const selected = name => form.elements[name].selectedOptions[0].textContent;
  form.addEventListener('submit', event => {
    event.preventDefault();
    // No network submission. Native validation remains available in every browser.
    for (const name of ['name', 'message']) {
      const input = form.elements[name];
      const minimum = name === 'message' ? 20 : 1;
      input.setCustomValidity(input.value.trim().length < minimum ?
        (name === 'name' ? 'Enter your name.' : 'Please enter at least 20 non-padding characters.') : '');
    }
    if (!form.reportValidity()) return;
    const fields = new FormData(form);
    const value = name => String(fields.get(name) || '').trim();
    const lines = ['Hello INJIVA Digital Systems,', internship ?
      'I would like to enquire about internship availability.' : 'I would like to discuss the following project.',
      'Name: ' + value('name'), 'Email: ' + value('email')];
    if (internship) lines.push('Area of interest: ' + selected('track'),
      'Availability: ' + (value('availability') || 'Not specified'),
      'Public portfolio: ' + (value('portfolio') || 'Not provided'),
      'Introduction:\n' + value('message'));
    else lines.push('Organisation: ' + (value('organisation') || 'Not specified'),
      'Service: ' + selected('service'), 'Budget (USD): ' + selected('budget'),
      'Timing: ' + selected('timeline'), 'Project details:\n' + value('message'));
    const text = lines.join('\n\n');
    draft.value = text;
    const base = 'mailto:' + recipient + '?subject=' + encodeURIComponent(subject);
    const full = base + '&body=' + encodeURIComponent(text);
    const fits = full.length <= 1800;
    emailLink.href = fits ? full : base;
    document.querySelector('#draft-help').textContent = fits ?
      'Review your draft, then open your email app. You must send the message there.' :
      'This draft is too long for a reliable email link. Copy the full message below, open your email app, and paste it before sending.';
    panel.hidden = false;
    status.className = 'form-status has-message success';
    status.textContent = 'Your draft is ready below. No message has been sent.';
    document.querySelector('#copy-status').textContent = '';
    draft.focus();
  });
  form.addEventListener('input', event => {
    if (typeof event.target.setCustomValidity === 'function') event.target.setCustomValidity('');
    if (!panel.hidden) {
      panel.hidden = true;
      draft.value = '';
      emailLink.href = 'mailto:' + recipient;
      status.textContent = 'Your details changed. Prepare a new draft to include those changes.';
    }
  });
  document.querySelector('#copy-draft').addEventListener('click', async () => {
    const message = document.querySelector('#copy-status');
    try {
      if (!navigator.clipboard?.writeText) throw Error('Clipboard unavailable');
      await navigator.clipboard.writeText(draft.value);
      message.textContent = 'Message copied. Paste it into your email app and send it when ready.';
    } catch {
      draft.focus(); draft.select();
      message.textContent = 'Automatic copying is unavailable. The message is selected; use your device’s Copy command.';
    }
  });
}

const search = document.querySelector('#faq-search');
if (search) {
  const category = document.querySelector('#faq-category');
  const groups = [...document.querySelectorAll('.faq-category')];
  const filter = () => {
    const terms = search.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    let count = 0;
    groups.forEach(group => {
      const categoryMatches = category.value === 'all' || group.dataset.faqGroup === category.value;
      let matches = 0;
      group.querySelectorAll('.faq-item').forEach(item => {
        const text = item.textContent.toLocaleLowerCase();
        const show = categoryMatches && terms.every(term => text.includes(term));
        item.hidden = !show;
        if (show) matches++;
      });
      group.hidden = matches === 0;
      count += matches;
    });
    document.querySelector('#faq-status').textContent = count + (count === 1 ? ' answer found.' : ' answers found.');
    document.querySelector('#faq-empty').hidden = count > 0;
  };
  document.querySelector('#faq-tools').hidden = false;
  search.addEventListener('input', filter);
  category.addEventListener('change', filter);
  document.querySelector('#faq-reset').addEventListener('click', () => {
    search.value = ''; category.value = 'all'; filter(); search.focus();
  });
  filter();
}

// Enquiry context uses only the validated selection; URL input is never HTML.
const enquiryContext = document.querySelector('#enquiry-context');
if (enquiryContext && form) {
  const service = form.elements.service;
  const updateContext = () => {
    enquiryContext.hidden = !service.value;
    enquiryContext.textContent = service.value ? 'Your conversation: ' + service.selectedOptions[0].textContent + '. You can change this selection below.' : '';
  };
  updateContext();
  service.addEventListener('change', updateContext);
}
const insightTopic = document.querySelector('#insight-topic');
if (insightTopic) {
  const cards = [...document.querySelectorAll('[data-topic]')];
  const filterInsights = () => {
    let count = 0;
    cards.forEach(card => {
      card.hidden = insightTopic.value !== 'all' && card.dataset.topic !== insightTopic.value;
      if (!card.hidden) count++;
    });
    document.querySelector('#insight-status').textContent = count + (count === 1 ? ' fieldnote' : ' fieldnotes');
  };
  document.querySelector('#insight-tools').hidden = false;
  insightTopic.addEventListener('change', filterInsights);
  filterInsights();
}

const departmentSearch = document.querySelector('#department-search');
if (departmentSearch) {
  const family = document.querySelector('#department-family');
  const cards = [...document.querySelectorAll('.department-card')];
  const filter = () => {
    const terms = departmentSearch.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let count = 0;
    cards.forEach(card => {
      card.hidden = !(family.value === 'all' || card.dataset.family === family.value) || !terms.every(term => card.textContent.toLowerCase().includes(term));
      if (!card.hidden) count++;
    });
    document.querySelector('#department-status').textContent = count + (count === 1 ? ' career area found.' : ' career areas found.');
    document.querySelector('#department-empty').hidden = count > 0;
  };
  document.querySelector('#department-tools').hidden = false;
  departmentSearch.addEventListener('input', filter);
  family.addEventListener('change', filter);
  filter();
}
const careerForm = document.querySelector('#career-form');
if (careerForm) {
  const department = careerForm.elements.department;
  const requested = new URLSearchParams(location.search).get('department');
  if ([...department.options].some(option => option.value === requested)) department.value = requested;
  const panel = document.querySelector('#career-draft-panel');
  const draft = document.querySelector('#career-draft');
  const send = document.querySelector('#career-send');
  const status = document.querySelector('#career-status');
  document.querySelector('#career-prepare').disabled = false;
  careerForm.addEventListener('submit', event => {
    event.preventDefault();
    for (const name of ['name', 'message']) {
      const input = careerForm.elements[name];
      input.setCustomValidity(input.value.trim().length < (name === 'name' ? 1 : 20) ? 'Please provide ' + (name === 'name' ? 'your name.' : 'at least 20 non-padding characters.') : '');
    }
    if (!careerForm.reportValidity()) return;
    const topic = department.selectedOptions[0].textContent;
    draft.value = ['Hello INJIVA Digital Systems,','I would like to enquire about career opportunities in ' + topic + '.', 'Name: ' + careerForm.elements.name.value.trim(), 'Email: ' + careerForm.elements.email.value.trim(), 'Department: ' + topic, 'Introduction:\n' + careerForm.elements.message.value.trim()].join('\n\n');
    const base = 'mailto:info@injivadigitalsystems.com?subject=' + encodeURIComponent('Career enquiry — ' + topic);
    const full = base + '&body=' + encodeURIComponent(draft.value);
    send.href = full.length <= 1800 ? full : base;
    document.querySelector('#career-draft-help').textContent = full.length <= 1800 ? 'Review the message, then open your email app and send it when ready.' : 'Copy the complete draft below, then open your email app and paste it before sending. The draft is too long for a reliable email link.';
    panel.hidden = false;
    status.textContent = 'Your draft is ready. No message has been sent.';
    document.querySelector('#career-copy-status').textContent = '';
    draft.focus();
  });
  careerForm.addEventListener('input', event => {
    if (typeof event.target.setCustomValidity === 'function') event.target.setCustomValidity('');
    if (!panel.hidden) { panel.hidden = true; draft.value = ''; send.href = 'mailto:info@injivadigitalsystems.com'; status.textContent = 'Your details changed. Prepare a new draft.'; }
  });
  document.querySelector('#career-copy').addEventListener('click', async () => {
    const status = document.querySelector('#career-copy-status');
    try { if (!navigator.clipboard?.writeText) throw Error('Unavailable'); await navigator.clipboard.writeText(draft.value); status.textContent = 'Message copied. Paste it into your email app.'; }
    catch { draft.focus(); draft.select(); status.textContent = 'Use your device’s Copy command to copy the selected message.'; }
  });
}

const solutionChoices = [...document.querySelectorAll('[data-solution]')];
if (solutionChoices.length) {
  const panels = [...document.querySelectorAll('.solution-result')];
  const choose = key => {
    if (!solutionChoices.some(a => a.dataset.solution === key)) return;
    panels.forEach(p => { p.hidden = p.id !== 'solution-' + key; });
    solutionChoices.forEach(a => { if (a.dataset.solution === key) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
    document.querySelector('#explorer-status').textContent = 'Showing the starting point for ' + solutionChoices.find(a => a.dataset.solution === key).querySelector('.eyebrow').textContent + '.';
  };
  solutionChoices.forEach(a => a.addEventListener('click', () => choose(a.dataset.solution)));
  const sync = () => { const key = location.hash.replace('#solution-', ''); if (solutionChoices.some(a => a.dataset.solution === key)) choose(key); else { panels.forEach(p => { p.hidden = false; }); solutionChoices.forEach(a => a.removeAttribute('aria-current')); document.querySelector('#explorer-status').textContent = ''; } };
  window.addEventListener('hashchange', sync); sync();
}
const briefForm = document.querySelector('#brief-form');
if (briefForm) {
  const service = briefForm.elements.service;
  const requested = new URLSearchParams(location.search).get('service');
  if ([...service.options].some(o => o.value === requested)) service.value = requested;
  const output = document.querySelector('#brief-output');
  const text = document.querySelector('#brief-text');
  const download = document.querySelector('#brief-download');
  const status = document.querySelector('#brief-status');
  let blobURL = null;
  const release = () => { if (blobURL) URL.revokeObjectURL(blobURL); blobURL = null; download.removeAttribute('href'); };
  document.querySelector('#brief-generate').disabled = false;
  briefForm.addEventListener('submit', event => {
    event.preventDefault();
    for (const name of ['title', 'challenge', 'outcome']) { const input = briefForm.elements[name]; input.setCustomValidity(input.value.trim().length < (name === 'title' ? 1 : 20) ? 'Please provide ' + (name === 'title' ? 'a project name.' : 'at least 20 non-padding characters.') : ''); }
    if (!briefForm.reportValidity()) return;
    const labels = [['title','Project'],['service','Primary service'],['sector','Industry'],['challenge','Current challenge'],['outcome','Desired outcome'],['systems','Existing systems'],['scope','Scope and boundaries'],['budget','Indicative budget (USD)'],['timing','Desired timing'],['constraints','Other constraints']];
    const lines = labels.map(([name,label]) => { const el = briefForm.elements[name]; return label + '\n' + (el.tagName === 'SELECT' ? el.selectedOptions[0].textContent : el.value.trim() || 'Not specified'); });
    text.value = 'PROJECT BRIEF — INJIVA DIGITAL SYSTEMS\n\n' + lines.join('\n\n') + '\n\nPrepared for discussion. Not a quotation, contract or confirmed scope.\nContact: info@injivadigitalsystems.com';
    release();blobURL = URL.createObjectURL(new Blob([text.value], {type:'text/plain;charset=utf-8'}));download.href = blobURL;
    output.hidden = false;status.textContent = 'Your brief is ready to review and download. Nothing has been submitted.';document.querySelector('#brief-copy-status').textContent = '';text.focus();
  });
  briefForm.addEventListener('input', event => { if (typeof event.target.setCustomValidity === 'function') event.target.setCustomValidity(''); if (!output.hidden) { output.hidden = true; text.value = ''; release();status.textContent = 'Your details changed. Generate a new brief.'; } });
  document.querySelector('#brief-copy').addEventListener('click', async () => { const status = document.querySelector('#brief-copy-status');try { if (!navigator.clipboard?.writeText) throw Error('Unavailable');await navigator.clipboard.writeText(text.value);status.textContent = 'Brief copied.'; } catch { text.focus();text.select();status.textContent = 'Use your device’s Copy command to copy the selected brief.'; } });
  window.addEventListener('pagehide', release);
  window.addEventListener('pageshow', event => { if (event.persisted && !output.hidden) { output.hidden = true; status.textContent = 'Generate your brief again to restore its download link.'; } });
}

// Motion enhancements never gate content or form functionality.
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const animateOnce = element => {
  if (!element || reducedMotion.matches) return;
  element.classList.remove('motion-enter');
  requestAnimationFrame(() => { if (!element.hidden) element.classList.add('motion-enter'); });
};
const flowStage = document.querySelector('.flow-stage');
if (flowStage) {
  const replay = document.querySelector('#flow-replay');
  let flowTimer;
  const run = () => {
    clearTimeout(flowTimer);flowStage.classList.remove('flow-running');
    if (reducedMotion.matches) return;
    requestAnimationFrame(() => flowStage.classList.add('flow-running'));
    flowTimer = setTimeout(() => flowStage.classList.remove('flow-running'), 4800);
  };
  replay.hidden = reducedMotion.matches;
  replay.addEventListener('click', run);
  reducedMotion.addEventListener('change', () => { replay.hidden = reducedMotion.matches; if (reducedMotion.matches) {clearTimeout(flowTimer);flowStage.classList.remove('flow-running');} });
  run();
}
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const targets = [...document.querySelectorAll('.section-heading,.people-photo,.service-card,.pathway-row,.career-steps>li,.insight-card')];
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-revealed');entry.target.classList.remove('reveal-pending');observer.unobserve(entry.target); }
  }), {threshold:.08});
  targets.forEach(el => { if (el.getBoundingClientRect().top >= innerHeight) {el.classList.add('reveal-ready','reveal-pending');observer.observe(el);} });
  const revealAll = () => { targets.forEach(el => {el.classList.remove('reveal-pending');el.classList.add('is-revealed');});observer.disconnect(); };
  reducedMotion.addEventListener('change', event => {if (event.matches) revealAll();});
  // Keyboard focus and fragment navigation must never land in invisible content.
  document.addEventListener('focusin', event => {const el=event.target.closest('.reveal-pending');if(el){el.classList.remove('reveal-pending');el.classList.add('is-revealed');observer.unobserve(el);}});
  window.addEventListener('beforeprint', revealAll);
}
if (solutionChoices.length) solutionChoices.forEach(a => a.addEventListener('click', () => animateOnce(document.querySelector('#solution-' + a.dataset.solution))));
if (departmentSearch) {
  const animateMatches = () => document.querySelectorAll('.department-card:not([hidden])').forEach(animateOnce);
  departmentSearch.addEventListener('input', animateMatches);
  document.querySelector('#department-family').addEventListener('change', animateMatches);
}
if (briefForm) {
  const progress = document.querySelector('#brief-progress');
  progress.hidden = false;
  const steps = [...progress.querySelectorAll('li')];
  let constraintsReviewed = false;
  const valid = name => briefForm.elements[name].value.trim().length >= (name === 'title' ? 1 : 20);
  const update = () => {
    const generated = !document.querySelector('#brief-output').hidden;
    const direction = valid('title');
    const requirements = valid('challenge') && valid('outcome');
    const index = generated ? 3 : !direction ? 0 : !requirements ? 1 : 2;
    steps.forEach((step,i) => { step.classList.toggle('complete',i<index);if(i===index)step.setAttribute('aria-current','step');else step.removeAttribute('aria-current'); });
    document.querySelector('#brief-progress-note').textContent = generated ? 'Your brief is ready. Review it before sharing.' : !direction ? 'Add a project name to set the direction.' : !requirements ? 'Describe the challenge and the outcome you want.' : constraintsReviewed ? 'Constraints considered. Generate your brief when ready.' : 'Consider budget, timing and constraints. These are optional; you can leave them unspecified.';
  };
  briefForm.addEventListener('input', update);
  briefForm.addEventListener('focusin', event => {if(['budget','timing','constraints'].includes(event.target.name)){constraintsReviewed=true;update();}});
  briefForm.addEventListener('submit', () => {update();if(!document.querySelector('#brief-output').hidden && !reducedMotion.matches){const out=document.querySelector('#brief-output');out.classList.remove('brief-confirm');requestAnimationFrame(()=>out.classList.add('brief-confirm'));}});
  update();
}
const topControl = document.querySelector('#back-top');
const readingProgress = document.querySelector('#reading-progress');
const articleBody = document.querySelector('.article-prose');
let scrollFrame = false;
const updateScrollUI = () => {
  if(topControl) topControl.hidden = scrollY < 600 && document.activeElement !== topControl;
  if(readingProgress && articleBody) {const rect=articleBody.getBoundingClientRect();const start=rect.top+scrollY;const distance=Math.max(1,rect.height-innerHeight+100);readingProgress.value=Math.max(0,Math.min(100,(scrollY-start+100)/distance*100));readingProgress.hidden=false;}
  scrollFrame=false;
};
window.addEventListener('scroll',()=>{if(!scrollFrame){scrollFrame=true;requestAnimationFrame(updateScrollUI);}},{passive:true});
window.addEventListener('resize',updateScrollUI);
if(topControl)topControl.addEventListener('click',event=>{event.preventDefault();document.querySelector('#main').focus({preventScroll:true});window.scrollTo({top:0,behavior:reducedMotion.matches?'instant':'smooth'});});
updateScrollUI();

// A local text file provides a fallback when no mail app or clipboard is available.
document.querySelectorAll('[data-download-draft]').forEach(button => {
  button.disabled = false;
  button.addEventListener('click', () => {
    const draft = document.getElementById(button.dataset.downloadDraft);
    if (!draft?.value.trim()) return;
    const url = URL.createObjectURL(new Blob([draft.value], {type:'text/plain;charset=utf-8'}));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'INJIVA-enquiry-draft.txt';
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
});
