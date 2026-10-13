'use client';
import {useEffect,useState} from 'react';
import {QRCodeSVG} from 'qrcode.react';

const STUDENT_URL='https://ai-audience-classroom.vercel.app/student';

export default function StudentQrButton(){
 const [open,setOpen]=useState(false);
 useEffect(()=>{
  if(!open)return;
  const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false);};
  document.addEventListener('keydown',onKey);
  return ()=>document.removeEventListener('keydown',onKey);
 },[open]);
 return <>
  <button type="button" className="secondary qr-open-button" onClick={()=>setOpen(true)}>▦ QR코드 크게 보기</button>
  {open&&<div className="qr-overlay" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setOpen(false)}}>
    <section role="dialog" aria-modal="true" aria-labelledby="student-qr-heading" className="qr-dialog">
     <div className="row between">
      <h2 id="student-qr-heading" className="title">학생용 QR코드</h2>
      <button type="button" className="secondary" onClick={()=>setOpen(false)}>✕ 닫기</button>
     </div>
     <p>학생들은 아래 코드를 스캔해 모둠 입장 화면으로 접속하세요.</p>
     <div className="qr-code-frame"><QRCodeSVG value={STUDENT_URL} size={500} bgColor="#FFFFFF" fgColor="#17152E" level="H" marginSize={4} title="학생용 수업 입장 QR코드"/></div>
     <a href={STUDENT_URL} target="_blank" rel="noopener noreferrer" className="qr-address">{STUDENT_URL}</a>
     <p className="muted">입장 후 교사가 안내한 참여 코드와 모둠 비밀번호를 입력하세요.</p>
    </section>
   </div>}
 </>;
}
