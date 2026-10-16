'use client';
import {useState} from 'react';
import Link from 'next/link';
import {TRAITS,SECTIONS,TYPES,METHODS} from '@/lib/data';

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
  {label:'선호하는 매체 자료 유형 · 예상 청중의 특성',value:'글이 많은 자료보다 사진이나 짧은 그래프를 보여 줬으면 좋겠어.'},
  {label:'선호하는 매체 자료 유형 · 핵심 요약',value:'사진과 간단한 그래프를 선호한다.'},
  {label:'기타 고려 사항 · 예상 청중의 특성',value:'잔반을 남기는 친구를 혼내는 말투보다는 누구나 할 수 있는 방법을 알려 줘.'},
  {label:'기타 고려 사항 · 핵심 요약',value:'비난하는 표현을 피하고 쉬운 실천 방법을 제안해야 한다.'}],
 [{label:'주제 이해도 · 반영할 내용',value:'잔반이 처리되는 과정을 쉬운 말로 짧게 설명한다.'},
  {label:'주제 이해도 · 이유',value:'문제의 원인을 알아야 잔반을 줄여야 하는 이유를 이해할 수 있기 때문이다.'},
  {label:'관심과 흥미 · 반영할 내용',value:'우리 학교 점심시간 상황을 예시로 든다.'},
  {label:'관심과 흥미 · 이유',value:'청중에게 친숙한 상황이라 관심을 끌 수 있기 때문이다.'},
  {label:'선호하는 매체 자료 유형 · 반영할 내용',value:'잔반통 사진과 간단한 막대그래프를 사용한다.'},
  {label:'선호하는 매체 자료 유형 · 이유',value:'말로만 설명하는 것보다 한눈에 이해하기 쉽기 때문이다.'},
  {label:'기타 고려 사항 · 반영할 내용',value:'친구들을 탓하는 대신 작은 실천 방법을 제안한다.'},
  {label:'기타 고려 사항 · 이유',value:'청중이 부담을 느끼지 않고 참여하도록 하기 위해서다.'}],
 [{label:'자료 1 · 제목과 내용',value:'학교 급식 잔반통 사진: 남겨진 음식의 모습을 보여 준다.'},
  {label:'자료 1 · 유형',value:'사진이나 그림'},
  {label:'자료 1 · 재구성 방안',value:'불필요한 배경을 잘라내고 중요한 부분에 표시를 넣는다.'},
  {label:'자료 2 · 제목과 내용',value:'예시 막대그래프: 급식을 남기는 이유에 대한 가상 설문 결과'},
  {label:'자료 2 · 유형',value:'도표나 그래프'},
  {label:'자료 2 · 재구성 방안',value:'항목 수를 줄이고 큰 글씨로 바꿔 한눈에 읽을 수 있게 한다.',hint:'가상 설문 결과는 시범용입니다. 실제 발표에서는 출처가 확인된 자료를 사용하세요.'},
  {label:'자료 3 · 제목과 내용',value:'급식 잔반 줄이기 실천 방법 안내문: 먹을 만큼만 받기, 부족하면 더 받기, 남기기 전에 생각하기를 소개한다.'},
  {label:'자료 3 · 유형',value:'글(책·신문 등)'},
  {label:'자료 3 · 재구성 방안',value:'긴 설명을 세 문장으로 줄이고 중요한 행동은 큰 글씨로 강조한다.'},
  {label:'자료 4 · 제목과 내용',value:'잔반 줄이기 실천 약속 포스터: 오늘부터 실천할 세 가지 방법을 그림과 문구로 보여 준다.'},
  {label:'자료 4 · 유형',value:'사진이나 그림'},
  {label:'자료 4 · 재구성 방안',value:'실천 방법마다 간단한 아이콘을 넣고 멀리서도 읽히도록 글씨 크기를 키운다.'}],
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
 const [stage,setStage]=useState(1);
 const [opened,setOpened]=useState<string[]>([]);
 const [fullError,setFullError]=useState('');
 const fieldValue=(label:string,atStage=stage)=>examples[atStage-1].find(f=>f.label===label)?.value||'';
 const openKey=(label:string,atStage=stage)=>String(atStage)+':'+label;
 const isOpen=(label:string,atStage=stage)=>opened.includes(openKey(label,atStage));
 function toggle(label:string){const k=openKey(label);setOpened(current=>current.includes(k)?current.filter(x=>x!==k):[...current,k]);}
 function changeStage(next:number){setStage(next);window.scrollTo({top:0,behavior:'smooth'});}
 function textArea(label:string,key=label){
   const visible=isOpen(key);
   return <div key={key}><label>{label}</label><textarea className="demo-click-field" readOnly value={visible?fieldValue(key):''} onClick={()=>toggle(key)} title="클릭하면 예시 답안을 보이거나 숨깁니다." aria-label={label+' 예시 답안 열기 또는 숨기기'} placeholder="이 빈칸을 클릭하면 예시 답안이 나타납니다." /></div>;
 }
 function inputField(label:string,key=label){
   return <div key={key}><label>{label}</label><input className="demo-click-field" readOnly value={isOpen(key)?fieldValue(key):''} onClick={()=>toggle(key)} placeholder="클릭하여 예시 확인하기"/></div>;
 }
 function selectField(label:string,values:string[],key=label){
   const value=isOpen(key)?fieldValue(key):'';
   return <div key={key}><label>{label}</label><div className="demo-select-click" role="button" tabIndex={0} aria-label={label+' 예시 선택 내용 보기'} onClick={()=>toggle(key)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle(key);}}}><select value={value} disabled tabIndex={-1} aria-hidden="true"><option value="">클릭하여 예시 확인하기</option>{values.map(t=><option key={t} value={t}>{t}</option>)}</select></div></div>;
 }
 async function fullscreen(){try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen();setFullError('');}catch{setFullError('이 브라우저에서는 전체 화면 전환을 지원하지 않을 수 있습니다.');}}
 return <main className="shell">
  <header className="header"><div><span className="pill">학생 활동 시범 · 가상 예시</span><h1>시범 모둠의 발표 준비</h1><span className="tiny">학생 화면과 같은 구성 · 빈칸을 클릭하면 그 칸에만 예시가 나타납니다. (학생 데이터와 무관)</span></div><div className="row"><button className="secondary" onClick={fullscreen}>⛶ 전체 화면</button><button className="secondary" onClick={()=>window.print()}>인쇄</button><Link className="button secondary" href="/teacher">교사용 화면으로</Link></div></header>
  {fullError&&<p className="error">{fullError}</p>}
  <div className="progress"><div style={{width:`${stage/6*100}%`}}/></div>
  <nav className="stagebar" aria-label="활동 단계">{stages.map((name,i)=><button type="button" key={name} className={stage===i+1?'active':''} onClick={()=>changeStage(i+1)}>{i+1}. {name}</button>)}</nav>
  <section className="card">
   <h2 className="sectionTitle">📝 {stage}. {stages[stage-1]}</h2>
   <p className="tiny">시범용 가상 답안입니다. 각 칸을 누르면 예시가 나타나고, 다시 누르면 숨겨집니다.</p>
   {stage===1&&<><p className="muted">발표 대상, 주제, 목적을 모둠원들과 상의하여 정하세요.</p>{textArea('발표 대상')}{textArea('발표 주제')}{textArea('발표 목적')}</>}
   {stage===2&&<><div className="trait"><h3>먼저 예상 청중 시뮬레이터를 만나 보세요!</h3><p>① 챗봇을 열기 전에 <strong>구글 계정으로 ChatGPT에 로그인</strong>하세요. 학교에서 허용한 계정을 사용하고, 비밀번호를 친구에게 알려 주지 마세요.</p><p>② 아래 버튼을 눌러 예상 청중 시뮬레이터를 새 탭으로 열고 1단계에서 정한 발표 주제, 목적, 대상을 알려 주세요.</p><a className="button" href={GPT_URL} target="_blank" rel="noopener noreferrer">↗ 예상 청중 시뮬레이터 열기</a><p>③ 챗봇이 알려 준 내용을 읽고 이 화면으로 돌아와 아래 활동지를 작성하세요.</p><p className="tiny">이 예시는 실제 챗봇의 응답이 아니라 수업 시범용으로 작성한 가상 답안입니다.</p></div><p className="muted">예상 청중의 특성을 모둠에서 토의하고, 핵심을 우리 모둠의 말로 정리해 보세요.</p>{TRAITS.map(t=><div className="trait" key={t}><h3>{t}</h3>{textArea('예상 청중의 특성',t+' · 예상 청중의 특성')}{textArea('핵심 요약',t+' · 핵심 요약')}</div>)}</>}
   {stage===3&&<><p className="muted">청중의 특성을 고려하여 발표에 반영할 내용과 이유를 작성하세요.</p>{TRAITS.map(t=><div className="trait" key={t}><h3>{t}</h3><p className="tiny">2단계 요약: {isOpen(t+' · 핵심 요약',2)?fieldValue(t+' · 핵심 요약',2):'아직 작성하지 않았어요'}</p>{textArea('내 발표에 반영할 내용',t+' · 반영할 내용')}{textArea('그렇게 정한 이유',t+' · 이유')}</div>)}</>}
   {stage===4&&<><p className="muted">자료의 제목과 내용을 적고, 유형을 선택한 뒤 청중에게 맞게 재구성할 방법을 적으세요.</p>{[1,2,3,4].map(n=><div className="material" key={n}><h3>자료 {n}</h3>{textArea('자료 제목과 내용',`자료 ${n} · 제목과 내용`)}{selectField('자료 유형',TYPES,`자료 ${n} · 유형`)}{textArea('자료 재구성 방안',`자료 ${n} · 재구성 방안`)}{n===2&&<p className="tiny">자료 예시는 실제 조사 결과가 아닌 가상 시범 자료입니다. 실제 발표에서는 출처를 확인하세요.</p>}</div>)}</>}
   {stage===5&&<>{selectField('내용 전개 방식',METHODS)}{SECTIONS.map(s=><div className="trait" key={s}><h3>{s}</h3>{textArea('의도와 목적',s+' · 의도와 목적')}{textArea('중심 내용',s+' · 중심 내용')}{textArea('활용할 자료',s+' · 활용할 자료')}</div>)}</>}
   {stage===6&&<><p className="muted">발표 내용 조직을 마쳤다면 예상 청중의 입장에서 작성 내용을 점검해 보세요.</p><button type="button" onClick={()=>toggle('예상 청중의 의견')}>{isOpen('예상 청중의 의견')?'예상 청중 의견 숨기기':'예상 청중에게 검토받기'}</button>{isOpen('예상 청중의 의견')&&<div className="trait"><h3>예상 청중의 의견</h3><p className="wrap">{fieldValue('예상 청중의 의견')}</p><p className="tiny">시범용으로 미리 작성한 피드백이며 실제 AI가 생성한 답변이 아닙니다.</p></div>}</>}
   <div className="divider"/>
   <div className="row between"><button className="secondary" disabled={stage===1} onClick={()=>changeStage(stage-1)}>← 이전 단계</button><div className="row"><button type="button" className="secondary" onClick={()=>setOpened(curr=>curr.filter(k=>!k.startsWith(stage+':')))}>현재 단계 답안 모두 숨기기</button><button disabled={stage===6} onClick={()=>changeStage(stage+1)}>다음 단계 →</button></div></div>
  </section>
 </main>;
}
