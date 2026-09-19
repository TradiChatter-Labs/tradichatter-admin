import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AffiliatePayouts() {
  const router = useRouter();
  useEffect(() => { router.replace('/affiliate-settings'); }, []);
  return null;
}
