'use client';
import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {emptyWorksheet,normalizeWorksheet,TRAITS,SECTIONS,TYPES,METHODS,Worksheet} from '@/lib/data';
const names=['발표 계획','청중 특성 분석','청중 특성 반영','자료 조사·재구성','발표 내용 조직'];
// 교사가 검토한 고정 청중 자료입니다. AI 생성이나 외부 API 호출을 하지 않습니다.
const AUDIENCE_PROFILES = [
 {id:'peers',label:'같은 학년 친구들',keywords:['친구','반','중2','중학교','학생','또래'],traits:[
  '나는 중학교 2학년 학생이야. 익숙한 학교생활 이야기는 이해하기 쉽지만, 어려운 용어가 나오면 설명이 필요해.',
  '우리 반이나 학교에서 실제로 겪는 일, 친구들의 경험과 연결되는 이야기가 궁금해.',
  '짧은 사진, 그림, 간단한 그래프가 있으면 집중하기 좋아. 글이 많은 화면은 읽기 어려워.',
  '친구들을 탓하기보다 공감할 수 있는 사례를 들려줘. 발표 끝에 우리가 할 수 있는 행동을 알려주면 좋겠어.'
 ]},
 {id:'teachers',label:'학교 선생님들',keywords:['선생님','교사','교직원'],traits:[
  '나는 학교에서 학생들을 가르치는 선생님이야. 학교생활의 일반적인 상황은 잘 알지만, 너희 모둠이 조사한 구체적인 결과는 처음 들어.',
  '학생들의 경험과 학교에서 실제로 실행할 수 있는 제안에 관심이 있어.',
  '조사 결과를 보여주는 간단한 표나 그래프, 핵심을 정리한 자료를 선호해.',
  '주장의 근거가 어디에서 왔는지 알려줘. 학교의 현실적인 조건도 함께 고려하면 좋겠어.'
 ]},
 {id:'younger',label:'초등학생·어린 청중',keywords:['초등','어린','동생','저학년'],traits:[
  '나는 아직 어려서 낯선 말이나 긴 설명은 이해하기 힘들어. 쉬운 말과 짧은 문장이 좋아.',
  '재미있는 이야기, 생활 속에서 겪을 만한 예시가 궁금해.',
  '크고 선명한 사진이나 그림, 짧은 영상이 있으면 내용을 더 쉽게 이해할 수 있어.',
  '한 번에 너무 많은 내용을 말하지 말아 줘. 중요한 내용은 예를 들어 다시 설명해 줘.'
 ]},
 {id:'parents',label:'학부모·보호자',keywords:['학부모','부모','보호자','어른'],traits:[
  '나는 학생들의 생활에 관심이 있는 보호자야. 학교생활은 대체로 알지만, 학생들의 구체적인 생각은 직접 들어야 알 수 있어.',
  '학생들에게 어떤 도움이 되는지, 가정과 학교에서 어떻게 실천할 수 있는지가 궁금해.',
  '핵심이 정리된 그림이나 간단한 통계 자료를 선호해.',
  '믿을 만한 자료와 실제 사례를 보여줘. 실천 방법은 구체적이고 부담이 적으면 좋겠어.'
 ]},
 {id:'general',label:'다양한 일반 청중',keywords:[],traits:[
  '나는 이 주제를 처음 듣는 사람일 수 있어. 발표에 나오는 중요한 말을 먼저 쉽게 설명해 줘.',
  '이 문제가 나의 생활과 어떤 관련이 있는지 궁금해.',
  '핵심이 한눈에 보이는 사진, 그림, 간단한 도표가 도움이 돼.',
  '모든 사람이 같은 경험을 하지는 않아. 여러 입장을 존중하고, 주장에는 근거를 제시해 줘.'
 ]}
] as const;
function suggestedProfile(audience:string){const text=audience.toLowerCase();return AUDIENCE_PROFILES.find(p=>p.keywords.some(k=>text.includes(k)))?.id||'general';}
async function call(path:string,method='GET',body?:unknown){const r=await fetch(path,{method,headers:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body),cache:'no-store'});const data=await r.json();if(!r.ok)throw Error(data.error||'요청 실패');return data;}
export default function Student(){
 const [joined,setJoined]=useState(false),[joinCode,setJoinCode]=useState(''),[groupNumber,setGroupNumber]=useState('1'),[joinPin,setJoinPin]=useState(''),[title,setTitle]=useState('');
 const [worksheet,setWorksheet]=useState<Worksheet>(emptyWorksheet),[stage,setStage]=useState(1),[profileId,setProfileId]=useState('');
 const [busy,setBusy]=useState(false),[status,setStatus]=useState(''),[error,setError]=useState(''),[focused,setFocused]=useState(true);
 const loaded=useRef(false);
 async function load(){const d=await call('/api/student/work');setWorksheet(normalizeWorksheet(d.group.worksheet));setStage(d.group.stage);setGroupNumber(String(d.group.group_number));loaded.current=true;setJoined(true);}
 useEffect(()=>{load().catch(()=>{});},[]);
 useEffect(()=>{if(!joined||!loaded.current)return;setStatus('저장 중...');const timer=setTimeout(()=>{call('/api/student/work','PATCH',{stage,worksheet}).then(()=>setStatus('저장 완료')).catch(()=>setStatus('저장 실패 · 다시 수정해 주세요'))},1000);return()=>clearTimeout(timer)},[worksheet,stage,joined]);
 useEffect(()=>{if(!joined)return;const visibility=()=>{setFocused(!document.hidden);const body=JSON.stringify({hidden:document.hidden});fetch('/api/student/visibility',{method:'POST',headers:{'Content-Type':'application/json'},body,keepalive:true}).catch(()=>{});};document.addEventListener('visibilitychange',visibility);const ping=setInterval(()=>{if(!document.hidden)fetch('/api/student/visibility',{method:'POST',headers:{'Content-Type':'application/json'},body:'{"hidden":false}'}).catch(()=>{})},15000);return()=>{document.removeEventListener('visibilitychange',visibility);clearInterval(ping)}},[joined]);
 function patch(fn:(next:Worksheet)=>void){setWorksheet(prev=>{const next=structuredClone(prev);fn(next);return next;});}
 async function join(e:React.FormEvent){e.preventDefault();setError('');setBusy(true);try{const d=await call('/api/student/join','POST',{joinCode,groupNumber:Number(groupNumber),joinPin});setTitle(d.sessionTitle);await load();}catch(e){setError(String(e instanceof Error?e.message:e));}finally{setBusy(false)}}
 function useProfile(){const profile=AUDIENCE_PROFILES.find(p=>p.id===profileId);if(!profile)return;patch(w=>{TRAITS.forEach((t,i)=>{w.traits[t].quote=profile.traits[i]})});setStatus('청중 자료를 활동지에 반영했어요. 핵심을 모둠의 말로 요약해 보세요.');}
 async function fullscreen(){try{if(!document.fullscreenElement){await document.documentElement.requestFullscreen();}else await document.exitFullscreen();}catch{setError('이 브라우저에서는 전체 화면 전환을 지원하지 않을 수 있습니다.')}}
 if(!joined)return <main className="shell"><div className="card center"><h1 className="title">모둠 입장</h1><p className="muted">교사가 알려준 수업 참여 코드와 모둠 비밀번호를 입력하세요. 학생 계정은 필요 없어요.</p><form onSubmit={join}><label>수업 참여 코드</label><input required maxLength={6} autoCapitalize="characters" value={joinCode} onChange={e=>setJoinCode(e.target.value.toUpperCase())} placeholder="예: ABC234"/><label>모둠 번호</label><input type="number" min={1} max={30} required value={groupNumber} onChange={e=>setGroupNumber(e.target.value)}/><label>모둠 비밀번호 (6자리)</label><input required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={joinPin} onChange={e=>setJoinPin(e.target.value)} placeholder="교사가 안내한 번호"/>{error&&<p className="error">{error}</p>}<p><button disabled={busy} style={{width:'100%'}}>{busy?'입장 중...':'수업 시작하기'}</button></p></form><Link href="/">처음으로</Link></div></main>;
 return <main className="shell"><header className="header"><div><span className="pill">{title||'AI 예상 청중 수업'}</span><h1>{groupNumber}모둠의 발표 준비</h1><span className="tiny">{status||'자동 저장 준비'} · 1대의 태블릿으로 모둠 공동 작성</span></div><div className="row"><button className="secondary" onClick={fullscreen}>⛶ 전체 화면</button><button className="secondary" onClick={()=>window.print()}>인쇄</button></div></header>
 {!focused&&<div className="notice">학습 화면으로 돌아왔어요. 수업에 집중해주세요.</div>}
 <div className="notice">웹 집중 모드는 다른 앱 이동을 완전히 차단하지 않습니다. 화면 전환은 참고용으로만 기록됩니다.</div>
 <div className="progress"><div style={{width:`${stage*20}%`}}/></div><nav className="stagebar" aria-label="활동 단계">{names.map((n,i)=><button key={n} className={stage===i+1?'active':''} onClick={()=>setStage(i+1)}>{i+1}. {n}</button>)}</nav>
 <div className="grid2"><section className="card"><h2 className="sectionTitle">👥 예상 청중 자료</h2><p className="muted">AI 대화 대신 미리 준비한 청중 자료를 살펴보세요. 이 자료는 일반적인 예시이며 실제 청중 모두의 생각을 대표하지 않습니다.</p><label htmlFor="profile">예상 청중 유형 선택</label><select id="profile" value={profileId} onChange={e=>setProfileId(e.target.value)}><option value="">청중 유형을 선택하세요</option>{AUDIENCE_PROFILES.map(p=><option key={p.id} value={p.id}>{p.label}</option>)}</select><p className="tiny">발표 대상 입력 내용에 맞는 유형이 없다면 ‘다양한 일반 청중’을 선택하고 모둠에서 실제 대상에 맞게 수정하세요.</p>{!profileId&&worksheet.audience&&<button className="secondary" onClick={()=>setProfileId(suggestedProfile(worksheet.audience))}>발표 대상에 맞는 청중 유형 추천</button>}{AUDIENCE_PROFILES.filter(p=>p.id===profileId).map(p=><div key={p.id}><div className="notice">가상의 {p.label}이(가) 이렇게 말할 수 있어요.</div>{TRAITS.map((t,i)=><div className="trait" key={t}><strong>{t}</strong><p>{p.traits[i]}</p></div>)}<button onClick={useProfile}>선택한 청중 자료를 2단계 활동지에 넣기</button></div>)}<p className="tiny">청중 자료는 미리 작성된 고정 예시입니다. 발표 주제에 따라 새로운 답변이 생성되지는 않습니다.</p></section>
 <section className="card"><h2 className="sectionTitle">📝 {stage}. {names[stage-1]}</h2>
 {stage===1&&<><p className="muted">발표 대상, 주제, 목적을 모둠원들과 상의하여 정하세요.</p>{([['audience','발표 대상'],['topic','발표 주제'],['purpose','발표 목적']] as const).map(([key,label])=><div key={key}><label>{label}</label><textarea value={worksheet[key]} onChange={e=>patch(w=>{w[key]=e.target.value})} placeholder={`${label}을 입력하세요`}/></div>)}</>}
 {stage===2&&<><p className="muted">왼쪽의 예상 청중 자료를 읽고, 핵심을 우리 모둠의 말로 요약해 보세요.</p>{TRAITS.map(t=><div className="trait" key={t}><h3>{t}</h3><label>선택한 청중 자료 (필요하면 수정)</label><textarea value={worksheet.traits[t].quote} onChange={e=>patch(w=>{w.traits[t].quote=e.target.value})}/><label>핵심 요약</label><textarea value={worksheet.traits[t].summary} onChange={e=>patch(w=>{w.traits[t].summary=e.target.value})}/></div>)}</>}
 {stage===3&&<><p className="muted">청중의 특성을 고려하여 발표에 반영할 내용과 이유를 작성하세요.</p>{TRAITS.map(t=><div className="trait" key={t}><h3>{t}</h3><p className="tiny">2단계 요약: {worksheet.traits[t].summary||'아직 작성하지 않았어요'}</p><label>내 발표에 반영할 내용</label><textarea value={worksheet.traits[t].reflect} onChange={e=>patch(w=>{w.traits[t].reflect=e.target.value})}/><label>그렇게 정한 이유</label><textarea value={worksheet.traits[t].reason} onChange={e=>patch(w=>{w.traits[t].reason=e.target.value})}/></div>)}</>}
 {stage===4&&<><p className="muted">자료의 제목과 내용을 적고, 유형을 선택한 뒤 청중에게 맞게 재구성할 방법을 적으세요.</p>{worksheet.materials.map((m,i)=><div className="material" key={i}><h3>자료 {i+1}</h3><label>자료 제목과 내용</label><textarea value={m.title} onChange={e=>patch(w=>{w.materials[i].title=e.target.value})}/><label>자료 유형</label><select value={m.type} onChange={e=>patch(w=>{w.materials[i].type=e.target.value})}><option value="">자료 유형 선택</option>{TYPES.map(t=><option key={t}>{t}</option>)}</select><label>자료 재구성 방안</label><textarea value={m.reframe} onChange={e=>patch(w=>{w.materials[i].reframe=e.target.value})}/></div>)}</>}
 {stage===5&&<><label>내용 전개 방식</label><select value={worksheet.method} onChange={e=>patch(w=>{w.method=e.target.value})}>{METHODS.map(m=><option key={m}>{m}</option>)}</select>{SECTIONS.map(s=><div className="trait" key={s}><h3>{s}</h3>{([['intent','의도와 목적'],['main','중심 내용'],['media','활용할 자료']] as const).map(([key,label])=><div key={key}><label>{label}</label><textarea value={worksheet.sections[s][key]} onChange={e=>patch(w=>{w.sections[s][key]=e.target.value})}/></div>)}</div>)}</>}
 <div className="divider"/><div className="row between"><button className="secondary" disabled={stage===1} onClick={()=>setStage(s=>s-1)}>← 이전 단계</button><button disabled={stage===5} onClick={()=>setStage(s=>s+1)}>다음 단계 →</button></div>{stage===5&&<p className="success">5단계까지 작성했다면 교사에게 완료했다고 알려주세요. 내용은 자동 저장됩니다.</p>}{error&&<p className="error">{error}</p>}</section></div></main>;
}
