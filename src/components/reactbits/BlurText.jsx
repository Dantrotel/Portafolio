import { m } from 'framer-motion'
import './BlurText.css'

export default function BlurText({
  text = '',
  delay = 100,
  className = '',
  animateBy = 'words', // 'words' | 'letters'
  direction = 'top',   // 'top' | 'bottom'
  onAnimationComplete,
}) {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('')

  const getInitial = () => ({
    filter: 'blur(10px)',
    opacity: 0,
    y: direction === 'top' ? -20 : 20,
  })

  const getAnimate = (i) => ({
    filter: 'blur(0px)',
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: (delay * i) / 1000,
      ease: [0.22, 1, 0.36, 1],
    },
  })

  return (
    <span className={`reactbits-blur-text ${className}`}>
      {elements.map((element, i) => (
        <m.span
          key={`${element}-${i}`}
          className="reactbits-blur-element"
          initial={getInitial()}
          animate={getAnimate(i)}
          onAnimationComplete={i === elements.length - 1 ? onAnimationComplete : undefined}
        >
          {element === ' ' ? '\u00A0' : element}
          {animateBy === 'words' && i < elements.length - 1 && '\u00A0'}
        </m.span>
      ))}
    </span>
  )
}
