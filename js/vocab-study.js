'use strict';
function normaliseVocabularyAnswer(value) {
  return String(value).normalize('NFC').trim().toLocaleLowerCase('es').replace(/[.!?]+$/u,'').trim().replace(/\s+/gu,' ');
}
function withoutVocabularyDiacritics(value) {
  return value.normalize('NFD').replace(/\p{M}/gu,'');
}
function evaluateVocabularyAnswer(value,word) {
  const normal = normaliseVocabularyAnswer(value);
  if (!normal) return {state:'empty',recognised:false,message:'Write a word or expression using the English clue.'};
  const answers = [word.answer,...word.alternatives];
  const stripped = normal.replace(/^(el|la|los|las|un|una|unos|unas)\s+/u,'');
  const clean = answers.some(answer=>withoutVocabularyDiacritics(normaliseVocabularyAnswer(answer))===withoutVocabularyDiacritics(normal)) ? normal : stripped;
  const match = answers.find(answer => withoutVocabularyDiacritics(normaliseVocabularyAnswer(answer)) === withoutVocabularyDiacritics(clean));
  if (!match) return {state:'review',recognised:false,message:'Revisit this word. Use the English clue or consult the vocabulary list below.'};
  if (clean !== normaliseVocabularyAnswer(match)) return {state:'spelling',recognised:true,message:'Word recognised. Check the spelling: '+match+'.'};
  if (clean !== normal) return {state:'correct',recognised:true,message:'Right word. In this gap, write only '+match+'.'};
  if (match !== word.answer) return {state:'correct',recognised:true,message:'Correct: '+match+' also fits here. The expression studied is '+word.answer+'.'};
  return {state:'correct',recognised:true,message:'Correct / Correcto.'};
}
function initVocabularyStudy(doc,search,sets) {
  const key = new URLSearchParams(search).get('set') || 'home-rooms-1';
  const set = Object.prototype.hasOwnProperty.call(sets,key) ? sets[key] : null;
  if (!set) {doc.getElementById('study-unavailable').hidden=false;return;}
  const byId=Object.fromEntries(set.words.map(word=>[word.id,word]));
  const get=id=>doc.getElementById(id);
  const make=(tag,text,cls)=>{const el=doc.createElement(tag);if(text!==undefined)el.textContent=text;if(cls)el.className=cls;return el;};
  get('study-content').hidden=false;
  get('study-title').textContent=set.title;
  get('study-topic').textContent=set.topic;
  get('reference-link').href=set.reference;
  get('reference-link').textContent='← '+(set.referenceLabel || set.topic);
  const count=set.words.length,format=set.format || 'text';
  get('understand-intro').textContent='Study these '+count+' words or expressions with their examples. / Estudia estas '+count+' palabras o expresiones con sus ejemplos.';
  const reading={text:['Read the short text. Notice how the words fit into the sentences. / Observa las palabras en el texto.','Complete the same text using the English clues. / Completa el mismo texto con las pistas en inglés.'],sentences:['Read each example separately. These are independent situations. / Lee cada ejemplo por separado: son situaciones independientes.','Complete the same examples using the English clues. / Completa los mismos ejemplos con las pistas en inglés.'],facts:['Read these short information cards. Each one gives a separate piece of information. / Lee estas fichas breves: cada una aporta un dato independiente.','Complete the same information cards using the English clues. / Completa las mismas fichas con las pistas en inglés.']};
  const instructions=reading[format];
  get('read-intro').textContent=instructions[0];
  get('complete-intro').textContent=instructions[1]+' Write only the missing part; the rest is already provided. / Escribe solo la parte que falta.';
  get('study-reading').className='study-text format-'+format;
  get('model-text').className='study-text format-'+format;
  get('read-title').textContent=format==='facts'?'2. Read the information / Lee la información':format==='sentences'?'2. Read the examples / Lee los ejemplos':'2. Read in context / Lee en contexto';
  doc.title=set.title+' — Guided vocabulary study · LC OL';
  for (const word of set.words) {
    const row=make('div'),term=make('dt',word.es);term.lang='es';
    const meaning=make('dd',word.en,'word-meaning');
    const example=make('dd');const spanish=make('span',word.example);spanish.lang='es';
    example.append(spanish,make('span',word.translation,'example-translation'));
    row.append(term,meaning,example);get('study-words').append(row);
    const refTerm=make('dt',word.es);refTerm.lang='es';get('reference-words').append(refTerm,make('dd',word.en));
  }
  function appendModel(host) {
    for(const sentence of set.sentences){const p=make('p');for(const part of sentence.parts){if(typeof part==='string')p.append(doc.createTextNode(part));else p.append(make('span',byId[part.word].answer,'studied-word'));}host.append(p);}
  }
  appendModel(get('study-reading'));appendModel(get('model-text'));
  for(const sentence of set.sentences)get('study-translation').append(make('p',sentence.en));
  const fields=[];
  for(const sentence of set.sentences){
    const p=make('p',undefined,'gap-sentence');p.lang='es';
    for(const part of sentence.parts){
      if(typeof part==='string'){p.append(doc.createTextNode(part));continue;}
      const word=byId[part.word],label=make('label',undefined,'word-gap');
      const accessible=make('span','Spanish word or expression for '+word.en,'sr-only');accessible.lang='en';accessible.id='label-'+word.id;
      const input=make('input');input.type='text';input.id='gap-'+word.id;input.name=word.id;input.maxLength=60;input.autocomplete='off';input.setAttribute('autocapitalize','none');input.spellcheck=false;
      const clue=make('span',word.en,'gap-clue');clue.id='clue-'+word.id;clue.lang='en';
      const feedback=make('span','','word-feedback');feedback.id='feedback-'+word.id;feedback.lang='en';
      input.setAttribute('aria-labelledby',accessible.id);
      input.setAttribute('aria-describedby',clue.id+' '+feedback.id);
      label.append(accessible,input,clue,feedback);p.append(label);fields.push({input,feedback,word});
    }
    get('study-gaps').append(p);
  }
  get('translation-toggle').addEventListener('click',()=>{
    const visible=get('study-translation').hidden;get('study-translation').hidden=!visible;
    get('translation-toggle').setAttribute('aria-expanded',String(visible));
    get('translation-toggle').textContent=visible?'Hide English translation / Ocultar traducción':'Show English translation / Ver traducción';
  });
  const panels=[0,1,2].map(i=>get('study-step-'+i));
  const buttons=[...doc.querySelectorAll('[data-study-step]')];let step=0;
  function showStep(next,focus=true){
    step=Math.max(0,Math.min(2,next));panels.forEach((panel,i)=>panel.hidden=i!==step);
    buttons.forEach((button,i)=>{if(i===step)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');});
    get('step-status').textContent='Step '+(step+1)+' of 3 / Paso '+(step+1)+' de 3';
    get('previous-step').disabled=step===0;get('next-step').hidden=step===2;
    get('word-reference').open=false;get('model-answer').open=false;
    get('study-translation').hidden=true;get('translation-toggle').setAttribute('aria-expanded','false');get('translation-toggle').textContent='Show English translation / Ver traducción';
    if(focus)panels[step].querySelector('h2').focus();
  }
  buttons.forEach((button,i)=>button.addEventListener('click',()=>showStep(i)));
  get('previous-step').addEventListener('click',()=>showStep(step-1));get('next-step').addEventListener('click',()=>showStep(step+1));
  get('completion-form').addEventListener('submit',event=>{
    event.preventDefault();let recognised=0,spelling=0;
    for(const {input,feedback,word} of fields){const result=evaluateVocabularyAnswer(input.value,word);input.dataset.result=result.state;input.setAttribute('aria-invalid',String(!result.recognised));feedback.textContent=result.message;if(result.recognised)recognised++;if(result.state==='spelling')spelling++;}
    const summary=recognised===fields.length?'All '+fields.length+' words recognised.':'Words recognised: '+recognised+' of '+fields.length+'. Revisit the remaining words at your own pace.';
    get('practice-summary').textContent=summary+(spelling?' Check the spelling reminders.':'');
  });
  function clearField(input,feedback){delete input.dataset.result;input.removeAttribute('aria-invalid');feedback.textContent='';}
  fields.forEach(({input,feedback})=>input.addEventListener('input',()=>{clearField(input,feedback);get('practice-summary').textContent='';}));
  get('clear-practice').addEventListener('click',()=>{fields.forEach(({input,feedback})=>{input.value='';clearField(input,feedback);});get('practice-summary').textContent='';get('model-answer').open=false;get('word-reference').open=false;fields[0].input.focus();});
  showStep(0,false);
}
if(typeof module!=='undefined'&&module.exports)module.exports={normaliseVocabularyAnswer,evaluateVocabularyAnswer,initVocabularyStudy};
else initVocabularyStudy(document,location.search,vocabularyStudySets);
