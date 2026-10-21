// Run: node tests/listening-audit.cjs
// Uses a small DOM simulation; does not replace Safari / browser playback testing.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),base='85662293801cf10ce62cfc2a2f7f3631834e4209';
const expanded={'everyday-05':7,'people-05':6,'culture-05':7,'weather-04':6};
const intact=['everyday-01','everyday-02','people-01','people-02','culture-02','news-01','news-02','weather-02'];
const original=f=>execFileSync('git',['show',`${base}:${f}`],{cwd:root,maxBuffer:5000000});
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const spoken=s=>s.match(/<div id="transcript-text"[^>]*>([\s\S]*?)<\/div>/)[1].replace(/<span class="evidence-label">[\s\S]*?<\/span>/g,'').replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/\s+([.,;:?!])/g,'$1').replace(/\s+/g,' ').trim();
let total=0,speeds=0,pages=0,audios=new Set();
for(const file of fs.readdirSync(path.join(root,'pages/listening')).filter(x=>/^(everyday|people|culture|news|weather)-0[1-5]\.html$/.test(x))){
 const id=file.replace('.html',''),rel=`pages/listening/${file}`,s=fs.readFileSync(path.join(root,rel),'utf8'),old=original(rel).toString();
 if(intact.includes(id))assert.equal(s,old,`${id}: unchanged activity`);
 assert.equal(spoken(s),spoken(old),`${id}: transcript words preserved`);
 let els={},answers={};
 function el(id){return els[id]??=( {value:'0.85',innerHTML:'',textContent:'',open:false,attrs:{},events:{},classList:{set:new Set(),add(x){this.set.add(x)},remove(x){this.set.delete(x)},contains(x){return this.set.has(x)},toggle(x,on){if(on)this.set.add(x);else this.set.delete(x)}},setAttribute(k,v){this.attrs[k]=String(v)},getAttribute(k){return this.attrs[k]??null},addEventListener(k,f){(this.events[k]??=[]).push(f)},click(){this.onclick?.();for(const f of this.events.click??[])f()},scrollIntoView(){},querySelector(){return el('source')}})}
 const doc={getElementById:el,querySelector(sel){if(sel==='audio')return el('audio');const m=sel.match(/name="q(\d+)"/);return m&&answers[m[1]]!==undefined?{value:String(answers[m[1]])}:null}};
 const ctx=vm.createContext({document:doc});const inline=[...s.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).join('\n');
 vm.runInContext(inline+'\nglobalThis.auditItems=items;',ctx);vm.runInContext(fs.readFileSync(path.join(root,'js/listening-transcript.js'),'utf8'),ctx);
 const items=ctx.auditItems,n=items.length;assert.equal(n,expanded[id]??5,`${id}: question count`);total+=n;pages++;
 assert.equal((el('questions').innerHTML.match(/<fieldset/g)??[]).length,n);
 for(const [i,it] of items.entries()){
  assert.equal(it.q.startsWith(`${i+1}. `),true,`${id}: numbering`);assert.equal(it.opts.length,3);assert.equal(new Set(it.opts).size,3);assert.ok(it.a>=0&&it.a<3);
  assert.ok(it.h);if(/0[345]$/.test(id))assert.equal(/[«»]/.test(it.h),false,`${id}: English hint`);
  if(id!=='everyday-01'&&id!=='weather-01')assert.ok(it.e,`${id}: feedback explanation`);
 }
 const tr=s.match(/<div id="transcript-text"[^>]*>([\s\S]*?)<\/div>/)[1];const labels=[...tr.matchAll(/\[Q(\d+)\]/g)].map(m=>Number(m[1]));
 assert.deepEqual([...new Set(labels)],Array.from({length:n},(_,i)=>i+1),`${id}: evidence coverage and chronology`);
 assert.deepEqual(labels,[...labels].sort((a,b)=>a-b),`${id}: evidence order`);
 assert.ok(el('questions').innerHTML.includes('class="hint "'));
 el('independent').click();assert.ok(el('questions').innerHTML.includes('class="hint hidden"'));assert.equal(el('independent').getAttribute('aria-pressed'),'true');
 el('guided').click();assert.ok(el('questions').innerHTML.includes('class="hint "'));assert.equal(el('guided').getAttribute('aria-pressed'),'true');
 const submit=()=>el('quiz').onsubmit({preventDefault(){}});
 answers=Object.fromEntries(items.map((it,i)=>[i,it.a]));submit();assert.ok(el('results').innerHTML.includes(`${n} / ${n}`));assert.ok(el('results').innerHTML.includes(`${n}/${n}`));assert.ok(!el('results').innerHTML.includes('undefined'));
 answers=Object.fromEntries(items.map((it,i)=>[i,(it.a+1)%3]));submit();assert.ok(el('results').innerHTML.includes(`0 / ${n}`));
 answers={};submit();assert.ok(el('results').innerHTML.includes(`0 / ${n}`));assert.ok(el('results').innerHTML.includes(`0/${n}`));
 answers={0:items[0].a};submit();assert.ok(el('results').innerHTML.includes(`1 / ${n}`));assert.ok(el('results').innerHTML.includes(`1/${n}`));
 el('listening-transcript').open=true;el('transcript-highlight').click();assert.ok(el('transcript-text').classList.contains('show-evidence'));assert.equal(el('transcript-highlight').getAttribute('aria-pressed'),'true');
 el('reset').click();assert.equal(el('listening-transcript').open,false);assert.equal(el('transcript-highlight').getAttribute('aria-pressed'),'false');assert.ok(el('results').classList.contains('hidden'));
 if(s.includes('id="speed"')){speeds++;for(const rate of ['0.75','0.85','1']){el('speed').value=rate;el('speed').onchange();assert.equal(el('audio').playbackRate,Number(rate));}}
 assert.equal(s.includes('id="speed"'),old.includes('id="speed"'),`${id}: speed controls preserved`);
 const src=s.match(/<source src="([^"]+)"/)[1];assert.equal(src,old.match(/<source src="([^"]+)"/)[1]);const audio=path.relative(root,path.resolve(root,'pages/listening',src));audios.add(audio);assert.equal(hash(fs.readFileSync(path.join(root,audio))),hash(original(audio)),`${id}: MP3 unchanged`);
}
assert.equal(pages,25);assert.equal(total,131);assert.equal(speeds,23);assert.equal(audios.size,25);
const catalogue=fs.readFileSync(path.join(root,'pages/listening.html'),'utf8');assert.ok(catalogue.includes('five to seven questions'));assert.ok(catalogue.includes('entre cinco y siete preguntas'));
for(const [id,n]of Object.entries(expanded)){
 const card=[...catalogue.matchAll(/<div class="listen-card"[^>]*>([\s\S]*?)<\/div>/g)].find(m=>m[1].includes(`listening/${id}.html`));assert.ok(card?.[1].includes(`${n} questions`),`${id}: catalogue count`);
}
assert.equal(fs.readFileSync(path.join(root,'js/listening-transcript.js'),'utf8'),original('js/listening-transcript.js').toString());
console.log('PASS: 25 activities, 131 questions, scoring and modes, 23 speed selectors, chronological evidence, unchanged transcripts, 25 identical MP3s and 8 untouched activities. DOM simulation only.');
