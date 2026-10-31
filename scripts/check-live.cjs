'use strict';
// Read-only HTTP smoke check; does not submit forms or send enquiry data.
const assert = require('node:assert/strict');
const { setTimeout: pause } = require('node:timers/promises');
async function checkLive(base, request=fetch) {
  const site = new URL(base);
  assert.equal(site.protocol, 'https:', 'Live URL must use HTTPS');
  assert.ok(!site.username && !site.password, 'Do not put credentials in the URL');
  if (!site.pathname.endsWith('/')) site.pathname += '/';
  for (const name of ['index.html','contact.html','internships.html','careers.html','project-brief.html','sitemap.xml','robots.txt','assets/js/main.js','assets/css/style.css','assets/downloads/INJIVA-Digital-Systems-Company-Profile.pdf']) {
    const response = await request(new URL(name,site),{signal:AbortSignal.timeout(20000)});
    assert.equal(response.status,200, name + ': expected HTTP 200');
    if(response.url) assert.equal(new URL(response.url).protocol,'https:','Redirect downgraded HTTPS');
    const text = await response.text();
    assert.ok(text.length>0,name+': empty response');
    if(name.endsWith('.html')) {
      assert.match(response.headers.get('content-type') || '',/text\/html/i);
      assert.match(text,/INJIVA/);
      assert.doesNotMatch(text,/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/i);
    }
  }
  const missing = await request(new URL('missing-release-check/nested-page',site),{signal:AbortSignal.timeout(20000)});
  assert.equal(missing.status,404,'Missing URLs must return HTTP 404');
  assert.match(await missing.text(),/Let’s get you/,'Custom 404 must be served');
}
if (require.main===module) {
  const base=process.env.LIVE_SITE_URL || process.argv[2];
  if(!base) {console.error('Set LIVE_SITE_URL to the deployed HTTPS URL.');process.exitCode=1;}
  else (async()=>{
    for(let attempt=1;attempt<=3;attempt++) {
      try {await checkLive(base);console.log('Live HTTPS smoke checks passed.');return;}
      catch(error) {if(attempt===3)throw error;console.log('Deployment may be propagating; retrying in 10 seconds.');await pause(10000);}
    }
  })().catch(error=>{console.error(error.message);process.exitCode=1;});
}
module.exports={checkLive};
