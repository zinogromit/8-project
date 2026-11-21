/* ICON CAFE presentation demo. All records live in this browser; no server is used. */
(() => {
  'use strict';
  const page = document.body.dataset.page;
  const base = page === 'home' ? './' : '../';
  const app = document.querySelector('#app');
  const STORE = 'icon-cafe-demo-v1';
  const CLAIM = 'icon-cafe-demo-claim';
  const ROLE = 'icon-cafe-demo-role';
  const CAMPUS_ADDRESS = '경기도 의왕시 계원대학로 66';
  const CAMPUS_PLACE = '계원예술대학교 평생교육원 구내카페';
  const CAMPUS_MAP = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('계원예술대학교 평생교육원');
  // The university lifelong education center's official directions page embeds this map.
  const CAMPUS_EMBED = 'https://www.google.com/maps/embed?pb=%211m18%211m12%211m3%211d1703.9225516849615%212d126.98076589099851%213d37.378910216537584%212m3%211f0%212f0%213f0%213m2%211i1024%212i768%214f13.1%213m3%211m2%211s0x357b5e71e9b05935%3A0x8f88360c4a0095d0%212z6rOE7JuQ7JiI7Iig64yA7ZWZ6rWQIO2PieyDneq1kOycoeybkA%215e0%213m2%211sko%212skr%214v1709874066870%215m2%211sko%212skr';
  const won = n => new Intl.NumberFormat('ko-KR').format(Number(n) || 0) + '원';
  const date = value => value ? new Intl.DateTimeFormat('ko-KR', {dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Seoul'}).format(new Date(value)) : '—';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const id = () => crypto.randomUUID ? crypto.randomUUID() : [...crypto.getRandomValues(new Uint8Array(16))].map(x=>x.toString(16).padStart(2,'0')).join('');
  const code = () => 'IC' + [...crypto.getRandomValues(new Uint8Array(9))].map(x=>'0123456789ABCDEFGHJKLMNPQRSTUVWXYZ'[x % 34]).join('');
  const asset = name => base + 'assets/' + name;
  const seed = () => ({
    menus: [
      {id:'cake',category:'signature',name:'제주 구좌 유기농 당근케이크',description:'당근과 과일의 달콤함을 담은 시그니처 디저트',price:7500,image:'carrot-cake-v2.jpg',soldOut:false,visible:true},
      {id:'americano',category:'coffee',name:'아메리카노',description:'깊고 깔끔한 에스프레소의 균형',price:4500,image:'americano.jpg',soldOut:false,visible:true},
      {id:'latte',category:'coffee',name:'카페라떼',description:'부드러운 우유와 진한 에스프레소',price:5000,image:'cafe-latte.jpg',soldOut:false,visible:true},
      {id:'vanilla',category:'coffee',name:'바닐라라떼',description:'은은한 바닐라 향의 달콤한 라떼',price:5500,image:'vanilla-latte.jpg',soldOut:false,visible:true},
      {id:'strawberry',category:'drink',name:'딸기라떼',description:'상큼한 딸기 과육과 고소한 우유',price:6000,image:'strawberry-latte.jpg',soldOut:false,visible:true},
      {id:'matcha',category:'drink',name:'말차라떼',description:'쌉싸름한 말차와 부드러운 우유',price:6000,image:'matcha-latte.jpg',soldOut:false,visible:true},
      {id:'lemonade',category:'drink',name:'레몬에이드',description:'산뜻한 레몬과 청량한 탄산',price:5500,image:'lemonade.jpg',soldOut:false,visible:true},
      {id:'basque',category:'dessert',name:'바스크 치즈케이크',description:'진하게 구운 윗면과 크리미한 속',price:6500,image:'basque-cheesecake.jpg',soldOut:false,visible:true},
      {id:'brownie',category:'dessert',name:'초코 브라우니',description:'촉촉하고 진한 초콜릿 한 조각',price:5500,image:'brownie.jpg',soldOut:false,visible:true}
    ],
    content:{heroTitle:'달콤함은 자연스럽게.',heroLead:'제주 구좌 당근을 담은 한 조각. 가벼운 오후를 위한 아이콘카페의 새로운 디저트를 만나보세요.',story:'당근과 과일이 전하는 자연스러운 풍미를 떠올리며 만든 콘셉트 메뉴입니다.',cta:'무료 아메리카노 쿠폰 받기',place:CAMPUS_PLACE,address:CAMPUS_ADDRESS,hours:'운영시간 확인 중',phone:'010-1234-5678',map:CAMPUS_MAP,mapEmbed:CAMPUS_EMBED},
    campaign:{active:true,benefit:'첫 방문 · 당근케이크 구매 시 아메리카노 1잔 무료',validityHours:168,startsAt:'',endsAt:''},
    coupons:[],events:[]
  });
  let state;
  try { state = JSON.parse(localStorage.getItem(STORE)) || seed(); } catch { state = seed(); }
  if (!state.menus || !state.content || !state.campaign || !state.coupons) state = seed();
  // Update only the bundled photo; keep any image uploaded in the demo admin.
  const cakeMenu = state.menus.find(m => m.id === 'cake');
  if (cakeMenu?.image === 'carrot-cake.jpg') cakeMenu.image = 'carrot-cake-v2.jpg';
  // Preserve issued demo coupons and edits while upgrading the previous placeholder location.
  if (state.content.address === '서울시 예시구 카페로 00 (발표용 예시)') {
    state.content.address = CAMPUS_ADDRESS;
    state.content.place = CAMPUS_PLACE;
  }
  if (state.content.phone === '010-0000-0000 (발표용 예시)') state.content.phone = '010-1234-5678';
  if (state.content.hours === '매일 09:00–21:00 (발표용 예시)') state.content.hours = '운영시간 확인 중';
  if (state.content.address === CAMPUS_ADDRESS) {
    state.content.place ||= CAMPUS_PLACE;
    state.content.map ||= CAMPUS_MAP;
    state.content.mapEmbed ||= CAMPUS_EMBED;
  }
  try { localStorage.setItem(STORE, JSON.stringify(state)); } catch {}
  const save = () => { try { localStorage.setItem(STORE, JSON.stringify(state)); window.dispatchEvent(new Event('icon-demo-change')); return true; } catch { toast('저장 공간이 부족합니다. 이미지 크기를 줄여주세요.'); return false; } };
  const getClaim = () => localStorage.getItem(CLAIM);
  const mine = () => state.coupons.find(c => c.claim === getClaim());
  const status = c => c.redeemedAt ? '사용완료' : Date.now() >= new Date(c.expiresAt).getTime() ? '만료' : '미사용';
  const campaignOpen = () => { const c=state.campaign, now=Date.now(); return c.active && (!c.startsAt || now >= new Date(c.startsAt).getTime()) && (!c.endsAt || now < new Date(c.endsAt).getTime()) && !state.menus.find(m=>m.id==='cake')?.soldOut; };
  const imgSrc = m => m.image?.startsWith('data:image/') ? m.image : asset(m.image || 'carrot-cake-v2.jpg');
  const toast = message => { document.querySelector('.toast')?.remove(); const t=document.createElement('div'); t.className='toast'; t.setAttribute('role','status'); t.textContent=message; document.body.append(t); setTimeout(()=>t.remove(),3500); };
  const nav = () => `<div class="demo-strip">발표용 시연 · 모든 메뉴 정보와 쿠폰은 가상 데이터입니다</div><header class="site-header"><div class="container header-inner"><a class="brand" href="${base}index.html" aria-label="ICON CAFE 홈"><span class="brand-mark">✳</span>ICON CAFE</a><nav class="nav" aria-label="주요 메뉴"><a href="${base}index.html#story">이야기</a><a href="${base}index.html#menu">메뉴</a><a href="${base}index.html#coupon">첫 방문 혜택</a><a href="${base}index.html#visit">오시는 길</a></nav><div class="header-actions"><a class="btn btn-outline" href="${base}staff/">직원 화면</a><a class="btn btn-primary" href="${base}admin/">관리자 시연 ↗</a></div></div></header>`;
  const footer = () => `<footer class="footer"><div class="container footer-grid"><div><div class="brand"><span class="brand-mark">✳</span>ICON CAFE</div><p>제주 구좌 유기농 당근케이크를 소개하는 발표용 콘셉트 웹앱입니다. 사진·가격·원재료 문구·영업시간은 확인 전 정보입니다.</p><div class="footer-contact"><span>장소 <strong>${esc(state.content.place || state.content.address)}</strong></span><span>주소 <strong>${esc(state.content.address)}</strong></span><span>전화 <a href="tel:${esc(String(state.content.phone).replace(/[^0-9+]/g,''))}">${esc(state.content.phone)}</a></span></div></div><div class="footer-links"><a href="${base}staff/">직원 시연</a><a href="${base}admin/">관리자 시연</a></div></div></footer>`;
  const couponButtonText = () => mine() ? '내 쿠폰 보기' : state.content.cta;
  const menuIcons = {cake:'🥕',americano:'☕',latte:'🥛',vanilla:'🍦',strawberry:'🍓',matcha:'🍵',lemonade:'🍋',basque:'🍰',brownie:'🍫'};
  const menuTeasers = {
    cake:['당근과 과일의 달콤함을 담은 시그니처 디저트','당근의 달콤한 한 조각'],
    americano:['깊고 깔끔한 에스프레소의 균형','깊고 깔끔한 한 잔'],
    latte:['부드러운 우유와 진한 에스프레소','우유와 에스프레소의 조화'],
    vanilla:['은은한 바닐라 향의 달콤한 라떼','은은한 바닐라 향'],
    strawberry:['상큼한 딸기 과육과 고소한 우유','딸기 과육과 우유'],
    matcha:['쌉싸름한 말차와 부드러운 우유','말차와 우유의 조화'],
    lemonade:['산뜻한 레몬과 청량한 탄산','산뜻한 레몬 탄산'],
    basque:['진하게 구운 윗면과 크리미한 속','크리미한 치즈 풍미'],
    brownie:['촉촉하고 진한 초콜릿 한 조각','진한 초콜릿 한 조각']
  };
  const menuCard = m => {
    const description = menuTeasers[m.id]?.[0] === m.description ? menuTeasers[m.id][1] : m.description;
    return `<button class="menu-card" type="button" data-card-id="${esc(m.id)}" data-category="${esc(m.category)}" aria-label="${esc(m.name)}, ${esc(description)}, ${won(m.price)}. 상세 보기" aria-pressed="false"><span class="menu-card-inner"><span class="menu-card-face menu-card-front"><span class="menu-card-icon" aria-hidden="true">${menuIcons[m.id] || '✳'}</span><span class="menu-card-name">${esc(m.name)}</span></span><span class="menu-card-face menu-card-back"><span class="menu-card-back-name">${esc(m.name)}</span><span class="menu-card-description" title="${esc(m.description)}">${esc(description)}</span><span class="menu-card-price">${won(m.price)}</span></span></span>${m.soldOut?'<span class="menu-card-soldout">품절</span>':''}</button>`;
  };
  let menuFilter = 'all';
  let motionObserver;
  function initCakeMotion(){
    motionObserver?.disconnect();
    const stage = app.querySelector('.cake-motion-stage');
    if (!stage) return;
    if (!('IntersectionObserver' in window)) { stage.classList.add('is-playing'); return; }
    motionObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        stage.classList.add('is-playing');
        motionObserver.disconnect();
      }
    }, {threshold: .25});
    motionObserver.observe(stage);
  }
  function renderHome(){
    const c=state.content, cake=state.menus.find(m=>m.id==='cake')||state.menus[0];
    app.innerHTML = nav()+`<main>
      <section class="hero"><div class="container hero-grid"><div class="hero-copy fade-in"><span class="eyebrow">NEW SIGNATURE DESSERT</span><h1>${esc(c.heroTitle).replace('자연스럽게.','<em>자연스럽게.</em>')}</h1><p class="hero-lead">${esc(c.heroLead)}</p><div class="hero-benefit"><span aria-hidden="true">✦</span><span>첫 방문에 당근케이크를 구매하면<br><strong>아메리카노 1잔 무료</strong> · 직원 확인 후 사용</span></div><div class="hero-cta"><button class="btn btn-primary" data-action="coupon">${esc(couponButtonText())} <span aria-hidden="true">↗</span></button><span class="small muted">발급 후 7일간 유효 · 발표용 쿠폰</span></div></div><div class="hero-visual fade-in"><img src="${esc(imgSrc(cake))}" alt="당근케이크 발표용 콘셉트 사진" width="900" height="760"><div class="hero-badge">A LITTLE<br>SWEET<br>PAUSE ✳</div><span class="hero-caption">AI CONCEPT IMAGE · 실제 판매 제품과 다를 수 있습니다</span></div></div></section>
      <section class="section section-alt" id="story"><div class="container"><div class="section-head"><div><span class="eyebrow">OUR STORY</span><h2>한 조각에 담은<br>산뜻한 오후</h2></div><p>${esc(c.story)}<br><small>원산지·유기농·레시피 문구는 출시 전 증빙 확인이 필요합니다.</small></p></div><div class="story-grid"><article class="story-card"><span class="story-number">01 / INGREDIENT</span><h3>제주에서 온 영감</h3><p>제주 구좌 당근의 선명한 색과 풍미에서 시작한 메뉴 콘셉트입니다.</p></article><article class="story-card"><span class="story-number">02 / FLAVOR</span><h3>재료가 가진 단맛</h3><p>당근과 과일 본연의 맛을 살린다는 기획 방향을 담았습니다. 실제 레시피는 확인 전입니다.</p></article><article class="story-card"><span class="story-number">03 / MOMENT</span><h3>커피와 함께</h3><p>한 조각의 케이크와 깔끔한 아메리카노가 만드는 짧은 쉼표.</p></article></div></div></section>
      <section class="section"><div class="container signature"><figure class="cake-motion"><div class="cake-motion-stage" role="img" aria-label="당근케이크 연필 스케치가 완성 콘셉트 이미지로 변하는 모션 그래픽"><img class="cake-motion-sketch" src="${asset('cake-before.webp')}" alt="" loading="lazy" width="1254" height="1254"><img class="cake-motion-finished" src="${asset('cake-after.webp')}" alt="" loading="lazy" width="1254" height="1254"><span class="cake-motion-glow" aria-hidden="true"></span></div><figcaption>스케치에서 달콤한 한 조각으로 <span>· AI 콘셉트 이미지</span></figcaption></figure><div><span class="eyebrow">SIGNATURE PAIRING</span><h2>오늘의 작은 쉼표,<br>당근케이크</h2><p class="muted">촉촉한 케이크와 산뜻한 커피의 만남. 바쁜 하루 사이, 잠깐의 여유를 즐겨보세요.</p><div class="pairing"><span class="pairing-dot">✳</span><div><strong>${esc(cake.name)} + 아메리카노</strong><br><span class="small muted">추천 페어링 · 실제 메뉴와 가격 확인 필요</span></div></div><a class="btn btn-outline" href="#menu">전체 메뉴 보기 ↗</a></div></div></section>
      <section class="section section-alt" id="menu"><div class="container"><div class="section-head"><div><span class="eyebrow">THE MENU</span><h2>아이콘카페 메뉴</h2></div><p>한 잔의 커피부터 달콤한 디저트까지. 아래 9종과 가격은 모두 발표용 예시입니다.</p></div><div class="menu-tabs" role="group" aria-label="메뉴 분류"><button class="tab ${menuFilter==='all'?'active':''}" data-filter="all">전체</button><button class="tab ${menuFilter==='coffee'?'active':''}" data-filter="coffee">커피</button><button class="tab ${menuFilter==='drink'?'active':''}" data-filter="drink">음료</button><button class="tab ${menuFilter==='dessert'?'active':''}" data-filter="dessert">디저트</button></div><div class="menu-grid" id="menu-grid">${state.menus.filter(m=>m.visible && (menuFilter==='all'||m.category===menuFilter)).map(menuCard).join('')}</div><p class="image-note">카드에 마우스를 올리거나 휴대폰에서 누르면 메뉴 설명과 발표용 예시 가격을 볼 수 있습니다.</p></div></section>
      <section class="section coupon-section" id="coupon"><div class="container coupon-grid"><div><span class="eyebrow">FIRST VISIT GIFT</span><h2>첫 방문이라면,<br>커피 한 잔을 선물할게요.</h2><p>당근케이크 구매 고객을 위한 아메리카노 무료 쿠폰. 직원이 첫 방문과 구매를 확인한 뒤 사용할 수 있습니다.</p><button class="btn btn-dark" data-action="coupon" ${!campaignOpen()&&!mine()?'disabled':''}>${esc(couponButtonText())} ↗</button><p class="small">${!campaignOpen()&&!mine()?'현재 신규 발급이 중지되었습니다.':'발급 후 7×24시간 유효 · 동일 브라우저에서는 기존 쿠폰을 표시합니다.'}</p></div><div class="coupon-ticket" aria-label="쿠폰 혜택 안내"><div class="ticket-top"><span class="ticket-logo">ICON CAFE ✳</span><span class="ticket-label">WELCOME GIFT</span></div><div class="ticket-title">AMERICANO<br>ON US.</div><p class="small muted">${esc(state.campaign.benefit)}</p><div class="ticket-rule"></div><div class="ticket-foot"><span>FIRST VISIT ONLY</span><span>7 DAYS FROM ISSUE</span></div></div></div></section>
      <section class="section" id="visit"><div class="container"><div class="section-head"><div><span class="eyebrow">VISIT US</span><h2>아이콘카페에서 만나요</h2></div><p>계원예술대학교 평생교육원 안의 카페를 찾아주세요. 구내카페의 정확한 건물·층과 영업시간은 확인 후 안내하겠습니다.</p></div><div class="visit-grid"><div><div class="info-row"><strong>장소</strong><span>${esc(c.place || c.address)}</span></div><div class="info-row"><strong>주소</strong><span>${esc(c.address)}</span></div><div class="info-row"><strong>영업시간</strong><span>${esc(c.hours)}</span></div><div class="info-row"><strong>전화</strong><span><a href="tel:${esc(String(c.phone).replace(/[^0-9+]/g,''))}">${esc(c.phone)}</a></span></div>${c.map?`<p><a class="btn btn-outline" href="${esc(c.map)}" target="_blank" rel="noopener noreferrer">지도에서 위치 보기 ↗</a></p>`:''}</div><div class="visit-box">${c.mapEmbed?`<iframe class="visit-map" src="${esc(c.mapEmbed)}" title="계원예술대학교 평생교육원 위치 지도" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>`:`<div class="visit-placeholder"><span aria-hidden="true">⌖</span><strong>지도 준비 중</strong></div>`}<p class="map-caption">지도는 평생교육원 위치를 표시합니다. 구내카페의 상세 위치는 현장에서 확인해 주세요.</p></div></div></div></section>
    </main>${footer()}<div class="sticky-cta"><button class="btn btn-primary" data-action="coupon">${esc(couponButtonText())} ↗</button></div><div id="modal-root"></div>`;
    initCakeMotion();
  }
  function showCoupon(){
    const c=mine(); if(!c){if(!campaignOpen()){toast('현재 신규 쿠폰 발급이 중지되었습니다.');return;}const token=id();const now=Date.now();const coupon={id:id(),claim:token,code:code(),issuedAt:new Date(now).toISOString(),expiresAt:new Date(now+Number(state.campaign.validityHours)*3600000).toISOString(),redeemedAt:null,redeemedBy:null,benefit:state.campaign.benefit};state.coupons.push(coupon);state.events.push({type:'ISSUED',couponId:coupon.id,at:coupon.issuedAt});localStorage.setItem(CLAIM,token);save();renderHome();}
    const current=mine(), s=status(current), root=document.querySelector('#modal-root'); if(!root)return;
    root.innerHTML=`<div class="modal-backdrop" data-close="backdrop"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="coupon-heading"><div class="modal-header"><div><span class="eyebrow">MY COUPON · DEMO</span><h2 id="coupon-heading">무료 아메리카노 쿠폰</h2></div><button class="icon-btn" data-close="button" aria-label="쿠폰 닫기">×</button></div><span class="status-pill ${s==='사용완료'?'used':s==='만료'?'expired':''}">${s}</span><p class="small muted">첫 방문 고객 한정 · 당근케이크 구매 시 아메리카노 1잔 무료 · 직원 확인 후 사용</p>${s==='미사용'?`<div class="barcode-wrap"><svg id="coupon-barcode" aria-label="쿠폰 Code128 바코드"></svg></div>`:`<div class="notice warning">${s==='사용완료'?'사용 완료된 쿠폰입니다. 다시 사용할 수 없습니다.':'유효기간이 지나 사용할 수 없습니다.'}</div>`}<div class="coupon-code">${esc(current.code)}</div><dl class="modal-data"><dt>발급</dt><dd>${date(current.issuedAt)}</dd><dt>만료</dt><dd>${date(current.expiresAt)}</dd><dt>혜택</dt><dd>${esc(current.benefit)}</dd></dl><div class="notice">발표용 데모 쿠폰입니다. 브라우저 데이터를 지우면 다시 찾을 수 없습니다. 실제 매장에서는 사용할 수 없습니다.</div></div></div>`;
    if(s==='미사용' && typeof JsBarcode==='function') JsBarcode('#coupon-barcode',current.code,{format:'CODE128',width:2,height:74,displayValue:false,margin:8,lineColor:'#1d271e'});
    document.body.style.overflow='hidden';root.querySelector('.icon-btn').focus();
  }
  const closeModal = () => {const root=document.querySelector('#modal-root');if(root)root.innerHTML='';document.body.style.overflow='';document.querySelector('[data-action="coupon"]')?.focus();};
  const appHeader = title => `<div class="app-shell"><div class="app-top"><div class="container app-top-inner"><a class="brand" href="${base}index.html"><span class="brand-mark">✳</span>ICON CAFE</a><nav><a href="${base}index.html">고객 화면</a><a href="${base}staff/">직원</a><a href="${base}admin/">관리자</a></nav></div></div><main class="container app-main"><div class="app-title"><div><span class="eyebrow">PRESENTATION DEMO</span><h1>${title}</h1></div><p>브라우저 안의 가상 데이터로 시연합니다. 실제 계정 인증이나 쿠폰 결제 기능은 없습니다.</p></div>`;
  const demoLogin = role => { app.innerHTML=appHeader(role==='staff'?'직원 시연':'관리자 시연')+`<div class="panel auth-card"><span class="eyebrow">DEMO ACCESS</span><h1>${role==='staff'?'직원 화면':'관리자 화면'}</h1><p>발표를 위한 원클릭 입장입니다. 실제 로그인이나 권한 보안을 제공하지 않습니다.</p><button class="btn btn-primary" data-action="login" data-role="${role}">${role==='staff'?'직원':'관리자'} 화면 시작하기 ↗</button><p class="small">고객 화면에서 쿠폰을 먼저 발급하면 이 화면에서 확인할 수 있습니다.</p></div></main></div>`; };
  let scannedCode = '', stream=null, scanTimer=null;
  const stopCamera = () => { if(scanTimer){clearInterval(scanTimer);scanTimer=null;}if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;}const video=document.querySelector('#camera');if(video){video.pause();video.srcObject=null;video.classList.remove('active');}const btn=document.querySelector('#camera-button');if(btn)btn.textContent='카메라 스캔 시작'; };
  function renderStaff(){
    if(!sessionStorage.getItem(ROLE)){demoLogin('staff');return;}
    app.innerHTML=appHeader('직원 쿠폰 확인')+`<div class="staff-grid"><section class="panel"><span class="eyebrow">STEP 01 / SCAN</span><h2>쿠폰 코드 확인</h2><p class="muted small">카메라로 Code128 바코드를 비추거나 쿠폰 번호를 입력하세요. 조회만으로 쿠폰이 사용되지는 않습니다.</p><video id="camera" class="camera-view" autoplay muted playsinline aria-label="바코드 스캔 카메라"></video><div class="form-actions"><button class="btn btn-dark" id="camera-button" data-action="camera">카메라 스캔 시작</button></div><label class="field">쿠폰 번호<input class="input" id="scan-code" autocomplete="off" autocapitalize="characters" placeholder="예: IC123456789"></label><button class="btn btn-outline" data-action="verify">코드 조회 ↗</button><p class="small muted">카메라는 localhost 또는 HTTPS에서만 지원될 수 있습니다. 미지원 시 수동 입력을 사용하세요.</p></section><section class="panel"><span class="eyebrow">STEP 02 / VERIFY</span><h2>사용 가능 여부</h2><div id="staff-result"><div class="notice">고객 쿠폰을 스캔하거나 번호를 입력하면 상태가 표시됩니다.</div></div></section></div><div class="panel" style="margin-top:18px"><strong>시연 안내</strong><p class="small muted" style="margin-bottom:0">쿠폰 발급과 사용 내역은 이 브라우저의 저장소에만 남습니다. 실제 매장 운영에 필요한 인증, 서버 검증, 동시 사용 차단은 제공하지 않습니다.</p></div></main></div>`;
  }
  function verify(codeValue){
    scannedCode=String(codeValue||document.querySelector('#scan-code')?.value||'').trim().toUpperCase();
    const input=document.querySelector('#scan-code');if(input)input.value=scannedCode;
    const box=document.querySelector('#staff-result');if(!box)return;
    if(!scannedCode){box.innerHTML='<div class="result-box error"><h3>번호를 입력해 주세요</h3><p>바코드를 스캔하거나 쿠폰 번호를 직접 입력하세요.</p></div>';return;}
    const c=state.coupons.find(x=>x.code===scannedCode);
    if(!c){box.innerHTML='<div class="result-box error"><h3>존재하지 않는 쿠폰</h3><p>번호를 다시 확인해 주세요. 다른 브라우저에서 발급한 데모 쿠폰은 이 기기에서 조회할 수 없습니다.</p></div>';return;}
    const s=status(c);
    box.innerHTML=`<div class="result-box ${s==='미사용'?'':'error'}"><h3>${s==='미사용'?'사용 가능한 쿠폰':s==='사용완료'?'이미 사용된 쿠폰':'만료된 쿠폰'}</h3><p>코드 ${esc(c.code)} · ${esc(c.benefit)}<br>발급 ${date(c.issuedAt)} · 만료 ${date(c.expiresAt)}</p></div>${s==='미사용'?`<div style="margin-top:22px"><strong>직원 현장 확인</strong><label class="checkbox"><input type="checkbox" id="first-check">첫 방문 고객임을 확인했습니다</label><label class="checkbox"><input type="checkbox" id="purchase-check">당근케이크 구매를 확인했습니다</label><button class="btn btn-primary" id="redeem-button" data-action="redeem" disabled>사용 확정</button><p class="small muted">두 항목을 확인한 뒤 버튼을 누르세요.</p></div>`:''}`;
  }
  async function startCamera(){
    if(stream){stopCamera();return;}
    if(!navigator.mediaDevices?.getUserMedia){toast('카메라를 사용할 수 없습니다. 쿠폰 번호를 직접 입력해 주세요.');return;}
    if(!('BarcodeDetector' in window)){toast('이 브라우저는 바코드 인식을 지원하지 않습니다. 번호를 직접 입력해 주세요.');return;}
    try{
      const formats=await BarcodeDetector.getSupportedFormats();if(!formats.includes('code_128')){toast('Code128 스캔이 지원되지 않습니다. 수동 입력을 사용해 주세요.');return;}
      stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}},audio:false});
      const video=document.querySelector('#camera');video.srcObject=stream;video.classList.add('active');await video.play();document.querySelector('#camera-button').textContent='카메라 중지';
      const detector=new BarcodeDetector({formats:['code_128']});let busy=false;
      scanTimer=setInterval(async()=>{if(busy||video.readyState<2)return;busy=true;try{const codes=await detector.detect(video);if(codes.length){stopCamera();verify(codes[0].rawValue);}}catch{}finally{busy=false;}},350);
    }catch{stopCamera();toast('카메라 권한을 확인해 주세요. 수동 입력도 사용할 수 있습니다.');}
  }
  function redeem(){
    const c=state.coupons.find(x=>x.code===scannedCode);
    if(!c){verify(scannedCode);return;}
    if(!document.querySelector('#first-check')?.checked || !document.querySelector('#purchase-check')?.checked){toast('첫 방문과 구매 확인이 모두 필요합니다.');return;}
    if(status(c)!=='미사용'){verify(scannedCode);return;}
    c.redeemedAt=new Date().toISOString();c.redeemedBy='데모 직원';state.events.push({type:'REDEEMED',couponId:c.id,at:c.redeemedAt,actor:'데모 직원'});save();verify(scannedCode);toast('데모 쿠폰을 사용 완료로 변경했습니다.');
  }
  let adminTab='dashboard', selectedMenu='cake';
  const adminTabs = [['dashboard','대시보드'],['menus','메뉴 관리'],['content','콘텐츠·매장'],['campaign','쿠폰 설정'],['history','쿠폰 내역']];
  function renderAdmin(){
    if(sessionStorage.getItem(ROLE)!=='admin'){demoLogin('admin');return;}
    app.innerHTML=appHeader('관리자 시연')+`<div class="admin-tabs" role="group" aria-label="관리자 메뉴">${adminTabs.map(([key,label])=>`<button class="tab ${adminTab===key?'active':''}" data-admin-tab="${key}">${label}</button>`).join('')}</div><div id="admin-content">${adminContent()}</div></main></div>`;
  }
  function adminContent(){
    const total=state.coupons.length, used=state.coupons.filter(c=>status(c)==='사용완료').length, expired=state.coupons.filter(c=>status(c)==='만료').length;
    if(adminTab==='dashboard')return `<div class="stats-grid"><div class="stat"><span>총 발급</span><strong>${total}</strong></div><div class="stat"><span>미사용</span><strong>${total-used-expired}</strong></div><div class="stat"><span>사용 완료</span><strong>${used}</strong></div><div class="stat"><span>만료</span><strong>${expired}</strong></div></div><div class="panel"><h2>시연 흐름</h2><p>① 고객 화면에서 쿠폰을 발급합니다. ② 직원 화면에서 바코드를 스캔하거나 코드를 입력합니다. ③ 첫 방문·케이크 구매를 확인한 뒤 사용 확정합니다. ④ 이곳에서 통계를 확인합니다.</p><div class="form-actions"><a class="btn btn-outline" href="${base}index.html">고객 화면 ↗</a><a class="btn btn-outline" href="${base}staff/">직원 화면 ↗</a><button class="btn btn-quiet" data-action="reset">시연 데이터 초기화</button></div><p class="small muted">초기화하면 메뉴 수정과 쿠폰 기록이 모두 사라집니다.</p></div>`;
    if(adminTab==='menus'){
      const m=state.menus.find(x=>x.id===selectedMenu)||state.menus[0];
      return `<div class="admin-editor"><div class="panel"><h2>메뉴 목록</h2><div class="admin-menu-list">${state.menus.map(x=>`<button class="admin-menu-item ${m.id===x.id?'active':''}" data-menu-id="${esc(x.id)}"><img src="${esc(imgSrc(x))}" alt=""><span>${esc(x.name)}<small>${won(x.price)}${x.soldOut?' · 품절':''}${!x.visible?' · 숨김':''}</small></span></button>`).join('')}</div><button class="btn btn-outline" data-action="new-menu" style="margin-top:16px">+ 새 메뉴 추가</button></div><form class="panel" id="menu-form"><h2>메뉴 편집</h2><input type="hidden" name="id" value="${esc(m.id)}"><label class="field">메뉴 이름<input class="input" name="name" value="${esc(m.name)}" required maxlength="70"></label><div class="form-row"><label class="field">카테고리<select class="input" name="category">${[['signature','신메뉴'],['coffee','커피'],['drink','음료'],['dessert','디저트']].map(([v,t])=>`<option value="${v}" ${m.category===v?'selected':''}>${t}</option>`).join('')}</select></label><label class="field">가격 (원)<input class="input" name="price" type="number" min="0" step="100" value="${Number(m.price)}" required></label></div><label class="field">설명<textarea class="input" name="description" maxlength="200">${esc(m.description)}</textarea></label><label class="field">이미지 교체<input class="input" name="image" type="file" accept="image/png,image/jpeg,image/webp"><span class="field-hint">발표용 이미지는 이 브라우저에 압축 저장됩니다. 5MB 이하 파일 권장.</span></label><div class="form-row"><label class="checkbox"><input type="checkbox" name="soldOut" ${m.soldOut?'checked':''}>품절 표시</label><label class="checkbox"><input type="checkbox" name="visible" ${m.visible?'checked':''}>고객 화면 노출</label></div><div class="form-actions"><button class="btn btn-primary" type="submit">변경 저장</button>${m.id==='cake'?'':`<button class="btn btn-quiet" type="button" data-action="hide-menu">메뉴 숨기기</button>`}</div></form></div>`;
    }
    if(adminTab==='content'){
      const c=state.content;
      return `<form class="panel" id="content-form"><h2>홍보 문구와 매장 정보</h2><div class="form-row"><label class="field">Hero 제목<input class="input" name="heroTitle" value="${esc(c.heroTitle)}" required></label><label class="field">쿠폰 버튼 문구<input class="input" name="cta" value="${esc(c.cta)}" required></label></div><label class="field">Hero 설명<textarea class="input" name="heroLead">${esc(c.heroLead)}</textarea></label><label class="field">재료 이야기<textarea class="input" name="story">${esc(c.story)}</textarea></label><p class="notice warning">원산지·유기농·무가당 표현은 실제 자료가 확인되기 전 발표용 콘셉트로만 사용하세요.</p><div class="form-row"><label class="field">장소명<input class="input" name="place" value="${esc(c.place)}"></label><label class="field">주소<input class="input" name="address" value="${esc(c.address)}"></label></div><div class="form-row"><label class="field">영업시간<input class="input" name="hours" value="${esc(c.hours)}"></label><label class="field">전화번호<input class="input" name="phone" value="${esc(c.phone)}"></label></div><label class="field">지도 열기 URL<input class="input" name="map" type="url" value="${esc(c.map)}" placeholder="Google 또는 네이버 지도 링크"></label><label class="field">지도 삽입 URL<input class="input" name="mapEmbed" type="url" value="${esc(c.mapEmbed)}" placeholder="Google 지도 삽입 링크"><span class="field-hint">Google Maps의 지도 퍼가기 주소를 입력하세요. 비우면 지도 대신 안내문을 표시합니다.</span></label><button class="btn btn-primary">변경 저장</button></form>`;
    }
    if(adminTab==='campaign'){
      const c=state.campaign;
      return `<form class="panel" id="campaign-form"><h2>쿠폰 행사 설정</h2><p class="muted small">행사 중지는 신규 발급만 막습니다. 이미 발급한 데모 쿠폰은 만료 시각까지 사용 가능합니다.</p><label class="checkbox"><input type="checkbox" name="active" ${c.active?'checked':''}>신규 쿠폰 발급 허용</label><label class="field">혜택 안내<input class="input" name="benefit" value="${esc(c.benefit)}" required></label><div class="form-row"><label class="field">유효기간 (시간)<input class="input" name="validityHours" type="number" min="1" max="720" value="${Number(c.validityHours)}" required></label><label class="field">행사 시작 (선택)<input class="input" name="startsAt" type="datetime-local" value="${esc(c.startsAt)}"></label></div><label class="field">행사 종료 (선택)<input class="input" name="endsAt" type="datetime-local" value="${esc(c.endsAt)}"></label><button class="btn btn-primary">변경 저장</button></form>`;
    }
    return `<div class="panel"><h2>쿠폰 내역</h2><p class="muted small">이 브라우저에서 발급된 데모 쿠폰만 표시합니다. 코드 일부를 가려 보여줍니다.</p><div class="table-wrap"><table class="table"><thead><tr><th>쿠폰 코드</th><th>발급</th><th>만료</th><th>상태</th><th>사용 시간</th><th>처리자</th></tr></thead><tbody>${state.coupons.length?state.coupons.slice().reverse().map(c=>`<tr><td>${esc(c.code.slice(0,4))}••••${esc(c.code.slice(-3))}</td><td>${date(c.issuedAt)}</td><td>${date(c.expiresAt)}</td><td>${status(c)}</td><td>${date(c.redeemedAt)}</td><td>${esc(c.redeemedBy||'—')}</td></tr>`).join(''):'<tr><td colspan="6">아직 발급된 데모 쿠폰이 없습니다.</td></tr>'}</tbody></table></div></div>`;
  }
  async function compressImage(file){
    if(!file)return null;
    if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw new Error('PNG, JPG, WebP 이미지만 사용할 수 있습니다.');
    if(file.size>5*1024*1024)throw new Error('이미지 파일은 5MB 이하로 선택해 주세요.');
    const bitmap=await createImageBitmap(file), scale=Math.min(1,640/Math.max(bitmap.width,bitmap.height));
    const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close?.();return canvas.toDataURL('image/jpeg',.72);
  }
  async function handleForm(form){
    const d=new FormData(form);
    if(form.id==='menu-form'){
      const m=state.menus.find(x=>x.id===d.get('id'));if(!m)return;
      const old={...m};m.name=String(d.get('name')).trim();m.category=String(d.get('category'));m.price=Number(d.get('price'));m.description=String(d.get('description')).trim();m.soldOut=d.has('soldOut');m.visible=d.has('visible');
      try{const file=d.get('image');if(file?.size)m.image=await compressImage(file);}catch(e){Object.assign(m,old);toast(e.message);return;}
      if(!save())Object.assign(m,old);else{renderAdmin();toast('메뉴가 저장되었습니다. 고객 화면에도 반영됩니다.');}
    } else if(form.id==='content-form'){
      const next={...state.content};
      for(const key of ['heroTitle','heroLead','story','cta','place','address','hours','phone','map','mapEmbed'])next[key]=String(d.get(key)||'').trim();
      const validMap = value => { try { const u=new URL(value); return u.protocol==='https:' && ((u.hostname==='www.google.com' && u.pathname.startsWith('/maps/')) || u.hostname==='map.naver.com' || u.hostname==='naver.me'); } catch { return false; } };
      if(next.map && !validMap(next.map)){toast('Google 또는 네이버 지도 링크를 입력해 주세요.');return;}
      if(next.mapEmbed){try{const u=new URL(next.mapEmbed);if(u.protocol!=='https:'||u.hostname!=='www.google.com'||u.pathname!=='/maps/embed')throw new Error();}catch{toast('Google 지도 삽입 링크를 입력해 주세요.');return;}}
      Object.assign(state.content,next);save();toast('콘텐츠가 저장되었습니다.');
    } else if(form.id==='campaign-form'){
      const hours=Number(d.get('validityHours'));const start=String(d.get('startsAt')||''),end=String(d.get('endsAt')||'');
      if(!Number.isFinite(hours)||hours<1||hours>720){toast('유효기간은 1~720시간이어야 합니다.');return;}
      if(start&&end&&new Date(start)>=new Date(end)){toast('종료 시각은 시작 시각보다 뒤여야 합니다.');return;}
      Object.assign(state.campaign,{active:d.has('active'),benefit:String(d.get('benefit')).trim(),validityHours:hours,startsAt:start,endsAt:end});save();toast('행사 설정이 저장되었습니다.');
    }
  }
  document.addEventListener('click', e => {
    const card=e.target.closest('[data-card-id]');
    if(card){
      if(matchMedia('(hover: none), (pointer: coarse)').matches || e.detail===0){
        const flip=!card.classList.contains('is-flipped');
        document.querySelectorAll('.menu-card.is-flipped').forEach(other=>{other.classList.remove('is-flipped');other.setAttribute('aria-pressed','false');});
        card.classList.toggle('is-flipped',flip);
        card.setAttribute('aria-pressed',String(flip));
      }
      return;
    }
    const filter=e.target.closest('[data-filter]');if(filter){menuFilter=filter.dataset.filter;renderHome();document.querySelector('#menu')?.scrollIntoView();return;}
    const tab=e.target.closest('[data-admin-tab]');if(tab){adminTab=tab.dataset.adminTab;renderAdmin();return;}
    const menu=e.target.closest('[data-menu-id]');if(menu){selectedMenu=menu.dataset.menuId;renderAdmin();return;}
    const closer=e.target.closest('[data-close]');if(closer&&(closer.dataset.close==='button'||e.target===closer)){closeModal();return;}
    const act=e.target.closest('[data-action]');if(!act)return;
    switch(act.dataset.action){
      case 'coupon':showCoupon();break;
      case 'login':sessionStorage.setItem(ROLE,act.dataset.role);act.dataset.role==='staff'?renderStaff():renderAdmin();break;
      case 'camera':startCamera();break;
      case 'verify':verify();break;
      case 'redeem':redeem();break;
      case 'new-menu':{const m={id:id(),category:'coffee',name:'새 메뉴',description:'발표용 메뉴 설명',price:5000,image:'americano.jpg',soldOut:false,visible:false};state.menus.push(m);selectedMenu=m.id;save();renderAdmin();toast('새 메뉴를 추가했습니다. 내용을 수정한 뒤 노출하세요.');break;}
      case 'hide-menu':{const m=state.menus.find(x=>x.id===selectedMenu);if(m){m.visible=false;save();renderAdmin();toast('메뉴를 고객 화면에서 숨겼습니다.');}break;}
      case 'reset':if(confirm('발표용 메뉴 수정과 쿠폰 내역을 모두 초기화할까요?')){state=seed();localStorage.removeItem(CLAIM);save();renderAdmin();toast('시연 데이터를 초기화했습니다.');}break;
    }
  });
  document.addEventListener('focusout',e=>{const card=e.target.closest('.menu-card');if(card){card.classList.remove('is-flipped');card.setAttribute('aria-pressed','false');}});
  document.addEventListener('change',e=>{if(e.target.matches('#first-check,#purchase-check')){const button=document.querySelector('#redeem-button');if(button)button.disabled=!(document.querySelector('#first-check')?.checked&&document.querySelector('#purchase-check')?.checked);}});
  document.addEventListener('submit',e=>{if(e.target.matches('#menu-form,#content-form,#campaign-form')){e.preventDefault();handleForm(e.target);}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.querySelector('.modal-backdrop'))closeModal();if(e.key==='Tab'&&document.querySelector('.modal-backdrop')){e.preventDefault();document.querySelector('.modal .icon-btn')?.focus();}if(e.key==='Enter'&&e.target.id==='scan-code'){e.preventDefault();verify();}});
  window.addEventListener('storage',e=>{if(e.key===STORE){try{state=JSON.parse(e.newValue)||seed();}catch{state=seed();}if(page==='home')renderHome();else if(page==='admin')renderAdmin();else if(scannedCode)verify(scannedCode);}});
  window.addEventListener('beforeunload',stopCamera);
  if(page==='home')renderHome();else if(page==='staff')renderStaff();else renderAdmin();
})();


