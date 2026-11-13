'use strict';
const E=DiceEngine, $=id=>document.getElementById(id);
let state,version=0,sound=true,audio,rolling=false,introTimer,introRun=0,lastResult=null,petitionPhase=null,pendingVoice=null,voiceGain;
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
 // Rolling text stays on the banner; spoken audio waits until after the landing SFX.
 if(type!=='rolling')speakLine(lang,text);
 return {text,lang};
}
function scheduleChatter(){clearTimeout(chatTimer);chatTimer=setTimeout(()=>{if(state.turn==='player'&&!rolling&&$('intro').hidden){say('idle');scheduleChatter();}},12000+Math.random()*6000);}
// Table SFX and Eddie's spoken lines never share volume with the intro film.
// iOS: WebAudio is muted by the Ring/Silent switch unless the session is
// 'playback'; delayed new Audio().play() is also often blocked outside a
// gesture. We unlock once, keep the context running, and play from buffers.
const CACHE='?v=22';
const SFX_FILES=['rattle','clack-1','clack-2','clack-3','landing','hold','stamp'];
const PETITION_URL='https://www.change.org/p/iron-maiden-eddie-to-wax';
const activeSfx=new Set();
const audioBufs=new Map();
let voiceManifest=null,voiceNode=null,audioUnlocked=false,unlockArmed=false;

function assertPlaybackSession(){
 try{if(navigator.audioSession)navigator.audioSession.type='playback';}catch(_){}
}

function ensureContext(){
 const Ctx=window.AudioContext||window.webkitAudioContext;
 if(!Ctx)return null;
 if(!audio)audio=new Ctx();
 return audio;
}

async function resumeContext(){
 const ctx=ensureContext();if(!ctx)return null;
 try{if(ctx.state==='suspended')await ctx.resume();}catch(_){}
 return ctx;
}

function tickSilentBuffer(ctx){
 try{
  const n=Math.max(1,Math.floor((ctx.sampleRate||44100)*0.02));
  const buffer=ctx.createBuffer(1,n,ctx.sampleRate||44100);
  const src=ctx.createBufferSource();src.buffer=buffer;src.connect(ctx.destination);src.start();
 }catch(_){}
}

async function tickHtmlUnlock(){
 const tick=$('unlock-tick');if(!tick)return;
 try{tick.muted=false;tick.volume=0.01;tick.currentTime=0;await tick.play();}catch(_){}
 try{tick.pause();tick.currentTime=0;}catch(_){}
}

async function decodeUrl(url){
 const ctx=ensureContext();if(!ctx)return null;
 if(audioBufs.has(url))return audioBufs.get(url);
 try{
  const res=await fetch(url);if(!res.ok)return null;
  const raw=await res.arrayBuffer();
  const buf=await new Promise((resolve,reject)=>ctx.decodeAudioData(raw.slice(0),resolve,reject));
  audioBufs.set(url,buf);return buf;
 }catch(_){return null;}
}

function playBuffer(buf,gainVal,owns){
 const ctx=ensureContext();if(!ctx||!buf)return null;
 try{
  if(!voiceGain){voiceGain=ctx.createGain();voiceGain.connect(ctx.destination);}
  const g=ctx.createGain();g.gain.value=gainVal;g.connect(ctx.destination);
  const src=ctx.createBufferSource();src.buffer=buf;src.connect(g);src.start();
  const rec={stop(){try{src.stop();}catch(_){ }}};
  if(owns)owns.add(rec);
  src.onended=()=>{if(owns)owns.delete(rec);};
  return rec;
 }catch(_){return null;}
}

async function playUrl(url,gainVal,owns){
 const buf=await decodeUrl(url);
 if(buf)return playBuffer(buf,gainVal,owns);
 try{
  const el=new Audio(url);el.volume=gainVal;if(owns)owns.add(el);
  el.onended=()=>{if(owns)owns.delete(el);};
  const playing=el.play();if(playing)playing.catch(()=>{});
  return el;
 }catch(_){return null;}
}

async function preloadSfx(){
 await Promise.all(SFX_FILES.map(kind=>decodeUrl('sfx/'+kind+'.wav'+CACHE)));
}

async function unlockAudio(){
 assertPlaybackSession();
 const ctx=await resumeContext();
 if(ctx)tickSilentBuffer(ctx);
 await tickHtmlUnlock();
 audioUnlocked=true;
 preloadSfx();
 loadVoiceManifest();
}

function armUnlock(){
 if(unlockArmed)return;unlockArmed=true;
 const evts=['pointerdown','touchend','click','keydown'];
 const once=()=>{unlockAudio();evts.forEach(e=>document.removeEventListener(e,once,true));};
 evts.forEach(e=>document.addEventListener(e,once,{capture:true,passive:true}));
}

async function loadVoiceManifest(){
 if(voiceManifest)return voiceManifest;
 try{voiceManifest=await fetch('voice/manifest.json'+CACHE).then(r=>r.json());}
 catch(_){voiceManifest={};}
 return voiceManifest;
}

function stopVoice(){
 if(voiceNode){try{voiceNode.stop();}catch(_){try{voiceNode.pause();voiceNode.currentTime=0;}catch(_2){}}voiceNode=null;}
 pendingVoice=null;
}

function speakLine(lang,text){
 pendingVoice=null;
 if(!sound||!text)return;
 if($('intro')&&!$('intro').hidden)return;
 const play=()=>{
  if(!sound)return;
  loadVoiceManifest().then(man=>{
   const rec=man&&man[lang+'|'+text];
   if(!rec)return;
   stopVoice();
   playUrl(rec.file+CACHE,0.82,null).then(node=>{voiceNode=node;});
  });
 };
 // Keep spoken lines off the rattle/clacks/landing of a throw still in flight.
 if(rolling||($('duel')&&$('duel').classList.contains('in-flight'))){pendingVoice=play;return;}
 play();
}

function flushVoice(){if(pendingVoice){const fn=pendingVoice;pendingVoice=null;fn();}}

function stopTableSound(){
 for(const voice of activeSfx){try{voice.stop?voice.stop():(voice.pause(),voice.currentTime=0);}catch(_){}}
 activeSfx.clear();
 stopVoice();
 // Do not suspend the AudioContext — iOS will not reliably resume it later.
}

function fallbackSound(kind){
 if(!sound||!$('intro').hidden)return;
 try{
  const ctx=ensureContext();if(!ctx)return;ctx.resume().catch(()=>{});
  const duration=kind==='landing'?.22:.11,buffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*duration),ctx.sampleRate),data=buffer.getChannelData(0);
  let low=0;for(let i=0;i<data.length;i++){const t=i/ctx.sampleRate;low=.65*low+.35*(Math.random()*2-1);data[i]=(low*.45+Math.sin(t*2*Math.PI*210)*.16)*Math.exp(-t*38);}
  playBuffer(buffer,0.7,activeSfx);
 }catch(_){/* Audio is optional; scoring must remain available. */}
}

function tableSound(kind){
 if(!sound||!$('intro').hidden)return;
 assertPlaybackSession();
 resumeContext();
 playUrl('sfx/'+kind+'.wav'+CACHE,0.7,activeSfx).then(node=>{if(!node)fallbackSound(kind);});
}

function petitionOpened(){try{return sessionStorage.getItem('eddie-petition-opened')==='1';}catch(_){return false;}}
function markPetitionOpened(){try{sessionStorage.setItem('eddie-petition-opened','1');}catch(_){}}

function resetPetitionUi(){
 petitionPhase=null;
 const clip=$('petition-clip'),play=$('petition-play'),note=$('petition-note'),confirm=$('petition-confirm'),cap=$('petition-caption');
 if(clip){try{clip.pause();clip.removeAttribute('src');clip.load();}catch(_){}}
 if(play)play.hidden=true;
 if(note)note.hidden=true;
 if(confirm)confirm.hidden=true;
 if(cap)cap.textContent='Przegrałeś! A teraz czas zapłaty. Podpisz petycję – teraz!';
}

function playPetitionClip(which){
 const clip=$('petition-clip'),play=$('petition-play'),cap=$('petition-caption');
 if(!clip)return;
 const file=which==='refuse'?'intro/v12-refuse.mp4'+CACHE:'intro/v12-loss.mp4'+CACHE;
 if(cap)cap.textContent=which==='refuse'?'Spróbuj, kiedy podpiszesz petycję':'Przegrałeś! A teraz czas zapłaty. Podpisz petycję – teraz!';
 try{clip.pause();}catch(_){}
 clip.src=file;clip.muted=!sound;clip.playsInline=true;
 const tryPlay=()=>{
  const p=clip.play();
  if(p&&p.catch)p.catch(()=>{if(play)play.hidden=false;});
  else if(play)play.hidden=true;
 };
 clip.onended=()=>{if(play)play.hidden=true;};
 if(clip.readyState>=2)tryPlay();else clip.onloadeddata=tryPlay;
 if(play)play.onclick=()=>{play.hidden=true;unlockAudio();clip.muted=!sound;clip.play().catch(()=>{});};
}

function showLossPetition(){
 const box=$('result-petition');if(!box)return;
 box.hidden=false;petitionPhase='loss';
 const note=$('petition-note'),confirm=$('petition-confirm');
 if(note)note.hidden=true;if(confirm)confirm.hidden=true;
 playPetitionClip('loss');
}

function showRefusePetition(){
 const box=$('result-petition');if(!box)return;
 box.hidden=false;petitionPhase='refuse';
 if($('result')&&!$('result').open)$('result').showModal();
 const note=$('petition-note'),confirm=$('petition-confirm');
 if(note)note.hidden=false;if(confirm)confirm.hidden=false;
 playPetitionClip('refuse');
}

function requestNewGame(){
 if(lastResult==='lose'&&!petitionOpened()){
  showRefusePetition();
  return;
 }
 newGame();
}
function cancelAnims(el){if(!el||!el.getAnimations)return;el.getAnimations().forEach(a=>{try{a.cancel();}catch(_){}});}
function clearThrow(){
 $('roll-line').classList.remove('visible');$('duel').classList.remove('in-flight','impact','gold-hand','pour-eddie','pour-player');
 pourTimers.splice(0).forEach(clearTimeout);
 for(const id of ['eddie-fist','player-hand']){const h=$(id);if(!h)continue;cancelAnims(h);h.querySelectorAll('*').forEach(cancelAnims);}
 for(const el of $('dice').children){cancelAnims(el);cancelAnims(el.querySelector('.cube'));el.classList.remove('pouring','landed','rolling');el.style.zIndex='';}
 resetPlayerHand();
 parkEddieHand();
}
function startThrow(who){
 clearThrow();const spoken=say('rolling',who==='eddie'?'reaching':'watching');$('roll-line').textContent='“'+spoken.text+'”';$('roll-line').lang=spoken.lang;
 $('roll-line').classList.add('visible');$('duel').classList.add('in-flight',who==='eddie'?'pour-eddie':'pour-player');tableSound('rattle');
}
function landThrow(dice){
 $('roll-line').classList.remove('visible');$('duel').classList.remove('in-flight','pour-eddie','pour-player');
 $('duel').classList.add('impact');if(['great','beast'].includes(classify(dice)))$('duel').classList.add('gold-hand');
 flushVoice();
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
 if(!rolling)parkEddieHand();
}
function renderMini(dice=state.eddieDice,held=[]) {
 $('eddie-dice').innerHTML=dice.map((v,i)=>`<span class="mini-die${held[i]?' kept':''}" aria-label="${v}">${['','⚀','⚁','⚂','⚃','⚄','⚅'][v]}</span>`).join('');
}
function seriesSum(who){return E.totals(state[who]);}
function renderCard() {
 const idx=Math.max(0,Math.min(E.SERIES-1,(state.series||1)-1));
 for(const who of ['player','eddie']){
  const tr=$('score-'+who);if(!tr)continue;
  const cells=[...tr.children]; // th + series + suma
  for(let i=0;i<E.SERIES;i++){
   const td=cells[i+1];if(!td)continue;
   const v=state[who][i];
   td.textContent=v==null?'—':v;
   td.className=(v!=null?'recorded':'')+(i===idx&&state.turn!=='finished'?' current':'');
  }
  const sumCell=cells[E.SERIES+1];if(sumCell){sumCell.textContent=seriesSum(who);sumCell.className='suma';}
  tr.classList.toggle('active',state.turn===who||(state.turn==='finished'&&false));
 }
}
function render() {
 const series=Math.min(state.series||1,E.SERIES);
 $('round').innerHTML=String(series).padStart(2,'0')+' <em>/ '+E.SERIES+'</em>';
 $('turn-label').textContent=state.turn==='player'?'TWÓJ RUCH':state.turn==='eddie'?'RUCH EDDIEGO':'KONIEC POJEDYNKU';
 $('roll-counter').textContent=state.rolls?`RZUT ${state.rolls} / 3 · ${E.pipSum(state.dice)}`:'RZUT — / 3';
 const canRoll=state.turn==='player'&&state.rolls<3&&!rolling;
 const canSave=state.turn==='player'&&state.rolls>0&&!rolling&&state.player[series-1]==null;
 $('roll').disabled=!canRoll;
 $('roll').innerHTML=rolling?'Kości w ruchu…':state.rolls===0?'Rzuć kośćmi <span>↗</span>':'Rzuć ponownie <span>↗</span>';
 if($('save')){$('save').disabled=!canSave;$('save').classList.toggle('ready',canSave&&state.rolls===3);}
 $('roll-note').textContent=state.turn==='finished'?'Dwie serie. Jeden werdykt.':state.turn==='eddie'?'Eddie rzuca w tej serii…':state.rolls===0?'Pierwszy rzut wszystkimi pięcioma kośćmi':state.rolls===3?'To ostatni rzut. Zapisz sumę oczek.':`Zatrzymaj kości albo rzuć ponownie. Pozostało poprawek: ${3-state.rolls}`;
 renderDice();renderCard();
}
const delay=ms=>new Promise(resolve=>setTimeout(resolve,window.__fast?0:ms));
const randomDie=()=> (Array.isArray(window.__bag)&&window.__bag.length?window.__bag.shift():1+Math.floor(Math.random()*6));
function classify(dice){return E.classify(dice);}
async function playerRoll(){
 if(state.turn!=='player'||state.rolls>=3||rolling)return;
 clearTimeout(chatTimer);const token=version;rolling=true;const held=state.held.slice();
 const next=state.dice.map((v,i)=>held[i]?v:randomDie());render();
 try{await pour(token,{who:'player',held,finals:next});}catch(_){}if(token!==version)return;
 state.dice=next;state.rolls++;rolling=false;
 say(classify(state.dice));scheduleChatter();
 $('hint').textContent=state.rolls<3?'Kliknij kości, aby je zatrzymać albo odznaczyć. Możesz też zapisać wynik już teraz.':'To ostatni rzut tej serii. Zapisz sumę oczek.';
 render();landThrow(state.dice);
}
async function saveSeries(){
 const idx=(state.series||1)-1;
 if(state.turn!=='player'||!state.rolls||rolling||state.player[idx]!=null)return;
 clearTimeout(chatTimer);tableSound('stamp');
 state.player[idx]=E.pipSum(state.dice);
 state.turn='eddie';state.held=Array(5).fill(false);
 $('hint').textContent='Zapisano '+state.player[idx]+' pkt. Teraz kości przejmuje Eddie.';
 render();await eddieTurn(version);
}
function boxOf(sel){const el=typeof sel==='string'?document.querySelector(sel):sel;if(!el)return null;const r=el.getBoundingClientRect();return {left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height};}
function overlaps(a,b,pad=0){if(!a||!b)return false;return a.left<b.right+pad&&a.right>b.left-pad&&a.top<b.bottom+pad&&a.bottom>b.top-pad;}
function eddieRestSlot(){
 const root=boxOf('#pour-hands'),felt=boxOf('.table-felt');
 if(!root||!felt||felt.width<20)return null;
 const label=boxOf('#turn-label'),counter=boxOf('#roll-counter');
 const avatar=boxOf('.avatar'),action=boxOf('#eddie-action'),mini=boxOf('#eddie-dice'),edge=boxOf('.table-edge');
 const dieBoxes=[...document.querySelectorAll('#dice .die')].map(el=>boxOf(el)).filter(Boolean);
 const diceTop=dieBoxes.length?Math.min(...dieBoxes.map(b=>b.top)):(boxOf('#dice')?boxOf('#dice').top:null);
 const actionVisible=action&&action.height>2&&action.width>2;
 const miniVisible=mini&&mini.height>2&&mini.width>2;
 const blockers=[label,counter,actionVisible?action:null,miniVisible?mini:null,...dieBoxes].filter(Boolean);
 const landscape=(innerHeight<=520&&innerWidth>innerHeight);
 const narrow=innerWidth<=720;
 const wantW=(landscape||narrow)?116:150;
 const ar=964/594;
 const margin=6;
 const gapLeft=(label?label.right:felt.left)+margin;
 const gapRight=(counter?counter.left:felt.right)-margin;
 // Prefer the felt band under the turn line. Only use the avatar as a top wall when it actually crosses that band.
 const bandTop=Math.max(felt.top+4,edge?edge.bottom-6:felt.top,label?label.bottom+4:felt.top);
 const avatarCrosses=avatar&&avatar.right>gapLeft&&avatar.left<gapRight&&avatar.bottom>bandTop;
 let gapTop=Math.max(bandTop,avatarCrosses?avatar.bottom+4:bandTop);
 const gapBottom=Math.min(diceTop!=null?diceTop-margin:felt.top+120,actionVisible?action.top-margin:1e9,miniVisible?mini.top-margin:1e9);
 let w=wantW,h=Math.round(w/ar);
 let maxH=gapBottom-gapTop;
 if(maxH<40){
  // Sit on the far rail, in the label/counter gap, even if we slightly overlap the turn line.
  gapTop=Math.max(felt.top-8,edge?edge.top-2:felt.top-8);
  maxH=Math.max(40,(diceTop!=null?diceTop-6:felt.top+80)-gapTop);
 }
 if(maxH>=36&&h>maxH){h=maxH;w=Math.round(h*ar);}
 const slotW=Math.max(0,gapRight-gapLeft);
 if(slotW>=40&&w>slotW){w=slotW;h=Math.round(w/ar);if(maxH>=36&&h>maxH){h=maxH;w=Math.round(h*ar);}}
 let left,top;
 if(slotW>=w){left=gapLeft+(slotW-w)/2;}
 else{left=Math.max(felt.left+margin,Math.min(gapLeft,felt.right-w-margin));}
 // Sit toward the far rail, not down on the dice.
 const room=Math.max(0,gapBottom-gapTop-h);
 top=gapTop+Math.round(room*0.2);
 let cand={left,top,right:left+w,bottom:top+h,width:w,height:h};
 for(const b of blockers){
  if(!overlaps(cand,b,4))continue;
  if(b.left-w-margin>=(label?label.right:felt.left)){cand.left=b.left-w-margin;cand.right=cand.left+w;}
  else if(b.right+margin+w<=(counter?counter.left:felt.right)){cand.left=b.right+margin;cand.right=cand.left+w;}
  if(b.top-h-4>=gapTop){cand.top=b.top-h-4;cand.bottom=cand.top+h;}
  else if(b.bottom+4+h<=(diceTop||cand.bottom+h)){cand.top=b.bottom+4;cand.bottom=cand.top+h;}
 }
 if(avatarCrosses&&cand.top<avatar.bottom+4){cand.top=avatar.bottom+4;cand.bottom=cand.top+cand.height;}
 if(diceTop&&cand.bottom>diceTop-margin){
  cand.bottom=diceTop-margin;
  cand.height=Math.max(0,cand.bottom-cand.top);
  if(cand.height>0&&cand.height<h){cand.width=Math.round(cand.height*ar);cand.right=cand.left+cand.width;}
 }
 cand.width=cand.right-cand.left;cand.height=cand.bottom-cand.top;cand.right=cand.left+cand.width;cand.bottom=cand.top+cand.height;
 cand=clearRestHand(cand,root,felt,{
  label,counter,diceTop,dieBoxes,
  action:actionVisible?action:null,mini:miniVisible?mini:null,
  ar,wantW
 });
 if(!cand)return null;
 return {left:cand.left-root.left,top:cand.top-root.top,width:cand.width,height:cand.height,view:cand};
}
function setEddieThrowing(on){
 const hand=$('eddie-fist');if(!hand)return;
 hand.classList.toggle('throwing',!!on);
 hand.classList.toggle('at-rest',!on);
 if(on){hand.style.width='';hand.style.height='';}
}
function resetPlayerHand(){
 const hand=$('player-hand');if(!hand)return;
 cancelAnims(hand);hand.querySelectorAll('*').forEach(cancelAnims);
 hand.style.transform='';hand.style.opacity='';hand.style.left='';hand.style.top='';
 for(const el of hand.querySelectorAll('.pose-frame,.pose-shut,.pose-open')){
  el.style.opacity='';el.style.transform='';
 }
}

function boxPad(b,m){return {left:b.left-m,top:b.top-m,right:b.right+m,bottom:b.bottom+m,width:b.width+2*m,height:b.height+2*m};}
function clearRestHand(cand,root,felt,ctx){
 const M=6;
 const anyHeld=[...document.querySelectorAll('#dice .die.held')].length>0;
 const HOLD=anyHeld?0:10; // reserve only before a hold lifts the dice
 const label=ctx.label,counter=ctx.counter,dieBoxes=ctx.dieBoxes||[];
 const roll=boxOf('#roll'),save=boxOf('#save'),hint=boxOf('#hint')||boxOf('.hint');
 const blockers=[label,counter,ctx.action,ctx.mini,roll,save,hint,...dieBoxes].filter(Boolean);
 const hits=c=>blockers.filter(b=>overlaps(c, boxPad(b,M), 0));
 const ar=ctx.ar||(964/594);
 const wantW=ctx.wantW||116, wantH=Math.round(wantW/ar);
 const diceTop=ctx.diceTop;
 const railTop=label?label.top:felt.top;
 const bandTop=(label?label.bottom:felt.top)+M;
 const bandBot=diceTop!=null?diceTop-M-HOLD:felt.top+wantH+M+HOLD;
 const gapLeft=(label?label.right:felt.left)+M;
 const gapRight=(counter?counter.left:felt.right)-M;
 let w=wantW,h=wantH;
 const maxH=bandBot-bandTop, maxW=Math.max(40,gapRight-gapLeft);
 // Layout is sized so the target hand fits. Only shrink if a held die has
 // already lifted and the remaining band is slightly short.
 if(maxH>=28&&h>maxH){h=maxH;w=Math.round(h*ar);}
 if(maxW>=40&&w>maxW){w=maxW;h=Math.round(w/ar);if(maxH>=28&&h>maxH){h=maxH;w=Math.round(h*ar);}}
 w=Math.max(40,w);h=Math.max(28,h);
 const trySlot=left=>{
  const top=bandTop+Math.max(0,Math.round((Math.max(0,maxH)-h)*0.15));
  const c={left,top,width:w,height:h,right:left+w,bottom:top+h};
  if(c.top<railTop) {c.top=railTop;c.bottom=c.top+h;}
  return (c.left>=felt.left-2&&c.right<=felt.right+2&&!hits(c).length)?c:null;
 };
 const mid=gapLeft+(maxW-w)/2;
 return trySlot(mid)||trySlot(gapLeft)||trySlot(gapRight-w)||trySlot(Math.max(felt.left+M, mid));
}

function parkEddieHand(){
 const hand=$('eddie-fist');if(!hand)return;
 void document.body.offsetHeight;
 cancelAnims(hand);hand.querySelectorAll('*').forEach(cancelAnims);
 setEddieThrowing(false);
 hand.style.transform='';hand.style.opacity='';
 const slot=eddieRestSlot();
 if(!slot){hand.style.opacity='1';return;}
 hand.style.opacity='';
 hand.style.width=slot.width+'px';hand.style.height=slot.height+'px';
 hand.style.left=slot.left+'px';hand.style.top=slot.top+'px';
 for(const el of hand.querySelectorAll('.pose-rest,.pose-frame,.pose-shut,.pose-open')){
  el.style.opacity='';el.style.transform='';
 }
}
function scheduleParkEddie(){requestAnimationFrame(()=>{parkEddieHand();requestAnimationFrame(parkEddieHand);});}
// Pour loose dice out of a hand. The cube's rest rotation is the real rolled face.
async function pour(token,{who,held,finals}){
 if(reduced())return;
 const buttons=[...$('dice').children];
 const loose=buttons.map((el,i)=>({el,i})).filter(d=>!held[d.i]);
 startThrow(who);if(token!==version)return;
 const hand=$(who==='eddie'?'eddie-fist':'player-hand');
 const tray=$('dice').getBoundingClientRect();
 const root=$('pour-hands').getBoundingClientRect();
 if(hand.offsetWidth<20||tray.width<20)return;
 const releaseV=who==='eddie'
  ?{x:tray.left+tray.width/2,y:tray.top+Math.max(28,tray.height*0.22)}
  :{x:tray.left+tray.width/2,y:tray.bottom+28};
 const px=parseFloat(hand.dataset.palmX)||.5,py=parseFloat(hand.dataset.palmY)||.5;
 const felt=document.querySelector('.table-felt').getBoundingClientRect(),duel=$('duel').getBoundingClientRect();
 let restDX=0,restDY=0,flipX=0,flipY=0,flipSX=1,flipSY=1;
 if(who==='eddie'){
  const first=hand.getBoundingClientRect();
  setEddieThrowing(true);
  hand.style.left=(releaseV.x-root.left-hand.offsetWidth*px)+'px';
  hand.style.top=(releaseV.y-root.top-hand.offsetHeight*py)+'px';
  void hand.offsetWidth;
  const last=hand.getBoundingClientRect();
  flipSX=first.width/Math.max(1,last.width);flipSY=first.height/Math.max(1,last.height);
  // Centers, because WAAPI scale/rotate use the default transform-origin (50% 50%).
  flipX=(first.left+first.width/2)-(last.left+last.width/2);flipY=(first.top+first.height/2)-(last.top+last.height/2);
 }else{
  hand.style.left=(releaseV.x-root.left-hand.offsetWidth*px)+'px';
  hand.style.top=(releaseV.y-root.top-hand.offsetHeight*py)+'px';
 }
 const handH=hand.offsetHeight;
 const palmTop=releaseV.y-handH*py;
 const entryY=who==='eddie'
  ?Math.min(-80,(felt.top-24)-releaseV.y)
  :Math.max(110, window.innerHeight+12-palmTop);
 const exitY=who==='eddie'?entryY-24:entryY+28;
 const T=POUR_MS,pending=[];
 const handKeys=who==='eddie'?[
  {transform:`translate(${flipX.toFixed(2)}px,${flipY.toFixed(2)}px) scale(${flipSX.toFixed(3)},${flipSY.toFixed(3)}) rotate(0deg)`,opacity:1,offset:0},
  {transform:`translate(${(flipX*.45).toFixed(2)}px,${(flipY*.45).toFixed(2)}px) scale(${Math.min(1,flipSX+0.35).toFixed(3)},${Math.min(1,flipSY+0.35).toFixed(3)}) rotate(-4deg)`,opacity:1,offset:.14},
  {transform:'translate(6px,4px) rotate(7deg) scale(1,1)',opacity:1,offset:.22},
  {transform:'translate(-7px,-2px) rotate(-9deg) scale(1,1)',opacity:1,offset:.30},
  {transform:'translate(8px,10px) rotate(8deg) scale(1,1)',opacity:1,offset:.38},
  {transform:'translate(-4px,4px) rotate(-5deg) scale(1,1)',opacity:1,offset:.46},
  {transform:'translate(0px,0px) rotate(0deg) scale(1,1)',opacity:1,offset:.62},
  {transform:`translate(${flipX.toFixed(2)}px,${flipY.toFixed(2)}px) scale(${flipSX.toFixed(3)},${flipSY.toFixed(3)}) rotate(0deg)`,opacity:1,offset:1}
 ]:[
  {transform:`translate(0px,${entryY}px) rotate(7deg)`,opacity:0,offset:0},
  {transform:`translate(0px,${entryY*.35}px) rotate(3deg)`,opacity:1,offset:.14},
  {transform:'translate(0px,0px) rotate(0deg)',opacity:1,offset:.24},
  {transform:'translate(0px,-8px) rotate(-5deg)',opacity:1,offset:.42},
  {transform:'translate(0px,0px) rotate(0deg)',opacity:1,offset:.62},
  {transform:`translate(0px,${exitY}px) rotate(8deg)`,opacity:0,offset:1}
 ];
 pending.push(hand.animate(handKeys,{duration:T,fill:'both',easing:'linear'}));
 const pose={duration:T,fill:'both',easing:'linear'};
 const frames=[...hand.querySelectorAll('.pose-frame')].sort((a,b)=>(+a.dataset.frame)-(+b.dataset.frame));
 const n=frames.length,holdShut=.16,openAt=.48,endHold=who==='eddie'?.84:1,eps=.002;
 function stepKeys(start,end){
  const keys=[];
  if(start>0){keys.push({opacity:0,offset:0});if(start>eps)keys.push({opacity:0,offset:Math.max(0,start-eps)});}
  keys.push({opacity:1,offset:start});
  keys.push({opacity:1,offset:end});
  if(end<1){keys.push({opacity:0,offset:Math.min(1,end+eps)});if(end+eps<1)keys.push({opacity:0,offset:1});}
  return keys;
 }
 // Rest pose stays hidden for the whole Eddie throw; parkEddieHand brings it back after.
 if(who==='eddie'){
  const restPose=hand.querySelector('.pose-rest');
  if(restPose)pending.push(restPose.animate([{opacity:0,offset:0},{opacity:0,offset:1}],pose));
 }
 if(n){
  const step=n>1?(openAt-holdShut)/(n-1):openAt-holdShut;
  frames.forEach((el,i)=>{
   const start=i===0?(who==='eddie'?holdShut:0):holdShut+i*step;
   const end=i===n-1?endHold:holdShut+(i+1)*step;
   pending.push(el.animate(stepKeys(start,end),pose));
  });
 }
 loose.forEach(({el,i},order)=>{
  const rect=el.getBoundingClientRect();
  const cx=rect.left+rect.width/2,cy=rect.top+rect.height/2;
  const jx=(i-2)*11+((i%2)?6:-5),jy=(who==='eddie'?-6:8)+(i%2?4:-3);
  const dx=releaseV.x+jx-cx,dy=releaseV.y+jy-cy,tilt=TILT[i],stagger=order*0.03;
  const startX=who==='eddie'?dx-restDX:dx,startY=who==='eddie'?dy-restDY:dy+entryY;
  el.classList.add('pouring');el.style.zIndex=String(4+order);
  el.setAttribute('aria-label',`Kość ${i+1}: w ruchu`);
  const keys=[
   motion(startX,startY,-36+i*16,.58,0),
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
 if(token===version){if(who==='eddie')parkEddieHand();else resetPlayerHand();}
}

async function eddieTurn(token){
 clearTimeout(chatTimer);$('duel').classList.add('eddie-turn');state.held=Array(5).fill(false);state.rolls=0;renderDice();say('eddie','speaking');let dice=[],held=Array(5).fill(false);$('roll-counter').textContent='RZUT — / 3';
 for(let n=1;n<=3;n++){
  await delay(n===1?650:750);if(token!==version)return;
  dice=n===1?Array.from({length:5},randomDie):dice.map((v,i)=>held[i]?v:randomDie());try{await pour(token,{who:'eddie',held,finals:dice});}catch(_){}if(token!==version)return;state.eddieDice=dice;state.dice=dice;state.held=held.slice();state.rolls=n;renderDice();renderMini(dice,held);landThrow(dice);renderCard();
  $('roll-counter').textContent=`RZUT ${n} / 3`;$('eddie-action').textContent=`Rzut ${n}/3 · Suma ${E.pipSum(dice)}. Eddie przygląda się kościom…`;
  const kind=classify(dice);say(kind==='beast'?'beast':kind==='great'?'eddieGreat':kind==='bad'?'eddieBad':'eddie');
  if(n===3)break;
  await delay(80);if(token!==version)return;
  held=E.chooseHold(dice);renderMini(dice,held);mood('thinking',0);await delay(350);if(token!==version)return;state.held=held.slice();renderDice();
  if(held.every(Boolean)){$('eddie-action').textContent=`Zatrzymuje wszystkie kości (suma ${E.pipSum(dice)}). Zapisuje serię.`;break;}
  const count=held.filter(Boolean).length;$('eddie-action').textContent=count?`Zatrzymuje ${count} z 5 kości — wysokie oczka (4, 5 i 6).`:'Rzut ponownie wszystkimi. Szuka wyższych oczek.';
 }
 await delay(700);if(token!==version)return;
 const idx=(state.series||1)-1;state.eddie[idx]=E.pipSum(dice);tableSound('stamp');$('duel').classList.remove('eddie-turn');renderMini(dice);
 $('eddie-action').textContent=`Seria ${state.series}: ${state.eddie[idx]} pkt · zapisane.`;renderCard();
 if(state.series>=E.SERIES){finish();return;}
 state.series++;state.turn='player';state.rolls=0;state.held=Array(5).fill(false);state.dice=[1,2,3,4,5];$('hint').textContent='Nowa seria. Rzuć wszystkimi pięcioma kośćmi.';mood('idle',0);render();scheduleChatter();
}
function finish(){
 clearTimeout(chatTimer);$('duel').classList.remove('eddie-turn');state.turn='finished';const p=seriesSum('player'),e=seriesSum('eddie');const type=p>e?'win':p<e?'lose':'draw';lastResult=type;const spoken=say(type);
 $('result-title').textContent=p>e?'Los uchylił ci kapelusza.':p<e?'Eddie zgarnia stawkę.':'Remis. Noc bez zwycięzcy.';$('result-quote').textContent='“'+spoken.text+'”';$('result-quote').lang=spoken.lang;
 const row=(who,label)=>`<div><small>${label}</small><span class="series-pips">${state[who].map(v=>v==null?'—':v).join(' + ')}</span><strong>${seriesSum(who)}</strong></div>`;
 $('result-totals').innerHTML=row('player','TY')+'<span>:</span>'+row('eddie','EDDIE');
 resetPetitionUi();
 $('result-petition').hidden=type!=='lose';
 if(type==='lose'){showLossPetition();$('result-quote').textContent='“You lose! And now it\'s time for the payout. Sign the petition now!”';$('result-quote').lang='en';}
 $('hint').textContent='Pojedynek zakończony. Tabela dwóch serii pozostaje do wglądu.';render();$('result').showModal();
}
function newGame(){version++;rolling=false;clearThrow();stopTableSound();state={player:Array(E.SERIES).fill(null),eddie:Array(E.SERIES).fill(null),dice:[1,2,3,4,5],eddieDice:[1,2,3,4,5],held:Array(5).fill(false),series:1,rolls:0,turn:'player'};lastResult=null;resetPetitionUi();if($('result').open)$('result').close();$('hint').textContent='Rzuć kośćmi. Potem zatrzymaj te, którym ufasz.';$('eddie-action').textContent='Czeka na twój pierwszy ruch.';renderMini();clearTimeout(chatTimer);$('duel').classList.remove('eddie-turn');say('welcome');render();scheduleParkEddie();scheduleChatter();}
function updateIntroProgress(){
 const video=$('intro-video');
 const fraction=Number.isFinite(video.duration)&&video.duration>0?Math.min(1,Math.max(0,video.currentTime/video.duration)):0;
 document.querySelector('.intro-progress').style.width=(fraction*100)+'%';
}
function stopIntro(){
 clearTimeout(introTimer);introRun++;
 const video=$('intro-video');video.pause();try{video.currentTime=0;}catch(_){}
 $('intro-play').hidden=true;$('intro').hidden=true;updateIntroProgress();
 document.querySelector('.app-shell').inert=false;scheduleParkEddie();
 try{sessionStorage.setItem('eddie-intro','seen');}catch(_){}
 assertPlaybackSession();resumeContext();
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
$('intro-play').onclick=()=>{unlockAudio();if(!$('intro').hidden&&!reduced())playIntro();};
$('intro-video').addEventListener('ended',()=>{if(!$('intro').hidden)stopIntro();});
['timeupdate','durationchange','loadedmetadata','seeking','emptied'].forEach(event=>$('intro-video').addEventListener(event,updateIntroProgress));
$('roll').onclick=()=>{unlockAudio();playerRoll();};if($('save'))$('save').onclick=saveSeries;$('new-game').onclick=requestNewGame;$('result-new').onclick=requestNewGame;$('result-close').onclick=()=>$('result').close();
$('rules-open').onclick=()=>$('rules').showModal();document.querySelectorAll('.close-dialog').forEach(b=>b.onclick=()=>$('rules').close());
$('sound').onclick=()=>{unlockAudio();sound=!sound;$('sound').textContent='Dźwięk: '+(sound?'wł.':'wył.');$('sound').setAttribute('aria-pressed',String(sound));const clip=$('petition-clip');if(clip)clip.muted=!sound;if(sound)tableSound('hold');else stopTableSound();};
$('skip-intro').onclick=()=>{unlockAudio();stopIntro();};$('replay-intro').onclick=startIntro;document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('intro').hidden)stopIntro();});
if($('petition-link'))$('petition-link').addEventListener('click',()=>{markPetitionOpened();});
if($('petition-confirm'))$('petition-confirm').onclick=()=>{markPetitionOpened();newGame();};
addEventListener('resize',()=>{if(!rolling){sizeDice();parkEddieHand();}});
addEventListener('load',scheduleParkEddie);
armUnlock();loadVoiceManifest();
newGame();let seen=false;try{seen=sessionStorage.getItem('eddie-intro')==='seen';}catch(_){}if(seen){$('intro').hidden=true;}else startIntro();

window.__throw=(who,finals)=>pour(version,{who,held:Array(5).fill(false),finals:finals||[5,4,3,6,2]});
