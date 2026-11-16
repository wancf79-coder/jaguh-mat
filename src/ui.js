/* ===== Jaguh Mat — antara muka ===== */
const CFG={url:'https://gqhvxplwxvbghkfzshdl.supabase.co',key:'sb_publishable_Qsrf4-BucGa5NYyfr8bm1Q_StVZEIm8'};
const REVIEW=true; // true = semua tahap, kuiz & bab terbuka (mod semakan). Tukar ke false sebelum dilancar.
const KEY='jaguhmat_v1',STAGE_Q=8,QUIZ_Q=10;
const TCOL={1:'#ff7a2f',2:'#0fa3a0',3:'#7c5cff'};
const NEGERI=['Johor','Kedah','Kelantan','Melaka','Negeri Sembilan','Pahang','Perak','Perlis','Pulau Pinang','Sabah','Sarawak','Selangor','Terengganu','W.P. Kuala Lumpur','W.P. Labuan','W.P. Putrajaya'];

let ST=load();
function def(){return{lang:'ms',sound:true,name:'',prog:{},hist:[],online:null,pending:[],openAll:false}}
function load(){try{return Object.assign(def(),JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){return def()}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(ST))}catch(e){}}
const tr=o=>o==null?'':typeof o==='object'?(o[ST.lang]??o.ms):String(o);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rich=o=>/^<svg/.test(tr(o))?tr(o):esc(tr(o)).replace(/(\d+)\/(\d+)/g,'<span class="fr"><b>$1</b><b>$2</b></span>');

const UI={
 tag:T('Matematik KSSR Tahun 1–3, bab demi bab.','KSSR Maths for Year 1–3, chapter by chapter.'),
 name:T('Siapa nama kamu?','What is your name?'),go:T('Mula','Start'),hi:T('Hai','Hi'),
 year:T('Tahun','Year'),chap:T('Bab','Chapter'),chaps:T('bab','chapters'),stage:T('Tahap','Stage'),
 board:T('Papan Skor','Scoreboard'),acct:T('Akaun Online','Online Account'),
 quiz:T('Kuiz Bab','Chapter Quiz'),best:T('Terbaik','Best'),locked:T('Berkunci','Locked'),
 q:T('Soalan','Question'),of:T('daripada','of'),score:T('Mata','Points'),
 right:T('Jawapan betul','Correct answer'),tapNext:T('Ketik untuk teruskan','Tap to continue'),
 again:T('Main lagi','Play again'),next:T('Tahap seterusnya','Next stage'),back:T('Kembali ke bab','Back to chapter'),
 fail:T('Hampir berjaya! Perlu 4 betul untuk buka tahap seterusnya.','Almost! You need 4 correct to unlock the next stage.'),
 quizOpen:T('Siapkan semua tahap untuk buka kuiz.','Finish all stages to unlock the quiz.'),
 openAll:T('Mod ulang kaji: buka semua bab','Revision mode: unlock all chapters'),
 me:T('Saya','Me'),online:T('Online','Online'),total:T('Jumlah mata','Total points'),stars:T('Bintang','Stars'),
 recent:T('Kuiz terkini','Recent quizzes'),none:T('Belum ada kuiz. Jom main!','No quizzes yet. Let\'s play!'),
 all:T('Semua','All'),week:T('Minggu ini','This week'),ever:T('Sepanjang masa','All time'),school:T('Sekolah saya','My school'),
 allBab:T('Semua bab','All chapters'),loading:T('Memuatkan…','Loading…'),empty:T('Belum ada pemain di sini. Jadilah yang pertama!','No players here yet. Be the first!'),
 offline:T('Papan skor online tidak dapat dicapai sekarang. Cuba lagi nanti.','The online scoreboard can’t be reached right now. Try again later.'),
 join:T('Daftar percuma untuk bersaing dengan murid lain di seluruh Malaysia.','Sign up free to compete with pupils across Malaysia.'),
 register:T('Daftar','Sign up'),login:T('Log masuk','Log in'),logout:T('Log keluar','Log out'),
 nick:T('Nama samaran (3–20 huruf)','Nickname (3–20 letters)'),pin:T('PIN 4–6 digit','4–6 digit PIN'),
 sekolah:T('Nama sekolah','School name'),negeri:T('Negeri','State'),saveP:T('Simpan','Save'),
 pinNote:T('Ingat PIN ini untuk log masuk di peranti lain. Jangan guna nama penuh sebenar.','Remember this PIN to log in on another device. Don’t use your real full name.'),
 sent:T('Skor dihantar ke papan skor online','Score sent to the online scoreboard'),rank:T('Kedudukan kamu','Your rank'),
 queued:T('Tiada talian — skor akan dihantar kemudian','Offline — score will be sent later'),
 myRank:T('Kedudukan saya','My rank'),players:T('pemain','players'),sound:T('Bunyi','Sound'),
 timeUp:T('Masa tamat!','Time’s up!'),streak:T('berturut','in a row'),
 E:{NICKNAME_TAKEN:T('Nama samaran ini sudah digunakan.','This nickname is taken.'),BAD_NICKNAME:T('Nama samaran mesti 3–20 huruf/nombor.','Nickname must be 3–20 letters/numbers.'),
  BAD_PIN:T('PIN salah atau tidak sah (4–6 digit).','Wrong or invalid PIN (4–6 digits).'),NOT_FOUND:T('Nama samaran tidak dijumpai.','Nickname not found.'),
  LOCKED:T('Terlalu banyak cubaan. Cuba lagi selepas 15 minit.','Too many tries. Try again in 15 minutes.'),BAD_TAHUN:T('Pilih tahun.','Pick a year.'),
  NET:T('Tidak dapat berhubung. Semak internet kamu.','Can’t connect. Check your internet.')}
};
const OKW=[T('Betul! Hebatnya!','Correct! Awesome!'),T('Betul! Pandai!','Right! So clever!'),T('Betul! Teruskan!','Correct! Keep going!'),T('Betul! Bagus sekali!','Correct! Well done!'),T('Betul! Kamu memang jaguh!','Correct! You’re a champ!'),T('Betul! Mantap!','Correct! Brilliant!')];
const BADW=[T('Alamak, salah!','Oops, not quite!'),T('Oooo salah la…','Ooh, that’s wrong…'),T('Emmm, salah. Takpe!','Hmm, wrong. That’s okay!'),T('Hampir! Cuba lagi nanti.','So close! Next time.')];

/* ---------- kemajuan ---------- */
const P=id=>ST.prog[id]||(ST.prog[id]={st:[],qb:0,qc:0,qs:0});
const starsOf=(ok,n)=>{const r=ok/n;return r>=.875?3:r>=.625?2:r>=.5?1:0};
const stageOpen=(id,i)=>REVIEW||i===0||(P(id).st[i-1]||0)>0;
const quizOpen=id=>REVIEW||BAB[id].st.every((_,i)=>(P(id).st[i]||0)>0);
const babDone=id=>(P(id).qs||0)>0;
const babOpen=id=>{const b=BAB[id];if(REVIEW||ST.openAll||b.n===1)return true;return babDone(`t${b.tahun}b${b.n-1}`)};
const babStars=id=>BAB[id].st.reduce((t,_,i)=>t+(P(id).st[i]||0),0)+(P(id).qs||0);
const babMax=id=>(BAB[id].st.length+1)*3;
const totalPts=()=>Object.values(ST.prog).reduce((t,p)=>t+(p.qb||0),0);
const totalStars=()=>Object.keys(BAB).reduce((t,id)=>t+(ST.prog[id]?babStars(id):0),0);
const starRow=(n,max=3)=>`<span class="stars" aria-label="${n}/${max}">${[...Array(max)].map((_,i)=>`<svg viewBox="0 0 32 32" class="${i<n?'on':''}"><use href="#i-star2"/></svg>`).join('')}</span>`;

/* ---------- bunyi ---------- */
let AC;
function beep(kind){if(!ST.sound)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();const N=kind==='ok'?[660,880]:[523,659,784,1047],t0=AC.currentTime;
  N.forEach((f,i)=>{const o=AC.createOscillator(),g=AC.createGain(),t=t0+i*.1;o.type='triangle';o.frequency.value=f;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.22,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+.28);o.connect(g).connect(AC.destination);o.start(t);o.stop(t+.3)})}catch(e){}}

/* ---------- suara (Gemini TTS melalui Supabase, cache) ---------- */
const DEN_EN={2:['half','halves'],3:['third','thirds'],4:['quarter','quarters'],5:['fifth','fifths'],6:['sixth','sixths'],7:['seventh','sevenths'],8:['eighth','eighths'],9:['ninth','ninths'],10:['tenth','tenths']};
const UNIT_MS={mm:'milimeter',cm:'sentimeter',m:'meter',kg:'kilogram',g:'gram',ml:'mililiter',l:'liter'};
const UNIT_EN={mm:'millimetres',cm:'centimetres',m:'metres',kg:'kilograms',g:'grams',ml:'millilitres',l:'litres'};
function sayText(q){
  const ms=ST.lang==='ms';let t=tr(q.q).replace(/\u00a0/g,'');
  if(/^[\d\s.]+$/.test(t))t=ms?'Bandingkan dua nombor ini.':'Compare these two numbers.';
  t=t.replace(/\s*\.\.\.\s*$/,ms?' apa?':' what?').replace(/\s*\.\.\.\s*/g,ms?' apa ':' what ');
  if(q.eq){let e=q.eq.replace(/\u00a0/g,'');
    if(/^\d+\s+\?\s+\d+$/.test(e))e=e.replace('?',ms?'dengan':'and');
    e=e.replace(/=\s*\?\s*$/,'=#').replace(/\?/g,ms?'berapa':'what').replace('=#',ms?' sama dengan berapa?':' equals what?').replace(/=/g,ms?' sama dengan ':' equals ');
    t+=' '+e}
  t=t.replace(/RM(\d+)\.(\d\d)/g,(m,a,b)=>a+' ringgit '+(+b)+' sen').replace(/RM(\d+)/g,'$1 ringgit');
  t=t.replace(/(\d+)\/(\d+)/g,(m,a,b)=>{a=+a;b=+b;if(ms)return wMs(a)+' per'+wMs(b);return DEN_EN[b]?(a===1?'one '+DEN_EN[b][0]:wEn(a)+' '+DEN_EN[b][1]):a+' over '+b});
  t=t.replace(/(\d|berapa|what)\s?(mm|cm|kg|ml|m|g|l)\b/g,(m,d,u)=>d+' '+(ms?UNIT_MS:UNIT_EN)[u]);
  t=t.replace(/\+/g,ms?' tambah ':' plus ').replace(/−/g,ms?' tolak ':' minus ').replace(/×/g,ms?' darab ':' times ').replace(/÷/g,ms?' bahagi ':' divided by ').replace(/%/g,ms?' peratus':' percent');
  t=t.replace(/(\d)\s*:\s*(\d+)\)/g,(m,a,b)=>a+(ms?' berbanding ':' to ')+b+')');
  if(ms)t=msNums(t);
  return t.replace(/\s+/g,' ').trim().slice(0,320);
}
function msNums(t){
  const W=n=>wMs(+n);
  return t.replace(/\bke-(\d+)/g,(m,n)=>+n===1?'pertama':'ke'+W(n))
   .replace(/(\d{1,2}):(\d\d)/g,(m,h,mm)=>'pukul '+W(h)+(+mm?' '+W(mm)+' minit':''))
   .replace(/(\d+)\.(\d+)/g,(m,a,b)=>W(a)+' perpuluhan '+b.split('').map(W).join(' '))
   .replace(/\d+/g,n=>W(n));
}
const TTSC=new Map();let curAudio=null,AUD=null,VSTAT='';
const SILENT='data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=';
function unlockAudio(){if(AUD)return;try{AUD=new Audio();AUD.src=SILENT;const p=AUD.play();if(p&&p.catch)p.catch(()=>{})}catch(e){}}
function setV(st){VSTAT=st;const b=document.querySelector('.say');if(b){b.classList.toggle('busy',st==='load');b.classList.toggle('off',st==='err'||st==='quota')}const n=document.getElementById('vnote');if(n){n.hidden=!(st==='err'||st==='quota');n.textContent=tr(st==='quota'?T('Suara cikgu sedang berehat sekejap. Cuba tekan 🔊 sebentar lagi.','The teacher’s voice is taking a short break. Try 🔊 again soon.'):T('Suara tidak dapat dimuatkan. Semak sambungan internet.','Voice can’t load. Check your internet connection.'))}}
function ttsUrl(text,v){const k=v+ST.lang+text;if(TTSC.has(k))return TTSC.get(k);
  const p=fetch(CFG.url+'/functions/v1/tts',{method:'POST',headers:{'Content-Type':'application/json',apikey:CFG.key},body:JSON.stringify({text,lang:ST.lang,v})})
    .then(async r=>{if(r.ok)return(await r.json()).url;const j=await r.json().catch(()=>({}));throw new Error(/429|quota|no_key/i.test(j.error||'')?'QUOTA':'NET')});TTSC.set(k,p);p.catch(()=>TTSC.delete(k));return p}
function stopVoice(){if(curAudio){try{curAudio.pause()}catch(e){}curAudio=null}}
function speakView(){const vi=V.view??V.i;if(vi===V.i&&V.picked==null)return speakQ(vi);const q=V.qs[vi];ttsUrl(sayText(q),vi%2?'m':'f').then(u=>{stopVoice();curAudio=AUD||new Audio();curAudio.src=u;const p=curAudio.play();if(p&&p.catch)p.catch(()=>{})}).catch(()=>setV('err'))}
function speakQ(i){if(!ST.sound||!CFG.url)return;const q=V.qs[i],v=i%2?'m':'f';
  setV('load');
  ttsUrl(sayText(q),v).then(u=>{if(V.v!=='play'||V.i!==i||V.picked!=null)return;stopVoice();setV('');curAudio=AUD||new Audio();curAudio.src=u;const p=curAudio.play();if(p&&p.catch)p.catch(()=>setV('tap'))}).catch(e=>{if(V.v==='play'&&V.i===i)setV(e&&e.message==='QUOTA'?'quota':'err')});
  prefetch(i+1,1)}
function prefetch(from,k){if(!ST.sound||!CFG.url||!V.qs)return;for(let j=from;j<from+k&&j<V.qs.length;j++)ttsUrl(sayText(V.qs[j]),j%2?'m':'f').catch(()=>{})}

/* ---------- online ---------- */
async function rpc(fn,args){
  if(!CFG.url)throw new Error('NET');
  const h={'Content-Type':'application/json',apikey:CFG.key};if(!CFG.key.startsWith('sb_'))h.Authorization='Bearer '+CFG.key;
  let r;try{r=await fetch(CFG.url+'/rest/v1/rpc/'+fn,{method:'POST',headers:h,body:JSON.stringify(args)})}catch(e){throw new Error('NET')}
  const j=await r.json().catch(()=>null);if(!r.ok)throw new Error((j&&j.message)||'NET');return j;
}
const errMsg=e=>tr(UI.E[e.message]||UI.E.NET);
async function submitScore(rec){
  return rpc('mk_submit_score',{p_token:ST.online.token,p_bab_id:rec.id,p_score:rec.score,p_correct:rec.ok,p_total:rec.n,p_duration_ms:rec.ms});
}
async function flushPending(){
  if(!ST.online||!ST.pending.length)return;const left=[];
  for(const rec of ST.pending){try{await submitScore(rec);await new Promise(r=>setTimeout(r,21000))}catch(e){if(e.message==='NET'||e.message==='TOO_FAST')left.push(rec)}}
  ST.pending=left;save();
}

/* ---------- navigasi ---------- */
const app=document.getElementById('app');
let V={v:'home'},timer=null,tok=0;
function go(v,p){stopTimer();stopVoice();V=Object.assign({v},p||{});render();window.scrollTo(0,0)}
function stopTimer(){if(timer){clearInterval(timer);timer=null}}
function render(){app.innerHTML=bar()+(VIEWS[V.v]||VIEWS.home)();const f=app.querySelector('[autofocus]');if(f&&V.v!=='play')f.focus();if(V.after){const a=V.after;V.after=null;a()}if(V.v==='play'){if(VSTAT==='err'||VSTAT==='quota')setV(VSTAT)}if(V.v==='play'&&V.picked==null&&V.view===V.i&&V.saidI!==V.i){if(V.i===0)prefetch(1,1);V.saidI=V.i;VSTAT='';speakQ(V.i)}}
function bar(){
  const back=V.v==='home'?'':`<button class="ic" data-a="back" aria-label="Back"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></button>`;
  return `<header class="top">${back}<button class="brand" data-a="home"><svg viewBox="0 0 40 40"><use href="#i-logo"/></svg><span>Jaguh Mat</span></button>
  <div class="tools"><button class="ic" data-a="sound" aria-label="${tr(UI.sound)}"><svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/>${ST.sound?'<path d="M16 8a5 5 0 010 8M18.5 5.5a9 9 0 010 13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>':'<path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'}</svg></button>
  <div class="lang" role="group"><button data-a="lang" data-l="ms" class="${ST.lang==='ms'?'on':''}">BM</button><button data-a="lang" data-l="en" class="${ST.lang==='en'?'on':''}">EN</button></div></div></header>`;
}
function backOf(){const v=V.v;if(v==='year'||v==='board'||v==='acct')return['home'];if(v==='bab')return['year',{t:BAB[V.id].tahun}];if(v==='play'||v==='result')return['bab',{id:V.id}];return['home']}

/* ---------- paparan ---------- */
const VIEWS={
home(){
  const yrs=[1,2,3].map(t=>{const ids=CH[t].map(b=>b.id),got=ids.reduce((s,id)=>s+(ST.prog[id]?babStars(id):0),0),max=ids.reduce((s,id)=>s+babMax(id),0),pct=Math.round(100*got/max);
    return `<button class="yr" style="--c:${TCOL[t]}" data-a="year" data-t="${t}"><span class="yn">${t}</span><span class="yt"><b>${tr(UI.year)} ${t}</b><small>${CH[t].length} ${tr(UI.chaps)}</small></span><span class="meter"><i style="width:${pct}%"></i></span><span class="pc">${pct}%</span></button>`}).join('');
  const who=ST.name?`<div class="hello"><div><b>${tr(UI.hi)}, ${esc(ST.name)}!</b><small>${fmtN(totalPts())} ${tr(UI.score).toLowerCase()} · ${totalStars()} ★</small></div><button class="link" data-a="rename">✎</button></div>`
    :`<form class="namef" data-f="name"><label for="nm">${tr(UI.name)}</label><div class="row"><input id="nm" maxlength="20" autocomplete="off" autofocus><button class="btn">${tr(UI.go)}</button></div></form>`;
  return `<main class="wrap"><section class="hero"><div class="ht"><h1>Jaguh Mat</h1><p>${tr(UI.tag)}</p></div><svg class="hpic" viewBox="0 0 260 170"><use href="#i-hero"/></svg></section>${who}
  <section class="yrs">${yrs}</section><div class="duo"><button class="btn big alt" data-a="board">${tr(UI.board)}</button><button class="btn big ghost" data-a="acct">${ST.online?esc(ST.online.nickname):tr(UI.acct)}</button></div></main>`;
},
year(){
  const t=V.t,list=CH[t].map(b=>{const open=babOpen(b.id),p=P(b.id);
    return `<button class="bab ${open?'':'lock'}" style="--c:${TCOL[t]}" data-a="${open?'bab':'none'}" data-id="${b.id}" ${open?'':'aria-disabled="true"'}><span class="bn"><small>${tr(UI.chap)}</small>${b.n}</span><span class="bt"><b>${rich(b.t)}</b><small>${open?`${babStars(b.id)}/${babMax(b.id)} ★${p.qb?` · ${tr(UI.best)} ${fmtN(p.qb)}`:''}`:tr(UI.locked)}</small></span>${open?'':'<svg class="lk" viewBox="0 0 24 24"><use href="#i-lock"/></svg>'}</button>`}).join('');
  return `<main class="wrap"><h2 class="ttl" style="--c:${TCOL[t]}">${tr(UI.year)} ${t}</h2><div class="babs">${list}</div>
  <label class="tog"><input type="checkbox" data-a="openAll" ${ST.openAll?'checked':''}> ${tr(UI.openAll)}</label></main>`;
},
bab(){
  const b=BAB[V.id],p=P(b.id),c=TCOL[b.tahun];
  const nodes=b.st.map((s,i)=>{const open=stageOpen(b.id,i),st=p.st[i]||0;
    return `<li class="${open?'':'lock'} ${st?'done':''}"><button data-a="${open?'play':'none'}" data-s="${i}" ${open?'':'aria-disabled="true"'}><span class="dot">${open?i+1:'<svg viewBox="0 0 24 24"><use href="#i-lock"/></svg>'}</span><span class="sl"><small>${tr(UI.stage)} ${i+1}</small><b>${rich(s.t)}</b></span>${starRow(st)}</button></li>`}).join('');
  const qo=quizOpen(b.id);
  return `<main class="wrap" style="--c:${c}"><p class="crumb">${tr(UI.year)} ${b.tahun} · ${tr(UI.chap)} ${b.n}</p><h2 class="ttl">${rich(b.t)}</h2>
  <ol class="path">${nodes}<li class="quiz ${qo?'':'lock'}"><button data-a="${qo?'quiz':'none'}" ${qo?'':'aria-disabled="true"'}><span class="dot"><svg viewBox="0 0 32 32"><use href="#i-trophy"/></svg></span><span class="sl"><small>${QUIZ_Q} ${tr(UI.q).toLowerCase()}</small><b>${tr(UI.quiz)}</b>${p.qb?`<small>${tr(UI.best)}: ${fmtN(p.qb)} ${tr(UI.score).toLowerCase()} · ${p.qc}/${QUIZ_Q}</small>`:qo?'':`<small>${tr(UI.quizOpen)}</small>`}</span>${starRow(p.qs||0)}</button></li></ol></main>`;
},
play(){
  const quiz=V.mode==='quiz',vi=V.view??V.i,past=vi<V.i,q=V.qs[vi],rec=V.rec[vi],done=!!rec;
  const opts=q.opts.map((o,k)=>{let cl='';if(done){if(k===q.ans)cl='ok';else if(k===rec.picked)cl='no';else cl='dim'}
    return `<button class="opt ${cl}" data-a="ans" data-k="${k}" ${done?'tabindex="-1" aria-disabled="true"':''}>${rich(o)}</button>`}).join('');
  const fb=done?`<div class="fb ${rec.right?'good':'bad'}" role="status"><div><b>${past?tr(rec.right?T('Kamu jawab betul','You got this right'):T('Kamu jawab salah','You got this wrong')):rec.picked===-1?tr(UI.timeUp):tr(rec.fb)}</b>${rec.right?(quiz&&!past?`<span>+${rec.last} ${tr(UI.score).toLowerCase()}</span>`:''):`<span>${tr(UI.right)}: <strong>${rich(q.opts[q.ans])}</strong></span>`}</div>
    <button class="nx" data-a="next" aria-label="${tr(T('Seterusnya','Next'))}"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg></button></div>`:'';
  const B=BAB[V.id],crumb=`<p class="pcrumb">${tr(UI.year)} ${B.tahun} · ${tr(UI.chap)} ${B.n}: ${rich(B.t)}<br><b>${quiz?tr(UI.quiz):`${tr(UI.stage)} ${V.s+1}: ${rich(B.st[V.s].t)}`}</b></p>`;
  const canBack=vi>0&&(!quiz||V.rec[V.i]),canFwd=done;
  const arrow=(a,ok,d,lbl)=>`<button class="arw" data-a="${ok?a:'none'}" ${ok?'':'disabled'} aria-label="${lbl}"><svg viewBox="0 0 24 24"><path d="${d}" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></button>`;
  const head=crumb+`<div class="ph">${arrow('prev',canBack,'M15 5l-7 7 7 7',tr(T('Soalan sebelum','Previous question')))}<span class="pq">${tr(UI.q)} ${vi+1}/${V.qs.length}${past?` <em>${tr(T('ulang lihat','review'))}</em>`:''}</span>${quiz?`<span class="pts">${fmtN(V.score)}</span>`:`<span class="pts">${V.ok} ✓</span>`}${arrow('next',canFwd,'M9 5l7 7-7 7',tr(T('Seterusnya','Next')))}</div>
  <div class="prog"><i style="width:${100*(V.i+(V.rec[V.i]?1:0))/V.qs.length}%"></i></div>${quiz&&!past&&!done?`<div class="timer"><i id="tb" style="width:${100*V.left/V.tl}%"></i></div>`:''}`;
  return `<main class="wrap play ${past?'past':''}" style="--c:${TCOL[BAB[V.id].tahun]}">${head}<section class="card"><div class="qrow"><p class="qt">${rich(q.q)}</p>${ST.sound?`<button class="say ${VSTAT==='load'&&!past?'busy':''}" data-a="say" aria-label="${tr(T('Dengar soalan','Listen'))}"><svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8a5 5 0 010 8M18.5 5.5a9 9 0 010 13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>`:''}</div>${q.eq?`<p class="eq">${rich(q.eq)}</p>`:''}${q.vis?`<div class="vbox">${tr(q.vis)}</div>`:''}${ST.sound?`<p class="vnote" id="vnote" hidden></p>`:''}</section>
  <div class="opts ${q.opts.some(o=>!/^<svg/.test(tr(o))&&tr(o).length>14)?'wide':''} ${q.opts.some(o=>/^<svg/.test(tr(o)))?'pics':''}">${opts}</div>${fb}</main>`;
},
result(){
  const r=V.r,quiz=r.mode==='quiz',b=BAB[r.id],nextOk=!quiz&&r.stars>0&&r.s<b.st.length-1;
  let onl='';if(quiz){if(r.net==='sending')onl=`<p class="note">${tr(UI.loading)}</p>`;else if(r.net&&r.net.rank)onl=`<p class="note ok">${tr(UI.sent)} · ${tr(UI.rank)}: <b>#${r.net.rank}</b> / ${r.net.players}</p>`;else if(r.net==='queued')onl=`<p class="note">${tr(UI.queued)}</p>`;
    else if(!ST.online)onl=`<p class="note">${tr(UI.join)} <button class="link" data-a="acct">${tr(UI.register)}</button></p>`}
  const msg=r.stars===3?T('Cemerlang!','Excellent!'):r.stars===2?T('Bagus!','Great job!'):r.stars===1?T('Lulus!','You passed!'):T('Cuba lagi!','Try again!');
  return `<main class="wrap res" style="--c:${TCOL[b.tahun]}"><section class="card center"><div class="bigstars">${starRow(r.stars)}</div><h2>${tr(msg)}</h2>
  <p class="sc"><b>${r.ok}</b>/${r.n} ${tr(T('betul','correct'))}</p>${quiz?`<p class="pts big">${fmtN(r.score)} ${tr(UI.score).toLowerCase()}${r.newBest?` <em>${tr(T('Rekod baru!','New best!'))}</em>`:''}</p>`:''}
  ${!quiz&&r.stars===0?`<p class="note">${tr(UI.fail)}</p>`:''}${onl}</section>
  <div class="duo">${nextOk?`<button class="btn big" data-a="play" data-s="${r.s+1}">${tr(UI.next)}</button>`:''}${!quiz&&r.s===b.st.length-1&&quizOpen(b.id)?`<button class="btn big" data-a="quiz">${tr(UI.quiz)}</button>`:''}
  <button class="btn big alt" data-a="${quiz?'quiz':'play'}" data-s="${r.s}">${tr(UI.again)}</button><button class="btn big ghost" data-a="bab" data-id="${r.id}">${tr(UI.back)}</button></div></main>`;
},
board(){
  const tab=V.tab||'me';const tabs=`<div class="tabs"><button data-a="tab" data-t="me" class="${tab==='me'?'on':''}">${tr(UI.me)}</button><button data-a="tab" data-t="online" class="${tab==='online'?'on':''}">${tr(UI.online)}</button></div>`;
  if(tab==='me'){
    const yrs=[1,2,3].map(t=>`<h3 style="--c:${TCOL[t]}">${tr(UI.year)} ${t}</h3><table class="tbl"><tbody>${CH[t].map(b=>{const p=ST.prog[b.id];return `<tr><td>${b.n}. ${rich(b.t)}</td><td class="r">${p&&p.qb?fmtN(p.qb):'–'}</td><td class="r s">${p?babStars(b.id):0}/${babMax(b.id)} ★</td></tr>`}).join('')}</tbody></table>`).join('');
    const h=ST.hist.slice(0,10).map(x=>`<li><span>${tr(UI.year)} ${BAB[x.id].tahun} · ${rich(BAB[x.id].t)}</span><b>${fmtN(x.score)}</b><small>${x.ok}/${x.n} · ${new Date(x.at).toLocaleDateString(ST.lang==='ms'?'ms-MY':'en-MY')}</small></li>`).join('');
    return `<main class="wrap"><h2 class="ttl">${tr(UI.board)}</h2>${tabs}<div class="kpis"><div><b>${fmtN(totalPts())}</b><small>${tr(UI.total)}</small></div><div><b>${totalStars()}</b><small>${tr(UI.stars)}</small></div><div><b>${ST.hist.length}</b><small>${tr(T('Kuiz dijawab','Quizzes taken'))}</small></div></div>
    <h3>${tr(UI.recent)}</h3>${h?`<ul class="hist">${h}</ul>`:`<p class="note">${tr(UI.none)}</p>`}${yrs}</main>`;
  }
  const f=V.f||(V.f={tahun:ST.online?String(ST.online.tahun):'',bab:'',period:'week',mine:false});
  const babOpts=f.tahun?CH[+f.tahun].map(b=>`<option value="${b.id}" ${f.bab===b.id?'selected':''}>${b.n}. ${esc(tr(b.t))}</option>`).join(''):'';
  const filters=`<div class="filters"><select data-a="flt" data-k="tahun"><option value="">${tr(UI.all)}</option>${[1,2,3].map(t=>`<option value="${t}" ${f.tahun==t?'selected':''}>${tr(UI.year)} ${t}</option>`).join('')}</select>
    <select data-a="flt" data-k="bab" ${f.tahun?'':'disabled'}><option value="">${tr(UI.allBab)}</option>${babOpts}</select>
    <div class="seg"><button data-a="per" data-p="week" class="${f.period==='week'?'on':''}">${tr(UI.week)}</button><button data-a="per" data-p="all" class="${f.period==='all'?'on':''}">${tr(UI.ever)}</button></div>
    ${ST.online&&ST.online.sekolah?`<label class="tog"><input type="checkbox" data-a="mine" ${f.mine?'checked':''}> ${tr(UI.school)}</label>`:''}</div>`;
  let body;
  if(V.lb==='loading'||!V.lb)body=`<p class="note">${tr(UI.loading)}</p>`;
  else if(V.lb==='err')body=`<p class="note">${tr(UI.offline)}</p>`;
  else if(!V.lb.length)body=`<p class="note">${tr(UI.empty)}</p>`;
  else body=`<ol class="lb">${V.lb.map(r=>`<li class="${ST.online&&r.nickname===ST.online.nickname?'me':''} ${r.rank<=3?'top'+r.rank:''}"><span class="rk">${r.rank}</span><span class="who"><b>${esc(r.nickname)}</b><small>${esc(r.sekolah||'')}${r.negeri?' · '+esc(r.negeri):''} · ${tr(UI.year)} ${r.tahun}</small></span><span class="pt">${fmtN(r.points)}</span></li>`).join('')}</ol>`;
  const mine=V.my&&V.my.rank?`<div class="myrank">${tr(UI.myRank)}: <b>#${V.my.rank}</b> / ${V.my.players} ${tr(UI.players)} · ${fmtN(V.my.points)} ${tr(UI.score).toLowerCase()}</div>`:'';
  const cta=ST.online?'':`<div class="cta"><p>${tr(UI.join)}</p><button class="btn" data-a="acct">${tr(UI.register)}</button></div>`;
  if(!V.lb)V.after=loadLB;
  return `<main class="wrap"><h2 class="ttl">${tr(UI.board)}</h2>${tabs}${filters}${mine}${body}${cta}</main>`;
},
acct(){
  if(ST.online){const o=ST.online;
    return `<main class="wrap"><h2 class="ttl">${tr(UI.acct)}</h2><section class="card"><p class="who1"><b>${esc(o.nickname)}</b></p>
    <form class="form" data-f="prof"><label>${tr(UI.year)}<select id="f_t">${[1,2,3].map(t=>`<option value="${t}" ${o.tahun==t?'selected':''}>${tr(UI.year)} ${t}</option>`).join('')}</select></label>
    <label>${tr(UI.sekolah)}<input id="f_s" maxlength="60" value="${esc(o.sekolah||'')}"></label><label>${tr(UI.negeri)}<select id="f_n"><option value=""></option>${NEGERI.map(n=>`<option ${o.negeri===n?'selected':''}>${n}</option>`).join('')}</select></label>
    <p class="err" id="err">${V.err||''}</p><button class="btn">${tr(UI.saveP)}</button></form><button class="link" data-a="logout">${tr(UI.logout)}</button></section></main>`}
  const mode=V.mode||'reg';
  const tabs=`<div class="tabs"><button data-a="am" data-m="reg" class="${mode==='reg'?'on':''}">${tr(UI.register)}</button><button data-a="am" data-m="login" class="${mode==='login'?'on':''}">${tr(UI.login)}</button></div>`;
  const reg=`<form class="form" data-f="reg"><label>${tr(UI.nick)}<input id="f_k" maxlength="20" autocomplete="off" value="${esc(V.nk||ST.name||'')}" required></label>
    <label>${tr(UI.pin)}<input id="f_p" inputmode="numeric" pattern="[0-9]*" maxlength="6" autocomplete="off" required></label>
    <label>${tr(UI.year)}<select id="f_t"><option value=""></option>${[1,2,3].map(t=>`<option value="${t}">${tr(UI.year)} ${t}</option>`).join('')}</select></label>
    <label>${tr(UI.sekolah)}<input id="f_s" maxlength="60" placeholder="SK …"></label><label>${tr(UI.negeri)}<select id="f_n"><option value=""></option>${NEGERI.map(n=>`<option>${n}</option>`).join('')}</select></label>
    <p class="hint">${tr(UI.pinNote)}</p><p class="err" id="err">${V.err||''}</p><button class="btn big">${tr(UI.register)}</button></form>`;
  const log=`<form class="form" data-f="login"><label>${tr(UI.nick)}<input id="f_k" maxlength="20" autocomplete="off" required></label><label>${tr(UI.pin)}<input id="f_p" inputmode="numeric" pattern="[0-9]*" maxlength="6" autocomplete="off" required></label><p class="err" id="err">${V.err||''}</p><button class="btn big">${tr(UI.login)}</button></form>`;
  return `<main class="wrap"><h2 class="ttl">${tr(UI.acct)}</h2><p class="note">${tr(UI.join)}</p>${tabs}<section class="card">${mode==='reg'?reg:log}</section></main>`;
}};

/* ---------- permainan ---------- */
function makeSet(gens,n){
  const out=[],seen=new Set(),ansN={},sig=new Set();
  const ak=q=>q.ak||okey(q.opts[q.ans]),vk=q=>okey(q.q)+'|'+(typeof q.vis==='string'?q.vis.replace(/fill="#[0-9a-f]+"/g,''):'')+(q.ak?'pic':'');
  for(let k=0;out.length<n&&k<n*40;k++){
    const q=genQ(gens(out.length)),key=okey(q.q)+q.eq+q.opts.map(okey).join();if(seen.has(key))continue;
    const a=ak(q),used=ansN[a]||0,strict=k<n*25;
    if(used&&(strict||used>=2||sig.has(a+vk(q))))continue;
    seen.add(key);sig.add(a+vk(q));ansN[a]=used+1;out.push(q)}
  while(out.length<n)out.push(genQ(gens(out.length)));return out}
function startStage(id,s){const b=BAB[id];go('play',{id,s,mode:'stage',qs:makeSet(()=>b.st[s],STAGE_Q),i:0,view:0,rec:[],ok:0,score:0,streak:0,picked:null,t0:Date.now()})}
function startQuiz(id){const b=BAB[id],order=shuf([...b.st.keys()]);const tl=(b.tahun===1?30:25)*1000;
  go('play',{id,s:-1,mode:'quiz',qs:makeSet(i=>b.st[order[i%order.length]],QUIZ_Q),i:0,view:0,rec:[],ok:0,score:0,streak:0,picked:null,tl,left:tl,t0:Date.now(),after:startTimer})}
function startTimer(){stopTimer();const t=++tok;let last=Date.now();timer=setInterval(()=>{if(t!==tok)return;const now=Date.now();V.left-=now-last;last=now;const el=document.getElementById('tb');if(el)el.style.width=Math.max(0,100*V.left/V.tl)+'%';if(V.left<=0){stopTimer();answer(-1)}},100)}
function answer(k){
  if(V.v!=='play'||V.picked!=null||V.view!==V.i)return;stopTimer();stopVoice();const q=V.qs[V.i],ok=k===q.ans;V.picked=k;V.right=ok;let last=0;
  if(ok){V.ok++;V.streak++;if(V.mode==='quiz'){last=100+Math.round(50*Math.max(0,V.left)/V.tl)+Math.min(50,10*(V.streak-1));V.score+=last}beep('ok')}else V.streak=0;
  V.rec[V.i]={picked:k,right:ok,fb:pick(ok?OKW:BADW),last};render();
}
function next(){if(V.v!=='play')return;stopVoice();
  if(V.view<V.i){V.view++;return render()}
  if(V.picked==null)return;tok++;V.i++;V.view=V.i;V.picked=null;if(V.i>=V.qs.length)return finish();if(V.mode==='quiz'){V.left=V.tl;V.after=startTimer}render()}
function prev(){if(V.v!=='play'||V.view<=0)return;if(V.mode==='quiz'&&!V.rec[V.i])return;stopVoice();V.view--;render()}
function finish(){
  const n=V.qs.length,stars=starsOf(V.ok,n),p=P(V.id),r={id:V.id,s:V.s,mode:V.mode,ok:V.ok,n,stars,score:V.score};
  if(V.mode==='stage'){p.st[V.s]=Math.max(p.st[V.s]||0,stars)}
  else{r.newBest=V.score>(p.qb||0);if(r.newBest){p.qb=V.score;p.qc=V.ok}p.qs=Math.max(p.qs||0,stars);
    const rec={id:V.id,score:V.score,ok:V.ok,n,ms:Date.now()-V.t0,at:Date.now()};ST.hist.unshift(rec);ST.hist=ST.hist.slice(0,50);
    if(ST.online){r.net='sending';submitScore(rec).then(j=>{r.net=j||{};if(V.v==='result'&&V.r===r)render()}).catch(e=>{if(e.message==='NET'||e.message==='TOO_FAST'){ST.pending.push(rec);save();r.net='queued'}else r.net=null;if(V.v==='result'&&V.r===r)render()})}}
  save();if(stars>0)beep('win');go('result',{id:V.id,r});
}
async function loadLB(){
  const f=V.f,a={p_tahun:f.tahun?+f.tahun:null,p_bab_id:f.bab||null,p_period:f.period,p_sekolah:f.mine&&ST.online?ST.online.sekolah:null};const stamp=++tok;
  V.lb='loading';V.my=null;
  try{const [lb,my]=await Promise.all([rpc('mk_leaderboard',Object.assign({p_limit:50},a)),ST.online?rpc('mk_my_rank',Object.assign({p_token:ST.online.token},a)):null]);if(stamp!==tok||V.v!=='board')return;V.lb=lb||[];V.my=my}
  catch(e){if(stamp!==tok||V.v!=='board')return;V.lb='err'}render();
}

/* ---------- acara ---------- */
const ACT={
 home:()=>go('home'),back:()=>{const [v,p]=backOf();go(v,p)},none:()=>{},
 lang:d=>{ST.lang=d.l;save();stopVoice();V.saidI=null;document.documentElement.lang=d.l==='ms'?'ms':'en';const keep=V.after;render()},
 sound:()=>{ST.sound=!ST.sound;save();if(!ST.sound)stopVoice();V.saidI=V.i;render()},
 rename:()=>{ST.name='';save();render()},
 year:d=>go('year',{t:+d.t}),bab:d=>go('bab',{id:d.id}),
 play:d=>startStage(V.id||V.r.id,+d.s),quiz:()=>startQuiz(V.id||V.r.id),
 ans:d=>answer(+d.k),say:()=>{if(V.v==='play')speakView()},next:()=>next(),prev:()=>prev(),
 board:()=>go('board',{tab:'me'}),tab:d=>{V.tab=d.t;V.lb=null;render()},
 per:d=>{V.f.period=d.p;V.lb=null;render()},
 acct:()=>go('acct',{mode:'reg'}),am:d=>{V.mode=d.m;V.err='';render()},
 logout:()=>{ST.online=null;save();go('acct',{mode:'login'})}
};
app.addEventListener('click',e=>{unlockAudio();const b=e.target.closest('[data-a]');if(!b||b.tagName==='SELECT'||(b.tagName==='INPUT'))return;const f=ACT[b.dataset.a];if(f){e.preventDefault();f(b.dataset)}});
app.addEventListener('change',e=>{const el=e.target,a=el.dataset.a;
  if(a==='openAll'){ST.openAll=el.checked;save();render()}
  else if(a==='flt'){V.f[el.dataset.k]=el.value;if(el.dataset.k==='tahun')V.f.bab='';V.lb=null;render()}
  else if(a==='mine'){V.f.mine=el.checked;V.lb=null;render()}});
app.addEventListener('submit',async e=>{e.preventDefault();const f=e.target.dataset.f,$=id=>{const x=document.getElementById(id);return x?x.value.trim():''};
  if(f==='name'){const n=$('nm');if(n){ST.name=n.slice(0,20);save();render()}return}
  const btn=e.target.querySelector('button.btn');if(btn)btn.disabled=true;const err=document.getElementById('err');
  try{let o;
    if(f==='reg'){if(!$('f_t'))throw new Error('BAD_TAHUN');o=await rpc('mk_register',{p_nickname:$('f_k'),p_tahun:+$('f_t'),p_sekolah:$('f_s'),p_negeri:$('f_n'),p_pin:$('f_p')})}
    else if(f==='login')o=await rpc('mk_login',{p_nickname:$('f_k'),p_pin:$('f_p')});
    else if(f==='prof')o=await rpc('mk_update_profile',{p_token:ST.online.token,p_tahun:+$('f_t'),p_sekolah:$('f_s'),p_negeri:$('f_n')});
    ST.online=o;if(!ST.name)ST.name=o.nickname;save();flushPending();go('board',{tab:'online'});
  }catch(x){if(err)err.textContent=errMsg(x);if(btn)btn.disabled=false}});
document.addEventListener('keydown',e=>{if(V.v!=='play')return;if(e.key==='ArrowLeft'){prev();return}if(e.key==='ArrowRight'||((e.key==='Enter'||e.key===' ')&&V.rec[V.view??V.i])){e.preventDefault();next();return}if(V.picked==null&&V.view===V.i&&/^[1-4]$/.test(e.key)){const k=+e.key-1;if(k<V.qs[V.i].opts.length)answer(k)}});
document.documentElement.lang=ST.lang==='ms'?'ms':'en';
render();setTimeout(flushPending,3000);
