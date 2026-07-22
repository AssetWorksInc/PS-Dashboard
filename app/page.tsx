'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [openAnnouncement, setOpenAnnouncement] = useState<string | null>(null)
  const [openMilestone, setOpenMilestone] = useState<string | null>(null)
  const [openAppointment, setOpenAppointment] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px' }}>
      <div style={{ fontSize: '32px' }}>⏳</div>
      <p style={{ color: '#4A5568', marginTop: '12px' }}>Loading dashboard...</p>
    </div>
  )

  const hColor = (h: string) => h === 'green' ? '#276749' : h === 'amber' ? '#B7791F' : '#C53030'
  const hBg = (h: string) => h === 'green' ? '#d1fae5' : h === 'amber' ? '#fef3c7' : '#fef2f2'
  const hLabel = (h: string) => h === 'green' ? 'On Track' : h === 'amber' ? 'At Risk' : 'Critical'

  return (
    <div style={{ maxWidth: '900px' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1B2A4A', marginBottom: '4px' }}>
          Good morning, Lakewood State 👋
        </h1>
        <p style={{ fontSize: '13px', color: '#4A5568' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Announcements */}
      <div style={{ marginBottom: '24px' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, color: '#4A5568', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
          📢 Announcements
        </p>
        {data?.announcements?.map((a: any) => (
          <div key={a.id} style={{ marginBottom: '8px' }}>
            <button
              onClick={() => setOpenAnnouncement(openAnnouncement === a.id ? null : a.id)}
              style={{
                width: '100%', textAlign: 'left', background: '#ffffff',
                border: 'none', borderLeft: `4px solid ${a.priority === 'high' ? '#C53030' : '#0D7C66'}`,
                borderRadius: '10px', padding: '14px 18px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                {a.priority === 'high' && (
                  <span style={{ fontSize: '9px', background: '#fef2f2', color: '#C53030', padding: '2px 7px', borderRadius: '4px', fontWeight: 700, border: '1px solid #fecaca', whiteSpace: 'nowrap' }}>
                    ACTION NEEDED
                  </span>
                )}
                {a.is_pinned && (
                  <span style={{ fontSize: '9px', background: '#0D7C66', color: '#fff', padding: '2px 7px', borderRadius: '4px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                    PINNED
                  </span>
                )}
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#1B2A4A' }}>{a.title}</span>
              </div>
              <span style={{ fontSize: '12px', color: '#4A5568', flexShrink: 0 }}>
                {openAnnouncement === a.id ? '▲' : '▼'}
              </span>
            </button>
            {openAnnouncement === a.id && (
              <div style={{ background: '#ffffff', borderRadius: '0 0 10px 10px', padding: '14px 18px', boxShadow: '0 2px 6px rgba(0,0,0,0.06)', borderTop: '1px solid #F7F8FA' }}>
                <p style={{ fontSize: '12px', color: '#4A5568', lineHeight: 1.7, marginBottom: '8px' }}>{a.body}</p>
                <p style={{ fontSize: '10px', color: '#94a3b8' }}>
                  By {a.author} · {new Date(a.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', marginBottom: '24px' }}>
        <button
          onClick={() => router.push('/projects')}
          style={{ background: '#ffffff', border: 'none', borderTop: '3px solid #0D7C66', borderRadius: '10px', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', cursor: 'pointer', textAlign: 'left' }}
        >
          <div style={{ fontSize: '11px', color: '#4A5568', marginBottom: '6px' }}>Active Projects</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#1B2A4A' }}>{data?.projects?.length || 0}</div>
          <div style={{ fontSize: '10px', color: '#0D7C66', marginTop: '6px', fontWeight: 600 }}>View all →</div>
        </button>
        <button
          onClick={() => document.getElementById('milestones')?.scrollIntoView({ behavior: 'smooth' })}
          style={{ background: '#ffffff', border: 'none', borderTop: '3px solid #2E86C1', borderRadius: '10px', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', cursor: 'pointer', textAlign: 'left' }}
        >
          <div style={{ fontSize: '11px', color: '#4A5568', marginBottom: '6px' }}>Upcoming Milestones</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#1B2A4A' }}>{data?.milestones?.length || 0}</div>
          <div style={{ fontSize: '10px', color: '#2E86C1', marginTop: '6px', fontWeight: 600 }}>View all →</div>
        </button>
        <button
          onClick={() => document.getElementById('appointments')?.scrollIntoView({ behavior: 'smooth' })}
          style={{ background: '#ffffff', border: 'none', borderTop: '3px solid #276749', borderRadius: '10px', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', cursor: 'pointer', textAlign: 'left' }}
        >
          <div style={{ fontSize: '11px', color: '#4A5568', marginBottom: '6px' }}>Next Appointment</div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#1B2A4A', marginTop: '4px' }}>
            {data?.appointments?.[0] ? new Date(data.appointments[0].scheduled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'None'}
          </div>
          <div style={{ fontSize: '10px', color: '#4A5568', marginTop: '2px' }}>{data?.appointments?.[0]?.title || ''}</div>
          <div style={{ fontSize: '10px', color: '#276749', marginTop: '6px', fontWeight: 600 }}>View all →</div>
        </button>
      </div>

      {/* 2 column row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>

        {/* Projects */}
        <div style={{ background: '#ffffff', borderRadius: '10px', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#1B2A4A', marginBottom: '14px' }}>📂 Active Projects</h2>
          {data?.projects?.map((p: any) => (
            <button
              key={p.id}
              onClick={() => router.push('/projects')}
              style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', borderLeft: `3px solid ${hColor(p.health)}`, paddingLeft: '12px', marginBottom: '14px', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#1B2A4A', lineHeight: 1.4, paddingRight: '8px' }}>{p.name}</span>
                <span style={{ fontSize: '9px', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, background: hBg(p.health), color: hColor(p.health), whiteSpace: 'nowrap' }}>
                  {hLabel(p.health)}
                </span>
              </div>
              <p style={{ fontSize: '10px', color: '#4A5568', marginBottom: '6px' }}>PM: {p.pm_name}</p>
              <div style={{ height: '6px', background: '#F7F8FA', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${p.pct_complete}%`, background: hColor(p.health), borderRadius: '3px' }} />
              </div>
              <p style={{ fontSize: '10px', color: '#4A5568', marginTop: '4px' }}>{p.pct_complete}% complete</p>
            </button>
          ))}
        </div>

        {/* Milestones */}
        <div id="milestones" style={{ background: '#ffffff', borderRadius: '10px', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#1B2A4A', marginBottom: '14px' }}>🎯 Upcoming Milestones</h2>
          {data?.milestones?.map((m: any) => (
            <div key={m.id} style={{ marginBottom: '6px' }}>
              <button
                onClick={() => setOpenMilestone(openMilestone === m.id ? null : m.id)}
                style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#F7F8FA', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <div style={{ fontSize: '9px', color: '#0D7C66', fontWeight: 700 }}>
                    {new Date(m.due_date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#1B2A4A' }}>
                    {new Date(m.due_date).getDate()}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#1B2A4A', marginBottom: '2px' }}>{m.title}</p>
                  <p style={{ fontSize: '10px', color: '#4A5568' }}>{m.owner}</p>
                </div>
                <span style={{ fontSize: '12px', color: '#4A5568' }}>{openMilestone === m.id ? '▲' : '▼'}</span>
              </button>
              {openMilestone === m.id && (
                <div style={{ margin: '4px 8px 8px 60px', padding: '10px 12px', background: '#F7F8FA', borderRadius: '8px', borderLeft: '3px solid #0D7C66' }}>
                  <p style={{ fontSize: '11px', color: '#4A5568', lineHeight: 1.6, marginBottom: '8px' }}>
                    {m.description || 'No additional details available.'}
                  </p>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div>
                      <p style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Due Date</p>
                      <p style={{ fontSize: '11px', fontWeight: 600, color: '#1B2A4A' }}>
                        {new Date(m.due_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Owner</p>
                      <p style={{ fontSize: '11px', fontWeight: 600, color: '#1B2A4A' }}>{m.owner}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</p>
                      <p style={{ fontSize: '11px', fontWeight: 600, color: '#0D7C66' }}>{m.status}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Activity Feed */}
      <div style={{ background: '#ffffff', borderRadius: '10px', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#1B2A4A', marginBottom: '14px' }}>⚡ Recent Activity</h2>
        {data?.activity?.map((a: any) => (
          <button
            key={a.id}
            onClick={() => router.push('/projects')}
            style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 8px', borderRadius: '8px', cursor: 'pointer', borderBottom: '1px solid #F7F8FA' }}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e6f4f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
              {a.icon}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '12px', color: '#2D3748' }}>
                <strong>{a.actor}</strong> {a.action} <strong>{a.target}</strong>
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '10px', color: '#94a3b8' }}>{new Date(a.created_at).toLocaleDateString()}</span>
              <span style={{ fontSize: '12px', color: '#0D7C66' }}>→</span>
            </div>
          </button>
        ))}
      </div>

      {/* Appointments */}
      <div id="appointments" style={{ background: '#ffffff', borderRadius: '10px', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#1B2A4A', marginBottom: '14px' }}>📅 Upcoming Appointments</h2>
        {data?.appointments?.map((a: any) => (
          <div key={a.id} style={{ marginBottom: '10px' }}>
            <button
              onClick={() => setOpenAppointment(openAppointment === a.id ? null : a.id)}
              style={{ width: '100%', textAlign: 'left', background: '#F7F8FA', border: 'none', borderRadius: '8px', padding: '12px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px' }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#1B2A4A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{ fontSize: '9px', color: '#0D7C66', fontWeight: 700 }}>
                  {new Date(a.scheduled_at).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>
                  {new Date(a.scheduled_at).getDate()}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#1B2A4A', marginBottom: '2px' }}>{a.title}</p>
                <p style={{ fontSize: '10px', color: '#4A5568' }}>{a.consultant} · {a.location}</p>
              </div>
              <span style={{ fontSize: '12px', color: '#4A5568' }}>{openAppointment === a.id ? '▲' : '▼'}</span>
            </button>
            {openAppointment === a.id && (
              <div style={{ background: '#ffffff', border: '1px solid #E2E8F0', borderRadius: '0 0 8px 8px', padding: '14px 18px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <p style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>Date & Time</p>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#1B2A4A' }}>
                      {new Date(a.scheduled_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p style={{ fontSize: '11px', color: '#4A5568' }}>
                      {new Date(a.scheduled_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>Consultant</p>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#1B2A4A' }}>{a.consultant}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>Location</p>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#1B2A4A' }}>{a.location}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', paddingTop: '10px', borderTop: '1px solid #F7F8FA' }}>
                  <button
                    onClick={e => e.stopPropagation()}
                    style={{ padding: '6px 14px', background: '#0D7C66', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Join Meeting
                  </button>
                  <button
                    onClick={e => e.stopPropagation()}
                    style={{ padding: '6px 14px', background: '#ffffff', color: '#4A5568', border: '1px solid #E2E8F0', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
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
  )
}
