'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Project {
  id: string
  name: string
  description: string
  health: string
  pct_complete: number
  pm_name: string
}

interface Announcement {
  id: string
  title: string
  body: string
  priority: string
  is_pinned: boolean
  author: string
  created_at: string
}

interface Milestone {
  id: string
  title: string
  due_date: string
  status: string
  owner: string
  description: string
}

interface Activity {
  id: string
  actor: string
  action: string
  target: string
  icon: string
  created_at: string
}

interface Appointment {
  id: string
  title: string
  consultant: string
  scheduled_at: string
  location: string
  session_type: string
}

interface DashboardData {
  projects: Project[]
  announcements: Announcement[]
  milestones: Milestone[]
  activity: Activity[]
  appointments: Appointment[]
}

export default function Dashboard() {
  const router = useRouter()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedAnnouncement, setExpandedAnnouncement] = useState<string | null>(null)
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null)
  const [expandedAppointment, setExpandedAppointment] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(d => {
        setData(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const healthColor = (health: string) => {
    if (health === 'green') return '#276749'
    if (health === 'amber') return '#B7791F'
    return '#C53030'
  }

  const healthLabel = (health: string) => {
    if (health === 'green') return 'On Track'
    if (health === 'amber') return 'At Risk'
    return 'Critical'
  }

  if (loading) return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '60vh'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>⏳</div>
        <p style={{ color: 'var(--slate)', fontSize: '13px' }}>Loading dashboard...</p>
      </div>
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{
          fontSize: '22px',
          fontWeight: 800,
          color: 'var(--navy)',
          marginBottom: '4px'
        }}>
          Good morning, Lakewood State 👋
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--slate)' }}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      {/* Announcements */}
      {data?.announcements && data.announcements.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{
            fontSize: '13px',
            fontWeight: 700,
            color: 'var(--navy)',
            marginBottom: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            📢 Announcements
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {data.announcements.map(a => (
              <div
                key={a.id}
                onClick={() => setExpandedAnnouncement(
                  expandedAnnouncement === a.id ? null : a.id
                )}
                style={{
                  background: 'var(--white)',
                  borderRadius: '10px',
                  padding: '14px 18px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                  borderLeft: `4px solid ${a.priority === 'high' ? 'var(--red)' : 'var(--teal)'}`,
                  cursor: 'pointer',
                  transition: 'box-shadow 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)')}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    {a.is_pinned && (
                      <span style={{
                        fontSize: '9px',
                        background: 'var(--teal)',
                        color: '#fff',
                        padding: '2px 7px',
                        borderRadius: '4px',
                        fontWeight: 700
                      }}>
                        PINNED
                      </span>
                    )}
                    {a.priority === 'high' && (
                      <span style={{
                        fontSize: '9px',
                        background: '#fef2f2',
                        color: 'var(--red)',
                        padding: '2px 7px',
                        borderRadius: '4px',
                        fontWeight: 700,
                        border: '1px solid #fecaca'
                      }}>
                        ACTION NEEDED
                      </span>
                    )}
                    <h3 style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: 'var(--navy)'
                    }}>
                      {a.title}
                    </h3>
                  </div>
                  <span style={{
                    fontSize: '16px',
                    color: 'var(--slate)',
                    transition: 'transform 0.2s',
                    transform: expandedAnnouncement === a.id ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}>
                    ▾
                  </span>
                </div>

                {/* Expanded details */}
                {expandedAnnouncement === a.id && (
                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--ltgray)' }}>
                    <p style={{
                      fontSize: '12px',
                      color: 'var(--slate)',
                      lineHeight: 1.7,
                      marginBottom: '8px'
                    }}>
                      {a.body}
                    </p>
                    <p style={{ fontSize: '10px', color: '#94a3b8' }}>
                      Posted by {a.author} · {new Date(a.created_at).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KPI Cards — clickable */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '14px',
        marginBottom: '24px'
      }}>
        {/* Active Projects → Project Center */}
        <div
          onClick={() => router.push('/projects')}
          style={{
            background: 'var(--white)',
            borderRadius: '10px',
            padding: '18px 20px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            borderTop: '3px solid var(--teal)',
            cursor: 'pointer',
            transition: 'all 0.15s'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <div style={{ fontSize: '11px', color: 'var(--slate)', marginBottom: '6px' }}>
            Active Projects
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--navy)' }}>
            {data?.projects?.length || 0}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--teal)', marginTop: '6px', fontWeight: 600 }}>
            View all →
          </div>
        </div>

        {/* Milestones → scrolls to milestones section */}
        <div
          onClick={() => document.getElementById('milestones-section')?.scrollIntoView({ behavior: 'smooth' })}
          style={{
            background: 'var(--white)',
            borderRadius: '10px',
            padding: '18px 20px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            borderTop: '3px solid var(--blue)',
            cursor: 'pointer',
            transition: 'all 0.15s'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <div style={{ fontSize: '11px', color: 'var(--slate)', marginBottom: '6px' }}>
            Upcoming Milestones
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--navy)' }}>
            {data?.milestones?.length || 0}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--blue)', marginTop: '6px', fontWeight: 600 }}>
            View all →
          </div>
        </div>

        {/* Next Appointment → scrolls to appointments */}
        <div
          onClick={() => document.getElementById('appointments-section')?.scrollIntoView({ behavior: 'smooth' })}
          style={{
            background: 'var(--white)',
            borderRadius: '10px',
            padding: '18px 20px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            borderTop: '3px solid var(--green)',
            cursor: 'pointer',
            transition: 'all 0.15s'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <div style={{ fontSize: '11px', color: 'var(--slate)', marginBottom: '6px' }}>
            Next Appointment
          </div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy)', marginTop: '4px' }}>
            {data?.appointments?.[0]
              ? new Date(data.appointments[0].scheduled_at).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric'
                })
              : 'None scheduled'}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--slate)', marginTop: '2px' }}>
            {data?.appointments?.[0]?.title || ''}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--green)', marginTop: '6px', fontWeight: 600 }}>
            View all →
          </div>
        </div>
      </div>

      {/* 2 column layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '24px'
      }}>
        {/* Active Projects */}
        <div style={{
          background: 'var(--white)',
          borderRadius: '10px',
          padding: '18px 20px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{
            fontSize: '13px',
            fontWeight: 700,
            color: 'var(--navy)',
            marginBottom: '14px'
          }}>
            📂 Active Projects
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {data?.projects?.map(p => (
              <div
                key={p.id}
                onClick={() => router.push('/projects')}
                style={{
                  borderLeft: `3px solid ${healthColor(p.health)}`,
                  paddingLeft: '12px',
                  cursor: 'pointer',
                  transition: 'opacity 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start'
                }}>
                  <h3 style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'var(--navy)',
                    marginBottom: '4px',
                    lineHeight: 1.4
                  }}>
                    {p.name}
                  </h3>
                  <span style={{
                    fontSize: '9px',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontWeight: 700,
                    background: p.health === 'green' ? '#d1fae5' : p.health === 'amber' ? '#fef3c7' : '#fef2f2',
                    color: healthColor(p.health),
                    whiteSpace: 'nowrap',
                    marginLeft: '8px'
                  }}>
                    {healthLabel(p.health)}
                  </span>
                </div>
                <p style={{ fontSize: '10px', color: 'var(--slate)', marginBottom: '6px' }}>
                  PM: {p.pm_name}
                </p>
                <div style={{
                  height: '6px',
                  background: 'var(--ltgray)',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${p.pct_complete}%`,
                    background: healthColor(p.health),
                    borderRadius: '3px'
                  }} />
                </div>
                <p style={{ fontSize: '10px', color: 'var(--slate)', marginTop: '4px' }}>
                  {p.pct_complete}% complete
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones — clickable to expand */}
        <div
          id="milestones-section"
          style={{
            background: 'var(--white)',
            borderRadius: '10px',
            padding: '18px 20px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
          }}
        >
          <h2 style={{
            fontSize: '13px',
            fontWeight: 700,
            color: 'var(--navy)',
            marginBottom: '14px'
          }}>
            🎯 Upcoming Milestones
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {data?.milestones?.map(m => (
              <div key={m.id}>
                <div
                  onClick={() => setExpandedMilestone(
                    expandedMilestone === m.id ? null : m.id
                  )}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '8px',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--ltgray)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    background: 'var(--ltgray)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <div style={{
                      fontSize: '9px',
                      color: 'var(--teal)',
                      fontWeight: 700
                    }}>
                      {new Date(m.due_date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: 800,
                      color: 'var(--navy)'
                    }}>
                      {new Date(m.due_date).getDate()}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--navy)',
                      marginBottom: '2px'
                    }}>
                      {m.title}
                    </h3>
                    <p style={{ fontSize: '10px', color: 'var(--slate)' }}>
                      {m.owner}
                    </p>
                  </div>
                  <span style={{
                    fontSize: '14px',
                    color: 'var(--slate)',
                    transition: 'transform 0.2s',
                    transform: expandedMilestone === m.id ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}>
                    ▾
                  </span>
                </div>

                {/* Milestone expanded detail */}
                {expandedMilestone === m.id && (
                  <div style={{
                    margin: '4px 8px 8px 60px',
                    padding: '10px 12px',
                    background: 'var(--ltgray)',
                    borderRadius: '8px',
                    borderLeft: '3px solid var(--teal)'
                  }}>
                    <p style={{ fontSize: '11px', color: 'var(--slate)', lineHeight: 1.6 }}>
                      {m.description || 'No additional details available for this milestone.'}
                    </p>
                    <div style={{
                      display: 'flex',
                      gap: '16px',
                      marginTop: '8px'
                    }}>
                      <div>
                        <p style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Due Date</p>
                        <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--navy)' }}>
                          {new Date(m.due_date).toLocaleDateString('en-US', {
                            month: 'long', day: 'numeric', year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Owner</p>
                        <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--navy)' }}>{m.owner}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</p>
                        <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--teal)' }}>{m.status}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Feed — clickable to Project Center */}
      <div style={{
        background: 'var(--white)',
        borderRadius: '10px',
        padding: '18px 20px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        marginBottom: '24px'
      }}>
        <h2 style={{
          fontSize: '13px',
          fontWeight: 700,
          color: 'var(--navy)',
          marginBottom: '14px'
        }}>
          ⚡ Recent Activity
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {data?.activity?.map(a => (
            <div
              key={a.id}
              onClick={() => router.push('/projects')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 8px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background 0.15s',
                borderBottom: '1px solid var(--ltgray)'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--ltgray)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--teal-lt)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                flexShrink: 0
              }}>
                {a.icon}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '12px', color: 'var(--dkgray)' }}>
                  <strong>{a.actor}</strong> {a.action} <strong>{a.target}</strong>
                </p>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{ fontSize: '10px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                  {new Date(a.created_at).toLocaleDateString()}
                </div>
                <span style={{ fontSize: '12px', color: 'var(--teal)' }}>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Appointments — expandable */}
      <div
        id="appointments-section"
        style={{
          background: 'var(--white)',
          borderRadius: '10px',
          padding: '18px 20px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
        }}
      >
        <h2 style={{
          fontSize: '13px',
          fontWeight: 700,
          color: 'var(--navy)',
          marginBottom: '14px'
        }}>
          📅 Upcoming Appointments
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {data?.appointments?.map(a => (
            <div key={a.id}>
              <div
                onClick={() => setExpandedAppointment(
                  expandedAppointment === a.id ? null : a.id
                )}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px 14px',
                  background: 'var(--ltgray)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--ltgray)'}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: 'var(--navy)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <div style={{ fontSize: '9px', color: 'var(--teal)', fontWeight: 700 }}>
                    {new Date(a.scheduled_at).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>
                    {new Date(a.scheduled_at).getDate()}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'var(--navy)',
                    marginBottom: '2px'
                  }}>
                    {a.title}
                  </h3>
                  <p style={{ fontSize: '10px', color: 'var(--slate)' }}>
                    {a.consultant} · {a.location}
                  </p>
                </div>
                <span style={{
                  fontSize: '14px',
                  color: 'var(--slate)',
                  transition: 'transform 0.2s',
                  transform: expandedAppointment === a.id ? 'rotate(180deg)' : 'rotate(0deg)'
                }}>
                  ▾
                </span>
              </div>

              {/* Appointment expanded detail */}
              {expandedAppointment === a.id && (
                <div style={{
                  margin: '4px 0 4px 54px',
                  padding: '12px 14px',
                  background: '#fff',
                  border: '1px solid var(--midgray)',
                  borderRadius: '8px'
                }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '12px'
                  }}>
                    <div>
                      <p style={{
                        fontSize: '9px',
                        color: '#94a3b8',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '3px'
                      }}>
                        Date & Time
                      </p>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--navy)' }}>
                        {new Date(a.scheduled_at).toLocaleDateString('en-US', {
                          month: 'long', day: 'numeric', year: 'numeric'
                        })}
                      </p>
                      <p style={{ fontSize: '11px', color: 'var(--slate)' }}>
                        {new Date(a.scheduled_at).toLocaleTimeString('en-US', {
                          hour: 'numeric', minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div>
                      <p style={{
                        fontSize: '9px',
                        color: '#94a3b8',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '3px'
                      }}>
                        Consultant
                      </p>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--navy)' }}>
                        {a.consultant}
                      </p>
                    </div>
                    <div>
                      <p style={{
                        fontSize: '9px',
                        color: '#94a3b8',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        marginBottom: '3px'
                      }}>
                        Location
                      </p>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--navy)' }}>
                        {a.location}
                      </p>
                    </div>
                  </div>
                  <div style={{
                    marginTop: '12px',
                    paddingTop: '10px',
                    borderTop: '1px solid var(--ltgray)',
                    display: 'flex',
                    gap: '10px'
                  }}>
                    <button
                      onClick={e => { e.stopPropagation() }}
                      style={{
                        padding: '6px 14px',
                        background: 'var(--teal)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Join Meeting
                    </button>
                    <button
                      onClick={e => { e.stopPropagation() }}
                      style={{
                        padding: '6px 14px',
                        background: 'var(--white)',
                        color: 'var(--slate)',
                        border: '1px solid var(--midgray)',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Reschedule
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
