import { m } from 'framer-motion'

// Aparición suave al entrar en el viewport (una sola vez)
export default function Reveal({ children, delay = 0, y = 24, as = 'div', className }) {
  const Component = m[as]

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  )
}
