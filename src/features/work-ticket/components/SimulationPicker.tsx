import simulation1 from '@/imports/simulation_1.webp'
import epicProblemTicket from '@/imports/epicProblemTicket.webp'
import phishingSimulation from '@/imports/simulation_3.webp'
import { NavPill } from '@/components/NavPill'
import { useNavigate } from 'react-router-dom'

interface SimulationPickerProps {
  onSelectTrackpad: () => void
  onSelectEpicOutage: () => void
  onSelectPhishing: () => void
}

function SimulationCard({
  title,
  detail,
  state = 'available',
  onClick,
  image,
}: {
  title: string
  detail: string
  state?: 'available' | 'coming-soon'
  onClick?: () => void
  image?: string
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
          <img src={image} alt="" className="simulation-card__image" />
        ) : (
          <span className="simulation-card__placeholder" />
        )}
      </span>
      <span className="simulation-card__title">{title}</span>
      <span className="simulation-card__detail">{detail}</span>
    </button>
  )
}

export default function SimulationPicker({ onSelectTrackpad, onSelectEpicOutage, onSelectPhishing }: SimulationPickerProps) {
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
            <SimulationCard title="Trackpad Issue" detail="Handled By Johan Cortes" onClick={onSelectTrackpad} image={simulation1} />
            <SimulationCard title="Epic Problem Ticket" detail="Handled By Diego Velez" onClick={onSelectEpicOutage} image={epicProblemTicket} />
            <SimulationCard title="Phishing Link" detail="Handled By SOS Team" onClick={onSelectPhishing} image={phishingSimulation} />
          </div>
        </div>
      </section>
      <NavPill active="work" onNavigate={handleNavigate} />
    </>
  )
}