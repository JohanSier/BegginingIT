import simulation1 from '@/imports/simulation_1.png'
import { NavPill } from '@/components/NavPill'
import { useNavigate } from 'react-router-dom'

interface SimulationPickerProps {
  onSelectTrackpad: () => void
}

function SimulationCard({
  title,
  detail,
  state = 'available',
  onClick,
}: {
  title: string
  detail: string
  state?: 'available' | 'coming-soon'
  onClick?: () => void
}) {
  const isAvailable = state === 'available'

  return (
    <button
      type="button"
      className={`simulation-card simulation-card--${state}`}
      onClick={onClick}
      disabled={!isAvailable}
      aria-label={isAvailable ? `Open ${title} simulation` : `${title}: ${detail}`}
    >
      <span className="simulation-card__art" aria-hidden="true">
        {isAvailable ? (
          <img src={simulation1} alt="" className="simulation-card__image" />
        ) : (
          <span className="simulation-card__placeholder" />
        )}
      </span>
      <span className="simulation-card__title">{title}</span>
      <span className="simulation-card__detail">{detail}</span>
    </button>
  )
}

export default function SimulationPicker({ onSelectTrackpad }: SimulationPickerProps) {
  const navigate = useNavigate()

  const handleNavigate = (id: string) => {
    if (id === 'home') {
      navigate('/')
    } else if (id === 'work') {
      // Stay on work ticket page
    } else if (id === 'escalations') {
      navigate('/escalations')
    } else if (id === 'templates') {
      navigate('/templates')
    } else if (id === 'it-team') {
      navigate('/it-team')
    }
  }

  return (
    <>
      <section className="simulation-picker" aria-labelledby="simulation-picker-title">
        <div className="simulation-picker__inner">
          <h1 id="simulation-picker-title" aria-hidden="true">CHOOSE A SIMULATION</h1>
          <div className="simulation-picker__cards">
            <SimulationCard title="Trackpad Issue" detail="By Johan Cortes" onClick={onSelectTrackpad} />
            <SimulationCard title="Available Soon" detail="In Progress" state="coming-soon" />
            <SimulationCard title="Available Soon" detail="In Progress" state="coming-soon" />
          </div>
        </div>
      </section>
      <NavPill active="work" onNavigate={handleNavigate} />
    </>
  )
}