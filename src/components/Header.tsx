'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    // Set initial active tab based on window hash on load
    setActiveTab(window.location.hash || '#home');

    // Add event listener for hash changes
    const handleHashChange = () => setActiveTab(window.location.hash || '#home');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <>
      <style>{`
        .catering-dropdown {
          display: none;
        }
        .catering-group:hover .catering-dropdown {
          display: flex;
        }
      `}</style>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '0.4rem 3rem', 
        backgroundColor: '#000', 
        color: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 10px rgba(0,0,0,0.5)'
      }}>
        {/* Left: Logo */}
        <div className="logo" style={{ flex: '1', display: 'flex', alignItems: 'center' }}>
          <Link href="/#home" onClick={() => setActiveTab('#home')}>
            <img 
              src="https://vcsamersham.co.uk/wp-content/uploads/2026/06/WhatsApp-Image-2025-11-03-at-18.48.43-1024x430.jpeg" 
              alt="VCS Amersham Logo" 
              style={{ height: '85px', width: 'auto', objectFit: 'contain', filter: 'brightness(1.1) contrast(1.1)' }}
            />
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <nav style={{ flex: '2', display: 'flex', justifyContent: 'center' }}>
          <ul style={{ 
            display: 'flex', 
            gap: '3rem', 
            listStyle: 'none', 
            margin: 0, 
            padding: 0,
            alignItems: 'center',
            fontSize: '1.1rem'
          }}>
            <li style={{ borderBottom: activeTab === '#home' ? '3px solid #ffea00' : '3px solid transparent', paddingBottom: '4px', transition: 'border-color 0.2s' }}>
              <Link href="/#home" onClick={() => setActiveTab('#home')} style={{ textDecoration: 'none', color: activeTab === '#home' ? '#fff' : '#ccc', fontWeight: 'bold' }}>Home</Link>
            </li>
            <li style={{ borderBottom: activeTab === '#menu' ? '3px solid #ffea00' : '3px solid transparent', paddingBottom: '4px', transition: 'border-color 0.2s' }}>
              <Link href="/#menu" onClick={() => setActiveTab('#menu')} style={{ textDecoration: 'none', color: activeTab === '#menu' ? '#fff' : '#ccc', fontWeight: 'bold', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => { if (activeTab !== '#menu') e.currentTarget.style.color = '#ccc'; }}>Menu</Link>
            </li>
            <li style={{ borderBottom: activeTab === '#contact' ? '3px solid #ffea00' : '3px solid transparent', paddingBottom: '4px', transition: 'border-color 0.2s' }}>
              <Link href="/#contact" onClick={() => setActiveTab('#contact')} style={{ textDecoration: 'none', color: activeTab === '#contact' ? '#fff' : '#ccc', fontWeight: 'bold', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => { if (activeTab !== '#contact') e.currentTarget.style.color = '#ccc'; }}>Contact</Link>
            </li>
            
            <li style={{ position: 'relative', cursor: 'pointer', paddingBottom: '7px' }} className="catering-group">
              <span style={{ textDecoration: 'none', color: '#ccc', fontWeight: 'bold', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = '#ccc'}>
                Catering <span style={{ fontSize: '0.8em' }}>▼</span>
              </span>
              <ul className="catering-dropdown" style={{
                position: 'absolute',
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#fff',
                boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                borderRadius: '8px',
                listStyle: 'none',
                padding: '0.5rem 0',
                margin: '0.5rem 0 0 0',
                minWidth: '220px',
                flexDirection: 'column',
                color: '#333'
              }}>
                <li>
                  <Link href="/live-dosa-catering" style={{ textDecoration: 'none', color: '#333', fontWeight: '500', display: 'block', padding: '0.8rem 1.5rem', transition: 'background-color 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f5f5f5'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>Live Dosa Catering</Link>
                </li>
                <li>
                  <Link href="/outdoor-catering" style={{ textDecoration: 'none', color: '#333', fontWeight: '500', display: 'block', padding: '0.8rem 1.5rem', transition: 'background-color 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f5f5f5'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>Outdoor Catering</Link>
                </li>
              </ul>
            </li>
          </ul>
        </nav>

        {/* Right: CTA Button */}
        <div style={{ flex: '1', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <a href="/#order" style={{
            backgroundColor: '#d38b6d',
            color: '#fff',
            padding: '0.7rem 1.8rem',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '1rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s, background-color 0.2s'
          }}
          onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.backgroundColor = '#c57c5d'; }}
          onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.backgroundColor = '#d38b6d'; }}
          >
            Order Online
          </a>
        </div>
      </header>
    </>
  );
}
