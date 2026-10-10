import type { CSSProperties } from 'react'

interface ScenarioOption {
  id: string
  title: string
  description: string
  onClick: () => void
}

interface ScenarioSelectorProps {
  scenarios: ScenarioOption[]
}

export default function ScenarioSelector({ scenarios }: ScenarioSelectorProps) {
  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    animation: 'fadeSlideIn 0.6s ease forwards',
    opacity: 0,
  }

  const headerStyle: CSSProperties = {
    fontFamily: "'Lato:Bold Italic', 'Lato', sans-serif",
    fontStyle: 'italic',
    fontWeight: 700,
    fontSize: 18,
    color: 'rgba(255,255,255,0.38)',
    letterSpacing: '0.9px',
    textAlign: 'center',
    margin: 0,
  }

  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 24,
  }

  const cardStyle: CSSProperties = {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    padding: 24,
    border: '1px solid #272727',
    borderRadius: 15,
    background: '#0a0a0a',
    boxShadow: '0 0 0 1px #272727, 0 8px 32px rgba(0, 0, 0, .7), 0 0 24px rgba(255, 255, 255, .03)',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s',
    aspectRatio: '1',
  }

  const titleStyle: CSSProperties = {
    fontFamily: "'Lato:Bold Italic', 'Lato', sans-serif",
    fontStyle: 'italic',
    fontWeight: 700,
    fontSize: 14,
    color: '#fff',
    letterSpacing: '0.7px',
    margin: 0,
  }

  const descriptionStyle: CSSProperties = {
    fontFamily: "'Lato', sans-serif",
    fontStyle: 'italic',
    fontWeight: 400,
    fontSize: 12,
    color: '#bbb',
    letterSpacing: '0.6px',
    lineHeight: '16px',
    margin: 0,
  }

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Scenarios</h2>
      <div style={gridStyle}>
        {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            type="button"
            onClick={scenario.onClick}
            style={cardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 0 0 1px #272727, 0 12px 40px rgba(0, 0, 0, .7), 0 0 32px rgba(255, 255, 255, .05)'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, .2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 0 0 1px #272727, 0 8px 32px rgba(0, 0, 0, .7), 0 0 24px rgba(255, 255, 255, .03)'
              e.currentTarget.style.borderColor = '#272727'
            }}
          >
            <h3 style={titleStyle}>{scenario.title}</h3>
            <p style={descriptionStyle}>{scenario.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
