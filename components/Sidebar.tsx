'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Dashboard', href: '/', icon: '📊' },
  { label: 'Project Center', href: '/projects', icon: '📂' },
  { label: 'Knowledge Base', href: '/knowledge', icon: '📚' },
  { label: 'Training & Learning', href: '/training', icon: '🎓' },
  { label: 'Collaboration Hub', href: '/collaboration', icon: '🤝' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside style={{
      width: '240px',
      minWidth: '240px',
      background: 'var(--navy)',
      height: '100vh',
      position: 'sticky',
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto'
    }}>
      {/* Logo */}
      <div style={{
        padding: '24px 20px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.07)'
      }}>
        <div style={{
          fontSize: '9px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: '#14b8a6',
          fontWeight: 700,
          marginBottom: '4px'
        }}>
          PS Portal
        </div>
        <h2 style={{
          fontSize: '14px',
          fontWeight: 800,
          color: '#f1f5f9',
          lineHeight: 1.35
        }}>
          AssetWorks
        </h2>
        <p style={{
          fontSize: '10px',
          color: '#475569',
          marginTop: '3px'
        }}>
          Professional Services
        </p>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '12px 0' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 20px',
                fontSize: '12px',
                color: isActive ? '#f1f5f9' : '#64748b',
                background: isActive ? 'rgba(13,124,102,0.2)' : 'transparent',
                borderLeft: isActive ? '3px solid #0D7C66' : '3px solid transparent',
                textDecoration: 'none',
                transition: 'all 0.15s'
              }}
            >
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div style={{
        padding: '14px 20px',
        borderTop: '1px solid rgba(255,255,255,0.07)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--teal)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 700,
            color: '#fff',
            flexShrink: 0
          }}>
            LS
          </div>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#f1f5f9' }}>
              Lakewood State
            </div>
            <div style={{ fontSize: '9px', color: '#475569' }}>
              Full-Service Tier
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
