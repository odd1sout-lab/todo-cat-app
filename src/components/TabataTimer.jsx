import { useEffect, useRef, useState } from 'react'
import AmbientSoundBar from './AmbientSoundBar'

const TABATA_COIN_REWARD = 6
const WORK_LIMIT = [5, 120]
const REST_LIMIT = [5, 120]
const ROUNDS_LIMIT = [1, 20]
const REPS_LIMIT = [1, 100]

function clamp(v, [min, max]) {
  return Math.min(max, Math.max(min, v))
}

export default function TabataTimer({ settings, onChangeSettings, onTabataComplete, ambient, t }) {
  const { workSec, restSec, rounds, workMode = 'time', reps = 12 } = settings
  const isRepsMode = workMode === 'reps'
  const [phase, setPhase] = useState('idle') // 'idle' | 'work' | 'rest' | 'done'
  const [round, setRound] = useState(1)
  const [secondsLeft, setSecondsLeft] = useState(workSec)
  const [running, setRunning] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const intervalRef = useRef(null)

  const finishRound = () => {
    if (round >= rounds) {
      setRunning(false)
      setPhase('done')
      onTabataComplete(TABATA_COIN_REWARD)
      return
    }
    setPhase('rest')
    setSecondsLeft(restSec)
  }

  // Таймер по секундам — работает только когда фаза "работа" в режиме по времени, либо фаза "отдых" (всегда по времени)
  useEffect(() => {
    if (!running) return
    if (phase === 'work' && isRepsMode) return // в режиме повторений работа не тикает — ждём кнопку "Готово"

    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          if (phase === 'work') {
            finishRound()
            return workSec
          }
          if (phase === 'rest') {
            setRound(r => r + 1)
            setPhase('work')
            return isRepsMode ? 0 : workSec
          }
          return prev
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, phase, round, rounds, workSec, restSec, isRepsMode])

  const start = () => {
    if (phase === 'idle' || phase === 'done') {
      setPhase('work')
      setRound(1)
      setSecondsLeft(isRepsMode ? 0 : workSec)
    }
    setRunning(true)
  }

  const pause = () => setRunning(false)

  const reset = () => {
    setRunning(false)
    setPhase('idle')
    setRound(1)
    setSecondsLeft(isRepsMode ? 0 : workSec)
  }

  // В режиме повторений: жмём "Готово" сами, когда закончили сет
  const completeRepsRound = () => {
    if (round >= rounds) {
      setRunning(false)
      setPhase('done')
      onTabataComplete(TABATA_COIN_REWARD)
      return
    }
    setPhase('rest')
    setSecondsLeft(restSec)
  }

  const adjustWork = (d) => onChangeSettings({ ...settings, workSec: clamp(workSec + d, WORK_LIMIT) })
  const adjustRest = (d) => onChangeSettings({ ...settings, restSec: clamp(restSec + d, REST_LIMIT) })
  const adjustRounds = (d) => onChangeSettings({ ...settings, rounds: clamp(rounds + d, ROUNDS_LIMIT) })
  const adjustReps = (d) => onChangeSettings({ ...settings, reps: clamp(reps + d, REPS_LIMIT) })
  const setMode = (mode) => onChangeSettings({ ...settings, workMode: mode })

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const seconds = String(secondsLeft % 60).padStart(2, '0')
  const totalSeconds = phase === 'rest' ? restSec : workSec
  const progress = phase === 'idle' || phase === 'done' ? 0
    : (phase === 'work' && isRepsMode) ? 100
    : 100 - Math.round((secondsLeft / totalSeconds) * 100)
  const ringColor = phase === 'rest' ? '#2FBF96' : '#FF7A66'
  const modeLabel = phase === 'idle' ? t('pomodoroReady') : phase === 'work' ? t('tabataWork') : phase === 'rest' ? t('tabataRest') : t('tabataDone')
  const modeClass = phase === 'rest' ? 'timer-mode-break' : phase === 'work' ? 'timer-mode-tabata' : 'timer-mode-work'

  const ringCenterContent = () => {
    if (phase === 'done') return '🎉'
    if (phase === 'work' && isRepsMode) return `${reps}×`
    if (phase === 'idle') return isRepsMode ? `${reps}×` : `${workSec}s`
    return `${minutes}:${seconds}`
  }

  return (
    <div className="panel p-3 p-md-4">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <div className="eyebrow">{t('tabataEyebrow')}</div>
          <h2 className="panel-title mb-0"><i className="bi bi-stopwatch" /> {t('tabataTitle')}</h2>
        </div>
        <button
          className="btn-ghost-icon btn-ghost-icon-sm"
          onClick={() => setShowSettings(s => !s)}
          aria-label={t('adjustTabata')}
          title={t('adjustTabata')}
        >
          <i className="bi bi-sliders" />
        </button>
      </div>

      {showSettings && (
        <div className="pomo-settings mb-3">
          <div className="pomo-setting-row">
            <span className="pomo-setting-label">{t('workFormat')}</span>
            <div className="theme-toggle">
              <button type="button" className={!isRepsMode ? 'theme-active' : ''} onClick={() => setMode('time')}>
                {t('tabataByTime')}
              </button>
              <button type="button" className={isRepsMode ? 'theme-active' : ''} onClick={() => setMode('reps')}>
                {t('tabataByReps')}
              </button>
            </div>
          </div>
          {isRepsMode ? (
            <div className="pomo-setting-row">
              <span className="pomo-setting-label"><i className="bi bi-arrow-repeat me-1" />{t('repsInRound')}</span>
              <div className="stepper">
                <button type="button" onClick={() => adjustReps(-1)} disabled={reps <= REPS_LIMIT[0]}>−</button>
                <span>{reps}</span>
                <button type="button" onClick={() => adjustReps(1)} disabled={reps >= REPS_LIMIT[1]}>+</button>
              </div>
            </div>
          ) : (
            <div className="pomo-setting-row">
              <span className="pomo-setting-label"><i className="bi bi-lightning-charge me-1" />{t('tabataWorkLabel')}</span>
              <div className="stepper">
                <button type="button" onClick={() => adjustWork(-5)} disabled={workSec <= WORK_LIMIT[0]}>−</button>
                <span>{workSec} {t('secondsShort')}</span>
                <button type="button" onClick={() => adjustWork(5)} disabled={workSec >= WORK_LIMIT[1]}>+</button>
              </div>
            </div>
          )}
          <div className="pomo-setting-row">
            <span className="pomo-setting-label"><i className="bi bi-cup-hot me-1" />{t('tabataRestLabel')}</span>
            <div className="stepper">
              <button type="button" onClick={() => adjustRest(-5)} disabled={restSec <= REST_LIMIT[0]}>−</button>
              <span>{restSec} {t('secondsShort')}</span>
              <button type="button" onClick={() => adjustRest(5)} disabled={restSec >= REST_LIMIT[1]}>+</button>
            </div>
          </div>
          <div className="pomo-setting-row">
            <span className="pomo-setting-label"><i className="bi bi-arrow-repeat me-1" />{t('tabataRoundsLabel')}</span>
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
            <div className="timer-time">{ringCenterContent()}</div>
            <span className={`timer-mode-badge ${modeClass}`}>{modeLabel}</span>
            {phase !== 'idle' && phase !== 'done' && (
              <span className="timer-round-badge">{t('round')} {round} / {rounds}</span>
            )}
          </div>
        </div>
      </div>

      {phase === 'idle' && (
        <div className="text-center small text-muted mb-3">{t('tabataTotalRounds', { n: rounds })}</div>
      )}
      {phase === 'done' && (
        <div className="text-center small text-muted mb-3">{t('tabataFinished')}</div>
      )}

      {phase === 'work' && isRepsMode && running ? (
        <div className="d-flex gap-2 justify-content-center mb-3">
          <button className="btn btn-pill btn-primary-soft" onClick={completeRepsRound}>
            <i className="bi bi-check-lg me-1" />{t('tabataRepsDone')}
          </button>
          <button className="btn btn-pill btn-outline-soft" onClick={reset}>
            <i className="bi bi-arrow-counterclockwise me-1" />{t('reset')}
          </button>
        </div>
      ) : (
        <div className="d-flex gap-2 justify-content-center mb-3">
          <button className="btn btn-pill btn-primary-soft" onClick={running ? pause : start}>
            <i className={`bi ${running ? 'bi-pause-fill' : 'bi-play-fill'} me-1`} />
            {running ? t('pause') : phase === 'idle' || phase === 'done' ? t('begin') : t('resume')}
          </button>
          <button className="btn btn-pill btn-outline-soft" onClick={reset}>
            <i className="bi bi-arrow-counterclockwise me-1" />{t('reset')}
          </button>
        </div>
      )}

      <p className="small text-muted text-center mt-3 mb-0">
        <i className="bi bi-coin me-1" />{t('tabataRewardNote', { coins: TABATA_COIN_REWARD })}
      </p>
    </div>
  )
}
