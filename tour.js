'use strict';
// A small, independent chrome component. No gameplay state, SFX or film calls.
(()=>{
 const nations=window.EddieTourNations;if(!nations||!nations.length)return;
 const byId=id=>document.getElementById(id),panel=byId('tour-card');if(!panel)return;
 let index=0,paused=false,timer;
 const motion=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 function show(next){
  index=(next+nations.length)%nations.length;const entry=nations[index];
  const flag=byId('tour-flag');flag.src=entry.flag;flag.alt='Flaga: '+entry.name;
  byId('tour-country').textContent=entry.name;
  const date=byId('tour-date');date.replaceChildren();date.setAttribute('aria-label',entry.date);
  if(entry.datePrecision==='day'){const [day,month,year]=entry.date.split('.');date.dateTime=year+'-'+month+'-'+day;}else date.dateTime=entry.date;
  [...entry.date].forEach((digit,i)=>{const span=document.createElement('span');span.textContent=digit;span.setAttribute('aria-hidden','true');span.style.setProperty('--digit-delay',100+i*40+'ms');date.append(span);});
  byId('tour-caption').textContent=entry.datePrecision==='year'?'Pierwszy udokumentowany koncert · rok':'Pierwszy udokumentowany koncert';
  byId('tour-count').textContent=String(index+1).padStart(2,'0')+' / '+nations.length;
  byId('tour-source').href=entry.dateSource;
  byId('tour-source').title='Źródło daty: '+entry.name+(entry.note?' — '+entry.note:'');
  panel.classList.remove('bill-arrives');void panel.offsetWidth;panel.classList.add('bill-arrives');
 }
 function schedule(){clearTimeout(timer);if(!paused)timer=setTimeout(()=>{if(!document.hidden&&(!byId('intro')||byId('intro').hidden))show(index+1);schedule();},motion()?11000:6200);}
 byId('tour-prev').onclick=()=>{show(index-1);schedule();};
 byId('tour-next').onclick=()=>{show(index+1);schedule();};
 byId('tour-pause').onclick=()=>{paused=!paused;byId('tour-pause').textContent=paused?'Wznów pochód':'Zatrzymaj pochód';byId('tour-pause').setAttribute('aria-pressed',String(paused));schedule();};
 show(0);schedule();
})();
