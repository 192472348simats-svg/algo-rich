'use client';

import posthog from 'posthog-js';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function PostHogIdentifier() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.id) {
      posthog.identify(session.user.id, {
        email: session.user.email ?? undefined,
        name: session.user.name ?? undefined,
      });
    }
  }, [session]);

  return null;
}
