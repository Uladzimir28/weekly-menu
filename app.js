'use strict';
const DAYS=['Понедельник','Вторник','Среда','Четверг','Пятница','Суббота','Воскресенье'];
const TYPES=['Завтрак','Обед','Перекус','Ужин'];
const $=id=>document.getElementById(id);
const safe=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let day=Math.min(6,Math.max(0,Number(localStorage.getItem('weeklyMenuDay')||0)||0));
function renderDay(){
 $('dayTitle').textContent=DAYS[day];$('daySubtitle').textContent=`День ${day+1} из 7`;
 $('dayTabs').innerHTML=DAYS.map((d,i)=>`<button type="button" class="${i===day?'active':''}" data-day="${i}" aria-label="${d}" aria-current="${i===day?'date':'false'}">${['Пн','Вт','Ср','Чт','Пт','Сб','Вс'][i]}</button>`).join('');
 $('mealCards').innerHTML=MENU[day].map((m,i)=>`<details class="meal" ${i===0?'open':''}><summary><span class="chevron">⌄</span><span class="type">${TYPES[i]}</span><h3>${safe(m[0])}</h3><div class="portions"><div class="portion"><b>Парень</b>${safe(m[1])}</div><div class="portion"><b>Девушка</b>${safe(m[2])}</div></div></summary><div class="recipe"><hr><h4>Ингредиенты на двоих</h4><p>${safe(m[3])}</p><h4>Как приготовить</h4><p>${safe(m[4])}</p></div></details>`).join('');
 document.querySelectorAll('[data-day]').forEach(b=>b.addEventListener('click',()=>setDay(Number(b.dataset.day))));$('expand').textContent='Раскрыть все рецепты';
}
function setDay(n){day=(n+7)%7;localStorage.setItem('weeklyMenuDay',day);renderDay()}
$('prev').addEventListener('click',()=>setDay(day-1));$('next').addEventListener('click',()=>setDay(day+1));
$('expand').addEventListener('click',()=>{let items=[...document.querySelectorAll('.meal')];let expand=!items.every(d=>d.open);items.forEach(d=>d.open=expand);$('expand').textContent=expand?'Свернуть все рецепты':'Раскрыть все рецепты'});
function showTab(shop){$('menuView').hidden=shop;$('shopView').hidden=!shop;$('tabMenu').classList.toggle('selected',!shop);$('tabShop').classList.toggle('selected',shop);$('tabMenu').setAttribute('aria-selected',String(!shop));$('tabShop').setAttribute('aria-selected',String(shop));localStorage.setItem('weeklyMenuTab',shop?'shop':'menu')}
$('tabMenu').addEventListener('click',()=>showTab(false));$('tabShop').addEventListener('click',()=>showTab(true));
function renderShop(){let checked=0,total=0;
 $('shopping').innerHTML=Object.entries(SHOPPING).map(([category,items],group)=>`<div class="shopGroup"><h3>${safe(category)}</h3>${Object.entries(items).map(([name,amount],i)=>{let key=`weeklyBuy-${group}-${i}`,done=localStorage.getItem(key)==='1';total++;if(done)checked++;return `<div class="shopRow"><label><input type="checkbox" data-buy="${key}" ${done?'checked':''}><span>${safe(name)}</span></label><small>${safe(amount)}</small></div>`}).join('')}</div>`).join('');
 $('shopProgress').textContent=`Отмечено ${checked} из ${total}`;$('shopBadge').textContent=`${checked}/${total}`;
 document.querySelectorAll('[data-buy]').forEach(input=>input.addEventListener('change',()=>{localStorage.setItem(input.dataset.buy,input.checked?'1':'0');renderShop()}));
}
$('reset').addEventListener('click',()=>{if(confirm('Сбросить все отметки покупок?')){Object.keys(localStorage).filter(k=>k.startsWith('weeklyBuy-')).forEach(k=>localStorage.removeItem(k));renderShop()}});
renderDay();renderShop();showTab(localStorage.getItem('weeklyMenuTab')==='shop');
