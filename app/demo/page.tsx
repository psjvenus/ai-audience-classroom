'use client';
import {useState} from 'react';
import Link from 'next/link';
import {TRAITS,SECTIONS} from '@/lib/data';

const GPT_URL='https://chatgpt.com/g/g-6ac9ccb073708191a5e6f7c62f70ca6d-yesangceongjung-simyulreiteo';
const stages=['발표 계획','청중 특성 분석','청중 특성 반영','자료 조사·재구성','발표 내용 조직','예상 청중 검토'];
type Example={label:string;value:string;hint?:string};
const examples:Example[][]=[
 [{label:'발표 대상',value:'우리 학교 2학년 학생들'},
  {label:'발표 주제',value:'급식 잔반을 줄이자'},
  {label:'발표 목적',value:'친구들이 급식을 먹을 만큼만 받고 잔반 줄이기를 실천하도록 설득하기'}],
 [{label:'주제 이해도 · 예상 청중의 특성',value:'급식 잔반이 무엇인지는 알지만, 남긴 음식이 어떻게 처리되는지는 잘 몰라.'},
  {label:'주제 이해도 · 핵심 요약',value:'잔반 처리 과정과 문제점에 대한 배경지식이 부족하다.'},
  {label:'관심과 흥미 · 예상 청중의 특성',value:'우리 학교 급식 메뉴나 친구들 이야기가 나오면 관심이 생길 것 같아.'},
  {label:'관심과 흥미 · 핵심 요약',value:'학교 급식과 관련된 실제 사례에 흥미를 느낀다.'},
  {label:'선호 매체 자료 유형 · 예상 청중의 특성',value:'글이 많은 자료보다 사진이나 짧은 그래프를 보여 줬으면 좋겠어.'},
  {label:'선호 매체 자료 유형 · 핵심 요약',value:'사진과 간단한 그래프를 선호한다.'},
  {label:'기타 고려 사항 · 예상 청중의 특성',value:'잔반을 남기는 친구를 혼내는 말투보다는 누구나 할 수 있는 방법을 알려 줘.'},
  {label:'기타 고려 사항 · 핵심 요약',value:'비난하는 표현을 피하고 쉬운 실천 방법을 제안해야 한다.'}],
 [{label:'주제 이해도 · 반영할 내용',value:'잔반이 처리되는 과정을 쉬운 말로 짧게 설명한다.'},
  {label:'주제 이해도 · 이유',value:'문제의 원인을 알아야 잔반을 줄여야 하는 이유를 이해할 수 있기 때문이다.'},
  {label:'관심과 흥미 · 반영할 내용',value:'우리 학교 점심시간 상황을 예시로 든다.'},
  {label:'관심과 흥미 · 이유',value:'청중에게 친숙한 상황이라 관심을 끌 수 있기 때문이다.'},
  {label:'선호 매체 자료 유형 · 반영할 내용',value:'잔반통 사진과 간단한 막대그래프를 사용한다.'},
  {label:'선호 매체 자료 유형 · 이유',value:'말로만 설명하는 것보다 한눈에 이해하기 쉽기 때문이다.'},
  {label:'기타 고려 사항 · 반영할 내용',value:'친구들을 탓하는 대신 작은 실천 방법을 제안한다.'},
  {label:'기타 고려 사항 · 이유',value:'청중이 부담을 느끼지 않고 참여하도록 하기 위해서다.'}],
 [{label:'자료 1 · 제목과 내용',value:'학교 급식 잔반통 사진: 남겨진 음식의 모습을 보여 준다.'},
  {label:'자료 1 · 유형',value:'사진이나 그림'},
  {label:'자료 1 · 재구성 방안',value:'불필요한 배경을 잘라내고 중요한 부분에 표시를 넣는다.'},
  {label:'자료 2 · 제목과 내용',value:'예시 막대그래프: 급식을 남기는 이유에 대한 가상 설문 결과'},
  {label:'자료 2 · 유형',value:'도표나 그래프'},
  {label:'자료 2 · 재구성 방안',value:'항목 수를 줄이고 큰 글씨로 바꿔 한눈에 읽을 수 있게 한다.',hint:'가상 설문 결과는 시범용입니다. 실제 발표에서는 출처가 확인된 자료를 사용하세요.'}],
 [{label:'내용 전개 방식',value:'문제와 문제 해결'},
  {label:'도입부 · 의도와 목적',value:'학생들의 경험을 떠올리게 하여 관심을 끈다.'},
  {label:'도입부 · 중심 내용',value:'“오늘 급식에서 음식을 남긴 적이 있나요?”라고 질문하고 급식 잔반통 사진을 보여 준다.'},
  {label:'도입부 · 활용할 자료',value:'급식 잔반통 사진'},
  {label:'전개부 · 의도와 목적',value:'잔반 문제와 이를 줄일 방법을 설명하고 설득한다.'},
  {label:'전개부 · 중심 내용',value:'잔반이 생기는 이유를 소개하고, 처음에는 조금만 받기·부족하면 더 받기·먹을 수 있는 양 생각하기를 제안한다.'},
  {label:'전개부 · 활용할 자료',value:'급식을 남기는 이유를 보여 주는 예시 그래프'},
  {label:'정리부 · 의도와 목적',value:'핵심 메시지를 기억하고 실천하게 한다.'},
  {label:'정리부 · 중심 내용',value:'“오늘 점심부터 먹을 만큼만 받자!”라는 실천 약속으로 발표를 마무리한다.'},
  {label:'정리부 · 활용할 자료',value:'세 가지 실천 방법을 정리한 슬라이드'}],
 [{label:'예상 청중의 의견',value:'안녕! 우리 학교 급식 이야기라서 관심이 가. 도입부에서 사진을 보여 주면 문제를 쉽게 이해할 것 같아. 다만 잔반이 얼마나 발생하는지 실제 자료도 있으면 더 설득될 것 같아. 마지막에는 우리가 오늘 바로 실천할 방법을 다시 한번 강조해 줘!',hint:'시범용으로 미리 작성한 피드백이며 실제 AI가 생성한 내용이 아닙니다.'},
  {label:'발표 수정 계획',value:'우리 학교나 공공기관에서 발표한 실제 잔반 관련 자료를 찾아 출처와 함께 추가한다. 정리부의 실천 방법을 더 크게 보여 준다.'}]
];

export default function Demo(){
 const [stage,setStage]=useState(0);
 const [revealed,setRevealed]=useState(0);
 const [showGuide,setShowGuide]=useState(false);
 const [fullError,setFullError]=useState('');
 const fields=examples[stage];
 const allShown=revealed>=fields.length;
 function changeStage(next:number){setStage(next);setRevealed(0);setShowGuide(false);window.scrollTo({top:0,behavior:'smooth'});}
 async function fullscreen(){try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen();setFullError('');}catch{setFullError('전체 화면 전환을 사용할 수 없는 환경입니다.');}}
 return <main className="shell demo-shell">
  <header className="header"><div><span className="pill">교사용 학생 활동 시범 · 가상 자료</span><h1>시범 모둠의 발표 준비</h1><span className="tiny">클릭할 때마다 예시 답안이 하나씩 열립니다. 학생 기록과 연결되지 않습니다.</span></div><div className="row"><button className="secondary" onClick={fullscreen}>⛶ 전체 화면</button><Link className="button secondary" href="/teacher">교사용 화면으로</Link></div></header>
  {fullError&&<p className="error">{fullError}</p>}
  <div className="progress"><div style={{width:`${(stage+1)/6*100}%`}}/></div>
  <nav className="stagebar" aria-label="시범 단계">{stages.map((name,i)=><button type="button" key={name} className={stage===i?'active':''} onClick={()=>changeStage(i)}>{i+1}. {name}</button>)}</nav>
  <section className="card demo-card">
   <div className="row between"><h2 className="sectionTitle">📝 {stage+1}. {stages[stage]}</h2><span className="tag">{revealed} / {fields.length}개 공개</span></div>
   <p className="muted">발표 주제: <strong>급식 잔반을 줄이자</strong> · 시범용 가상 자료</p>
   {stage===1&&<div className="trait">
     <h3>먼저 예상 청중 시뮬레이터를 만나 보세요!</h3>
     <p>실제 학생들은 챗봇을 열기 전에 구글 계정으로 ChatGPT에 로그인하고, 발표 주제·목적·대상을 입력해 청중의 특성을 확인합니다.</p>
     <button type="button" className="secondary" onClick={()=>setShowGuide(s=>!s)}>{showGuide?'설명 접기':'챗봇 사용 방법 보여주기'}</button>
     {showGuide&&<div className="material"><p>① 구글 계정으로 ChatGPT 로그인</p><p>② 새 탭에서 챗봇 열기</p><p>③ 발표 주제·목적·대상 말하기</p><p>④ 청중이 알려 준 내용으로 2단계 활동지 작성하기</p><a href={GPT_URL} className="button" target="_blank" rel="noopener noreferrer">↗ 예상 청중 챗봇 열기</a></div>}
    </div>}
   <div className="stack" aria-live="polite">
    {fields.slice(0,revealed).map((f,i)=><div className="trait demo-reveal" key={stage+'-'+i}><h3>{f.label}</h3><div className="demo-answer">{f.value}</div>{f.hint&&<p className="tiny">{f.hint}</p>}</div>)}
   </div>
   {!allShown&&<div className="demo-next-card"><p className="muted">다음 예시 내용을 학생들에게 하나씩 공개할 수 있습니다.</p><button type="button" onClick={()=>setRevealed(n=>Math.min(n+1,fields.length))}>예시 하나씩 보여주기 ({revealed+1}/{fields.length}) →</button></div>}
   {allShown&&<p className="success">이 단계의 예시를 모두 살펴봤습니다.</p>}
   <div className="divider"/>
   <div className="row between"><button className="secondary" disabled={stage===0} onClick={()=>changeStage(stage-1)}>← 이전 단계</button><div className="row"><button type="button" className="secondary" onClick={()=>setRevealed(0)}>현재 단계 다시 시작</button><button disabled={stage===5} onClick={()=>changeStage(stage+1)}>다음 단계 →</button></div></div>
  </section>
 </main>;
}
