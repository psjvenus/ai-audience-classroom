import { NextRequest,NextResponse } from 'next/server';
import { bad,sameOrigin,setAuth } from '@/lib/server';
export async function POST(req:NextRequest){if(!sameOrigin(req))return bad('허용되지 않은 요청입니다.',403);const {password}=await req.json();const expected=process.env.TEACHER_PASSWORD;if(!expected||expected.length<12)return bad('교사 비밀번호를 환경 변수에 12자 이상으로 설정하세요.',503);if(password!==expected)return bad('비밀번호가 올바르지 않습니다.',401);return setAuth(NextResponse.json({ok:true}),{role:'teacher'},12);}
