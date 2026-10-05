'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';

interface ClientLayoutProps {
  children: React.ReactNode;
  siteContent?: any;
}

export default function ClientLayout({ children, siteContent }: ClientLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = pathname?.startsWith('/admin');

  useEffect(() => {
    if (isAdmin) return;

    // Track the initial content version timestamp when this tab opened
    let initialVersion = typeof window !== 'undefined' ? localStorage.getItem('vcs_last_content_save') : null;

    const reloadLiveSite = () => {
      // Clean full-page reload ensures latest server HTML and zero client-cache lag
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    };

    // 1. Instant cross-tab sync via BroadcastChannel
    let channel: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        channel = new BroadcastChannel('vcs_content_channel');
        channel.onmessage = (event) => {
          if (event.data?.type === 'CONTENT_SAVED') {
            reloadLiveSite();
          }
        };
      }
    } catch (err) {}

    // 2. Cross-tab sync via standard storage event
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'vcs_last_content_save') {
        reloadLiveSite();
      }
    };
    window.addEventListener('storage', handleStorage);

    // 3. Tab-switching sync: when user clicks over from Admin tab to Live Site tab
    const handleTabFocus = () => {
      if (document.visibilityState === 'visible') {
        const latest = localStorage.getItem('vcs_last_content_save');
        if (latest && latest !== initialVersion) {
          initialVersion = latest;
          reloadLiveSite();
        }
      }
    };
    document.addEventListener('visibilitychange', handleTabFocus);
    window.addEventListener('focus', handleTabFocus);

    return () => {
      channel?.close();
      window.removeEventListener('storage', handleStorage);
      document.removeEventListener('visibilitychange', handleTabFocus);
      window.removeEventListener('focus', handleTabFocus);
    };
  }, [isAdmin]);

  if (isAdmin) {
    return <div style={{ width: '100%', minHeight: '100vh' }}>{children}</div>;
  }

  return (
    <>
      <Header restaurant={siteContent?.restaurant} header={siteContent?.header} />
      <main style={{ flex: 1, width: '100%', overflowX: 'clip' }}>
        {children}
      </main>
      <Footer footer={siteContent?.footer} restaurant={siteContent?.restaurant} />
    </>
  );
}

