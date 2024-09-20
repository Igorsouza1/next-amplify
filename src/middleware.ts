import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAuthenticated } from '@/utils/amplify-utils'; // Função de autenticação

export async function middleware(req: NextRequest) {
  const authenticated = await isAuthenticated();  // Verificar autenticação
  const { pathname } = req.nextUrl;

  if (pathname === '/' && authenticated) {
    return NextResponse.redirect(new URL('/map', req.url));
  }

  if (pathname === '/map' && !authenticated) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ['/', '/map'],
};
