'use strict';
const E=DiceEngine, $=id=>document.getElementById(id);
let state,version=0,sound=false,audio,rolling=false,introTimer,introRun=0;
const pips={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};
const lines={
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
function scheduleChatter(){clearTimeout(chatTimer);chatTimer=setTimeout(()=>{if(state.turn==='player'&&!rolling){say('idle');scheduleChatter();}},12000+Math.random()*6000);}
function clickSound() {
 if(!sound)return;
 try{audio=audio||new (window.AudioContext||window.webkitAudioContext)();audio.resume();
 for(let i=0;i<5;i++){const osc=audio.createOscillator(),gain=audio.createGain(),t=audio.currentTime+i*.04;osc.type='triangle';osc.frequency.setValueAtTime(150+Math.random()*250,t);osc.frequency.exponentialRampToValueAtTime(50,t+.055);gain.gain.setValueAtTime(.07,t);gain.gain.exponentialRampToValueAtTime(.001,t+.065);osc.connect(gain);gain.connect(audio.destination);osc.start(t);osc.stop(t+.07);}}catch(_){/* Audio is optional. */}
}
function dieContents(value){return Array.from({length:9},(_,i)=>pips[value].includes(i)?'<span class="pip" aria-hidden="true"></span>':'<span></span>').join('');}
function renderDice() {
 const tray=$('dice');tray.replaceChildren();
 state.dice.forEach((v,i)=>{const b=document.createElement('button');b.className='die'+(state.held[i]?' held':'');b.style.setProperty('--tilt',[-5,3,-2,5,-3][i]+'deg');b.innerHTML=dieContents(v);b.disabled=state.turn!=='player'||state.rolls===0||rolling||state.rolls>=3;b.setAttribute('aria-label',`Kość ${i+1}: ${state.rolls?v:'jeszcze nie rzucona'}${state.held[i]?', zatrzymana':''}`);b.setAttribute('aria-pressed',String(state.held[i]));b.onclick=()=>{state.held[i]=!state.held[i];renderDice();$('dice').children[i].focus({preventScroll:true});};tray.append(b);});
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
 clearTimeout(chatTimer);const token=version;rolling=true;render();clickSound();
 const buttons=[...$('dice').children];buttons.forEach((b,i)=>{if(!state.held[i])b.classList.add('rolling');});
 for(let k=0;k<6;k++){await delay(65);if(token!==version)return;buttons.forEach((b,i)=>{if(!state.held[i])b.innerHTML=dieContents(randomDie());});}
 state.dice=state.dice.map((v,i)=>state.held[i]?v:randomDie());state.rolls++;rolling=false;
 say(classify(state.dice));scheduleChatter();$('hint').textContent=state.rolls<3?'Kliknij kości, aby je zatrzymać, albo wybierz kategorię na karcie.':'To ostatni rzut. Wybierz jedną wolną kategorię na karcie.';render();
}
async function assign(id){
 if(state.turn!=='player'||!state.rolls||rolling||state.player[id]!==undefined)return;
 clearTimeout(chatTimer);state.player[id]=E.score(id,state.dice);state.turn='eddie';$('hint').textContent='Twój wynik został zapisany. Teraz kości przejmuje Eddie.';render();await eddieTurn(version);
}
async function tumble(token,held){const bs=[...$('dice').children];bs.forEach((b,i)=>{if(!held[i])b.classList.add('rolling');});for(let k=0;k<6;k++){await delay(65);if(token!==version)return;bs.forEach((b,i)=>{if(!held[i])b.innerHTML=dieContents(randomDie());});}}
async function eddieTurn(token){
 clearTimeout(chatTimer);$('duel').classList.add('eddie-turn');state.held=Array(5).fill(false);renderDice();say('eddie','speaking');let dice=[],held=Array(5).fill(false);$('roll-counter').textContent='RZUT — / 3';
 for(let n=1;n<=3;n++){
  await delay(n===1?650:750);if(token!==version)return;
  dice=n===1?Array.from({length:5},randomDie):dice.map((v,i)=>held[i]?v:randomDie());mood('throwing',800);await tumble(token,held);if(token!==version)return;state.eddieDice=dice;state.dice=dice;state.held=Array(5).fill(false);renderDice();renderMini(dice);clickSound();
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
 const choice=E.chooseCategory(dice,state.eddie);state.eddie[choice.id]=choice.value;$('duel').classList.remove('eddie-turn');renderMini(dice);
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
function newGame(){version++;rolling=false;state={player:{},eddie:{},dice:[1,2,3,4,5],eddieDice:[1,2,3,4,5],held:Array(5).fill(false),round:1,rolls:0,turn:'player'};if($('result').open)$('result').close();$('hint').textContent='Rzuć kośćmi. Potem zatrzymaj te, którym ufasz.';$('eddie-action').textContent='Czeka na twój pierwszy ruch.';renderMini();clearTimeout(chatTimer);$('duel').classList.remove('eddie-turn');say('welcome');render();scheduleChatter();}
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
 $('roll').focus({preventScroll:true});
}
async function playIntro(){
 const run=introRun;$('intro-play').hidden=true;
 try{await $('intro-video').play();}
 catch(_){if(run===introRun&&!$('intro').hidden){$('intro-play').hidden=false;$('intro-play').focus({preventScroll:true});}}
}
function startIntro(){
 clearTimeout(introTimer);introRun++;
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
$('sound').onclick=()=>{sound=!sound;$('sound').textContent='Dźwięk: '+(sound?'wł.':'wył.');$('sound').setAttribute('aria-pressed',String(sound));if(sound)clickSound();};
$('skip-intro').onclick=stopIntro;$('replay-intro').onclick=startIntro;document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('intro').hidden)stopIntro();});
newGame();let seen=false;try{seen=sessionStorage.getItem('eddie-intro')==='seen';}catch(_){}if(seen){$('intro').hidden=true;}else startIntro();
