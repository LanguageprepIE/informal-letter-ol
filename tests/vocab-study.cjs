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
const occurrences=set.sentences.flatMap(s=>s.parts.filter(p=>typeof p==='object').map(p=>p.word));
assert.equal(occurrences.length,6);assert.equal(new Set(occurrences).size,6);
for(const id of occurrences)assert.ok(words[id]);
const base=execFileSync('git',['show','98e573f53145a0915edce896b94aca434ab02da5:pages/vocab.html'],{cwd:root,encoding:'utf8'});
const vocab=fs.readFileSync(path.join(root,'pages/vocab.html'),'utf8');
const additions=[...vocab.matchAll(/\n<p class="vocab-study-entry">.*?<\/p>/g)];assert.equal(additions.length,2);
assert.equal(vocab.replace(/\n<p class="vocab-study-entry">.*?<\/p>/g,''),base,'All existing vocabulary, examples, year generator and inline scripts must remain byte-identical');
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
console.log('PASS: 6 words / 3 steps; spelling and valid alternatives; navigation, retained answers, translation, checking, reset, invalid group; original vocabulary page byte-identical apart from two new links. DOM simulation only.');
