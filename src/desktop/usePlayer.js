import { useCallback, useEffect, useRef, useState } from 'react'

const base = import.meta.env.BASE_URL

// Estado del reproductor. El <audio> lo monta quien usa el hook (audioProps) con preload="none":
// nada se descarga ni suena hasta que el usuario pide play.
export function usePlayer(tracks) {
  const audioRef = useRef(null)
  const resumeAfterSwitch = useRef(false)
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [error, setError] = useState(false)

  const track = tracks[index] || null

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  const play = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !track) return false
    setError(false)
    audio.play().catch(() => setError(true))
    return true
  }, [track])

  const pause = useCallback(() => {
    audioRef.current?.pause()
  }, [])

  const toggle = useCallback(() => {
    if (playing) pause()
    else play()
  }, [playing, play, pause])

  // Cambiar de pista mantiene el estado: si sonaba, la siguiente sigue sonando
  const step = useCallback((delta, keepPlaying = playing) => {
    if (!tracks.length) return null
    resumeAfterSwitch.current = keepPlaying
    const nextIndex = (index + delta + tracks.length) % tracks.length
    setIndex(nextIndex)
    setTime(0)
    setDuration(0)
    setError(false)
    return tracks[nextIndex]
  }, [index, playing, tracks])

  const select = useCallback((i) => {
    resumeAfterSwitch.current = true
    setIndex(i)
    setTime(0)
    setDuration(0)
    setError(false)
  }, [])

  // Después de cambiar el src, retoma solo si el usuario ya estaba escuchando
  useEffect(() => {
    if (!resumeAfterSwitch.current) return
    resumeAfterSwitch.current = false
    audioRef.current?.play().catch(() => setError(true))
  }, [index])

  const seek = useCallback((seconds) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = seconds
    setTime(seconds)
  }, [])

  const audioProps = {
    ref: audioRef,
    src: track ? `${base}${track.src}` : undefined,
    preload: 'none',
    onPlay: () => setPlaying(true),
    onPause: () => setPlaying(false),
    onTimeUpdate: (e) => setTime(e.currentTarget.currentTime),
    onLoadedMetadata: (e) => setDuration(e.currentTarget.duration || 0),
    onEnded: () => step(1, tracks.length > 1),
    onError: () => { if (track) setError(true) },
  }

  return {
    tracks, track, index, playing, time, duration, volume, error,
    play, pause, toggle, next: () => step(1), prev: () => step(-1), select, seek, setVolume,
    audioProps,
  }
}
