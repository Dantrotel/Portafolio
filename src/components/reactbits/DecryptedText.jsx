import { useEffect, useState, useRef, useCallback } from 'react'
import './DecryptedText.css'

export default function DecryptedText({
  text = '',
  speed = 40,
  maxIterations = 8,
  sequential = true,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><,./-=',
  className = '',
  parentClassName = '',
  encryptedClassName = 'decrypted-scramble',
  animateOn = 'hover', // 'view' | 'hover' | 'both'
}) {
  const [displayText, setDisplayText] = useState(text)
  const [isDecrypted, setIsDecrypted] = useState(false)
  const containerRef = useRef(null)
  const intervalRef = useRef(null)

  const getRandomChar = useCallback((origChar) => {
    if (useOriginalCharsOnly) {
      const nonSpaceChars = text.replace(/\s+/g, '')
      return nonSpaceChars[Math.floor(Math.random() * nonSpaceChars.length)] || origChar
    }
    return characters[Math.floor(Math.random() * characters.length)]
  }, [characters, text, useOriginalCharsOnly])

  const triggerAnimation = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    // Con movimiento reducido el texto se muestra tal cual, sin mezclar caracteres
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setDisplayText(text)
      setIsDecrypted(true)
      return
    }

    const textLength = text.length
    let iteration = 0
    const resolvedPositions = new Set()

    intervalRef.current = setInterval(() => {
      let currentText = ''

      if (sequential) {
        let revealIndex = 0
        if (revealDirection === 'start') {
          revealIndex = Math.min(Math.floor(iteration / 2), textLength)
        } else if (revealDirection === 'end') {
          revealIndex = Math.max(textLength - Math.floor(iteration / 2), 0)
        } else {
          const offset = Math.floor(iteration / 3)
          revealIndex = offset
        }

        for (let i = 0; i < textLength; i++) {
          const char = text[i]
          if (char === ' ') {
            currentText += ' '
            continue
          }

          let isRevealed = false
          if (revealDirection === 'start') {
            isRevealed = i < revealIndex
          } else if (revealDirection === 'end') {
            isRevealed = i >= revealIndex
          } else {
            const mid = Math.floor(textLength / 2)
            isRevealed = Math.abs(i - mid) <= revealIndex
          }

          if (isRevealed) {
            currentText += char
          } else {
            currentText += getRandomChar(char)
          }
        }

        if (
          (revealDirection === 'start' && revealIndex >= textLength) ||
          (revealDirection === 'end' && revealIndex <= 0) ||
          iteration > textLength * 3
        ) {
          clearInterval(intervalRef.current)
          setDisplayText(text)
          setIsDecrypted(true)
          return
        }
      } else {
        for (let i = 0; i < textLength; i++) {
          const char = text[i]
          if (char === ' ') {
            currentText += ' '
            continue
          }
          if (resolvedPositions.has(i) || iteration >= maxIterations) {
            currentText += char
          } else {
            if (Math.random() > 0.8) resolvedPositions.add(i)
            currentText += getRandomChar(char)
          }
        }

        if (resolvedPositions.size >= textLength || iteration >= maxIterations + 4) {
          clearInterval(intervalRef.current)
          setDisplayText(text)
          setIsDecrypted(true)
          return
        }
      }

      setDisplayText(currentText)
      iteration++
    }, speed)
  }, [text, speed, sequential, revealDirection, maxIterations, getRandomChar])

  useEffect(() => {
    if (animateOn === 'view' || animateOn === 'both') {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !isDecrypted) {
              triggerAnimation()
            }
          })
        },
        { threshold: 0.2 }
      )

      if (containerRef.current) observer.observe(containerRef.current)
      return () => observer.disconnect()
    }
  }, [animateOn, isDecrypted, triggerAnimation])

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const handleMouseEnter = () => {
    if (animateOn === 'hover' || animateOn === 'both') {
      triggerAnimation()
    }
  }

  return (
    <span
      ref={containerRef}
      className={`decrypted-text-container ${parentClassName}`}
      onMouseEnter={handleMouseEnter}
    >
      {/* El texto real queda para lectores de pantalla; el efecto es solo visual */}
      <span className="sr-only">{text}</span>
      <span className={className} aria-hidden="true">
        {displayText.split('').map((char, index) => {
          const isOriginal = char === text[index]
          return (
            <span
              key={index}
              className={!isOriginal ? encryptedClassName : undefined}
            >
              {char}
            </span>
          )
        })}
      </span>
    </span>
  )
}
