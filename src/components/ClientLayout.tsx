'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
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
  const currentVersionRef = useRef<number | null>(null);

  useEffect(() => {
    if (isAdmin) return;

    // 1. Instant cross-tab sync via BroadcastChannel
    let channel: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        channel = new BroadcastChannel('vcs_content_channel');
        channel.onmessage = (event) => {
          if (event.data?.type === 'CONTENT_SAVED') {
            router.refresh();
            setTimeout(() => {
              window.location.reload();
            }, 300);
          }
        };
      }
    } catch (err) {
      // Ignore
    }

    // 2. Storage event listener (standard browser cross-tab sync)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'vcs_last_content_save') {
        router.refresh();
        setTimeout(() => {
          window.location.reload();
        }, 300);
      }
    };
    window.addEventListener('storage', handleStorage);

    // 3. Tab visibility / window focus check
    const checkVersion = async () => {
      try {
        const res = await fetch('/api/content-version', { cache: 'no-store' });
        const json = await res.json();
        if (json?.version) {
          if (currentVersionRef.current === null) {
            currentVersionRef.current = json.version;
          } else if (json.version > currentVersionRef.current) {
            currentVersionRef.current = json.version;
            router.refresh();
            setTimeout(() => {
              window.location.reload();
            }, 300);
          }
        }
      } catch (e) {
        // Silently ignore network hiccup
      }
    };

    const handleFocus = () => {
      if (document.visibilityState === 'visible') {
        checkVersion();
      }
    };
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    // 4. Lightweight polling check every 3 seconds (only when tab is visible)
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        checkVersion();
      }
    }, 3000);

    // Initial check
    checkVersion();

    return () => {
      channel?.close();
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
      clearInterval(interval);
    };
  }, [isAdmin, router]);

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

