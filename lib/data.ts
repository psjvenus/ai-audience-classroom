export type Material = { title: string; type: string; reframe: string };
export type Section = { intent: string; main: string; media: string };
export type Trait = { quote: string; summary: string; reflect: string; reason: string };
export type Worksheet = {
 audience: string; topic: string; purpose: string;
 traits: Record<string, Trait>;
 materials: Material[];
 method: string;
 sections: Record<string, Section>;
};
export type ChatMessage = { role: 'student' | 'ai'; body: string };
export const TRAITS = ['주제 이해도', '관심과 흥미', '선호하는 매체 자료 유형', '기타 고려 사항'];
export const SECTIONS = ['도입부', '전개부', '정리부'];
export const TYPES = ['글(책·신문 등)', '사진이나 그림', '도표나 그래프', '동영상', '실물'];
export const METHODS = ['시간 순서', '공간의 이동', '원인과 결과', '문제와 문제 해결', '기타'];
export function emptyWorksheet(): Worksheet {
 return { audience:'', topic:'', purpose:'', traits:Object.fromEntries(TRAITS.map(t=>[t,{quote:'',summary:'',reflect:'',reason:''}])), materials:Array.from({length:4},()=>({title:'',type:'',reframe:''})), method:'문제와 문제 해결', sections:Object.fromEntries(SECTIONS.map(s=>[s,{intent:'',main:'',media:''}])) };
}
export function normalizeWorksheet(value: unknown): Worksheet {
 const base=emptyWorksheet();
 if (!value || typeof value!=='object' || Array.isArray(value)) return base;
 const v=value as Record<string,any>;
 const clean=(s:unknown,max=3000)=>typeof s==='string'?s.slice(0,max):'';
 for(const k of ['audience','topic','purpose'] as const) base[k]=clean(v[k],300);
 for(const t of TRAITS) for(const k of ['quote','summary','reflect','reason'] as const) base.traits[t][k]=clean(v.traits?.[t]?.[k]);
 for(let i=0;i<4;i++) for(const k of ['title','type','reframe'] as const) base.materials[i][k]=clean(v.materials?.[i]?.[k]);
 base.method=METHODS.includes(v.method)?v.method:'기타';
 for(const s of SECTIONS) for(const k of ['intent','main','media'] as const) base.sections[s][k]=clean(v.sections?.[s]?.[k]);
 return base;
}
