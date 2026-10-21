// Run: node tests/vocab-study.cjs. Pure answer checks and DOM simulation.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const sets=require('../js/vocab-study-data.js'),{evaluateVocabularyAnswer:evaluate,initVocabularyStudy:init}=require('../js/vocab-study.js');
const set=sets['home-rooms-1'];
assert.equal(set.words.length,6);
const words=Object.fromEntries(set.words.map(w=>[w.id,w]));
for(const w of set.words){
 assert.equal(evaluate(w.answer,w).state,'correct');
 assert.equal(evaluate('  '+w.answer.toUpperCase()+'  ',w).state,'correct');
 assert.equal(evaluate(w.answer.normalize('NFD'),w).state,'correct');
 assert.equal(evaluate(w.es,w).recognised,true);
 assert.equal(evaluate('',w).state,'empty');assert.equal(evaluate('mesa',w).recognised,false);
 for(const a of w.alternatives)assert.equal(evaluate(a,w).state,'correct');
}
for(const [id,answer]of [['salon','salon'],['bano','cuarto de bano'],['jardin','jardin']])assert.equal(evaluate(answer,words[id]).state,'spelling');
assert.equal(evaluate('salonero',words.salon).recognised,false);
assert.equal(evaluate('habitación',words.dormitorio).recognised,false,'Alternative must fit the masculine adjectives in this sentence');
const occurrences=set.sentences.flatMap(s=>s.parts.filter(p=>typeof p==='object').map(p=>p.word));
assert.equal(occurrences.length,6);assert.equal(new Set(occurrences).size,6);
for(const id of occurrences)assert.ok(words[id]);
const base=execFileSync('git',['show','98e573f53145a0915edce896b94aca434ab02da5:pages/vocab.html'],{cwd:root,encoding:'utf8'});
const vocab=fs.readFileSync(path.join(root,'pages/vocab.html'),'utf8');
const additions=[...vocab.matchAll(/\n<p class="vocab-study-entry">.*?<\/p>/g)];assert.equal(additions.length,24);
assert.equal(vocab.replace(/\n<p class="vocab-study-(?:entry|intro)">.*?<\/p>/g,'').replace('<link rel="stylesheet" href="../css/vocab-study-links.css?v=1">',''),base,'All existing vocabulary, examples, year generator and inline scripts must remain byte-identical');
assert.ok(!vocab.slice(0,vocab.indexOf('<div class="vocab-index-groups">')).includes('vocab-study.html?'));
for(const [key,group]of Object.entries(sets)){
 const entry=vocab.indexOf('vocab-study.html?set='+key+'"');
 assert.ok(entry>vocab.indexOf('id="'+group.section+'"'),key+' link inside its section');
 assert.equal(vocab.split('vocab-study.html?set='+key+'"').length-1,1,key+' link appears once');
}
for(const w of set.words)assert.ok(vocab.includes(w.es),`Existing word: ${w.es}`);
const html=fs.readFileSync(path.join(root,'pages/vocab-study.html'),'utf8');
for(const [,url]of html.matchAll(/(?:href|src)="([^"]+)"/g)){
 const [file,fragment]=url.split('#');const p=path.resolve(root,'pages',file.split('?')[0]);assert.ok(fs.existsSync(p),url);
 if(fragment)assert.ok(fs.readFileSync(p,'utf8').includes(`id="${fragment}"`),url);
}
function setup(search=''){
 const nodes={};let focus=null;
 class Element{
  constructor(tag='div'){this.tagName=tag;this.children=[];this.attrs={};this.dataset={};this.events={};this.hidden=false;this.open=false;this.value='';this.textContent='';}
  set id(v){this._id=v;nodes[v]=this;}get id(){return this._id;}
  append(...children){this.children.push(...children);}
  setAttribute(k,v){this.attrs[k]=v;}removeAttribute(k){delete this.attrs[k];}
  addEventListener(k,f){this.events[k]=f;}fire(k){this.events[k]({preventDefault(){}});}
  querySelector(){return this.heading??=new Element('h2');}focus(){focus=this;}
 }
 for(const [,id]of html.matchAll(/\bid="([^"]+)"/g)){assert.ok(!nodes[id],`Unique id ${id}`);nodes[id]=new Element();}
 const steps=Array.from({length:3},()=>new Element('button'));
 nodes['study-content'].hidden=true;nodes['study-unavailable'].hidden=true;
 const doc={getElementById:id=>nodes[id],createElement:tag=>new Element(tag),createTextNode:text=>({textContent:text}),querySelectorAll:()=>steps};
 init(doc,search,sets);return{nodes,steps,doc,get focus(){return focus;}};
}
let s=setup(),n=s.nodes;
assert.equal(n['study-content'].hidden,false);assert.equal(n['study-step-0'].hidden,false);assert.equal(n['study-step-1'].hidden,true);
assert.equal(n['study-words'].children.length,6);assert.equal(n['previous-step'].disabled,true);
n['next-step'].fire('click');assert.equal(n['study-step-1'].hidden,false);assert.equal(s.focus,n['study-step-1'].heading);
n['translation-toggle'].fire('click');assert.equal(n['study-translation'].hidden,false);assert.equal(n['translation-toggle'].attrs['aria-expanded'],'true');
n['next-step'].fire('click');assert.equal(n['study-step-2'].hidden,false);assert.equal(n['next-step'].hidden,true);assert.equal(n['study-translation'].hidden,true);
n['completion-form'].fire('submit');assert.ok(n['practice-summary'].textContent.includes('0 of 6'));
for(const w of set.words)n['gap-'+w.id].value=w.answer;
n['gap-salon'].value='salon';n['gap-bano'].value='baño';n['completion-form'].fire('submit');
assert.ok(n['practice-summary'].textContent.includes('All 6'));assert.ok(n['practice-summary'].textContent.includes('spelling'));assert.equal(n['gap-salon'].dataset.result,'spelling');
assert.ok(n['feedback-bano'].textContent.includes('expression studied'));
n['gap-salon'].value='salón';n['gap-salon'].fire('input');assert.equal(n['practice-summary'].textContent,'');assert.equal(n['feedback-salon'].textContent,'');assert.equal(n['gap-salon'].dataset.result,undefined);
n['model-answer'].open=true;n['word-reference'].open=true;s.steps[0].fire('click');assert.equal(n['model-answer'].open,false);assert.equal(n['word-reference'].open,false);assert.equal(n['gap-salon'].value,'salón');
s.steps[2].fire('click');n['clear-practice'].fire('click');assert.equal(n['gap-salon'].value,'');assert.equal(s.focus,n['gap-salon']);
s=setup('?set=missing');assert.equal(s.nodes['study-content'].hidden,true);assert.equal(s.nodes['study-unavailable'].hidden,false);
s=setup('?set=__proto__');assert.equal(s.nodes['study-unavailable'].hidden,false);
console.log('PASS: 6 words / 3 steps; spelling and valid alternatives; navigation, retained answers, translation, checking, reset, invalid group; original vocabulary, examples and year tool byte-identical; section-only activity links. DOM simulation only.');

// Every source entry is traceable to at least one curated study item.
const coverage=require('../docs/vocabulary-coverage.json');
const sourceEntries=new Set(Object.entries(coverage.sections).flatMap(([anchor,section])=>section.entries.map(text=>anchor+'|'+text)));
const covered=new Set();let total=0;
assert.equal(Object.keys(sets).length,40);assert.equal(sourceEntries.size,221);
for(const [key,group]of Object.entries(sets)){
 assert.ok(['text','sentences','facts'].includes(group.format));assert.ok(group.words.length>=4&&group.words.length<=8,key);
 const ids=group.words.map(w=>w.id);assert.equal(new Set(ids).size,ids.length);
 const occurrences=group.sentences.flatMap(s=>s.parts.filter(p=>typeof p==='object').map(p=>p.word));
 assert.deepEqual([...occurrences].sort(),[...ids].sort(),key+' one gap per target');
 const visible=group.sentences.flatMap(s=>s.parts.filter(p=>typeof p==='string')).join(' ').toLocaleLowerCase('es');
 for(const w of group.words){
  assert.ok(!new RegExp('(?:^|[^\\p{L}])'+w.answer.toLocaleLowerCase('es')+'(?:$|[^\\p{L}])','u').test(visible),key+' no visible answer leak: '+w.answer);
  const source=w.source.section+'|'+w.source.text;assert.ok(sourceEntries.has(source),source);covered.add(source);
  assert.ok(w.es&&w.en&&w.example&&w.translation);assert.ok(!w.example.includes('_'));
  for(const answer of [w.answer,...w.alternatives]){assert.equal(evaluate(answer,w).state,'correct',key+': '+answer);assert.equal(evaluate(answer.toUpperCase(),w).recognised,true);}
  assert.equal(evaluate('xxxx',w).recognised,false);
 }
 const state=setup('?set='+key),nodes=state.nodes;
 assert.equal(nodes['study-words'].children.length,group.words.length);
 assert.equal(nodes['study-reading'].className,'study-text format-'+group.format);
 assert.ok(nodes['understand-intro'].textContent.includes(String(group.words.length)));
 state.steps[2].fire('click');
 for(const w of group.words)nodes['gap-'+w.id].value=w.answer;
 nodes['completion-form'].fire('submit');assert.equal(nodes['practice-summary'].textContent,'All '+group.words.length+' words recognised.');
 for(const w of group.words){assert.equal(nodes['gap-'+w.id].attrs['aria-labelledby'],'label-'+w.id);assert.equal(nodes['gap-'+w.id].attrs['aria-invalid'],'false');}
 state.steps[0].fire('click');state.steps[2].fire('click');
 for(const w of group.words)assert.equal(nodes['gap-'+w.id].value,w.answer);
 nodes['clear-practice'].fire('click');for(const w of group.words)assert.equal(nodes['gap-'+w.id].value,'');
 total+=group.words.length;
}
assert.deepEqual([...covered].sort(),[...sourceEntries].sort());assert.equal(total,223);
assert.equal(evaluate('nevera',sets['home-appliances-1'].words[0]).recognised,true);
const fridge=sets['home-appliances-1'].words[0];assert.equal(fridge.example.replace(fridge.answer,'nevera'),'Tengo que limpiar mi nevera.');
const singular=sets.health.words.find(w=>w.answer==='me duele'),plural=sets.health.words.find(w=>w.answer==='me duelen');
assert.equal(evaluate('me duelen',singular).recognised,false);assert.equal(evaluate('me duele',plural).recognised,false);
console.log('PASS: all 40 groups / 223 practice items cover 221 original entries; all three formats render and check; references, unique links, valid alternatives and singular/plural agreement; no change to existing year practice.');

const vm=require('node:vm');
const oldData=execFileSync('git',['show','dece33763fe39eba18ac2c712cf074d5527b2fbb:js/vocab-study-data.js'],{cwd:root,encoding:'utf8'});
const ctx={module:{exports:{}}};vm.runInNewContext(oldData,ctx);
const oldPilot=JSON.parse(JSON.stringify(ctx.module.exports['home-rooms-1']));
const pilot=JSON.parse(JSON.stringify(sets['home-rooms-1']));
for(const k of ['section','format','referenceLabel'])delete pilot[k];
pilot.words.forEach(w=>delete w.source);
assert.deepEqual(pilot,oldPilot,'Approved pilot content remains unchanged');
assert.equal(evaluate('rojo',sets['colours-1'].words[0]).recognised,false,'Mi mochila es roja: feminine agreement');
assert.equal(evaluate('alto',sets['family-appearance'].words[0]).recognised,false,'Mi hermana es alta: feminine agreement');
