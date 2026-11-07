/* Pure, dependency-free rules. Also usable from Node for verification. */
(function(root) {
'use strict';
const categories = [
  ['ones','Jedynki',1],['twos','Dwójki',2],['threes','Trójki',3],['fours','Czwórki',4],['fives','Piątki',5],['sixes','Szóstki',6],
  ['three','Trójka'],['four','Kareta'],['full','Full'],['small','Mały strit'],['large','Duży strit'],['yahtzee','Generał'],['chance','Szansa']
].map(([id,label,face])=>({id,label,face}));
function score(id,dice) {
  const counts=Array(7).fill(0); dice.forEach(d=>counts[d]++);
  const sum=dice.reduce((a,b)=>a+b,0), cat=categories.find(c=>c.id===id);
  if (!cat || dice.length!==5) return 0;
  if(cat.face) return counts[cat.face]*cat.face;
  switch(id) {
    case 'three': return Math.max(...counts)>=3?sum:0;
    case 'four': return Math.max(...counts)>=4?sum:0;
    case 'full': return counts.includes(3)&&counts.includes(2)?25:0;
    case 'small': return [1,2,3].some(s=>[s,s+1,s+2,s+3].every(v=>counts[v]))?30:0;
    case 'large': return [1,2].some(s=>[s,s+1,s+2,s+3,s+4].every(v=>counts[v]))?40:0;
    case 'yahtzee': return counts.includes(5)?50:0;
    case 'chance': return sum;
  }
  return 0;
}
function totals(card) {
  const upper=categories.filter(c=>c.face).reduce((s,c)=>s+(card[c.id]??0),0);
  const bonus=upper>=63?35:0;
  return {upper,bonus,total:Object.values(card).reduce((a,b)=>a+b,0)+bonus};
}
const baseline={three:18,four:14,full:16,small:22,large:25,yahtzee:9,chance:22};
function utility(cat,value,card) {
  if(cat.face) {
    const upper=totals(card).upper;
    const remaining=categories.filter(c=>c.face&&card[c.id]===undefined).reduce((a,c)=>a+c.face*3,0);
    const attainable=upper+remaining>=57;
    return value*(attainable&&upper<63?1.5:1.1)-cat.face*2.8;
  }
  return value-baseline[cat.id];
}
function chooseCategory(dice,card) {
  return categories.filter(c=>card[c.id]===undefined).map(c=>({id:c.id,value:score(c.id,dice),utility:utility(c,score(c.id,dice),card)})).sort((a,b)=>b.utility-a.utility||b.value-a.value)[0];
}
// All unordered outcomes with their multiplicities; exact one-roll expectation.
const outcomes=[];
for(let n=0;n<=5;n++) {
  outcomes[n]=[];
  function visit(a,start) {
    if(a.length===n){const count=Array(7).fill(0);a.forEach(v=>count[v]++);let ways=[1,1,2,6,24,120][n];count.forEach(c=>ways/=[1,1,2,6,24,120][c]);outcomes[n].push({dice:a,prob:ways/6**n});return;}
    for(let v=start;v<=6;v++) visit([...a,v],v);
  }
  visit([],1);
}
function chooseHold(dice,card,risk=false) {
  const counts=Array(7).fill(0); dice.forEach(v=>counts[v]++);
  const face=counts.indexOf(Math.max(...counts));
  if(risk&&counts[face]>=3&&counts[face]<5&&(card.yahtzee===undefined||card.four===undefined))return dice.map(v=>v===face);
  let best=-Infinity,bestMask=0;const seen=new Set();
  for(let mask=0;mask<32;mask++) {
    const held=dice.filter((_,i)=>mask&(1<<i));const key=[...held].sort().join('');if(seen.has(key))continue;seen.add(key);
    let expected=0;
    for(const o of outcomes[5-held.length])expected+=o.prob*chooseCategory([...held,...o.dice],card).utility;
    if(expected>best+1e-8){best=expected;bestMask=mask;}
  }
  return dice.map((_,i)=>!!(bestMask&(1<<i)));
}
const api={categories,score,totals,chooseCategory,chooseHold,outcomes};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
root.DiceEngine=api;
})(typeof window!=='undefined'?window:globalThis);
