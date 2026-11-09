import './ShinyText.css'

export default function ShinyText({
  text,
  disabled = false,
  speed = 3,
  className = '',
  children,
}) {
  const content = text || children

  if (disabled) {
    return <span className={className}>{content}</span>
  }

  return (
    <span
      className={`shiny-text ${className}`}
      style={{ animationDuration: `${speed}s` }}
    >
      {content}
    </span>
  )
}
