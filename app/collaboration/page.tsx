'use client'

import { useEffect, useState } from 'react'

export default function CollaborationHub() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('announcements')
  const [openNote, setOpenNote] = useState<string | null>(null)
  const [openDiscussion, setOpenDiscussion] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    fetch('/api/collaboration')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px' }}>
      <div style={{ fontSize: '32px' }}>⏳</div>
      <p style={{ color: '#4A5568', marginTop: '12px' }}>Loading collaboration hub...</p>
    </div>
  )

  const tabs = [
    { id: 'announcements', label: '📢 Announcements' },
    { id: 'meetings', label: '📝 Meeting Notes' },
    { id: 'documents', label: '📁 Shared Documents' },
    { id: 'team', label: '👥 Team Directory' },
    { id: 'discussions', label: '💬 Discussions' },
  ]

  const initials = (name: string) =>
    name.split(' ').map((n: string) => n[0]).join('').toUpperCase()

  const avatarColor = (name: string) => {
    const colors = ['#1B2A4A', '#0D7C66', '#2E86C1', '#B7791F', '#276749', '#C53030']
    return colors[name.charCodeAt(0) % colors.length]
  }

  return (
    <div style={{ maxWidth: '960px' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1B2A4A', marginBottom: '4px' }}>
          🤝 Collaboration Hub
        </h1>
        <p style={{ fontSize: '13px', color: '#4A5568' }}>
          Meeting notes, shared documents, team directory, discussions, and announcements
        </p>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '10px', marginBottom: '24px' }}>
        {[
          { label: 'Announcements', value: data?.announcements?.length || 0, icon: '📢', color: '#0D7C66' },
          { label: 'Meeting Notes', value: data?.meetingNotes?.length || 0, icon: '📝', color: '#2E86C1' },
          { label: 'Documents', value: data?.documents?.length || 0, icon: '📁', color: '#B7791F' },
          { label: 'Team Members', value: data?.team?.length || 0, icon: '👥', color: '#1B2A4A' },
          { label: 'Discussions', value: data?.discussions?.length || 0, icon: '💬', color: '#276749' },
        ].map((k, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(tabs[i].id)}
            style={{
              background: activeTab === tabs[i].id ? '#1B2A4A' : '#ffffff',
              border: 'none',
              borderTop: `3px solid ${k.color}`,
              borderRadius: '10px',
              padding: '14px 12px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ fontSize: '18px', marginBottom: '4px' }}>{k.icon}</div>
            <div style={{ fontSize: '10px', color: activeTab === tabs[i].id ? '#94a3b8' : '#4A5568', marginBottom: '3px' }}>{k.label}</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: activeTab === tabs[i].id ? '#ffffff' : '#1B2A4A' }}>{k.value}</div>
          </button>
        ))}
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', background: '#ffffff', borderRadius: '10px', padding: '4px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              flex: 1,
              padding: '9px 12px',
              fontSize: '11px',
              fontWeight: 600,
              color: activeTab === t.id ? '#ffffff' : '#4A5568',
              background: activeTab === t.id ? '#1B2A4A' : 'transparent',
              border: 'none',
              borderRadius: '7px',
              cursor: 'pointer',
              transition: 'all 0.15s',
              whiteSpace: 'nowrap'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── ANNOUNCEMENTS ── */}
      {activeTab === 'announcements' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {data?.announcements?.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', background: '#ffffff', borderRadius: '12px' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📢</div>
              <p style={{ fontSize: '13px', color: '#4A5568' }}>No announcements yet.</p>
            </div>
          ) : data?.announcements?.map((a: any) => (
            <div key={a.id} style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '18px 20px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              borderLeft: `4px solid ${a.is_pinned ? '#0D7C66' : '#E2E8F0'}`
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {a.is_pinned && (
                    <span style={{ fontSize: '9px', background: '#0D7C66', color: '#fff', padding: '2px 7px', borderRadius: '4px', fontWeight: 700 }}>
                      PINNED
                    </span>
                  )}
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1B2A4A' }}>{a.title}</h3>
                </div>
                <span style={{ fontSize: '10px', color: '#94a3b8', whiteSpace: 'nowrap', marginLeft: '12px' }}>
                  {new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#4A5568', lineHeight: 1.7, marginBottom: '10px' }}>{a.body}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: avatarColor(a.author),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '9px', fontWeight: 700, color: '#fff'
                }}>
                  {initials(a.author)}
                </div>
                <span style={{ fontSize: '11px', color: '#4A5568' }}>Posted by {a.author}</span>
              </div>
            </div>
          ))}

          {/* New announcement button */}
          <button style={{
            padding: '14px',
            background: 'transparent',
            border: '2px dashed #E2E8F0',
            borderRadius: '12px',
            fontSize: '12px',
            color: '#4A5568',
            cursor: 'pointer',
            fontWeight: 600
          }}>
            + Post New Announcement
          </button>
        </div>
      )}

      {/* ── MEETING NOTES ── */}
      {activeTab === 'meetings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {data?.meetingNotes?.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', background: '#ffffff', borderRadius: '12px' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📝</div>
              <p style={{ fontSize: '13px', color: '#4A5568' }}>No meeting notes yet.</p>
            </div>
          ) : data?.meetingNotes?.map((m: any) => (
            <div key={m.id} style={{ background: '#ffffff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              <button
                onClick={() => setOpenNote(openNote === m.id ? null : m.id)}
                style={{
                  width: '100%', textAlign: 'left', background: 'none',
                  border: 'none', padding: '16px 20px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '14px'
                }}
              >
                {/* Date box */}
                <div style={{
                  width: '48px', height: '48px', borderRadius: '10px',
                  background: '#1B2A4A', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <div style={{ fontSize: '9px', color: '#0D7C66', fontWeight: 700 }}>
                    {new Date(m.meeting_date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>
                    {new Date(m.meeting_date).getDate()}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1B2A4A', marginBottom: '4px' }}>{m.title}</h3>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <span style={{ fontSize: '10px', color: '#4A5568' }}>By {m.author}</span>
                    {m.attendees && (
                      <span style={{ fontSize: '10px', color: '#4A5568' }}>
                        👥 {m.attendees.length} attendees
                      </span>
                    )}
                    {m.action_items && (
                      <span style={{ fontSize: '10px', color: '#0D7C66', fontWeight: 600 }}>
                        ✅ {m.action_items.length} action items
                      </span>
                    )}
                  </div>
                </div>
                <span style={{ fontSize: '12px', color: '#4A5568' }}>{openNote === m.id ? '▲' : '▼'}</span>
              </button>

              {openNote === m.id && (
                <div style={{ padding: '0 20px 20px', borderTop: '1px solid #F7F8FA' }}>
                  {/* Notes body */}
                  {m.body && (
                    <div style={{ marginTop: '14px', marginBottom: '16px' }}>
                      <p style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Notes</p>
                      <p style={{ fontSize: '12px', color: '#4A5568', lineHeight: 1.7 }}>{m.body}</p>
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {/* Attendees */}
                    {m.attendees && m.attendees.length > 0 && (
                      <div>
                        <p style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Attendees</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {m.attendees.map((attendee: string, i: number) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{
                                width: '26px', height: '26px', borderRadius: '50%',
                                background: avatarColor(attendee),
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '9px', fontWeight: 700, color: '#fff', flexShrink: 0
                              }}>
                                {initials(attendee)}
                              </div>
                              <span style={{ fontSize: '11px', color: '#1B2A4A' }}>{attendee}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action items */}
                    {m.action_items && m.action_items.length > 0 && (
                      <div>
                        <p style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Action Items</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {m.action_items.map((item: string, i: number) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                              <span style={{ fontSize: '12px', color: '#0D7C66', flexShrink: 0 }}>☐</span>
                              <span style={{ fontSize: '11px', color: '#1B2A4A', lineHeight: 1.5 }}>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #F7F8FA' }}>
                    <button style={{ padding: '6px 14px', background: '#1B2A4A', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                      📄 View Full Notes
                    </button>
                    <button style={{ padding: '6px 14px', background: '#ffffff', color: '#4A5568', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                      ⬇️ Download
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          <button style={{
            padding: '14px',
            background: 'transparent',
            border: '2px dashed #E2E8F0',
            borderRadius: '12px',
            fontSize: '12px',
            color: '#4A5568',
            cursor: 'pointer',
            fontWeight: 600
          }}>
            + Add Meeting Notes
          </button>
        </div>
      )}

      {/* ── SHARED DOCUMENTS ── */}
      {activeTab === 'documents' && (
        <div>
          {data?.documents?.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', background: '#ffffff', borderRadius: '12px', marginBottom: '12px' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📁</div>
              <p style={{ fontSize: '13px', color: '#4A5568', marginBottom: '16px' }}>No shared documents yet.</p>
              <button style={{ padding: '10px 20px', background: '#1B2A4A', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                + Upload First Document
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
              {data.documents.map((d: any) => (
                <div key={d.id} style={{
                  background: '#ffffff', borderRadius: '10px', padding: '14px 18px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '14px'
                }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '8px',
                    background: d.file_type === 'pdf' ? '#fef2f2' : d.file_type === 'xls' ? '#f0fdf4' : '#eff6ff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0
                  }}>
                    {d.file_type === 'pdf' ? '📕' : d.file_type === 'xls' ? '📗' : '📘'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#1B2A4A', marginBottom: '3px' }}>{d.title}</p>
                    <p style={{ fontSize: '10px', color: '#4A5568' }}>
                      {d.category && `${d.category} · `}Uploaded by {d.uploaded_by}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ padding: '6px 12px', background: '#1B2A4A', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>Open</button>
                    <button style={{ padding: '6px 12px', background: '#ffffff', color: '#4A5568', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>⬇️</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button style={{
            width: '100%', padding: '14px', background: 'transparent',
            border: '2px dashed #E2E8F0', borderRadius: '12px',
            fontSize: '12px', color: '#4A5568', cursor: 'pointer', fontWeight: 600
          }}>
            + Upload Document
          </button>
        </div>
      )}

      {/* ── TEAM DIRECTORY ── */}
      {activeTab === 'team' && (
        <div>
          {/* PS Team */}
          <h2 style={{ fontSize: '12px', fontWeight: 700, color: '#4A5568', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
            Your PS Team
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '12px', marginBottom: '24px' }}>
            {data?.team?.filter((m: any) => m.is_ps_team).map((member: any) => (
              <div key={member.id} style={{
                background: '#ffffff', borderRadius: '12px', padding: '18px 20px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)', borderLeft: '4px solid #0D7C66',
                display: 'flex', alignItems: 'flex-start', gap: '14px'
              }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: avatarColor(member.name),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', fontWeight: 700, color: '#fff', flexShrink: 0
                }}>
                  {initials(member.name)}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1B2A4A', marginBottom: '2px' }}>
                    {member.name}
                  </h3>
                  <p style={{ fontSize: '11px', color: '#0D7C66', fontWeight: 600, marginBottom: '6px' }}>{member.role}</p>
                  {member.email && (
                    <a href={`mailto:${member.email}`} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#2E86C1', textDecoration: 'none', marginBottom: '8px' }}>
                      ✉️ {member.email}
                    </a>
                  )}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ padding: '5px 12px', background: '#0D7C66', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '10px', fontWeight: 600, cursor: 'pointer' }}>
                      💬 Message
                    </button>
                    <button style={{ padding: '5px 12px', background: '#ffffff', color: '#4A5568', border: '1px solid #E2E8F0', borderRadius: '5px', fontSize: '10px', fontWeight: 600, cursor: 'pointer' }}>
                      📅 Schedule
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Non-PS team */}
          {data?.team?.filter((m: any) => !m.is_ps_team).length > 0 && (
            <>
              <h2 style={{ fontSize: '12px', fontWeight: 700, color: '#4A5568', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                Institution Team
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '12px' }}>
                {data?.team?.filter((m: any) => !m.is_ps_team).map((member: any) => (
                  <div key={member.id} style={{
                    background: '#ffffff', borderRadius: '12px', padding: '16px 18px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                    display: 'flex', alignItems: 'center', gap: '12px'
                  }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '50%',
                      background: avatarColor(member.name),
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: 700, color: '#fff', flexShrink: 0
                    }}>
                      {initials(member.name)}
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', fontWeight: 700, color: '#1B2A4A' }}>{member.name}</p>
                      <p style={{ fontSize: '10px', color: '#4A5568' }}>{member.role}</p>
                      {member.email && (
                        <a href={`mailto:${member.email}`} style={{ fontSize: '10px', color: '#2E86C1', textDecoration: 'none' }}>
                          {member.email}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── DISCUSSIONS ── */}
      {activeTab === 'discussions' && (
        <div>
          {/* New discussion input */}
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', marginBottom: '16px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#4A5568', marginBottom: '8px' }}>Start a new discussion</p>
            <textarea
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="What would you like to discuss with your PS team?"
              style={{
                width: '100%', padding: '10px 14px', fontSize: '12px',
                border: '1px solid #E2E8F0', borderRadius: '8px', resize: 'none',
                height: '70px', color: '#1B2A4A', outline: 'none',
                fontFamily: 'inherit'
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button
                onClick={() => setNewMessage('')}
                style={{ padding: '7px 18px', background: '#1B2A4A', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
              >
                Post Discussion
              </button>
            </div>
          </div>

          {/* Discussion threads */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data?.discussions?.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', background: '#ffffff', borderRadius: '12px' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>💬</div>
                <p style={{ fontSize: '13px', color: '#4A5568' }}>No discussions yet. Start one above.</p>
              </div>
            ) : data?.discussions?.map((d: any) => (
              <div key={d.id} style={{
                background: '#ffffff', borderRadius: '12px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                borderLeft: d.is_pinned ? '4px solid #0D7C66' : '4px solid #E2E8F0',
                overflow: 'hidden'
              }}>
                <button
                  onClick={() => setOpenDiscussion(openDiscussion === d.id ? null : d.id)}
                  style={{
                    width: '100%', textAlign: 'left', background: 'none',
                    border: 'none', padding: '16px 20px', cursor: 'pointer',
                    display: 'flex', alignItems: 'flex-start', gap: '12px'
                  }}
                >
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: avatarColor(d.author),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 700, color: '#fff', flexShrink: 0
                  }}>
                    {initials(d.author)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      {d.is_pinned && (
                        <span style={{ fontSize: '9px', background: '#0D7C66', color: '#fff', padding: '2px 6px', borderRadius: '3px', fontWeight: 700 }}>PINNED</span>
                      )}
                      <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1B2A4A' }}>{d.title}</h3>
                    </div>
                    <p style={{ fontSize: '11px', color: '#4A5568', lineHeight: 1.5, marginBottom: '6px' }}>
                      {d.body?.substring(0, 120)}{d.body?.length > 120 ? '...' : ''}
                    </p>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px', color: '#4A5568' }}>By {d.author}</span>
                      <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                        {new Date(d.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span style={{ fontSize: '10px', color: '#0D7C66', fontWeight: 600 }}>
                        💬 {d.reply_count || 0} replies
                      </span>
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', color: '#4A5568', flexShrink: 0 }}>
                    {openDiscussion === d.id ? '▲' : '▼'}
                  </span>
                </button>

                {openDiscussion === d.id && (
                  <div style={{ padding: '0 20px 16px', borderTop: '1px solid #F7F8FA' }}>
                    <p style={{ fontSize: '12px', color: '#4A5568', lineHeight: 1.7, margin: '14px 0' }}>{d.body}</p>
                    <div style={{ background: '#F7F8FA', borderRadius: '8px', padding: '10px 14px', marginBottom: '10px' }}>
                      <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>Reply to this discussion</p>
                      <textarea
                        placeholder="Type your reply..."
                        style={{
                          width: '100%', padding: '8px 12px', fontSize: '11px',
                          border: '1px solid #E2E8F0', borderRadius: '6px',
                          resize: 'none', height: '60px', color: '#1B2A4A',
                          outline: 'none', fontFamily: 'inherit', background: '#fff'
                        }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                        <button style={{ padding: '5px 14px', background: '#1B2A4A', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
