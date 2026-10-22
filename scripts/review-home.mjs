import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {readFileSync} from 'node:fs';
const browser = await chromium.launch({executablePath:'/usr/bin/chromium'});
try {
 for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});
  const page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://localhost:3000',{waitUntil:'networkidle'});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.addStyleTag({content:'nextjs-portal{display:none!important}'});
  await page.screenshot({path:`/workspace/design-review/hero-${name}.png`});
  await page.screenshot({path:`/workspace/design-review/home-${name}.png`,fullPage:true});
  console.log(name,'overflow',await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),'errors',errors);
  const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
  console.log(name,'axe',JSON.stringify(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))));
  await page.locator('.iv-menu summary').first().click();
  console.log(name,'menu expands',await page.locator('.iv-menu details').first().getAttribute('open')!==null);
  await page.locator('.home-faq summary').first().click();
  console.log(name,'faq expands',await page.locator('.home-faq details').first().getAttribute('open')!==null);
  await page.close();
 }
 const page=await browser.newPage({viewport:{width:1200,height:650}});
 const current=readFileSync('public/brand/logo.png').toString('base64');
 const horizontal=readFileSync('docs/brand/logo-horizontal-mockup.png').toString('base64');
 await page.setContent(`<body style="margin:0;background:#f7f4ed;color:#29372d;font-family:Arial;padding:56px"><p style="font-size:11px;letter-spacing:2px">AVIDA LUNA / LOGO REVIEW</p><h1 style="font-size:42px;font-weight:500;letter-spacing:-2px">Your identity. Two arrangements.</h1><div style="display:grid;grid-template-columns:1fr 1.4fr;gap:50px;margin-top:40px"><div><div style="height:250px;display:flex;align-items:center;justify-content:center;border-block:1px solid #c6cdbc"><img style="height:220px" src="data:image/png;base64,${current}"/></div><h2 style="font-size:17px">01 / Current logo</h2><p style="font-size:13px">Your original mark. Used on the homepage.</p></div><div><div style="height:250px;display:flex;align-items:center;justify-content:center;border-block:1px solid #c6cdbc"><img style="width:95%" src="data:image/png;base64,${horizontal}"/></div><h2 style="font-size:17px">02 / Horizontal option</h2><p style="font-size:13px">Existing mockup for Shary’s approval. Same mark and wordmark.<br/>A clean designer export is needed before use.</p></div></div></body>`);
 await page.screenshot({path:'/workspace/design-review/logo-options.png'});
}finally{await browser.close()}
