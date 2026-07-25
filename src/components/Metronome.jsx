import { useEffect, useRef, useState } from 'react'

const BPM_LIMIT = [40, 220]
const COUNT_IN_BEATS = 4
const SAMPLE_NAMES = ['kick', 'snare', 'hihat']
const SAMPLE_PATHS = {
  kick: `${import.meta.env.BASE_URL}sounds/kick.mp3`,
  snare: `${import.meta.env.BASE_URL}sounds/snare.mp3`,
  hihat: `${import.meta.env.BASE_URL}sounds/hihat.mp3`,
}

const SCHEDULE_AHEAD_SEC = 0.1
const LOOKAHEAD_MS = 25

function clamp(v, [min, max]) {
  return Math.min(max, Math.max(min, v))
}

function DrumsIllustration({ active }) {
  return (
   <svg
      viewBox="0 0 260 180"
      className={`drums-svg ${active ? 'drums-svg-active' : ''}`}
    >
      {/* Тарелки */}
      <ellipse cx="60" cy="48" rx="26" ry="7" fill="#FFD56A" />
      <ellipse cx="195" cy="42" rx="30" ry="8" fill="#FFD56A" />
      <ellipse cx="225" cy="65" rx="24" ry="7" fill="#F6C453" />

      {/* Стойки */}
      <line x1="60" y1="55" x2="60" y2="132" stroke="#444" strokeWidth="3" />
      <line x1="195" y1="50" x2="195" y2="132" stroke="#444" strokeWidth="3" />
      <line x1="225" y1="72" x2="225" y2="132" stroke="#444" strokeWidth="3" />

      {/* Томы */}
      <rect x="86" y="42" width="38" height="26" rx="6" fill="#8B7CFF" />
      <ellipse cx="105" cy="42" rx="19" ry="6" fill="#A99CFF" />

      <rect x="136" y="42" width="38" height="26" rx="6" fill="#8B7CFF" />
      <ellipse cx="155" cy="42" rx="19" ry="6" fill="#A99CFF" />

      {/* Малый барабан */}
      <rect x="48" y="82" width="40" height="24" rx="5" fill="#FF7A66" />
      <ellipse cx="68" cy="82" rx="20" ry="6" fill="#FFA08F" />

      {/* Напольный том */}
      <rect x="176" y="90" width="40" height="32" rx="6" fill="#6C5CE7" />
      <ellipse cx="196" cy="90" rx="20" ry="6" fill="#8B7CFF" />

      {/* Бас-бочка */}
      <circle cx="130" cy="112" r="40" fill="#6C5CE7" />
      <circle cx="130" cy="112" r="31" fill="#FFF4E8" />
      <circle cx="130" cy="112" r="8" fill="#6C5CE7" opacity="0.25" />

      {/* Педаль */}
      <line x1="130" y1="152" x2="130" y2="135" stroke="#444" strokeWidth="3" />
      <line x1="118" y1="156" x2="142" y2="156" stroke="#444" strokeWidth="3" />

      {/* Ножки бас-бочки */}
      <line x1="100" y1="140" x2="90" y2="156" stroke="#444" strokeWidth="3" />
      <line x1="160" y1="140" x2="170" y2="156" stroke="#444" strokeWidth="3" />

      {/* Стойка малого */}
      <line x1="68" y1="106" x2="68" y2="132" stroke="#444" strokeWidth="3" />

      {/* Палочки */}
      <line x1="98" y1="24" x2="135" y2="52" stroke="#A56B3E" strokeWidth="3" strokeLinecap="round" />
      <line x1="158" y1="24" x2="126" y2="52" stroke="#A56B3E" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export default function Metronome({ t }) {
  const [bpm, setBpm] = useState(100)
  const [running, setRunning] = useState(false)
  const [countIn, setCountIn] = useState(null)
  const [missingSamples, setMissingSamples] = useState(false)

  const audioCtxRef = useRef(null)
  const buffersRef = useRef({})
  const loadingRef = useRef(false)
  const schedulerTimerRef = useRef(null)
  const nextNoteTimeRef = useRef(0)
  const stepRef = useRef(0)
  const phaseRef = useRef('idle') // 'countin' | 'beat'
  const countInLeftRef = useRef(0)
  const bpmRef = useRef(bpm)

  useEffect(() => { bpmRef.current = bpm }, [bpm])

  const ensureCtx = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      audioCtxRef.current = new AudioCtx()
    }
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume()
    return audioCtxRef.current
  }

  const loadBuffer = async (ctx, url) => {
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error('not found')
      const arrayBuffer = await res.arrayBuffer()
      return await ctx.decodeAudioData(arrayBuffer)
    } catch {
      return null
    }
  }

  const ensureSamplesLoaded = async () => {
    if (loadingRef.current || Object.keys(buffersRef.current).length > 0) return
    loadingRef.current = true
    const ctx = ensureCtx()
    const entries = await Promise.all(
      SAMPLE_NAMES.map(async name => [name, await loadBuffer(ctx, SAMPLE_PATHS[name])])
    )
    const buffers = {}
    let anyMissing = false
    for (const [name, buf] of entries) {
      buffers[name] = buf
      if (!buf) anyMissing = true
    }
    buffersRef.current = buffers
    setMissingSamples(anyMissing)
    loadingRef.current = false
  }

  const playBuffer = (ctx, name, time) => {
    const buffer = buffersRef.current[name]
    if (!buffer) return
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.connect(ctx.destination)
    source.start(time)
  }

  const playClick = (ctx, time, accent) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.frequency.value = accent ? 1400 : 1000
    gain.gain.setValueAtTime(0.35, time)
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.06)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(time)
    osc.stop(time + 0.07)
  }

  const scheduler = () => {
    const ctx = audioCtxRef.current
    if (!ctx) return
    while (nextNoteTimeRef.current < ctx.currentTime + SCHEDULE_AHEAD_SEC) {
      const time = nextNoteTimeRef.current
      const quarterSec = 60 / bpmRef.current

      if (phaseRef.current === 'countin') {
        const beatsLeft = countInLeftRef.current
        playClick(ctx, time, beatsLeft === 1)
        setCountIn(beatsLeft)
        countInLeftRef.current -= 1
        nextNoteTimeRef.current += quarterSec
        if (countInLeftRef.current <= 0) {
          phaseRef.current = 'beat'
          stepRef.current = 0
          setCountIn(null)
        }
      } else {
        const step = stepRef.current % 8
        if (step === 0 || step === 4) playBuffer(ctx, 'kick', time)
        if (step === 2 || step === 6) playBuffer(ctx, 'snare', time)
        playBuffer(ctx, 'hihat', time)
        stepRef.current += 1
        nextNoteTimeRef.current += quarterSec / 2
      }
    }
  }

  const start = async () => {
    const ctx = ensureCtx()
    setRunning(true)
    await ensureSamplesLoaded()
    phaseRef.current = 'countin'
    countInLeftRef.current = COUNT_IN_BEATS
    stepRef.current = 0
    nextNoteTimeRef.current = ctx.currentTime + 0.05
    schedulerTimerRef.current = setInterval(scheduler, LOOKAHEAD_MS)
  }

  const stop = () => {
    clearInterval(schedulerTimerRef.current)
    schedulerTimerRef.current = null
    phaseRef.current = 'idle'
    setRunning(false)
    setCountIn(null)
  }

  const toggle = () => {
    if (running) stop()
    else start()
  }

  const adjustBpm = (d) => setBpm(v => clamp(v + d, BPM_LIMIT))

  useEffect(() => {
    return () => clearInterval(schedulerTimerRef.current)
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

      {missingSamples && (
        <p className="small text-muted text-center mb-0">
          {t('drumSamplesHint')}
        </p>
      )}
    </div>
  )
}
