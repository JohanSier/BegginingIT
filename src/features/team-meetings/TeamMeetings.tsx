import { useState } from "react"
import "./TeamMeetings.css"
import teamMeetingsIcon from "../../imports/d06bb.svg"

type TeamMeetingsProps = {
  hidden?: boolean
}

const meetings = [
  {
    day: "Wednesday*",
    description: (
      <>
        Every Wednesday depending on in what POD you are at, you either will have the meeting at 9:00am CT (Pod3), 10:00am CT (Pod2) or 2:00pm CT (Pod1)
        <br />
        <br />
        Also the last wednesday of the month will be with the whole team. This meeting is mandatory
      </>
    ),
  },
  {
    day: "Thursday",
    description:
      "Every Thursday at 3:00pm the CIO makes this meeting with the full IT Team to discuss updates inside every IT team in Higg, this meeting is not mandatory for Tier 1, only if there are no tickets in the queue you can enter the meeting",
  },
  {
    day: "Friday*",
    description:
      "Every Friday at 3:00pm we have a meeting to discuss the tickets we had questions about throughout the week. This meeting is mandatory",
  },
]

export default function TeamMeetings({ hidden = false }: TeamMeetingsProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <aside
      className={`team-meetings ${isHovered ? "is-hovered" : ""} ${hidden ? "is-suppressed" : ""}`}
      aria-label="SOS team meetings"
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      <div className="team-meetings__panel">
        <div className="team-meetings__header">
          <TeamMeetingsLabel />
        </div>
        <div className="team-meetings__schedule">
          {meetings.map(({ day, description }) => (
            <section className="team-meetings__card" key={day}>
              <span className="team-meetings__day">{day}</span>
              <p>{description}</p>
            </section>
          ))}
        </div>
      </div>

      <button className="team-meetings__trigger" type="button" aria-expanded={isHovered}>
        <TeamMeetingsLabel />
      </button>
    </aside>
  )
}

function TeamMeetingsLabel() {
  return (
    <span className="team-meetings__label">
      <img className="team-meetings__icon" src={teamMeetingsIcon} alt="" aria-hidden="true" />
      <span>SOS Team Meetings</span>
    </span>
  )
}