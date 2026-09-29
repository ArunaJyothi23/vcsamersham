'use client';
import { useState, useRef, useEffect } from 'react';

export default function AskKodee() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'ai'|'user', text: string}[]>([
    { role: 'ai', text: 'Hello 👋\nHow can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response based on the screenshots
    setTimeout(() => {
      let aiResponse = "Could you clarify what you'd like me to do?";
      if (text.toLowerCase().includes("search posts") || text.toLowerCase().includes("blog")) {
        aiResponse = "No published posts were found on your WordPress website.";
      }
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  const suggestions = [
    "Can you help me create a new blog post?",
    "Show me a list of my website pages instead.",
    "How can I check my current WordPress settings?"
  ];

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button 
          onClick={toggleSidebar}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            backgroundColor: '#7c3aed',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            padding: '0.8rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.4)',
            zIndex: 1000,
            transition: 'transform 0.2s'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3L14.5 9.5L21 12L14.5 14.5L12 21L9.5 14.5L3 12L9.5 9.5L12 3Z"></path></svg>
          Ask AI
        </button>
      )}

      {/* Sidebar Overlay */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '380px',
          height: '100vh',
          backgroundColor: '#fff',
          boxShadow: '-4px 0 15px rgba(0,0,0,0.1)',
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideIn 0.3s ease-out'
        }}>
          {/* Header */}
          <div style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid #f3f4f6',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h2 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Kodee
            </h2>
            <button 
              onClick={toggleSidebar}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
          </div>

          {/* Chat Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Logo Watermark */}
            {messages.length === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem', marginBottom: '2rem' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem' }}><path d="M12 3L14.5 9.5L21 12L14.5 14.5L12 21L9.5 14.5L3 12L9.5 9.5L12 3Z"></path></svg>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.role === 'ai' ? 'flex-start' : 'flex-end',
                maxWidth: '85%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {msg.role === 'ai' && (
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#7c3aed', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3L14.5 9.5L21 12L14.5 14.5L12 21L9.5 14.5L3 12L9.5 9.5L12 3Z"></path></svg>
                    Kodee
                  </div>
                )}
                <div style={{
                  backgroundColor: msg.role === 'ai' ? 'transparent' : '#f3f4f6',
                  color: '#1f2937',
                  padding: msg.role === 'ai' ? '0' : '0.8rem 1rem',
                  borderRadius: '12px',
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.5',
                  fontSize: '0.95rem',
                  textAlign: msg.role === 'ai' && messages.length === 1 ? 'center' : 'left'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ alignSelf: 'flex-start', color: '#6b7280', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3L14.5 9.5L21 12L14.5 14.5L12 21L9.5 14.5L3 12L9.5 9.5L12 3Z"></path></svg>
                Kodee is thinking...
              </div>
            )}

            {/* Suggestions */}
            {messages.length === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '2rem' }}>
                {suggestions.map((s, i) => (
                  <button 
                    key={i}
                    onClick={() => handleSend(s)}
                    style={{
                      background: 'none',
                      border: '1px solid #e5e7eb',
                      borderTopWidth: i === 0 ? '1px' : '0',
                      padding: '1rem',
                      textAlign: 'left',
                      color: '#4b5563',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.8rem',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{ padding: '1.5rem', borderTop: '1px solid #f3f4f6' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #e5e7eb',
              borderRadius: '20px',
              padding: '0.5rem 1rem',
              backgroundColor: '#fff'
            }}>
              <input 
                type="text" 
                placeholder="Ask Kodee anything..." 
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend(inputValue)}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.95rem',
                  color: '#1f2937'
                }}
              />
              <button 
                onClick={() => handleSend(inputValue)}
                disabled={!inputValue.trim()}
                style={{
                  background: inputValue.trim() ? '#f3f4f6' : 'transparent',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: inputValue.trim() ? 'pointer' : 'default',
                  color: inputValue.trim() ? '#4b5563' : '#d1d5db',
                  transition: 'background-color 0.2s'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
              </button>
            </div>
            <div style={{ textAlign: 'center', marginTop: '0.8rem', fontSize: '0.7rem', color: '#9ca3af' }}>
              Kodee can make mistakes. Double-check replies.
            </div>
          </div>
        </div>
      )}
      
      {/* Basic Keyframe Animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}} />
    </>
  );
}
