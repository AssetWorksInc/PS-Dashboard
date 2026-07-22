'use client'

import { useState } from 'react'

const TEAM = [
  { name: 'Amanda Rivera', role: 'Dedicated CSM', initials: 'AR', color: '#0D7C66', status: 'online' },
  { name: 'James Thornton', role: 'Senior Consultant', initials: 'JT', color: '#2E86C1', status: 'away' },
  { name: 'Chris Nguyen', role: 'Integration Specialist', initials: 'CN', color: '#1B2A4A', status: 'online' },
]

const AUTO_REPLIES = [
  'Thanks for reaching out! Amanda Rivera will respond within 2 hours.',
  'Got your message — our PS team typically responds same business day.',
  'Thanks! If this is urgent please call your dedicated CSM directly.',
  'Message received. We will get back to you shortly.',
]

interface Message {
  id: string
  from: 'user' | 'agent'
  text: string
  time: string
  agent?: string
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [activeAgent, setActiveAgent] = useState(TEAM[0])
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      from: 'agent',
      text: `Hi! I'm ${TEAM[0].name}, your dedicated CSM. How can I help you today?`,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      agent: TEAM[0].name
    }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [view, setView] = useState<'chat' | 'team'>('chat')

  const sendMessage = () => {
    if (!input.trim()) return

    const userMsg: Message = {
      id: Date.now().toString(),
      from: 'user',
      text: input.trim(),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTyping(true)

    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        from: 'agent',
        text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)],
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        agent: activeAgent.name
      }
      setMessages(prev => [...prev, reply])
      setTyping(false)
    }, 1500)
  }

  const switchAgent = (agent: typeof TEAM[0]) => {
    setActiveAgent(agent)
    setView('chat')
    setMessages([{
      id: Date.now().toString(),
      from: 'agent',
      text: `Hi! I'm ${agent.name}, ${agent.role}. How can I help you?`,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      agent: agent.name
    }])
  }

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => { setOpen(true); setMinimized(false) }}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: '#0D7C66',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(13,124,102,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            zIndex: 1000,
            transition: 'all 0.2s'
          }}
          title="Chat with PS Team"
        >
          💬
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '340px',
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          zIndex: 1000,
          overflow: 'hidden',
          transition: 'all 0.2s'
        }}>

          {/* Header */}
          <div style={{
            background: '#1B2A4A',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            {/* Agent avatar */}
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: activeAgent.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 700,
              color: '#fff',
              flexShrink: 0,
              position: 'relative'
            }}>
              {activeAgent.initials}
              <div style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: activeAgent.status === 'online' ? '#10b981' : '#f59e0b',
                border: '2px solid #1B2A4A'
              }} />
            </div>

            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#f1f5f9', marginBottom: '1px' }}>
                {activeAgent.name}
              </p>
              <p style={{ fontSize: '10px', color: '#64748b' }}>
                {activeAgent.status === 'online' ? '🟢 Online now' : '🟡 Away · replies in 2hrs'}
              </p>
            </div>

            {/* Header actions */}
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={() => setView(view === 'team' ? 'chat' : 'team')}
                style={{
                  width: '28px', height: '28px', borderRadius: '6px',
                  background: 'rgba(255,255,255,0.1)', border: 'none',
                  color: '#94a3b8', cursor: 'pointer', fontSize: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
                title="Switch agent"
              >
                👥
              </button>
              <button
                onClick={() => setMinimized(!minimized)}
                style={{
                  width: '28px', height: '28px', borderRadius: '6px',
                  background: 'rgba(255,255,255,0.1)', border: 'none',
                  color: '#94a3b8', cursor: 'pointer', fontSize: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
                title={minimized ? 'Expand' : 'Minimize'}
              >
                {minimized ? '▲' : '▼'}
              </button>
              <button
                onClick={() => setOpen(false)}
                style={{
                  width: '28px', height: '28px', borderRadius: '6px',
                  background: 'rgba(255,255,255,0.1)', border: 'none',
                  color: '#94a3b8', cursor: 'pointer', fontSize: '14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Body — hidden when minimized */}
          {!minimized && (
            <>
              {/* TEAM VIEW */}
              {view === 'team' && (
                <div style={{ padding: '14px 16px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: '#4A5568', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
                    Your PS Team
                  </p>
                  {TEAM.map((member, i) => (
                    <button
                      key={i}
                      onClick={() => switchAgent(member)}
                      style={{
                        width: '100%', textAlign: 'left', background: activeAgent.name === member.name ? '#e6f4f1' : '#F7F8FA',
                        border: activeAgent.name === member.name ? '1px solid #0D7C66' : '1px solid transparent',
                        borderRadius: '10px', padding: '12px 14px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px',
                        transition: 'all 0.15s'
                      }}
                    >
                      <div style={{
                        width: '38px', height: '38px', borderRadius: '50%',
                        background: member.color, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '12px', fontWeight: 700,
                        color: '#fff', flexShrink: 0, position: 'relative'
                      }}>
                        {member.initials}
                        <div style={{
                          position: 'absolute', bottom: 0, right: 0,
                          width: '10px', height: '10px', borderRadius: '50%',
                          background: member.status === 'online' ? '#10b981' : '#f59e0b',
                          border: '2px solid #fff'
                        }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '12px', fontWeight: 700, color: '#1B2A4A', marginBottom: '2px' }}>
                          {member.name}
                        </p>
                        <p style={{ fontSize: '10px', color: '#4A5568' }}>{member.role}</p>
                        <p style={{ fontSize: '10px', color: member.status === 'online' ? '#0D7C66' : '#B7791F', fontWeight: 600 }}>
                          {member.status === 'online' ? '● Online' : '● Away'}
                        </p>
                      </div>
                      {activeAgent.name === member.name && (
                        <span style={{ fontSize: '9px', background: '#0D7C66', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                          ACTIVE
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* CHAT VIEW */}
              {view === 'chat' && (
                <>
                  {/* Messages */}
                  <div style={{
                    height: '280px',
                    overflowY: 'auto',
                    padding: '14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    background: '#F7F8FA'
                  }}>
                    {messages.map(msg => (
                      <div key={msg.id} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: msg.from === 'user' ? 'flex-end' : 'flex-start'
                      }}>
                        {msg.from === 'agent' && (
                          <p style={{ fontSize: '9px', color: '#94a3b8', marginBottom: '3px', paddingLeft: '4px' }}>
                            {msg.agent}
                          </p>
                        )}
                        <div style={{
                          maxWidth: '80%',
                          padding: '9px 12px',
                          borderRadius: msg.from === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                          background: msg.from === 'user' ? '#1B2A4A' : '#ffffff',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                        }}>
                          <p style={{
                            fontSize: '12px',
                            color: msg.from === 'user' ? '#f1f5f9' : '#1B2A4A',
                            lineHeight: 1.5
                          }}>
                            {msg.text}
                          </p>
                        </div>
                        <p style={{ fontSize: '9px', color: '#94a3b8', marginTop: '3px', paddingLeft: '4px', paddingRight: '4px' }}>
                          {msg.time}
                        </p>
                      </div>
                    ))}

                    {/* Typing indicator */}
                    {typing && (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                        <div style={{ padding: '10px 14px', background: '#ffffff', borderRadius: '12px 12px 12px 2px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                            {[0, 1, 2].map(i => (
                              <div key={i} style={{
                                width: '6px', height: '6px', borderRadius: '50%',
                                background: '#94a3b8',
                                animation: `bounce 1s infinite ${i * 0.2}s`
                              }} />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input */}
                  <div style={{
                    padding: '12px 14px',
                    borderTop: '1px solid #E2E8F0',
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'flex-end',
                    background: '#ffffff'
                  }}>
                    <textarea
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          sendMessage()
                        }
                      }}
                      placeholder="Type a message..."
                      style={{
                        flex: 1, padding: '9px 12px', fontSize: '12px',
                        border: '1px solid #E2E8F0', borderRadius: '8px',
                        resize: 'none', height: '38px', maxHeight: '80px',
                        color: '#1B2A4A', outline: 'none', fontFamily: 'inherit',
                        lineHeight: 1.4
                      }}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!input.trim()}
                      style={{
                        width: '38px', height: '38px', borderRadius: '8px',
                        background: input.trim() ? '#0D7C66' : '#E2E8F0',
                        border: 'none', cursor: input.trim() ? 'pointer' : 'default',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '16px', flexShrink: 0, transition: 'all 0.15s'
                      }}
                    >
                      ➤
                    </button>
                  </div>

                  {/* Footer */}
                  <div style={{
                    padding: '8px 16px',
                    background: '#F7F8FA',
                    borderTop: '1px solid #E2E8F0',
                    textAlign: 'center'
                  }}>
                    <p style={{ fontSize: '9px', color: '#94a3b8' }}>
                      Powered by AssetWorks PS Portal · Typical response: 2hrs
                    </p>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </>
  )
}
