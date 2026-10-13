import { NextRequest,NextResponse } from 'next/server';
import { identity,db,bad,sameOrigin,code,pin } from '@/lib/server';
export async function GET(){if(!await identity('teacher'))return bad('교사 인증이 필요합니다.',401);try{const {data,error}=await db().from('class_sessions').select('*').order('created_at',{ascending:false}).limit(30);if(error)throw error;return NextResponse.json({sessions:data});}catch(e){return bad('수업 조회 실패: '+String(e),500);}}
export async function POST(req:NextRequest){if(!sameOrigin(req))return bad('허용되지 않은 요청입니다.',403);if(!await identity('teacher'))return bad('교사 인증이 필요합니다.',401);const body=await req.json();const title=String(body.title||'').trim().slice(0,100);const count=Number(body.groupCount);if(!title||!Number.isInteger(count)||count<1||count>30)return bad('수업 이름과 1~30개 모둠 수를 입력하세요.');try{const client=db();let session:any=null;for(let i=0;i<5;i++){const {data,error}=await client.from('class_sessions').insert({title,join_code:code()}).select().single();if(!error){session=data;break;}if(error.code!=='23505')throw error;}if(!session)throw new Error('참여 코드 생성 실패');const groups=Array.from({length:count},(_,i)=>({session_id:session.id,group_number:i+1,join_pin:pin()}));const {error}=await client.from('class_groups').insert(groups);if(error){await client.from('class_sessions').delete().eq('id',session.id);throw error;}return NextResponse.json({session});}catch(e){return bad('수업 생성 실패: '+String(e),500);}}

export async function DELETE(req:NextRequest){
 if(!sameOrigin(req))return bad('허용되지 않은 요청입니다.',403);
 if(!await identity('teacher'))return bad('교사 인증이 필요합니다.',401);
 let body:unknown;try{body=await req.json();}catch{return bad('삭제할 수업을 확인해 주세요.');}
 const input=body as {sessionId?:unknown;confirmation?:unknown};
 const id=String(input?.sessionId||'');
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id))return bad('올바른 수업을 선택해 주세요.');
 if(input?.confirmation!=='삭제')return bad('삭제 확인 문구가 올바르지 않습니다.');
 try{
  const client=db();
  const {data:session,error:lookupError}=await client.from('class_sessions').select('id').eq('id',id).single();
  if(lookupError||!session)return bad('수업을 찾을 수 없습니다.',404);
  const {data:deleted,error}=await client.from('class_sessions').delete().eq('id',id).select('id');
  if(error)throw error;
  if(!deleted?.length)return bad('수업을 삭제하지 못했습니다.',409);
  return NextResponse.json({ok:true});
 }catch{return bad('수업 삭제에 실패했습니다.',503);}
}
