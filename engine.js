/* Pure, dependency-free rules. Also usable from Node for verification. */
(function(root) {
'use strict';
const SERIES=3, DICE=5, ROLLS=3;
function pipSum(dice){return (dice||[]).reduce((a,b)=>a+b,0);}
function totals(series){return (series||[]).reduce((s,v)=>s+(v||0),0);}
// Hold dice already above the expected value of a reroll (3.5): 4, 5 and 6.
function chooseHold(dice){return (dice||[]).map(v=>v>=4);}
function classify(dice){
  const s=pipSum(dice);
  if(s>=28)return 'beast';
  if(s>=22)return 'great';
  if(s<=12)return 'bad';
  return 'normal';
}
const api={SERIES,DICE,ROLLS,pipSum,totals,chooseHold,classify};
if(typeof module!=='undefined'&&module.exports)module.exports=api;
root.DiceEngine=api;
})(typeof window!=='undefined'?window:globalThis);
