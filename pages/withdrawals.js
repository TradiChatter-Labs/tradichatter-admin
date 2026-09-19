import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function WithdrawalsPage() {
  const router = useRouter();
  useEffect(() => { router.replace('/affiliate-settings'); }, []);
  return null;
}
