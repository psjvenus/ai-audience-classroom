'use client';
import {useState} from 'react';
import {Worksheet,TRAITS,SECTIONS,TYPES,METHODS} from '@/lib/data';

const steps=['발표 계획','청중 특성 분석','청중 특성 반영','자료 조사·재구성','발표 내용 조직','예상 청중 검토'];
export default function PresentationView({groupNumber,sessionTitle,worksheet,onClose}:{groupNumber:number;sessionTitle:string;worksheet:Worksheet;onClose:()=>void}){
 const [step,setStep]=useState(5);
 const [notice,setNotice]=useState('');
 const field=(label:string,value:string)=><div key={label}><label>{label}</label><textarea readOnly value={value} placeholder="아직 작성하지 않았어요"/></div>;
 async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{setNotice('전체 화면을 사용할 수 없는 브라우저입니다.');}}
 return <main className="shell presentation-view">
  <header className="header"><div><span className="pill">{sessionTitle} · 발표 화면</span><h1>{groupNumber}모둠의 발표 준비</h1><span className="tiny">학생 화면과 같은 활동지 · 읽기 전용</span></div><div className="row no-print"><button className="secondary" onClick={fullscreen}>⛶ 전체 화면</button><button className="secondary" onClick={()=>window.print()}>인쇄</button><button onClick={async()=>{if(document.fullscreenElement)await document.exitFullscreen().catch(()=>{});onClose();}}>교사용 화면으로</button></div></header>
  {notice&&<p className="error">{notice}</p>}
  <div className="progress"><div style={{width:`${step/6*100}%`}}/></div>
  <nav className="stagebar no-print" aria-label="활동 단계">{steps.map((s,i)=><button key={s} className={step===i+1?'active':''} onClick={()=>setStep(i+1)}>{i+1}. {s}</button>)}</nav>
  <section className="card"><h2 className="sectionTitle">📝 {step}. {steps[step-1]}</h2>
  {step===1&&<><p className="muted">발표 대상, 주제, 목적을 모둠원들과 상의하여 정하세요.</p>{field('발표 대상',worksheet.audience)}{field('발표 주제',worksheet.topic)}{field('발표 목적',worksheet.purpose)}</>}
  {step===2&&<><p className="muted">예상 청중의 특성을 모둠에서 토의하고, 핵심을 우리 모둠의 말로 정리해 보세요.</p>{TRAITS.map(t=><div className="trait" key={t}><h3>{t}</h3>{field('예상 청중의 특성',worksheet.traits[t].quote)}{field('핵심 요약',worksheet.traits[t].summary)}</div>)}</>}
  {step===3&&<><p className="muted">청중의 특성을 고려하여 발표에 반영할 내용과 이유를 작성하세요.</p>{TRAITS.map(t=><div className="trait" key={t}><h3>{t}</h3><p className="tiny">2단계 요약: {worksheet.traits[t].summary||'아직 작성하지 않았어요'}</p>{field('내 발표에 반영할 내용',worksheet.traits[t].reflect)}{field('그렇게 정한 이유',worksheet.traits[t].reason)}</div>)}</>}
  {step===4&&<><p className="muted">자료의 제목과 내용을 적고, 유형을 선택한 뒤 청중에게 맞게 재구성할 방법을 적으세요.</p>{worksheet.materials.map((m,i)=><div className="material" key={i}><h3>자료 {i+1}</h3>{field('자료 제목과 내용',m.title)}<label>자료 유형</label><select disabled value={m.type}><option value="">자료 유형 선택</option>{TYPES.map(t=><option key={t}>{t}</option>)}</select>{field('자료 재구성 방안',m.reframe)}</div>)}</>}
  {step===5&&<><label>내용 전개 방식</label><select disabled value={worksheet.method}>{METHODS.map(m=><option key={m}>{m}</option>)}</select>{worksheet.method==='기타'&&<div><label>직접 정한 내용 전개 방식</label><input readOnly value={worksheet.customMethod} placeholder="직접 입력한 방식"/></div>}{SECTIONS.map(s=><div className="trait" key={s}><h3>{s}</h3>{field('의도와 목적',worksheet.sections[s].intent)}{field('중심 내용',worksheet.sections[s].main)}{field('활용할 자료',worksheet.sections[s].media)}</div>)}</>}
  {step===6&&<><p className="muted">발표 내용 조직을 마친 뒤 예상 청중의 입장에서 검토한 결과입니다.</p><div className="trait"><h3>예상 청중의 의견</h3><p className="wrap">{worksheet.review||'아직 검토하지 않았습니다.'}</p></div></>}
  <div className="divider"/><div className="row between no-print"><button className="secondary" disabled={step===1} onClick={()=>setStep(s=>s-1)}>← 이전 단계</button><button disabled={step===6} onClick={()=>setStep(s=>s+1)}>다음 단계 →</button></div>
  </section>
 </main>;
}
