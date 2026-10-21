// Run: node tests/study-plan.cjs. No browser dependencies.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),file=path.join(root,'pages/plan.html'),html=fs.readFileSync(file,'utf8');
const attrs=s=>Object.fromEntries([...s.matchAll(/([\w-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]]));
const inputs=[...html.matchAll(/<input\b([^>]+)>/g)].map(m=>attrs(m[1]));
const tasks=inputs.filter(a=>a['data-task']),legacy=inputs.filter(a=>a['data-legacy-task']);
assert.equal(tasks.length,96);assert.equal(legacy.length,0);assert.equal(new Set(tasks.map(a=>a['data-task'])).size,96);
for(let b=1;b<=6;b++){assert.equal(tasks.filter(a=>a['data-block']===String(b)).length,16);for(let w=1;w<=4;w++)for(let s=1;s<=4;s++)assert.ok(tasks.some(a=>a['data-task']===`b${b}-w${w}-s${s}`));}
for(let w=1;w<=24;w++)assert.ok(html.includes(`id="week-${w}"`));
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);
let links=0;
for(const [,url]of html.matchAll(/(?:href|src)="([^"]+)"/g)){
 if(/^https?:/.test(url))continue;
 const [p,fragment]=url.split('#');const relative=p.startsWith('/informal-letter-ol/')?path.join(root,p.slice('/informal-letter-ol/'.length)||'index.html'):p?path.resolve(path.dirname(file),p):file;
 assert.ok(fs.existsSync(relative),`Missing link: ${url}`);
 if(fragment)assert.ok(fs.readFileSync(relative,'utf8').includes(`id="${fragment}"`),`Missing anchor: ${url}`);
 links++;
}
const base='485235217e6f1fac23aed2310daa9edc417f679f';
const old=execFileSync('git',['show',`${base}:pages/plan.html`],{cwd:root}).toString();
assert.ok(!html.includes('previous-plan'));
assert.ok(!html.includes('Previous four-week plan'));
const timer=s=>s.match(/<div class="card study-timer">[\s\S]*?<p id="timer-status"[^>]*>[\s\S]*?<\/p><\/div>/)[0];assert.equal(timer(html),timer(old));
const current='ol-study-plan-six-blocks-v1',previous='ol-study-plan-four-weeks-v2';
function setup(initial={},fail=false,hash=''){
 const storage={...initial},els={};let callback;
 function el(id){return els[id]??={textContent:'',open:false,scrollIntoView(){this.scrolled=true},closest(){return this.block??null}};}
 const make=a=>({dataset:Object.fromEntries(Object.entries(a).filter(([k])=>k.startsWith('data-')).map(([k,v])=>[k.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase()),v])),checked:false,addEventListener(t,f){this[t]=f}});
 const boxes=tasks.map(make),oldBoxes=legacy.map(make),counters=Array.from({length:6},(_,i)=>({...el(`counter-${i+1}`),dataset:{blockProgress:String(i+1)}}));
 for(let b=1;b<=6;b++){el(`block-${b}`).block=el(`block-${b}`);for(let w=1;w<=4;w++)el(`week-${(b-1)*4+w}`).block=el(`block-${b}`);}
 const ctx=vm.createContext({document:{getElementById:el,querySelectorAll(s){return s==='[data-task]'?boxes:s==='[data-legacy-task]'?oldBoxes:s==='[data-block-progress]'?counters:[]}},location:{hash},window:{addEventListener(t,f){callback=f}},localStorage:{getItem(k){if(fail)throw Error('unavailable');return storage[k]??null},setItem(k,v){if(fail)throw Error('quota');storage[k]=v}}});
 vm.runInContext(fs.readFileSync(path.join(root,'js/study-plan.js'),'utf8'),ctx);
 return {storage,els,boxes,oldBoxes,counters,ctx,el,changeHash(v){ctx.location.hash=v;callback()}};
}
let s=setup({[previous]:'["1","5"]',[current]:'["b2-w1-s1","unknown"]'},false,'#week-8');
assert.equal(s.boxes.filter(b=>b.checked).length,1);assert.ok(s.el('study-progress').textContent.startsWith('1 / 96'));assert.ok(s.el('block-2').open);assert.ok(s.el('week-8').scrolled);
s.boxes[0].checked=true;s.boxes[0].change();assert.deepEqual(JSON.parse(s.storage[current]),['b1-w1-s1','b2-w1-s1']);assert.equal(s.storage[previous],'["1","5"]');assert.ok(s.counters[0].textContent.startsWith('1 / 16'));
s=setup(s.storage);assert.equal(s.boxes.filter(b=>b.checked).length,2);assert.equal(s.storage[previous],'["1","5"]');
for(const bad of ['{broken','null','{}','4','"text"','[5,null]']){s=setup({[current]:bad,[previous]:bad});assert.equal(s.boxes.filter(b=>b.checked).length,0);assert.equal(s.oldBoxes.filter(b=>b.checked).length,0);}
s=setup({},true);s.boxes[0].checked=true;s.boxes[0].change();assert.ok(s.el('study-progress').textContent.startsWith('1 / 96'));assert.ok(s.el('study-save-status').textContent.includes('could not be saved'));
s=setup();s.changeHash('#block-6');assert.ok(s.el('block-6').open);s.changeHash('#%');s.changeHash('#missing');
assert.ok(!html.includes('library is in preparation'));assert.ok(!fs.readFileSync(path.join(root,'index.html'),'utf8').includes('Audiciones en preparación'));
console.log(`PASS: 6 blocks / 24 weeks / 96 tasks; ${links} valid local links; no obsolete plan; current progress preserved and persisted, malformed/blocked storage, block counters and deep links; unchanged timer markup. DOM simulation only.`);
