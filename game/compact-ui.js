/* Compact dashboard navigation: scrolling shortcuts keep every gameplay control accessible. */
(()=>{'use strict';
const setup=()=>{
 const root=document.getElementById('gameRoot');if(!root)return;
 document.body.classList.add('tefi-pixel-ui');
 function shortcuts(parent,items){
  const nav=document.createElement('div');nav.className='tefi-switcher';nav.setAttribute('role','group');nav.setAttribute('aria-label','Jump to section');
  for(const [id,label] of items){
   const b=document.createElement('button');b.type='button';b.textContent=label;
   b.addEventListener('click',()=>{const target=document.getElementById(id);
     if(!target||target.hidden||target.style.display==='none')return;
     // Preserve all gameplay elements in the DOM and in document flow.
     const parentRect=parent.getBoundingClientRect(),rect=target.getBoundingClientRect();
     parent.scrollTop+=rect.top-parentRect.top-68;
   });nav.appendChild(b);
  }
  parent.insertBefore(nav,parent.querySelector('.section-heading')?.nextSibling||parent.firstChild);
 }
 const factory=document.querySelector('.factory-panel'),shop=document.querySelector('.shop-panel');
 if(factory)shortcuts(factory,[['minerPanel','⛏ Miners'],['polisherPanel','✦ Polishers'],['refinerPanel','◆ Refiner'],['furnaceCard','🔥 Furnace']]);
 if(shop)shortcuts(shop,[['miningPowerCard','⛏ Mining'],['dropperCard','⚙ Machines'],['rebirthPanel','✦ Stardust']]);
};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
})();
