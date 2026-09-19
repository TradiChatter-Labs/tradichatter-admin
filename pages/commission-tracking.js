import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function CommissionTracking() {
  const router = useRouter();
  useEffect(() => { router.replace('/affiliate-settings'); }, []);
  return null;
}
