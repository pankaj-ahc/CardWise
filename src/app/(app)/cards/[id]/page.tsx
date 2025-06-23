
'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function CardDetailRedirectPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  useEffect(() => {
    if (params.id) {
      router.replace(`/cards/${params.id}/bills`);
    }
  }, [router, params.id]);

  return null;
}
