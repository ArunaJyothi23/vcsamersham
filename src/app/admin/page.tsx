'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  const [activeTab, setActiveTab] = useState<'hero' | 'general' | 'topFood' | 'about' | 'faqs' | 'reviews' | 'menu'>('hero');
  const [siteData, setSiteData] = useState<any>(null);
  const [menuData, setMenuData] = useState<any>(null);
  const [selectedMenuCategory, setSelectedMenuCategory] = useState<string>('');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    confirmColor?: string;
    onConfirm: () => void;
  } | null>(null);

  function requestConfirm(options: {
    title: string;
    message: string;
    confirmLabel?: string;
    confirmColor?: string;
    onConfirm: () => void;
  }) {
    setConfirmDialog({
      isOpen: true,
      title: options.title,
      message: options.message,
      confirmLabel: options.confirmLabel || 'Delete',
      confirmColor: options.confirmColor || '#E11D48',
      onConfirm: options.onConfirm,
    });
  }

  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (url: string) => void,
    targetId: string
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 12 * 1024 * 1024) {
      setStatusMessage({ type: 'error', text: 'Image file exceeds 12MB limit. Please upload a smaller image.' });
      setTimeout(() => setStatusMessage(null), 5000);
      return;
    }

    setUploadingTarget(targetId);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        onSuccess(data.url);
        setStatusMessage({ type: 'success', text: `Image uploaded successfully: ${file.name}` });
        setTimeout(() => setStatusMessage(null), 4000);
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to upload image.' });
        setTimeout(() => setStatusMessage(null), 5000);
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setStatusMessage({ type: 'error', text: 'Upload failed: ' + (err.message || 'Network error') });
      setTimeout(() => setStatusMessage(null), 5000);
    } finally {
      setUploadingTarget(null);
      e.target.value = '';
    }
  }

  // Check saved session
  useEffect(() => {
    const savedPass = sessionStorage.getItem('vcs_admin_pass');
    if (savedPass) {
      setPassword(savedPass);
      setIsAuthenticated(true);
    }
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/content');
      const json = await res.json();
      if (json.success) {
        setSiteData(json.siteContent);
        setMenuData(json.menuData);
        if (json.menuData?.categories?.length > 0) {
          setSelectedMenuCategory(json.menuData.categories[0]);
        }
      }
    } catch (e: any) {
      console.error('Failed to load data:', e);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();
      if (json.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('vcs_admin_pass', password);
        setLoginError('');
      } else {
        setLoginError(json.error || 'Invalid security passcode. Access denied.');
      }
    } catch (err: any) {
      setLoginError('Authentication service unreachable. Please try again.');
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('vcs_admin_pass');
    setIsAuthenticated(false);
    setPassword('');
  }

  async function saveAllChanges() {
    setSaving(true);
    setStatusMessage(null);
    try {
      const currentPass = password || sessionStorage.getItem('vcs_admin_pass') || 'VCS@Amersham94';
      
      const [siteRes, menuRes] = await Promise.all([
        fetch('/api/admin/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            password: currentPass,
            type: 'site',
            data: siteData,
          }),
        }),
        fetch('/api/admin/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            password: currentPass,
            type: 'menu',
            data: menuData,
          }),
        }),
      ]);

      const [siteJson, menuJson] = await Promise.all([siteRes.json(), menuRes.json()]);

      if (siteJson.success && menuJson.success) {
        // Broadcast instant update across all open tabs/windows so live site updates with no manual refresh
        try {
          if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
            const channel = new BroadcastChannel('vcs_content_channel');
            channel.postMessage({ type: 'CONTENT_SAVED', timestamp: Date.now() });
            channel.close();
          }
        } catch (err) {}
        if (typeof window !== 'undefined') {
          localStorage.setItem('vcs_last_content_save', Date.now().toString());
        }

        setStatusMessage({ type: 'success', text: '✓ All changes saved! Live site refreshed automatically without reloading.' });
      } else {
        const errorMsg = siteJson.error || menuJson.error || 'Failed to save changes.';
        setStatusMessage({ type: 'error', text: errorMsg });
      }
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: e.message || 'Error occurred while saving.' });
    } finally {
      setSaving(false);
      setTimeout(() => setStatusMessage(null), 5000);
    }
  }

  async function saveSiteContent() {
    return saveAllChanges();
  }

  async function saveMenuData() {
    return saveAllChanges();
  }

  // --- Helpers for updating nested fields ---
  const updateRestaurant = (field: string, val: any) => {
    setSiteData((prev: any) => ({
      ...prev,
      restaurant: { ...prev.restaurant, [field]: val }
    }));
  };

  const updateHours = (field: 'weekday' | 'weekend', val: string) => {
    setSiteData((prev: any) => ({
      ...prev,
      restaurant: {
        ...prev.restaurant,
        openingHours: { ...prev.restaurant.openingHours, [field]: val }
      }
    }));
  };

  const updateHero = (field: string, val: any) => {
    setSiteData((prev: any) => ({
      ...prev,
      hero: { ...prev.hero, [field]: val }
    }));
  };

  const updateSlide = (idx: number, field: string, val: string) => {
    const updated = [...siteData.hero.slides];
    updated[idx] = { ...updated[idx], [field]: val };
    updateHero('slides', updated);
  };

  const addSlide = () => {
    const newSlide = {
      id: Date.now(),
      image: '/images/3d/masala-dosa-3d.jpg',
      title: 'New Delicious Dish'
    };
    updateHero('slides', [newSlide, ...siteData.hero.slides]);
    setStatusMessage({ type: 'success', text: '✓ New slide added at the top! Edit it and click Save All Changes.' });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const removeSlide = (idx: number) => {
    const updated = siteData.hero.slides.filter((_: any, i: number) => i !== idx);
    updateHero('slides', updated);
  };

  const updateTopFood = (idx: number, field: string, val: any) => {
    const updated = [...siteData.topFood.items];
    updated[idx] = { ...updated[idx], [field]: val };
    setSiteData((prev: any) => ({
      ...prev,
      topFood: { ...prev.topFood, items: updated }
    }));
  };

  const addTopFoodItem = () => {
    const newItem = {
      id: Date.now(),
      name: 'New Signature Dish',
      category: 'Dosa Corner',
      price: '£8.95',
      rating: 4.9,
      description: 'Freshly prepared South Indian traditional delicacy.',
      image: '/images/3d/masala-dosa-3d.jpg',
      tag: 'Special'
    };
    setSiteData((prev: any) => ({
      ...prev,
      topFood: { ...prev.topFood, items: [newItem, ...prev.topFood.items] }
    }));
    setStatusMessage({ type: 'success', text: '✓ New highlight dish added at the top! Edit it and click Save All Changes.' });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const removeTopFoodItem = (idx: number) => {
    const updated = siteData.topFood.items.filter((_: any, i: number) => i !== idx);
    setSiteData((prev: any) => ({
      ...prev,
      topFood: { ...prev.topFood, items: updated }
    }));
  };

  const updateFaq = (idx: number, field: 'q' | 'a', val: string) => {
    const updated = [...siteData.faqs];
    updated[idx] = { ...updated[idx], [field]: val };
    setSiteData((prev: any) => ({ ...prev, faqs: updated }));
  };

  const addFaq = () => {
    const newFaq = { q: 'New Frequently Asked Question?', a: 'Answer to the question goes here.' };
    setSiteData((prev: any) => ({ ...prev, faqs: [newFaq, ...(prev.faqs || [])] }));
    setStatusMessage({ type: 'success', text: '✓ New question added at the top! Edit it and click Save All Changes.' });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const removeFaq = (idx: number) => {
    const updated = siteData.faqs.filter((_: any, i: number) => i !== idx);
    setSiteData((prev: any) => ({ ...prev, faqs: updated }));
  };

  const updateReview = (idx: number, field: string, val: any) => {
    const updated = [...siteData.testimonials.items];
    updated[idx] = { ...updated[idx], [field]: val };
    setSiteData((prev: any) => ({
      ...prev,
      testimonials: { ...prev.testimonials, items: updated }
    }));
  };

  const addReview = () => {
    const newRev = {
      id: Date.now(),
      name: 'Happy Customer',
      rating: 5,
      text: 'Wonderful experience, authentic flavors and top tier service!',
      date: 'Just now',
      verified: true
    };
    setSiteData((prev: any) => ({
      ...prev,
      testimonials: { ...prev.testimonials, items: [newRev, ...prev.testimonials.items] }
    }));
    setStatusMessage({ type: 'success', text: '✓ New review added at the top! Edit it and click Save All Changes.' });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const removeReview = (idx: number) => {
    const updated = siteData.testimonials.items.filter((_: any, i: number) => i !== idx);
    setSiteData((prev: any) => ({
      ...prev,
      testimonials: { ...prev.testimonials, items: updated }
    }));
  };

  // Menu item helpers
  const updateMenuItem = (catName: string, itemIdx: number, field: string, val: any) => {
    const updatedMenu = { ...menuData.menuData };
    const items = [...updatedMenu[catName]];
    items[itemIdx] = { ...items[itemIdx], [field]: val };
    updatedMenu[catName] = items;
    setMenuData((prev: any) => ({ ...prev, menuData: updatedMenu }));
  };

  const addMenuItem = (catName: string) => {
    const newItem = {
      name: 'New Menu Special',
      price: '£8.95',
      desc: 'Authentic South Indian preparation with traditional spices.',
      dietary: ['Vegetarian']
    };
    const updatedMenu = { ...menuData.menuData };
    updatedMenu[catName] = [newItem, ...(updatedMenu[catName] || [])];
    setMenuData((prev: any) => ({ ...prev, menuData: updatedMenu }));
  };

  const removeMenuItem = (catName: string, itemIdx: number) => {
    const updatedMenu = { ...menuData.menuData };
    updatedMenu[catName] = updatedMenu[catName].filter((_: any, i: number) => i !== itemIdx);
    setMenuData((prev: any) => ({ ...prev, menuData: updatedMenu }));
  };

  // Render Ultra-Premium 3D Classic Login Screen
  if (!isAuthenticated) {
    return (
      <div
        style={{
          height: '100vh',
          maxHeight: '100vh',
          width: '100vw',
          backgroundColor: '#090807',
          backgroundImage: `
            radial-gradient(ellipse 80% 60% at 50% -20%, rgba(222, 120, 67, 0.22) 0%, rgba(0, 0, 0, 0) 70%),
            radial-gradient(circle at 85% 85%, rgba(184, 83, 29, 0.14) 0%, rgba(0, 0, 0, 0) 60%),
            radial-gradient(circle at 15% 90%, rgba(222, 120, 67, 0.1) 0%, rgba(0, 0, 0, 0) 50%)
          `,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'var(--font-sans), system-ui, -apple-system, sans-serif',
          boxSizing: 'border-box',
        }}
      >
        {/* Subtle Ambient Decorative 3D Light Orbs */}
        <div
          style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(222, 120, 67, 0.14) 0%, rgba(0,0,0,0) 70%)',
            top: '-15%',
            left: '50%',
            transform: 'translateX(-50%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />

        {/* 3D Glassmorphic Master Jewel Card */}
        <div
          style={{
            width: '100%',
            maxWidth: '560px',
            position: 'relative',
            zIndex: 10,
            background: 'linear-gradient(168deg, rgba(32, 25, 20, 0.94) 0%, rgba(18, 14, 11, 0.97) 100%)',
            backdropFilter: 'blur(36px)',
            WebkitBackdropFilter: 'blur(36px)',
            borderRadius: '24px',
            padding: '2rem 2.6rem',
            border: '1.5px solid rgba(222, 120, 67, 0.32)',
            borderTop: '2px solid rgba(255, 222, 192, 0.55)',
            boxShadow: `
              0 35px 85px -15px rgba(0, 0, 0, 0.92),
              0 0 60px rgba(222, 120, 67, 0.16),
              inset 0 1px 1px rgba(255, 255, 255, 0.35),
              inset 0 -2px 6px rgba(0, 0, 0, 0.6)
            `,
            textAlign: 'center',
            boxSizing: 'border-box',
          }}
        >
          {/* Subtle Top Metallic Highlight Accent */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '20%',
              right: '20%',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, #FDE6C2, #DE7843, transparent)',
              borderRadius: '2px',
            }}
          />

          {/* 3D Gold & Copper Layered Crest */}
          <div
            style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 0.9rem auto',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Outer 3D Halo Glow */}
            <div
              style={{
                position: 'absolute',
                inset: '-5px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(222, 120, 67, 0.45) 0%, transparent 70%)',
                filter: 'blur(8px)',
              }}
            />

            {/* Embossed Outer Ring */}
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FAD7A0 0%, #DE7843 45%, #8A370E 100%)',
                padding: '2px',
                boxShadow: '0 10px 24px rgba(184, 83, 29, 0.45), inset 0 2px 2px rgba(255, 255, 255, 0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
              }}
            >
              {/* Inner Dark Convex Core */}
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 35% 30%, #2B1D15 0%, #140E0A 90%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(222, 120, 67, 0.35)',
                  boxShadow: 'inset 0 3px 6px rgba(0, 0, 0, 0.8)',
                }}
              >
                {/* 3D Tactile Golden Padlock */}
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{
                    filter: 'drop-shadow(0 3px 8px rgba(222, 120, 67, 0.65))',
                  }}
                >
                  <defs>
                    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFF2D6" />
                      <stop offset="50%" stopColor="#E8A87C" />
                      <stop offset="100%" stopColor="#B8531D" />
                    </linearGradient>
                  </defs>
                  <rect
                    x="4"
                    y="10"
                    width="16"
                    height="12"
                    rx="3"
                    fill="url(#goldGrad)"
                    stroke="rgba(255, 240, 220, 0.7)"
                    strokeWidth="1"
                  />
                  <path
                    d="M7 10V6.5a5 5 0 0 1 10 0V10"
                    stroke="url(#goldGrad)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="15" r="1.5" fill="#1C130D" />
                  <path d="M12 16.5V18.5" stroke="#1C130D" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Heading in Elegant Serif */}
          <h1
            style={{
              fontFamily: 'var(--font-serif), Georgia, serif',
              fontSize: 'clamp(1.75rem, 3.2vw, 2.15rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              margin: '0 0 0.35rem 0',
              background: 'linear-gradient(180deg, #FFFFFF 30%, #F5DEC7 75%, #DE7843 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 14px rgba(0, 0, 0, 0.6)',
            }}
          >
            VCS Management Portal
          </h1>

          <p
            style={{
              color: '#A89F98',
              fontSize: '0.92rem',
              lineHeight: 1.4,
              margin: '0 auto 1.35rem auto',
            }}
          >
            Veg Chennai SriLalitha Amersham • Enter passcode to manage content & dishes
          </p>

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
            <div style={{ position: 'relative', textAlign: 'left' }}>
              {/* 3D Recessed Input Container */}
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  background: 'linear-gradient(180deg, #100C09 0%, #16110D 100%)',
                  borderRadius: '14px',
                  border: '1.5px solid rgba(222, 120, 67, 0.35)',
                  boxShadow: 'inset 0 3px 8px rgba(0, 0, 0, 0.85), 0 1px 0 rgba(255, 255, 255, 0.08)',
                  transition: 'all 0.25s ease',
                }}
              >
                {/* Left Key Icon */}
                <div
                  style={{
                    paddingLeft: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#DE7843',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="7.5" cy="15.5" r="5.5" />
                    <path d="m21 2-9.6 9.6" />
                    <path d="m15.5 7.5 3 3" />
                  </svg>
                </div>

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter security passcode"
                  required
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '0.95rem 1rem',
                    background: 'transparent',
                    border: 'none',
                    color: '#FFFFFF',
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    letterSpacing: showPassword ? '0.04em' : '0.12em',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />

                {/* Show/Hide Password Eye Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '0 1.1rem',
                    color: '#A8A29E',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#DE7843')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#A8A29E')}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {loginError && (
              <div
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.16)',
                  border: '1.5px solid rgba(239, 68, 68, 0.45)',
                  borderRadius: '10px',
                  padding: '0.65rem 1rem',
                  color: '#FCA5A5',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  justifyContent: 'center',
                }}
              >
                <span>⚠️</span>
                <span>{loginError}</span>
              </div>
            )}

            {/* 3D Push Button */}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.95rem',
                borderRadius: '14px',
                background: 'linear-gradient(180deg, #E68550 0%, #DE7843 35%, #B8531D 85%, #9A3F10 100%)',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '1.05rem',
                fontWeight: 800,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: `
                  0 12px 28px rgba(184, 83, 29, 0.55),
                  0 4px 10px rgba(0, 0, 0, 0.6),
                  inset 0 1.5px 1px rgba(255, 255, 255, 0.55),
                  inset 0 -2px 5px rgba(0, 0, 0, 0.45)
                `,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.65rem',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.4)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 16px 34px rgba(184, 83, 29, 0.68), inset 0 1.5px 1px rgba(255, 255, 255, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(184, 83, 29, 0.55), 0 4px 10px rgba(0, 0, 0, 0.6), inset 0 1.5px 1px rgba(255, 255, 255, 0.55), inset 0 -2px 5px rgba(0, 0, 0, 0.45)';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(184, 83, 29, 0.4), inset 0 2px 4px rgba(0, 0, 0, 0.5)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>Unlock Dashboard</span>
              <span style={{ fontSize: '1.15rem' }}>→</span>
            </button>
          </form>

          {/* Bottom Bar: Return to Website */}
          <div
            style={{
              marginTop: '1.35rem',
              paddingTop: '1rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              textAlign: 'center',
            }}
          >
            <Link
              href="/"
              style={{
                color: '#A89F98',
                textDecoration: 'none',
                fontSize: '0.86rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#DE7843')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#A89F98')}
            >
              <span>←</span>
              <span>Return to Restaurant Website</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !siteData || !menuData) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0F0E0D', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#DE7843' }}>Loading VCS Management Engine...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0C0A09', color: '#F5F5F4', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Top Header Bar */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: '#1C1917',
        borderBottom: '1px solid #292524',
        padding: '0.85rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            backgroundColor: '#DE7843',
            color: '#fff',
            fontWeight: 900,
            fontSize: '1rem',
            padding: '4px 10px',
            borderRadius: '8px'
          }}>
            VCS
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#FFFFFF' }}>Content Studio & Management</div>
            <div style={{ fontSize: '0.78rem', color: '#A8A29E' }}>Veg Chennai SriLalitha Amersham</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {statusMessage && (
            <div style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              backgroundColor: statusMessage.type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
              color: statusMessage.type === 'success' ? '#4ADE80' : '#F87171',
              border: `1px solid ${statusMessage.type === 'success' ? '#22C55E' : '#EF4444'}`
            }}>
              {statusMessage.text}
            </div>
          )}

          <Link
            href="/"
            target="_blank"
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '10px',
              backgroundColor: '#292524',
              color: '#E7E5E4',
              textDecoration: 'none',
              fontSize: '0.88rem',
              fontWeight: 600,
              border: '1px solid #44403C'
            }}
          >
            Live Site ↗
          </Link>

          <button
            onClick={saveAllChanges}
            disabled={saving}
            style={{
              padding: '0.6rem 1.5rem',
              borderRadius: '10px',
              backgroundColor: '#DE7843',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(222, 120, 67, 0.4)',
              opacity: saving ? 0.7 : 1
            }}
          >
            {saving ? 'Saving Changes...' : 'Save All Changes'}
          </button>

          <button
            onClick={() =>
              requestConfirm({
                title: 'Confirm Logout',
                message: 'Are you sure you want to log out of the Admin Dashboard?',
                confirmLabel: 'Sign out',
                confirmColor: '#E11D48',
                onConfirm: handleLogout,
              })
            }
            style={{
              padding: '0.6rem 1rem',
              borderRadius: '10px',
              backgroundColor: 'transparent',
              color: '#A8A29E',
              border: '1px solid #44403C',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Studio Body */}
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
        
        {/* Sidebar Tabs */}
        <aside style={{
          width: '260px',
          flexShrink: 0,
          backgroundColor: '#141210',
          borderRight: '1px solid #292524',
          padding: '1.5rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem'
        }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#78716C', padding: '0 0.75rem 0.5rem 0.75rem', fontWeight: 700 }}>
            Sections & Content
          </div>

          {[
            { id: 'hero', label: 'Hero & 3D Carousel', icon: '🖼️' },
            { id: 'general', label: 'Contact & Hours', icon: '📞' },
            { id: 'topFood', label: 'Top Food Highlights', icon: '⭐' },
            { id: 'menu', label: 'Dining Menu & Prices', icon: '🍲' },
            { id: 'about', label: 'About Story & Stats', icon: '📖' },
            { id: 'reviews', label: 'Google Reviews', icon: '💬' },
            { id: 'faqs', label: 'Questions & FAQs', icon: '❓' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  backgroundColor: isActive ? 'rgba(222, 120, 67, 0.15)' : 'transparent',
                  color: isActive ? '#DE7843' : '#D6D3D1',
                  border: isActive ? '1px solid rgba(222, 120, 67, 0.3)' : '1px solid transparent',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Content Panel */}
        <main style={{ flexGrow: 1, padding: '2rem 2.5rem', maxWidth: '1000px', overflowY: 'auto' }}>

          {/* TAB 1: HERO & 3D CAROUSEL */}
          {activeTab === 'hero' && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Hero Section & 3D Carousel</h2>
                <p style={{ color: '#A8A29E', fontSize: '0.95rem', margin: 0 }}>
                  Customize the main headline, subtitle, buttons, and all 3D background carousel slides.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: '#1C1917', padding: '1.75rem', borderRadius: '16px', border: '1px solid #292524' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.5rem' }}>
                    Eyebrow / Badge Text
                  </label>
                  <input
                    type="text"
                    value={siteData.hero.badge || ''}
                    onChange={(e) => updateHero('badge', e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.5rem' }}>
                    Main H1 Heading
                  </label>
                  <input
                    type="text"
                    value={siteData.hero.title || ''}
                    onChange={(e) => updateHero('title', e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.5rem' }}>
                    Subtitle / Description
                  </label>
                  <textarea
                    rows={2}
                    value={siteData.hero.subtitle || ''}
                    onChange={(e) => updateHero('subtitle', e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem', resize: 'vertical' }}
                  />
                </div>
              </div>

              {/* Carousel Slides List */}
              <div style={{ marginTop: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Active 3D Carousel Slides ({siteData.hero.slides.length})</h3>
                  <button
                    onClick={addSlide}
                    style={{ padding: '0.5rem 1rem', borderRadius: '8px', backgroundColor: 'rgba(222, 120, 67, 0.2)', color: '#DE7843', border: '1px solid #DE7843', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    + Add New Slide
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {siteData.hero.slides.map((slide: any, idx: number) => (
                    <div key={slide.id || idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center', backgroundColor: '#1C1917', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid #292524' }}>
                      <div style={{ position: 'relative', width: '70px', height: '50px', flexShrink: 0 }}>
                        <img
                          src={slide.image}
                          alt={slide.title}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/3d/masala-dosa-3d.jpg';
                          }}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '1px solid #44403C' }}
                        />
                        <label
                          style={{
                            position: 'absolute',
                            inset: 0,
                            borderRadius: '8px',
                            backgroundColor: 'rgba(0, 0, 0, 0.65)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '2px',
                            opacity: 0,
                            transition: 'opacity 0.2s',
                            cursor: 'pointer',
                            color: '#DE7843',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                          title="Click to upload replacement image"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                            <circle cx="12" cy="13" r="4" />
                          </svg>
                          <span>Change</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingTarget === `slide-${idx}`}
                            style={{ display: 'none' }}
                            onChange={(e) => handleImageUpload(e, (url) => updateSlide(idx, 'image', url), `slide-${idx}`)}
                          />
                        </label>
                      </div>

                      <div style={{ flexGrow: 1, display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '0.75rem', alignItems: 'center' }}>
                        <input
                          type="text"
                          value={slide.title}
                          onChange={(e) => updateSlide(idx, 'title', e.target.value)}
                          placeholder="Dish Title"
                          style={{ padding: '0.55rem 0.75rem', borderRadius: '6px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.88rem' }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <input
                            type="text"
                            value={slide.image}
                            onChange={(e) => updateSlide(idx, 'image', e.target.value)}
                            placeholder="Image Path (/images/...) or Paste URL"
                            style={{ flexGrow: 1, minWidth: 0, padding: '0.55rem 0.75rem', borderRadius: '6px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.88rem' }}
                          />
                          <label
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              padding: '0.55rem 0.9rem',
                              borderRadius: '6px',
                              backgroundColor: uploadingTarget === `slide-${idx}` ? '#382b22' : 'rgba(222, 120, 67, 0.18)',
                              color: uploadingTarget === `slide-${idx}` ? '#DE7843' : '#F97316',
                              border: '1px solid rgba(222, 120, 67, 0.45)',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              cursor: uploadingTarget === `slide-${idx}` ? 'wait' : 'pointer',
                              whiteSpace: 'nowrap',
                              userSelect: 'none',
                              transition: 'all 0.2s ease',
                            }}
                            title="Upload image file from device"
                          >
                            {uploadingTarget === `slide-${idx}` ? (
                              <>
                                <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>
                                <span>Uploading...</span>
                              </>
                            ) : (
                              <>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                  <polyline points="17 8 12 3 7 8" />
                                  <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                                <span>Upload</span>
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              disabled={uploadingTarget === `slide-${idx}`}
                              style={{ display: 'none' }}
                              onChange={(e) => handleImageUpload(e, (url) => updateSlide(idx, 'image', url), `slide-${idx}`)}
                            />
                          </label>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          requestConfirm({
                            title: 'Delete Hero Slide',
                            message: `Are you sure you want to delete "${slide.title || 'this slide'}" from the 3D carousel?`,
                            confirmLabel: 'Delete',
                            confirmColor: '#E11D48',
                            onConfirm: () => removeSlide(idx),
                          })
                        }
                        style={{ padding: '0.55rem 0.85rem', borderRadius: '6px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.3)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GENERAL & CONTACT */}
          {activeTab === 'general' && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Restaurant Contact & Opening Hours</h2>
                <p style={{ color: '#A8A29E', fontSize: '0.95rem', margin: 0 }}>
                  Update telephone, email, physical street address, and weekly operating schedules.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', backgroundColor: '#1C1917', padding: '1.75rem', borderRadius: '16px', border: '1px solid #292524' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.5rem' }}>Restaurant Name</label>
                  <input
                    type="text"
                    value={siteData.restaurant.name || ''}
                    onChange={(e) => updateRestaurant('name', e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.5rem' }}>Phone Number (Display)</label>
                  <input
                    type="text"
                    value={siteData.restaurant.phone || ''}
                    onChange={(e) => updateRestaurant('phone', e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.5rem' }}>Email Address</label>
                  <input
                    type="email"
                    value={siteData.restaurant.email || ''}
                    onChange={(e) => updateRestaurant('email', e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.5rem' }}>Postcode</label>
                  <input
                    type="text"
                    value={siteData.restaurant.postcode || ''}
                    onChange={(e) => updateRestaurant('postcode', e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.5rem' }}>Full Physical Address</label>
                  <input
                    type="text"
                    value={siteData.restaurant.address || ''}
                    onChange={(e) => updateRestaurant('address', e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.5rem' }}>Weekday Operating Hours</label>
                  <input
                    type="text"
                    value={siteData.restaurant.openingHours?.weekday || ''}
                    onChange={(e) => updateHours('weekday', e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.5rem' }}>Weekend Operating Hours</label>
                  <input
                    type="text"
                    value={siteData.restaurant.openingHours?.weekend || ''}
                    onChange={(e) => updateHours('weekend', e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TOP FOOD HIGHLIGHTS */}
          {activeTab === 'topFood' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Top Food Highlights</h2>
                  <p style={{ color: '#A8A29E', fontSize: '0.95rem', margin: 0 }}>
                    Manage the featured dishes displayed prominently on the homepage.
                  </p>
                </div>
                <button
                  onClick={addTopFoodItem}
                  style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', backgroundColor: '#DE7843', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                >
                  + Add Highlight Dish
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {siteData.topFood.items.map((item: any, idx: number) => (
                  <div key={item.id || idx} style={{ backgroundColor: '#1C1917', padding: '1.5rem', borderRadius: '14px', border: '1px solid #292524', display: 'grid', gridTemplateColumns: '130px 1fr 140px auto', gap: '1.25rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ position: 'relative', width: '130px', height: '85px' }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/3d/masala-dosa-3d.jpg';
                          }}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '1px solid #44403C' }}
                        />
                        <label
                          style={{
                            position: 'absolute',
                            inset: 0,
                            borderRadius: '8px',
                            backgroundColor: 'rgba(0, 0, 0, 0.65)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0,
                            transition: 'opacity 0.2s',
                            cursor: 'pointer',
                            color: '#DE7843',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                          title="Click to replace image"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                            <circle cx="12" cy="13" r="4" />
                          </svg>
                          <span>Change</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={uploadingTarget === `topFood-${idx}`}
                            style={{ display: 'none' }}
                            onChange={(e) => handleImageUpload(e, (url) => updateTopFood(idx, 'image', url), `topFood-${idx}`)}
                          />
                        </label>
                      </div>
                      <label
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.35rem 0.65rem',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(222, 120, 67, 0.15)',
                          color: '#DE7843',
                          border: '1px solid rgba(222, 120, 67, 0.4)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: uploadingTarget === `topFood-${idx}` ? 'wait' : 'pointer',
                          userSelect: 'none',
                        }}
                      >
                        {uploadingTarget === `topFood-${idx}` ? '⏳ Uploading...' : '📁 Upload'}
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingTarget === `topFood-${idx}`}
                          style={{ display: 'none' }}
                          onChange={(e) => handleImageUpload(e, (url) => updateTopFood(idx, 'image', url), `topFood-${idx}`)}
                        />
                      </label>
                    </div>

                    <div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateTopFood(idx, 'name', e.target.value)}
                          placeholder="Dish Name"
                          style={{ fontWeight: 700, fontSize: '1rem', padding: '0.45rem 0.65rem', borderRadius: '6px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', flexGrow: 1 }}
                        />
                        <input
                          type="text"
                          value={item.tag}
                          onChange={(e) => updateTopFood(idx, 'tag', e.target.value)}
                          placeholder="Tag (e.g. Bestseller)"
                          style={{ width: '120px', fontSize: '0.82rem', padding: '0.45rem 0.65rem', borderRadius: '6px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#DE7843', fontWeight: 600 }}
                        />
                      </div>

                      <div style={{ marginBottom: '0.5rem' }}>
                        <input
                          type="text"
                          value={item.image || ''}
                          onChange={(e) => updateTopFood(idx, 'image', e.target.value)}
                          placeholder="Image Path or URL"
                          style={{ width: '100%', fontSize: '0.82rem', padding: '0.4rem 0.6rem', borderRadius: '6px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#D6D3D1' }}
                        />
                      </div>

                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) => updateTopFood(idx, 'description', e.target.value)}
                        placeholder="Description"
                        style={{ width: '100%', fontSize: '0.85rem', padding: '0.45rem 0.65rem', borderRadius: '6px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#D6D3D1', resize: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#78716C', display: 'block', marginBottom: '4px' }}>Price & Rating</label>
                      <input
                        type="text"
                        value={item.price}
                        onChange={(e) => updateTopFood(idx, 'price', e.target.value)}
                        placeholder="£8.95"
                        style={{ width: '100%', fontWeight: 700, padding: '0.4rem 0.6rem', borderRadius: '6px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#DE7843', marginBottom: '0.4rem' }}
                      />
                      <input
                        type="number"
                        step="0.1"
                        value={item.rating}
                        onChange={(e) => updateTopFood(idx, 'rating', parseFloat(e.target.value))}
                        placeholder="4.9"
                        style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: '6px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff' }}
                      />
                    </div>
                    <button
                      onClick={() =>
                        requestConfirm({
                          title: 'Delete Highlight Dish',
                          message: `Are you sure you want to remove "${item.name || 'this dish'}" from top food highlights?`,
                          confirmLabel: 'Delete',
                          confirmColor: '#E11D48',
                          onConfirm: () => removeTopFoodItem(idx),
                        })
                      }
                      style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.3)', cursor: 'pointer' }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: DINING MENU & PRICES */}
          {activeTab === 'menu' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Dining Menu & Pricing</h2>
                  <p style={{ color: '#A8A29E', fontSize: '0.95rem', margin: 0 }}>
                    Select a category to view, edit prices, update dietary labels, or add new dishes.
                  </p>
                </div>
                <button
                  onClick={() => addMenuItem(selectedMenuCategory)}
                  style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', backgroundColor: '#DE7843', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                >
                  + Add Dish to Category
                </button>
              </div>

              {/* Category selector pills */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                {menuData.categories.map((cat: string) => {
                  const isSelected = selectedMenuCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedMenuCategory(cat)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        backgroundColor: isSelected ? '#DE7843' : '#1C1917',
                        color: isSelected ? '#FFFFFF' : '#A8A29E',
                        border: isSelected ? '1px solid #DE7843' : '1px solid #292524',
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      {cat} ({menuData.menuData[cat]?.length || 0})
                    </button>
                  );
                })}
              </div>

              {/* Dish List for Selected Category */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {(menuData.menuData[selectedMenuCategory] || []).map((dish: any, idx: number) => (
                  <div key={idx} style={{ backgroundColor: '#1C1917', padding: '1.25rem', borderRadius: '12px', border: '1px solid #292524', display: 'grid', gridTemplateColumns: '1.5fr 100px 2.5fr auto', gap: '1rem', alignItems: 'center' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#78716C', display: 'block', marginBottom: '2px' }}>Dish Name</label>
                      <input
                        type="text"
                        value={dish.name}
                        onChange={(e) => updateMenuItem(selectedMenuCategory, idx, 'name', e.target.value)}
                        style={{ width: '100%', fontWeight: 700, padding: '0.45rem 0.65rem', borderRadius: '6px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#78716C', display: 'block', marginBottom: '2px' }}>Price</label>
                      <input
                        type="text"
                        value={dish.price}
                        onChange={(e) => updateMenuItem(selectedMenuCategory, idx, 'price', e.target.value)}
                        style={{ width: '100%', fontWeight: 700, padding: '0.45rem 0.65rem', borderRadius: '6px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#DE7843' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: '#78716C', display: 'block', marginBottom: '2px' }}>Description</label>
                      <input
                        type="text"
                        value={dish.desc || ''}
                        onChange={(e) => updateMenuItem(selectedMenuCategory, idx, 'desc', e.target.value)}
                        style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '6px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#D6D3D1', fontSize: '0.85rem' }}
                      />
                    </div>
                    <button
                      onClick={() =>
                        requestConfirm({
                          title: 'Delete Menu Dish',
                          message: `Are you sure you want to delete "${dish.name || 'this dish'}" from ${selectedMenuCategory}?`,
                          confirmLabel: 'Delete',
                          confirmColor: '#E11D48',
                          onConfirm: () => removeMenuItem(selectedMenuCategory, idx),
                        })
                      }
                      style={{ padding: '0.45rem 0.6rem', borderRadius: '6px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.3)', cursor: 'pointer' }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: ABOUT & STATS */}
          {activeTab === 'about' && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>About Story & Metrics</h2>
                <p style={{ color: '#A8A29E', fontSize: '0.95rem', margin: 0 }}>
                  Refine the restaurant's culinary narrative, milestone numbers, and values.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: '#1C1917', padding: '1.75rem', borderRadius: '16px', border: '1px solid #292524' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.5rem' }}>Section Title</label>
                  <input
                    type="text"
                    value={siteData.about.title || ''}
                    onChange={(e) => setSiteData({ ...siteData, about: { ...siteData.about, title: e.target.value } })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                  />
                </div>

                {siteData.about.paragraphs.map((p: string, idx: number) => (
                  <div key={idx}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.5rem' }}>Story Paragraph {idx + 1}</label>
                    <textarea
                      rows={3}
                      value={p}
                      onChange={(e) => {
                        const updated = [...siteData.about.paragraphs];
                        updated[idx] = e.target.value;
                        setSiteData({ ...siteData, about: { ...siteData.about, paragraphs: updated } });
                      }}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem', resize: 'vertical' }}
                    />
                  </div>
                ))}
              </div>

              {/* Stats Counters */}
              <div style={{ marginTop: '2.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 1rem 0' }}>Trust Metric Counters</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                  {siteData.about.stats.map((st: any, idx: number) => (
                    <div key={idx} style={{ backgroundColor: '#1C1917', padding: '1rem', borderRadius: '12px', border: '1px solid #292524' }}>
                      <input
                        type="text"
                        value={st.value}
                        onChange={(e) => {
                          const updated = [...siteData.about.stats];
                          updated[idx] = { ...updated[idx], value: e.target.value };
                          setSiteData({ ...siteData, about: { ...siteData.about, stats: updated } });
                        }}
                        style={{ width: '100%', fontSize: '1.25rem', fontWeight: 800, color: '#DE7843', backgroundColor: '#292524', border: '1px solid #44403C', borderRadius: '6px', padding: '0.4rem', marginBottom: '0.5rem' }}
                      />
                      <input
                        type="text"
                        value={st.label}
                        onChange={(e) => {
                          const updated = [...siteData.about.stats];
                          updated[idx] = { ...updated[idx], label: e.target.value };
                          setSiteData({ ...siteData, about: { ...siteData.about, stats: updated } });
                        }}
                        style={{ width: '100%', fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF', backgroundColor: '#292524', border: '1px solid #44403C', borderRadius: '6px', padding: '0.3rem' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: GOOGLE REVIEWS */}
          {activeTab === 'reviews' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Google Reviews & Testimonials</h2>
                  <p style={{ color: '#A8A29E', fontSize: '0.95rem', margin: 0 }}>
                    Feature real customer praise, ratings, and feedback.
                  </p>
                </div>
                <button
                  onClick={addReview}
                  style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', backgroundColor: '#DE7843', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                >
                  + Add Review
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {siteData.testimonials.items.map((rev: any, idx: number) => (
                  <div key={rev.id || idx} style={{ backgroundColor: '#1C1917', padding: '1.25rem', borderRadius: '12px', border: '1px solid #292524' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <input
                        type="text"
                        value={rev.name}
                        onChange={(e) => updateReview(idx, 'name', e.target.value)}
                        placeholder="Reviewer Name"
                        style={{ fontWeight: 700, fontSize: '0.95rem', padding: '0.4rem 0.6rem', borderRadius: '6px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', width: '220px' }}
                      />
                      <input
                        type="text"
                        value={rev.date}
                        onChange={(e) => updateReview(idx, 'date', e.target.value)}
                        placeholder="Date (e.g. 1 month ago)"
                        style={{ fontSize: '0.85rem', padding: '0.4rem 0.6rem', borderRadius: '6px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#A8A29E', width: '160px' }}
                      />
                      <div style={{ color: '#FBBF24', fontSize: '0.9rem' }}>
                        {'★'.repeat(rev.rating || 5)}
                      </div>
                      <div style={{ marginLeft: 'auto' }}>
                        <button
                          onClick={() =>
                            requestConfirm({
                              title: 'Delete Review',
                              message: `Are you sure you want to delete the review by "${rev.name || 'this reviewer'}"?`,
                              confirmLabel: 'Delete',
                              confirmColor: '#E11D48',
                              onConfirm: () => removeReview(idx),
                            })
                          }
                          style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.3)', cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <textarea
                      rows={2}
                      value={rev.text}
                      onChange={(e) => updateReview(idx, 'text', e.target.value)}
                      placeholder="Review Quote"
                      style={{ width: '100%', fontSize: '0.88rem', padding: '0.5rem 0.75rem', borderRadius: '6px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#D6D3D1', resize: 'vertical' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: FAQs */}
          {activeTab === 'faqs' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Frequently Asked Questions</h2>
                  <p style={{ color: '#A8A29E', fontSize: '0.95rem', margin: 0 }}>
                    Clarify parking, catering options, vegan dietary policies, and bookings.
                  </p>
                </div>
                <button
                  onClick={addFaq}
                  style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', backgroundColor: '#DE7843', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                >
                  + Add Question
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {siteData.faqs.map((faq: any, idx: number) => (
                  <div key={idx} style={{ backgroundColor: '#1C1917', padding: '1.25rem', borderRadius: '12px', border: '1px solid #292524' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <input
                        type="text"
                        value={faq.q}
                        onChange={(e) => updateFaq(idx, 'q', e.target.value)}
                        placeholder="Question"
                        style={{ fontWeight: 700, fontSize: '0.95rem', padding: '0.45rem 0.65rem', borderRadius: '6px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', flexGrow: 1 }}
                      />
                      <button
                        onClick={() =>
                          requestConfirm({
                            title: 'Delete FAQ Question',
                            message: `Are you sure you want to delete this question?`,
                            confirmLabel: 'Delete',
                            confirmColor: '#E11D48',
                            onConfirm: () => removeFaq(idx),
                          })
                        }
                        style={{ padding: '0.45rem 0.65rem', borderRadius: '6px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.3)', cursor: 'pointer', fontSize: '0.8rem' }}
                      >
                        Delete
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={faq.a}
                      onChange={(e) => updateFaq(idx, 'a', e.target.value)}
                      placeholder="Answer"
                      style={{ width: '100%', fontSize: '0.88rem', padding: '0.5rem 0.75rem', borderRadius: '6px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#D6D3D1', resize: 'vertical' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Confirmation Modal matching user specification */}
      {confirmDialog?.isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            padding: '1rem',
          }}
          onClick={() => setConfirmDialog(null)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              padding: '2.5rem 2rem',
              maxWidth: '430px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                margin: '0 0 0.75rem 0',
                fontSize: '1.4rem',
                fontWeight: 800,
                color: '#111827',
                letterSpacing: '-0.02em',
              }}
            >
              {confirmDialog.title}
            </h3>
            <p
              style={{
                margin: '0 0 2rem 0',
                fontSize: '0.96rem',
                color: '#6B7280',
                lineHeight: 1.55,
              }}
            >
              {confirmDialog.message}
            </p>
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                style={{
                  padding: '0.75rem 2rem',
                  borderRadius: '9999px',
                  border: '1px solid #E5E7EB',
                  backgroundColor: '#FFFFFF',
                  color: '#374151',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  minWidth: '120px',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmDialog.onConfirm();
                  setConfirmDialog(null);
                }}
                style={{
                  padding: '0.75rem 2rem',
                  borderRadius: '9999px',
                  border: 'none',
                  backgroundColor: confirmDialog.confirmColor || '#E11D48',
                  color: '#FFFFFF',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(225, 29, 72, 0.35)',
                  minWidth: '120px',
                }}
              >
                {confirmDialog.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
