'use strict';
const E=DiceEngine, $=id=>document.getElementById(id);
let state,version=0,sound=false,audio,rolling=false,introTimer,introRun=0;
const pips={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};
const lines={
 rolling:["Five little bones. Hear them argue.","Don't blink. Fortune hates an audience.","The table is listening.","Throw them like you mean the deal.","Listen — five verdicts in the air.","The hat is watching the bounce.","A gentleman never flinches at the rattle.","These bones remember every coward.","Let them dance. Then pick your truth.","Keep what you trust. The rest can fall."],
 welcome:['The chair is yours. The odds are not.','Five little bones. Let us see what they remember.'],
 great:['Now that is a hand worth haunting.','The table trembles. I almost approve.','You have put a crack in the darkness.'],
 beast:['Five faces, one verdict. Even the shadows stand to applaud.','Every bone agrees. That is a dangerous kind of harmony.'],
 bad:['Such small numbers for such brave hands.','The dice heard your plan. They declined.','Careful. Hope is a very expensive habit.'],
 normal:['Keep what you trust. Throw back what you fear.','A steady hand can still carry a terrible idea.','Every little square has six ways to betray you.','Your fingers choose. The table remembers.'],
 eddie:['My turn. Watch the hat, not the hands.','A gentleman never argues with fate. He loads it with ambition.','These old bones still know a few tricks.'],
 eddieGreat:['A beautiful arrangement. Do not look so surprised.','The table and I have an understanding.'],
 eddieBad:['An ugly little offering. Even darkness has off nights.','I shall call that a rehearsal.'],
 risk:['Three bones agree. I want the other two to kneel.','A safe wager? How dreadfully forgettable.'],
 win:['You have won the table. Enjoy the silence while it lasts.','Take your victory. I will keep the chair warm.'],
 lose:['The last point is mine. Leave your excuses at the door.','Your courage was splendid. Your arithmetic was less fortunate.'],
 draw:['A perfect deadlock. Neither shadow will bow tonight.'],
 idle:['Take your time. I have centuries, you have a candle.','The hat is patient. The hat is always patient.','Your hand hovers like a moth near a flame.','I can hear you counting. Count louder.','Somewhere a die is already laughing at you.','Lean closer. The table tells secrets to the brave.','Doubt is the sixth face of every die.']
};
lines.normal.push('Every roll is a door. Some open onto stairs going down.','Luck wears gloves. You never see her fingerprints.');
lines.eddie.push('Mind your fingers. These bones bite.','Watch closely. I only cheat in stories.');
const foreign={
 rolling:[['pl','Pięć małych kości. Posłuchaj, jak się spierają.'],['pl','Stół nadstawia ucha. Nie zawiedź go.'],['pl','Cylinder czuwa nad każdym odbiciem.'],['pl','Niech zatańczą. Potem wybierzesz, komu ufasz.'],['pl','Rzuć odważnie. Wahanie nie daje punktów.'],['pl','Dżentelmen nie drży na dźwięk kości.'],['pt','Cinco dados no ar. A mesa prende a respiração.'],['es','Que rueden. El sombrero contará los rebotes.'],['ja','五つの骨が踊る。卓は静かに見守る。'],['de','Lass sie tanzen. Der Tisch zählt jeden Schritt.'],['fr','Cinq dés en voyage. La table attend leur récit.']],
 normal:[['pt','A sorte sussurra. Eu prefiro quando ela grita.'],['pt','Cada dado guarda um segredo de seis faces.'],['es','Quien guarda un dado guarda una promesa.'],['pl','Kość nie pamięta, ale stół tak.'],['ja','六つの面、六つの裏切り。'],['de','Jeder Würfel hat sechs Arten zu lügen.'],['fr','Le destin roule, il ne marche jamais.'],['es','La mesa recuerda cada duda.'],['pl','Nie każda odwaga mieści się w dłoni.'],['ja','さあ、運命を卓上に投げてみろ。'],['de','Der Tisch vergisst kein Zögern.'],['fr','Le hasard a des dents. Garde tes doigts.']],
 great:[['pt','Até as sombras aplaudem essa mão.'],['es','Hasta la oscuridad reconoce esa jugada.'],['pl','Nawet cień uchyla przed tobą kapelusza.'],['ja','影さえ、その一投に頭を下げる。'],['de','Selbst die Schatten verneigen sich.'],['fr','Même les ombres saluent ce lancer.']],
 bad:[['pt','Tanta coragem para tão poucos pontos.'],['es','Tu esperanza pesa más que esos puntos.'],['pl','Wiele hałasu, niewiele oczek.'],['ja','勇気は立派だ。点数はどうかな。'],['de','Viel Mut. Erstaunlich wenig Punkte.'],['fr','Quel courage pour si peu de points.']],
 win:[['pt','A vitória é tua. A cadeira fica à tua espera.'],['es','Has ganado. La mesa guardará tu nombre.'],['pl','Wygrałeś. Ten stół zapamięta twoją dłoń.'],['ja','お前の勝ちだ。この卓は覚えている。'],['de','Du hast gewonnen. Der Tisch merkt sich deinen Namen.'],['fr','Tu as gagné. La table retiendra ton nom.']],
 idle:[['pt','O tempo corre, mas a mesa não tem pressa.'],['pt','Quem hesita alimenta a sorte.'],['es','El sombrero no tiene prisa. Yo tampoco.'],['es','Cada duda es un dado más en mi mano.'],['pl','Myśl szybciej, świeca nie będzie czekać.'],['pl','Los lubi tych, którzy nie liczą na palcach.'],['ja','迷う指ほど、よく震える。'],['ja','急げ。蝋燭は待ってくれない。'],['de','Zögern ist auch ein Wurf – nur ein schlechter.'],['de','Mein Hut hat schon schlimmere Spieler gesehen.'],['fr','Le chapeau attend. Il a l’habitude.'],['fr','Chaque seconde perdue tombe dans ma poche.']],
 eddie:[['pt','Agora os ossos falam por mim.'],['es','Mira el sombrero, no las manos.'],['pl','Teraz moja kolej. Patrz uważnie.'],['ja','次は俺の番だ。目を離すなよ。'],['de','Jetzt spreche ich mit den Würfeln.'],['fr','À moi. Les os connaissent ma voix.']],
 eddieGreat:[['pt','A mesa e eu entendemo-nos bem.'],['es','La suerte me debe favores.'],['pl','Stół i ja dobrze się rozumiemy.'],['ja','見ろ、骨が俺にひれ伏した。'],['de','Das Glück kennt meinen Namen.'],['fr','La chance me doit quelques faveurs.']],
 eddieBad:[['pt','Até os mortos têm noites más.'],['es','Una noche floja, nada más.'],['pl','Nawet cienie mają gorsze noce.'],['ja','今のは稽古だ。'],['de','Eine Probe, nichts weiter.'],['fr','Simple répétition, rien de plus.']],
 lose:[['pt','A última palavra pertence aos meus dados.'],['es','Mis dados han dicho la última palabra.'],['pl','Ostatnie słowo należy do moich kości.'],['ja','最後の言葉は俺のサイコロが決めた。'],['de','Meine Würfel haben das letzte Wort.'],['fr','Mes dés ont gardé le dernier mot.']]
};
const pick=a=>a[Math.floor(Math.random()*a.length)];
let moodTimer,chatTimer;
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
function mood(m,ms=1400){const a=$('avatar');clearTimeout(moodTimer);a.dataset.mood='idle';void a.offsetWidth;a.dataset.mood=m;if(ms)moodTimer=setTimeout(()=>{a.dataset.mood=state&&state.turn==='eddie'?'thinking':'idle';},ms);}
const moodFor={great:'unimpressed',beast:'pleased',bad:'pleased',eddieGreat:'pleased',eddieBad:'unimpressed',win:'unimpressed',lose:'pleased',risk:'speaking'};
function say(type,m) {
 let text,lang='en';
 if(Math.random()<.4&&foreign[type]){[lang,text]=pick(foreign[type]);}else if(Math.random()<.4&&!foreign[type]&&type!=='welcome'){[lang,text]=pick(foreign.normal);}else text=pick(lines[type]||lines.normal);
 $('quote').textContent='“'+text+'”';$('quote').lang=lang;
 const b=$('bubble');if(b){b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop');}
 mood(m||moodFor[type]||'speaking');
 return {text,lang};
}
function scheduleChatter(){clearTimeout(chatTimer);chatTimer=setTimeout(()=>{if(state.turn==='player'&&!rolling&&$('intro').hidden){say('idle');scheduleChatter();}},12000+Math.random()*6000);}
// Table SFX never share playback or volume with the separate intro film.
const activeSfx=new Set();
function stopTableSound(){for(const voice of activeSfx){try{voice.pause();voice.currentTime=0;}catch(_){}}activeSfx.clear();if(audio)audio.suspend().catch(()=>{});}
function fallbackSound(kind){
 if(!sound||!$('intro').hidden)return;
 try{audio=audio||new (window.AudioContext||window.webkitAudioContext)();audio.resume().catch(()=>{});
 const duration=kind==='landing'?.22:.11,buffer=audio.createBuffer(1,Math.ceil(audio.sampleRate*duration),audio.sampleRate),data=buffer.getChannelData(0);
 let low=0;for(let i=0;i<data.length;i++){const t=i/audio.sampleRate;low=.65*low+.35*(Math.random()*2-1);data[i]=(low*.45+Math.sin(t*2*Math.PI*210)*.16)*Math.exp(-t*38);}
 const source=audio.createBufferSource();source.buffer=buffer;source.connect(audio.destination);source.start();
 }catch(_){/* Audio is optional; scoring must remain available. */}
}
function tableSound(kind){
 if(!sound||!$('intro').hidden)return;
 const voice=new Audio('sfx/'+kind+'.wav');voice.volume=.7;activeSfx.add(voice);let failed=false;
 const fail=()=>{activeSfx.delete(voice);if(!failed){failed=true;fallbackSound(kind);}};
 voice.onended=()=>activeSfx.delete(voice);voice.onerror=fail;
 try{const playing=voice.play();if(playing)playing.catch(fail);}catch(_){fail();}
}
function cancelAnims(el){if(!el||!el.getAnimations)return;el.getAnimations().forEach(a=>{try{a.cancel();}catch(_){}});}
function clearThrow(){
 $('roll-line').classList.remove('visible');$('duel').classList.remove('in-flight','impact','gold-hand','pour-eddie','pour-player');
 pourTimers.splice(0).forEach(clearTimeout);
 for(const id of ['eddie-fist','player-hand']){const h=$(id);if(!h)continue;cancelAnims(h);h.querySelectorAll('*').forEach(cancelAnims);}
 for(const el of $('dice').children){cancelAnims(el);cancelAnims(el.querySelector('.cube'));el.classList.remove('pouring','landed','rolling');el.style.zIndex='';}
}
function startThrow(who){
 clearThrow();const spoken=say('rolling',who==='eddie'?'reaching':'watching');$('roll-line').textContent='“'+spoken.text+'”';$('roll-line').lang=spoken.lang;
 $('roll-line').classList.add('visible');$('duel').classList.add('in-flight',who==='eddie'?'pour-eddie':'pour-player');tableSound('rattle');
}
function landThrow(dice){
 $('roll-line').classList.remove('visible');$('duel').classList.remove('in-flight','pour-eddie','pour-player');
 $('duel').classList.add('impact');if(['great','beast'].includes(classify(dice)))$('duel').classList.add('gold-hand');
}
function later(fn,ms){const id=setTimeout(fn,ms);pourTimers.push(id);}
function motion(x,y,r,s,o){return {transform:`translate(${x.toFixed(2)}px,${y.toFixed(2)}px) rotate(${r.toFixed(2)}deg) scale(${s})`,opacity:o};}
function dieContents(value){return Array.from({length:9},(_,i)=>pips[value].includes(i)?'<span class="pip" aria-hidden="true"></span>':'<span></span>').join('');}
// Cube rotations that bring each value's face to the camera. Opposites sum to 7.
const FACE_ROT={1:[0,0],2:[0,-90],3:[-90,0],4:[90,0],5:[0,90],6:[0,180]};
const TILT=[-5,3,-2,5,-3];
const POUR_MS=1280;
let pourTimers=[];
function faceTransform(v){const [x,y]=FACE_ROT[v]||FACE_ROT[1];return `rotateX(${x}deg) rotateY(${y}deg)`;}
function dieCube(value){
 const faces=[[1,'face-1'],[6,'face-6'],[2,'face-2'],[5,'face-5'],[3,'face-3'],[4,'face-4']];
 const sides=faces.map(([v,cls])=>`<span class="side ${cls}" data-value="${v}">${dieContents(v)}</span>`).join('');
 return `<span class="die-space"><span class="cube" style="transform:${faceTransform(value)}">${sides}</span></span>`;
}
function sizeDice(){for(const b of $('dice').children){const w=b.offsetWidth;if(w)b.style.setProperty('--half',(w/2)+'px');}}
function renderDice() {
 const tray=$('dice');tray.replaceChildren();
 state.dice.forEach((v,i)=>{const b=document.createElement('button');b.type='button';b.className='die'+(state.held[i]?' held':'');b.style.setProperty('--tilt',TILT[i]+'deg');b.innerHTML=dieCube(v);b.disabled=state.turn!=='player'||state.rolls===0||rolling||state.rolls>=3;b.setAttribute('aria-label',`Kość ${i+1}: ${state.rolls?v:'jeszcze nie rzucona'}${state.held[i]?', zatrzymana':''}`);b.setAttribute('aria-pressed',String(state.held[i]));b.onclick=()=>{state.held[i]=!state.held[i];tableSound('hold');renderDice();$('dice').children[i].focus({preventScroll:true});};tray.append(b);});
 sizeDice();
}
function renderMini(dice=state.eddieDice,held=[]) {
 $('eddie-dice').innerHTML=dice.map((v,i)=>`<span class="mini-die${held[i]?' kept':''}" aria-label="${v}">${['','⚀','⚁','⚂','⚃','⚄','⚅'][v]}</span>`).join('');
}
function renderCard() {
 for(const who of ['player','eddie']){
  const t=E.totals(state[who]);$(who+'-total').textContent=t.total;$(who+'-footer').textContent=t.total;$(who+'-upper').textContent=t.upper+' / 63';$(who+'-bonus').textContent=t.bonus;$(who+'-bonus').classList.toggle('bonus-earned',t.bonus>0);
 }
 for(const section of ['upper','lower']){
  const tbody=$(section+'-rows');tbody.replaceChildren();
  E.categories.filter(c=>section==='upper'?c.face:!c.face).forEach(c=>{
   const tr=document.createElement('tr'),th=document.createElement('th');th.scope='row';th.textContent=c.label;tr.append(th);
   const td=document.createElement('td');
   if(state.player[c.id]!==undefined){td.textContent=state.player[c.id];td.className='recorded';}
   else{const b=document.createElement('button');const available=state.turn==='player'&&state.rolls>0&&!rolling;const val=E.score(c.id,state.dice);b.textContent=available?val:'—';b.className='score-choice'+(val===0?' zero':'');b.disabled=!available;b.setAttribute('aria-label',available?`${c.label}: zapisz ${val} punktów`:`${c.label}: wolna kategoria`);b.onclick=()=>assign(c.id);td.append(b);}tr.append(td);
   const enemy=document.createElement('td');enemy.textContent=state.eddie[c.id]??'—';enemy.className=state.eddie[c.id]!==undefined?'recorded':'';tr.append(enemy);tbody.append(tr);
  });
 }
}
function render() {
 $('round').innerHTML=String(Math.min(state.round,13)).padStart(2,'0')+' <em>/ 13</em>';
 $('turn-label').textContent=state.turn==='player'?'TWÓJ RUCH':state.turn==='eddie'?'RUCH EDDIEGO':'KONIEC POJEDYNKU';
 $('roll-counter').textContent=`RZUT ${state.rolls||'—'} / 3`;
 $('roll').disabled=state.turn!=='player'||state.rolls>=3||rolling;
 $('roll').innerHTML=rolling?'Kości w ruchu…':state.rolls===0?'Rzuć kośćmi <span>↗</span>':'Rzuć ponownie <span>↗</span>';
 $('roll-note').textContent=state.turn==='finished'?'Trzynaście rund. Jeden werdykt.':state.turn==='eddie'?'Eddie wybiera swój los…':state.rolls===3?'Wybierz kategorię na karcie':`Pozostało rzutów: ${3-state.rolls}`;
 renderDice();renderCard();
}
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const randomDie=()=>1+Math.floor(Math.random()*6);
function classify(dice){if(E.score('yahtzee',dice))return 'beast';if(E.score('large',dice)||E.score('full',dice)||E.score('four',dice))return 'great';if(dice.reduce((a,b)=>a+b,0)<=13)return 'bad';return 'normal';}
async function playerRoll(){
 if(state.turn!=='player'||state.rolls>=3||rolling)return;
 clearTimeout(chatTimer);const token=version;rolling=true;const held=state.held.slice();
 const next=state.dice.map((v,i)=>held[i]?v:randomDie());render();
 try{await pour(token,{who:'player',held,finals:next});}catch(_){}if(token!==version)return;
 state.dice=next;state.rolls++;rolling=false;
 say(classify(state.dice));scheduleChatter();$('hint').textContent=state.rolls<3?'Kliknij kości, aby je zatrzymać, albo wybierz kategorię na karcie.':'To ostatni rzut. Wybierz jedną wolną kategorię na karcie.';render();landThrow(state.dice);
}
async function assign(id){
 if(state.turn!=='player'||!state.rolls||rolling||state.player[id]!==undefined)return;
 clearTimeout(chatTimer);tableSound('stamp');state.player[id]=E.score(id,state.dice);state.turn='eddie';$('hint').textContent='Twój wynik został zapisany. Teraz kości przejmuje Eddie.';render();await eddieTurn(version);
}
// Pour loose dice out of a hand. The cube's rest rotation is the real rolled face.
async function pour(token,{who,held,finals}){
 if(reduced())return;
 const buttons=[...$('dice').children];
 const loose=buttons.map((el,i)=>({el,i})).filter(d=>!held[d.i]);
 startThrow(who);if(token!==version)return;
 const hand=$(who==='eddie'?'eddie-fist':'player-hand');
 const svg=hand.querySelector('svg');
 const tray=$('dice').getBoundingClientRect();
 const root=$('pour-hands').getBoundingClientRect();
 if(hand.offsetWidth<20||tray.width<20)return;
 const releaseV=who==='eddie'
  ?{x:tray.left+tray.width/2,y:tray.top+Math.max(28,tray.height*0.22)}
  :{x:tray.left+tray.width/2,y:tray.bottom+28};
 const px=parseFloat(svg.dataset.palmX)||.5,py=parseFloat(svg.dataset.palmY)||.5;
 hand.style.left=(releaseV.x-root.left-hand.offsetWidth*px)+'px';
 hand.style.top=(releaseV.y-root.top-hand.offsetHeight*py)+'px';
 const felt=document.querySelector('.table-felt').getBoundingClientRect(),duel=$('duel').getBoundingClientRect();
 const entryY=who==='eddie'?Math.min(-80,(felt.top-24)-releaseV.y):Math.max(110,(duel.bottom+16)-releaseV.y);
 const exitY=who==='eddie'?entryY-24:entryY+28;
 const T=POUR_MS,pending=[];
 pending.push(hand.animate([
  {transform:`translate(0px,${entryY}px) rotate(${who==='eddie'?-8:7}deg)`,opacity:0,offset:0},
  {transform:`translate(0px,${entryY*.35}px) rotate(${who==='eddie'?-3:3}deg)`,opacity:1,offset:.14},
  {transform:'translate(0px,0px) rotate(0deg)',opacity:1,offset:.24},
  {transform:`translate(0px,${who==='eddie'?10:-8}px) rotate(${who==='eddie'?4:-5}deg)`,opacity:1,offset:.42},
  {transform:'translate(0px,0px) rotate(0deg)',opacity:1,offset:.62},
  {transform:`translate(0px,${exitY}px) rotate(${who==='eddie'?-6:8}deg)`,opacity:0,offset:1}
 ],{duration:T,fill:'both',easing:'linear'}));
 const shut=hand.querySelector('.pose-shut'),open=hand.querySelector('.pose-open');
 const pose={duration:T,fill:'both',easing:'linear'};
 if(shut)pending.push(shut.animate([{opacity:1,offset:0},{opacity:1,offset:.22},{opacity:0,offset:.44},{opacity:0,offset:1}],pose));
 if(open)pending.push(open.animate([{opacity:0,offset:0},{opacity:0,offset:.2},{opacity:1,offset:.44},{opacity:1,offset:1}],pose));
 loose.forEach(({el,i},order)=>{
  const rect=el.getBoundingClientRect();
  const cx=rect.left+rect.width/2,cy=rect.top+rect.height/2;
  const jx=(i-2)*11+((i%2)?6:-5),jy=(who==='eddie'?-6:8)+(i%2?4:-3);
  const dx=releaseV.x+jx-cx,dy=releaseV.y+jy-cy,tilt=TILT[i],stagger=order*0.03;
  el.classList.add('pouring');el.style.zIndex=String(4+order);
  el.setAttribute('aria-label',`Kość ${i+1}: w ruchu`);
  const keys=[
   motion(dx,dy+entryY,-36+i*16,.58,0),
   motion(dx,dy,28+i*12,.66,1),
   motion(dx*.4+(i-2)*12,dy*.32+(who==='eddie'?-20:14),150+order*28,.96,1),
   motion(0,who==='eddie'?6:-5,tilt+12,1.03,1),
   motion(0,who==='eddie'?-3:3,tilt-4,1,1),
   motion(0,0,tilt,1,1)
  ];
  keys[0].offset=0;keys[1].offset=.20+stagger*.15;keys[1].easing='cubic-bezier(.16,.82,.24,1)';
  keys[2].offset=.48+stagger;keys[3].offset=Math.min(.82,.70+stagger);
  keys[4].offset=Math.min(.94,.86+stagger*.2);keys[5].offset=1;
  pending.push(el.animate(keys,{duration:T,fill:'both',easing:'linear'}));
  const cube=el.querySelector('.cube'),end=FACE_ROT[finals[i]]||FACE_ROT[1];
  const dir=i%2?-1:1,spinX=end[0]+360*(2+(i%2)),spinY=end[1]+360*(2+(order%3));
  if(cube)pending.push(cube.animate([
   {transform:`rotateX(${spinX+70*dir}deg) rotateY(${spinY-40}deg)`,offset:0},
   {transform:`rotateX(${end[0]+200*dir}deg) rotateY(${end[1]+240}deg)`,offset:.45},
   {transform:`rotateX(${end[0]+28}deg) rotateY(${end[1]-18}deg)`,offset:.8},
   {transform:`rotateX(${end[0]}deg) rotateY(${end[1]}deg)`,offset:1}
  ],{duration:T,fill:'both',easing:'cubic-bezier(.16,.72,.22,1)'}));
  later(()=>{if(token===version)tableSound('clack-'+(1+(order%3)));},Math.round(T*(.3+order*.045)));
 });
 if(loose.length)later(()=>{if(token===version)tableSound('landing');},Math.round(T*.82));
 await Promise.all(pending.map(a=>a.finished.catch(()=>{})));
}

async function eddieTurn(token){
 clearTimeout(chatTimer);$('duel').classList.add('eddie-turn');state.held=Array(5).fill(false);renderDice();say('eddie','speaking');let dice=[],held=Array(5).fill(false);$('roll-counter').textContent='RZUT — / 3';
 for(let n=1;n<=3;n++){
  await delay(n===1?650:750);if(token!==version)return;
  dice=n===1?Array.from({length:5},randomDie):dice.map((v,i)=>held[i]?v:randomDie());try{await pour(token,{who:'eddie',held,finals:dice});}catch(_){}if(token!==version)return;state.eddieDice=dice;state.dice=dice;state.held=Array(5).fill(false);renderDice();renderMini(dice);landThrow(dice);
  $('roll-counter').textContent=`RZUT ${n} / 3`;$('eddie-action').textContent=`Rzut ${n}/3 · Eddie przygląda się kościom…`;
  say(E.score('yahtzee',dice)?'beast':classify(dice)==='great'?'eddieGreat':classify(dice)==='bad'?'eddieBad':'eddie');
  if(n===3)break;
  // Yield before calculating the one-roll expected-value strategy.
  await delay(80);if(token!==version)return;
  const risk=Math.random()<.17;held=E.chooseHold(dice,state.eddie,risk);renderMini(dice,held);mood('thinking',0);await delay(350);if(token!==version)return;state.held=held.slice();renderDice();
  if(held.every(Boolean))break;
  const count=held.filter(Boolean).length;$('eddie-action').textContent=`Zatrzymuje ${count} z 5 kości. ${risk&&count>=3?'Ryzykuje dla wielkiego wyniku.':'Szuka lepszego układu.'}`;
  if(risk&&count>=3)say('risk');
 }
 await delay(700);if(token!==version)return;
 const choice=E.chooseCategory(dice,state.eddie);state.eddie[choice.id]=choice.value;tableSound('stamp');$('duel').classList.remove('eddie-turn');renderMini(dice);
 $('eddie-action').textContent=`${E.categories.find(c=>c.id===choice.id).label}: ${choice.value} pkt · zapisane.`;renderCard();
 if(state.round===13){finish();return;}
 state.round++;state.turn='player';state.rolls=0;state.held=Array(5).fill(false);state.dice=[1,2,3,4,5];$('hint').textContent='Nowa runda. Rzuć wszystkimi pięcioma kośćmi.';mood('idle',0);render();scheduleChatter();
}
function finish(){
 clearTimeout(chatTimer);$('duel').classList.remove('eddie-turn');state.turn='finished';const p=E.totals(state.player).total,e=E.totals(state.eddie).total;const type=p>e?'win':p<e?'lose':'draw';const spoken=say(type);
 $('result-title').textContent=p>e?'Los uchylił ci kapelusza.':p<e?'Eddie zgarnia stawkę.':'Noc bez zwycięzcy.';$('result-quote').textContent='“'+spoken.text+'”';$('result-quote').lang=spoken.lang;
 $('result-totals').innerHTML=`<div><small>TY</small>${p}</div><span>:</span><div><small>EDDIE</small>${e}</div>`;
 $('result-petition').hidden=type!=='lose';
 $('hint').textContent='Pojedynek zakończony. Karta wyników pozostaje do wglądu.';render();$('result').showModal();
}
function newGame(){version++;rolling=false;clearThrow();stopTableSound();state={player:{},eddie:{},dice:[1,2,3,4,5],eddieDice:[1,2,3,4,5],held:Array(5).fill(false),round:1,rolls:0,turn:'player'};if($('result').open)$('result').close();$('hint').textContent='Rzuć kośćmi. Potem zatrzymaj te, którym ufasz.';$('eddie-action').textContent='Czeka na twój pierwszy ruch.';renderMini();clearTimeout(chatTimer);$('duel').classList.remove('eddie-turn');say('welcome');render();scheduleChatter();}
function updateIntroProgress(){
 const video=$('intro-video');
 const fraction=Number.isFinite(video.duration)&&video.duration>0?Math.min(1,Math.max(0,video.currentTime/video.duration)):0;
 document.querySelector('.intro-progress').style.width=(fraction*100)+'%';
}
function stopIntro(){
 clearTimeout(introTimer);introRun++;
 const video=$('intro-video');video.pause();try{video.currentTime=0;}catch(_){}
 $('intro-play').hidden=true;$('intro').hidden=true;updateIntroProgress();
 document.querySelector('.app-shell').inert=false;
 try{sessionStorage.setItem('eddie-intro','seen');}catch(_){}
 $('roll').focus({preventScroll:true});if(state.turn==='player'&&!rolling)say('welcome');scheduleChatter();
}
async function playIntro(){
 const run=introRun;$('intro-play').hidden=true;
 try{await $('intro-video').play();}
 catch(_){if(run===introRun&&!$('intro').hidden){$('intro-play').hidden=false;$('intro-play').focus({preventScroll:true});}}
}
function startIntro(){
 clearTimeout(introTimer);introRun++;stopTableSound();clearTimeout(chatTimer);
 if($('rules').open)$('rules').close();if($('result').open)$('result').close();
 const video=$('intro-video');video.pause();try{video.currentTime=0;}catch(_){}
 $('intro').hidden=false;$('intro-play').hidden=true;document.querySelector('.app-shell').inert=true;updateIntroProgress();
 $('skip-intro').focus({preventScroll:true});
 if(reduced()){introTimer=setTimeout(stopIntro,4000);}else playIntro();
}
$('intro-play').onclick=()=>{if(!$('intro').hidden&&!reduced())playIntro();};
$('intro-video').addEventListener('ended',()=>{if(!$('intro').hidden)stopIntro();});
['timeupdate','durationchange','loadedmetadata','seeking','emptied'].forEach(event=>$('intro-video').addEventListener(event,updateIntroProgress));
$('roll').onclick=playerRoll;$('new-game').onclick=newGame;$('result-new').onclick=newGame;$('result-close').onclick=()=>$('result').close();
$('rules-open').onclick=()=>$('rules').showModal();document.querySelectorAll('.close-dialog').forEach(b=>b.onclick=()=>$('rules').close());
$('sound').onclick=()=>{sound=!sound;$('sound').textContent='Dźwięk: '+(sound?'wł.':'wył.');$('sound').setAttribute('aria-pressed',String(sound));if(sound)tableSound('hold');else stopTableSound();};
$('skip-intro').onclick=stopIntro;$('replay-intro').onclick=startIntro;document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('intro').hidden)stopIntro();});
addEventListener('resize',()=>{if(!rolling)sizeDice();});
newGame();let seen=false;try{seen=sessionStorage.getItem('eddie-intro')==='seen';}catch(_){}if(seen){$('intro').hidden=true;}else startIntro();
