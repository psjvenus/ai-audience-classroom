import Link from 'next/link';
import StudentQrButton from './StudentQrButton';
export default function Home(){return <main className="landing"><div className="hero"><span className="pill">중학교 2학년 국어 · 청중을 고려하여 발표하기</span><h1>예상 청중 자료로 준비하는<br/>발표 내용 생성·조직</h1><p>예상 청중 자료를 분석하고, 생각을 정리하고, 모둠별 발표 계획을 완성해요.</p><div className="actions"><Link className="button" href="/student">학생 · 모둠 입장</Link><Link className="button outline" href="/teacher">교사 · 수업 관리</Link><StudentQrButton/></div></div><p className="footnote">학생은 계정 없이 수업 참여 코드와 모둠 비밀번호로 입장합니다.</p></main>}
