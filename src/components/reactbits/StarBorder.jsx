import './StarBorder.css'

export default function StarBorder({
  as: Component = 'div',
  className = '',
  color = 'var(--accent)',
  speed = '6s',
  children,
  ...props
}) {
  return (
    <Component className={`star-border-container ${className}`} {...props}>
      <div
        className="star-border-glow star-border-glow-top"
        style={{
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          animationDuration: speed,
        }}
        aria-hidden="true"
      />
      <div
        className="star-border-glow star-border-glow-bottom"
        style={{
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          animationDuration: speed,
        }}
        aria-hidden="true"
      />
      <div className="star-border-inner">
        {children}
      </div>
    </Component>
  )
}
