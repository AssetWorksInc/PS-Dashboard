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
      .then(res => res.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px' }}>
      <div style={{ fontSize: '32px' }}>⏳</div>
      <p style={{ color: 'var(--slate)', marginTop: '12px' }}>Loading...</p>
    </div>
  )

  const healthColor = (h: string) =>
    h === 'green' ? '#276749' : h === 'amber' ? '#B7791F' : '#C53030'

  const healthLabel = (h: string) =>
    h === 'green' ? 'On Track' : h === 'amber' ? 'At Risk' : 'Critical'

  const healthBg = (h: string) =>
    h === 'green' ? '#d1fae5' : h === 'amber' ? '#fef3c7' : '#fef2f2'

  return (
    <div style={{ maxWidth: '900px' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--navy)', marginBottom: '4px' }}>
          Good morning, Lakewood State 👋
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--slate)' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* ── ANNOUNCEMENTS ── */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '11px', fontWeight: 700, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
          📢 Announcements
        </h2>
        {data?.announcements?.map((a: any) => (
          <div key={a.id} style={{ marginBottom: '8px' }}>
            <button
              onClick={() => setOpenAnnouncement(openAnnouncement === a.id ? null : a.id)}
              style={{
                width: '100%',
                textAlign: 'left',
                background: 'var(--white)',
                border: 'none',
                borderLeft: `4px solid ${a.priority === 'high' ? 'var(--red)' : 'var(--teal)'}`,
                borderRadius: '10px',
                padding: '14px 18px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {a.priority === 'high' && (
                  <span style={{ fontSize: '9px', background: '#fef2f2', color: 'var(--red)', padding: '2px 7px', borderRadius: '4px', fontWeight: 700, border: '1px solid #fecaca' }}>
                    ACTION NEEDED
                  </span>
                )}
                {a.is_pinned && (
                  <span style={{ fontSize: '9px', background: 'var(--teal)', color: '#fff', padding: '2px 7px', borderRadius: '4px', fontWeight: 700 }}>
                    PINNED
                  </span>
                )}
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy)' }}>
                  {a.title}
                </span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--slate)', transform: openAnnouncement === a.id ? 'rotate(180deg)' : 'none', display: 'inline-block', transition: 'transform 0.2s' }}>
                ▾
              </span>
            </button>
            {openAnnouncement === a.id && (
              <div style={{ background: 'var(--white)', borderRadius: '0 0 10px 10px', padding: '14px 18px', marginTop: '-4px', boxShadow: '0 2px 6px rgba(0,0,0,0.06)', borderTop: '1px solid var(--ltgray)' }}>
                <p style={{ fontSize: '12px', color: 'var(--slate)', lineHeight: 1.7, marginBottom: '8px' }}>{a.body}</p>
                <p style={{ fontSize: '10px', color: '#94a3b8' }}>By {a.author} · {new Date(a.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── KPI CARDS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', marginBottom: '24px' }}>
        <button
          onClick={() => router.push('/projects')}
          style={{ background: 'var(--white)', border: 'none', borderTop: '3px solid var(--teal)', borderRadius: '10px', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', cursor: 'pointer', textAlign: 'left' }}
        >
          <div style={{ fontSize: '11px', color: 'var(--slate)', marginBottom: '6px' }}>Active Projects</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--navy)' }}>{data?.projects?.length || 0}</div>
          <div style={{ fontSize: '10px', color: 'var(--teal)', marginTop: '6px', fontWeight: 600 }}>View all →</div>
        </button>

        <button
          onClick={() => document.getElementById('milestones')?.scrollIntoView({ behavior: 'smooth' })}
          style={{ background: 'var(--white)', border: 'none', borderTop: '3px solid var(--blue)', borderRadius: '10px', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', cursor: 'pointer', textAlign: 'left' }}
        >
          <div style={{ fontSize: '11px', color: 'var(--slate)', marginBottom: '6px' }}>Upcoming Milestones</div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--navy)' }}>{data?.milestones?.length || 0}</div>
          <div style={{ fontSize: '10px', color: 'var(--blue)', marginTop: '6px', fontWeight: 600 }}>View all →</div>
        </button>

        <button
          onClick={() => document.getElementById('appointments')?.scrollIntoView({ behavior: 'smooth' })}
          style={{ background: 'var(--white)', border: 'none', borderTop: '3px solid var(--green)', borderRadius: '10px', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', cursor: 'pointer', textAlign: 'left' }}
        >
          <div style={{ fontSize: '11px', color: 'var(--slate)', marginBottom: '6px' }}>Next Appointment</div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy)', marginTop: '4px' }}>
            {data?.appointments?.[0] ? new Date(data.appointments[0].scheduled_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'None'}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--slate)', marginTop: '2px' }}>{data?.appointments?.[0]?.title || ''}</div>
          <div style={{ fontSize: '10px', color: 'var(--green)', marginTop: '6px', fontWeight: 600 }}>View all →</div>
        </button>
      </div>

      {/* ── 2 COLUMN ROW ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>

        {/* Active Projects */}
        <div style={{ background: 'var(--white)', borderRadius: '10px', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy)', marginBottom: '14px' }}>📂 Active Projects</h2>
          {data?.projects?.map((p: any) => (
            <button
              key={p.id}
              onClick={() => router.push('/projects')}
              style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', borderLeft: `3px solid ${healthColor(p.health)}`, paddingLeft: '12px', marginBottom: '14px', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--navy)', lineHeight: 1.4 }}>{p.name}</span>
                <span style={{ fontSize: '9px', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, background: healthBg(p.health), color: healthColor(p.health), whiteSpace: 'nowrap', marginLeft: '8px' }}>
                  {healthLabel(p.health)}
                </span>
              </div>
              <p style={{ fontSize: '10px', color: 'var(--slate)', marginBottom: '6px' }}>PM: {p.pm_name}</p>
              <div style={{ height: '6px', background: 'var(--ltgray)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${p.pct_complete}%`, background: healthColor(p.health), borderRadius: '3px' }} />
              </div>
              <p style={{ fontSize: '10px', color: 'var(--slate)', marginTop: '4px' }}>{p.pct_complete}% complete</p>
            </button>
          ))}
        </div>

        {/* Milestones */}
        <div id="milestones" style={{ background: 'var(--white)', borderRadius: '10px', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy)', marginBottom: '14px' }}>🎯 Upcoming Milestones</h2>
          {data?.milestones?.map((m: any) => (
            <div key={m.id} style={{ marginBottom: '8px' }}>
              <button
                onClick={() => setOpenMilestone(openMilestone === m.id ? null : m.id)}
                style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--ltgray)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <div style={{ fontSize: '9px', color: 'var(--teal)', fontWeight: 700 }}>
                    {new Date(m.due_date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--navy)' }}>
                    {new Date(m.due_date).getDate()}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--navy)', marginBottom: '2px' }}>{m.title}</p>
                  <p style={{ fontSize: '10px', color: 'var(--slate)' }}>{m.owner}</p>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--slate)', display: 'inline-block', transition: 'transform 0.2s', transform: openMilestone === m.id ? 'rotate(180deg)' : 'none' }}>▾</span>
              </button>
              {openMilestone === m.id && (
                <div style={{ margin: '4px 8px 8px 60px', padding: '10px 12px', background: 'var(--ltgray)', borderRadius: '8px', borderLeft: '3px solid var(--teal)' }}>
                  <p style={{ fontSize: '11px', color: 'var(--slate)', lineHeight: 1.6, marginBottom: '8px' }}>
                    {m.description || 'No additional details available.'}
                  </p>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div>
                      <p style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Due Date</p>
                      <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--navy)' }}>
                        {new Date(m.due_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
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

      {/* ── ACTIVITY FEED ── */}
      <div style={{ background: 'var(--white)', borderRadius: '10px', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy)', marginBottom: '14px' }}>⚡ Recent Activity</h2>
        {data?.activity?.map((a: any) => (
          <button
            key={a.id}
            onClick={() => router.push('/projects')}
            style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 8px', borderRadius: '8px', cursor: 'pointer', borderBottom: '1px solid var(--ltgray)' }}
          >
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--teal-lt)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>
              {a.icon}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '12px', color: 'var(--dkgray)' }}>
                <strong>{a.actor}</strong> {a.action} <strong>{a.target}</strong>
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '10px', color: '#94a3b8' }}>{new Date(a.created_at).toLocaleDateString()}</span>
              <span style={{ fontSize: '12px', color: 'var(--teal)' }}>→</span>
            </div>
          </button>
        ))}
      </div>

      {/* ── APPOINTMENTS ── */}
      <div id="appointments" style={{ background: 'var(--white)', borderRadius: '10px', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy)', marginBottom: '14px' }}>📅 Upcoming Appointments</h2>
        {data?.appointments?.map((a: any) => (
          <div key={a.id} style={{ marginBottom: '10px' }}>
            <button
              onClick={() => setOpenAppointment(openAppointment === a.id ? null : a.id)}
              style={{ width: '100%', textAlign: 'left', background: 'var(--ltgray)', border: 'none', borderRadius: '8px', padding: '12px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px' }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--navy)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{ fontSize: '9px', color: 'var(--teal)', fontWeight: 700 }}>
                  {new Date(a.scheduled_at).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>
                  {new Date(a.scheduled_at).getDate()}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--navy)', marginBottom: '2px' }}>{a.title}</p>
                <p style={{ fontSize: '10px', color: 'var(--slate)' }}>{a.consultant} · {a.location}</p>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--slate)', display: 'inline-block', transition: 'transform 0.2s', transform: openAppointment === a.id ? 'rotate(180deg)' : 'none' }}>▾</span>
            </button>
            {openAppointment === a.id && (
              <div style={{ background: 'var(--white)', border: '1px solid var(--midgray)', borderRadius: '0 0 8px 8px', padding: '14px 18px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <p style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>Date & Time</p>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--navy)' }}>
                      {new Date(a.scheduled_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p style={{ fontSize: '11px', color: 'var(--slate)' }}>
                      {new Date(a.scheduled_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>Consultant</p>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--navy)' }}>{a.consultant}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>Location</p>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--navy)' }}>{a.location}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', paddingTop: '10px', borderTop: '1px solid var(--ltgray)' }}>
                  <button
                    onClick={e => e.stopPropagation()}
                    style={{ padding: '6px 14px', background: 'var(--teal)', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Join Meeting
                  </button>
                  <button
                    onClick={e => e.stopPropagation()}
                    style={{ padding: '6px 14px', background: 'var(--white)', color: 'var(--slate)', border: '1px solid var(--midgray)', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
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
