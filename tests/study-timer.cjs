// Deterministic timer regression: elapsed time, pause/resume, reset, break, completion.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const els={};for(const id of ['timer-display','timer-status','timer-start','timer-reset','timer-break'])els[id]={textContent:'',addEventListener(t,fn){this[t]=fn}};
let now=0,interval;
vm.runInNewContext(fs.readFileSync(require('node:path').join(__dirname,'../js/study-timer.js'),'utf8'),{document:{getElementById:id=>els[id]},Date:{now:()=>now},setInterval:fn=>(interval=fn,1),clearInterval:()=>interval=null});
const click=id=>els[id].click(),shown=()=>els['timer-display'].textContent;
assert.equal(shown(),'20:00');click('timer-start');now+=61000;interval();assert.equal(shown(),'18:59');
click('timer-start');assert.equal(interval,null);now+=30000;click('timer-start');now+=1000;interval();assert.equal(shown(),'18:58');
click('timer-reset');assert.equal(shown(),'20:00');assert.equal(interval,null);
click('timer-break');assert.equal(shown(),'05:00');click('timer-start');now+=300000;interval();assert.equal(shown(),'00:00');assert.equal(interval,null);assert.ok(els['timer-status'].textContent.includes('complete'));
click('timer-reset');assert.equal(shown(),'20:00');console.log('PASS: timer start, elapsed-time catch-up, pause/resume, reset, five-minute break and completion.');
