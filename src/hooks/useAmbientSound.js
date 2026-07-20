import { useCallback, useEffect, useRef, useState } from 'react'
import { AMBIENT_TRACKS } from '../data/ambientTracks'

export function useAmbientSound(initialTrack, initialVolume, onPersist) {
  const audioRef = useRef(null)
  const [track, setTrack] = useState(initialTrack || null)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolumeState] = useState(initialVolume ?? 0.5)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    const audio = new Audio()
    audio.loop = true
    audio.addEventListener('error', () => setMissing(true))
    audioRef.current = audio
    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  const toggleTrack = useCallback((trackId) => {
    const cfg = AMBIENT_TRACKS[trackId]
    if (!cfg || !audioRef.current) return
    const audio = audioRef.current

    if (playing && track === trackId) {
      audio.pause()
      setPlaying(false)
      onPersist?.(null, volume)
      return
    }

    setMissing(false)
    audio.src = cfg.src
    audio.volume = volume
    audio.currentTime = 0
    audio.play().catch(() => setMissing(true))
    setTrack(trackId)
    setPlaying(true)
    onPersist?.(trackId, volume)
  }, [playing, track, volume, onPersist])

  const stop = useCallback(() => {
    audioRef.current?.pause()
    setPlaying(false)
    onPersist?.(null, volume)
  }, [onPersist, volume])

  const setVolume = useCallback((v) => {
    setVolumeState(v)
    if (audioRef.current) audioRef.current.volume = v
    onPersist?.(track, v)
  }, [track, onPersist])

  return { track, playing, volume, missing, toggleTrack, stop, setVolume }
}
