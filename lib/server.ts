import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { cookies, headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export function db() {
 const url=process.env.SUPABASE_URL, key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!key) throw new Error('Supabase 환경 변수가 없습니다. .env.local을 확인하세요.');
 return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
}
type Claims={role:'teacher'|'student';groupId?:string;sessionId?:string;exp:number};
function secret(){const v=process.env.SESSION_SECRET;if(!v||v.length<32)throw new Error('SESSION_SECRET을 32자 이상으로 설정하세요.');return v;}
function sign(data:string){return createHmac('sha256',secret()).update(data).digest('base64url');}
export function token(claims:Omit<Claims,'exp'>,hours:number){const payload=Buffer.from(JSON.stringify({...claims,exp:Date.now()+hours*3600000})).toString('base64url');return payload+'.'+sign(payload);}
export function verify(value?:string):Claims|null {try{if(!value)return null;const [p,s]=value.split('.');if(!p||!s)return null;const a=Buffer.from(sign(p)),b=Buffer.from(s);if(a.length!==b.length||!timingSafeEqual(a,b))return null;const claims=JSON.parse(Buffer.from(p,'base64url').toString()) as Claims;return claims.exp>Date.now()?claims:null;}catch{return null;}}
export async function identity(role:'teacher'|'student'){const jar=await cookies();const c=verify(jar.get('classroom_auth')?.value);return c?.role===role?c:null;}
export function setAuth(response:NextResponse,claims:Omit<Claims,'exp'>,hours:number){response.cookies.set('classroom_auth',token(claims,hours),{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:hours*3600});return response;}
export function bad(message:string,status=400){return NextResponse.json({error:message},{status});}
export function sameOrigin(req:NextRequest){const origin=req.headers.get('origin');if(!origin)return true;try{return new URL(origin).host===new URL(req.url).host;}catch{return false;}}
export function code(length=6){const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';const bytes=randomBytes(length);return Array.from(bytes,b=>chars[b%chars.length]).join('');}
export function pin(){return Array.from(randomBytes(6),b=>String(b%10)).join('');}
