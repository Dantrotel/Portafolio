import './ScrollVelocity.css'

export default function ScrollVelocity({
  items = [],
  speed = 30, // seconds for one loop
  direction = 'left',
  className = '',
}) {
  const repeatedItems = [...items, ...items, ...items, ...items]

  return (
    <div className={`scroll-velocity-wrapper ${className}`} aria-hidden="true">
      <div
        className={`scroll-velocity-track ${direction === 'right' ? 'track-right' : 'track-left'}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {repeatedItems.map((item, index) => (
          <div key={index} className="scroll-velocity-item">
            {item}
            <span className="scroll-velocity-separator">&bull;</span>
          </div>
        ))}
      </div>
    </div>
  )
}
