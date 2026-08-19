import { useState } from "react"
import timeIcon from "../../imports/time.svg"
import "./TimeRule.css"

type TimeRuleProps = {
  hidden?: boolean
}

export default function TimeRule({ hidden = false }: TimeRuleProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <aside
      className={`time-rule ${isHovered ? "is-hovered" : ""} ${hidden ? "is-suppressed" : ""}`}
      aria-label="Time rule guide"
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
    >
      <div className="time-rule__panel">
        <div className="time-rule__header"><TimeRuleLabel /></div>

        <div className="time-rule__milestones">
          <p><span>15 mins in:</span><strong>Ask T1 for help</strong></p>
          <p><span>30 mins in:</span><strong>Ask T2 for help</strong></p>
          <p className="time-rule__escalate"><span>45 - 60 mins in:</span><strong>Escalate if you aren't close to solving</strong></p>
        </div>

        <p className="time-rule__note">
          If you have worked the ticket more than a few days, but can't figure it out still, escalate<br /><br />
          If you're getting close, you feel like you almost got it solved, keep going
        </p>
      </div>

      <button className="time-rule__trigger" type="button" aria-expanded={isHovered}>
        <TimeRuleLabel />
      </button>
    </aside>
  )
}

function TimeRuleLabel() {
  return (
    <span className="time-rule__label">
      <img src={timeIcon} alt="" className="time-rule__icon" loading="eager" />
      <span>Time Rule</span>
    </span>
  )
}
