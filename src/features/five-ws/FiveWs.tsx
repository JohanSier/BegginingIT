import "./FiveWs.css"

const prompts = ["Who", "What", "Where", "Why", "When"]

export default function FiveWs() {
  return (
    <section className="five-ws" aria-label="Five W framework">
      <h1 className="five-ws__title">5W's</h1>
      <div className="five-ws__tags" aria-label="Framework prompts">
        {prompts.map((prompt, index) => (
          <span className={`five-ws__tag five-ws__tag--${index + 1}`} key={prompt}>
            {prompt}
          </span>
        ))}
      </div>
    </section>
  )
}
