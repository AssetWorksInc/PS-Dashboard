'use client'

import { useEffect, useState } from 'react'

const TOPICS = [
  {
    id: 'visualize',
    label: 'Visualize Documentation',
    icon: '📊',
    description: 'Interactive diagrams, system maps, data flows, and visual guides for your AssetWorks environment.',
    color: '#2E86C1',
    bg: '#dbeafe',
    items: [
      { title: 'AiM System Architecture Diagram', type: 'diagram', updated: 'Jun 10, 2026' },
      { title: 'Work Order Workflow Map', type: 'diagram', updated: 'Jun 3, 2026' },
      { title: 'Space Utilization Data Flow', type: 'diagram', updated: 'May 28, 2026' },
      { title: 'Integration Topology — Banner & Kronos', type: 'diagram', updated: 'May 20, 2026' },
      { title: 'PM Schedule Hierarchy Visual', type: 'diagram', updated: 'May 15, 2026' },
    ]
  },
  {
    id: 'etl',
    label: 'ETL Guides',
    icon: '🔄',
    description: 'Data migration, transformation, and integration guides for connecting your systems to AiM.',
    color: '#0D7C66',
    bg: '#e6f4f1',
    items: [
      { title: 'Banner ERP to AiM Data Migration Guide', type: 'guide', updated: 'Jun 8, 2026' },
      { title: 'Active Directory Sync Configuration', type: 'guide', updated: 'Jun 1, 2026' },
      { title: 'Kronos Timekeeping Integration Setup', type: 'guide', updated: 'May 25, 2026' },
      { title: 'TouchNet Payment Gateway ETL', type: 'guide', updated: 'May 18, 2026' },
      { title: 'Data Validation & Quality Checks', type: 'guide', updated: 'May 10, 2026' },
    ]
  },
  {
    id: 'sops',
    label: 'SOPs & Implementation Resources',
    icon: '📋',
    description: 'Standard operating procedures, implementation checklists, and resources for your institution.',
    color: '#B7791F',
    bg: '#fef3c7',
    items: [
      { title: 'SOP: Emergency Work Order Escalation v3.1', type: 'sop', updated: 'Jun 3, 2026' },
      { title: 'SOP: New Hire System Onboarding', type: 'sop', updated: 'Mar 22, 2026' },
      { title: 'SOP: PM Schedule Management', type: 'sop', updated: 'May 1, 2026' },
      { title: 'AiM 12.3 Upgrade Readiness Checklist', type: 'checklist', updated: 'Jun 5, 2026' },
      { title: 'Go-Live Implementation Checklist', type: 'checklist', updated: 'Apr 15, 2026' },
    ]
  }
]

export default function KnowledgeBase() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTopic, setActiveTopic] = useState('visualize')
  const [search, setSearch] = useState('')
  const [openArticle, setOpenArticle] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/knowledge')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const currentTopic = TOPICS.find(t => t.id === activeTopic)!

  const filteredItems = currentTopic.items.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase())
  )

  const typeIcon = (type: string) => {
    if (type === 'diagram') return '🗺️'
    if (type === 'guide') return '📖'
    if (type === 'sop') return '📄'
    if (type === 'checklist') return '✅'
    return '📄'
  }

  const typeLabel = (type: string) => {
    if (type === 'diagram') return 'Diagram'
    if (type === 'guide') return 'Guide'
    if (type === 'sop') return 'SOP'
    if (type === 'checklist') return 'Checklist'
    return 'Article'
  }

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '80px' }}>
      <div style={{ fontSize: '32px' }}>⏳</div>
      <p style={{ color: '#4A5568', marginTop: '12px' }}>Loading knowledge base...</p>
    </div>
  )

  return (
    <div style={{ maxWidth: '960px' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#1B2A4A', marginBottom: '4px' }}>
          📚 Knowledge Base
        </h1>
        <p style={{ fontSize: '13px', color: '#4A5568' }}>
          Documentation, ETL guides, SOPs, and implementation resources
        </p>
      </div>

      {/* Search bar */}
      <div style={{ marginBottom: '24px', position: 'relative' }}>
        <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>
          🔍
        </span>
        <input
          type="text"
          placeholder="Search knowledge base..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px 12px 42px',
            fontSize: '13px',
            border: '1px solid #E2E8F0',
            borderRadius: '10px',
            background: '#ffffff',
            color: '#1B2A4A',
            outline: 'none',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
          }}
        />
      </div>

      {/* Topic selector cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', marginBottom: '28px' }}>
        {TOPICS.map(topic => (
          <button
            key={topic.id}
            onClick={() => { setActiveTopic(topic.id); setSearch(''); setOpenArticle(null) }}
            style={{
              textAlign: 'left',
              background: activeTopic === topic.id ? topic.bg : '#ffffff',
              border: `2px solid ${activeTopic === topic.id ? topic.color : '#E2E8F0'}`,
              borderRadius: '12px',
              padding: '18px',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '10px' }}>{topic.icon}</div>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1B2A4A', marginBottom: '6px', lineHeight: 1.4 }}>
              {topic.label}
            </h3>
            <p style={{ fontSize: '11px', color: '#4A5568', lineHeight: 1.6, marginBottom: '10px' }}>
              {topic.description}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: topic.color }}>
                {topic.items.length} resources
              </span>
              {activeTopic === topic.id && (
                <span style={{ fontSize: '9px', background: topic.color, color: '#fff', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  ACTIVE
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Active topic content */}
      <div style={{ background: '#ffffff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>

        {/* Topic header */}
        <div style={{
          padding: '16px 22px',
          background: currentTopic.bg,
          borderBottom: `2px solid ${currentTopic.color}`,
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '24px' }}>{currentTopic.icon}</span>
          <div>
            <h2 style={{ fontSize: '14px', fontWeight: 800, color: '#1B2A4A', marginBottom: '2px' }}>
              {currentTopic.label}
            </h2>
            <p style={{ fontSize: '11px', color: '#4A5568' }}>
              {filteredItems.length} {filteredItems.length === 1 ? 'resource' : 'resources'} found
            </p>
          </div>
        </div>

        {/* Resource list */}
        <div style={{ padding: '8px 0' }}>
          {filteredItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</div>
              <p style={{ fontSize: '13px', color: '#4A5568' }}>No results found for "{search}"</p>
              <button
                onClick={() => setSearch('')}
                style={{ marginTop: '12px', padding: '8px 16px', background: '#1B2A4A', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
              >
                Clear search
              </button>
            </div>
          ) : filteredItems.map((item, i) => (
            <div key={i}>
              <button
                onClick={() => setOpenArticle(openArticle === `${activeTopic}-${i}` ? null : `${activeTopic}-${i}`)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  borderBottom: '1px solid #F7F8FA',
                  padding: '14px 22px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#F7F8FA'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                {/* Type icon */}
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  background: currentTopic.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  flexShrink: 0
                }}>
                  {typeIcon(item.type)}
                </div>

                {/* Item info */}
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#1B2A4A', marginBottom: '3px' }}>
                    {item.title}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      fontSize: '9px',
                      padding: '2px 7px',
                      borderRadius: '4px',
                      fontWeight: 700,
                      background: currentTopic.bg,
                      color: currentTopic.color
                    }}>
                      {typeLabel(item.type).toUpperCase()}
                    </span>
                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                      Updated {item.updated}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <span style={{ fontSize: '11px', color: currentTopic.color, fontWeight: 600 }}>
                    View
                  </span>
                  <span style={{ fontSize: '12px', color: '#4A5568' }}>
                    {openArticle === `${activeTopic}-${i}` ? '▲' : '▼'}
                  </span>
                </div>
              </button>

              {/* Expanded article preview */}
              {openArticle === `${activeTopic}-${i}` && (
                <div style={{
                  padding: '16px 22px 16px 76px',
                  background: '#F7F8FA',
                  borderBottom: '1px solid #E2E8F0'
                }}>
                  <p style={{ fontSize: '12px', color: '#4A5568', lineHeight: 1.7, marginBottom: '12px' }}>
                    This {typeLabel(item.type).toLowerCase()} covers key procedures and best practices for Lakewood State University's AssetWorks environment. Last reviewed by the PS team on {item.updated}.
                  </p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button style={{
                      padding: '7px 16px',
                      background: currentTopic.color,
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}>
                      📄 Open Document
                    </button>
                    <button style={{
                      padding: '7px 16px',
                      background: '#ffffff',
                      color: '#4A5568',
                      border: '1px solid #E2E8F0',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}>
                      ⬇️ Download
                    </button>
                    <button style={{
                      padding: '7px 16px',
                      background: '#ffffff',
                      color: '#4A5568',
                      border: '1px solid #E2E8F0',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}>
                      🔗 Share Link
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 22px',
          borderTop: '1px solid #F7F8FA',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <p style={{ fontSize: '11px', color: '#94a3b8' }}>
            All resources maintained by your AssetWorks PS team
          </p>
          <button style={{
            padding: '7px 16px',
            background: '#1B2A4A',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            + Request a Resource
          </button>
        </div>
      </div>

      {/* DB articles section */}
      {data?.articles && data.articles.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 700, color: '#1B2A4A', marginBottom: '14px' }}>
            📰 Recently Added
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '12px' }}>
            {data.articles.slice(0, 4).map((a: any) => (
              <div key={a.id} style={{
                background: '#ffffff',
                borderRadius: '10px',
                padding: '14px 16px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                borderLeft: '3px solid #0D7C66'
              }}>
                <p style={{ fontSize: '12px', fontWeight: 600, color: '#1B2A4A', marginBottom: '4px' }}>
                  {a.title}
                </p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '9px', background: '#e6f4f1', color: '#0D7C66', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                    {a.type?.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '10px', color: '#94a3b8' }}>By {a.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
