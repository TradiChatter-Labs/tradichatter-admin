import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AffiliateSection() {
  const router = useRouter();
  useEffect(() => { router.replace('/affiliate-management'); }, []);
  return null;
}
