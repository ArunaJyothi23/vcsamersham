'use client';

import React, { useState, useMemo } from 'react';
import {
  getDiscoveredPages,
  getGlobalSeo,
  getPageSeo,
  evaluatePageSeo,
  calculateSeoDashboard,
  validateRedirectRule,
  normalizeCanonicalUrl,
  PageSEO,
  GlobalSEO,
  RedirectRule,
} from '@/lib/seoService';

interface SeoManagementProps {
  siteData: any;
  setSiteData: React.Dispatch<React.SetStateAction<any>>;
  handleImageUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (url: string) => void,
    targetId: string
  ) => Promise<void>;
  setStatusMessage: (msg: { type: 'success' | 'error'; text: string } | null) => void;
  saveAllChanges: () => Promise<void>;
}

interface MediaItem {
  name: string;
  url: string;
  folder: string;
  sizeBytes: number;
  modifiedMs: number;
}

export default function SeoManagement({
  siteData,
  setSiteData,
  handleImageUpload,
  setStatusMessage,
  saveAllChanges,
}: SeoManagementProps) {
  // Navigation sub-views: 'pages' | 'editor' | 'dashboard' | 'global' | 'redirects'
  const [subView, setSubView] = useState<'dashboard' | 'pages' | 'editor' | 'global' | 'redirects'>('pages');
  const [selectedRouteOrId, setSelectedRouteOrId] = useState<string>('home');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Complete' | 'Needs Attention' | 'Missing' | 'noindex'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [socialPreviewType, setSocialPreviewType] = useState<'og' | 'twitter'>('og');

  // Custom route modal state
  const [newRouteModalOpen, setNewRouteModalOpen] = useState(false);
  const [newRoutePath, setNewRoutePath] = useState('');
  const [newRouteName, setNewRouteName] = useState('');

  // Redirect management state
  const [newRedirectFrom, setNewRedirectFrom] = useState('');
  const [newRedirectTo, setNewRedirectTo] = useState('');
  const [newRedirectStatus, setNewRedirectStatus] = useState<301 | 302>(301);

  // Media picker modal state
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaFilter, setMediaFilter] = useState<'all' | 'uploads' | 'images' | 'migrated'>('all');
  const [onSelectMediaCallback, setOnSelectMediaCallback] = useState<((url: string) => void) | null>(null);

  // Load available media library files
  async function openMediaPicker(callback: (url: string) => void) {
    setOnSelectMediaCallback(() => callback);
    setMediaPickerOpen(true);
    if (mediaItems.length === 0) {
      setMediaLoading(true);
      try {
        const res = await fetch('/api/admin/media');
        const data = await res.json();
        if (data.success && Array.isArray(data.items)) {
          setMediaItems(data.items);
        }
      } catch (err) {
        console.error('Failed to load media files:', err);
      } finally {
        setMediaLoading(false);
      }
    }
  }

  // Get current global SEO config
  const globalSeo: GlobalSEO = useMemo(() => {
    return getGlobalSeo(siteData);
  }, [siteData]);

  // Discover all registered and dynamic website routes
  const discoveredPages = useMemo(() => {
    return getDiscoveredPages(siteData);
  }, [siteData]);

  // Prepare full list of all PageSEO objects with evaluation
  const evaluatedPages = useMemo(() => {
    const rawPages = discoveredPages.map((pg) => getPageSeo(pg.route, siteData));
    return rawPages.map((page) => ({
      page,
      evaluation: evaluatePageSeo(page, rawPages),
    }));
  }, [discoveredPages, siteData]);

  // Calculate high-level dashboard metrics
  const dashboardStats = useMemo(() => {
    const allPages = evaluatedPages.map((item) => item.page);
    return calculateSeoDashboard(allPages, siteData);
  }, [evaluatedPages, siteData]);

  // Current page being edited in the editor view
  const currentItem = useMemo(() => {
    const found = evaluatedPages.find(
      (item) =>
        item.page.id === selectedRouteOrId ||
        item.page.route === selectedRouteOrId ||
        (selectedRouteOrId === 'home' && item.page.route === '/')
    );
    if (found) return found;
    return evaluatedPages[0] || null;
  }, [evaluatedPages, selectedRouteOrId]);

  // Update Page SEO field safely
  const updatePageField = (field: keyof PageSEO, val: any) => {
    if (!currentItem) return;
    const targetKey = currentItem.page.id || currentItem.page.route;

    setSiteData((prev: any) => {
      const existingSeo = prev?.seo || {};
      const existingItem = existingSeo[targetKey] || existingSeo[currentItem.page.route] || {};

      return {
        ...prev,
        seo: {
          ...existingSeo,
          [targetKey]: {
            ...existingItem,
            id: currentItem.page.id,
            route: currentItem.page.route,
            pageName: currentItem.page.pageName,
            [field]: val,
            updatedAt: new Date().toISOString(),
            // Keep legacy aliases in sync
            ...(field === 'seoTitle' ? { title: val } : {}),
            ...(field === 'metaDescription' ? { description: val } : {}),
            ...(field === 'canonicalUrl' ? { canonical: val } : {}),
            ...(field === 'secondaryKeywords' ? { keywords: val } : {}),
          },
        },
      };
    });
  };

  // Update Global SEO field
  const updateGlobalField = (field: string, val: any) => {
    setSiteData((prev: any) => {
      const cur = prev?.globalSeo || {};
      return {
        ...prev,
        globalSeo: {
          ...cur,
          [field]: val,
        },
      };
    });
  };

  // Update Nested Organization field
  const updateOrgField = (subField: string, val: any) => {
    setSiteData((prev: any) => {
      const cur = prev?.globalSeo || {};
      const org = cur.organization || {};
      return {
        ...prev,
        globalSeo: {
          ...cur,
          organization: {
            ...org,
            [subField]: val,
          },
        },
      };
    });
  };

  // Add custom route
  const handleAddCustomRoute = () => {
    if (!newRoutePath.trim()) return;
    let cleanPath = newRoutePath.trim();
    if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;
    const cleanName = newRouteName.trim() || cleanPath.replace('/', '');
    const cleanId = cleanPath.replace('/', '') || 'page_' + Date.now();

    setSiteData((prev: any) => ({
      ...prev,
      seo: {
        ...(prev.seo || {}),
        [cleanId]: {
          id: cleanId,
          route: cleanPath,
          pageName: cleanName,
          seoTitle: `${cleanName} | ${globalSeo.siteName}`,
          metaDescription: `Read more about ${cleanName} at ${globalSeo.siteName}.`,
          canonicalUrl: normalizeCanonicalUrl(
            `${globalSeo.siteUrl}${cleanPath === '/' ? '' : cleanPath}`,
            globalSeo.siteUrl
          ),
          robotsIndex: true,
          robotsFollow: true,
          schemaType: 'WebPage',
          updatedAt: new Date().toISOString(),
        },
      },
    }));

    setNewRoutePath('');
    setNewRouteName('');
    setNewRouteModalOpen(false);
    setSelectedRouteOrId(cleanId);
    setSubView('editor');
    setStatusMessage({ type: 'success', text: `Page route ${cleanPath} registered successfully!` });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Add redirect rule with validation
  const handleAddRedirect = () => {
    const existing: RedirectRule[] = Array.isArray(siteData?.redirects) ? siteData.redirects : [];
    const validation = validateRedirectRule(newRedirectFrom, newRedirectTo, existing);

    if (!validation.valid) {
      setStatusMessage({ type: 'error', text: validation.error || 'Invalid redirect rule.' });
      setTimeout(() => setStatusMessage(null), 5000);
      return;
    }

    const newRule: RedirectRule = {
      id: 'redir_' + Date.now(),
      fromPath: newRedirectFrom.trim().replace(/\/$/, '') || '/',
      toPath: newRedirectTo.trim(),
      statusCode: newRedirectStatus,
      createdAt: new Date().toISOString(),
    };

    setSiteData((prev: any) => ({
      ...prev,
      redirects: [...(prev?.redirects || []), newRule],
    }));

    setNewRedirectFrom('');
    setNewRedirectTo('');
    setStatusMessage({ type: 'success', text: `Redirect rule added! Click 'Save All SEO Changes' to activate.` });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Delete redirect rule
  const handleDeleteRedirect = (id: string) => {
    setSiteData((prev: any) => ({
      ...prev,
      redirects: (prev?.redirects || []).filter((r: RedirectRule) => r.id !== id),
    }));
    setStatusMessage({ type: 'success', text: 'Redirect rule removed.' });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Filtered pages for table
  const filteredPages = useMemo(() => {
    return evaluatedPages.filter(({ page, evaluation }) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = page.pageName?.toLowerCase().includes(q);
        const matchesRoute = page.route?.toLowerCase().includes(q);
        const matchesTitle = (page.seoTitle || page.title || '').toLowerCase().includes(q);
        if (!matchesName && !matchesRoute && !matchesTitle) return false;
      }
      if (statusFilter === 'all') return true;
      if (statusFilter === 'noindex') return page.robotsIndex === false;
      return evaluation.status === statusFilter;
    });
  }, [evaluatedPages, searchQuery, statusFilter]);

  const activeRedirects: RedirectRule[] = Array.isArray(siteData?.redirects) ? siteData.redirects : [];

  return (
    <div style={{ color: '#E7E5E4' }}>
      {/* Top Header & Action Row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.75rem',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid #292524',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
              Technical SEO &amp; Page Metadata
            </h2>
            <span
              style={{
                backgroundColor: 'rgba(222, 120, 67, 0.15)',
                color: '#DE7843',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
                border: '1px solid rgba(222, 120, 67, 0.35)',
              }}
            >
              Page-Level Engine
            </span>
          </div>
          <p style={{ color: '#A8A29E', fontSize: '0.92rem', margin: 0 }}>
            Configure granular search engine metadata, Open Graph cards, Google Search previews, robots directives, and Schema.org structured data for every page.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setNewRouteModalOpen(true)}
            style={{
              padding: '0.65rem 1.15rem',
              borderRadius: '8px',
              backgroundColor: '#292524',
              color: '#F5F5F4',
              border: '1px solid #44403C',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span>➕</span> Add Page Route
          </button>

          <button
            type="button"
            onClick={saveAllChanges}
            style={{
              padding: '0.65rem 1.35rem',
              borderRadius: '8px',
              backgroundColor: '#DE7843',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 4px 12px rgba(222, 120, 67, 0.25)',
            }}
          >
            <span>💾</span> Save All SEO Changes
          </button>
        </div>
      </div>

      {/* Sub-View Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginBottom: '1.75rem',
          borderBottom: '1px solid #292524',
          paddingBottom: '0.75rem',
        }}
      >
        {[
          { key: 'pages', label: '📄 All Website Pages', count: evaluatedPages.length },
          { key: 'editor', label: '✏️ Page SEO Editor', count: null },
          { key: 'dashboard', label: '📊 SEO Audit & Health', count: dashboardStats.needsAttentionPages + dashboardStats.missingPages + dashboardStats.orphanPages.length },
          { key: 'global', label: '🌐 Global SEO & Verification', count: null },
          { key: 'redirects', label: '🔀 URL Redirects', count: activeRedirects.length },
        ].map((tab) => {
          const isCur = subView === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSubView(tab.key as any)}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '8px',
                backgroundColor: isCur ? '#DE7843' : '#1C1917',
                color: isCur ? '#FFFFFF' : '#D6D3D1',
                border: isCur ? '1px solid #DE7843' : '1px solid #292524',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.15s ease-in-out',
              }}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span
                  style={{
                    backgroundColor: isCur ? 'rgba(0,0,0,0.25)' : '#292524',
                    color: isCur ? '#FFFFFF' : tab.key === 'dashboard' && tab.count > 0 ? '#F59E0B' : '#A8A29E',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '999px',
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* VIEW 1: ALL WEBSITE PAGES (Table List) */}
      {subView === 'pages' && (
        <div>
          {/* Quick Metrics Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            {[
              { label: 'Total Pages', val: dashboardStats.totalPages, color: '#F5F5F4', bg: '#1C1917', filter: 'all' },
              { label: 'Complete SEO', val: dashboardStats.completePages, color: '#10B981', bg: 'rgba(16, 185, 129, 0.08)', filter: 'Complete' },
              { label: 'Needs Attention', val: dashboardStats.needsAttentionPages, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.08)', filter: 'Needs Attention' },
              { label: 'Missing SEO', val: dashboardStats.missingPages, color: '#EF4444', bg: 'rgba(239, 68, 68, 0.08)', filter: 'Missing' },
              { label: 'Noindex Pages', val: dashboardStats.noindexPagesCount, color: '#818CF8', bg: 'rgba(129, 140, 248, 0.08)', filter: 'noindex' },
            ].map((m) => {
              const isSelected = statusFilter === m.filter;
              return (
                <div
                  key={m.label}
                  onClick={() => setStatusFilter(m.filter as any)}
                  style={{
                    backgroundColor: m.bg,
                    border: isSelected ? `2px solid ${m.color}` : '1px solid #292524',
                    borderRadius: '12px',
                    padding: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ fontSize: '0.8rem', color: '#A8A29E', fontWeight: 600, textTransform: 'uppercase' }}>
                    {m.label}
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: m.color, marginTop: '0.25rem' }}>
                    {m.val}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Search & Filter Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
              <input
                type="text"
                placeholder="Search page name, URL, or SEO title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem 0.65rem 2.2rem',
                  borderRadius: '8px',
                  backgroundColor: '#1C1917',
                  border: '1px solid #292524',
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                }}
              />
              <span style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#78716C' }}>
                🔍
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', color: '#A8A29E', fontWeight: 600 }}>Filter:</span>
              {(['all', 'Complete', 'Needs Attention', 'Missing', 'noindex'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setStatusFilter(f)}
                  style={{
                    padding: '0.4rem 0.8rem',
                    borderRadius: '6px',
                    backgroundColor: statusFilter === f ? '#DE7843' : '#292524',
                    color: statusFilter === f ? '#FFFFFF' : '#D6D3D1',
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {f === 'noindex' ? 'Noindex' : f}
                </button>
              ))}
            </div>
          </div>

          {/* Pages Table */}
          <div
            style={{
              backgroundColor: '#1C1917',
              borderRadius: '12px',
              border: '1px solid #292524',
              overflow: 'hidden',
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#141211', borderBottom: '1px solid #292524', color: '#A8A29E', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <th style={{ padding: '0.85rem 1.25rem' }}>Page Name</th>
                    <th style={{ padding: '0.85rem 1rem' }}>URL / Route</th>
                    <th style={{ padding: '0.85rem 1rem' }}>SEO Title Preview</th>
                    <th style={{ padding: '0.85rem 1rem' }}>Robots</th>
                    <th style={{ padding: '0.85rem 1rem' }}>SEO Status</th>
                    <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPages.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#78716C' }}>
                        No pages match the current filter or search query.
                      </td>
                    </tr>
                  ) : (
                    filteredPages.map(({ page, evaluation }) => {
                      const isComplete = evaluation.status === 'Complete';
                      const isNeedsAttention = evaluation.status === 'Needs Attention';

                      return (
                        <tr
                          key={page.route}
                          style={{
                            borderBottom: '1px solid #24201E',
                            transition: 'background-color 0.15s',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#221F1D')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <td style={{ padding: '1rem 1.25rem' }}>
                            <div style={{ fontWeight: 700, color: '#F5F5F4' }}>{page.pageName}</div>
                            {page.schemaType && (
                              <span style={{ fontSize: '0.72rem', color: '#DE7843', backgroundColor: 'rgba(222, 120, 67, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                                Schema: {page.schemaType}
                              </span>
                            )}
                          </td>

                          <td style={{ padding: '1rem 1rem', fontFamily: 'monospace', color: '#D6D3D1', fontSize: '0.85rem' }}>
                            {page.route}
                          </td>

                          <td style={{ padding: '1rem 1rem', maxWidth: '280px' }}>
                            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: page.seoTitle || page.title ? '#E7E5E4' : '#78716C' }}>
                              {page.seoTitle || page.title || '— No Title Set —'}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: evaluation.titleLength > 65 ? '#EF4444' : evaluation.titleLength < 30 ? '#F59E0B' : '#10B981', marginTop: '2px' }}>
                              {evaluation.titleLength} / 60 characters
                            </div>
                          </td>

                          <td style={{ padding: '1rem 1rem' }}>
                            <span
                              style={{
                                fontSize: '0.78rem',
                                padding: '0.2rem 0.55rem',
                                borderRadius: '6px',
                                fontWeight: 600,
                                backgroundColor: page.robotsIndex !== false ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.15)',
                                color: page.robotsIndex !== false ? '#10B981' : '#EF4444',
                              }}
                            >
                              {evaluation.robotsSummary}
                            </span>
                          </td>

                          <td style={{ padding: '1rem 1rem' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                padding: '0.25rem 0.65rem',
                                borderRadius: '999px',
                                backgroundColor: isComplete
                                  ? 'rgba(16, 185, 129, 0.15)'
                                  : isNeedsAttention
                                  ? 'rgba(245, 158, 11, 0.15)'
                                  : 'rgba(239, 68, 68, 0.15)',
                                color: isComplete ? '#10B981' : isNeedsAttention ? '#F59E0B' : '#EF4444',
                                border: `1px solid ${isComplete ? '#10B981' : isNeedsAttention ? '#F59E0B' : '#EF4444'}`,
                              }}
                            >
                              <span>{isComplete ? '✓' : isNeedsAttention ? '⚠️' : '✕'}</span>
                              <span>{evaluation.status}</span>
                            </span>
                          </td>

                          <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedRouteOrId(page.id || page.route);
                                setSubView('editor');
                              }}
                              style={{
                                padding: '0.45rem 0.95rem',
                                borderRadius: '6px',
                                backgroundColor: '#292524',
                                color: '#DE7843',
                                border: '1px solid #44403C',
                                fontWeight: 700,
                                fontSize: '0.82rem',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                              }}
                            >
                              Edit SEO →
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: PAGE SEO EDITOR */}
      {subView === 'editor' && currentItem && (
        <div>
          {/* Page Switcher Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              backgroundColor: '#1C1917',
              padding: '0.85rem 1.25rem',
              borderRadius: '12px',
              border: '1px solid #292524',
              marginBottom: '1.75rem',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#A8A29E', fontWeight: 600 }}>Editing SEO for:</span>
              <select
                value={currentItem.page.id || currentItem.page.route}
                onChange={(e) => setSelectedRouteOrId(e.target.value)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  backgroundColor: '#292524',
                  border: '1px solid #44403C',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                }}
              >
                {discoveredPages.map((pg) => (
                  <option key={pg.route} value={pg.id || pg.route}>
                    {pg.pageName} ({pg.route})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  padding: '0.3rem 0.75rem',
                  borderRadius: '999px',
                  backgroundColor:
                    currentItem.evaluation.status === 'Complete'
                      ? 'rgba(16, 185, 129, 0.15)'
                      : currentItem.evaluation.status === 'Needs Attention'
                      ? 'rgba(245, 158, 11, 0.15)'
                      : 'rgba(239, 68, 68, 0.15)',
                  color:
                    currentItem.evaluation.status === 'Complete'
                      ? '#10B981'
                      : currentItem.evaluation.status === 'Needs Attention'
                      ? '#F59E0B'
                      : '#EF4444',
                  border: `1px solid ${
                    currentItem.evaluation.status === 'Complete'
                      ? '#10B981'
                      : currentItem.evaluation.status === 'Needs Attention'
                      ? '#F59E0B'
                      : '#EF4444'
                  }`,
                }}
              >
                SEO Status: {currentItem.evaluation.status}
              </span>

              <button
                type="button"
                onClick={() => setSubView('pages')}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: '6px',
                  backgroundColor: 'transparent',
                  color: '#A8A29E',
                  border: '1px solid #44403C',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                }}
              >
                ← Back to All Pages
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 1fr)', gap: '1.75rem' }}>
            {/* LEFT COLUMN: Input Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* SECTION A: Basic SEO */}
              <div
                style={{
                  backgroundColor: '#1C1917',
                  borderRadius: '12px',
                  border: '1px solid #292524',
                  padding: '1.5rem',
                }}
              >
                <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>🎯</span> Basic SEO &amp; Search Engine Metadata
                </h3>

                {/* SEO Title */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#E7E5E4' }}>
                      SEO Title <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <span
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color:
                          currentItem.evaluation.titleLength > 60
                            ? '#EF4444'
                            : currentItem.evaluation.titleLength < 30
                            ? '#F59E0B'
                            : '#10B981',
                      }}
                    >
                      {currentItem.evaluation.titleLength} / 60 characters
                    </span>
                  </div>
                  <input
                    type="text"
                    value={currentItem.page.seoTitle || currentItem.page.title || ''}
                    onChange={(e) => updatePageField('seoTitle', e.target.value)}
                    placeholder={`e.g. ${currentItem.page.pageName} | ${globalSeo.siteName}`}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      backgroundColor: '#292524',
                      border: '1px solid #44403C',
                      color: '#FFFFFF',
                      fontSize: '0.95rem',
                    }}
                  />
                  <span style={{ fontSize: '0.78rem', color: '#78716C', marginTop: '0.35rem', display: 'block' }}>
                    50-60 characters recommended as a helpful guideline for search visibility.
                  </span>
                </div>

                {/* Meta Description */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#E7E5E4' }}>
                      Meta Description <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          padding: '0.15rem 0.55rem',
                          borderRadius: '999px',
                          backgroundColor:
                            currentItem.evaluation.descriptionStatus === 'Good'
                              ? 'rgba(16, 185, 129, 0.15)'
                              : currentItem.evaluation.descriptionStatus === 'Warning'
                              ? 'rgba(245, 158, 11, 0.15)'
                              : 'rgba(239, 68, 68, 0.15)',
                          color:
                            currentItem.evaluation.descriptionStatus === 'Good'
                              ? '#10B981'
                              : currentItem.evaluation.descriptionStatus === 'Warning'
                              ? '#F59E0B'
                              : '#EF4444',
                          border: `1px solid ${
                            currentItem.evaluation.descriptionStatus === 'Good'
                              ? '#10B981'
                              : currentItem.evaluation.descriptionStatus === 'Warning'
                              ? '#F59E0B'
                              : '#EF4444'
                          }`,
                        }}
                      >
                        Status: {currentItem.evaluation.descriptionStatus}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#A8A29E', fontWeight: 600 }}>
                        {currentItem.evaluation.descriptionLength} characters
                      </span>
                    </div>
                  </div>
                  <textarea
                    rows={3}
                    value={currentItem.page.metaDescription || currentItem.page.description || ''}
                    onChange={(e) => updatePageField('metaDescription', e.target.value)}
                    placeholder="Enter an enticing summary describing the page content to maximize click-through rate from search results."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      backgroundColor: '#292524',
                      border: '1px solid #44403C',
                      color: '#FFFFFF',
                      fontSize: '0.92rem',
                      lineHeight: '1.4',
                      resize: 'vertical',
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem' }}>
                    <span style={{ fontSize: '0.78rem', color: '#78716C' }}>
                      💡 150–160 characters is recommended as optimal search snippet guideline (not a hard blocker).
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#A8A29E' }}>
                      Target: ~155 chars
                    </span>
                  </div>
                </div>

                {/* Focus Keyword & Secondary Keywords */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#E7E5E4', marginBottom: '0.4rem' }}>
                      Focus Keyword
                    </label>
                    <input
                      type="text"
                      value={currentItem.page.focusKeyword || ''}
                      onChange={(e) => updatePageField('focusKeyword', e.target.value)}
                      placeholder="e.g. Outdoor Catering Amersham"
                      style={{
                        width: '100%',
                        padding: '0.7rem',
                        borderRadius: '8px',
                        backgroundColor: '#292524',
                        border: '1px solid #44403C',
                        color: '#FFFFFF',
                        fontSize: '0.9rem',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#E7E5E4', marginBottom: '0.4rem' }}>
                      Secondary Keywords (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={currentItem.page.secondaryKeywords || currentItem.page.keywords || ''}
                      onChange={(e) => updatePageField('secondaryKeywords', e.target.value)}
                      placeholder="e.g. South Indian Catering, Dosa Parties"
                      style={{
                        width: '100%',
                        padding: '0.7rem',
                        borderRadius: '8px',
                        backgroundColor: '#292524',
                        border: '1px solid #44403C',
                        color: '#FFFFFF',
                        fontSize: '0.9rem',
                      }}
                    />
                  </div>
                </div>

                {/* Primary Page H1 & Canonical URL */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#E7E5E4', marginBottom: '0.4rem' }}>
                      Primary Page H1 Tag Reference
                    </label>
                    <input
                      type="text"
                      value={currentItem.page.h1 || ''}
                      onChange={(e) => updatePageField('h1', e.target.value)}
                      placeholder="Main H1 headline tag"
                      style={{
                        width: '100%',
                        padding: '0.7rem',
                        borderRadius: '8px',
                        backgroundColor: '#292524',
                        border: '1px solid #44403C',
                        color: '#FFFFFF',
                        fontSize: '0.9rem',
                      }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#E7E5E4' }}>
                        Canonical URL
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          updatePageField(
                            'canonicalUrl',
                            normalizeCanonicalUrl(
                              `${globalSeo.siteUrl}${currentItem.page.route === '/' ? '' : currentItem.page.route}`,
                              globalSeo.siteUrl
                            )
                          )
                        }
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#DE7843',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          fontWeight: 700,
                          textDecoration: 'underline',
                          padding: 0,
                        }}
                      >
                        Auto-generate
                      </button>
                    </div>
                    <input
                      type="text"
                      value={currentItem.page.canonicalUrl || currentItem.page.canonical || ''}
                      onChange={(e) => updatePageField('canonicalUrl', e.target.value)}
                      onBlur={(e) => {
                        if (e.target.value.trim()) {
                          updatePageField('canonicalUrl', normalizeCanonicalUrl(e.target.value, globalSeo.siteUrl));
                        }
                      }}
                      placeholder={normalizeCanonicalUrl(
                        `${globalSeo.siteUrl}${currentItem.page.route === '/' ? '' : currentItem.page.route}`,
                        globalSeo.siteUrl
                      )}
                      style={{
                        width: '100%',
                        padding: '0.7rem',
                        borderRadius: '8px',
                        backgroundColor: '#292524',
                        border: '1px solid #44403C',
                        color: '#FFFFFF',
                        fontSize: '0.9rem',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION B: Robots & Crawler Directives */}
              <div
                style={{
                  backgroundColor: '#1C1917',
                  borderRadius: '12px',
                  border: '1px solid #292524',
                  padding: '1.5rem',
                }}
              >
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>🤖</span> Robots Directives &amp; Indexing Controls
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div
                    style={{
                      backgroundColor: '#292524',
                      padding: '1rem',
                      borderRadius: '8px',
                      border: '1px solid #44403C',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.35rem', color: '#F5F5F4' }}>
                      Search Indexation
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#A8A29E', marginBottom: '0.85rem' }}>
                      {currentItem.page.robotsIndex !== false
                        ? 'Search engines CAN index this page.'
                        : 'Blocked from search results (noindex).'}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => updatePageField('robotsIndex', true)}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          borderRadius: '6px',
                          backgroundColor: currentItem.page.robotsIndex !== false ? '#10B981' : '#1C1917',
                          color: currentItem.page.robotsIndex !== false ? '#FFFFFF' : '#A8A29E',
                          border: 'none',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                        }}
                      >
                        ✓ Index (Allow)
                      </button>
                      <button
                        type="button"
                        onClick={() => updatePageField('robotsIndex', false)}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          borderRadius: '6px',
                          backgroundColor: currentItem.page.robotsIndex === false ? '#EF4444' : '#1C1917',
                          color: currentItem.page.robotsIndex === false ? '#FFFFFF' : '#A8A29E',
                          border: 'none',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                        }}
                      >
                        ✕ Noindex (Block)
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: '#292524',
                      padding: '1rem',
                      borderRadius: '8px',
                      border: '1px solid #44403C',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.35rem', color: '#F5F5F4' }}>
                      Link Following
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#A8A29E', marginBottom: '0.85rem' }}>
                      {currentItem.page.robotsFollow !== false
                        ? 'Search engines follow links on this page.'
                        : 'Search engines ignore links (nofollow).'}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => updatePageField('robotsFollow', true)}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          borderRadius: '6px',
                          backgroundColor: currentItem.page.robotsFollow !== false ? '#10B981' : '#1C1917',
                          color: currentItem.page.robotsFollow !== false ? '#FFFFFF' : '#A8A29E',
                          border: 'none',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                        }}
                      >
                        ✓ Follow
                      </button>
                      <button
                        type="button"
                        onClick={() => updatePageField('robotsFollow', false)}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          borderRadius: '6px',
                          backgroundColor: currentItem.page.robotsFollow === false ? '#EF4444' : '#1C1917',
                          color: currentItem.page.robotsFollow === false ? '#FFFFFF' : '#A8A29E',
                          border: 'none',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                        }}
                      >
                        ✕ Nofollow
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION C: Open Graph (Social Sharing) */}
              <div
                style={{
                  backgroundColor: '#1C1917',
                  borderRadius: '12px',
                  border: '1px solid #292524',
                  padding: '1.5rem',
                }}
              >
                <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>🌐</span> Open Graph (Facebook, WhatsApp, LinkedIn)
                </h3>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#E7E5E4', marginBottom: '0.4rem' }}>
                    Open Graph Title (defaults to SEO Title if blank)
                  </label>
                  <input
                    type="text"
                    value={currentItem.page.ogTitle || ''}
                    onChange={(e) => updatePageField('ogTitle', e.target.value)}
                    placeholder={currentItem.page.seoTitle || currentItem.page.title || globalSeo.defaultTitle}
                    style={{
                      width: '100%',
                      padding: '0.7rem',
                      borderRadius: '8px',
                      backgroundColor: '#292524',
                      border: '1px solid #44403C',
                      color: '#FFFFFF',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#E7E5E4', marginBottom: '0.4rem' }}>
                    Open Graph Description
                  </label>
                  <textarea
                    rows={2}
                    value={currentItem.page.ogDescription || ''}
                    onChange={(e) => updatePageField('ogDescription', e.target.value)}
                    placeholder={currentItem.page.metaDescription || currentItem.page.description || globalSeo.defaultDescription}
                    style={{
                      width: '100%',
                      padding: '0.7rem',
                      borderRadius: '8px',
                      backgroundColor: '#292524',
                      border: '1px solid #44403C',
                      color: '#FFFFFF',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>

                {/* OG Image with Visual Media Browser */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#E7E5E4', marginBottom: '0.4rem' }}>
                    Social Share Image (OG Image)
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      value={currentItem.page.ogImage || ''}
                      onChange={(e) => updatePageField('ogImage', e.target.value)}
                      placeholder="/images/..."
                      style={{
                        flex: 1,
                        minWidth: '220px',
                        padding: '0.7rem',
                        borderRadius: '8px',
                        backgroundColor: '#292524',
                        border: '1px solid #44403C',
                        color: '#FFFFFF',
                        fontSize: '0.9rem',
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => openMediaPicker((url) => updatePageField('ogImage', url))}
                      style={{
                        padding: '0.7rem 1rem',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(222, 120, 67, 0.15)',
                        color: '#DE7843',
                        border: '1px solid rgba(222, 120, 67, 0.4)',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      🖼️ Choose from Uploads
                    </button>

                    <label
                      style={{
                        padding: '0.7rem 1rem',
                        borderRadius: '8px',
                        backgroundColor: '#292524',
                        color: '#D6D3D1',
                        border: '1px solid #44403C',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      📁 Upload New
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) =>
                          handleImageUpload(e, (url) => updatePageField('ogImage', url), `og-${currentItem.page.id}`)
                        }
                      />
                    </label>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#78716C', marginTop: '0.35rem', display: 'block' }}>
                    Recommended size: 1200 x 630 pixels.
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#E7E5E4', marginBottom: '0.4rem' }}>
                      OG Type
                    </label>
                    <select
                      value={currentItem.page.ogType || 'website'}
                      onChange={(e) => updatePageField('ogType', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.7rem',
                        borderRadius: '8px',
                        backgroundColor: '#292524',
                        border: '1px solid #44403C',
                        color: '#FFFFFF',
                        fontSize: '0.9rem',
                      }}
                    >
                      <option value="website">website</option>
                      <option value="article">article</option>
                      <option value="restaurant">restaurant</option>
                      <option value="profile">profile</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#E7E5E4', marginBottom: '0.4rem' }}>
                      OG URL (defaults to canonical)
                    </label>
                    <input
                      type="text"
                      value={currentItem.page.ogUrl || ''}
                      onChange={(e) => updatePageField('ogUrl', e.target.value)}
                      placeholder={
                        currentItem.page.canonicalUrl
                          ? normalizeCanonicalUrl(currentItem.page.canonicalUrl, globalSeo.siteUrl)
                          : normalizeCanonicalUrl(
                              `${globalSeo.siteUrl}${currentItem.page.route === '/' ? '' : currentItem.page.route}`,
                              globalSeo.siteUrl
                            )
                      }
                      style={{
                        width: '100%',
                        padding: '0.7rem',
                        borderRadius: '8px',
                        backgroundColor: '#292524',
                        border: '1px solid #44403C',
                        color: '#FFFFFF',
                        fontSize: '0.9rem',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* SECTION D: Twitter / X Card */}
              <div
                style={{
                  backgroundColor: '#1C1917',
                  borderRadius: '12px',
                  border: '1px solid #292524',
                  padding: '1.5rem',
                }}
              >
                <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>🐦</span> Twitter / X Metadata
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#E7E5E4', marginBottom: '0.4rem' }}>
                      Twitter Card Format
                    </label>
                    <select
                      value={currentItem.page.twitterCard || 'summary_large_image'}
                      onChange={(e) => updatePageField('twitterCard', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.7rem',
                        borderRadius: '8px',
                        backgroundColor: '#292524',
                        border: '1px solid #44403C',
                        color: '#FFFFFF',
                        fontSize: '0.9rem',
                      }}
                    >
                      <option value="summary_large_image">summary_large_image (Large Hero Banner)</option>
                      <option value="summary">summary (Small Square Thumbnail)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#E7E5E4', marginBottom: '0.4rem' }}>
                      Twitter Title (optional override)
                    </label>
                    <input
                      type="text"
                      value={currentItem.page.twitterTitle || ''}
                      onChange={(e) => updatePageField('twitterTitle', e.target.value)}
                      placeholder={currentItem.page.ogTitle || currentItem.page.seoTitle || globalSeo.defaultTitle}
                      style={{
                        width: '100%',
                        padding: '0.7rem',
                        borderRadius: '8px',
                        backgroundColor: '#292524',
                        border: '1px solid #44403C',
                        color: '#FFFFFF',
                        fontSize: '0.9rem',
                      }}
                    />
                    <span style={{ fontSize: '0.75rem', color: '#78716C', marginTop: '0.25rem', display: 'block' }}>
                      Leave empty to use Open Graph title
                    </span>
                  </div>
                </div>

                {/* Twitter Description */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#E7E5E4', marginBottom: '0.4rem' }}>
                    Twitter / X Description (optional override)
                  </label>
                  <textarea
                    rows={2}
                    value={currentItem.page.twitterDescription || ''}
                    onChange={(e) => updatePageField('twitterDescription', e.target.value)}
                    placeholder={currentItem.page.ogDescription || currentItem.page.metaDescription || globalSeo.defaultDescription}
                    style={{
                      width: '100%',
                      padding: '0.7rem',
                      borderRadius: '8px',
                      backgroundColor: '#292524',
                      border: '1px solid #44403C',
                      color: '#FFFFFF',
                      fontSize: '0.9rem',
                    }}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#78716C', marginTop: '0.25rem', display: 'block' }}>
                    Leave empty to automatically fallback to Open Graph description.
                  </span>
                </div>

                {/* Twitter Image */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#E7E5E4', marginBottom: '0.4rem' }}>
                    Twitter / X Image (optional override)
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      value={currentItem.page.twitterImage || ''}
                      onChange={(e) => updatePageField('twitterImage', e.target.value)}
                      placeholder={currentItem.page.ogImage || globalSeo.defaultOgImage}
                      style={{
                        flex: 1,
                        minWidth: '220px',
                        padding: '0.7rem',
                        borderRadius: '8px',
                        backgroundColor: '#292524',
                        border: '1px solid #44403C',
                        color: '#FFFFFF',
                        fontSize: '0.9rem',
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => openMediaPicker((url) => updatePageField('twitterImage', url))}
                      style={{
                        padding: '0.7rem 1rem',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(222, 120, 67, 0.15)',
                        color: '#DE7843',
                        border: '1px solid rgba(222, 120, 67, 0.4)',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      🖼️ Choose from Uploads
                    </button>

                    <label
                      style={{
                        padding: '0.7rem 1rem',
                        borderRadius: '8px',
                        backgroundColor: '#292524',
                        color: '#D6D3D1',
                        border: '1px solid #44403C',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      📁 Upload New
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) =>
                          handleImageUpload(e, (url) => updatePageField('twitterImage', url), `tw-${currentItem.page.id}`)
                        }
                      />
                    </label>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#78716C', marginTop: '0.35rem', display: 'block' }}>
                    Leave empty to automatically fallback to Open Graph image.
                  </span>
                </div>
              </div>

              {/* SECTION E: Structured Data & Schema.org */}
              <div
                style={{
                  backgroundColor: '#1C1917',
                  borderRadius: '12px',
                  border: '1px solid #292524',
                  padding: '1.5rem',
                }}
              >
                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>📑</span> Page-Level Structured Data (Schema.org)
                </h3>
                <p style={{ color: '#A8A29E', fontSize: '0.85rem', margin: '0 0 1.25rem 0' }}>
                  Emits page-specific JSON-LD entities that link to the global Organization without duplicating site-wide schema.
                </p>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#E7E5E4', marginBottom: '0.4rem' }}>
                    Schema Type
                  </label>
                  <select
                    value={currentItem.page.schemaType || 'WebPage'}
                    onChange={(e) => updatePageField('schemaType', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.7rem',
                      borderRadius: '8px',
                      backgroundColor: '#292524',
                      border: '1px solid #44403C',
                      color: '#FFFFFF',
                      fontSize: '0.9rem',
                    }}
                  >
                    <option value="Restaurant">Restaurant (Opening Hours, Menu URL, Cuisine, Address)</option>
                    <option value="LocalBusiness">LocalBusiness</option>
                    <option value="Service">Service (Catering, Live Cooking, Event Hire)</option>
                    <option value="WebPage">WebPage (General Content Page)</option>
                    <option value="Article">Article / Policy Page</option>
                    <option value="BreadcrumbList">BreadcrumbList</option>
                    <option value="FAQPage">FAQPage (Search Rich Snippet Q&amp;A)</option>
                    <option value="Custom">Custom JSON-LD (Advanced Override)</option>
                    <option value="None">None (Disable Page Schema)</option>
                  </select>
                </div>

                {currentItem.page.schemaType === 'Custom' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#E7E5E4', marginBottom: '0.4rem' }}>
                      Custom JSON-LD Code
                    </label>
                    <textarea
                      rows={6}
                      value={currentItem.page.customSchemaJson || ''}
                      onChange={(e) => updatePageField('customSchemaJson', e.target.value)}
                      placeholder='{ "@context": "https://schema.org", "@type": "Thing" }'
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        backgroundColor: '#141211',
                        border: '1px solid #44403C',
                        color: '#6EE7B7',
                        fontFamily: 'monospace',
                        fontSize: '0.85rem',
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Google SERP Approximation & Audit */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '1rem', height: 'fit-content' }}>
              {/* GOOGLE SEARCH LIVE PREVIEW */}
              <div
                style={{
                  backgroundColor: '#1C1917',
                  borderRadius: '14px',
                  border: '1px solid #292524',
                  padding: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#DE7843', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Google Search Preview — Approximation
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#78716C' }}>Desktop snippet</span>
                </div>

                {/* Google Search Result Box */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    padding: '1.25rem 1.4rem',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                    color: '#202124',
                    fontFamily: 'Arial, sans-serif',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: '#F1F3F4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        border: '1px solid #E5E7EB',
                        flexShrink: 0,
                      }}
                    >
                      {globalSeo.faviconUrl ? (
                        <img
                          src={globalSeo.faviconUrl}
                          alt="Favicon"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#5F6368' }}>
                          {globalSeo.siteName?.charAt(0) || 'V'}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.25 }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#202124' }}>
                        {globalSeo.siteName}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#4D5156', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '320px' }}>
                        {globalSeo.siteUrl}{currentItem.page.route === '/' ? '' : ` › ${currentItem.page.route.replace('/', '')}`}
                      </span>
                    </div>
                  </div>

                  <h4
                    style={{
                      margin: '0 0 5px 0',
                      fontSize: '1.2rem',
                      fontWeight: 400,
                      color: '#1a0dab',
                      lineHeight: 1.3,
                      cursor: 'pointer',
                      textDecoration: 'none',
                    }}
                  >
                    {currentItem.page.seoTitle || currentItem.page.title || `${currentItem.page.pageName} | ${globalSeo.siteName}`}
                  </h4>

                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.88rem',
                      lineHeight: '1.45',
                      color: '#474747',
                      wordBreak: 'break-word',
                    }}
                  >
                    {currentItem.page.metaDescription ||
                      currentItem.page.description ||
                      globalSeo.defaultDescription ||
                      'No meta description provided. Google search crawlers will select arbitrary text snippets from your page.'}
                  </p>
                </div>

                <div style={{ fontSize: '0.75rem', color: '#78716C', marginTop: '0.85rem', lineHeight: 1.4 }}>
                  ℹ️ Search Preview — Approximation: Search engine algorithms dynamically format and occasionally rewrite titles and descriptions based on user search queries and page relevance. Character count gauges (50-60 title, 120-160 description) are best practice guidelines, not guaranteed search engine limits.
                </div>
              </div>

              {/* SOCIAL / OPEN GRAPH & TWITTER PREVIEW CARD */}
              <div
                style={{
                  backgroundColor: '#1C1917',
                  borderRadius: '14px',
                  border: '1px solid #292524',
                  padding: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#DE7843', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Social Share Preview
                  </span>
                  <div style={{ display: 'flex', gap: '0.25rem', backgroundColor: '#292524', padding: '0.2rem', borderRadius: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setSocialPreviewType('og')}
                      style={{
                        padding: '0.25rem 0.6rem',
                        borderRadius: '4px',
                        backgroundColor: socialPreviewType === 'og' ? '#DE7843' : 'transparent',
                        color: socialPreviewType === 'og' ? '#FFFFFF' : '#A8A29E',
                        border: 'none',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Open Graph
                    </button>
                    <button
                      type="button"
                      onClick={() => setSocialPreviewType('twitter')}
                      style={{
                        padding: '0.25rem 0.6rem',
                        borderRadius: '4px',
                        backgroundColor: socialPreviewType === 'twitter' ? '#DE7843' : 'transparent',
                        color: socialPreviewType === 'twitter' ? '#FFFFFF' : '#A8A29E',
                        border: 'none',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Twitter / X
                    </button>
                  </div>
                </div>

                {socialPreviewType === 'og' ? (
                  <div
                    style={{
                      backgroundColor: '#0F0E0D',
                      borderRadius: '10px',
                      border: '1px solid #292524',
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{ width: '100%', height: '160px', backgroundColor: '#24201E', position: 'relative', overflow: 'hidden' }}>
                      {currentItem.page.ogImage ? (
                        <img
                          src={currentItem.page.ogImage}
                          alt="OG Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#78716C', fontSize: '0.85rem' }}>
                          🖼️ No Social Image Assigned (Recommended: 1200x630)
                        </div>
                      )}
                    </div>

                    <div style={{ padding: '0.85rem' }}>
                      <div style={{ fontSize: '0.72rem', color: '#DE7843', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>
                        {globalSeo.siteUrl?.replace(/^https?:\/\//, '')}
                      </div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#F5F5F4', lineHeight: 1.25, marginBottom: '4px' }}>
                        {currentItem.page.ogTitle || currentItem.page.seoTitle || currentItem.page.title || globalSeo.defaultTitle}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#A8A29E', lineHeight: 1.35, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {currentItem.page.ogDescription || currentItem.page.metaDescription || globalSeo.defaultDescription}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      backgroundColor: '#000000',
                      borderRadius: '12px',
                      border: '1px solid #333333',
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{ width: '100%', height: '160px', backgroundColor: '#1A1A1A', position: 'relative', overflow: 'hidden' }}>
                      {currentItem.page.twitterImage || currentItem.page.ogImage ? (
                        <img
                          src={currentItem.page.twitterImage || currentItem.page.ogImage}
                          alt="Twitter Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#78716C', fontSize: '0.85rem' }}>
                          🖼️ No Twitter/OG Image Assigned
                        </div>
                      )}
                      {!currentItem.page.twitterImage && currentItem.page.ogImage && (
                        <span style={{ position: 'absolute', bottom: '6px', right: '6px', backgroundColor: 'rgba(0,0,0,0.7)', color: '#D6D3D1', fontSize: '0.68rem', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                          Fallback: OG Image
                        </span>
                      )}
                    </div>

                    <div style={{ padding: '0.85rem' }}>
                      <div style={{ fontSize: '0.72rem', color: '#71767B', marginBottom: '2px' }}>
                        {globalSeo.siteUrl?.replace(/^https?:\/\//, '')}
                      </div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#E7E9EA', lineHeight: 1.25, marginBottom: '4px' }}>
                        {currentItem.page.twitterTitle || currentItem.page.ogTitle || currentItem.page.seoTitle || globalSeo.defaultTitle}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#71767B', lineHeight: 1.35, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {currentItem.page.twitterDescription || currentItem.page.ogDescription || currentItem.page.metaDescription || globalSeo.defaultDescription}
                      </div>
                    </div>
                  </div>
                )}
                <div style={{ fontSize: '0.75rem', color: '#78716C', marginTop: '0.75rem', lineHeight: 1.35 }}>
                  Recommended image resolution: 1200 x 630 pixels. When Twitter fields are left blank, Twitter cards automatically fall back to Open Graph values.
                </div>
              </div>

              {/* REAL-TIME SEO AUDIT & VALIDATION ISSUES */}
              <div
                style={{
                  backgroundColor: '#1C1917',
                  borderRadius: '14px',
                  border: '1px solid #292524',
                  padding: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#DE7843', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Page SEO Health Audit
                  </span>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: currentItem.evaluation.issues.length === 0 ? '#10B981' : '#F59E0B',
                    }}
                  >
                    {currentItem.evaluation.issues.length === 0 ? '✓ No issues detected' : `${currentItem.evaluation.issues.length} notification(s)`}
                  </span>
                </div>

                {currentItem.evaluation.issues.length === 0 ? (
                  <div
                    style={{
                      padding: '1rem',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                      color: '#10B981',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <span>✓</span>
                    <span>Excellent! Title, description, robots, canonical, and social tags are properly configured.</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {currentItem.evaluation.issues.map((issue, idx) => {
                      const isError = issue.severity === 'error';
                      const isWarning = issue.severity === 'warning';
                      const color = isError ? '#EF4444' : isWarning ? '#F59E0B' : '#60A5FA';
                      const bg = isError ? 'rgba(239, 68, 68, 0.1)' : isWarning ? 'rgba(245, 158, 11, 0.1)' : 'rgba(96, 165, 250, 0.1)';

                      return (
                        <div
                          key={idx}
                          style={{
                            padding: '0.65rem 0.85rem',
                            borderRadius: '8px',
                            backgroundColor: bg,
                            border: `1px solid ${color}40`,
                            color: '#F5F5F4',
                            fontSize: '0.82rem',
                            display: 'flex',
                            gap: '0.5rem',
                            alignItems: 'flex-start',
                          }}
                        >
                          <span style={{ color, fontWeight: 800 }}>{isError ? '✕' : isWarning ? '⚠️' : 'ℹ️'}</span>
                          <span style={{ lineHeight: 1.35 }}>{issue.message}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: SEO AUDIT & HEALTH DASHBOARD */}
      {subView === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Top Level Metric Summary Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
            }}
          >
            <div style={{ backgroundColor: '#1C1917', padding: '1.25rem', borderRadius: '12px', border: '1px solid #292524' }}>
              <div style={{ color: '#A8A29E', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Site SEO Score</div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, color: dashboardStats.completePages === dashboardStats.totalPages ? '#10B981' : '#F59E0B', marginTop: '0.25rem' }}>
                {Math.round((dashboardStats.completePages / (dashboardStats.totalPages || 1)) * 100)}%
              </div>
              <div style={{ fontSize: '0.8rem', color: '#78716C', marginTop: '0.25rem' }}>
                {dashboardStats.completePages} of {dashboardStats.totalPages} pages complete
              </div>
            </div>

            <div style={{ backgroundColor: '#1C1917', padding: '1.25rem', borderRadius: '12px', border: '1px solid #292524' }}>
              <div style={{ color: '#A8A29E', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Duplicate Content</div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, color: (dashboardStats.duplicateTitles.length + dashboardStats.duplicateDescriptions.length) === 0 ? '#10B981' : '#EF4444', marginTop: '0.25rem' }}>
                {dashboardStats.duplicateTitles.length + dashboardStats.duplicateDescriptions.length}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#78716C', marginTop: '0.25rem' }}>
                {dashboardStats.duplicateTitles.length} title(s), {dashboardStats.duplicateDescriptions.length} desc(s) shared
              </div>
            </div>

            <div style={{ backgroundColor: '#1C1917', padding: '1.25rem', borderRadius: '12px', border: '1px solid #292524' }}>
              <div style={{ color: '#A8A29E', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Missing OG Images</div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, color: dashboardStats.missingOgImageCount === 0 ? '#10B981' : '#F59E0B', marginTop: '0.25rem' }}>
                {dashboardStats.missingOgImageCount}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#78716C', marginTop: '0.25rem' }}>
                Pages lacking social share pictures
              </div>
            </div>

            <div style={{ backgroundColor: '#1C1917', padding: '1.25rem', borderRadius: '12px', border: '1px solid #292524' }}>
              <div style={{ color: '#A8A29E', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Blocked (Noindex)</div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, color: dashboardStats.noindexPagesCount === 0 ? '#10B981' : '#818CF8', marginTop: '0.25rem' }}>
                {dashboardStats.noindexPagesCount}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#78716C', marginTop: '0.25rem' }}>
                Pages deliberately hidden from Google
              </div>
            </div>

            <div style={{ backgroundColor: '#1C1917', padding: '1.25rem', borderRadius: '12px', border: '1px solid #292524' }}>
              <div style={{ color: '#A8A29E', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Image SEO Health</div>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, color: dashboardStats.imageAudit.criticalCount === 0 ? '#10B981' : '#EF4444', marginTop: '0.25rem' }}>
                {dashboardStats.imageAudit.goodCount}/{dashboardStats.imageAudit.totalScanned}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#78716C', marginTop: '0.25rem' }}>
                {dashboardStats.imageAudit.criticalCount} missing alt text
              </div>
            </div>
          </div>

          {/* Audit Findings & Actionable Reports */}
          <div style={{ backgroundColor: '#1C1917', borderRadius: '12px', border: '1px solid #292524', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ borderBottom: '1px solid #292524', paddingBottom: '1rem' }}>
              <h3 style={{ margin: '0 0 0.35rem 0', fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>
                Technical SEO Audit &amp; Quality Reports
              </h3>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#A8A29E' }}>
                Continuous inspection covering indexability, duplicate content, canonical consistency, robots directives, image attributes, and schema validity.
              </p>
            </div>

            {/* 1. Missing Titles or Descriptions */}
            {(dashboardStats.missingTitles.length > 0 || dashboardStats.missingDescriptions.length > 0) && (
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid #EF4444', borderRadius: '8px', padding: '1rem' }}>
                <div style={{ fontWeight: 800, color: '#EF4444', fontSize: '0.95rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>✕</span> Missing Title or Description Tags
                </div>
                {dashboardStats.missingTitles.map((pg) => (
                  <div key={pg.route} style={{ fontSize: '0.85rem', color: '#F5F5F4', marginTop: '0.35rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Missing SEO Title: <strong>{pg.pageName}</strong> ({pg.route})</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRouteOrId(pg.route);
                        setSubView('editor');
                      }}
                      style={{ padding: '0.25rem 0.6rem', borderRadius: '4px', backgroundColor: '#DE7843', color: '#FFF', border: 'none', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Add Title →
                    </button>
                  </div>
                ))}
                {dashboardStats.missingDescriptions.map((pg) => (
                  <div key={pg.route} style={{ fontSize: '0.85rem', color: '#F5F5F4', marginTop: '0.35rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Missing Meta Description: <strong>{pg.pageName}</strong> ({pg.route})</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedRouteOrId(pg.route);
                        setSubView('editor');
                      }}
                      style={{ padding: '0.25rem 0.6rem', borderRadius: '4px', backgroundColor: '#DE7843', color: '#FFF', border: 'none', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Add Description →
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 2. Duplicate Content (Titles & Descriptions) */}
            {(dashboardStats.duplicateTitles.length > 0 || dashboardStats.duplicateDescriptions.length > 0) && (
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid #EF4444', borderRadius: '8px', padding: '1rem' }}>
                <div style={{ fontWeight: 800, color: '#EF4444', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                  ⚠️ Duplicate Metadata Across Pages
                </div>
                {dashboardStats.duplicateTitles.map((dup, i) => (
                  <div key={i} style={{ fontSize: '0.85rem', color: '#F5F5F4', marginTop: '0.25rem' }}>
                    • Duplicate Title: <em>&quot;{dup.title}&quot;</em> shared by: <strong>{dup.pages.join(', ')}</strong>
                  </div>
                ))}
                {dashboardStats.duplicateDescriptions.map((dup, i) => (
                  <div key={i} style={{ fontSize: '0.85rem', color: '#F5F5F4', marginTop: '0.25rem' }}>
                    • Duplicate Description: <em>&quot;{dup.description.slice(0, 80)}...&quot;</em> shared by: <strong>{dup.pages.join(', ')}</strong>
                  </div>
                ))}
              </div>
            )}

            {/* 3. Missing or Invalid Canonicals */}
            {dashboardStats.missingOrInvalidCanonicals.length > 0 && (
              <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.08)', border: '1px solid #F59E0B', borderRadius: '8px', padding: '1rem' }}>
                <div style={{ fontWeight: 800, color: '#F59E0B', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                  ⚠️ Canonical URL Issues
                </div>
                {dashboardStats.missingOrInvalidCanonicals.map((item, i) => (
                  <div key={i} style={{ fontSize: '0.85rem', color: '#F5F5F4', marginTop: '0.25rem' }}>
                    • <strong>{item.pageName}</strong> ({item.route}): {item.reason}
                  </div>
                ))}
              </div>
            )}

            {/* 4. Noindex / Blocked Pages */}
            {dashboardStats.noindexPages.length > 0 && (
              <div style={{ backgroundColor: 'rgba(129, 140, 248, 0.08)', border: '1px solid #818CF8', borderRadius: '8px', padding: '1rem' }}>
                <div style={{ fontWeight: 800, color: '#818CF8', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                  ℹ️ Search Index Blocked (Noindex Pages)
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {dashboardStats.noindexPages.map((pg) => (
                    <div key={pg.route} style={{ fontSize: '0.85rem', color: '#F5F5F4' }}>
                      • <strong>{pg.pageName}</strong> ({pg.route})
                      {pg.isCorePage && (
                        <span style={{ marginLeft: '0.5rem', color: '#EF4444', fontWeight: 800 }}>
                          [CRITICAL: Core public page blocked from search!]
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Potential Orphan Pages */}
            {dashboardStats.orphanPages.length > 0 && (
              <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.08)', border: '1px solid #F59E0B', borderRadius: '8px', padding: '1rem' }}>
                <div style={{ fontWeight: 800, color: '#F59E0B', fontSize: '0.95rem', marginBottom: '0.4rem' }}>
                  ⚠️ Potential Orphan Pages Detected ({dashboardStats.orphanPages.length})
                </div>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.82rem', color: '#D6D3D1' }}>
                  These routes exist in storage but have no direct links from the header navigation or footer:
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {dashboardStats.orphanPages.map((op) => (
                    <span key={op.route} style={{ fontFamily: 'monospace', fontSize: '0.8rem', backgroundColor: '#292524', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      {op.pageName} ({op.route})
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Redirect Problems (Loops & Chains) */}
            {dashboardStats.redirectProblems.length > 0 && (
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid #EF4444', borderRadius: '8px', padding: '1rem' }}>
                <div style={{ fontWeight: 800, color: '#EF4444', fontSize: '0.95rem', marginBottom: '0.4rem' }}>
                  ⚠️ Redirect Configuration Problems Detected
                </div>
                {dashboardStats.redirectProblems.map((rp, i) => (
                  <div key={i} style={{ fontSize: '0.85rem', color: '#F5F5F4', marginTop: '0.25rem' }}>
                    • [{rp.type.toUpperCase()}] {rp.message}
                  </div>
                ))}
              </div>
            )}

            {/* 7. Broken / 404 Targets */}
            {dashboardStats.brokenOr404Urls.length > 0 && (
              <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid #EF4444', borderRadius: '8px', padding: '1rem' }}>
                <div style={{ fontWeight: 800, color: '#EF4444', fontSize: '0.95rem', marginBottom: '0.4rem' }}>
                  ✕ Broken Link / 404 Target Warnings
                </div>
                {dashboardStats.brokenOr404Urls.map((item, i) => (
                  <div key={i} style={{ fontSize: '0.85rem', color: '#F5F5F4', marginTop: '0.25rem' }}>
                    • Target: <strong>{item.route}</strong> — {item.reason}
                  </div>
                ))}
              </div>
            )}

            {/* 8. Sitemap & Robots.txt Health Checks */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ backgroundColor: '#292524', borderRadius: '8px', padding: '1rem', border: '1px solid #44403C' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FFFFFF', marginBottom: '0.35rem' }}>
                  🗺️ Dynamic Sitemap Status
                </div>
                <div style={{ fontSize: '0.82rem', color: '#A8A29E', lineHeight: 1.4 }}>
                  Endpoint: <a href="/sitemap.xml" target="_blank" style={{ color: '#DE7843' }}>/sitemap.xml</a>
                  <br />
                  Contains {dashboardStats.totalPages - dashboardStats.noindexPagesCount} public indexable pages. Excludes admin, private, and noindex routes.
                  {dashboardStats.sitemapProblems.length > 0 && (
                    <div style={{ color: '#EF4444', marginTop: '0.4rem' }}>
                      {dashboardStats.sitemapProblems.join(', ')}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ backgroundColor: '#292524', borderRadius: '8px', padding: '1rem', border: '1px solid #44403C' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FFFFFF', marginBottom: '0.35rem' }}>
                  🤖 Robots.txt Directives Status
                </div>
                <div style={{ fontSize: '0.82rem', color: '#A8A29E', lineHeight: 1.4 }}>
                  Endpoint: <a href="/robots.txt" target="_blank" style={{ color: '#DE7843' }}>/robots.txt</a>
                  <br />
                  Allows Googlebot &amp; standard crawlers on public paths. Protects /admin and /api/. CSS/JS chunks in /_next/ are fully crawlable.
                  {dashboardStats.robotsProblems.length > 0 && (
                    <div style={{ color: '#EF4444', marginTop: '0.4rem' }}>
                      {dashboardStats.robotsProblems.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 9. Image SEO Audit Section */}
            <div style={{ backgroundColor: '#292524', borderRadius: '8px', padding: '1.25rem', border: '1px solid #44403C' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#FFFFFF' }}>
                    🖼️ Image SEO &amp; Media Audit ({dashboardStats.imageAudit.totalScanned} Images Inspected)
                  </h4>
                  <span style={{ fontSize: '0.78rem', color: '#A8A29E' }}>
                    Evaluates meaningful alt text, modern image format (WebP/AVIF), and social preview dimensions.
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#10B981' }}>
                    {dashboardStats.imageAudit.goodCount} Good
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: 'rgba(245, 158, 11, 0.2)', color: '#F59E0B' }}>
                    {dashboardStats.imageAudit.warningCount} Optimization Suggestions
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#EF4444' }}>
                    {dashboardStats.imageAudit.criticalCount} Missing Alt Text
                  </span>
                </div>
              </div>

              <div style={{ maxHeight: '280px', overflowY: 'auto', border: '1px solid #332F2C', borderRadius: '6px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#1C1917', borderBottom: '1px solid #44403C', textAlign: 'left', color: '#A8A29E' }}>
                      <th style={{ padding: '0.6rem 0.75rem' }}>Image Asset</th>
                      <th style={{ padding: '0.6rem 0.75rem' }}>Source Context</th>
                      <th style={{ padding: '0.6rem 0.75rem' }}>Alt Text</th>
                      <th style={{ padding: '0.6rem 0.75rem' }}>Status / Audit Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardStats.imageAudit.images.slice(0, 15).map((img, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #332F2C' }}>
                        <td style={{ padding: '0.6rem 0.75rem', fontFamily: 'monospace', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          <a href={img.url} target="_blank" rel="noopener noreferrer" style={{ color: '#DE7843' }}>
                            {img.url.split('/').pop()}
                          </a>
                        </td>
                        <td style={{ padding: '0.6rem 0.75rem', color: '#D6D3D1' }}>{img.source}</td>
                        <td style={{ padding: '0.6rem 0.75rem', color: img.altText ? '#F5F5F4' : '#EF4444', fontStyle: img.altText ? 'normal' : 'italic' }}>
                          {img.altText || 'Missing Alt Text'}
                        </td>
                        <td style={{ padding: '0.6rem 0.75rem' }}>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '0.15rem 0.45rem',
                              borderRadius: '4px',
                              backgroundColor:
                                img.status === 'Good'
                                  ? 'rgba(16, 185, 129, 0.15)'
                                  : img.status === 'Warning'
                                  ? 'rgba(245, 158, 11, 0.15)'
                                  : 'rgba(239, 68, 68, 0.15)',
                              color:
                                img.status === 'Good'
                                  ? '#10B981'
                                  : img.status === 'Warning'
                                  ? '#F59E0B'
                                  : '#EF4444',
                              marginRight: '0.4rem',
                            }}
                          >
                            {img.status}
                          </span>
                          <span style={{ color: '#A8A29E', fontSize: '0.75rem' }}>
                            {img.issues[0] || 'Optimized'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 10. Pages Needing Attention List */}
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#E7E5E4', marginBottom: '0.75rem' }}>
                Pages Requiring Attention ({evaluatedPages.filter((item) => item.evaluation.status !== 'Complete').length}):
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {evaluatedPages.filter((item) => item.evaluation.status !== 'Complete').length === 0 ? (
                  <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.08)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.25)', fontSize: '0.88rem' }}>
                    ✓ Clean Audit! All discovered pages satisfy critical title, description, canonical, and indexing standards.
                  </div>
                ) : (
                  evaluatedPages
                    .filter((item) => item.evaluation.status !== 'Complete')
                    .map(({ page, evaluation }) => (
                      <div
                        key={page.route}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.75rem 1rem',
                          borderRadius: '8px',
                          backgroundColor: '#292524',
                          border: '1px solid #44403C',
                        }}
                      >
                        <div>
                          <span style={{ fontWeight: 700, color: '#FFFFFF', marginRight: '0.5rem' }}>{page.pageName}</span>
                          <span style={{ color: '#A8A29E', fontSize: '0.85rem', fontFamily: 'monospace' }}>({page.route})</span>
                          <div style={{ fontSize: '0.78rem', color: '#F59E0B', marginTop: '2px' }}>
                            {evaluation.issues[0]?.message || 'Needs review'}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedRouteOrId(page.id || page.route);
                            setSubView('editor');
                          }}
                          style={{
                            padding: '0.4rem 0.85rem',
                            borderRadius: '6px',
                            backgroundColor: '#DE7843',
                            color: '#FFFFFF',
                            border: 'none',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                          }}
                        >
                          Fix Now →
                        </button>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: GLOBAL SEO & SEARCH CONSOLE VERIFICATION */}
      {subView === 'global' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)', gap: '1.75rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Website Defaults */}
            <div style={{ backgroundColor: '#1C1917', borderRadius: '12px', border: '1px solid #292524', padding: '1.5rem' }}>
              <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🌐</span> Website-Wide Defaults
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#E7E5E4', marginBottom: '0.4rem' }}>
                    Website / Business Name
                  </label>
                  <input
                    type="text"
                    value={globalSeo.siteName}
                    onChange={(e) => updateGlobalField('siteName', e.target.value)}
                    placeholder="e.g. Veg Chennai Srilalitha"
                    style={{
                      width: '100%',
                      padding: '0.7rem',
                      borderRadius: '8px',
                      backgroundColor: '#292524',
                      border: '1px solid #44403C',
                      color: '#FFFFFF',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#E7E5E4', marginBottom: '0.4rem' }}>
                    Website Canonical Base URL
                  </label>
                  <input
                    type="text"
                    value={globalSeo.siteUrl}
                    onChange={(e) => updateGlobalField('siteUrl', e.target.value)}
                    onBlur={(e) => updateGlobalField('siteUrl', e.target.value.trim().replace(/\/+$/, ''))}
                    placeholder="https://vcsamersham.co.uk"
                    style={{
                      width: '100%',
                      padding: '0.7rem',
                      borderRadius: '8px',
                      backgroundColor: '#292524',
                      border: '1px solid #44403C',
                      color: '#FFFFFF',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#E7E5E4', marginBottom: '0.4rem' }}>
                  Default Fallback Page Title
                </label>
                <input
                  type="text"
                  value={globalSeo.defaultTitle}
                  onChange={(e) => updateGlobalField('defaultTitle', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    borderRadius: '8px',
                    backgroundColor: '#292524',
                    border: '1px solid #44403C',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#E7E5E4', marginBottom: '0.4rem' }}>
                  Default Fallback Meta Description
                </label>
                <textarea
                  rows={3}
                  value={globalSeo.defaultDescription}
                  onChange={(e) => updateGlobalField('defaultDescription', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    borderRadius: '8px',
                    backgroundColor: '#292524',
                    border: '1px solid #44403C',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                  }}
                />
              </div>

              {/* Favicon URL */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#E7E5E4', marginBottom: '0.4rem' }}>
                  Favicon URL
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={globalSeo.faviconUrl}
                    onChange={(e) => updateGlobalField('faviconUrl', e.target.value)}
                    placeholder="/icon.jpeg"
                    style={{
                      flex: 1,
                      padding: '0.7rem',
                      borderRadius: '8px',
                      backgroundColor: '#292524',
                      border: '1px solid #44403C',
                      color: '#FFFFFF',
                      fontSize: '0.9rem',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => openMediaPicker((url) => updateGlobalField('faviconUrl', url))}
                    style={{
                      padding: '0.7rem 1rem',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(222, 120, 67, 0.15)',
                      color: '#DE7843',
                      border: '1px solid rgba(222, 120, 67, 0.4)',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    🖼️ Browse Uploads
                  </button>
                </div>
              </div>

              {/* Default OG Image */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#E7E5E4', marginBottom: '0.4rem' }}>
                  Default Social Share Image (OG Image)
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={globalSeo.defaultOgImage}
                    onChange={(e) => updateGlobalField('defaultOgImage', e.target.value)}
                    style={{
                      flex: 1,
                      padding: '0.7rem',
                      borderRadius: '8px',
                      backgroundColor: '#292524',
                      border: '1px solid #44403C',
                      color: '#FFFFFF',
                      fontSize: '0.9rem',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => openMediaPicker((url) => updateGlobalField('defaultOgImage', url))}
                    style={{
                      padding: '0.7rem 1rem',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(222, 120, 67, 0.15)',
                      color: '#DE7843',
                      border: '1px solid rgba(222, 120, 67, 0.4)',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    🖼️ Browse Uploads
                  </button>
                </div>
              </div>
            </div>

            {/* Google Search Console & Bing Verification */}
            <div style={{ backgroundColor: '#1C1917', borderRadius: '12px', border: '1px solid #292524', padding: '1.5rem' }}>
              <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🔍</span> Search Console &amp; Webmaster Verification
              </h3>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#E7E5E4', marginBottom: '0.4rem' }}>
                  Google Search Console Verification Token (meta tag content)
                </label>
                <input
                  type="text"
                  value={globalSeo.googleSiteVerification || ''}
                  onChange={(e) => updateGlobalField('googleSiteVerification', e.target.value)}
                  placeholder="e.g. google-site-verification=abc123XYZ or token string"
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    borderRadius: '8px',
                    backgroundColor: '#292524',
                    border: '1px solid #44403C',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                  }}
                />
                <span style={{ fontSize: '0.78rem', color: '#78716C', marginTop: '0.35rem', display: 'block' }}>
                  Outputs &lt;meta name=&quot;google-site-verification&quot; content=&quot;...&quot;&gt; in all public page headers.
                </span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#E7E5E4', marginBottom: '0.4rem' }}>
                  Bing Webmaster Tools Verification Token
                </label>
                <input
                  type="text"
                  value={globalSeo.bingSiteVerification || ''}
                  onChange={(e) => updateGlobalField('bingSiteVerification', e.target.value)}
                  placeholder="e.g. 1234567890ABCDEF"
                  style={{
                    width: '100%',
                    padding: '0.7rem',
                    borderRadius: '8px',
                    backgroundColor: '#292524',
                    border: '1px solid #44403C',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Search Console Guide */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ backgroundColor: '#1C1917', borderRadius: '12px', border: '1px solid #292524', padding: '1.5rem' }}>
              <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 800, color: '#DE7843' }}>
                📋 Google Search Console Checklist
              </h4>
              <div style={{ fontSize: '0.85rem', color: '#D6D3D1', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div><strong>1. Add Website Property:</strong> Add your domain (e.g. <code>https://vcsamersham.co.uk</code>) in Google Search Console.</div>
                <div><strong>2. Verify Ownership:</strong> Copy your verification token into the input on the left and click &apos;Save All SEO Changes&apos;.</div>
                <div><strong>3. Submit Dynamic Sitemap:</strong> Go to &quot;Sitemaps&quot; in GSC and submit <code>/sitemap.xml</code>.</div>
                <div><strong>4. Monitor Indexing:</strong> Check the &quot;Pages&quot; report to verify all public pages are indexable.</div>
                <div><strong>5. Inspect Important URLs:</strong> Use the &quot;URL Inspection&quot; tool to request rapid indexing for your Home and Catering pages.</div>
                <div><strong>6. Review Search Queries:</strong> Monitor impression and click trends under the &quot;Performance&quot; tab.</div>
              </div>
            </div>

            <div style={{ backgroundColor: '#1C1917', borderRadius: '12px', border: '1px solid #292524', padding: '1.5rem' }}>
              <h4 style={{ margin: '0 0 0.85rem 0', fontSize: '1rem', fontWeight: 800, color: '#FFFFFF' }}>
                Live Verification Endpoints
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', backgroundColor: '#141211', borderRadius: '6px', border: '1px solid #292524', fontSize: '0.82rem' }}>
                  <span style={{ fontFamily: 'monospace', color: '#10B981' }}>/sitemap.xml</span>
                  <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" style={{ color: '#DE7843', textDecoration: 'none', fontWeight: 700 }}>
                    View Live ↗
                  </a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', backgroundColor: '#141211', borderRadius: '6px', border: '1px solid #292524', fontSize: '0.82rem' }}>
                  <span style={{ fontFamily: 'monospace', color: '#10B981' }}>/robots.txt</span>
                  <a href="/robots.txt" target="_blank" rel="noopener noreferrer" style={{ color: '#DE7843', textDecoration: 'none', fontWeight: 700 }}>
                    View Live ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 5: REDIRECTS MANAGEMENT */}
      {subView === 'redirects' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Add Redirect Form */}
          <div style={{ backgroundColor: '#1C1917', borderRadius: '12px', border: '1px solid #292524', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>
              URL Redirect Manager (301 / 302)
            </h3>
            <p style={{ color: '#A8A29E', fontSize: '0.88rem', margin: '0 0 1.25rem 0' }}>
              Create permanent (301) or temporary (302) redirects to route old or changed links safely without 404 errors or search penalty.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1.5fr) 140px auto', gap: '0.85rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#E7E5E4', marginBottom: '0.35rem' }}>
                  Source URL (Old Path)
                </label>
                <input
                  type="text"
                  value={newRedirectFrom}
                  onChange={(e) => setNewRedirectFrom(e.target.value)}
                  placeholder="e.g. /old-menu or /catering-old"
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '8px',
                    backgroundColor: '#292524',
                    border: '1px solid #44403C',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#E7E5E4', marginBottom: '0.35rem' }}>
                  Destination URL (New Path)
                </label>
                <input
                  type="text"
                  value={newRedirectTo}
                  onChange={(e) => setNewRedirectTo(e.target.value)}
                  placeholder="e.g. /outdoor-catering or /#menu"
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '8px',
                    backgroundColor: '#292524',
                    border: '1px solid #44403C',
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#E7E5E4', marginBottom: '0.35rem' }}>
                  Redirect Type
                </label>
                <select
                  value={newRedirectStatus}
                  onChange={(e) => setNewRedirectStatus(Number(e.target.value) as any)}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '8px',
                    backgroundColor: '#292524',
                    border: '1px solid #44403C',
                    color: '#FFFFFF',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                  }}
                >
                  <option value={301}>301 (Permanent)</option>
                  <option value={302}>302 (Temporary)</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleAddRedirect}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: '8px',
                  backgroundColor: '#DE7843',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                ➕ Add Redirect
              </button>
            </div>
          </div>

          {/* Active Redirects Table */}
          <div style={{ backgroundColor: '#1C1917', borderRadius: '12px', border: '1px solid #292524', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #292524', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#FFFFFF' }}>
                Active Redirect Rules ({activeRedirects.length})
              </h4>
              <span style={{ fontSize: '0.78rem', color: '#A8A29E' }}>
                Loops &amp; self-redirects are automatically prevented
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#141211', borderBottom: '1px solid #292524', color: '#A8A29E', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.75rem 1.25rem' }}>Source (Old URL)</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Destination (New URL)</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 1.25rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeRedirects.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ padding: '2.5rem', textAlign: 'center', color: '#78716C' }}>
                        No custom redirect rules created yet.
                      </td>
                    </tr>
                  ) : (
                    activeRedirects.map((r) => (
                      <tr key={r.id} style={{ borderBottom: '1px solid #24201E' }}>
                        <td style={{ padding: '0.85rem 1.25rem', fontFamily: 'monospace', color: '#F5F5F4' }}>
                          {r.fromPath}
                        </td>
                        <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', color: '#DE7843' }}>
                          → {r.toPath}
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span
                            style={{
                              fontSize: '0.75rem',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '4px',
                              fontWeight: 700,
                              backgroundColor: r.statusCode === 301 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(96, 165, 250, 0.15)',
                              color: r.statusCode === 301 ? '#10B981' : '#60A5FA',
                            }}
                          >
                            {r.statusCode} {r.statusCode === 301 ? 'Permanent' : 'Temporary'}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => handleDeleteRedirect(r.id)}
                            style={{
                              padding: '0.35rem 0.75rem',
                              borderRadius: '6px',
                              backgroundColor: 'rgba(239, 68, 68, 0.15)',
                              color: '#EF4444',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD CUSTOM ROUTE MODAL */}
      {newRouteModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#1C1917',
              borderRadius: '14px',
              border: '1px solid #44403C',
              padding: '1.75rem',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            }}
          >
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF' }}>
              Add Website Page / Route
            </h3>
            <p style={{ color: '#A8A29E', fontSize: '0.88rem', margin: '0 0 1.25rem 0' }}>
              Register an existing or custom website route to manage its search engine metadata and social tags.
            </p>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#E7E5E4', marginBottom: '0.4rem' }}>
                URL Route Path
              </label>
              <input
                type="text"
                value={newRoutePath}
                onChange={(e) => setNewRoutePath(e.target.value)}
                placeholder="e.g. /about or /services"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  backgroundColor: '#292524',
                  border: '1px solid #44403C',
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#E7E5E4', marginBottom: '0.4rem' }}>
                Page Display Name
              </label>
              <input
                type="text"
                value={newRouteName}
                onChange={(e) => setNewRouteName(e.target.value)}
                placeholder="e.g. About Our Restaurant"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  backgroundColor: '#292524',
                  border: '1px solid #44403C',
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setNewRouteModalOpen(false)}
                style={{
                  padding: '0.65rem 1.15rem',
                  borderRadius: '8px',
                  backgroundColor: 'transparent',
                  color: '#A8A29E',
                  border: '1px solid #44403C',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCustomRoute}
                style={{
                  padding: '0.65rem 1.25rem',
                  borderRadius: '8px',
                  backgroundColor: '#DE7843',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Register Route
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: MEDIA PICKER GALLERY MODAL */}
      {mediaPickerOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#1C1917',
              borderRadius: '16px',
              border: '1px solid #44403C',
              padding: '1.75rem',
              maxWidth: '900px',
              width: '100%',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.35rem', fontWeight: 800, color: '#FFFFFF' }}>
                  Select Image from Media Library
                </h3>
                <p style={{ margin: 0, color: '#A8A29E', fontSize: '0.85rem' }}>
                  Choose from existing uploaded assets or upload a new image.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMediaPickerOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#A8A29E',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '0.25rem 0.5rem',
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              {(['all', 'uploads', 'images', 'migrated'] as const).map((fol) => (
                <button
                  key={fol}
                  type="button"
                  onClick={() => setMediaFilter(fol)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '6px',
                    backgroundColor: mediaFilter === fol ? '#DE7843' : '#292524',
                    color: mediaFilter === fol ? '#FFFFFF' : '#D6D3D1',
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {fol === 'all' ? '📁 All Images' : fol === 'uploads' ? '⭐ Uploads Folder' : fol}
                </button>
              ))}
            </div>

            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '1rem',
                padding: '0.5rem 0.25rem',
              }}
            >
              {mediaLoading ? (
                <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: '#A8A29E' }}>
                  Loading media library...
                </div>
              ) : (
                mediaItems
                  .filter((item) => mediaFilter === 'all' || item.folder === mediaFilter)
                  .map((item) => (
                    <div
                      key={item.url}
                      onClick={() => {
                        if (onSelectMediaCallback) {
                          onSelectMediaCallback(item.url);
                        }
                        setMediaPickerOpen(false);
                      }}
                      style={{
                        backgroundColor: '#292524',
                        borderRadius: '10px',
                        border: '1px solid #44403C',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'transform 0.15s ease, border-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#DE7843';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#44403C';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div style={{ width: '100%', height: '110px', backgroundColor: '#141211', overflow: 'hidden' }}>
                        <img
                          src={item.url}
                          alt={item.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          loading="lazy"
                        />
                      </div>
                      <div style={{ padding: '0.65rem' }}>
                        <div
                          style={{
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            color: '#F5F5F4',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                          title={item.name}
                        >
                          {item.name}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#78716C', marginTop: '3px' }}>
                          <span>{item.folder}</span>
                          <span>{item.sizeBytes > 0 ? `${Math.round(item.sizeBytes / 1024)} KB` : ''}</span>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>

            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #292524', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setMediaPickerOpen(false)}
                style={{
                  padding: '0.55rem 1.25rem',
                  borderRadius: '8px',
                  backgroundColor: '#292524',
                  color: '#FFFFFF',
                  border: '1px solid #44403C',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
