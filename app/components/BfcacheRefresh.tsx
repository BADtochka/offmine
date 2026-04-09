'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BfcacheRefresh() {
  const router = useRouter();

  useEffect(() => {
    const handler = (e: PageTransitionEvent) => {
      if (e.persisted) router.refresh();
    };
    window.addEventListener('pageshow', handler);
    return () => window.removeEventListener('pageshow', handler);
  }, [router]);

  return null;
}
