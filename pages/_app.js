import '../styles/globals.css';
import Layout from '../components/Layout';
import AuthWrapper from '../components/AuthWrapper';
import { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  
  if (router.pathname === '/login') {
    return (
      <AuthWrapper>
        <Component {...pageProps} />
        <Toaster position="top-right" />
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper>
      <Layout>
        <Component {...pageProps} />
        <Toaster position="top-right" />
      </Layout>
    </AuthWrapper>
  );
}