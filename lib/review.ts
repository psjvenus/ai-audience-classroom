import {Worksheet,TRAITS,SECTIONS} from './data';

export function reviewPresentation(w:Worksheet):string {
 const lines:string[]=[];
 const has=(s:string)=>s.trim().length>0;
 const audience=w.audience.trim()||'여러분';
 lines.push(`안녕! 나는 발표를 들을 ${audience}의 입장에서 생각해 봤어. 발표 계획을 읽고 궁금한 점을 이야기할게!`);
 if(!has(w.topic)||!has(w.purpose))lines.push('먼저 어떤 주제로, 무엇을 위해 발표하는지 알려주면 좋겠어.');
 else lines.push(`‘${w.topic.slice(0,70)}’에 대한 발표구나! 발표 목적이 잘 드러나는지 살펴봐 줘.`);
 const intro=w.sections['도입부'].main;
 if(!has(intro))lines.push('도입부에서 어떤 이야기를 할지 아직 모르겠어. 내가 관심을 가질 만한 질문이나 예시로 시작해 줄래?');
 else if(intro.trim().length<35)lines.push('도입부를 조금만 더 구체적으로 써 줘. 어떤 질문이나 사례로 내 관심을 끌지 궁금해!');
 else lines.push('도입부에 쓴 내용으로 청중의 관심을 끌 수 있을지 친구들에게 직접 물어보면 좋겠어.');
 const mid=w.sections['전개부'].main;
 if(!has(mid))lines.push('전개부의 핵심 내용이 비어 있어. 주장이나 설명을 뒷받침할 근거를 알려 줘.');
 else if(mid.trim().length<55)lines.push('전개부에서 근거나 구체적인 예시를 조금 더 넣어 주면 이해하기 쉬울 것 같아.');
 else lines.push('전개부에서 핵심 내용과 근거가 자연스럽게 이어지는지 확인해 줘.');
 if(!has(w.sections['정리부'].main))lines.push('정리부에서 가장 기억해야 할 내용과 내가 해야 할 일을 다시 알려 줘.');
 else lines.push('정리부를 듣고 내가 꼭 기억해야 할 내용이 한 문장으로 남는지 확인해 줘.');
 const media=w.materials.filter(m=>has(m.title));
 const used=SECTIONS.some(s=>has(w.sections[s].media));
 if(!media.length||!used)lines.push('사진, 그림, 그래프 같은 자료를 어디서 어떻게 보여 줄지 더 구체적으로 알려 주면 좋겠어.');
 else lines.push('선택한 자료가 발표 내용과 잘 맞고, 청중이 보기 쉽게 만들어졌는지 확인해 줘.');
 for(const t of TRAITS){
  const info=w.traits[t];
  if(has(info.summary)&&!has(info.reflect))lines.push(`‘${t}’에서 정리한 청중 특성이 발표 계획에 어떻게 반영됐는지 알려 줘.`);
  else if(has(info.summary)&&has(info.reflect)&&!has(info.reason))lines.push(`‘${t}’을 고려한 좋은 생각이 있어 보여. 왜 그렇게 정했는지도 설명해 줘.`);
 }
 if(!TRAITS.some(t=>has(w.traits[t].summary)))lines.push('내 배경지식과 관심사, 좋아하는 자료가 무엇인지 먼저 살펴보고 발표에 반영해 줘.');
 lines.push('이건 작성한 내용을 바탕으로 만든 자동 점검 의견이야. 실제 발표의 설득력이나 사실관계를 직접 판단한 것은 아니니, 모둠원끼리 의견을 나누고 수정해 봐!');
 return lines.join('\n\n');
}
