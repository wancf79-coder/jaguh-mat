/* ===== Jaguh Mat — penjana soalan (KSSR Semakan 2017, Tahun 1–3) ===== */
const T=(ms,en)=>({ms,en});
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const fmtN=n=>String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' ');
const pad=n=>String(n).padStart(2,'0');
const okey=d=>typeof d==='object'?d.ms+'|'+d.en:String(d);
const near=(n,ds,lo=0,hi=1e9)=>ds.map(d=>n+d).filter(x=>x>=lo&&x<=hi&&x!==n);

function mc(base,ans,cands,fmt){
  fmt=fmt||(x=>typeof x==='number'?fmtN(x):x);
  const out=[ans],seen=new Set([okey(fmt(ans))]);
  for(const c of shuf(cands)){
    if(out.length>=4)break;
    if(c==null||(typeof c==='number'&&(c<0||!isFinite(c))))continue;
    const k=okey(fmt(c));if(!seen.has(k)){seen.add(k);out.push(c)}
  }
  const o=shuf(out);
  return Object.assign({q:'',eq:'',vis:''},base,{opts:o.map(fmt),ans:o.indexOf(ans)});
}

/* ---------- perkataan nombor ---------- */
const WMS=['kosong','satu','dua','tiga','empat','lima','enam','tujuh','lapan','sembilan'];
function wMs(n){
  if(n<10)return WMS[n];if(n===10)return'sepuluh';if(n===11)return'sebelas';
  if(n<20)return WMS[n-10]+' belas';
  if(n<100){const o=n%10;return WMS[Math.floor(n/10)]+' puluh'+(o?' '+WMS[o]:'')}
  if(n<1000){const h=Math.floor(n/100),r=n%100;return(h===1?'seratus':WMS[h]+' ratus')+(r?' '+wMs(r):'')}
  const th=Math.floor(n/1000),r=n%1000;return(th===1?'seribu':wMs(th)+' ribu')+(r?' '+wMs(r):'');
}
const WEN=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
const TEN=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
function wEn(n){
  if(n<20)return WEN[n];
  if(n<100)return TEN[Math.floor(n/10)]+(n%10?'-'+WEN[n%10]:'');
  if(n<1000)return WEN[Math.floor(n/100)]+' hundred'+(n%100?' and '+wEn(n%100):'');
  const r=n%1000;return wEn(Math.floor(n/1000))+' thousand'+(r?(r<100?' and ':' ')+wEn(r):'');
}
const NW=n=>T(wMs(n),wEn(n));

/* ---------- data umum ---------- */
const NAMES=['Ali','Siti','Muthu','Mei Ling','Aiman','Kavitha','Jun Wei','Aisyah','Ravi','Nurul','Danish','Farah'];
const THINGS=[T('guli','marbles'),T('buku','books'),T('pensel','pencils'),T('gula-gula','sweets'),T('setem','stamps'),T('kad','cards'),T('belon','balloons'),T('manik','beads'),T('biskut','biscuits')];
const ITEMS=[{id:'apple',t:T('epal','apples')},{id:'star',t:T('bintang','stars')},{id:'ball',t:T('bola','balls')},{id:'fish',t:T('ikan','fish')}];
const two=()=>{const a=pick(NAMES);let b=pick(NAMES);while(b===a)b=pick(NAMES);return[a,b]};
const DAYS=[T('Isnin','Monday'),T('Selasa','Tuesday'),T('Rabu','Wednesday'),T('Khamis','Thursday'),T('Jumaat','Friday'),T('Sabtu','Saturday'),T('Ahad','Sunday')];
const MONTHS=[T('Januari','January'),T('Februari','February'),T('Mac','March'),T('April','April'),T('Mei','May'),T('Jun','June'),T('Julai','July'),T('Ogos','August'),T('September','September'),T('Oktober','October'),T('November','November'),T('Disember','December')];
const MDAYS=[31,28,31,30,31,30,31,31,30,31,30,31];
const PLACE=[T('sa','ones'),T('puluh','tens'),T('ratus','hundreds'),T('ribu','thousands')];
const ORD=n=>T('ke-'+n,['','1st','2nd','3rd'][n]||n+'th');

/* ---------- SVG ---------- */
const svg=(w,h,inner,mw)=>`<svg class="vis" viewBox="0 0 ${w} ${h}" style="max-width:${mw||Math.min(w*1.3,480)}px" role="img">${inner}</svg>`;
const SHADE='#ff8a3d',LIGHT='#fff3e8',EDGE='#8a3b0c';
const FILLS=['#ff8a3d','#3b82f6','#22b573','#a66cff','#f2b705','#ef5b8c'];

function objs(n,kind){
  const per=n>10?10:n,s=38,gap=per>5?10:0;let g='';
  for(let i=0;i<n;i++){const r=Math.floor(i/per),c=i%per;g+=`<use href="#i-${kind}" x="${c*s+(c>=5?gap:0)+3}" y="${r*s+3}" width="32" height="32"/>`}
  return svg(per*s+gap,Math.ceil(n/per)*s,g);
}
function rods(t,o){
  let g='',x=4;
  for(let i=0;i<t;i++){g+=`<g transform="translate(${x},4)"><rect width="18" height="150" rx="3" fill="#3b82f6" stroke="#1e3a8a" stroke-width="2"/>${[...Array(9)].map((_,k)=>`<line x1="0" x2="18" y1="${15*(k+1)}" y2="${15*(k+1)}" stroke="#1e3a8a" stroke-width="1.4"/>`).join('')}</g>`;x+=24}
  x+=10;for(let i=0;i<o;i++){const c=i%2,r=Math.floor(i/2);g+=`<rect x="${x+c*19}" y="${141-r*19}" width="15" height="15" rx="2" fill="#f59e0b" stroke="#92400e" stroke-width="2"/>`}
  return svg(x+(o?42:0),160,g);
}
const FRC=[['#ff8a3d','#fff3e8','#8a3b0c'],['#3b82f6','#eaf2ff','#1e3a8a'],['#22b573','#eafaf1','#145c3a'],['#a66cff','#f4efff','#4b2a8f'],['#ef5b8c','#fff0f5','#8f1d45'],['#f2b705','#fff9e0','#7a5a00']];
function fracSvg(den,num,kind,o){
  o=o||{};const C=o.c||pick(FRC),[S,L,E]=C,sh=new Set(o.rand?shuf([...Array(den).keys()]).slice(0,num):[...Array(num).keys()]);let p='';
  if(kind==='grid'&&den%2===0&&den>=4){const cols=den/2,w=Math.min(56,240/cols);
    for(let i=0;i<den;i++){const r=Math.floor(i/cols),c=i%cols;p+=`<rect x="${4+c*w}" y="${4+r*w}" width="${w}" height="${w}" fill="${sh.has(i)?S:L}" stroke="${E}" stroke-width="2.5"/>`}
    return svg(cols*w+8,2*w+8,p,o.mw||Math.min((cols*w+8)*1.3,300))}
  if(kind==='col'){const h=Math.min(40,200/den);for(let i=0;i<den;i++)p+=`<rect x="4" y="${4+i*h}" width="90" height="${h}" fill="${sh.has(i)?S:L}" stroke="${E}" stroke-width="2.5"/>`;return svg(98,den*h+8,p,o.mw||140)}
  if(kind==='circle'){const r=70,c=80,rot=o.rand?pick([0,45,90,180]):0;
    if(den===1)return svg(160,160,`<circle cx="80" cy="80" r="70" fill="${num?S:L}" stroke="${E}" stroke-width="2.5"/>`,o.mw||190);
    for(let i=0;i<den;i++){const a0=(rot-90+i*360/den)*Math.PI/180,a1=a0+2*Math.PI/den;
      p+=`<path d="M${c} ${c}L${(c+r*Math.cos(a0)).toFixed(1)} ${(c+r*Math.sin(a0)).toFixed(1)}A${r} ${r} 0 0 1 ${(c+r*Math.cos(a1)).toFixed(1)} ${(c+r*Math.sin(a1)).toFixed(1)}Z" fill="${sh.has(i)?S:L}" stroke="${E}" stroke-width="2.5"/>`}
    return svg(160,160,p,o.mw||190)}
  const w=Math.min(48,260/den);
  for(let i=0;i<den;i++)p+=`<rect x="${4+i*w}" y="4" width="${w}" height="80" fill="${sh.has(i)?S:L}" stroke="${E}" stroke-width="2.5"/>`;
  return svg(w*den+8,88,p,o.mw);
}
const FKINDS=den=>den%2===0&&den>=4?['circle','rect','col','grid']:['circle','rect','col'];
function strip10(n){let p='';for(let i=0;i<10;i++)p+=`<rect x="${4+i*28}" y="4" width="28" height="44" fill="${i<n?'#22b573':'#eefaf3'}" stroke="#145c3a" stroke-width="2"/>`;return svg(288,52,p)}
function grid100(n){let p='';for(let i=0;i<100;i++){const r=Math.floor(i/10),c=i%10;p+=`<rect x="${3+c*17}" y="${3+r*17}" width="17" height="17" fill="${i<n?'#a66cff':'#f4efff'}" stroke="#4b2a8f" stroke-width="1.2"/>`}return svg(176,176,p,220)}

function clockSvg(h,m){
  let s='<circle cx="100" cy="100" r="92" fill="#fff" stroke="#24345a" stroke-width="7"/>';
  for(let i=0;i<60;i++){const a=i*Math.PI/30,big=i%5===0,r1=big?76:82;s+=`<line x1="${(100+r1*Math.sin(a)).toFixed(1)}" y1="${(100-r1*Math.cos(a)).toFixed(1)}" x2="${(100+87*Math.sin(a)).toFixed(1)}" y2="${(100-87*Math.cos(a)).toFixed(1)}" stroke="#24345a" stroke-width="${big?3:1.3}"/>`}
  for(let n=1;n<=12;n++){const a=n*Math.PI/6;s+=`<text x="${(100+62*Math.sin(a)).toFixed(1)}" y="${(100-62*Math.cos(a)+7).toFixed(1)}" text-anchor="middle" font-size="19" font-weight="800" fill="#24345a">${n}</text>`}
  const ha=((h%12)+m/60)*30,ma=m*6;
  s+=`<line x1="100" y1="100" x2="100" y2="54" stroke="#e5484d" stroke-width="8" stroke-linecap="round" transform="rotate(${ha} 100 100)"/>`;
  s+=`<line x1="100" y1="100" x2="100" y2="28" stroke="#24345a" stroke-width="5" stroke-linecap="round" transform="rotate(${ma} 100 100)"/>`;
  return svg(200,200,s+'<circle cx="100" cy="100" r="7" fill="#24345a"/>',210);
}

const NOTE_C={1:'#3d6fd6',5:'#2f9e5c',10:'#d9443f',20:'#e98b2a',50:'#1c8c8a',100:'#7b4fc4'};
function moneySvg(items){
  let x=0,y=0,g='',rowH=0,maxX=0;const W=470;
  for(const it of items){
    const w=it.n?112:(it.v>=50?60:it.v>=20?54:it.v>=10?48:42),h=it.n?58:w;
    if(x+w>W){x=0;y+=rowH+10;rowH=0}
    if(it.n)g+=`<g transform="translate(${x},${y})"><rect width="112" height="58" rx="6" fill="${NOTE_C[it.v]}"/><rect x="5" y="5" width="102" height="48" rx="4" fill="none" stroke="#fff" stroke-opacity=".55"/><circle cx="86" cy="29" r="17" fill="#fff" fill-opacity=".22"/><text x="12" y="37" font-size="21" font-weight="800" fill="#fff">RM${it.v}</text></g>`;
    else{const r=w/2;g+=`<g transform="translate(${x+r},${y+r})"><circle r="${r}" fill="#d5dbe3" stroke="#8792a2" stroke-width="3"/><circle r="${r-6}" fill="none" stroke="#fff" stroke-opacity=".8"/><text text-anchor="middle" y="${r>24?3:2}" font-size="${r>24?17:14}" font-weight="800" fill="#2a3242">${it.v}</text><text text-anchor="middle" y="${r>24?17:14}" font-size="9" fill="#2a3242">sen</text></g>`}
    x+=w+10;rowH=Math.max(rowH,h);maxX=Math.max(maxX,x);
  }
  return svg(maxX-10,y+rowH,g,Math.min((maxX-10)*1.5,520));
}

/* bentuk 2D */
const SH2={
  sq:{t:T('segi empat sama','square'),s:4},re:{t:T('segi empat tepat','rectangle'),s:4},tr:{t:T('segi tiga','triangle'),s:3},
  ci:{t:T('bulatan','circle'),s:0},pe:{t:T('pentagon','pentagon'),s:5},he:{t:T('heksagon','hexagon'),s:6},oc:{t:T('oktagon','octagon'),s:8}
};
function polyPts(n,r,cx,cy,rot){return[...Array(n)].map((_,i)=>{const a=(rot+i*360/n)*Math.PI/180;return(cx+r*Math.cos(a)).toFixed(1)+','+(cy+r*Math.sin(a)).toFixed(1)}).join(' ')}
function shape2Svg(k){
  const f=pick(FILLS),st='stroke="#1d2540" stroke-width="4" stroke-linejoin="round"';let p;
  if(k==='sq')p=`<rect x="40" y="20" width="120" height="120" fill="${f}" ${st}/>`;
  else if(k==='re')p=`<rect x="10" y="40" width="180" height="90" fill="${f}" ${st}/>`;
  else if(k==='ci')p=`<circle cx="100" cy="80" r="66" fill="${f}" ${st}/>`;
  else if(k==='tr')p=`<polygon points="${polyPts(3,78,100,92,-90)}" fill="${f}" ${st}/>`;
  else p=`<polygon points="${polyPts(SH2[k].s,72,100,82,-90)}" fill="${f}" ${st}/>`;
  return svg(200,160,p,230);
}
/* bentuk 3D */
const SH3={
  cube:{t:T('kubus','cube'),f:6,e:12,v:8},cuboid:{t:T('kuboid','cuboid'),f:6,e:12,v:8},
  cyl:{t:T('silinder','cylinder'),f:2,e:2,v:0},cone:{t:T('kon','cone'),f:1,e:1,v:1},
  sph:{t:T('sfera','sphere'),f:0,e:0,v:0},pyr:{t:T('piramid','pyramid'),f:5,e:8,v:5}
};
function shape3Svg(k){
  const c=pick([['#7cc4ff','#4a9be0','#2f78c0'],['#ffb36b','#f08b3a','#cc6a1d'],['#9be3a8','#5cc474','#3b9a52'],['#d2b3ff','#a97cf2','#8456d4']]);
  const s='stroke="#1d2540" stroke-width="3" stroke-linejoin="round"',d='stroke="#1d2540" stroke-width="2" stroke-dasharray="6 5" fill="none"';let p='';
  if(k==='cube')p=`<polygon points="40,60 80,25 165,25 125,60" fill="${c[0]}" ${s}/><polygon points="125,60 165,25 165,110 125,145" fill="${c[2]}" ${s}/><rect x="40" y="60" width="85" height="85" fill="${c[1]}" ${s}/>`;
  else if(k==='cuboid')p=`<polygon points="15,75 50,45 185,45 150,75" fill="${c[0]}" ${s}/><polygon points="150,75 185,45 185,110 150,140" fill="${c[2]}" ${s}/><rect x="15" y="75" width="135" height="65" fill="${c[1]}" ${s}/>`;
  else if(k==='cyl')p=`<path d="M45 40V130A55 16 0 0 0 155 130V40Z" fill="${c[1]}" ${s}/><ellipse cx="100" cy="40" rx="55" ry="16" fill="${c[0]}" ${s}/><path d="M45 130A55 16 0 0 1 155 130" ${d}/>`;
  else if(k==='cone')p=`<path d="M100 15L45 130A55 16 0 0 0 155 130Z" fill="${c[1]}" ${s}/><path d="M45 130A55 16 0 0 1 155 130" ${d}/>`;
  else if(k==='sph')p=`<circle cx="100" cy="80" r="66" fill="url(#g-sph)" ${s}/><path d="M34 80A66 18 0 0 0 166 80" stroke="#1d2540" stroke-width="2" fill="none"/><path d="M34 80A66 18 0 0 1 166 80" ${d}/>`;
  else p=`<polygon points="25,140 125,140 100,20" fill="${c[1]}" ${s}/><polygon points="125,140 170,108 100,20" fill="${c[2]}" ${s}/><path d="M25 140L70 108L170 108M70 108L100 20" ${d}/>`;
  return svg(200,160,p,230);
}

/* data */
function picto(rows,unit,kind,title){
  const ic=`<svg viewBox="0 0 32 32"><use href="#i-${kind}"/></svg>`;
  const body=rows.map(r=>`<div class="pr"><span class="pn">${r.n}</span><span class="pi">${ic.repeat(r.v/unit)}</span></div>`).join('');
  return T(`<div class="picto"><div class="pt">${title.ms}</div>${body}<div class="pk">${ic}<span>mewakili ${unit} ${ITEMS.find(i=>i.id===kind).t.ms}</span></div></div>`,
           `<div class="picto"><div class="pt">${title.en}</div>${body}<div class="pk">${ic}<span>represents ${unit} ${unit===1?ITEMS.find(i=>i.id===kind).t.en.replace(/s$/,''):ITEMS.find(i=>i.id===kind).t.en}</span></div></div>`);
}
function barsSvg(rows,step,max){
  const W=340,H=230,l=40,b=196,top=16,bw=44,gap=(W-l-10-rows.length*bw)/(rows.length+1);let g='';
  for(let v=0;v<=max;v+=step){const y=b-(b-top)*v/max;g+=`<line x1="${l}" x2="${W-6}" y1="${y}" y2="${y}" stroke="#c9d3e6" stroke-width="1"/><text x="${l-6}" y="${y+4}" text-anchor="end" font-size="11" fill="#55607a">${v}</text>`}
  rows.forEach((r,i)=>{const x=l+gap+i*(bw+gap),h=(b-top)*r.v/max;g+=`<rect x="${x}" y="${b-h}" width="${bw}" height="${h}" rx="3" fill="${FILLS[i%6]}"/><text x="${x+bw/2}" y="${b+16}" text-anchor="middle" font-size="12" font-weight="700" fill="#24345a">${r.n}</text>`});
  return svg(W,H,g+`<line x1="${l}" x2="${l}" y1="${top-6}" y2="${b}" stroke="#24345a" stroke-width="2"/><line x1="${l}" x2="${W-6}" y1="${b}" y2="${b}" stroke="#24345a" stroke-width="2"/>`,440);
}
function coordSvg(pts,n){
  const s=36,o=34;let g='';
  for(let i=0;i<=n;i++){g+=`<line x1="${o+i*s}" x2="${o+i*s}" y1="10" y2="${10+n*s}" stroke="#c9d3e6"/><line x1="${o}" x2="${o+n*s}" y1="${10+i*s}" y2="${10+i*s}" stroke="#c9d3e6"/>`;
    g+=`<text x="${o+i*s}" y="${n*s+30}" text-anchor="middle" font-size="13" font-weight="700" fill="#24345a">${i}</text><text x="${o-12}" y="${10+(n-i)*s+5}" text-anchor="middle" font-size="13" font-weight="700" fill="#24345a">${i}</text>`}
  g+=`<line x1="${o}" x2="${o+n*s+8}" y1="${10+n*s}" y2="${10+n*s}" stroke="#24345a" stroke-width="2.5"/><line x1="${o}" x2="${o}" y1="2" y2="${10+n*s}" stroke="#24345a" stroke-width="2.5"/>`;
  pts.forEach(p=>{g+=`<use href="#i-${p.k}" x="${o+p.x*s-14}" y="${10+(n-p.y)*s-14}" width="28" height="28"/>`});
  return svg(o+n*s+14,n*s+40,g,320);
}

/* ukuran */
function barsAB(vals,unitLen){
  let g='';const L=['A','B','C'];
  vals.forEach((v,i)=>{const y=12+i*44;g+=`<text x="4" y="${y+21}" font-size="18" font-weight="800" fill="#24345a">${L[i]}</text><rect x="28" y="${y}" width="${v*unitLen}" height="28" rx="14" fill="${FILLS[i]}" stroke="#1d2540" stroke-width="2"/>`});
  return svg(28+Math.max(...vals)*unitLen+8,12+vals.length*44,g,440);
}
function clipsSvg(n){
  const u=34;let g=`<rect x="6" y="10" width="${n*u-14}" height="22" fill="#f2b705" stroke="#1d2540" stroke-width="2"/><polygon points="${n*u-8},10 ${n*u+12},21 ${n*u-8},32" fill="#f6d7a7" stroke="#1d2540" stroke-width="2"/><rect x="2" y="10" width="8" height="22" rx="3" fill="#ef5b8c" stroke="#1d2540" stroke-width="2"/>`;
  for(let i=0;i<n;i++)g+=`<rect x="${4+i*u}" y="46" width="${u-4}" height="14" rx="7" fill="none" stroke="#5b6b8c" stroke-width="3"/><rect x="${10+i*u}" y="50" width="${u-14}" height="6" rx="3" fill="none" stroke="#5b6b8c" stroke-width="2"/>`;
  return svg(n*u+16,66,g,520);
}
function rulerSvg(n,max){
  const u=28,W=max*u+30;let g=`<rect x="10" y="60" width="${max*u+10}" height="44" rx="4" fill="#fde68a" stroke="#92400e" stroke-width="2"/>`;
  for(let i=0;i<=max;i++){g+=`<line x1="${15+i*u}" x2="${15+i*u}" y1="60" y2="76" stroke="#5a3a0a" stroke-width="2"/><text x="${15+i*u}" y="96" text-anchor="middle" font-size="12" fill="#5a3a0a">${i}</text>`;if(i<max)g+=`<line x1="${15+i*u+u/2}" x2="${15+i*u+u/2}" y1="60" y2="69" stroke="#5a3a0a" stroke-width="1.3"/>`}
  g+=`<rect x="15" y="22" width="${n*u-16}" height="24" fill="#3b82f6" stroke="#1d2540" stroke-width="2"/><polygon points="${15+n*u-16},22 ${15+n*u},34 ${15+n*u-16},46" fill="#f6d7a7" stroke="#1d2540" stroke-width="2"/><line x1="${15+n*u}" x2="${15+n*u}" y1="34" y2="60" stroke="#e5484d" stroke-width="1.5" stroke-dasharray="3 3"/><line x1="15" x2="15" y1="22" y2="60" stroke="#e5484d" stroke-width="1.5" stroke-dasharray="3 3"/>`;
  return svg(W,108,g,520);
}
function balanceSvg(heavy){ // 'A','B','='
  const t=heavy==='A'?-12:heavy==='B'?12:0,big=heavy==='A'?[60,40]:heavy==='B'?[40,60]:[50,50];
  let g=`<polygon points="150,170 125,200 175,200" fill="#8b5a2b"/><g transform="rotate(${t} 150 120)"><rect x="40" y="114" width="220" height="10" rx="5" fill="#5b6b8c"/>`+
  `<rect x="${75-big[0]/2}" y="${114-big[0]}" width="${big[0]}" height="${big[0]}" rx="6" fill="#ff8a3d" stroke="#1d2540" stroke-width="2"/><text x="75" y="${114-big[0]/2+7}" text-anchor="middle" font-size="20" font-weight="800" fill="#fff">A</text>`+
  `<rect x="${225-big[1]/2}" y="${114-big[1]}" width="${big[1]}" height="${big[1]}" rx="6" fill="#3b82f6" stroke="#1d2540" stroke-width="2"/><text x="225" y="${114-big[1]/2+7}" text-anchor="middle" font-size="20" font-weight="800" fill="#fff">B</text></g><rect x="145" y="120" width="10" height="55" fill="#8b5a2b"/>`;
  return svg(300,205,g,360);
}
function glassesSvg(levels){
  let g='';const L=['A','B','C'];
  levels.forEach((lv,i)=>{const x=20+i*100;g+=`<path d="M${x} 20L${x+12} 170H${x+68}L${x+80} 20" fill="#eef6ff" stroke="#1d2540" stroke-width="3"/><path d="M${x+12-12*(1-0)} ${170-lv}" fill="none"/><polygon points="${x+12*(lv/150)},${170-lv} ${x+80-12*(lv/150)},${170-lv} ${x+68},170 ${x+12},170" fill="#5aa9f0" opacity=".85"/><text x="${x+40}" y="196" text-anchor="middle" font-size="18" font-weight="800" fill="#24345a">${L[i]}</text>`});
  return svg(20+levels.length*100,205,g,380);
}
function jugSvg(ml,max,step){
  const H=200,top=20,b=210;let g=`<path d="M60 ${top}V${b}Q60 ${b+12} 72 ${b+12}H168Q180 ${b+12} 180 ${b}V${top}" fill="#eef6ff" stroke="#1d2540" stroke-width="3"/>`;
  const y=v=>b-(b-top-10)*v/max;
  g+=`<rect x="62" y="${y(ml)}" width="116" height="${b+10-y(ml)}" fill="#5aa9f0" opacity=".85"/>`;
  for(let v=step;v<=max;v+=step){g+=`<line x1="150" x2="180" y1="${y(v)}" y2="${y(v)}" stroke="#1d2540" stroke-width="2"/><text x="186" y="${y(v)+4}" font-size="12" fill="#24345a">${v} ml</text>`}
  return svg(250,236,g,280);
}
function dialSvg(v,max,step,unit){
  const cx=150,cy=150,r=110;let g=`<rect x="20" y="20" width="260" height="190" rx="18" fill="#e9eef8" stroke="#1d2540" stroke-width="3"/><path d="M${cx-r} ${cy}A${r} ${r} 0 0 1 ${cx+r} ${cy}" fill="#fff" stroke="#1d2540" stroke-width="3"/>`;
  for(let x=0;x<=max;x+=step){const a=Math.PI*(1-x/max);g+=`<line x1="${(cx+(r-14)*Math.cos(a)).toFixed(1)}" y1="${(cy-(r-14)*Math.sin(a)).toFixed(1)}" x2="${(cx+r*Math.cos(a)).toFixed(1)}" y2="${(cy-r*Math.sin(a)).toFixed(1)}" stroke="#1d2540" stroke-width="2.5"/><text x="${(cx+(r-30)*Math.cos(a)).toFixed(1)}" y="${(cy-(r-30)*Math.sin(a)+4).toFixed(1)}" text-anchor="middle" font-size="11" fill="#24345a">${x}</text>`}
  const a=Math.PI*(1-v/max);
  g+=`<line x1="${cx}" y1="${cy}" x2="${(cx+(r-20)*Math.cos(a)).toFixed(1)}" y2="${(cy-(r-20)*Math.sin(a)).toFixed(1)}" stroke="#e5484d" stroke-width="5" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="8" fill="#1d2540"/><text x="${cx}" y="${cy+40}" text-anchor="middle" font-size="16" font-weight="800" fill="#24345a">${unit}</text>`;
  return svg(300,220,g,320);
}

/* ---------- format ---------- */
const sen=v=>v+' sen';
const rm=v=>v%100===0?'RM'+fmtN(v/100):'RM'+fmtN(Math.floor(v/100))+'.'+pad(v%100);
const hasCarry=(a,b)=>{while(a||b){if(a%10+b%10>=10)return true;a=Math.floor(a/10);b=Math.floor(b/10)}return false};
const hasBorrow=(a,b)=>{while(a||b){if(a%10<b%10)return true;a=Math.floor(a/10);b=Math.floor(b/10)}return false};
const noCarry=(a,b)=>{let r=0,m=1;while(a||b){r+=((a%10+b%10)%10)*m;a=Math.floor(a/10);b=Math.floor(b/10);m*=10}return r};
const absDig=(a,b)=>{let r=0,m=1;while(a||b){r+=Math.abs(a%10-b%10)*m;a=Math.floor(a/10);b=Math.floor(b/10);m*=10}return r};
const QS=T('Berapakah jawapannya?','What is the answer?');
const fr=(a,b)=>a+'/'+b;

/* ================= PENJANA ================= */
const G={
/* --- nombor --- */
count(p){const n=ri(p.min||1,p.max),k=pick(ITEMS);
  return mc({q:T(`Berapakah bilangan ${k.t.ms}?`,`How many ${k.t.en} are there?`),vis:objs(n,k.id)},n,near(n,[-3,-2,-1,1,2,3,10],0))},
nextNum(p){const st=pick(p.steps||[1]),after=Math.random()<.5,n=ri((p.min||1)+st,p.max-st),ans=after?n+st:n-st;
  const q=st===1?(after?T(`Nombor selepas ${fmtN(n)} ialah ...`,`Which number comes after ${fmtN(n)}?`):T(`Nombor sebelum ${fmtN(n)} ialah ...`,`Which number comes before ${fmtN(n)}?`))
    :(after?T(`${st} lebih daripada ${fmtN(n)} ialah ...`,`What is ${st} more than ${fmtN(n)}?`):T(`${st} kurang daripada ${fmtN(n)} ialah ...`,`What is ${st} less than ${fmtN(n)}?`));
  return mc({q},ans,near(ans,[-2*st,-st,st,2*st,1,-1,10,-10].filter((v,i,a)=>a.indexOf(v)===i),0))},
word(p){const n=ri(p.min||0,p.max),cand=[n+1,n-1,n+10,n-10,n+100,n-100,n+1000].filter(x=>x>=0&&x<=Math.max(p.max,10)&&x!==n);
  const s=String(n);if(s.length>1){const r=+s.split('').reverse().join('');if(r!==n&&String(r).length===s.length)cand.push(r)}
  if(Math.random()<.5)return mc({q:T('Pilih perkataan bagi nombor ini.','Choose the number name.'),eq:fmtN(n)},NW(n),cand.map(NW));
  return mc({q:T(`Tulis "${wMs(n)}" dalam angka.`,`Write "${wEn(n)}" in numerals.`)},n,cand)},
rods(){const t=ri(1,9),o=ri(0,9),n=t*10+o;
  return mc({q:T('Berapakah nombor yang ditunjukkan?','What number is shown?'),vis:rods(t,o)},n,[o*10+t,n+1,n-1,n+10,n-10,t+o].filter(x=>x!==n&&x>0))},
place(p){let n,ds;for(let k=0;k<50;k++){n=ri(p.min,p.max);ds=String(n).split('');if(new Set(ds).size===ds.length&&!ds.includes('0'))break}
  const L=ds.length,i=ri(0,L-1),d=+ds[L-1-i];
  if(Math.random()<.5){const ans=d*10**i;
    return mc({q:T(`Apakah nilai digit ${d} dalam ${fmtN(n)}?`,`What is the value of the digit ${d} in ${fmtN(n)}?`)},ans,[d,d*10,d*100,d*1000,d*10000].filter(x=>x!==ans&&x<=10**(L+1)))}
  return mc({q:T(`Digit ${d} dalam ${fmtN(n)} berada di tempat ...`,`The digit ${d} in ${fmtN(n)} is in the ... place.`)},PLACE[i],PLACE.slice(0,Math.max(L,3)))},
cmpWord(p){const a=ri(p.min||1,p.max),b=Math.random()<.2?a:ri(p.min||1,p.max);
  const opts=[T('lebih daripada','is more than'),T('kurang daripada','is less than'),T('sama dengan','is equal to')];
  const ans=a>b?opts[0]:a<b?opts[1]:opts[2];
  return mc({q:T(`${fmtN(a)} ... ${fmtN(b)}`,`${fmtN(a)} ... ${fmtN(b)}`),eq:`${fmtN(a)}  ?  ${fmtN(b)}`},ans,opts)},
cmpSym(p){const a=ri(p.min||1,p.max);let b=Math.random()<.2?a:ri(p.min||1,p.max);if(Math.random()<.4&&a>20)b=a+pick([-1,1,10,-10]);
  const ans=a>b?'>':a<b?'<':'=';return mc({q:T('Pilih tanda yang betul.','Choose the correct sign.'),eq:`${fmtN(a)}  ?  ${fmtN(b)}`},ans,['>','<','='])},
extreme(p){const s=new Set();while(s.size<4)s.add(ri(p.min||1,p.max));const a=[...s],big=Math.random()<.5,ans=big?Math.max(...a):Math.min(...a);
  return mc({q:big?T('Nombor manakah paling besar?','Which number is the greatest?'):T('Nombor manakah paling kecil?','Which number is the smallest?')},ans,a.filter(x=>x!==ans))},
order(p){const s=new Set();while(s.size<4)s.add(ri(p.min||1,p.max));const a=[...s].sort((x,y)=>x-y),f=x=>x.map(fmtN).join(', ');
  const up=Math.random()<.5,ans=f(up?a:a.slice().reverse());const c=[];for(let k=0;k<12;k++)c.push(f(shuf(a)));
  return mc({q:up?T('Susunan manakah dari kecil ke besar?','Which order is from smallest to greatest?'):T('Susunan manakah dari besar ke kecil?','Which order is from greatest to smallest?')},ans,c)},
pattern(p){const st=pick(p.steps),down=p.down&&Math.random()<.4,len=5,s0=ri(p.min||0,Math.max(p.min||0,p.max-st*(len-1)));
  let seq=[...Array(len)].map((_,i)=>s0+i*st);if(down)seq.reverse();const h=ri(1,len-1),ans=seq[h];
  return mc({q:T('Apakah nombor yang hilang?','What is the missing number?'),eq:seq.map((x,i)=>i===h?'?':fmtN(x)).join(', ')},ans,near(ans,[st,-st,1,-1,2*st,10,-10],0))},
round(p){const to=pick(p.to);let n;do{n=ri(p.min||1,p.max)}while(n%to===0);const ans=Math.round(n/to)*to,pl={10:1,100:2,1000:3}[to];
  return mc({q:T(`Bundarkan ${fmtN(n)} kepada ${PLACE[pl].ms} yang terdekat.`,`Round ${fmtN(n)} to the nearest ${['','ten','hundred','thousand'][pl]}.`)},ans,[Math.floor(n/to)*to,Math.ceil(n/to)*to,ans+to,ans-to,Math.round(n/(to/10))*(to/10)].filter(x=>x>=0&&x!==ans))},
/* --- operasi --- */
add(p){let a,b;for(let k=0;k<300;k++){
    if(p.basic){a=ri(1,9);b=ri(1,9)}else{a=ri(p.min||10,p.max-1);b=ri(p.bmin||1,p.max-a)}
    if(a+b>p.max)continue;if(p.carry===true&&!hasCarry(a,b))continue;if(p.carry===false&&hasCarry(a,b))continue;break}
  const s=a+b;return mc({q:T('Berapakah hasil tambah?','What is the sum?'),eq:`${fmtN(a)} + ${fmtN(b)} = ?`},s,near(s,[1,-1,2,-2,10,-10,100,-100],0).concat([noCarry(a,b)]))},
sub(p){let a,b;for(let k=0;k<300;k++){
    if(p.basic){a=ri(2,p.max);b=ri(1,Math.min(9,a))}else{a=ri(p.min||10,p.max);b=ri(p.bmin||1,a-1)}
    if(p.borrow===true&&!hasBorrow(a,b))continue;if(p.borrow===false&&hasBorrow(a,b))continue;break}
  const d=a-b;return mc({q:T('Berapakah hasil tolak?','What is the difference?'),eq:`${fmtN(a)} − ${fmtN(b)} = ?`},d,near(d,[1,-1,2,-2,10,-10,100],0).concat([absDig(a,b),a+b]))},
missing(p){const c=ri(p.min||5,p.max),a=ri(1,c-1),b=c-a;const t=ri(0,2);
  const eq=t===0?`${fmtN(a)} + ? = ${fmtN(c)}`:t===1?`? + ${fmtN(b)} = ${fmtN(c)}`:`${fmtN(c)} − ? = ${fmtN(a)}`,ans=t===1?a:b;
  return mc({q:T('Apakah nombor yang hilang?','What is the missing number?'),eq},ans,near(ans,[1,-1,2,-2,10,-10],0).concat([c,a+c]))},
mul(p){let a,b;if(p.big){for(let k=0;k<100;k++){b=ri(2,9);a=ri(p.lo||10,p.hi||999);if(a*b<=(p.max||9999))break}}else{a=pick(p.tables);b=ri(1,10)}
  if(!p.big&&Math.random()<.5)[a,b]=[b,a];const ans=a*b;
  return mc({q:T('Berapakah hasil darab?','What is the product?'),eq:`${fmtN(a)} × ${fmtN(b)} = ?`},ans,near(ans,[a,-a,b,-b,1,-1,10,-10],0).concat([a+b]))},
div(p){let d,q;if(p.big){d=ri(2,9);q=ri(p.lo||10,Math.floor((p.max||9999)/d))}else{d=pick(p.tables);q=ri(1,10)}
  const n=d*q;return mc({q:T('Berapakah hasil bahagi?','What is the quotient?'),eq:`${fmtN(n)} ÷ ${d} = ?`},q,near(q,[1,-1,2,-2,10,-10],0).concat([d,n-d]))},
mix(p){const a=ri(100,p.max/2),b=ri(50,p.max/2),c=ri(10,Math.min(a+b-1,p.max/3)),plus=Math.random()<.5;
  const eq=plus?`${fmtN(a)} + ${fmtN(b)} − ${fmtN(c)} = ?`:`${fmtN(a+b)} − ${fmtN(b)} + ${fmtN(c)} = ?`,ans=plus?a+b-c:a+c;
  return mc({q:T('Selesaikan dari kiri ke kanan.','Solve from left to right.'),eq},ans,near(ans,[10,-10,100,-100,1,-1],0).concat([plus?a+b+c:a-c]))},
story(p){const op=pick(p.ops),[n1,n2]=two(),th=pick(THINGS);let a,b,ans,q;
  if(op==='+'){a=ri(p.min||2,Math.floor(p.max*.6));b=ri(2,p.max-a);ans=a+b;
    q=T(`${n1} ada ${fmtN(a)} ${th.ms}. ${n2} memberi ${fmtN(b)} ${th.ms} lagi kepada ${n1}. Berapakah jumlah ${th.ms} ${n1} sekarang?`,`${n1} has ${fmtN(a)} ${th.en}. ${n2} gives ${n1} ${fmtN(b)} more ${th.en}. How many ${th.en} does ${n1} have now?`)}
  else if(op==='-'){a=ri(Math.max(5,p.min||5),p.max);b=ri(1,a-1);ans=a-b;
    q=T(`${n1} ada ${fmtN(a)} ${th.ms}. ${n1} memberi ${fmtN(b)} ${th.ms} kepada ${n2}. Berapakah ${th.ms} ${n1} yang tinggal?`,`${n1} has ${fmtN(a)} ${th.en}. ${n1} gives ${fmtN(b)} ${th.en} to ${n2}. How many ${th.en} does ${n1} have left?`)}
  else if(op==='×'){a=ri(2,p.big?9:5);b=pick(p.tables||[2,3,4,5,10]);ans=a*b;
    q=T(`Ada ${a} kotak. Setiap kotak berisi ${b} ${th.ms}. Berapakah jumlah ${th.ms} semuanya?`,`There are ${a} boxes. Each box has ${b} ${th.en}. How many ${th.en} are there altogether?`)}
  else{b=pick(p.tables||[2,3,4,5,10]);ans=ri(2,10);a=ans*b;
    q=T(`${a} ${th.ms} dikongsi sama banyak oleh ${b} orang murid. Berapakah ${th.ms} yang diterima oleh setiap murid?`,`${a} ${th.en} are shared equally among ${b} pupils. How many ${th.en} does each pupil get?`)}
  return mc({q},ans,near(ans,[1,-1,2,-2,10,-10],0).concat([a+b,Math.abs(a-b)]))},
/* --- pecahan, perpuluhan, peratus --- */
fracShade(p){const den=pick(p.dens),num=ri(1,den-1),kind=pick(FKINDS(den)),c=pick(FRC);
  if(Math.random()<.4){const nums=shuf([...Array(den-1).keys()].map(x=>x+1).filter(x=>x!==num));const ans=fracSvg(den,num,kind,{rand:1,c,mw:150});
    const cands=nums.slice(0,3).map(n=>fracSvg(den,n,kind,{rand:1,c,mw:150}));for(const d of [den+1,den+2,den+4])if(cands.length<3)cands.push(fracSvg(d,num,d%2===0&&d>=4?kind:(kind==='grid'?'rect':kind),{rand:1,c,mw:150}));
    return mc({q:T(`Gambar manakah menunjukkan ${fr(num,den)}?`,`Which picture shows ${fr(num,den)}?`),ak:fr(num,den)},ans,cands)}
  return mc({q:pick([T('Apakah pecahan bagi bahagian yang berwarna?','What fraction is coloured?'),T('Berapakah pecahan yang dilorek?','What fraction is shaded?'),T('Tulis pecahan bagi bahagian berwarna.','Write the fraction for the coloured part.')]),vis:fracSvg(den,num,kind,{rand:Math.random()<.6,c})},fr(num,den),[fr(den-num,den),fr(num,den+1),fr(num+1,den),fr(den,num),fr(1,den),fr(num,den*2)].filter(x=>x!==fr(num,den)&&!/^(\d+)\/\1$/.test(x)))},
fracWord(p){const den=pick(p.dens),num=ri(1,den-1);
  const EN={2:['half','halves'],3:['third','thirds'],4:['quarter','quarters'],5:['fifth','fifths'],6:['sixth','sixths'],7:['seventh','sevenths'],8:['eighth','eighths'],9:['ninth','ninths'],10:['tenth','tenths']};
  const nm=(a,b)=>T(wMs(a)+' per'+wMs(b),WEN[a]+' '+EN[b][a>1?1:0]);
  if(Math.random()<.5)return mc({q:T('Bagaimana kita sebut pecahan ini?','How do we say this fraction?'),eq:fr(num,den)},nm(num,den),[nm(den-num,den),nm(num,pick(p.dens.filter(d=>d>num&&d!==den).concat([den+1<=10?den+1:2]))),nm(1,den===2?4:2)].filter(x=>x))
  return mc({q:T(`Pilih pecahan "${wMs(num)} per${wMs(den)}".`,`Choose the fraction "${nm(num,den).en}".`)},fr(num,den),[fr(den,num),fr(den-num,den),fr(num,den+1),fr(num+1,den)].filter(x=>!/^(\d+)\/\1$/.test(x)))},
fracCmp(p){const den=pick(p.dens.filter(d=>d>=3)),s=new Set();while(s.size<Math.min(3,den-1))s.add(ri(1,den-1));const ns=[...s],big=Math.random()<.5,ans=big?Math.max(...ns):Math.min(...ns);
  if(p.sameNum&&Math.random()<.5){const ds=shuf(p.dens).slice(0,3),a=big?Math.min(...ds):Math.max(...ds);
    return mc({q:big?T('Pecahan manakah paling besar?','Which fraction is the greatest?'):T('Pecahan manakah paling kecil?','Which fraction is the smallest?')},fr(1,a),ds.map(d=>fr(1,d)))}
  return mc({q:big?T('Pecahan manakah paling besar?','Which fraction is the greatest?'):T('Pecahan manakah paling kecil?','Which fraction is the smallest?')},fr(ans,den),ns.map(n=>fr(n,den)))},
fracOf(p){const den=pick(p.dens),num=ri(1,den-1),k=ri(1,p.k||5),w=den*k,ans=num*k,th=pick(THINGS);
  return mc({q:T(`${fr(num,den)} daripada ${w} ${th.ms} ialah ...`,`${fr(num,den)} of ${w} ${th.en} is ...`)},ans,near(ans,[k,-k,1,-1,num,den],0).concat([w-ans,k]))},
fracEq(){const den=pick([2,3,4,5]),num=ri(1,den-1),k=ri(2,4),ans=fr(num*k,den*k);
  return mc({q:T(`Pecahan manakah setara dengan ${fr(num,den)}?`,`Which fraction is equivalent to ${fr(num,den)}?`),vis:fracSvg(den,num,pick(FKINDS(den)))},ans,[fr(num+k,den+k),fr(num*k,den),fr(num,den*k),fr(num*k+1,den*k),fr(den-num,den)])},
decShade(p){if(p.h){const n=ri(1,99),ans=(n/100).toFixed(2);return mc({q:T('Tulis bahagian berwarna sebagai perpuluhan.','Write the coloured part as a decimal.'),vis:grid100(n)},ans,[(n/10).toFixed(1),String(n),(((n+10)%100||5)/100).toFixed(2),((n%10*10+Math.floor(n/10))/100).toFixed(2)])}
  const n=ri(1,9),ans='0.'+n;return mc({q:T('Tulis bahagian berwarna sebagai perpuluhan.','Write the coloured part as a decimal.'),vis:strip10(n)},ans,['0.0'+n,String(n),'0.'+(10-n),'1.'+n,'0.'+(n%9+1)])},
decFrac(p){if(p.h&&Math.random()<.5){const n=ri(1,99),f=fr(n,100),d=(n/100).toFixed(2);
    return Math.random()<.5?mc({q:T('Tukar kepada perpuluhan.','Convert to a decimal.'),eq:f},d,[(n/10).toFixed(1),'0.'+String(n).split('').reverse().join('').padEnd(2,'0'),(n/1000).toFixed(3),String(n)])
      :mc({q:T('Tukar kepada pecahan.','Convert to a fraction.'),eq:d},f,[fr(n,10),fr(n,1000),fr(100,n),fr(n%10||1,100)])}
  const n=ri(1,9),f=fr(n,10),d='0.'+n;
  return Math.random()<.5?mc({q:T('Tukar kepada perpuluhan.','Convert to a decimal.'),eq:f},d,['0.0'+n,'1.'+n,n+'.0','0.'+(10-n)]):mc({q:T('Tukar kepada pecahan.','Convert to a fraction.'),eq:d},f,[fr(n,100),fr(1,n),fr(10,n),fr(10-n,10)])},
pctShade(){const n=ri(1,99);return mc({q:T('Berapa peratus bahagian yang berwarna?','What percentage is coloured?'),vis:grid100(n)},n+'%',[(100-n)+'%',((n+10)%100||5)+'%',(n%10*10+Math.floor(n/10)||3)+'%',(n+1)+'%'])},
pctConv(){const r=Math.random();
  if(r<.35){const n=ri(1,99);return mc({q:T('Tukar kepada peratus.','Convert to a percentage.'),eq:fr(n,100)},n+'%',[(100-n)+'%',n*10+'%',(n+1)+'%',Math.round(n/10)+'%'])}
  if(r<.7){const n=ri(1,99);return mc({q:T('Tukar kepada pecahan.','Convert to a fraction.'),eq:n+'%'},fr(n,100),[fr(n,10),fr(100,n),fr(100-n,100),fr(n,1000)])}
  const P=[[1,2,50],[1,4,25],[3,4,75],[1,10,10],[1,5,20],[2,5,40]],x=pick(P);
  return mc({q:T(`${fr(x[0],x[1])} sama dengan berapa peratus?`,`${fr(x[0],x[1])} is equal to what percentage?`)},x[2]+'%',P.map(y=>y[2]+'%').concat([x[1]+'%',x[0]*10+'%']))},
/* --- wang --- */
coinVal(p){const it=Math.random()<.5?{n:false,v:pick([5,10,20,50])}:{n:true,v:pick(p.notes||[1,5,10])},ans=it.n?'RM'+it.v:sen(it.v);
  return mc({q:T('Berapakah nilai wang ini?','What is the value of this money?'),vis:moneySvg([it])},ans,['5 sen','10 sen','20 sen','50 sen','RM1','RM5','RM10','RM20'].filter(x=>x!==ans))},
money(p){const items=[];let tot=0;const k=ri(2,p.k||5);
  for(let i=0;i<k;i++){const n=(p.notes&&(!p.coins||Math.random()<.6)),v=n?pick(p.notes):pick(p.coins),add=n?v*100:v;if(tot+add>p.max)continue;items.push({n,v});tot+=add}
  if(!items.length){items.push(p.coins?{n:false,v:10}:{n:true,v:1});tot=p.coins?10:100}
  items.sort((a,b)=>(b.n-a.n)||(b.v-a.v));const f=p.coinsOnly?sen:rm;
  return mc({q:T('Berapakah jumlah nilai wang ini?','What is the total value of this money?'),vis:moneySvg(items)},f(tot),(p.coins?[tot+5,tot-5,tot+10,tot-10,tot+50,tot+100,tot-100]:[tot+100,tot-100,tot+200,tot+500,tot-500,tot+1000]).filter(x=>x>0).map(f))},
moneyConv(p){const r=Math.random()<.5;let v=ri(1,p.maxRM||10)*100+(p.cents?pick([0,5,10,20,50,75,90]):0);
  if(r)return mc({q:T('Tukar nilai wang.','Convert the money.'),eq:`${rm(v)} = ? sen`},v,[v/10,v*10,v+50,v-50,v/100].filter(Number.isInteger));
  return mc({q:T('Tukar nilai wang.','Convert the money.'),eq:`${fmtN(v)} sen = ?`},rm(v),[v*10,v/10,v+50,v-50,v*100].filter(Number.isInteger).map(rm))},
moneyStory(p){const op=pick(p.ops),[n1]=two(),u=p.cents?5:100,R=x=>Math.round(x/u)*u;let a,b,ans,q;
  const items=[T('buku cerita','a storybook'),T('kotak pensel','a pencil box'),T('beg sekolah','a school bag'),T('botol air','a water bottle'),T('bola','a ball')];
  if(op==='+'){a=R(ri(u,p.max*.5));b=R(ri(u,p.max-a));ans=a+b;const x=pick(items),y=pick(items.filter(i=>i!==x));
    q=T(`${n1} membeli ${x.ms} berharga ${rm(a)} dan ${y.ms} berharga ${rm(b)}. Berapakah jumlah harganya?`,`${n1} buys ${x.en} for ${rm(a)} and ${y.en} for ${rm(b)}. What is the total price?`)}
  else if(op==='-'){a=R(ri(u*4,p.max));b=R(ri(u,a-u));ans=a-b;const x=pick(items);
    q=T(`${n1} ada ${rm(a)}. ${n1} membeli ${x.ms} berharga ${rm(b)}. Berapakah baki wang ${n1}?`,`${n1} has ${rm(a)}. ${n1} buys ${x.en} for ${rm(b)}. How much money is left?`)}
  else if(op==='×'){b=ri(2,9);a=R(ri(u,Math.floor(p.max/b)));ans=a*b;const x=pick(items);
    q=T(`Harga ${x.ms.replace(/^a /,'')} ialah ${rm(a)}. Berapakah harga ${b} unit?`,`One unit costs ${rm(a)}. What is the price of ${b} units?`)}
  else{b=ri(2,9);ans=R(ri(u,Math.floor(p.max/b)));a=ans*b;
    q=T(`${rm(a)} dikongsi sama banyak oleh ${b} orang. Berapakah wang yang diterima oleh setiap orang?`,`${rm(a)} is shared equally among ${b} people. How much does each person get?`)}
  return mc({q},rm(ans),[ans+u,ans-u,ans+10*u,ans-10*u,ans+50].filter(x=>x>0).map(rm))},
/* --- masa --- */
period(){const L=[[T('Kita bersarapan pada waktu ...','We have breakfast in the ...'),0],[T('Matahari terbit pada waktu ...','The sun rises in the ...'),0],[T('Murid makan tengah hari pada waktu ...','Pupils have lunch at ...'),1],
  [T('Matahari terbenam pada waktu ...','The sun sets in the ...'),2],[T('Kita bermain di padang selepas sekolah pada waktu ...','We play at the field after school in the ...'),2],[T('Bulan dan bintang kelihatan pada waktu ...','The moon and stars appear at ...'),3],[T('Kita tidur pada waktu ...','We go to sleep at ...'),3]];
  const O=[T('pagi','morning'),T('tengah hari','noon'),T('petang','evening'),T('malam','night')],x=pick(L);return mc({q:x[0]},O[x[1]],O)},
day(){const i=ri(0,6),k=pick([1,1,2]),after=Math.random()<.5,ans=DAYS[(i+(after?k:7-k))%7];
  return mc({q:after?T(`${k===1?'Hari':'Dua hari'} selepas ${DAYS[i].ms} ialah ...`,`${k===1?'The day':'Two days'} after ${DAYS[i].en} is ...`):T(`${k===1?'Hari':'Dua hari'} sebelum ${DAYS[i].ms} ialah ...`,`${k===1?'The day':'Two days'} before ${DAYS[i].en} is ...`)},ans,DAYS)},
month(){const i=ri(0,11),r=Math.random();
  if(r<.4)return mc({q:T(`Bulan ${ORD(i+1).ms} dalam setahun ialah ...`,`The ${ORD(i+1).en} month of the year is ...`)},MONTHS[i],MONTHS);
  const after=r<.7,ans=MONTHS[(i+(after?1:11))%12];return mc({q:after?T(`Bulan selepas ${MONTHS[i].ms} ialah ...`,`The month after ${MONTHS[i].en} is ...`):T(`Bulan sebelum ${MONTHS[i].ms} ialah ...`,`The month before ${MONTHS[i].en} is ...`)},ans,MONTHS)},
mdays(){let i;do{i=ri(0,11)}while(i===1);return mc({q:T(`Berapakah bilangan hari dalam bulan ${MONTHS[i].ms}?`,`How many days are there in ${MONTHS[i].en}?`)},MDAYS[i],[28,29,30,31])},
clock(p){const h=ri(1,12),m=p.mode==='h'?0:p.mode==='half'?pick([0,30]):ri(0,11)*5;
  if(p.mode==='h'){const f=x=>T('pukul '+x,x+" o'clock");return mc({q:T('Pukul berapakah sekarang?','What time is it?'),vis:clockSvg(h,0)},f(h),[h%12+1,(h+10)%12+1,(h+5)%12+1,12].filter(x=>x!==h).map(f))}
  const f=(a,b)=>`${a}:${pad(b)}`,mm=m/5||12;
  const c=[f(mm,(h%12)*5),f(h%12+1,m),f((h+10)%12+1,m),f(h,(m+30)%60),f(h,(60-m)%60),f(h,(m+5)%60)];
  if(p.ampm){const pm=Math.random()<.5,L=pm?T('petang','p.m.'):T('pagi','a.m.'),O=pm?T('pagi','a.m.'):T('petang','p.m.');const g=(t,l)=>T(t+' '+l.ms,t+' '+l.en);
    const ctx=pm?T('Waktu ini ialah selepas tengah hari.','This time is in the afternoon.'):T('Waktu ini ialah sebelum tengah hari.','This time is in the morning.');
    return mc({q:T(ctx.ms+' Apakah waktu yang ditunjukkan?',ctx.en+' What time is shown?'),vis:clockSvg(h,m)},g(f(h,m),L),[g(f(h,m),O),g(c[1],L),g(c[0],L),g(c[3],L)])}
  return mc({q:T('Apakah waktu yang ditunjukkan?','What time is shown?'),vis:clockSvg(h,m)},f(h,m),c)},
tconv(p){const U=[[T('jam','hours'),T('minit','minutes'),60],[T('hari','days'),T('jam','hours'),24],[T('minggu','weeks'),T('hari','days'),7],[T('tahun','years'),T('bulan','months'),12],[T('minit','minutes'),T('saat','seconds'),60]].slice(0,p.n||4);
  const u=pick(U),n=ri(1,p.max||5);
  if(p.mixed&&u[2]!==7&&Math.random()<.5){const r=ri(1,u[2]-1),ans=n*u[2]+r;return mc({q:T(`${n} ${u[0].ms} ${r} ${u[1].ms} = ? ${u[1].ms}`,`${n} ${u[0].en} ${r} ${u[1].en} = ? ${u[1].en}`)},ans,[n*100+r,n*u[2],ans+u[2],ans-u[2],n+r])}
  const ans=n*u[2];return mc({q:T(`${n} ${u[0].ms} = ? ${u[1].ms}`,`${n} ${u[0].en} = ? ${u[1].en}`)},ans,[n*100,n*10,ans+u[2],ans-u[2],n+u[2],n*12,n*24,n*60].filter(x=>x!==ans))},
duration(){const h=ri(7,10),m=pick([0,15,30,45]),d=pick([30,45,60,75,90,105,120,150]),e=h*60+m+d,eh=Math.floor(e/60),em=e%60;
  const ft=(a,b)=>`${a}:${pad(b)}`,dur=x=>T(((x>=60?Math.floor(x/60)+' jam ':'')+(x%60?x%60+' minit':'')).trim(),((x>=60?Math.floor(x/60)+' h ':'')+(x%60?x%60+' min':'')).trim());
  const pm=x=>x===12?T('tengah hari','pm'):x>12?T('petang','pm'):T('pagi','am'),hh=x=>x>12?x-12:x;
  const s=T(`${ft(h,m)} ${pm(h).ms}`,`${ft(h,m)} ${pm(h).en}`),en=T(`${ft(hh(eh),em)} ${pm(eh).ms}`,`${ft(hh(eh),em)} ${pm(eh).en}`);
  if(Math.random()<.5)return mc({q:T(`Kelas bermula pada ${s.ms} dan tamat pada ${en.ms}. Berapa lamakah kelas itu?`,`A class starts at ${s.en} and ends at ${en.en}. How long is the class?`)},dur(d),[d+15,d-15,d+30,d+60,d-30].filter(x=>x>0).map(dur));
  const fe=x=>{const t=h*60+m+x,a=Math.floor(t/60);return T(`${ft(hh(a),t%60)} ${pm(a).ms}`,`${ft(hh(a),t%60)} ${pm(a).en}`)};
  return mc({q:T(`Ali mula membaca pada ${s.ms} selama ${dur(d).ms}. Pukul berapakah dia selesai?`,`Ali starts reading at ${s.en} for ${dur(d).en}. What time does he finish?`)},fe(d),[fe(d+15),fe(d-15),fe(d+60),fe(d+30)])},
/* --- ukuran --- */
cmpLen(){const s=new Set();while(s.size<3)s.add(ri(3,12));const v=[...s],L=['A','B','C'],long=Math.random()<.5,i=v.indexOf(long?Math.max(...v):Math.min(...v));
  return mc({q:long?T('Jalur manakah paling panjang?','Which strip is the longest?'):T('Jalur manakah paling pendek?','Which strip is the shortest?'),vis:barsAB(v,26)},L[i],L)},
clips(){const n=ri(3,11);return mc({q:T('Berapa klip kertaskah panjang pensel ini?','How many paper clips long is this pencil?'),vis:clipsSvg(n)},n,near(n,[1,-1,2,-2,3],1))},
balance(){const h=pick(['A','B','A','B','=']),L=Math.random()<.5;
  const O=[T('Kotak A','Box A'),T('Kotak B','Box B'),T('Sama berat','Same weight')];
  const ans=h==='='?O[2]:L?(h==='A'?O[1]:O[0]):(h==='A'?O[0]:O[1]);
  return mc({q:L?T('Kotak manakah lebih ringan?','Which box is lighter?'):T('Kotak manakah lebih berat?','Which box is heavier?'),vis:balanceSvg(h)},ans,O)},
glass(){const s=new Set();while(s.size<3)s.add(ri(3,14)*10);const v=[...s],L=['A','B','C'],more=Math.random()<.5,i=v.indexOf(more?Math.max(...v):Math.min(...v));
  return mc({q:more?T('Gelas manakah ada paling banyak air?','Which glass has the most water?'):T('Gelas manakah ada paling sedikit air?','Which glass has the least water?'),vis:glassesSvg(v)},L[i],L)},
ruler(p){const n=ri(2,p.max||12);return mc({q:T('Berapakah panjang pensel ini?','How long is this pencil?'),vis:rulerSvg(n,(p.max||12)+1)},n+' cm',near(n,[1,-1,2,-2],1).map(x=>x+' cm').concat([(n+1)+' m']))},
jug(p){const st=p.step||100,v=ri(1,p.max/st-1)*st;return mc({q:T('Berapakah isi padu air dalam bekas ini?','What is the volume of water in the container?'),vis:jugSvg(v,p.max,st)},v+' ml',[v+st,v-st,v+2*st,v+' l'].map(x=>typeof x==='number'?x+' ml':x).filter(x=>!/^0 /.test(x)&&!/^-/.test(x)))},
dial(p){const st=p.step||100,v=ri(1,p.max/st-1)*st;return mc({q:T('Berapakah jisim barang ini?','What is the mass of this item?'),vis:dialSvg(v,p.max,st,'g')},v+' g',[v+st,v-st,v+2*st,v-2*st].filter(x=>x>0).map(x=>x+' g').concat([v+' kg']))},
uconv(p){const u=pick(p.pairs),[a,b,f]=u;
  if(p.mixed&&Math.random()<.4){const n=ri(1,5),r=f===1000?ri(1,19)*50:f===100?ri(1,19)*5:ri(1,f-1),ans=n*f+r;
    return mc({q:T('Tukar unit.','Convert the unit.'),eq:`${n} ${a} ${r} ${b} = ? ${b}`},ans,[n*100+r,n*10+r,ans+f,n*f,n+r].filter(x=>x!==ans))}
  const n=ri(1,p.max||9);
  if(Math.random()<.5){const ans=n*f;return mc({q:T('Tukar unit.','Convert the unit.'),eq:`${n} ${a} = ? ${b}`},ans,[n*10,n*100,n*1000,ans+f,n].filter(x=>x!==ans))}
  return mc({q:T('Tukar unit.','Convert the unit.'),eq:`${fmtN(n*f)} ${b} = ? ${a}`},n,[n*10,n*f/100,n+1,n*100].filter(x=>Number.isInteger(x)&&x!==n))},
mstory(p){const K=pick(p.kinds),U={len:['cm',T('reben','ribbon'),T('panjang','long')],mass:['g',T('tepung','flour'),T('berat','heavy')],vol:['ml',T('jus','juice'),T('isi padu','volume')]}[K];
  const [n1,n2]=two(),a=ri(p.min||10,p.max),b=ri(5,a-1),plus=Math.random()<.5,ans=plus?a+b:a-b;
  const q=plus?T(`${n1} ada ${fmtN(a)} ${U[0]} ${U[1].ms}. ${n2} ada ${fmtN(b)} ${U[0]} ${U[1].ms}. Berapakah jumlah ${U[1].ms} mereka?`,`${n1} has ${fmtN(a)} ${U[0]} of ${U[1].en}. ${n2} has ${fmtN(b)} ${U[0]} of ${U[1].en}. How much ${U[1].en} do they have altogether?`)
             :T(`${n1} ada ${fmtN(a)} ${U[0]} ${U[1].ms}. ${n1} menggunakan ${fmtN(b)} ${U[0]}. Berapakah baki ${U[1].ms} ${n1}?`,`${n1} has ${fmtN(a)} ${U[0]} of ${U[1].en}. ${n1} uses ${fmtN(b)} ${U[0]}. How much ${U[1].en} is left?`);
  return mc({q},fmtN(ans)+' '+U[0],near(ans,[10,-10,1,-1,5],1).map(x=>fmtN(x)+' '+U[0]).concat([fmtN(plus?a-b:a+b)+' '+U[0]]))},
/* --- ruang --- */
shape2(p){const k=pick(p.set);return mc({q:T('Apakah nama bentuk ini?','What is the name of this shape?'),vis:shape2Svg(k)},SH2[k].t,p.set.concat(['sq','re','tr','ci']).map(x=>SH2[x].t))},
sides(p){const k=pick(p.set.filter(x=>x!=='ci')),bucu=Math.random()<.5;
  return mc({q:bucu?T('Berapakah bilangan bucu bentuk ini?','How many vertices does this shape have?'):T('Berapakah bilangan sisi bentuk ini?','How many sides does this shape have?'),vis:shape2Svg(k)},SH2[k].s,[3,4,5,6,8,2].filter(x=>x!==SH2[k].s))},
shape3(p){const k=pick(p.set);return mc({q:T('Apakah nama bentuk ini?','What is the name of this shape?'),vis:shape3Svg(k)},SH3[k].t,Object.values(SH3).map(x=>x.t))},
props3(p){const k=pick(p.set),w=pick(['f','e','v']),Q={f:T('permukaan rata','flat faces'),e:T('tepi','edges'),v:T('bucu','vertices')}[w],ans=SH3[k][w];
  return mc({q:T(`Berapakah bilangan ${Q.ms} bentuk ini?`,`How many ${Q.en} does this shape have?`),vis:shape3Svg(k)},ans,near(ans,[1,-1,2,-2,4,-4],0).concat([6,8,12]))},
/* --- data --- */
picto(p){const unit=pick(p.units||[1]),ns=shuf(NAMES).slice(0,4),kind=pick(['star','apple','ball']),rows=ns.map(n=>({n,v:ri(1,p.max||6)*unit}));
  const title=T(`Bilangan ${ITEMS.find(i=>i.id===kind).t.ms} yang dikumpul`,`Number of ${ITEMS.find(i=>i.id===kind).t.en} collected`),vis=picto(rows,unit,kind,title);return dataQ(rows,vis,p)},
bars(p){const unit=p.step||5,ns=shuf(NAMES).slice(0,4),rows=ns.map(n=>({n,v:ri(1,(p.max||50)/unit)*unit}));
  return dataQ(rows,barsSvg(rows,p.axis||10,p.max||50),p,T('Carta palang menunjukkan bilangan buku yang dibaca.','The bar chart shows the number of books read.'))},
/* --- koordinat, nisbah, kadaran --- */
coord(p){const n=5,ks=shuf(['apple','star','ball','fish']).slice(0,3),used=new Set(),pts=ks.map(k=>{let x,y;do{x=ri(0,n);y=ri(0,n)}while(used.has(x+','+y)||x===y);used.add(x+','+y);return{k,x,y}});
  const t=pick(pts),nm=ITEMS.find(i=>i.id===t.k).t,f=(a,b)=>`(${a}, ${b})`;
  if(p.mode==='at'||(!p.mode&&Math.random()<.4)){const O=pts.map(q=>ITEMS.find(i=>i.id===q.k).t);
    return mc({q:T(`Apakah objek di koordinat ${f(t.x,t.y)}?`,`Which object is at ${f(t.x,t.y)}?`),vis:coordSvg(pts,n)},nm,O.concat([T('tiada','nothing')]))}
  return mc({q:T(`Apakah koordinat ${nm.ms}?`,`What are the coordinates of the ${nm.en.replace(/s$/,'').replace('fishe','fish')}?`),vis:coordSvg(pts,n)},f(t.x,t.y),[f(t.y,t.x),f(t.x+1,t.y),f(t.x,t.y+1),f(Math.max(0,t.x-1),t.y)])},
ratio(){const r=Math.random(),th=pick([T('krayon','crayons'),T('pensel','pencils'),T('manik','beads'),T('helai kertas','sheets of paper')]);
  if(r<.5){const per=pick([10,100]),n=ri(2,9),ans=per*n;return mc({q:T(`1 kotak berisi ${per} ${th.ms} (nisbah 1 : ${per}). Berapakah ${th.ms} dalam ${n} kotak?`,`1 box holds ${per} ${th.en} (ratio 1 : ${per}). How many ${th.en} are in ${n} boxes?`)},ans,[ans+per,ans-per,n+per,ans*10,ans/10].filter(Number.isInteger))}
  if(r<.75){const per=ri(2,9),n=ri(2,9),ans=per*n;return mc({q:T(`Sebiji kek memerlukan ${per} biji telur. Berapakah telur yang diperlukan untuk ${n} biji kek?`,`One cake needs ${per} eggs. How many eggs are needed for ${n} cakes?`)},ans,[ans+per,ans-per,per+n,ans+1])}
  const per=pick([10,100]),n=ri(2,9),tot=per*n;return mc({q:T(`${fmtN(tot)} ${th.ms} dimasukkan ke dalam kotak. Setiap kotak berisi ${per}. Berapakah kotak yang diperlukan?`,`${fmtN(tot)} ${th.en} are put into boxes of ${per}. How many boxes are needed?`)},n,[n+1,n-1,n*10,tot/2].filter(x=>x>0&&Number.isInteger(x)))}
};
function dataQ(rows,vis,p,q0){
  const r=Math.random(),pre=q0?q0.ms+' ':'',preE=q0?q0.en+' ':'';
  const nm=rows.map(x=>x.n);
  if(r<.35){const x=pick(rows);return mc({q:T(pre+`Berapakah bilangan bagi ${x.n}?`,preE+`How many does ${x.n} have?`),vis},x.v,rows.map(y=>y.v).concat(near(x.v,[1,-1,2,5,-5],0)))}
  if(r<.55){const vs=rows.map(x=>x.v),mx=Math.max(...vs),mn=Math.min(...vs),big=Math.random()<.5,t=big?mx:mn,c=rows.filter(x=>x.v===t);
    if(c.length===1)return mc({q:T(pre+(big?'Siapakah yang paling banyak?':'Siapakah yang paling sedikit?'),preE+(big?'Who has the most?':'Who has the fewest?')),vis},c[0].n,nm)}
  if(r<.8){let [a,b]=shuf(rows);if(a.v===b.v)b=rows.find(x=>x.v!==a.v)||b;if(a.v<b.v)[a,b]=[b,a];const d=a.v-b.v;
    if(d>0)return mc({q:T(pre+`Berapakah lebihnya ${a.n} berbanding ${b.n}?`,preE+`How many more does ${a.n} have than ${b.n}?`),vis},d,near(d,[1,-1,2,-2,5],0).concat([a.v,b.v,a.v+b.v]))}
  const s=rows.reduce((t,x)=>t+x.v,0);return mc({q:T(pre+'Berapakah jumlah semuanya?',preE+'What is the total altogether?'),vis},s,near(s,[1,-1,2,-2,5,-5,10],0))
}

/* ================= KURIKULUM ================= */
const S=(ms,en,...g)=>({t:T(ms,en),g});
const CH={
1:[
 {t:T('Nombor Bulat hingga 100','Whole Numbers up to 100'),st:[
   S('Kira objek','Count objects',['count',{max:20}],['nextNum',{max:30}]),
   S('Sebut & tulis nombor','Read & write numbers',['word',{max:100}],['rods',{}]),
   S('Banding & susun','Compare & order',['cmpWord',{max:100}],['extreme',{max:100}],['order',{max:100}]),
   S('Nilai tempat','Place value',['rods',{}],['place',{min:11,max:99}]),
   S('Pola & bundar','Patterns & rounding',['pattern',{max:100,steps:[1,2,5,10],down:true}],['round',{max:99,to:[10]}])]},
 {t:T('Tambah dan Tolak','Addition and Subtraction'),st:[
   S('Fakta asas tambah','Basic addition facts',['add',{basic:1,max:18}]),
   S('Tambah hingga 100','Add within 100',['add',{max:100,min:10,carry:false}],['add',{max:100,min:10,carry:true}]),
   S('Fakta asas tolak','Basic subtraction facts',['sub',{basic:1,max:18}]),
   S('Tolak hingga 100','Subtract within 100',['sub',{max:99,min:20,borrow:false}],['sub',{max:99,min:20,borrow:true}]),
   S('Nombor hilang','Missing numbers',['missing',{max:20}]),
   S('Masalah harian','Word problems',['story',{ops:['+','-'],max:100}])]},
 {t:T('Pecahan','Fractions'),st:[
   S('Kenal pecahan','Recognise fractions',['fracShade',{dens:[2,4]}]),
   S('Sebut pecahan','Say fractions',['fracWord',{dens:[2,4]}]),
   S('Banding pecahan','Compare fractions',['fracCmp',{dens:[4]}],['fracShade',{dens:[2,4]}])]},
 {t:T('Wang','Money'),st:[
   S('Kenal wang','Know our money',['coinVal',{notes:[1,5,10]}]),
   S('Kira syiling','Count coins',['money',{coins:[5,10,20,50],max:100,k:5,coinsOnly:1}]),
   S('Kira wang kertas','Count notes',['money',{notes:[1,5],max:1000,k:4}]),
   S('Tambah & tolak wang','Add & subtract money',['moneyStory',{ops:['+','-'],max:1000}],['moneyConv',{maxRM:1}])]},
 {t:T('Masa dan Waktu','Time'),st:[
   S('Waktu dalam sehari','Times of day',['period',{}]),
   S('Hari dalam seminggu','Days of the week',['day',{}]),
   S('Bulan dalam setahun','Months of the year',['month',{}]),
   S('Baca jam','Tell the time',['clock',{mode:'h'}])]},
 {t:T('Ukuran dan Sukatan','Measurement'),st:[
   S('Panjang','Length',['cmpLen',{}],['clips',{}]),
   S('Berat','Weight',['balance',{}]),
   S('Isi padu','Volume',['glass',{}])]},
 {t:T('Ruang','Space'),st:[
   S('Bentuk 3D','3D shapes',['shape3',{set:['cube','cuboid','cyl','cone','sph','pyr']}]),
   S('Bentuk 2D','2D shapes',['shape2',{set:['sq','re','tr','ci']}]),
   S('Sisi & bucu','Sides & vertices',['sides',{set:['sq','re','tr']}])]},
 {t:T('Pengurusan Data','Data Handling'),st:[
   S('Baca piktograf','Read pictographs',['picto',{units:[1],max:6}]),
   S('Banding data','Compare data',['picto',{units:[1],max:8}])]}
],
2:[
 {t:T('Nombor Bulat hingga 1000','Whole Numbers up to 1000'),st:[
   S('Sebut & tulis nombor','Read & write numbers',['word',{min:100,max:1000}]),
   S('Nilai tempat & digit','Place & digit value',['place',{min:101,max:999}]),
   S('Banding & susun','Compare & order',['cmpSym',{min:100,max:1000}],['extreme',{min:100,max:1000}],['order',{min:100,max:999}]),
   S('Pola nombor','Number patterns',['pattern',{max:1000,steps:[2,5,10,100],down:true}],['nextNum',{max:1000,steps:[1,10,100]}]),
   S('Bundar','Rounding',['round',{min:10,max:999,to:[10,100]}])]},
 {t:T('Operasi Asas','Basic Operations'),st:[
   S('Tambah hingga 1000','Add within 1000',['add',{min:100,max:1000}]),
   S('Tolak hingga 1000','Subtract within 1000',['sub',{min:100,max:1000}]),
   S('Darab: sifir 2, 5, 10','Times tables 2, 5, 10',['mul',{tables:[2,5,10]}]),
   S('Darab: sifir 3, 4','Times tables 3, 4',['mul',{tables:[3,4]}]),
   S('Bahagi','Division',['div',{tables:[2,3,4,5,10]}]),
   S('Masalah harian','Word problems',['story',{ops:['+','-','×','÷'],max:1000}])]},
 {t:T('Pecahan dan Perpuluhan','Fractions and Decimals'),st:[
   S('Pecahan wajar','Proper fractions',['fracShade',{dens:[2,3,4,5,6,8,10]}],['fracWord',{dens:[2,3,4,5,6,8,10]}]),
   S('Banding pecahan','Compare fractions',['fracCmp',{dens:[3,4,5,6,8,10],sameNum:1}]),
   S('Perpuluhan','Decimals',['decShade',{}]),
   S('Pecahan & perpuluhan','Fractions & decimals',['decFrac',{}])]},
 {t:T('Wang hingga RM100','Money up to RM100'),st:[
   S('Kira nilai wang','Count money',['money',{notes:[1,5,10,20,50],coins:[10,20,50],max:10000,k:5}]),
   S('Tukar RM & sen','RM & sen',['moneyConv',{maxRM:20,cents:1}]),
   S('Tambah & tolak wang','Add & subtract money',['moneyStory',{ops:['+','-'],max:10000,cents:1}]),
   S('Darab & bahagi wang','Multiply & divide money',['moneyStory',{ops:['×','÷'],max:10000}])]},
 {t:T('Masa dan Waktu','Time'),st:[
   S('Baca jam & minit','Hours & minutes',['clock',{mode:'5'}]),
   S('Tukar unit masa','Convert time units',['tconv',{n:4,max:5}]),
   S('Hari & bulan','Days & months',['mdays',{}],['month',{}]),
   S('Tempoh masa','Duration',['duration',{}])]},
 {t:T('Ukuran dan Sukatan','Measurement'),st:[
   S('Panjang (cm, m)','Length (cm, m)',['ruler',{max:12}],['uconv',{pairs:[['m','cm',100]],max:9}]),
   S('Jisim (g, kg)','Mass (g, kg)',['dial',{max:1000,step:100}],['uconv',{pairs:[['kg','g',1000]],max:9}]),
   S('Isi padu (ml, l)','Volume (ml, l)',['jug',{max:1000,step:100}],['uconv',{pairs:[['l','ml',1000]],max:9}]),
   S('Masalah harian','Word problems',['mstory',{kinds:['len','mass','vol'],max:500}])]},
 {t:T('Ruang','Space'),st:[
   S('Bentuk 3D','3D shapes',['shape3',{set:['cube','cuboid','cyl','cone','sph','pyr']}]),
   S('Sifat bentuk 3D','3D shape properties',['props3',{set:['cube','cuboid','cyl','cone','pyr']}]),
   S('Bentuk 2D','2D shapes',['shape2',{set:['sq','re','tr','ci']}],['sides',{set:['sq','re','tr']}])]},
 {t:T('Pengurusan Data','Data Handling'),st:[
   S('Piktograf','Pictographs',['picto',{units:[1],max:8}]),
   S('Piktograf (1 simbol = 2)','Pictographs (1 symbol = 2)',['picto',{units:[2],max:6}])]}
],
3:[
 {t:T('Nombor Bulat hingga 10 000','Whole Numbers up to 10 000'),st:[
   S('Sebut & tulis nombor','Read & write numbers',['word',{min:1000,max:10000}]),
   S('Nilai tempat & digit','Place & digit value',['place',{min:1001,max:9999}]),
   S('Banding & susun','Compare & order',['cmpSym',{min:1000,max:9999}],['extreme',{min:1000,max:9999}],['order',{min:1000,max:9999}]),
   S('Pola nombor','Number patterns',['pattern',{max:10000,steps:[5,10,100,1000],down:true}],['nextNum',{max:10000,steps:[10,100,1000]}]),
   S('Bundar','Rounding',['round',{min:100,max:9999,to:[10,100,1000]}])]},
 {t:T('Operasi Asas','Basic Operations'),st:[
   S('Tambah hingga 10 000','Add within 10 000',['add',{min:1000,max:10000}]),
   S('Tolak hingga 10 000','Subtract within 10 000',['sub',{min:1000,max:10000}]),
   S('Darab: sifir 6–9','Times tables 6–9',['mul',{tables:[6,7,8,9]}]),
   S('Darab nombor besar','Multiply bigger numbers',['mul',{big:1,lo:10,hi:999,max:9999}]),
   S('Bahagi','Division',['div',{tables:[6,7,8,9]}],['div',{big:1,lo:10,max:9999}]),
   S('Operasi bergabung','Mixed operations',['mix',{max:10000}],['story',{ops:['+','-','×','÷'],max:10000,tables:[6,7,8,9],big:1}])]},
 {t:T('Pecahan, Perpuluhan dan Peratus','Fractions, Decimals and Percentages'),st:[
   S('Pecahan setara','Equivalent fractions',['fracEq',{}],['fracOf',{dens:[2,3,4,5,10],k:6}]),
   S('Perpuluhan','Decimals',['decShade',{h:1}],['decFrac',{h:1}]),
   S('Peratus','Percentages',['pctShade',{}]),
   S('Tukar pecahan & peratus','Fractions & percentages',['pctConv',{}])]},
 {t:T('Wang hingga RM1000','Money up to RM1000'),st:[
   S('Kira nilai wang','Count money',['money',{notes:[5,10,20,50,100],coins:[10,20,50],max:100000,k:6}]),
   S('Tukar RM & sen','RM & sen',['moneyConv',{maxRM:500,cents:1}]),
   S('Tambah & tolak wang','Add & subtract money',['moneyStory',{ops:['+','-'],max:100000,cents:1}]),
   S('Darab, bahagi & simpanan','Multiply, divide & savings',['moneyStory',{ops:['×','÷'],max:100000}])]},
 {t:T('Masa dan Waktu','Time'),st:[
   S('Sistem 12 jam','12-hour system',['clock',{mode:'5',ampm:1}]),
   S('Tukar unit masa','Convert time units',['tconv',{n:5,max:9,mixed:1}]),
   S('Tempoh masa','Duration',['duration',{}])]},
 {t:T('Ukuran dan Sukatan','Measurement'),st:[
   S('Panjang (mm, cm, m)','Length (mm, cm, m)',['uconv',{pairs:[['cm','mm',10],['m','cm',100]],max:9,mixed:1}]),
   S('Jisim (g, kg)','Mass (g, kg)',['uconv',{pairs:[['kg','g',1000]],max:9,mixed:1}],['dial',{max:1000,step:100}]),
   S('Isi padu (ml, l)','Volume (ml, l)',['uconv',{pairs:[['l','ml',1000]],max:9,mixed:1}],['jug',{max:1000,step:100}]),
   S('Masalah harian','Word problems',['mstory',{kinds:['len','mass','vol'],min:100,max:5000}])]},
 {t:T('Ruang','Space'),st:[
   S('Poligon','Polygons',['shape2',{set:['tr','sq','pe','he','oc']}],['sides',{set:['tr','sq','pe','he','oc']}]),
   S('Bentuk 3D','3D shapes',['props3',{set:['cube','cuboid','cyl','cone','pyr']}],['shape3',{set:['cube','cuboid','cyl','cone','sph','pyr']}])]},
 {t:T('Koordinat, Nisbah dan Kadaran','Coordinates, Ratio and Proportion'),st:[
   S('Cari koordinat','Find coordinates',['coord',{mode:'find'}]),
   S('Objek di koordinat','Object at coordinates',['coord',{mode:'at'}]),
   S('Nisbah & kadaran','Ratio & proportion',['ratio',{}])]},
 {t:T('Pengurusan Data','Data Handling'),st:[
   S('Baca carta palang','Read bar charts',['bars',{step:5,max:50,axis:10}]),
   S('Tafsir data','Interpret data',['bars',{step:5,max:50,axis:10}],['picto',{units:[2,5],max:6}])]}
]};
const BAB={};for(const t of [1,2,3])CH[t].forEach((b,i)=>{b.id=`t${t}b${i+1}`;b.tahun=t;b.n=i+1;BAB[b.id]=b});
function genQ(stage){for(let k=0;k<6;k++){try{const [fn,p]=pick(stage.g),q=G[fn](p);if(q&&q.opts.length>=2&&q.ans>=0)return q}catch(e){if(typeof console!=='undefined')console.warn(e)}}return mc({q:T('Berapakah 2 + 2?','What is 2 + 2?'),eq:'2 + 2 = ?'},4,[3,5,6])}
