'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const root = path.resolve(__dirname,'..');
const code = fs.readFileSync(path.join(root,'assets/js/main.js'),'utf8');
function boot(t, file, query='', {mobile=false, reduced=true}={}) {
  const dom = new JSDOM(fs.readFileSync(path.join(root,file),'utf8'), {url:'https://injivadigitalsytems.com/'+file+query,runScripts:'outside-only',pretendToBeVisual:true});
  t.after(()=>dom.window.close());
  const w=dom.window, d=w.document, revoked=[];
  w.matchMedia = q=>({matches:q.includes('max-width')?mobile:reduced,addEventListener(){},removeEventListener(){}});
  w.URL.createObjectURL = ()=>'blob:https://injivadigitalsytems.com/test';
  w.URL.revokeObjectURL = url=>revoked.push(url);
  w.scrollTo = ()=>{};
  w.eval(code);
  const fill=(selector,value)=>{const e=d.querySelector(selector);e.value=value;e.dispatchEvent(new w.Event('input',{bubbles:true}));};
  const submit=selector=>d.querySelector(selector).dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
  return {w,d,fill,submit,revoked};
}
test('service query is carried into a draft with a correct recipient',t=>{
  const {d,fill,submit}=boot(t,'contact.html','?service=data');
  assert.equal(d.querySelector('#service').value,'data');
  fill('#name','Test Visitor');fill('#email','visitor@example.com');fill('#message','We need a reliable reporting platform.');submit('#enquiry-form');
  assert.equal(d.querySelector('#draft-panel').hidden,false);
  assert.match(d.querySelector('#draft-text').value,/Data Engineering & BI/);
  assert.match(d.querySelector('#email-draft').href,/^mailto:info@injivadigitalsystems.com/);
  assert.match(d.querySelector('#form-status').textContent,/No message has been sent/);
});
test('invalid and whitespace-only enquiries never produce drafts',t=>{
  const {d,fill,submit}=boot(t,'contact.html');
  submit('#enquiry-form');assert.ok(d.querySelector('#draft-panel').hidden);
  fill('#name','   ');fill('#email','visitor@example.com');fill('#message',' '.repeat(30));submit('#enquiry-form');
  assert.ok(d.querySelector('#draft-panel').hidden);
  fill('#name','Visitor');fill('#message','We need a reporting platform.');submit('#enquiry-form');
  assert.equal(d.querySelector('#draft-panel').hidden,false);
});
test('long enquiry uses copy fallback and changed input invalidates draft',t=>{
  const {d,fill,submit}=boot(t,'contact.html');
  fill('#name','Visitor');fill('#email','visitor@example.com');fill('#message','Project context '.repeat(200));submit('#enquiry-form');
  assert.ok(!d.querySelector('#email-draft').href.includes('&body='));
  assert.match(d.querySelector('#draft-help').textContent,/too long/);
  fill('#message','An updated project description.');assert.ok(d.querySelector('#draft-panel').hidden);
  assert.equal(d.querySelector('#draft-text').value,'');
});
test('untrusted service parameters are ignored and input stays plain text',t=>{
  const {d,fill,submit}=boot(t,'contact.html','?service=%3Cscript%3E');
  assert.equal(d.querySelector('#service').value,'');
  fill('#name','<img src=x onerror=alert(1)>');fill('#email','visitor@example.com');fill('#message','<script>alert("test")</script>');submit('#enquiry-form');
  assert.match(d.querySelector('#draft-text').value,/<script>/);
  assert.equal(d.querySelectorAll('img[src="x"]').length,0);
});
test('internship enquiry targets the internship mailbox',t=>{
  const {d,fill,submit}=boot(t,'internships.html');
  fill('#name','Visitor');fill('#email','visitor@example.com');
  const track=d.querySelector('#track');track.selectedIndex=1;
  fill('#message','I would like to discuss an internship.');submit('#enquiry-form');
  assert.equal(d.querySelector('#draft-panel').hidden,false);
  assert.match(d.querySelector('#email-draft').href,/^mailto:internships@injivadigitalsystems.com/);
});
test('career filters handle matching and empty results',t=>{
  const {d,fill}=boot(t,'careers.html');
  assert.match(d.querySelector('#department-status').textContent,/13 career areas/);
  fill('#department-search','zzzznonexistent');assert.equal(d.querySelector('#department-empty').hidden,false);
  assert.equal(d.querySelectorAll('.department-card:not([hidden])').length,0);
  fill('#department-search','');assert.equal(d.querySelectorAll('.department-card:not([hidden])').length,13);
  const family=d.querySelector('#department-family');family.value='Engineering';family.dispatchEvent(new d.defaultView.Event('change'));
  assert.ok([...d.querySelectorAll('.department-card:not([hidden])')].every(c=>c.dataset.family==='Engineering'));
});
test('career draft preserves department and clears on edit',t=>{
  const {d,fill,submit}=boot(t,'careers.html','?department=software');
  assert.equal(d.querySelector('#career-department').value,'software');
  fill('#career-name','Visitor');fill('#career-email','visitor@example.com');fill('#career-message','I would like to discuss software roles.');submit('#career-form');
  assert.match(d.querySelector('#career-draft').value,/Software Engineering/);
  assert.equal(d.querySelector('#career-draft-panel').hidden,false);
  fill('#career-name','Another visitor');assert.ok(d.querySelector('#career-draft-panel').hidden);
});
test('FAQ search displays empty state and reset restores results',t=>{
  const {d,fill}=boot(t,'faqs.html');
  const before=d.querySelectorAll('.faq-item:not([hidden])').length;
  fill('#faq-search','zzzznonexistent');assert.equal(d.querySelector('#faq-empty').hidden,false);
  d.querySelector('#faq-reset').click();assert.equal(d.querySelectorAll('.faq-item:not([hidden])').length,before);
  assert.equal(d.activeElement.id,'faq-search');
});
test('solution selection follows the fragment and ignores unknown choices',t=>{
  const {d,w}=boot(t,'solution-explorer.html');
  const a=d.querySelector('[data-solution]');
  w.location.hash='solution-'+a.dataset.solution;w.dispatchEvent(new w.HashChangeEvent('hashchange'));
  assert.equal(d.querySelectorAll('.solution-result:not([hidden])').length,1);
  assert.equal(a.getAttribute('aria-current'),'true');
  w.location.hash='unknown';w.dispatchEvent(new w.HashChangeEvent('hashchange'));
  assert.ok(d.querySelectorAll('.solution-result:not([hidden])').length>1);
});
test('brief validation, generation, progress and Blob cleanup',t=>{
  const {d,fill,submit,revoked}=boot(t,'project-brief.html','?service=data');
  submit('#brief-form');assert.ok(d.querySelector('#brief-output').hidden);
  fill('#brief-title','Reporting platform');fill('#brief-challenge','Our reports take too long to produce.');fill('#brief-outcome','Create reliable and timely business reports.');submit('#brief-form');
  assert.equal(d.querySelector('#brief-output').hidden,false);
  assert.match(d.querySelector('#brief-text').value,/Reporting platform/);
  assert.match(d.querySelector('#brief-download').href,/^blob:/);
  assert.equal(d.querySelector('#brief-progress li[aria-current]').textContent.trim().includes('Review'),true);
  fill('#brief-title','New title');assert.ok(d.querySelector('#brief-output').hidden);
  assert.equal(revoked.length,1);assert.ok(!d.querySelector('#brief-download').hasAttribute('href'));
});
test('clipboard failure selects text and provides manual instructions',async t=>{
  const {d,fill,submit}=boot(t,'contact.html');
  fill('#name','Visitor');fill('#email','visitor@example.com');fill('#message','Please help us improve reporting.');submit('#enquiry-form');
  d.querySelector('#copy-draft').click();await Promise.resolve();
  assert.match(d.querySelector('#copy-status').textContent,/device’s Copy command/);
  assert.equal(d.activeElement.id,'draft-text');
});
test('mobile menu opens and Escape restores focus',t=>{
  const {d,w}=boot(t,'index.html','',{mobile:true});
  const nav=d.querySelector('#primary-nav'),toggle=d.querySelector('.nav-toggle');
  assert.ok(nav.hidden);assert.equal(toggle.hidden,false);toggle.click();assert.equal(nav.hidden,false);
  d.dispatchEvent(new w.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.ok(nav.hidden);assert.equal(d.activeElement,toggle);
});
test('reduced motion suppresses homepage replay and reveal hiding',t=>{
  const {d}=boot(t,'index.html');
  assert.ok(d.querySelector('#flow-replay').hidden);
  assert.equal(d.querySelectorAll('.reveal-pending').length,0);
});
test('without JavaScript navigation and contact links remain usable; draft submission disabled',t=>{
  const dom=new JSDOM(fs.readFileSync(path.join(root,'contact.html'),'utf8'));t.after(()=>dom.window.close());
  const d=dom.window.document;
  assert.equal(d.querySelector('#primary-nav').hidden,false);
  assert.ok(d.querySelector('#prepare-button').disabled);
  assert.ok(d.querySelector('a[href="mailto:info@injivadigitalsystems.com"]'));
});
test('download draft exports the prepared text without network submission',t=>{
  const {d,w,fill,submit}=boot(t,'contact.html');
  let blob,download;
  w.URL.createObjectURL=value=>{blob=value;return 'blob:https://injivadigitalsytems.com/draft';};
  w.HTMLAnchorElement.prototype.click=function(){download={href:this.href,name:this.download};};
  fill('#name','Visitor');fill('#email','visitor@example.com');fill('#message','Please help us improve reporting.');submit('#enquiry-form');
  d.querySelector('[data-download-draft]').click();
  assert.equal(blob.type,'text/plain;charset=utf-8');
  assert.equal(blob.size,new TextEncoder().encode(d.querySelector('#draft-text').value).length);
  assert.equal(download.name,'INJIVA-enquiry-draft.txt');
  assert.match(download.href,/^blob:/);
  assert.match(d.querySelector('#form-status').textContent,/No message has been sent/);
});
