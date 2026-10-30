/* TEFI presentation-only tab controller. Game nodes remain in place so existing IDs and listeners work. */
(()=>{'use strict';
const setup=()=>{
 const root=document.getElementById('gameRoot');if(!root)return;
 document.body.classList.add('tefi-pixel-ui');
 function makeTabs(parent,items,selected,handler){
  const nav=document.createElement('div');nav.className='tefi-switcher';nav.setAttribute('role','tablist');
  for(const [key,label] of items){const b=document.createElement('button');b.type='button';b.textContent=label;b.setAttribute('role','tab');b.setAttribute('aria-selected',String(key===selected));b.addEventListener('click',()=>handler(key));nav.appendChild(b);}parent.insertBefore(nav,parent.querySelector('.section-heading')?.nextSibling||parent.firstChild);return nav;
 }
 const factory=document.querySelector('.factory-panel'),shop=document.querySelector('.shop-panel');
 if(factory){
  const tabs=[['miners','⛏ Miners'],['polishers','✦ Polishers'],['refiner','◆ Refiner'],['furnace','🔥 Furnace']];
  const ids={miners:['minerPanel','legacyDropperOverview','legacyModeNotice'],polishers:['polisherPanel'],refiner:['refinerPanel'],furnace:['furnaceCard']};
  let active='miners';let nav;
  const refresh=()=>{let chosen=active;if(ids[chosen].every(id=>{const e=document.getElementById(id);return !e||e.hidden||e.style.display==='none'}))chosen='furnace';
    for(const [key,arr]of Object.entries(ids))for(const id of arr){const el=document.getElementById(id);if(el)el.classList.toggle('tefi-hide-panel',key!==chosen);}
    for(const b of nav.querySelectorAll('button'))b.setAttribute('aria-selected',String(b.dataset.key===chosen));
  };
  nav=makeTabs(factory,tabs,active,key=>{active=key;refresh()});[...nav.children].forEach((b,i)=>b.dataset.key=tabs[i][0]);
  // Game code changes hidden states during render; refresh display without changing them.
  const observer=new MutationObserver(()=>refresh());for(const arr of Object.values(ids))for(const id of arr){const e=document.getElementById(id);if(e)observer.observe(e,{attributes:true,attributeFilter:['hidden','style']});}refresh();
 }
 if(shop){
  const groups={mining:['miningPowerCard','miningLuckCard','miningDuplicationCard'],machines:['dropperCard','adderCard','multiplierCard'],stardust:['rebirthPanel']};
  let active='mining',nav;const all=Object.values(groups).flat();
  const refresh=()=>{for(const [group,ids]of Object.entries(groups))for(const id of ids){const el=document.getElementById(id);if(el)el.classList.toggle('tefi-hide-panel',group!==active);}
   for(const b of nav.querySelectorAll('button'))b.setAttribute('aria-selected',String(b.dataset.key===active));};
  nav=makeTabs(shop,[['mining','⛏ Mining'],['machines','⚙ Machines'],['stardust','✦ Stardust']],active,key=>{active=key;refresh()});[...nav.children].forEach((b,i)=>b.dataset.key=['mining','machines','stardust'][i]);refresh();
  // If a player is using the legacy machine profile, keep its shop visible by default.
  const obs=new MutationObserver(()=>{const mining=groups.mining.some(id=>{const e=document.getElementById(id);return e&&!e.hidden;});if(!mining&&active==='mining'){active='machines';refresh();}});
  for(const id of groups.mining){const e=document.getElementById(id);if(e)obs.observe(e,{attributes:true,attributeFilter:['hidden']});}
 }
};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
})();
