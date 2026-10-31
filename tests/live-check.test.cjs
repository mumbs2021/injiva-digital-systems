'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const {checkLive}=require('../scripts/check-live.cjs');
const good=async url=>new Response(url.pathname.includes('missing-release-check')?'Let’s get you back on track.':'<html>INJIVA</html>',{status:url.pathname.includes('missing-release-check')?404:200,headers:{'Content-Type':'text/html'}});
test('live checker accepts healthy public routes and genuine 404',async()=>{await checkLive('https://example.com/project/',good);});
test('live checker rejects HTTP, broken pages and soft 404',async()=>{
 await assert.rejects(checkLive('http://example.com',good),/HTTPS/);
 await assert.rejects(checkLive('https://example.com',async()=>new Response('failed',{status:500})),/HTTP 200/);
 await assert.rejects(checkLive('https://example.com',async()=>new Response('INJIVA',{headers:{'content-type':'text/html'}})),/HTTP 404/);
});
