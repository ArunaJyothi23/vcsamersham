'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  restaurant?: any;
  header?: any;
}

export default function Header({ restaurant, header }: HeaderProps = {}) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('home');
  const [cateringOpen, setCateringOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCateringOpen, setMobileCateringOpen] = useState(false);

  const isCateringActive = pathname === '/live-dosa-catering' || pathname === '/outdoor-catering';
  const isHomeActive = pathname === '/' && activeTab === 'home' && !isCateringActive;
  const isMenuActive = pathname === '/' && activeTab === 'menu';
  const isContactActive = pathname === '/' && activeTab === 'contact';

  useEffect(() => {
    if (pathname !== '/') return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + 120;
      const contactEl = document.getElementById('contact');
      const menuEl = document.getElementById('menu');

      if (contactEl && scrollPos >= contactEl.offsetTop) {
        setActiveTab('contact');
      } else if (menuEl && scrollPos >= menuEl.offsetTop) {
        setActiveTab('menu');
      } else {
        setActiveTab('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  useEffect(() => {
    if (window.location.hash) {
      const hash = window.location.hash.substring(1);
      if (hash === 'home') {
        window.history.replaceState(null, '', window.location.pathname || '/');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveTab('home');
        return;
      }
      setActiveTab(hash || 'home');
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          const headerOffset = 85;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 150);
    }
  }, []);

  // Lock background page from scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    setMobileMenuOpen(false);
    if (targetId === 'home') {
      if (window.location.pathname === '/' || window.location.pathname === '') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (window.location.hash) {
          window.history.pushState(null, '', '/');
        }
      }
      setActiveTab('home');
      return;
    }

    if (window.location.pathname === '/' || window.location.pathname === '') {
      e.preventDefault();
      const element = document.getElementById(targetId);
      if (element) {
        const headerOffset = 85;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
      window.history.pushState(null, '', `/#${targetId}`);
      setActiveTab(targetId);
    }
  };

  return (
    <>
      <style>{`
        .header-container {
          position: -webkit-sticky !important;
          position: sticky !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          width: 100% !important;
          z-index: 1000 !important;
          padding: 0.4rem 2.5rem;
          background-color: #000000 !important;
          box-shadow: 0 2px 10px rgba(0,0,0,0.5) !important;
        }
        .header-logo {
          height: 68px;
          width: auto;
          max-width: 180px;
          object-fit: contain;
          filter: brightness(1.1) contrast(1.1);
          display: block;
          transition: height 0.2s ease;
        }
        .desktop-nav {
          display: flex;
        }
        .desktop-cta {
          display: flex;
        }
        .mobile-actions {
          display: none !important;
        }

        @keyframes drawerSlideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        @keyframes drawerFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .mobile-drawer-panel {
          animation: drawerSlideIn 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .mobile-drawer-backdrop {
          animation: drawerFadeIn 0.25s ease-out forwards;
        }

        @media (max-width: 860px) {
          .desktop-nav {
            display: none !important;
          }
          .desktop-cta {
            display: none !important;
          }
          .mobile-actions {
            display: flex !important;
            align-items: center;
            gap: 0.75rem;
          }
          .header-container {
            padding: 0.55rem 1.25rem !important;
            min-height: 64px !important;
          }
          .header-logo {
            height: 56px !important;
            max-width: 175px !important;
          }
        }
      `}</style>

      <header
        className="header-container"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#000',
          color: '#fff',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        {/* Left: Logo */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/" onClick={(e) => handleNavClick(e, 'home')}>
            <img
              src={header?.logo || "/images/migrated/WhatsApp-Image-2025-11-03-at-18.48.43-1024x430.jpeg"}
              alt={restaurant?.name || "VCS Amersham Logo"}
              className="header-logo"
            />
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="desktop-nav" style={{ flex: '2', justifyContent: 'center' }}>
          <ul
            style={{
              display: 'flex',
              gap: '2.5rem',
              listStyle: 'none',
              margin: 0,
              padding: 0,
              alignItems: 'center',
              fontSize: '1.05rem',
            }}
          >
            <li
              style={{
                borderBottom: isHomeActive ? '3px solid #d38b6d' : '3px solid transparent',
                paddingBottom: '4px',
                transition: 'border-color 0.2s',
              }}
            >
              <Link
                href="/"
                onClick={(e) => handleNavClick(e, 'home')}
                style={{
                  textDecoration: 'none',
                  color: isHomeActive ? '#fff' : '#ccc',
                  fontWeight: 'bold',
                }}
              >
                Home
              </Link>
            </li>
            <li
              style={{
                borderBottom: isMenuActive ? '3px solid #d38b6d' : '3px solid transparent',
                paddingBottom: '4px',
                transition: 'border-color 0.2s',
              }}
            >
              <Link
                href="/#menu"
                onClick={(e) => handleNavClick(e, 'menu')}
                style={{
                  textDecoration: 'none',
                  color: isMenuActive ? '#fff' : '#ccc',
                  fontWeight: 'bold',
                  transition: 'color 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = '#fff')}
                onMouseOut={(e) => {
                  if (!isMenuActive) e.currentTarget.style.color = '#ccc';
                }}
              >
                Menu
              </Link>
            </li>
            <li
              style={{
                borderBottom: isContactActive ? '3px solid #d38b6d' : '3px solid transparent',
                paddingBottom: '4px',
                transition: 'border-color 0.2s',
              }}
            >
              <Link
                href="/#contact"
                onClick={(e) => handleNavClick(e, 'contact')}
                style={{
                  textDecoration: 'none',
                  color: isContactActive ? '#fff' : '#ccc',
                  fontWeight: 'bold',
                  transition: 'color 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = '#fff')}
                onMouseOut={(e) => {
                  if (!isContactActive) e.currentTarget.style.color = '#ccc';
                }}
              >
                Contact
              </Link>
            </li>

            <li
              style={{
                position: 'relative',
                cursor: 'pointer',
                paddingBottom: '4px',
                borderBottom: isCateringActive ? '3px solid #d38b6d' : '3px solid transparent',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={() => setCateringOpen(true)}
              onMouseLeave={() => setCateringOpen(false)}
            >
              <span
                style={{
                  textDecoration: 'none',
                  color: isCateringActive ? '#fff' : '#ccc',
                  fontWeight: 'bold',
                  transition: 'color 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = '#fff')}
                onMouseOut={(e) => {
                  if (!isCateringActive) e.currentTarget.style.color = '#ccc';
                }}
              >
                Catering <span style={{ fontSize: '0.7em' }}>▼</span>
              </span>
              {cateringOpen && (
                <ul
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#161616',
                    border: '1px solid #2a2a2a',
                    boxShadow: '0 12px 28px rgba(0,0,0,0.5)',
                    borderRadius: '8px',
                    listStyle: 'none',
                    padding: '0.5rem 0',
                    margin: '0',
                    minWidth: '220px',
                    display: 'flex',
                    flexDirection: 'column',
                    color: '#fff',
                  }}
                >
                  <li>
                    <Link
                      href="/live-dosa-catering"
                      onClick={() => setCateringOpen(false)}
                      style={{
                        textDecoration: 'none',
                        color: '#eee',
                        fontWeight: '500',
                        display: 'block',
                        padding: '0.8rem 1.5rem',
                        transition: 'background-color 0.2s, color 0.2s',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(211, 139, 109, 0.15)';
                        e.currentTarget.style.color = '#d38b6d';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#eee';
                      }}
                    >
                      Live Dosa Catering
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/outdoor-catering"
                      onClick={() => setCateringOpen(false)}
                      style={{
                        textDecoration: 'none',
                        color: '#eee',
                        fontWeight: '500',
                        display: 'block',
                        padding: '0.8rem 1.5rem',
                        transition: 'background-color 0.2s, color 0.2s',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(211, 139, 109, 0.15)';
                        e.currentTarget.style.color = '#d38b6d';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#eee';
                      }}
                    >
                      Outdoor Catering
                    </Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>

        {/* Right: Desktop CTA Button */}
        <div className="desktop-cta" style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
          <a
            href="/#order"
            style={{
              backgroundColor: '#d38b6d',
              color: '#fff',
              padding: '0.7rem 1.6rem',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '0.95rem',
              boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
              transition: 'transform 0.2s, background-color 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.backgroundColor = '#c57c5d';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.backgroundColor = '#d38b6d';
            }}
          >
            {header?.orderButtonText || "Order Online"}
          </a>
        </div>

        {/* Mobile: Hamburger Button */}
        <div className="mobile-actions">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '5px',
              width: '42px',
              height: '42px',
              transition: 'background 0.2s ease',
            }}
          >
            <span
              style={{
                width: '22px',
                height: '2px',
                backgroundColor: '#ffffff',
                borderRadius: '2px',
                transition: 'all 0.3s ease',
                transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
              }}
            />
            <span
              style={{
                width: '22px',
                height: '2px',
                backgroundColor: '#ffffff',
                borderRadius: '2px',
                transition: 'all 0.3s ease',
                opacity: mobileMenuOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                width: '22px',
                height: '2px',
                backgroundColor: '#ffffff',
                borderRadius: '2px',
                transition: 'all 0.3s ease',
                transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
              }}
            />
          </button>
        </div>
      </header>

      {/* Luxury Mobile Off-Canvas Drawer */}
      {mobileMenuOpen && (
        <>
          {/* Dimmed Blurred Backdrop */}
          <div
            className="mobile-drawer-backdrop"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              zIndex: 9998,
              backdropFilter: 'blur(5px)',
              WebkitBackdropFilter: 'blur(5px)',
            }}
          />

          {/* Off-Canvas Sidebar Panel */}
          <div
            className="mobile-drawer-panel"
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: 'min(360px, 90vw)',
              backgroundColor: '#0c0a08',
              borderLeft: '1px solid rgba(211, 139, 109, 0.25)',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              padding: '1.25rem 1.25rem 1.75rem',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              boxShadow: '-10px 0 35px rgba(0, 0, 0, 0.9)',
            }}
          >
            {/* Top Bar: Brand Logo & Glass Close Button */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '1.1rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                marginBottom: '1rem',
              }}
            >
              <Link
                href="/"
                onClick={(e) => handleNavClick(e, 'home')}
                style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '3px' }}
              >
                <img
                  src={header?.logo || "/images/migrated/WhatsApp-Image-2025-11-03-at-18.48.43-1024x430.jpeg"}
                  alt={restaurant?.name || "VCS Amersham Logo"}
                  style={{
                    height: '46px',
                    width: 'auto',
                    objectFit: 'contain',
                    maxWidth: '170px',
                  }}
                />
                <span style={{ fontSize: '0.68rem', letterSpacing: '1px', color: '#d38b6d', fontWeight: 600, textTransform: 'uppercase' }}>
                  Authentic Pure Vegetarian
                </span>
              </Link>

              <button
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  flexShrink: 0,
                }}
              >
                ✕
              </button>
            </div>

            {/* Navigation Links */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {/* Home */}
              <Link
                href="/"
                onClick={(e) => handleNavClick(e, 'home')}
                style={{
                  padding: '12px 14px',
                  borderRadius: '8px',
                  color: activeTab === 'home' ? '#ffffff' : '#dddddd',
                  backgroundColor: activeTab === 'home' ? 'rgba(211, 139, 109, 0.16)' : 'transparent',
                  borderLeft: activeTab === 'home' ? '3px solid #d38b6d' : '3px solid transparent',
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background 0.15s, color 0.15s',
                }}
              >
                <span>Home</span>
                {activeTab === 'home' && (
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#d38b6d' }} />
                )}
              </Link>

              {/* Menu */}
              <Link
                href="/#menu"
                onClick={(e) => handleNavClick(e, 'menu')}
                style={{
                  padding: '12px 14px',
                  borderRadius: '8px',
                  color: activeTab === 'menu' ? '#ffffff' : '#dddddd',
                  backgroundColor: activeTab === 'menu' ? 'rgba(211, 139, 109, 0.16)' : 'transparent',
                  borderLeft: activeTab === 'menu' ? '3px solid #d38b6d' : '3px solid transparent',
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background 0.15s, color 0.15s',
                }}
              >
                <span>Menu</span>
                {activeTab === 'menu' && (
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#d38b6d' }} />
                )}
              </Link>

              {/* Contact */}
              <Link
                href="/#contact"
                onClick={(e) => handleNavClick(e, 'contact')}
                style={{
                  padding: '12px 14px',
                  borderRadius: '8px',
                  color: activeTab === 'contact' ? '#ffffff' : '#dddddd',
                  backgroundColor: activeTab === 'contact' ? 'rgba(211, 139, 109, 0.16)' : 'transparent',
                  borderLeft: activeTab === 'contact' ? '3px solid #d38b6d' : '3px solid transparent',
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background 0.15s, color 0.15s',
                }}
              >
                <span>Contact</span>
                {activeTab === 'contact' && (
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#d38b6d' }} />
                )}
              </Link>

              {/* Catering Submenu Accordion */}
              <div style={{ borderRadius: '8px', overflow: 'hidden' }}>
                <div
                  onClick={() => setMobileCateringOpen(!mobileCateringOpen)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    color: isCateringActive ? '#ffffff' : '#dddddd',
                    fontSize: '1.05rem',
                    fontWeight: isCateringActive ? 700 : 600,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: isCateringActive || mobileCateringOpen ? 'rgba(211, 139, 109, 0.12)' : 'transparent',
                    borderLeft: isCateringActive ? '3px solid #d38b6d' : '3px solid transparent',
                  }}
                >
                  <span style={{ color: isCateringActive ? '#ffffff' : '#dddddd' }}>Catering Services</span>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: '#d38b6d',
                      transition: 'transform 0.25s ease',
                      transform: mobileCateringOpen || isCateringActive ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  >
                    ▼
                  </span>
                </div>

                {(mobileCateringOpen || isCateringActive) && (
                  <div
                    style={{
                      padding: '6px 10px 10px 22px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      borderLeft: '2px solid rgba(211, 139, 109, 0.3)',
                      marginLeft: '14px',
                      marginTop: '4px',
                      borderRadius: '0 8px 8px 0',
                    }}
                  >
                    <Link
                      href="/live-dosa-catering"
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        color: pathname === '/live-dosa-catering' ? '#ffffff' : '#f0ede6',
                        fontSize: '0.95rem',
                        fontWeight: pathname === '/live-dosa-catering' ? 700 : 500,
                        textDecoration: 'none',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: pathname === '/live-dosa-catering' ? 'rgba(211, 139, 109, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      }}
                    >
                      <span style={{ color: '#d38b6d' }}>›</span>
                      <span>Live Dosa Catering</span>
                    </Link>
                    <Link
                      href="/outdoor-catering"
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        color: pathname === '/outdoor-catering' ? '#ffffff' : '#f0ede6',
                        fontSize: '0.95rem',
                        fontWeight: pathname === '/outdoor-catering' ? 700 : 500,
                        textDecoration: 'none',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: pathname === '/outdoor-catering' ? 'rgba(211, 139, 109, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      }}
                    >
                      <span style={{ color: '#d38b6d' }}>›</span>
                      <span>Outdoor Catering</span>
                    </Link>
                  </div>
                )}
              </div>
            </nav>

            {/* Primary Order Online CTA */}
            <div style={{ marginTop: '1.25rem', marginBottom: '1.25rem' }}>
              <a
                href="/#order"
                onClick={(e) => handleNavClick(e, 'order')}
                style={{
                  background: 'linear-gradient(135deg, #d38b6d 0%, #b86e52 100%)',
                  color: '#ffffff',
                  textAlign: 'center',
                  padding: '14px 20px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(211, 139, 109, 0.35)',
                  letterSpacing: '0.3px',
                }}
              >
                <span>🛒</span>
                <span>Order Online Now</span>
              </a>
            </div>

            {/* Quick Action Buttons (Call & Directions) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                marginBottom: '1.25rem',
              }}
            >
              <a
                href={`tel:${(restaurant?.phone || "+44 1494 972550").replace(/\s+/g, '')}`}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  padding: '9px 8px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <span>📞</span> Call Us
              </a>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(restaurant?.address || "94 Sycamore Road Amersham HP6 5EN")}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  padding: '9px 8px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <span>📍</span> Location
              </a>
            </div>

            {/* Restaurant Info Card at Bottom */}
            <div
              style={{
                marginTop: 'auto',
                padding: '1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '10px',
                fontSize: '0.82rem',
                color: '#aaaaaa',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#d38b6d' }}>📞</span>
                <a href="tel:+01494972550" style={{ color: '#d5d5d5', textDecoration: 'none', fontWeight: 500 }}>
                  +0149 497 2550
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#d38b6d' }}>✉️</span>
                <a href="mailto:vcsramersham@gmail.com" style={{ color: '#d5d5d5', textDecoration: 'none' }}>
                  vcsramersham@gmail.com
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: '#d38b6d', marginTop: '1px' }}>📍</span>
                <span style={{ color: '#bbb', lineHeight: '1.3' }}>94, Sycamore Road, Amersham, HP6 5EN</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '6px', marginTop: '2px', color: '#888' }}>
                <span>🕒</span>
                <span>Mon-Fri: 12pm-10pm · Sat-Sun: 11am-10pm</span>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
