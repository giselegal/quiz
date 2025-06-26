
'use client';

import React from 'react';

// Removido dynamic import do Next.js - não é necessário no Vite
const LovableClientProvider = React.lazy(() => 
  import('./LovableClientProvider').then(mod => ({ default: mod.LovableClientProvider }))
);

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <LovableClientProvider>
        {children}
      </LovableClientProvider>
    </React.Suspense>
  );
}
