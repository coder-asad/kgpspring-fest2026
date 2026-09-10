/* ============ DATA ============ */
const artists = [
  { id:'a1', name:'The Midnight Owls', genre:'Indie Rock', emoji:'🦉' },
  { id:'a2', name:'DJ Nyx', genre:'Electronic', emoji:'🎧' },
  { id:'a3', name:'Arohi Live', genre:'Bollywood Fusion', emoji:'🎙️' },
  { id:'a4', name:'Kraken Beats', genre:'Hip-Hop', emoji:'🐙' },
  { id:'a5', name:'Echoes of Rann', genre:'Folk Rock', emoji:'🪕' },
  { id:'a6', name:'Neon Pulse', genre:'EDM', emoji:'⚡' },
];

const foods = [
  { id:'f1', name:'Momos (6pc)', price:60 },
  { id:'f2', name:'Cold Coffee', price:50 },
  { id:'f3', name:'Burger', price:80 },
  { id:'f4', name:'Chowmein', price:70 },
  { id:'f5', name:'Pizza Slice', price:90 },
  { id:'f6', name:'Ice Cream', price:40 },
];

const games = [
  { id:'g1', name:'Gaming Zone (PS5)', price:100 },
  { id:'g2', name:'Escape Room', price:150 },
  { id:'g3', name:'Laser Tag', price:120 },
  { id:'g4', name:'Carnival Games', price:80 },
  { id:'g5', name:'VR Experience', price:200 },
  { id:'g6', name:'Bonfire & Music Night', price:0 },
];

const passes = [
  { id:'bronze', name:'Bronze Pass', price:499, cls:'bronze',
    benefits:['Access to main ground events','2 free food coupons worth ₹100','Standard entry, all 3 days'] },
  { id:'silver', name:'Silver Pass', price:899, cls:'silver',
    benefits:['Everything in Bronze','Access to 1 headline artist set','4 free food coupons worth ₹200','1 game included'] },
  { id:'gold', name:'Gold Pass', price:1499, cls:'gold',
    benefits:['Everything in Silver','All-artist access, no restrictions','6 free food coupons worth ₹300','Backstage + priority entry'] },
];

/* ============ STATE ============ */
let state = {
  name:'', roll:'', photo:'',
  selectedArtists: new Set(),
  foodQty: {},      // id -> qty
  selectedGames: new Set(),
  pass: null,
};
let currentStep = 1;
const totalSteps = 6;

/* ============ TAB SWITCHING ============ */
function switchTab(tab){
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active-panel'));
  document.getElementById(tab).classList.add('active-panel');
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  document.querySelector(`.nav-btn[data-tab="${tab}"]`).classList.add('active');
  if(tab === 'mypasses') renderMyPasses();
}
document.querySelectorAll('.nav-btn').forEach(btn=>{
  btn.addEventListener('click', ()=> switchTab(btn.dataset.tab));
});

/* ============ DARK MODE ============ */
const darkToggle = document.getElementById('darkToggle');
if(localStorage.getItem('fest2026_dark') === 'true'){
  document.body.classList.add('dark');
  darkToggle.textContent = '☀️';
}
darkToggle.addEventListener('click', ()=>{
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('fest2026_dark', isDark);
  darkToggle.textContent = isDark ? '☀️' : '🌙';
});

/* ============ BUILD STEP 1: image preview ============ */
document.getElementById('photoUrl').addEventListener('input', (e)=>{
  const url = e.target.value.trim();
  const img = document.getElementById('imgPreview');
  const ph = document.getElementById('imgPreviewPlaceholder');
  if(url){
    img.src = url;
    img.style.display = 'block';
    ph.style.display = 'none';
    img.onerror = ()=>{ img.style.display='none'; ph.style.display='flex'; ph.textContent='could not load that image URL'; };
  } else {
    img.style.display='none'; ph.style.display='flex'; ph.textContent='photo preview appears here';
  }
});

/* ============ BUILD STEP 2: artists ============ */
function renderArtists(){
  const grid = document.getElementById('artistGrid');
  grid.innerHTML = artists.map(a => `
    <div class="artist-card ${state.selectedArtists.has(a.id)?'selected':''}" data-id="${a.id}">
      <div class="emoji">${a.emoji}</div>
      <h4>${a.name}</h4>
      <p>${a.genre}</p>
    </div>`).join('');
  grid.querySelectorAll('.artist-card').forEach(card=>{
    card.addEventListener('click', ()=>{
      const id = card.dataset.id;
      if(state.selectedArtists.has(id)) state.selectedArtists.delete(id);
      else state.selectedArtists.add(id);
      card.classList.toggle('selected');
    });
  });
}

/* ============ BUILD STEP 3: food ============ */
function renderFood(){
  const list = document.getElementById('foodList');
  list.innerHTML = foods.map(f=>{
    const qty = state.foodQty[f.id] || 0;
    return `
    <div class="food-row" data-id="${f.id}">
      <div>
        <div class="food-name">${f.name}</div>
        <div class="food-price">₹${f.price} each</div>
      </div>
      <div class="qty-controls">
        <button class="minus">−</button>
        <span class="qtyval">${qty}</span>
        <button class="plus">+</button>
      </div>
    </div>`;
  }).join('');
  list.querySelectorAll('.food-row').forEach(row=>{
    const id = row.dataset.id;
    row.querySelector('.plus').addEventListener('click', ()=>{
      state.foodQty[id] = (state.foodQty[id]||0) + 1;
      row.querySelector('.qtyval').textContent = state.foodQty[id];
    });
    row.querySelector('.minus').addEventListener('click', ()=>{
      state.foodQty[id] = Math.max(0, (state.foodQty[id]||0) - 1);
      row.querySelector('.qtyval').textContent = state.foodQty[id];
    });
  });
}

/* ============ BUILD STEP 4: games ============ */
function renderGames(){
  const list = document.getElementById('gameList');
  list.innerHTML = games.map(g=>{
    const added = state.selectedGames.has(g.id);
    return `
    <div class="game-row" data-id="${g.id}">
      <div>
        <div class="game-name">${g.name}</div>
        <div class="game-price">${g.price === 0 ? 'Free' : '₹' + g.price}</div>
      </div>
      <button class="game-toggle ${added?'added':''}">${added ? 'Added ✓' : 'Add'}</button>
    </div>`;
  }).join('');
  list.querySelectorAll('.game-row').forEach(row=>{
    const id = row.dataset.id;
    const btn = row.querySelector('.game-toggle');
    btn.addEventListener('click', ()=>{
      if(state.selectedGames.has(id)){
        state.selectedGames.delete(id);
        btn.classList.remove('added'); btn.textContent = 'Add';
      } else {
        state.selectedGames.add(id);
        btn.classList.add('added'); btn.textContent = 'Added ✓';
      }
    });
  });
}

/* ============ BUILD STEP 5: passes ============ */
function renderPasses(){
  const grid = document.getElementById('passGrid');
  grid.innerHTML = passes.map(p => `
    <div class="pass-card ${p.cls} ${state.pass===p.id?'selected':''}" data-id="${p.id}">
      <h3>${p.name}</h3>
      <div class="pass-price">₹${p.price}</div>
      <ul>${p.benefits.map(b=>`<li>${b}</li>`).join('')}</ul>
    </div>`).join('');
  grid.querySelectorAll('.pass-card').forEach(card=>{
    card.addEventListener('click', ()=>{
      state.pass = card.dataset.id;
      grid.querySelectorAll('.pass-card').forEach(c=>c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });
}

/* ============ PRICE CALC ============ */
function calcFoodTotal(){
  return foods.reduce((sum,f)=> sum + (state.foodQty[f.id]||0) * f.price, 0);
}
function calcGameTotal(){
  return games.filter(g=>state.selectedGames.has(g.id)).reduce((sum,g)=> sum + g.price, 0);
}
function calcPassPrice(){
  const p = passes.find(p=>p.id===state.pass);
  return p ? p.price : 0;
}
function calcTotal(){
  return calcPassPrice() + calcFoodTotal() + calcGameTotal();
}

/* ============ BUILD STEP 6: review ============ */
function renderReview(){
  const box = document.getElementById('reviewBox');
  const artistNames = artists.filter(a=>state.selectedArtists.has(a.id)).map(a=>a.name).join(', ') || 'none selected';
  const foodLines = foods.filter(f=>state.foodQty[f.id]>0).map(f=>`${f.name} x${state.foodQty[f.id]}`).join(', ') || 'none';
  const gameLines = games.filter(g=>state.selectedGames.has(g.id)).map(g=>g.name).join(', ') || 'none';
  const p = passes.find(p=>p.id===state.pass);

  box.innerHTML = `
    <h4>Attendee</h4>
    <p>${state.name} &nbsp;|&nbsp; Roll No: ${state.roll}</p>
    <h4>Artists</h4>
    <p>${artistNames}</p>
    <h4>Food</h4>
    <p>${foodLines}</p>
    <h4>Games &amp; Activities</h4>
    <p>${gameLines}</p>
    <h4>Pass</h4>
    <p>${p ? p.name : 'not selected'}</p>
  `;

  const breakdown = document.getElementById('priceBreakdown');
  breakdown.innerHTML = `
    <div class="price-line"><span>Pass Price</span><span>₹${calcPassPrice()}</span></div>
    <div class="price-line"><span>Food Subtotal</span><span>₹${calcFoodTotal()}</span></div>
    <div class="price-line"><span>Games Subtotal</span><span>₹${calcGameTotal()}</span></div>
    <div class="price-line total"><span>Total</span><span>₹${calcTotal()}</span></div>
  `;
}

/* ============ STEP NAVIGATION ============ */
function updateStepUI(){
  document.querySelectorAll('.step').forEach(s=>s.classList.remove('active-step'));
  document.getElementById('step'+currentStep).classList.add('active-step');

  document.querySelectorAll('.step-dot').forEach(dot=>{
    const n = parseInt(dot.dataset.step);
    dot.classList.remove('active','done');
    if(n < currentStep) dot.classList.add('done');
    if(n === currentStep) dot.classList.add('active');
  });

  document.getElementById('backBtn').style.visibility = currentStep === 1 ? 'hidden' : 'visible';
  document.getElementById('nextBtn').style.display = currentStep === totalSteps ? 'none' : 'inline-block';
  document.getElementById('genBtn').style.display = currentStep === totalSteps ? 'inline-block' : 'none';

  if(currentStep === 2) renderArtists();
  if(currentStep === 3) renderFood();
  if(currentStep === 4) renderGames();
  if(currentStep === 5) renderPasses();
  if(currentStep === 6) renderReview();
}

function validateStep(){
  if(currentStep === 1){
    state.name = document.getElementById('fullName').value.trim();
    state.roll = document.getElementById('rollNo').value.trim();
    state.photo = document.getElementById('photoUrl').value.trim();
    const err = document.getElementById('err1');
    if(!state.name || !state.roll || !state.photo){
      err.textContent = 'please fill in your name, roll number and a photo URL to continue';
      return false;
    }
    err.textContent = '';
    return true;
  }
  if(currentStep === 2){
    const err = document.getElementById('err2');
    if(state.selectedArtists.size === 0){
      err.textContent = 'pick at least one artist you want to see';
      return false;
    }
    err.textContent = '';
    return true;
  }
  if(currentStep === 5){
    const err = document.getElementById('err5');
    if(!state.pass){
      err.textContent = 'please choose a pass to continue';
      return false;
    }
    err.textContent = '';
    return true;
  }
  return true;
}

function nextStep(){
  if(!validateStep()) return;
  if(currentStep < totalSteps){ currentStep++; updateStepUI(); }
}
function prevStep(){
  if(currentStep > 1){ currentStep--; updateStepUI(); }
}

/* ============ TICKET GENERATION ============ */
function makeTicketId(){
  const rand = Math.random().toString(36).substring(2,7).toUpperCase();
  return 'F26-' + rand;
}

function generateTicket(){
  if(!validateStep()) return;

  const ticketId = makeTicketId();
  const total = calcTotal();
  const p = passes.find(p=>p.id===state.pass);
  const artistNames = artists.filter(a=>state.selectedArtists.has(a.id)).map(a=>a.name);
  const foodItems = foods.filter(f=>state.foodQty[f.id]>0).map(f=>`${f.name} x${state.foodQty[f.id]}`);
  const gameItems = games.filter(g=>state.selectedGames.has(g.id)).map(g=>g.name);

  const ticketData = {
    id: ticketId,
    name: state.name,
    roll: state.roll,
    photo: state.photo,
    passName: p.name,
    total: total,
    artists: artistNames,
    food: foodItems,
    games: gameItems,
    createdAt: new Date().toLocaleString(),
  };

  // fill ticket view
  document.getElementById('tPassName').textContent = ticketData.passName.toUpperCase();
  document.getElementById('tPhoto').src = ticketData.photo;
  document.getElementById('tName').textContent = ticketData.name;
  document.getElementById('tRoll').textContent = ticketData.roll;
  document.getElementById('tId').textContent = ticketData.id;
  document.getElementById('tTotal').textContent = ticketData.total;
  document.getElementById('tQr').src = 'https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=' + encodeURIComponent(ticketData.id);

  document.getElementById('tSelections').innerHTML = `
    <p><strong>Artists:</strong> ${ticketData.artists.join(', ') || 'none'}</p>
    <p><strong>Food:</strong> ${ticketData.food.join(', ') || 'none'}</p>
    <p><strong>Games:</strong> ${ticketData.games.join(', ') || 'none'}</p>
  `;

  document.querySelector('.wizard-card').style.display = 'none';
  document.getElementById('progressBar').style.display = 'none';
  document.getElementById('ticketView').classList.add('active-panel');

  savePass(ticketData);
}

function startOver(){
  state = { name:'', roll:'', photo:'', selectedArtists:new Set(), foodQty:{}, selectedGames:new Set(), pass:null };
  currentStep = 1;
  document.getElementById('fullName').value = '';
  document.getElementById('rollNo').value = '';
  document.getElementById('photoUrl').value = '';
  document.getElementById('imgPreview').style.display='none';
  document.getElementById('imgPreviewPlaceholder').style.display='flex';
  document.getElementById('imgPreviewPlaceholder').textContent = 'photo preview appears here';
  document.querySelector('.wizard-card').style.display = 'block';
  document.getElementById('progressBar').style.display = 'flex';
  document.getElementById('ticketView').classList.remove('active-panel');
  updateStepUI();
}

/* ============ MY PASSES (localStorage) ============ */
function savePass(ticketData){
  const saved = JSON.parse(localStorage.getItem('fest2026_passes') || '[]');
  saved.push(ticketData);
  localStorage.setItem('fest2026_passes', JSON.stringify(saved));
}

function renderMyPasses(){
  const container = document.getElementById('passesContainer');
  const saved = JSON.parse(localStorage.getItem('fest2026_passes') || '[]');
  if(saved.length === 0){
    container.innerHTML = `<p class="empty-msg">no passes saved yet — generate one from the "Generate Ticket" tab!</p>`;
    return;
  }
  container.innerHTML = saved.map((t,i) => `
    <div class="saved-pass-row">
      <div>
        <strong>${t.name}</strong> — ${t.passName}
        <div class="meta">ID: ${t.id} · ₹${t.total} · saved ${t.createdAt}</div>
      </div>
      <button onclick="deletePass(${i})">Delete</button>
    </div>
  `).join('');
}

function deletePass(index){
  const saved = JSON.parse(localStorage.getItem('fest2026_passes') || '[]');
  saved.splice(index,1);
  localStorage.setItem('fest2026_passes', JSON.stringify(saved));
  renderMyPasses();
}

/* ============ INIT ============ */
updateStepUI();
