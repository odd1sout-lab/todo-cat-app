import { useEffect, useRef, useState } from 'react'
import AmbientSoundBar from './AmbientSoundBar'

const TABATA_COIN_REWARD = 6
const WORK_LIMIT = [5, 120]
const REST_LIMIT = [5, 120]
const ROUNDS_LIMIT = [1, 20]

function clamp(v, [min, max]) {
  return Math.min(max, Math.max(min, v))
}

export default function TabataTimer({ settings, onChangeSettings, onTabataComplete, ambient }) {
  const { workSec, restSec, rounds } = settings
  const [phase, setPhase] = useState('idle') // 'idle' | 'work' | 'rest' | 'done'
  const [round, setRound] = useState(1)
  const [secondsLeft, setSecondsLeft] = useState(workSec)
  const [running, setRunning] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          if (phase === 'work') {
            if (round >= rounds) {
              clearInterval(intervalRef.current)
              setRunning(false)
              setPhase('done')
              onTabataComplete(TABATA_COIN_REWARD)
              return 0
            }
            setPhase('rest')
            return restSec
          }
          if (phase === 'rest') {
            setRound(r => r + 1)
            setPhase('work')
            return workSec
          }
          return prev
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [running, phase, round, rounds, workSec, restSec, onTabataComplete])

  const start = () => {
    if (phase === 'idle' || phase === 'done') {
      setPhase('work')
      setRound(1)
      setSecondsLeft(workSec)
    }
    setRunning(true)
  }

  const pause = () => setRunning(false)

  const reset = () => {
    setRunning(false)
    setPhase('idle')
    setRound(1)
    setSecondsLeft(workSec)
  }

  const adjustWork = (d) => onChangeSettings({ ...settings, workSec: clamp(workSec + d, WORK_LIMIT) })
  const adjustRest = (d) => onChangeSettings({ ...settings, restSec: clamp(restSec + d, REST_LIMIT) })
  const adjustRounds = (d) => onChangeSettings({ ...settings, rounds: clamp(rounds + d, ROUNDS_LIMIT) })

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const seconds = String(secondsLeft % 60).padStart(2, '0')
  const totalSeconds = phase === 'rest' ? restSec : workSec
  const progress = phase === 'idle' || phase === 'done' ? 0 : 100 - Math.round((secondsLeft / totalSeconds) * 100)
  const ringColor = phase === 'rest' ? '#2FBF96' : '#FF7A66'
  const modeLabel = phase === 'idle' ? 'Готов начать' : phase === 'work' ? 'Работа' : phase === 'rest' ? 'Отдых' : 'Готово!'
  const modeClass = phase === 'rest' ? 'timer-mode-break' : phase === 'work' ? 'timer-mode-tabata' : 'timer-mode-work'

  return (
    <div className="panel p-3 p-md-4">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <div className="eyebrow">Интервальная тренировка</div>
          <h2 className="panel-title mb-0"><i className="bi bi-stopwatch" /> Табата</h2>
        </div>
        <button
          className="btn-ghost-icon btn-ghost-icon-sm"
          onClick={() => setShowSettings(s => !s)}
          aria-label="Настроить табату"
          title="Настроить табату"
        >
          <i className="bi bi-sliders" />
        </button>
      </div>

      {showSettings && (
        <div className="pomo-settings mb-3">
          <div className="pomo-setting-row">
            <span className="pomo-setting-label"><i className="bi bi-lightning-charge me-1" />Работа</span>
            <div className="stepper">
              <button type="button" onClick={() => adjustWork(-5)} disabled={workSec <= WORK_LIMIT[0]}>−</button>
              <span>{workSec} сек</span>
              <button type="button" onClick={() => adjustWork(5)} disabled={workSec >= WORK_LIMIT[1]}>+</button>
            </div>
          </div>
          <div className="pomo-setting-row">
            <span className="pomo-setting-label"><i className="bi bi-cup-hot me-1" />Отдых</span>
            <div className="stepper">
              <button type="button" onClick={() => adjustRest(-5)} disabled={restSec <= REST_LIMIT[0]}>−</button>
              <span>{restSec} сек</span>
              <button type="button" onClick={() => adjustRest(5)} disabled={restSec >= REST_LIMIT[1]}>+</button>
            </div>
          </div>
          <div className="pomo-setting-row">
            <span className="pomo-setting-label"><i className="bi bi-arrow-repeat me-1" />Раундов</span>
            <div className="stepper">
              <button type="button" onClick={() => adjustRounds(-1)} disabled={rounds <= ROUNDS_LIMIT[0]}>−</button>
              <span>{rounds}</span>
              <button type="button" onClick={() => adjustRounds(1)} disabled={rounds >= ROUNDS_LIMIT[1]}>+</button>
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
            <div className="timer-time">{phase === 'idle' ? `${workSec}s` : phase === 'done' ? '🎉' : `${minutes}:${seconds}`}</div>
            <span className={`timer-mode-badge ${modeClass}`}>{modeLabel}</span>
          </div>
        </div>
      </div>

      <div className="text-center small text-muted mb-3">
        {phase === 'idle' ? `Всего раундов: ${rounds}` : phase === 'done' ? 'Тренировка завершена!' : `Раунд ${round} из ${rounds}`}
      </div>

      <div className="d-flex gap-2 justify-content-center mb-3">
        <button className="btn btn-pill btn-primary-soft" onClick={running ? pause : start}>
          <i className={`bi ${running ? 'bi-pause-fill' : 'bi-play-fill'} me-1`} />
          {running ? 'Пауза' : phase === 'idle' || phase === 'done' ? 'Начать' : 'Продолжить'}
        </button>
        <button className="btn btn-pill btn-outline-soft" onClick={reset}>
          <i className="bi bi-arrow-counterclockwise me-1" />Сброс
        </button>
      </div>

      <p className="small text-muted text-center mt-3 mb-0">
        <i className="bi bi-coin me-1" />Завершённая тренировка — {TABATA_COIN_REWARD} монет котику.
      </p>
    </div>
  )
}
