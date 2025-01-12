// ProtectedLayout.tsx (Client Component)
'use client';

import { ReactNode } from 'react';
import { ShapeProvider } from '@/Context/shapeContext';

export default function ProtectedLayout({
  children,
  isAuthenticated,
}: {
  children: ReactNode;
  isAuthenticated: boolean;
}) {
  if (!isAuthenticated) {
    return <div>Unauthorized Access</div>; // Ou redirecione
  }

  return (
    <ShapeProvider>
      <div>{children}</div>
    </ShapeProvider>
  );
}
