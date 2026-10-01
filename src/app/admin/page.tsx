'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  const [activeTab, setActiveTab] = useState<'hero' | 'general' | 'topFood' | 'about' | 'catering' | 'outdoorCatering' | 'liveDosa' | 'whyUs' | 'menu' | 'reviews' | 'faqs' | 'headerFooter' | 'forms' | 'seo' | 'delivery' | 'legal'>('hero');
  const [activeSeoPage, setActiveSeoPage] = useState<string>('home');
  const [activeLegalTab, setActiveLegalTab] = useState<'privacyPolicy' | 'cookiesPolicy' | 'disclaimer'>('privacyPolicy');
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

  const updateHeader = (field: string, val: any) => {
    setSiteData((prev: any) => ({
      ...prev,
      header: { ...(prev.header || {}), [field]: val }
    }));
  };

  const updateFooter = (field: string, val: any) => {
    setSiteData((prev: any) => ({
      ...prev,
      footer: { ...(prev.footer || {}), [field]: val }
    }));
  };

  const updateCatering = (field: string, val: any) => {
    setSiteData((prev: any) => ({
      ...prev,
      catering: { ...(prev.catering || {}), [field]: val }
    }));
  };

  const updateCateringFeature = (idx: number, field: string, val: string) => {
    const features = [...(siteData.catering?.features || [])];
    if (features[idx]) {
      features[idx] = { ...features[idx], [field]: val };
      updateCatering('features', features);
    }
  };

  const updateWhyUs = (field: string, val: any) => {
    setSiteData((prev: any) => ({
      ...prev,
      whyChooseUs: { ...(prev.whyChooseUs || {}), [field]: val }
    }));
  };

  const updateWhyUsCard = (idx: number, field: string, val: string) => {
    const cards = [...(siteData.whyChooseUs?.cards || [])];
    if (cards[idx]) {
      cards[idx] = { ...cards[idx], [field]: val };
      updateWhyUs('cards', cards);
    }
  };

  const updateSeo = (pageKey: string, field: string, val: string) => {
    setSiteData((prev: any) => ({
      ...prev,
      seo: {
        ...(prev.seo || {}),
        [pageKey]: {
          ...(prev.seo?.[pageKey] || {}),
          [field]: val
        }
      }
    }));
  };

  // Custom Form Field Box helpers
  const addCustomFormField = () => {
    const newField = {
      id: 'field_' + Date.now(),
      label: 'New Custom Box / Question',
      name: 'custom_' + Date.now(),
      type: 'text',
      placeholder: 'Enter details here...',
      required: false,
      formTarget: 'all',
      enabled: true,
    };
    setSiteData((prev: any) => ({
      ...prev,
      customFormFields: [...(prev.customFormFields || []), newField]
    }));
    setStatusMessage({ type: 'success', text: '✓ New custom input box added! Edit its label and click Save All Changes.' });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const updateCustomFormField = (idx: number, field: string, val: any) => {
    const fields = [...(siteData.customFormFields || [])];
    if (fields[idx]) {
      fields[idx] = { ...fields[idx], [field]: val };
      setSiteData((prev: any) => ({ ...prev, customFormFields: fields }));
    }
  };

  const removeCustomFormField = (idx: number) => {
    const updated = (siteData.customFormFields || []).filter((_: any, i: number) => i !== idx);
    setSiteData((prev: any) => ({ ...prev, customFormFields: updated }));
  };

  // Outdoor Catering Helpers
  const updateOutdoorCatering = (field: string, val: any) => {
    setSiteData((prev: any) => ({
      ...prev,
      outdoorCatering: {
        ...(prev.outdoorCatering || {}),
        [field]: val
      }
    }));
  };

  const updateOutdoorOption = (idx: number, field: string, val: any) => {
    const options = [...(siteData.outdoorCatering?.options || [])];
    if (options[idx]) {
      options[idx] = { ...options[idx], [field]: val };
      updateOutdoorCatering('options', options);
    }
  };

  const addOutdoorOption = () => {
    const count = (siteData.outdoorCatering?.options || []).length + 1;
    const newOption = {
      id: 'opt_' + Date.now(),
      tabTitle: `Option ${count}`,
      name: `New Catering Package ${count}`,
      price: 'Custom Pricing (min 30 pax)',
      desc: 'Description of dishes, items, and varieties included in this package.',
      whatWeBring: 'All equipment necessary for cooking, Bain Marie hot holding units, and disposable plates.',
      whatWeNeed: 'Serving table, power point, and sheltered cooking space.',
      upgrades: 'Gazebo (£70), Serving Waiter (£70), Crockery & Steel Cutlery (£3/pp)'
    };
    updateOutdoorCatering('options', [...(siteData.outdoorCatering?.options || []), newOption]);
    setStatusMessage({ type: 'success', text: '✓ New Outdoor Catering package option added! Edit details and save.' });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const removeOutdoorOption = (idx: number) => {
    const options = (siteData.outdoorCatering?.options || []).filter((_: any, i: number) => i !== idx);
    updateOutdoorCatering('options', options);
  };

  // Live Dosa Catering Helpers
  const updateLiveDosa = (field: string, val: any) => {
    setSiteData((prev: any) => ({
      ...prev,
      liveDosaCatering: {
        ...(prev.liveDosaCatering || {}),
        [field]: val
      }
    }));
  };

  const updateLiveDosaPricing = (field: string, val: any) => {
    setSiteData((prev: any) => ({
      ...prev,
      liveDosaCatering: {
        ...(prev.liveDosaCatering || {}),
        pricing: {
          ...(prev.liveDosaCatering?.pricing || {}),
          [field]: val
        }
      }
    }));
  };

  const updateLiveDosaMenuItem = (idx: number, field: string, val: string) => {
    const items = [...(siteData.liveDosaCatering?.menuItems || [])];
    if (items[idx]) {
      items[idx] = { ...items[idx], [field]: val };
      updateLiveDosa('menuItems', items);
    }
  };

  const addLiveDosaMenuItem = () => {
    const newItem = {
      name: 'New Live Dosa Special (Live)',
      desc: 'Freshly prepared crispy South Indian treat'
    };
    updateLiveDosa('menuItems', [...(siteData.liveDosaCatering?.menuItems || []), newItem]);
    setStatusMessage({ type: 'success', text: '✓ New Live Dosa menu item added! Edit and click Save.' });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const removeLiveDosaMenuItem = (idx: number) => {
    const items = (siteData.liveDosaCatering?.menuItems || []).filter((_: any, i: number) => i !== idx);
    updateLiveDosa('menuItems', items);
  };

  const updateLiveDosaInclusion = (idx: number, val: string) => {
    const items = [...(siteData.liveDosaCatering?.includedItems || [])];
    items[idx] = val;
    updateLiveDosa('includedItems', items);
  };

  const addLiveDosaInclusion = () => {
    updateLiveDosa('includedItems', [...(siteData.liveDosaCatering?.includedItems || []), 'New Included Service / Equipment']);
  };

  const removeLiveDosaInclusion = (idx: number) => {
    const items = (siteData.liveDosaCatering?.includedItems || []).filter((_: any, i: number) => i !== idx);
    updateLiveDosa('includedItems', items);
  };

  const updateLiveDosaUpgrade = (idx: number, field: string, val: string) => {
    const items = [...(siteData.liveDosaCatering?.upgrades || [])];
    if (items[idx]) {
      items[idx] = { ...items[idx], [field]: val };
      updateLiveDosa('upgrades', items);
    }
  };

  const addLiveDosaUpgrade = () => {
    const newUpgrade = { name: 'New Upgrade Option', price: '£50' };
    updateLiveDosa('upgrades', [...(siteData.liveDosaCatering?.upgrades || []), newUpgrade]);
  };

  const removeLiveDosaUpgrade = (idx: number) => {
    const items = (siteData.liveDosaCatering?.upgrades || []).filter((_: any, i: number) => i !== idx);
    updateLiveDosa('upgrades', items);
  };

  // Delivery Platforms Helpers
  const updateDelivery = (platform: string, field: string, val: any) => {
    setSiteData((prev: any) => ({
      ...prev,
      deliveryPlatforms: {
        ...(prev.deliveryPlatforms || {}),
        [platform]: {
          ...(prev.deliveryPlatforms?.[platform] || {}),
          [field]: val
        }
      }
    }));
  };

  const updateDeliveryGeneral = (field: string, val: string) => {
    setSiteData((prev: any) => ({
      ...prev,
      deliveryPlatforms: {
        ...(prev.deliveryPlatforms || {}),
        [field]: val
      }
    }));
  };

  // Legal Policies Helpers
  const updateLegalPolicy = (policyKey: 'privacyPolicy' | 'cookiesPolicy' | 'disclaimer', field: string, val: string) => {
    setSiteData((prev: any) => ({
      ...prev,
      legalPolicies: {
        ...(prev.legalPolicies || {}),
        [policyKey]: {
          ...(prev.legalPolicies?.[policyKey] || {}),
          [field]: val
        }
      }
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
    <div style={{ height: '100vh', maxHeight: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: '#0C0A09', color: '#F5F5F4', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Top Header Bar */}
      <header style={{
        flexShrink: 0,
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

      {/* Main Studio Body - Locked Viewport Height with Independent Scrolling */}
      <div style={{ display: 'flex', flexGrow: 1, height: 'calc(100vh - 65px)', maxHeight: 'calc(100vh - 65px)', overflow: 'hidden' }}>
        
        {/* Sticky Sidebar with Independent Scroll */}
        <aside style={{
          width: '270px',
          flexShrink: 0,
          height: '100%',
          maxHeight: '100%',
          overflowY: 'auto',
          backgroundColor: '#141210',
          borderRight: '1px solid #292524',
          padding: '1.5rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem',
          boxSizing: 'border-box',
        }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#78716C', padding: '0 0.75rem 0.5rem 0.75rem', fontWeight: 700 }}>
            Sections & Content
          </div>

          {[
            { id: 'hero', label: 'Hero & Banner', icon: '🖼️' },
            { id: 'general', label: 'Contact & Hours', icon: '📞' },
            { id: 'topFood', label: 'Top Food Highlights', icon: '⭐' },
            { id: 'menu', label: 'Dining Menu & Prices', icon: '🍲' },
            { id: 'about', label: 'About Story & Stats', icon: '📖' },
            { id: 'catering', label: 'Catering Overview', icon: '🍽️' },
            { id: 'outdoorCatering', label: 'Outdoor Catering Page', icon: '🍱' },
            { id: 'liveDosa', label: 'Live Dosa Catering', icon: '🥞' },
            { id: 'whyUs', label: 'Why Families Love Us', icon: '❤️' },
            { id: 'reviews', label: 'Google Reviews', icon: '💬' },
            { id: 'faqs', label: 'Questions & FAQs', icon: '❓' },
            { id: 'headerFooter', label: 'Navbar & Footer', icon: '🧭' },
            { id: 'forms', label: 'Form Fields & Boxes', icon: '📝' },
            { id: 'delivery', label: 'Delivery & Ordering', icon: '🛵' },
            { id: 'legal', label: 'Legal Policies & Pages', icon: '📜' },
            { id: 'seo', label: 'SEO & Page Ranking', icon: '🚀' },
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

        {/* Content Panel with Internal Independent Scrolling */}
        <main style={{ flexGrow: 1, height: '100%', maxHeight: '100%', overflowY: 'auto', padding: '2rem 2.5rem', boxSizing: 'border-box' }}>

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

          {/* TAB 8: CATERING SERVICES */}
          {activeTab === 'catering' && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Catering Services Content</h2>
                <p style={{ color: '#A8A29E', fontSize: '0.95rem', margin: 0 }}>
                  Customize the headline, service descriptions, and buttons for your event catering section.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ backgroundColor: '#1C1917', padding: '1.5rem', borderRadius: '14px', border: '1px solid #292524' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem 0', color: '#DE7843' }}>Header & Badges</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.5rem' }}>Section Badge</label>
                      <input
                        type="text"
                        value={siteData.catering?.badge || ''}
                        onChange={(e) => updateCatering('badge', e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.5rem' }}>Main Title</label>
                      <input
                        type="text"
                        value={siteData.catering?.title || ''}
                        onChange={(e) => updateCatering('title', e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                      />
                    </div>
                  </div>
                  <div style={{ marginTop: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.5rem' }}>Description Text</label>
                    <textarea
                      rows={3}
                      value={siteData.catering?.description || ''}
                      onChange={(e) => updateCatering('description', e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem', resize: 'vertical' }}
                    />
                  </div>
                </div>

                {/* Features List */}
                <div style={{ backgroundColor: '#1C1917', padding: '1.5rem', borderRadius: '14px', border: '1px solid #292524' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem 0', color: '#DE7843' }}>Catering Features</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {(siteData.catering?.features || []).map((feat: any, idx: number) => (
                      <div key={idx} style={{ backgroundColor: '#292524', padding: '1rem', borderRadius: '10px', border: '1px solid #44403C' }}>
                        <div style={{ marginBottom: '0.75rem' }}>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#A8A29E', marginBottom: '0.35rem' }}>Feature {idx + 1} Title</label>
                          <input
                            type="text"
                            value={feat.title || ''}
                            onChange={(e) => updateCateringFeature(idx, 'title', e.target.value)}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', backgroundColor: '#1C1917', border: '1px solid #57534E', color: '#fff', fontSize: '0.9rem' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#A8A29E', marginBottom: '0.35rem' }}>Feature {idx + 1} Description</label>
                          <input
                            type="text"
                            value={feat.desc || ''}
                            onChange={(e) => updateCateringFeature(idx, 'desc', e.target.value)}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', backgroundColor: '#1C1917', border: '1px solid #57534E', color: '#fff', fontSize: '0.9rem' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Catering Action Buttons */}
                <div style={{ backgroundColor: '#1C1917', padding: '1.5rem', borderRadius: '14px', border: '1px solid #292524' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem 0', color: '#DE7843' }}>Action Buttons</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.5rem' }}>Outdoor Catering Button Text</label>
                      <input
                        type="text"
                        value={siteData.catering?.outdoorButtonText || ''}
                        onChange={(e) => updateCatering('outdoorButtonText', e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.5rem' }}>Live Dosa Button Text</label>
                      <input
                        type="text"
                        value={siteData.catering?.liveDosaButtonText || ''}
                        onChange={(e) => updateCatering('liveDosaButtonText', e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: OUTDOOR CATERING COMPLETE PAGE MANAGER */}
          {activeTab === 'outdoorCatering' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Outdoor Catering Page Management 🍱</h2>
                  <p style={{ color: '#A8A29E', fontSize: '0.95rem', margin: 0 }}>
                    Manage the live Outdoor Catering page (/outdoor-catering), hero text, all 9 package options, dishes, and what we bring.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addOutdoorOption}
                  style={{
                    padding: '0.75rem 1.4rem',
                    borderRadius: '10px',
                    backgroundColor: '#DE7843',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(222, 120, 67, 0.4)',
                  }}
                >
                  + Add New Package / Option
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Hero & Intro Settings */}
                <div style={{ backgroundColor: '#1C1917', padding: '1.75rem', borderRadius: '16px', border: '1px solid #292524' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 1.25rem 0', color: '#DE7843' }}>Hero &amp; Header Content</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.45rem' }}>Top Eyebrow Badge</label>
                      <input
                        type="text"
                        value={siteData.outdoorCatering?.badge || ''}
                        onChange={(e) => updateOutdoorCatering('badge', e.target.value)}
                        placeholder="e.g. 👑 Royal Heritage Catering • 21+ Years UK-Wide"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.45rem' }}>Main Page Heading (H1)</label>
                      <input
                        type="text"
                        value={siteData.outdoorCatering?.title || ''}
                        onChange={(e) => updateOutdoorCatering('title', e.target.value)}
                        placeholder="Authentic 100% Pure Vegetarian Catering"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                      />
                    </div>
                  </div>
                  <div style={{ marginTop: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.45rem' }}>Introductory Paragraph</label>
                    <textarea
                      rows={4}
                      value={siteData.outdoorCatering?.intro || ''}
                      onChange={(e) => updateOutdoorCatering('intro', e.target.value)}
                      placeholder="Comprehensive overview of outdoor catering services..."
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem', resize: 'vertical' }}
                    />
                  </div>
                </div>

                {/* Catering Package Options 1-9 Editor */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>Catering Package Options ({siteData.outdoorCatering?.options?.length || 0})</h3>
                    <span style={{ fontSize: '0.85rem', color: '#A8A29E' }}>All options render as live clickable tabs with instant price calculator</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {(siteData.outdoorCatering?.options || []).map((opt: any, idx: number) => (
                      <div
                        key={opt.id || idx}
                        style={{
                          backgroundColor: '#1C1917',
                          borderRadius: '16px',
                          border: '1px solid #38322E',
                          padding: '1.75rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '1.25rem',
                        }}
                      >
                        {/* Option Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', paddingBottom: '1rem', borderBottom: '1px solid #292524' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{ backgroundColor: '#DE7843', color: '#fff', padding: '3px 10px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800 }}>
                              {opt.tabTitle || `Option ${idx + 1}`}
                            </span>
                            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF' }}>
                              {opt.name || 'Untitled Package'}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              requestConfirm({
                                title: `Delete ${opt.tabTitle || 'Option'}?`,
                                message: `Are you sure you want to remove "${opt.name || opt.tabTitle}" from Outdoor Catering packages?`,
                                confirmLabel: 'Delete Option',
                                confirmColor: '#E11D48',
                                onConfirm: () => removeOutdoorOption(idx),
                              })
                            }
                            style={{ padding: '0.4rem 0.85rem', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.3)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
                          >
                            🗑️ Delete Option
                          </button>
                        </div>

                        {/* Title & Pricing Inputs */}
                        <div style={{ display: 'grid', gridTemplateColumns: '160px 1.4fr 1.6fr', gap: '1rem' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#A8A29E', marginBottom: '0.35rem' }}>Tab Button Text</label>
                            <input
                              type="text"
                              value={opt.tabTitle || ''}
                              onChange={(e) => updateOutdoorOption(idx, 'tabTitle', e.target.value)}
                              placeholder="e.g. Option 1"
                              style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.9rem' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#A8A29E', marginBottom: '0.35rem' }}>Full Package Name</label>
                            <input
                              type="text"
                              value={opt.name || ''}
                              onChange={(e) => updateOutdoorOption(idx, 'name', e.target.value)}
                              placeholder="e.g. Standard Live Dosa Station"
                              style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.9rem' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#A8A29E', marginBottom: '0.35rem' }}>Pricing Terms &amp; Min Pax</label>
                            <input
                              type="text"
                              value={opt.price || ''}
                              onChange={(e) => updateOutdoorOption(idx, 'price', e.target.value)}
                              placeholder="e.g. Weekdays: £11.00/pp (min 35 pax)..."
                              style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#DE7843', fontWeight: 700, fontSize: '0.9rem' }}
                            />
                          </div>
                        </div>

                        {/* Menu & Inclusions */}
                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#A8A29E', marginBottom: '0.35rem' }}>Dishes &amp; Food Menu Items</label>
                          <textarea
                            rows={3}
                            value={opt.desc || ''}
                            onChange={(e) => updateOutdoorOption(idx, 'desc', e.target.value)}
                            placeholder="Detailed list of all curries, dosas, sweets, rice, and chutneys included..."
                            style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.88rem', resize: 'vertical' }}
                          />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#A8A29E', marginBottom: '0.35rem' }}>What We Bring (Equipment &amp; Disposables)</label>
                            <textarea
                              rows={2}
                              value={opt.whatWeBring || ''}
                              onChange={(e) => updateOutdoorOption(idx, 'whatWeBring', e.target.value)}
                              placeholder="Equipment, Bain Marie, 9-inch plates..."
                              style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#D6D3D1', fontSize: '0.85rem', resize: 'vertical' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#A8A29E', marginBottom: '0.35rem' }}>What We Need (From Venue / Host)</label>
                            <textarea
                              rows={2}
                              value={opt.whatWeNeed || ''}
                              onChange={(e) => updateOutdoorOption(idx, 'whatWeNeed', e.target.value)}
                              placeholder="Serving tables, electricity point, shaded space..."
                              style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#D6D3D1', fontSize: '0.85rem', resize: 'vertical' }}
                            />
                          </div>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#A8A29E', marginBottom: '0.35rem' }}>Available Upgrades &amp; Optional Add-ons</label>
                          <input
                            type="text"
                            value={opt.upgrades || ''}
                            onChange={(e) => updateOutdoorOption(idx, 'upgrades', e.target.value)}
                            placeholder="Gazebo (£70), Serving Waiter (£70), Crockery (£3/pp)..."
                            style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.88rem' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: LIVE DOSA CATERING COMPLETE PAGE MANAGER */}
          {activeTab === 'liveDosa' && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Live Dosa Catering Management 🥞</h2>
                <p style={{ color: '#A8A29E', fontSize: '0.95rem', margin: 0 }}>
                  Customize the live dosa catering page (/live-dosa-catering), live menu items, pricing rules, equipment inclusions, and upgrades.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* Hero & Intro */}
                <div style={{ backgroundColor: '#1C1917', padding: '1.75rem', borderRadius: '16px', border: '1px solid #292524' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 1.25rem 0', color: '#DE7843' }}>Header &amp; Headline</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.45rem' }}>Top Eyebrow Badge</label>
                      <input
                        type="text"
                        value={siteData.liveDosaCatering?.badge || ''}
                        onChange={(e) => updateLiveDosa('badge', e.target.value)}
                        placeholder="e.g. 🌿 100% Pure Vegetarian Live Catering"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.45rem' }}>Main Page Heading (H1)</label>
                      <input
                        type="text"
                        value={siteData.liveDosaCatering?.title || ''}
                        onChange={(e) => updateLiveDosa('title', e.target.value)}
                        placeholder="Live Dosa Catering Amersham"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                      />
                    </div>
                  </div>
                  <div style={{ marginTop: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.45rem' }}>Page Subtitle / Overview</label>
                    <textarea
                      rows={3}
                      value={siteData.liveDosaCatering?.subtitle || ''}
                      onChange={(e) => updateLiveDosa('subtitle', e.target.value)}
                      placeholder="Theatrical live dosa and vada stations prepared fresh on the spot..."
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem', resize: 'vertical' }}
                    />
                  </div>
                </div>

                {/* Live Dosa Pricing Structure */}
                <div style={{ backgroundColor: '#1C1917', padding: '1.75rem', borderRadius: '16px', border: '1px solid #292524' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 1.25rem 0', color: '#DE7843' }}>💰 Live Dosa Pricing &amp; Minimums</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#A8A29E', marginBottom: '0.35rem' }}>Weekday Price (£/pp)</label>
                      <input
                        type="text"
                        value={siteData.liveDosaCatering?.pricing?.weekdayPrice || ''}
                        onChange={(e) => updateLiveDosaPricing('weekdayPrice', e.target.value)}
                        placeholder="£11.00"
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#DE7843', fontWeight: 700, fontSize: '0.95rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#A8A29E', marginBottom: '0.35rem' }}>Min Weekday Pax</label>
                      <input
                        type="text"
                        value={siteData.liveDosaCatering?.pricing?.minWeekdayPax || ''}
                        onChange={(e) => updateLiveDosaPricing('minWeekdayPax', e.target.value)}
                        placeholder="35"
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#A8A29E', marginBottom: '0.35rem' }}>Weekday Min Callout</label>
                      <input
                        type="text"
                        value={siteData.liveDosaCatering?.pricing?.weekdayCallout || ''}
                        onChange={(e) => updateLiveDosaPricing('weekdayCallout', e.target.value)}
                        placeholder="£385"
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#A8A29E', marginBottom: '0.35rem' }}>Weekend Price (£/pp)</label>
                      <input
                        type="text"
                        value={siteData.liveDosaCatering?.pricing?.weekendPrice || ''}
                        onChange={(e) => updateLiveDosaPricing('weekendPrice', e.target.value)}
                        placeholder="£12.00"
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#DE7843', fontWeight: 700, fontSize: '0.95rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#A8A29E', marginBottom: '0.35rem' }}>Min Weekend Pax</label>
                      <input
                        type="text"
                        value={siteData.liveDosaCatering?.pricing?.minWeekendPax || ''}
                        onChange={(e) => updateLiveDosaPricing('minWeekendPax', e.target.value)}
                        placeholder="40"
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#A8A29E', marginBottom: '0.35rem' }}>Weekend Min Callout</label>
                      <input
                        type="text"
                        value={siteData.liveDosaCatering?.pricing?.weekendCallout || ''}
                        onChange={(e) => updateLiveDosaPricing('weekendCallout', e.target.value)}
                        placeholder="£480"
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#A8A29E', marginBottom: '0.35rem' }}>Cooking &amp; Serving Duration</label>
                      <input
                        type="text"
                        value={siteData.liveDosaCatering?.pricing?.duration || ''}
                        onChange={(e) => updateLiveDosaPricing('duration', e.target.value)}
                        placeholder="2 Hours live cooking/serving + 30 mins setup"
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.9rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#A8A29E', marginBottom: '0.35rem' }}>Deposit &amp; Payment Terms</label>
                      <input
                        type="text"
                        value={siteData.liveDosaCatering?.pricing?.deposit || ''}
                        onChange={(e) => updateLiveDosaPricing('deposit', e.target.value)}
                        placeholder="50% deposit required at booking, balance in cash after the event."
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Live Menu Items */}
                <div style={{ backgroundColor: '#1C1917', padding: '1.75rem', borderRadius: '16px', border: '1px solid #292524' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#DE7843' }}>Live Dosa Menu Dishes ({siteData.liveDosaCatering?.menuItems?.length || 0})</h3>
                      <span style={{ fontSize: '0.85rem', color: '#A8A29E' }}>All items cooked fresh on-site in front of guests</span>
                    </div>
                    <button
                      type="button"
                      onClick={addLiveDosaMenuItem}
                      style={{ padding: '0.5rem 1rem', borderRadius: '8px', backgroundColor: '#DE7843', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                    >
                      + Add Menu Item
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                    {(siteData.liveDosaCatering?.menuItems || []).map((item: any, idx: number) => (
                      <div key={idx} style={{ backgroundColor: '#292524', padding: '1rem', borderRadius: '10px', border: '1px solid #44403C', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateLiveDosaMenuItem(idx, 'name', e.target.value)}
                            placeholder="Dish Name"
                            style={{ fontWeight: 700, width: '100%', padding: '0.45rem', borderRadius: '6px', backgroundColor: '#1C1917', border: '1px solid #57534E', color: '#fff', fontSize: '0.9rem' }}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              requestConfirm({
                                title: 'Remove Live Dish',
                                message: `Are you sure you want to remove "${item.name}" from Live Dosa menu?`,
                                confirmLabel: 'Delete',
                                confirmColor: '#E11D48',
                                onConfirm: () => removeLiveDosaMenuItem(idx),
                              })
                            }
                            style={{ padding: '0.4rem 0.6rem', borderRadius: '6px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.3)', cursor: 'pointer' }}
                          >
                            ✕
                          </button>
                        </div>
                        <input
                          type="text"
                          value={item.desc}
                          onChange={(e) => updateLiveDosaMenuItem(idx, 'desc', e.target.value)}
                          placeholder="Dish Description"
                          style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', backgroundColor: '#1C1917', border: '1px solid #57534E', color: '#D6D3D1', fontSize: '0.82rem' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Included Equipment & Service */}
                <div style={{ backgroundColor: '#1C1917', padding: '1.75rem', borderRadius: '16px', border: '1px solid #292524' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#DE7843' }}>Included Service &amp; Equipment Checklist</h3>
                      <span style={{ fontSize: '0.85rem', color: '#A8A29E' }}>Points displayed under &ldquo;What is Included in the Price&rdquo;</span>
                    </div>
                    <button
                      type="button"
                      onClick={addLiveDosaInclusion}
                      style={{ padding: '0.5rem 1rem', borderRadius: '8px', backgroundColor: '#DE7843', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                    >
                      + Add Inclusion
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {(siteData.liveDosaCatering?.includedItems || []).map((inc: string, idx: number) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ color: '#DE7843', fontWeight: 800 }}>✓</span>
                        <input
                          type="text"
                          value={inc}
                          onChange={(e) => updateLiveDosaInclusion(idx, e.target.value)}
                          style={{ flex: 1, padding: '0.55rem 0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.9rem' }}
                        />
                        <button
                          type="button"
                          onClick={() => removeLiveDosaInclusion(idx)}
                          style={{ padding: '0.45rem 0.65rem', borderRadius: '6px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.3)', cursor: 'pointer' }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Available Upgrades */}
                <div style={{ backgroundColor: '#1C1917', padding: '1.75rem', borderRadius: '16px', border: '1px solid #292524' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#DE7843' }}>Optional Upgrades &amp; Enhancements</h3>
                      <span style={{ fontSize: '0.85rem', color: '#A8A29E' }}>Gazebos, serving staff, ceramic crockery hire, extra hours</span>
                    </div>
                    <button
                      type="button"
                      onClick={addLiveDosaUpgrade}
                      style={{ padding: '0.5rem 1rem', borderRadius: '8px', backgroundColor: '#DE7843', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                    >
                      + Add Upgrade
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem' }}>
                    {(siteData.liveDosaCatering?.upgrades || []).map((upg: any, idx: number) => (
                      <div key={idx} style={{ backgroundColor: '#292524', padding: '0.85rem', borderRadius: '10px', border: '1px solid #44403C', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="text"
                          value={upg.name}
                          onChange={(e) => updateLiveDosaUpgrade(idx, 'name', e.target.value)}
                          placeholder="Upgrade Name"
                          style={{ flex: 1.5, padding: '0.4rem', borderRadius: '6px', backgroundColor: '#1C1917', border: '1px solid #57534E', color: '#fff', fontSize: '0.88rem' }}
                        />
                        <input
                          type="text"
                          value={upg.price}
                          onChange={(e) => updateLiveDosaUpgrade(idx, 'price', e.target.value)}
                          placeholder="Price"
                          style={{ width: '85px', padding: '0.4rem', borderRadius: '6px', backgroundColor: '#1C1917', border: '1px solid #57534E', color: '#DE7843', fontWeight: 700, fontSize: '0.88rem' }}
                        />
                        <button
                          type="button"
                          onClick={() => removeLiveDosaUpgrade(idx)}
                          style={{ padding: '0.4rem 0.55rem', borderRadius: '6px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.3)', cursor: 'pointer' }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: WHY FAMILIES LOVE US */}
          {activeTab === 'whyUs' && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Why Families Love Us</h2>
                <p style={{ color: '#A8A29E', fontSize: '0.95rem', margin: 0 }}>
                  Manage the 4 trust pillar cards that highlight your culinary authenticity.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ backgroundColor: '#1C1917', padding: '1.5rem', borderRadius: '14px', border: '1px solid #292524' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.5rem' }}>Section Badge</label>
                      <input
                        type="text"
                        value={siteData.whyChooseUs?.badge || ''}
                        onChange={(e) => updateWhyUs('badge', e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.5rem' }}>Section Title</label>
                      <input
                        type="text"
                        value={siteData.whyChooseUs?.title || ''}
                        onChange={(e) => updateWhyUs('title', e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                  {(siteData.whyChooseUs?.cards || []).map((card: any, idx: number) => (
                    <div key={idx} style={{ backgroundColor: '#1C1917', padding: '1.5rem', borderRadius: '14px', border: '1px solid #292524' }}>
                      <span style={{ fontSize: '0.78rem', color: '#DE7843', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Card {idx + 1}</span>
                      <div style={{ marginTop: '0.75rem', marginBottom: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.4rem' }}>Title</label>
                        <input
                          type="text"
                          value={card.title || ''}
                          onChange={(e) => updateWhyUsCard(idx, 'title', e.target.value)}
                          style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.4rem' }}>Description</label>
                        <textarea
                          rows={3}
                          value={card.desc || ''}
                          onChange={(e) => updateWhyUsCard(idx, 'desc', e.target.value)}
                          style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.9rem', resize: 'vertical' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: NAVBAR & FOOTER */}
          {activeTab === 'headerFooter' && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Navbar & Footer Settings</h2>
                <p style={{ color: '#A8A29E', fontSize: '0.95rem', margin: 0 }}>
                  Customize your navigation bar, announcement banner, contact phone, and footer details.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Navbar Settings */}
                <div style={{ backgroundColor: '#1C1917', padding: '1.5rem', borderRadius: '14px', border: '1px solid #292524' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem 0', color: '#DE7843' }}>Navigation Bar</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.5rem' }}>Announcement Bar Text</label>
                      <input
                        type="text"
                        value={siteData.header?.announcement || ''}
                        onChange={(e) => updateHeader('announcement', e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.5rem' }}>Order Button Text</label>
                      <input
                        type="text"
                        value={siteData.header?.orderButtonText || 'Order Online'}
                        onChange={(e) => updateHeader('orderButtonText', e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.5rem' }}>Order Button Link URL</label>
                      <input
                        type="text"
                        value={siteData.header?.orderButtonLink || '/#order'}
                        onChange={(e) => updateHeader('orderButtonLink', e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.5rem' }}>Header Contact Phone</label>
                      <input
                        type="text"
                        value={siteData.header?.phone || siteData.restaurant?.phone || ''}
                        onChange={(e) => updateHeader('phone', e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Settings */}
                <div style={{ backgroundColor: '#1C1917', padding: '1.5rem', borderRadius: '14px', border: '1px solid #292524' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: '#DE7843' }}>Footer Settings (All 4 Columns)</h3>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.82rem', color: '#A8A29E' }}>Customize everything shown in the website footer at the bottom of every page.</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Column 1: Logo & Tagline */}
                    <div style={{ backgroundColor: '#292524', padding: '1.25rem', borderRadius: '10px', border: '1px solid #44403C' }}>
                      <span style={{ fontSize: '0.78rem', color: '#DE7843', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Column 1: Logo & About</span>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '0.75rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.5rem' }}>Footer Logo Image</label>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <input
                              type="text"
                              value={siteData.footer?.logoUrl || siteData.restaurant?.logoUrl || ''}
                              onChange={(e) => updateFooter('logoUrl', e.target.value)}
                              placeholder="/images/migrated/vcsr-logo.webp"
                              style={{ flex: 1, padding: '0.65rem', borderRadius: '8px', backgroundColor: '#1C1917', border: '1px solid #57534E', color: '#fff', fontSize: '0.9rem' }}
                            />
                            <label style={{ padding: '0.65rem 1rem', borderRadius: '8px', backgroundColor: 'rgba(222, 120, 67, 0.15)', color: '#DE7843', border: '1px solid rgba(222, 120, 67, 0.4)', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                              📁 Upload
                              <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => handleImageUpload(e, (url) => updateFooter('logoUrl', url), 'footer-logo')}
                              />
                            </label>
                          </div>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.5rem' }}>About / Heritage Tagline</label>
                          <textarea
                            rows={2}
                            value={siteData.footer?.tagline || ''}
                            onChange={(e) => updateFooter('tagline', e.target.value)}
                            placeholder="Authentic South Indian vegetarian cuisine, served with heart in Amersham."
                            style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', backgroundColor: '#1C1917', border: '1px solid #57534E', color: '#fff', fontSize: '0.9rem', resize: 'vertical' }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Column 2: Quick Links Info */}
                    <div style={{ backgroundColor: '#292524', padding: '1.25rem', borderRadius: '10px', border: '1px solid #44403C' }}>
                      <span style={{ fontSize: '0.78rem', color: '#DE7843', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Column 2: Quick Links</span>
                      <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#D6D3D1' }}>
                        Direct navigation links to: <strong>Menu</strong> (<code>/#menu</code>), <strong>Outdoor Catering</strong> (<code>/outdoor-catering</code>), <strong>Live Dosa Catering</strong> (<code>/live-dosa-catering</code>), and <strong>Contact</strong> (<code>/#contact</code>).
                      </p>
                    </div>

                    {/* Column 3: Contact Details */}
                    <div style={{ backgroundColor: '#292524', padding: '1.25rem', borderRadius: '10px', border: '1px solid #44403C' }}>
                      <span style={{ fontSize: '0.78rem', color: '#DE7843', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Column 3: Contact Details</span>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '0.75rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.4rem' }}>Physical Address</label>
                          <input
                            type="text"
                            value={siteData.footer?.address || siteData.restaurant?.address || ''}
                            onChange={(e) => {
                              updateFooter('address', e.target.value);
                              updateRestaurant('address', e.target.value);
                            }}
                            placeholder="94, Sycamore Road, Amersham, HP6 5EN"
                            style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', backgroundColor: '#1C1917', border: '1px solid #57534E', color: '#fff', fontSize: '0.9rem' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.4rem' }}>Phone Number</label>
                          <input
                            type="text"
                            value={siteData.footer?.phone || siteData.restaurant?.phone || ''}
                            onChange={(e) => {
                              updateFooter('phone', e.target.value);
                              updateRestaurant('phone', e.target.value);
                            }}
                            placeholder="0149 497 2550"
                            style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', backgroundColor: '#1C1917', border: '1px solid #57534E', color: '#fff', fontSize: '0.9rem' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.4rem' }}>Email Address</label>
                          <input
                            type="email"
                            value={siteData.footer?.email || siteData.restaurant?.email || ''}
                            onChange={(e) => {
                              updateFooter('email', e.target.value);
                              updateRestaurant('email', e.target.value);
                            }}
                            placeholder="vcsramersham@gmail.com"
                            style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', backgroundColor: '#1C1917', border: '1px solid #57534E', color: '#fff', fontSize: '0.9rem' }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Column 4: Social Media & Legal Links */}
                    <div style={{ backgroundColor: '#292524', padding: '1.25rem', borderRadius: '10px', border: '1px solid #44403C' }}>
                      <span style={{ fontSize: '0.78rem', color: '#DE7843', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Column 4: Social Profiles, Legal & Copyright</span>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '0.75rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.4rem' }}>Instagram Profile URL</label>
                          <input
                            type="text"
                            value={siteData.footer?.instagram || siteData.restaurant?.instagram || ''}
                            onChange={(e) => {
                              updateFooter('instagram', e.target.value);
                              updateRestaurant('instagram', e.target.value);
                            }}
                            placeholder="https://instagram.com/..."
                            style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', backgroundColor: '#1C1917', border: '1px solid #57534E', color: '#fff', fontSize: '0.9rem' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.4rem' }}>Facebook Profile URL</label>
                          <input
                            type="text"
                            value={siteData.footer?.facebook || siteData.restaurant?.facebook || ''}
                            onChange={(e) => {
                              updateFooter('facebook', e.target.value);
                              updateRestaurant('facebook', e.target.value);
                            }}
                            placeholder="https://facebook.com/..."
                            style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', backgroundColor: '#1C1917', border: '1px solid #57534E', color: '#fff', fontSize: '0.9rem' }}
                          />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.4rem' }}>Copyright Notice</label>
                          <input
                            type="text"
                            value={siteData.footer?.copyright || ''}
                            onChange={(e) => updateFooter('copyright', e.target.value)}
                            placeholder="© 2026 Veg Chennai SriLalitha Amersham . All rights reserved."
                            style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', backgroundColor: '#1C1917', border: '1px solid #57534E', color: '#fff', fontSize: '0.9rem' }}
                          />
                        </div>
                      </div>

                      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #44403C', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.85rem', color: '#A8A29E' }}>
                          Need to edit the text for Privacy Policy, Cookies Policy, or Disclaimer?
                        </span>
                        <button
                          type="button"
                          onClick={() => setActiveTab('legal')}
                          style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '8px',
                            backgroundColor: 'rgba(222, 120, 67, 0.2)',
                            color: '#DE7843',
                            border: '1px solid #DE7843',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Go to Legal Policies Tab 📜 →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: SEO & PAGE RANKING */}
          {activeTab === 'seo' && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>SEO, Keyword Ranking & Meta Data</h2>
                <p style={{ color: '#A8A29E', fontSize: '0.95rem', margin: 0 }}>
                  Manage search engine titles, Google ranking keywords, meta descriptions, and H1 tags across all pages.
                </p>
              </div>

              {/* Page Selector Tabs */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                {[
                  { key: 'home', label: '🏠 Home Page' },
                  { key: 'menu', label: '🍲 Menu Page' },
                  { key: 'outdoorCatering', label: '🥘 Outdoor Catering' },
                  { key: 'liveDosaCatering', label: '🥞 Live Dosa' },
                  { key: 'contact', label: '📍 Contact & Location' },
                  { key: 'privacyPolicy', label: '🔒 Privacy Policy' },
                  { key: 'cookiesPolicy', label: '🍪 Cookies Policy' },
                  { key: 'disclaimer', label: '⚠️ Disclaimer' },
                ].map((pg) => {
                  const isCur = activeSeoPage === pg.key;
                  return (
                    <button
                      key={pg.key}
                      type="button"
                      onClick={() => setActiveSeoPage(pg.key)}
                      style={{
                        padding: '0.65rem 1.25rem',
                        borderRadius: '10px',
                        backgroundColor: isCur ? '#DE7843' : '#292524',
                        color: isCur ? '#fff' : '#D6D3D1',
                        border: isCur ? '1px solid #DE7843' : '1px solid #44403C',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {pg.label}
                    </button>
                  );
                })}
              </div>

              {/* Active SEO Form */}
              {(() => {
                const seoData = siteData.seo?.[activeSeoPage] || {};
                const titleLen = (seoData.title || '').length;
                const descLen = (seoData.description || '').length;

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                    {/* Live Google Search Preview Card */}
                    <div style={{ backgroundColor: '#1C1917', padding: '1.5rem', borderRadius: '14px', border: '1px solid #292524' }}>
                      <span style={{ fontSize: '0.78rem', color: '#DE7843', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Google SERP Live Preview
                      </span>
                      <div style={{ marginTop: '0.85rem', backgroundColor: '#FFFFFF', padding: '1.25rem 1.5rem', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                        <div style={{ fontSize: '0.8rem', color: '#202124', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: '#202124', fontWeight: 600 }}>Veg Chennai SriLalitha</span>
                          <span style={{ color: '#5f6368' }}>› {seoData.url || '/'}</span>
                        </div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '1.15rem', color: '#1a0dab', fontWeight: 500, lineHeight: 1.3 }}>
                          {seoData.title || 'South Indian Vegetarian Restaurant Amersham | 100% Pure Veg'}
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.88rem', color: '#4d5156', lineHeight: 1.45 }}>
                          {seoData.description || 'Top-rated South-Indian Vegetarian Dining in Amersham. Authentic Dosas, Thalis, & Catering Services.'}
                        </p>
                      </div>
                    </div>

                    {/* SEO Inputs */}
                    <div style={{ backgroundColor: '#1C1917', padding: '1.75rem', borderRadius: '14px', border: '1px solid #292524', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {/* Meta Title */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#D6D3D1' }}>Page Meta Title (Browser &amp; Google Title)</label>
                          <span style={{ fontSize: '0.8rem', color: titleLen > 65 ? '#EF4444' : '#10B981', fontWeight: 600 }}>
                            {titleLen} / 60 characters
                          </span>
                        </div>
                        <input
                          type="text"
                          value={seoData.title || ''}
                          onChange={(e) => updateSeo(activeSeoPage, 'title', e.target.value)}
                          placeholder="Primary Google Title Tag"
                          style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                        />
                      </div>

                      {/* Meta Description */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#D6D3D1' }}>Meta Description (Search Snippet)</label>
                          <span style={{ fontSize: '0.8rem', color: descLen > 165 ? '#EF4444' : '#10B981', fontWeight: 600 }}>
                            {descLen} / 160 characters
                          </span>
                        </div>
                        <textarea
                          rows={3}
                          value={seoData.description || ''}
                          onChange={(e) => updateSeo(activeSeoPage, 'description', e.target.value)}
                          placeholder="Brief description that convinces visitors on Google to click your site."
                          style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem', resize: 'vertical' }}
                        />
                      </div>

                      {/* Ranking Keywords */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#D6D3D1', marginBottom: '0.5rem' }}>
                          🎯 Target Google Ranking Keywords (Comma-separated)
                        </label>
                        <input
                          type="text"
                          value={seoData.keywords || ''}
                          onChange={(e) => updateSeo(activeSeoPage, 'keywords', e.target.value)}
                          placeholder="e.g. South Indian Restaurant Amersham, Dosa Amersham, Indian Food Buckinghamshire"
                          style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                        />
                        <span style={{ display: 'block', marginTop: '0.35rem', fontSize: '0.78rem', color: '#78716C' }}>
                          These keywords optimize search engines and meta crawler bots for high ranking in local Amersham &amp; Buckinghamshire searches.
                        </span>
                      </div>

                      {/* Primary Page H1 Tag */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#D6D3D1', marginBottom: '0.5rem' }}>
                            Primary Page H1 Tag
                          </label>
                          <input
                            type="text"
                            value={seoData.h1 || ''}
                            onChange={(e) => updateSeo(activeSeoPage, 'h1', e.target.value)}
                            placeholder="Main H1 headline tag"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#D6D3D1', marginBottom: '0.5rem' }}>
                            Canonical URL
                          </label>
                          <input
                            type="text"
                            value={seoData.canonical || ''}
                            onChange={(e) => updateSeo(activeSeoPage, 'canonical', e.target.value)}
                            placeholder="https://vcsamersham.co.uk/..."
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                          />
                        </div>
                      </div>

                      {/* OG Share Image */}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#D6D3D1', marginBottom: '0.5rem' }}>
                          Social Share Image (OG Image)
                        </label>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          <input
                            type="text"
                            value={seoData.ogImage || ''}
                            onChange={(e) => updateSeo(activeSeoPage, 'ogImage', e.target.value)}
                            placeholder="/images/..."
                            style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                          />
                          <label
                            style={{
                              padding: '0.75rem 1.25rem',
                              borderRadius: '8px',
                              backgroundColor: 'rgba(222, 120, 67, 0.15)',
                              color: '#DE7843',
                              border: '1px solid rgba(222, 120, 67, 0.4)',
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            📁 Upload OG Image
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={(e) => handleImageUpload(e, (url) => updateSeo(activeSeoPage, 'ogImage', url), `seo-${activeSeoPage}`)}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 12: CUSTOM FORM FIELDS & INPUT BOXES */}
          {activeTab === 'forms' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Enquiry &amp; Catering Form Fields 📝</h2>
                  <p style={{ color: '#A8A29E', fontSize: '0.95rem', margin: 0 }}>
                    Add new input boxes, question fields, or dropdowns to live forms. Any box you add here appears immediately on the live website.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addCustomFormField}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.4rem',
                    borderRadius: '10px',
                    backgroundColor: '#DE7843',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(222, 120, 67, 0.4)',
                  }}
                >
                  <span>+</span>
                  <span>Add New Input Box / Field</span>
                </button>
              </div>

              {/* Notice Banner */}
              <div
                style={{
                  backgroundColor: 'rgba(222, 120, 67, 0.1)',
                  border: '1px solid rgba(222, 120, 67, 0.3)',
                  borderRadius: '12px',
                  padding: '1rem 1.25rem',
                  marginBottom: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                }}
              >
                <span style={{ fontSize: '1.4rem' }}>💡</span>
                <span style={{ fontSize: '0.9rem', color: '#FDE6C2', lineHeight: 1.5 }}>
                  <strong>Live Reflection:</strong> When you add an input box (e.g. &ldquo;Special Dietary Notes&rdquo;, &ldquo;Venue Postcode&rdquo;, or &ldquo;Preferred Time&rdquo;), it will automatically render on the corresponding live forms and collect answers from visitors.
                </span>
              </div>

              {/* List of Custom Form Field Boxes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {(!siteData.customFormFields || siteData.customFormFields.length === 0) ? (
                  <div
                    style={{
                      backgroundColor: '#1C1917',
                      border: '1px dashed #44403C',
                      borderRadius: '16px',
                      padding: '3rem 2rem',
                      textAlign: 'center',
                      color: '#A8A29E',
                    }}
                  >
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📝</div>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#FFFFFF', fontSize: '1.2rem' }}>No custom boxes added yet</h3>
                    <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.9rem' }}>Click the button below to add your first custom input field to the live forms.</p>
                    <button
                      type="button"
                      onClick={addCustomFormField}
                      style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: '10px',
                        backgroundColor: '#DE7843',
                        color: '#fff',
                        border: 'none',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      + Add New Input Box
                    </button>
                  </div>
                ) : (
                  siteData.customFormFields.map((field: any, idx: number) => {
                    const isEnabled = field.enabled !== false;

                    return (
                      <div
                        key={field.id || idx}
                        style={{
                          backgroundColor: '#1C1917',
                          borderRadius: '16px',
                          border: isEnabled ? '1px solid #38322E' : '1px solid #292524',
                          padding: '1.5rem',
                          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '1.25rem',
                          opacity: isEnabled ? 1 : 0.65,
                        }}
                      >
                        {/* Top Bar of Field Card */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                backgroundColor: '#292524',
                                border: '1px solid #44403C',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.82rem',
                                fontWeight: 800,
                                color: '#DE7843',
                              }}
                            >
                              {idx + 1}
                            </span>
                            <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#FFFFFF' }}>
                              {field.label || 'Untitled Box'}
                            </span>
                            <span
                              style={{
                                padding: '3px 10px',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                backgroundColor: isEnabled ? 'rgba(34, 197, 94, 0.15)' : 'rgba(120, 113, 108, 0.2)',
                                color: isEnabled ? '#4ADE80' : '#A8A29E',
                                border: isEnabled ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(120, 113, 108, 0.4)',
                              }}
                            >
                              {isEnabled ? '✓ Active on Live Form' : 'Hidden'}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            {/* Enable/Disable Toggle */}
                            <button
                              type="button"
                              onClick={() => updateCustomFormField(idx, 'enabled', !isEnabled)}
                              style={{
                                padding: '0.4rem 0.85rem',
                                borderRadius: '8px',
                                backgroundColor: isEnabled ? 'rgba(34, 197, 94, 0.15)' : '#292524',
                                color: isEnabled ? '#4ADE80' : '#A8A29E',
                                border: '1px solid #44403C',
                                fontSize: '0.82rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                            >
                              {isEnabled ? 'Disable' : 'Enable'}
                            </button>

                            {/* Delete Button with Confirmation */}
                            <button
                              type="button"
                              onClick={() =>
                                requestConfirm({
                                  title: 'Delete Form Box?',
                                  message: `Are you sure you want to remove the "${field.label || 'Custom Box'}" input from all forms?`,
                                  confirmLabel: 'Delete Box',
                                  confirmColor: '#E11D48',
                                  onConfirm: () => removeCustomFormField(idx),
                                })
                              }
                              style={{
                                padding: '0.4rem 0.85rem',
                                borderRadius: '8px',
                                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                                color: '#F87171',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                fontSize: '0.82rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>

                        {/* Settings Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                          {/* Label / Question Title */}
                          <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#D6D3D1', marginBottom: '0.4rem' }}>
                              Field Label / Box Title *
                            </label>
                            <input
                              type="text"
                              value={field.label || ''}
                              onChange={(e) => updateCustomFormField(idx, 'label', e.target.value)}
                              placeholder="e.g. Dietary Requirements &amp; Allergens"
                              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                            />
                          </div>

                          {/* Placeholder Text */}
                          <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#D6D3D1', marginBottom: '0.4rem' }}>
                              Placeholder Text
                            </label>
                            <input
                              type="text"
                              value={field.placeholder || ''}
                              onChange={(e) => updateCustomFormField(idx, 'placeholder', e.target.value)}
                              placeholder="e.g. Enter special requirements (Jain, Vegan, etc.)"
                              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                            />
                          </div>

                          {/* Input Type */}
                          <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#D6D3D1', marginBottom: '0.4rem' }}>
                              Input Box Type
                            </label>
                            <select
                              value={field.type || 'text'}
                              onChange={(e) => updateCustomFormField(idx, 'type', e.target.value)}
                              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                            >
                              <option value="text">Single-line Text Box</option>
                              <option value="textarea">Multi-line Text Area</option>
                              <option value="number">Number Box (e.g. Pax, Budget)</option>
                              <option value="date">Date Picker Box</option>
                              <option value="tel">Phone / Mobile Number</option>
                              <option value="email">Email Address Box</option>
                            </select>
                          </div>

                          {/* Form Target Placement */}
                          <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#D6D3D1', marginBottom: '0.4rem' }}>
                              Display on Forms
                            </label>
                            <select
                              value={field.formTarget || 'all'}
                              onChange={(e) => updateCustomFormField(idx, 'formTarget', e.target.value)}
                              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                            >
                              <option value="all">All Forms (Catering + Contact)</option>
                              <option value="catering">All Catering Forms (Outdoor + Live Dosa)</option>
                              <option value="outdoorCatering">Outdoor Catering Form Only</option>
                              <option value="liveDosa">Live Dosa Catering Form Only</option>
                              <option value="contact">Contact Form Only</option>
                            </select>
                          </div>
                        </div>

                        {/* Bottom Options: Mandatory Toggle & Live Preview */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', paddingTop: '0.5rem', borderTop: '1px solid #292524' }}>
                          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.88rem', color: '#D6D3D1', fontWeight: 600 }}>
                            <input
                              type="checkbox"
                              checked={!!field.required}
                              onChange={(e) => updateCustomFormField(idx, 'required', e.target.checked)}
                              style={{ width: '16px', height: '16px', accentColor: '#DE7843' }}
                            />
                            <span>Make this a required / mandatory field (*)</span>
                          </label>

                          {/* Live Box Preview */}
                          <div style={{ fontSize: '0.82rem', color: '#A8A29E' }}>
                            Preview: <span style={{ color: '#FDE6C2', fontStyle: 'italic' }}>&ldquo;{field.label || 'Label'}&rdquo; ({field.type || 'text'}) {field.required ? '*' : ''}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 13: DELIVERY PLATFORMS & ONLINE ORDERING */}
          {activeTab === 'delivery' && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Delivery Partners &amp; Online Ordering 🛵</h2>
                <p style={{ color: '#A8A29E', fontSize: '0.95rem', margin: 0 }}>
                  Manage URLs and status for external delivery platforms (Just Eat, Deliveroo, Uber Eats) and direct phone takeaway collection.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                {/* General Delivery Note & Phone */}
                <div style={{ backgroundColor: '#1C1917', padding: '1.75rem', borderRadius: '16px', border: '1px solid #292524' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 1.25rem 0', color: '#DE7843' }}>Takeaway Phone &amp; Customer Note</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.45rem' }}>Direct Order Phone Number</label>
                      <input
                        type="text"
                        value={siteData.deliveryPlatforms?.orderPhone || siteData.restaurant?.phone || ''}
                        onChange={(e) => updateDeliveryGeneral('orderPhone', e.target.value)}
                        placeholder="0149 497 2550"
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.45rem' }}>Ordering Instructions Note</label>
                      <input
                        type="text"
                        value={siteData.deliveryPlatforms?.deliveryNote || ''}
                        onChange={(e) => updateDeliveryGeneral('deliveryNote', e.target.value)}
                        placeholder="Order online for fast doorstep delivery or call us directly for collection takeaway."
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                      />
                    </div>
                  </div>
                </div>

                {/* 3 Major Delivery Partners */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                  {/* Just Eat */}
                  <div style={{ backgroundColor: '#1C1917', padding: '1.5rem', borderRadius: '14px', border: '1px solid #292524', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>🍔</span>
                        <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#FFFFFF' }}>Just Eat</span>
                      </div>
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.82rem', color: '#D6D3D1', fontWeight: 600 }}>
                        <input
                          type="checkbox"
                          checked={siteData.deliveryPlatforms?.justEat?.enabled !== false}
                          onChange={(e) => updateDelivery('justEat', 'enabled', e.target.checked)}
                          style={{ width: '16px', height: '16px', accentColor: '#DE7843' }}
                        />
                        <span>Active</span>
                      </label>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#A8A29E', marginBottom: '0.35rem' }}>Just Eat Restaurant Link URL</label>
                      <input
                        type="text"
                        value={siteData.deliveryPlatforms?.justEat?.url || ''}
                        onChange={(e) => updateDelivery('justEat', 'url', e.target.value)}
                        placeholder="https://www.just-eat.co.uk/..."
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>

                  {/* Deliveroo */}
                  <div style={{ backgroundColor: '#1C1917', padding: '1.5rem', borderRadius: '14px', border: '1px solid #292524', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>🦘</span>
                        <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#FFFFFF' }}>Deliveroo</span>
                      </div>
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.82rem', color: '#D6D3D1', fontWeight: 600 }}>
                        <input
                          type="checkbox"
                          checked={siteData.deliveryPlatforms?.deliveroo?.enabled !== false}
                          onChange={(e) => updateDelivery('deliveroo', 'enabled', e.target.checked)}
                          style={{ width: '16px', height: '16px', accentColor: '#DE7843' }}
                        />
                        <span>Active</span>
                      </label>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#A8A29E', marginBottom: '0.35rem' }}>Deliveroo Restaurant Link URL</label>
                      <input
                        type="text"
                        value={siteData.deliveryPlatforms?.deliveroo?.url || ''}
                        onChange={(e) => updateDelivery('deliveroo', 'url', e.target.value)}
                        placeholder="https://deliveroo.co.uk/..."
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>

                  {/* Uber Eats */}
                  <div style={{ backgroundColor: '#1C1917', padding: '1.5rem', borderRadius: '14px', border: '1px solid #292524', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>🟢</span>
                        <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#FFFFFF' }}>Uber Eats</span>
                      </div>
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.82rem', color: '#D6D3D1', fontWeight: 600 }}>
                        <input
                          type="checkbox"
                          checked={siteData.deliveryPlatforms?.uberEats?.enabled !== false}
                          onChange={(e) => updateDelivery('uberEats', 'enabled', e.target.checked)}
                          style={{ width: '16px', height: '16px', accentColor: '#DE7843' }}
                        />
                        <span>Active</span>
                      </label>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#A8A29E', marginBottom: '0.35rem' }}>Uber Eats Restaurant Link URL</label>
                      <input
                        type="text"
                        value={siteData.deliveryPlatforms?.uberEats?.url || ''}
                        onChange={(e) => updateDelivery('uberEats', 'url', e.target.value)}
                        placeholder="https://www.ubereats.com/..."
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.9rem' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 14: LEGAL POLICIES & PAGES */}
          {activeTab === 'legal' && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Legal Policies &amp; Compliance Pages 📜</h2>
                <p style={{ color: '#A8A29E', fontSize: '0.95rem', margin: 0 }}>
                  Customize live policy pages (/privacy-policy, /cookies-policy, and /disclaimer) dynamically.
                </p>
              </div>

              {/* Policy Selector Pills */}
              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                {[
                  { key: 'privacyPolicy', label: '🔒 Privacy Policy (/privacy-policy)' },
                  { key: 'cookiesPolicy', label: '🍪 Cookies Policy (/cookies-policy)' },
                  { key: 'disclaimer', label: '⚠️ Disclaimer (/disclaimer)' },
                ].map((p) => {
                  const isCur = activeLegalTab === p.key;
                  return (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => setActiveLegalTab(p.key as any)}
                      style={{
                        padding: '0.65rem 1.25rem',
                        borderRadius: '10px',
                        backgroundColor: isCur ? '#DE7843' : '#292524',
                        color: isCur ? '#fff' : '#D6D3D1',
                        border: isCur ? '1px solid #DE7843' : '1px solid #44403C',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>

              {/* PRIVACY POLICY FORM */}
              {activeLegalTab === 'privacyPolicy' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: '#1C1917', padding: '1.75rem', borderRadius: '16px', border: '1px solid #292524' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.45rem' }}>Page Heading Title</label>
                      <input
                        type="text"
                        value={siteData.legalPolicies?.privacyPolicy?.title || 'Privacy Policy'}
                        onChange={(e) => updateLegalPolicy('privacyPolicy', 'title', e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.45rem' }}>Effective Date</label>
                      <input
                        type="text"
                        value={siteData.legalPolicies?.privacyPolicy?.effectiveDate || '01/01/2027'}
                        onChange={(e) => updateLegalPolicy('privacyPolicy', 'effectiveDate', e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.45rem' }}>Introductory Summary</label>
                    <textarea
                      rows={3}
                      value={siteData.legalPolicies?.privacyPolicy?.intro || ''}
                      onChange={(e) => updateLegalPolicy('privacyPolicy', 'intro', e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.9rem', resize: 'vertical' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.45rem' }}>Information We Collect</label>
                    <textarea
                      rows={2}
                      value={siteData.legalPolicies?.privacyPolicy?.infoCollected || ''}
                      onChange={(e) => updateLegalPolicy('privacyPolicy', 'infoCollected', e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.9rem', resize: 'vertical' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.45rem' }}>How We Use Your Information</label>
                    <textarea
                      rows={2}
                      value={siteData.legalPolicies?.privacyPolicy?.howWeUse || ''}
                      onChange={(e) => updateLegalPolicy('privacyPolicy', 'howWeUse', e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.9rem', resize: 'vertical' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.45rem' }}>Data Sharing &amp; Third Parties</label>
                    <textarea
                      rows={2}
                      value={siteData.legalPolicies?.privacyPolicy?.sharing || ''}
                      onChange={(e) => updateLegalPolicy('privacyPolicy', 'sharing', e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.9rem', resize: 'vertical' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.45rem' }}>Data Security</label>
                    <textarea
                      rows={2}
                      value={siteData.legalPolicies?.privacyPolicy?.security || ''}
                      onChange={(e) => updateLegalPolicy('privacyPolicy', 'security', e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.9rem', resize: 'vertical' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.45rem' }}>Cookies &amp; Tracking Notice</label>
                    <textarea
                      rows={2}
                      value={siteData.legalPolicies?.privacyPolicy?.cookies || ''}
                      onChange={(e) => updateLegalPolicy('privacyPolicy', 'cookies', e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.9rem', resize: 'vertical' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.45rem' }}>Customer Rights Clause</label>
                    <textarea
                      rows={2}
                      value={siteData.legalPolicies?.privacyPolicy?.rights || ''}
                      onChange={(e) => updateLegalPolicy('privacyPolicy', 'rights', e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.9rem', resize: 'vertical' }}
                    />
                  </div>
                </div>
              )}

              {/* COOKIES POLICY FORM */}
              {activeLegalTab === 'cookiesPolicy' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: '#1C1917', padding: '1.75rem', borderRadius: '16px', border: '1px solid #292524' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.45rem' }}>Page Heading Title</label>
                      <input
                        type="text"
                        value={siteData.legalPolicies?.cookiesPolicy?.title || 'Cookie Policy'}
                        onChange={(e) => updateLegalPolicy('cookiesPolicy', 'title', e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.45rem' }}>Effective Date</label>
                      <input
                        type="text"
                        value={siteData.legalPolicies?.cookiesPolicy?.effectiveDate || '01/01/2027'}
                        onChange={(e) => updateLegalPolicy('cookiesPolicy', 'effectiveDate', e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.45rem' }}>What Are Cookies?</label>
                    <textarea
                      rows={2}
                      value={siteData.legalPolicies?.cookiesPolicy?.whatAreCookies || ''}
                      onChange={(e) => updateLegalPolicy('cookiesPolicy', 'whatAreCookies', e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.9rem', resize: 'vertical' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.45rem' }}>How We Use Cookies</label>
                    <textarea
                      rows={2}
                      value={siteData.legalPolicies?.cookiesPolicy?.howWeUse || ''}
                      onChange={(e) => updateLegalPolicy('cookiesPolicy', 'howWeUse', e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.9rem', resize: 'vertical' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.45rem' }}>Managing Cookies In Browser</label>
                    <textarea
                      rows={2}
                      value={siteData.legalPolicies?.cookiesPolicy?.managing || ''}
                      onChange={(e) => updateLegalPolicy('cookiesPolicy', 'managing', e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.9rem', resize: 'vertical' }}
                    />
                  </div>
                </div>
              )}

              {/* DISCLAIMER FORM */}
              {activeLegalTab === 'disclaimer' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: '#1C1917', padding: '1.75rem', borderRadius: '16px', border: '1px solid #292524' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.45rem' }}>Page Heading Title</label>
                    <input
                      type="text"
                      value={siteData.legalPolicies?.disclaimer?.title || 'Disclaimer'}
                      onChange={(e) => updateLegalPolicy('disclaimer', 'title', e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.95rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.45rem' }}>Food Safety &amp; Allergen Disclaimer</label>
                    <textarea
                      rows={3}
                      value={siteData.legalPolicies?.disclaimer?.foodSafety || ''}
                      onChange={(e) => updateLegalPolicy('disclaimer', 'foodSafety', e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.9rem', resize: 'vertical' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.45rem' }}>Accuracy of Information</label>
                    <textarea
                      rows={2}
                      value={siteData.legalPolicies?.disclaimer?.accuracy || ''}
                      onChange={(e) => updateLegalPolicy('disclaimer', 'accuracy', e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.9rem', resize: 'vertical' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.45rem' }}>Limitation of Liability</label>
                    <textarea
                      rows={2}
                      value={siteData.legalPolicies?.disclaimer?.liability || ''}
                      onChange={(e) => updateLegalPolicy('disclaimer', 'liability', e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.9rem', resize: 'vertical' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.45rem' }}>Preparation &amp; Delivery Times</label>
                    <textarea
                      rows={2}
                      value={siteData.legalPolicies?.disclaimer?.timings || ''}
                      onChange={(e) => updateLegalPolicy('disclaimer', 'timings', e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.9rem', resize: 'vertical' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#D6D3D1', marginBottom: '0.45rem' }}>Food Photography &amp; Images Disclaimer</label>
                    <textarea
                      rows={2}
                      value={siteData.legalPolicies?.disclaimer?.foodImages || ''}
                      onChange={(e) => updateLegalPolicy('disclaimer', 'foodImages', e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#292524', border: '1px solid #44403C', color: '#fff', fontSize: '0.9rem', resize: 'vertical' }}
                    />
                  </div>
                </div>
              )}
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
