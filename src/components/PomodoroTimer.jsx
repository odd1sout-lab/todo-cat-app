import { useEffect, useRef, useState } from 'react'
import AmbientSoundBar from './AmbientSoundBar'

const POMODORO_COIN_REWARD = 8

const WORK_LIMIT = [5, 90]
const BREAK_LIMIT = [1, 30]
const LONG_BREAK_LIMIT = [5, 60]
const ROUNDS_LIMIT = [2, 8]

function clamp(v, [min, max]) {
  return Math.min(max, Math.max(min, v))
}

export default function PomodoroTimer({ settings, onChangeSettings, onPomodoroComplete, ambient, t }) {
  const { workMin, breakMin, longBreakMin, roundsBeforeLong } = settings
  const [mode, setMode] = useState('work') // 'work' | 'break' | 'longbreak'
  const [secondsLeft, setSecondsLeft] = useState(workMin * 60)
  const [running, setRunning] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [roundsDone, setRoundsDone] = useState(0)
  const intervalRef = useRef(null)

  const durationFor = (m) => (m === 'work' ? workMin : m === 'longbreak' ? longBreakMin : breakMin) * 60

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          setRunning(false)
          if (mode === 'work') {
            onPomodoroComplete(POMODORO_COIN_REWARD)
            const nextRounds = roundsDone + 1
            setRoundsDone(nextRounds)
            const goLong = nextRounds >= roundsBeforeLong
            setMode(goLong ? 'longbreak' : 'break')
            if (goLong) setRoundsDone(0)
            return goLong ? longBreakMin * 60 : breakMin * 60
          } else {
            setMode('work')
            return workMin * 60
          }
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [running, mode, onPomodoroComplete, workMin, breakMin, longBreakMin, roundsBeforeLong, roundsDone])

  useEffect(() => {
    if (!running) setSecondsLeft(durationFor(mode))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workMin, breakMin, longBreakMin])

  const reset = () => {
    setRunning(false)
    setMode('work')
    setRoundsDone(0)
    setSecondsLeft(workMin * 60)
  }

  const adjustWork = (d) => onChangeSettings({ ...settings, workMin: clamp(workMin + d, WORK_LIMIT) })
  const adjustBreak = (d) => onChangeSettings({ ...settings, breakMin: clamp(breakMin + d, BREAK_LIMIT) })
  const adjustLongBreak = (d) => onChangeSettings({ ...settings, longBreakMin: clamp(longBreakMin + d, LONG_BREAK_LIMIT) })
  const adjustRounds = (d) => onChangeSettings({ ...settings, roundsBeforeLong: clamp(roundsBeforeLong + d, ROUNDS_LIMIT) })

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const seconds = String(secondsLeft % 60).padStart(2, '0')
  const totalSeconds = durationFor(mode)
  const progress = 100 - Math.round((secondsLeft / totalSeconds) * 100)
  const ringColor = mode === 'work' ? '#6C5CE7' : mode === 'longbreak' ? '#FF7A66' : '#2FBF96'
  const modeLabel = mode === 'work' ? t('pomodoroFocus') : mode === 'longbreak' ? t('pomodoroLongBreak') : t('pomodoroBreak')
  const modeClass = mode === 'work' ? 'timer-mode-work' : mode === 'longbreak' ? 'timer-mode-long' : 'timer-mode-break'

  return (
    <div className="panel p-3 p-md-4">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <div className="eyebrow">{t('pomodoroEyebrow')}</div>
          <h2 className="panel-title mb-0"><i className="bi bi-clock-history" /> {t('pomodoroTitle')}</h2>
        </div>
        <button
          className="btn-ghost-icon btn-ghost-icon-sm"
          onClick={() => setShowSettings(s => !s)}
          aria-label={t('adjustDuration')}
          title={t('adjustDuration')}
        >
          <i className="bi bi-sliders" />
        </button>
      </div>

      {showSettings && (
        <div className="pomo-settings mb-3">
          <div className="pomo-setting-row">
            <span className="pomo-setting-label"><i className="bi bi-lightning-charge me-1" />{t('pomodoroFocus')}</span>
            <div className="stepper">
              <button type="button" onClick={() => adjustWork(-5)} disabled={workMin <= WORK_LIMIT[0]}>−</button>
              <span>{workMin} {t('minutesShort')}</span>
              <button type="button" onClick={() => adjustWork(5)} disabled={workMin >= WORK_LIMIT[1]}>+</button>
            </div>
          </div>
          <div className="pomo-setting-row">
            <span className="pomo-setting-label"><i className="bi bi-cup-hot me-1" />{t('shortBreakLabel')}</span>
            <div className="stepper">
              <button type="button" onClick={() => adjustBreak(-1)} disabled={breakMin <= BREAK_LIMIT[0]}>−</button>
              <span>{breakMin} {t('minutesShort')}</span>
              <button type="button" onClick={() => adjustBreak(1)} disabled={breakMin >= BREAK_LIMIT[1]}>+</button>
            </div>
          </div>
          <div className="pomo-setting-row">
            <span className="pomo-setting-label"><i className="bi bi-moon-stars me-1" />{t('longBreakLabel')}</span>
            <div className="stepper">
              <button type="button" onClick={() => adjustLongBreak(-5)} disabled={longBreakMin <= LONG_BREAK_LIMIT[0]}>−</button>
              <span>{longBreakMin} {t('minutesShort')}</span>
              <button type="button" onClick={() => adjustLongBreak(5)} disabled={longBreakMin >= LONG_BREAK_LIMIT[1]}>+</button>
            </div>
          </div>
          <div className="pomo-setting-row">
            <span className="pomo-setting-label"><i className="bi bi-arrow-repeat me-1" />{t('roundsUntilBreak')}</span>
            <div className="stepper">
              <button type="button" onClick={() => adjustRounds(-1)} disabled={roundsBeforeLong <= ROUNDS_LIMIT[0]}>−</button>
              <span>{roundsBeforeLong}</span>
              <button type="button" onClick={() => adjustRounds(1)} disabled={roundsBeforeLong >= ROUNDS_LIMIT[1]}>+</button>
            </div>
          </div>
        </div>
      )}

      <div className="timer-ring-wrap mb-2">
        <div
          className="timer-ring"
          style={{ background: `conic-gradient(${ringColor} ${progress}%, #EDEAF9 ${progress}%)` }}
        >
          <div className="timer-ring-inner">
            <div className="timer-time">{minutes}:{seconds}</div>
            <span className={`timer-mode-badge ${modeClass}`}>{modeLabel}</span>
            <span className="timer-round-badge">
              {t('round')} {Math.min(roundsDone + 1, roundsBeforeLong)} / {roundsBeforeLong}
            </span>
          </div>
        </div>
      </div>

      <div className="d-flex gap-2 justify-content-center mb-3">
        <button className="btn btn-pill btn-primary-soft" onClick={() => setRunning(r => !r)}>
          <i className={`bi ${running ? 'bi-pause-fill' : 'bi-play-fill'} me-1`} />
          {running ? t('pause') : t('start')}
        </button>
        <button className="btn btn-pill btn-outline-soft" onClick={reset}>
          <i className="bi bi-arrow-counterclockwise me-1" />{t('reset')}
        </button>
      </div>

      <AmbientSoundBar ambient={ambient} t={t} />

      <p className="small text-muted text-center mt-3 mb-0">
        <i className="bi bi-coin me-1" />{t('pomodoroRewardNote', { coins: POMODORO_COIN_REWARD })}
      </p>
    </div>
  )
}
