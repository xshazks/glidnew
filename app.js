// ====== Data ======
const ORDERS = [
  { id: "GLID-2025-001", tgl: "10/10/2025", customer: "PT Nusantara Logistik", lokasiMuat: "KC Bandung", lokasiBongkar: "KC Jakarta", oa: 4500000, status: "Posted", tipe: "CDD", kantor: "KC Bandung", updatedAt: "10 Okt 2025, 08:30", pic: "Budi Santoso" },
  { id: "GLID-2025-002", tgl: "10/10/2025", customer: "CV Cipta Abadi", lokasiMuat: "KC Solo", lokasiBongkar: "KC Yogya", oa: 2200000, status: "Forwarded", tipe: "CDD Long", kantor: "KCU Solo", updatedAt: "10 Okt 2025, 09:15", pic: "Siti Hartati" },
  { id: "GLID-2025-003", tgl: "10/10/2025", customer: "PT Prima Cargo", lokasiMuat: "KC Bekasi", lokasiBongkar: "KC Surabaya", oa: 3600000, status: "Synced", tipe: "Wingbox 30T", kantor: "KC Bekasi", updatedAt: "10 Okt 2025, 09:00", pic: "Agus Riyadi" },
  { id: "GLID-2025-004", tgl: "10/10/2025", customer: "PT Satria Ekspres",
    lokasiMuat: "KC Medan", lokasiBongkar: "KC Pekanbaru", oa: 1800000,
    status: "Submitted", tipe: "CDD", kantor: "KC Medan",
    updatedAt: "10 Okt 2025, 07:20", pic: "Rama Putra" },
  
  { id: "GLID-2025-005", tgl: "10/10/2025", customer: "CV Samudra Abadi",
    lokasiMuat: "KC Denpasar", lokasiBongkar: "KC Mataram", oa: 2700000,
    status: "Archived", tipe: "Fuso", kantor: "KC Denpasar",
    updatedAt: "10 Okt 2025, 09:30", pic: "Made Wirawan" },
  
];
// Riwayat per order (boleh kamu sesuaikan)
const HISTORIES = {
  "GLID-2025-001": [
    { color:"blue",   title:"Submitted", desc:"KC Ujungberung",         time:"10 Okt 2025, 07:30" },
    { color:"blue",   title:"Posted",    desc:"Pusat",              time:"10 Okt 2025, 08:30" }
  ],
  "GLID-2025-002": [
    { color:"blue",   title:"Submitted", desc:"KC Ujungberung",            time:"10 Okt 2025, 07:40" },
    { color:"blue",   title:"Posted",    desc:"Pusat",              time:"10 Okt 2025, 08:20" },
    { color:"orange", title:"Forwarded", desc:"Regional", time:"10 Okt 2025, 09:15" }
  ],
  "GLID-2025-003": [
    { color:"blue",   title:"Submitted", desc:"KC Ujungberung",          time:"10 Okt 2025, 07:20" },
    { color:"blue",   title:"Posted",    desc:"Pusat",              time:"10 Okt 2025, 08:00" },
    { color:"purple", title:"Synced",    desc:"Sistem SAP",         time:"10 Okt 2025, 09:00" }
  ],
  "GLID-2025-004": [
  { color:"blue", title:"Submitted", desc:"KC Ujungberung", time:"10 Okt 2025, 07:20" }
  ],
  "GLID-2025-005": [
  { color:"blue",   title:"Submitted", desc:"KC Ujungberung", time:"10 Okt 2025, 07:10" },
  { color:"blue",   title:"Posted",    desc:"Pusat",       time:"10 Okt 2025, 08:05" },
  { color:"purple", title:"Synced",    desc:"Sistem SAP",  time:"10 Okt 2025, 08:40" },
  { color:"orange", title:"Forwarded", desc:"Regional", time:"10 Okt 2025, 09:10" },
  { color:"gray",   title:"Archived",  desc:"Regional Pembukuan", time:"10 Okt 2025, 09:30" }
  ],

};
const NOTIFS = [
  { id: 1, title: "Order Posted", body: "GLID-2025-001 berhasil diposting.", time: "10/10/2025, 08:30", read: false },
  { id: 2, title: "Order Posted", body: "GLID-2025-002 berhasil diteruskan ke regional.", time: "10/10/2025, 08:30", read: false },
];

// ====== Utils ======
const rupiah = (n)=> new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n);
const statusClass = (s)=>{
  if(s==='Posted') return 'posted';
  if(s==='Forwarded') return 'forwarded';
  if(s==='Synced') return 'synced';
  if(s==='Submitted') return 'submitted';
  if(s==='Archived') return 'archived';
  return '';
};


// ====== State ======
let filtered = [...ORDERS];
let selectedId = null;

// ====== Elements ======
const ordersTbody = document.getElementById('ordersTbody');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const ordersView = document.getElementById('ordersView');
const detailView = document.getElementById('detailView');
const detailTitle = document.getElementById('detailTitle');
const infoOrder = document.getElementById('infoOrder');
const statusBadge = document.getElementById('statusBadge');
const updatedAt = document.getElementById('updatedAt');
const timeline = document.getElementById('timeline');
const bellBtn = document.getElementById('bellBtn');
const notifPopover = document.getElementById('notifPopover');
const notifBadge = document.getElementById('notifBadge');
const notifList = document.getElementById('notifList');
const markReadBtn = document.getElementById('markReadBtn');
const downloadBtn = document.getElementById('downloadBtn');


// ====== Rendering ======
function renderOrders(){
  ordersTbody.innerHTML = '';
  if(filtered.length === 0){
    emptyState.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');
  for(const o of filtered){
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="min-160"><a href="#" class="link-blue" data-open-detail="${o.id}">${o.id}</a></td>
      <td>${o.tgl}</td>
      <td class="min-200">${o.customer}</td>
      <td>${o.lokasiMuat}</td>
      <td>${o.lokasiBongkar}</td>
      <td>${rupiah(o.oa)}</td>
      <td>
        <button class="chip ${statusClass(o.status)}" data-open-detail="${o.id}">${o.status}</button>
      </td>
      <td>${o.tipe}</td>
      <td>${o.kantor}</td>
    `;
    ordersTbody.appendChild(tr);
  }
}

function renderDetail(id){
  const o = ORDERS.find(x=>x.id===id);
  if(!o) return;

  detailTitle.textContent = `Detail Order – ${o.id}`;
  infoOrder.innerHTML = `
    <p><strong>Nomor Order:</strong> ${o.id}</p>
    <p><strong>Customer:</strong> ${o.customer}</p>
    <p><strong>Jenis Order:</strong> Pengiriman Logistik</p>
    <p><strong>Tanggal Input:</strong> ${o.tgl}</p>
    <p><strong>PIC KC:</strong> ${o.pic}</p>
  `;

  statusBadge.textContent = o.status;
  statusBadge.className = `chip ${statusClass(o.status)}`;
  updatedAt.textContent = `Diperbarui: ${o.updatedAt}`;

  // ⬇️ render timeline sesuai ID (atau fallback by status)
  const events = HISTORIES[id] || templateByStatus(o);
  timeline.innerHTML = events.map(ev => timelineItem(ev.color, ev.title, ev.desc, ev.time)).join('');
  downloadBtn.onclick = () => downloadProof(o);
}


function timelineItem(color,title,desc,time){
  return `<li>
    <span class="dot ${color}"></span>
    <div><strong>${title}</strong> – ${desc}</div>
    <div class="muted" style="margin-left:20px">${time}</div>
  </li>`;
}
function templateByStatus(o){
  const submitted = { color:"blue", title:"Submitted", desc:o.lokasiMuat || "KC", time:`${o.tgl} 07:30` };
  const posted    = { color:"blue", title:"Posted",    desc:"Pusat",              time:`${o.tgl} 08:30` };
  const synced    = { color:"purple", title:"Synced",  desc:"Sistem SAP",         time:`${o.tgl} 09:00` };
  const fwd       = { color:"orange", title:"Forwarded",desc:"Regional",          time:`${o.tgl} 09:15` };
  const archived  = { color:"gray", title:"Archived",  desc:"Regional Pembukuan", time:`${o.tgl} 09:30` };

  switch(o.status){
    case 'Submitted': return [submitted];
    case 'Posted':    return [submitted, posted];
    case 'Synced':    return [submitted, posted, synced];
    case 'Forwarded': return [submitted, posted, synced, fwd];
    case 'Archived':  return [submitted, posted, synced, fwd, archived];
    default:          return [submitted, posted];
  }
}


// ====== Notifications ======
function renderNotifs(){
  const unread = NOTIFS.filter(n=>!n.read).length;
  if(unread>0){
    notifBadge.textContent = unread;
    notifBadge.classList.remove('hidden');
  }else{
    notifBadge.classList.add('hidden');
  }
  notifList.innerHTML = NOTIFS.map(n=>`
    <div class="popover-item ${n.read?'':'unread'}">
      <div><strong>${n.title}</strong></div>
      <div class="muted">${n.body}</div>
      <div class="muted" style="font-size:11px; margin-top:4px">${n.time}</div>
    </div>
  `).join('');
}

// ====== Events ======
searchInput.addEventListener('input', (e)=>{
  const q = e.target.value.toLowerCase();
  filtered = ORDERS.filter(o => [o.id,o.customer,o.lokasiMuat,o.lokasiBongkar,o.tipe,o.kantor].join(' ').toLowerCase().includes(q));
  renderOrders();
});

document.addEventListener('click', (e)=>{
  // open detail
  const btn = e.target.closest('[data-open-detail]');
  if(btn){
    selectedId = btn.getAttribute('data-open-detail');
    ordersView.classList.add('hidden');
    detailView.classList.remove('hidden');
    renderDetail(selectedId);
  }
  // close popover when clicking outside
  if(!e.target.closest('.notif')){
    notifPopover.classList.add('hidden');
  }
});

document.getElementById('backBtn').addEventListener('click', ()=>{
  detailView.classList.add('hidden');
  ordersView.classList.remove('hidden');
});

bellBtn.addEventListener('click', (e)=>{
  e.stopPropagation();
  notifPopover.classList.toggle('hidden');
});

markReadBtn.addEventListener('click', ()=>{
  NOTIFS.forEach(n=> n.read = true);
  renderNotifs();
});
function downloadProof(o){
  // buat kanvas
  const W = 1000, H = 600;
  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  // background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0,0,W,H);

  // header bar
  ctx.fillStyle = '#f3f4f6';
  ctx.fillRect(0,0,W,90);

  // judul
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 32px Arial';
  ctx.fillText('BUKTI POSTING – GLID', 30, 55);

  // status chip
  const status = o.status || 'Posted';
  const chipX = 30, chipY = 120;
  ctx.fillStyle = status==='Posted' ? '#e5edff' : status==='Forwarded' ? '#ffefe3' : '#efe9ff';
  ctx.strokeStyle = status==='Posted' ? '#c7d2fe' : status==='Forwarded' ? '#fed7aa' : '#ddd6fe';
  ctx.lineWidth = 1;
  const chipW = ctx.measureText(status).width + 26, chipH = 34, r = 17;
  // rounded chip
  ctx.beginPath();
  ctx.moveTo(chipX+r, chipY);
  ctx.lineTo(chipX+chipW-r, chipY);
  ctx.quadraticCurveTo(chipX+chipW, chipY, chipX+chipW, chipY+r);
  ctx.lineTo(chipX+chipW, chipY+chipH-r);
  ctx.quadraticCurveTo(chipX+chipW, chipY+chipH, chipX+chipW-r, chipY+chipH);
  ctx.lineTo(chipX+r, chipY+chipH);
  ctx.quadraticCurveTo(chipX, chipY+chipH, chipX, chipY+chipH-r);
  ctx.lineTo(chipX, chipY+r);
  ctx.quadraticCurveTo(chipX, chipY, chipX+r, chipY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = status==='Posted' ? '#1d4ed8' : status==='Forwarded' ? '#ea580c' : '#6d28d9';
  ctx.font = 'bold 16px Arial';
  ctx.fillText(status, chipX + 13, chipY + 22);

  // informasi order
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 22px Arial';
  ctx.fillText('Informasi Order', 30, 190);

  ctx.font = '16px Arial';
  const lines = [
    ['Nomor Order', o.id],
    ['Customer', o.customer],
    ['Jenis Order', 'Pengiriman Logistik'],
    ['Tanggal Input', o.tgl],
    ['Lokasi Muat', o.lokasiMuat],
    ['Lokasi Bongkar', o.lokasiBongkar],
    ['Ongkos Angkut (OA)', new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(o.oa)],
    ['PIC KC', o.pic],
    ['Diperbarui', o.updatedAt]
  ];
  let y = 220;
  for(const [k,v] of lines){
    ctx.fillStyle = '#475569';
    ctx.fillText(k + ':', 30, y);
    ctx.fillStyle = '#0f172a';
    ctx.fillText(String(v), 220, y);
    y += 30;
  }

  // watermark ringan
  ctx.globalAlpha = 0.06;
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 120px Arial';
  ctx.fillText('GLID', W-360, H-40);
  ctx.globalAlpha = 1;

  // export & download
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = `BuktiPosting-${o.id}.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}


// ====== Init ======
renderOrders();
renderNotifs();
