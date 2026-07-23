import { useEffect, useRef, useState } from 'react'

const BPM_LIMIT = [40, 220]
const COUNT_IN_BEATS = 4
const SAMPLE_PATHS = {
  kick: `${import.meta.env.BASE_URL}sounds/kick.mp3`,
  snare: `${import.meta.env.BASE_URL}sounds/snare.mp3`,
  hihat: `${import.meta.env.BASE_URL}sounds/hihat.mp3`,
}

function clamp(v, [min, max]) {
  return Math.min(max, Math.max(min, v))
}

function DrumsIllustration({ active }) {
  return (
    <svg viewBox="0 0 200 140" className={`drums-svg ${active ? 'drums-svg-active' : ''}`}>
      {/* бас-бочка */}
      <ellipse cx="100" cy="100" rx="46" ry="30" fill="#241F3D" opacity="0.08" />
      <rect x="60" y="55" width="80" height="55" rx="14" fill="#6C5CE7" />
      <ellipse cx="100" cy="55" rx="40" ry="12" fill="#8B7CFF" />
      <circle cx="100" cy="82" r="14" fill="#FFF3E2" opacity="0.9" />
      {/* малый барабан слева */}
      <rect x="14" y="70" width="46" height="30" rx="8" fill="#FF7A66" />
      <ellipse cx="37" cy="70" rx="23" ry="8" fill="#FF9C89" />
      {/* хай-хэт справа */}
      <line x1="165" y1="110" x2="165" y2="50" stroke="#241F3D" strokeWidth="4" />
      <ellipse cx="165" cy="45" rx="26" ry="7" fill="#FFC968" />
      <ellipse cx="165" cy="38" rx="24" ry="6" fill="#FFD98A" />
    </svg>
  )
}

export default function Metronome({ t }) {
  const [bpm, setBpm] = useState(100)
  const [running, setRunning] = useState(false)
  const [countIn, setCountIn] = useState(null) // число ударов до старта бита, либо null
  const audioCtxRef = useRef(null)
  const timerRef = useRef(null)
  const stepRef = useRef(0)

  const ensureCtx = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      audioCtxRef.current = new AudioCtx()
    }
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume()
    return audioCtxRef.current
  }

  const playClick = (accent) => {
    const ctx = ensureCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.frequency.value = accent ? 1400 : 1000
    gain.gain.setValueAtTime(0.35, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.07)
  }

  const playSample = (name) => {
    const audio = new Audio(SAMPLE_PATHS[name])
    audio.volume = 0.8
    audio.play().catch(() => { /* файл ещё не добавлен — тихо игнорируем */ })
  }

  const stopAll = () => {
    clearInterval(timerRef.current)
    timerRef.current = null
    setRunning(false)
    setCountIn(null)
  }

  const startBackbeat = () => {
    stepRef.current = 0
    const eighthMs = (60000 / bpm) / 2
    timerRef.current = setInterval(() => {
      const step = stepRef.current % 8
      if (step === 0 || step === 4) playSample('kick')
      if (step === 2 || step === 6) playSample('snare')
      playSample('hihat')
      stepRef.current += 1
    }, eighthMs)
  }

  const start = () => {
    ensureCtx()
    setRunning(true)
    let beat = COUNT_IN_BEATS
    setCountIn(beat)
    playClick(true)
    const quarterMs = 60000 / bpm
    timerRef.current = setInterval(() => {
      beat -= 1
      if (beat <= 0) {
        clearInterval(timerRef.current)
        setCountIn(null)
        startBackbeat()
        return
      }
      setCountIn(beat)
      playClick(beat === 1)
    }, quarterMs)
  }

  const toggle = () => {
    if (running) stopAll()
    else start()
  }

  const adjustBpm = (d) => setBpm(v => clamp(v + d, BPM_LIMIT))

  useEffect(() => {
    return () => clearInterval(timerRef.current)
  }, [])

  return (
    <div className="panel p-3 p-md-4 mb-4">
      <div className="mb-3">
        <div className="eyebrow">{t('metronomeTitle')}</div>
        <h2 className="panel-title mb-0"><i className="bi bi-music-note-beamed" /> {t('metronomeTitle')}</h2>
      </div>

      <div className="text-center mb-3">
        <DrumsIllustration active={running} />
      </div>

      <div className="d-flex align-items-center justify-content-center gap-3 mb-3">
        <div className="stepper">
          <button type="button" onClick={() => adjustBpm(-5)} disabled={bpm <= BPM_LIMIT[0]}>−</button>
          <span>{bpm} BPM</span>
          <button type="button" onClick={() => adjustBpm(5)} disabled={bpm >= BPM_LIMIT[1]}>+</button>
        </div>
      </div>

      <div className="text-center mb-3">
        <button className="btn btn-pill btn-primary-soft" onClick={toggle}>
          <i className={`bi ${running ? 'bi-stop-fill' : 'bi-play-fill'} me-1`} />
          {running ? t('pause') : t('start')}
        </button>
      </div>

      {countIn !== null && (
        <div className="text-center metronome-countin">{countIn}</div>
      )}

      <p className="small text-muted text-center mb-0">
        {t('drumSamplesHint')}
      </p>
    </div>
  )
}
