import { useEffect, useRef, useState } from 'react'
import { OUTFITS } from '../data/outfits'
import { pickMessage, catMood } from '../data/catMessages'
import { CAT_COLORS, buildCatImagePath, FALLBACK_CAT_IMAGE } from '../data/catImages'

const FEED_COST = 5
const FEED_AMOUNT = 30
const PET_COOLDOWN_MS = 500

export default function VirtualCat({
  lastActivityAt,
  equippedOutfit,
  coins,
  hunger,
  catColor,
  onChangeCatColor,
  justCompletedTaskTick,
  onOpenShop,
  onFeed,
  onPet,
}) {
  const [message, setMessage] = useState('Привет! Я твой котик-помощник 🐾')
  const [idleMinutes, setIdleMinutes] = useState(0)
  const [bounce, setBounce] = useState(false)
  const [particles, setParticles] = useState([])
  const [imgFallbackLevel, setImgFallbackLevel] = useState(0)
  const lastPetRef = useRef(0)

  useEffect(() => {
    const tick = () => {
      const minutes = Math.floor((Date.now() - lastActivityAt) / 60000)
      setIdleMinutes(minutes)
    }
    tick()
    const id = setInterval(tick, 15000)
    return () => clearInterval(id)
  }, [lastActivityAt])

  const mood = catMood(idleMinutes, hunger)
  const outfit = OUTFITS.find(o => o.id === equippedOutfit) || OUTFITS[0]

  useEffect(() => {
    setMessage(pickMessage(mood, {}))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mood])

  useEffect(() => {
    if (justCompletedTaskTick > 0) {
      setMessage(pickMessage(mood, { justCompletedTask: true }))
      popBounce()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [justCompletedTaskTick])

  // Сбрасываем цепочку запасных картинок при смене цвета/настроения/наряда
  useEffect(() => {
    setImgFallbackLevel(0)
  }, [catColor, mood, outfit.id])

  const popBounce = () => {
    setBounce(true)
    setTimeout(() => setBounce(false), 500)
  }

  const addParticle = (emoji) => {
    const id = Math.random().toString(36).slice(2)
    const left = 40 + Math.random() * 20
    setParticles(prev => [...prev, { id, emoji, left }])
    setTimeout(() => setParticles(prev => prev.filter(p => p.id !== id)), 900)
  }

  const handleFeed = () => {
    if (coins < FEED_COST || hunger >= 100) return
    onFeed(FEED_COST, FEED_AMOUNT)
    setMessage(pickMessage(mood, { justFed: true }))
    addParticle('🍖')
    popBounce()
  }

  const handlePet = () => {
    const now = Date.now()
    if (now - lastPetRef.current < PET_COOLDOWN_MS) return
    lastPetRef.current = now
    onPet()
    setMessage(pickMessage(mood, { justPetted: true }))
    addParticle('💗')
    popBounce()
  }

  // Цепочка запасных вариантов, если конкретной картинки ещё нет в public/cat/:
  // 1) цвет+настроение+наряд  2) цвет+настроение+обычный наряд  3) общая заглушка
  const imageChain = [
    buildCatImagePath(catColor, mood, outfit.id),
    buildCatImagePath(catColor, mood, 'standard'),
    FALLBACK_CAT_IMAGE,
  ]
  const imageSrc = imageChain[Math.min(imgFallbackLevel, imageChain.length - 1)]

  const handleImgError = () => {
    setImgFallbackLevel(lvl => Math.min(lvl + 1, imageChain.length - 1))
  }

  return (
    <div className="cat-card p-3 p-md-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="coin-badge"><i className="bi bi-coin" /> {coins}</span>
        <button className="btn btn-pill btn-outline-soft btn-sm" onClick={onOpenShop}>
          <i className="bi bi-bag-heart me-1" /> Гардероб
        </button>
      </div>

      <div className="cat-stage">
        <button
          type="button"
          className="cat-image-btn"
          onClick={handlePet}
          aria-label="Погладить котика"
          title="Погладить котика"
        >
          <img
            src={imageSrc}
            alt="Котик"
            onError={handleImgError}
            className={`cat-photo ${bounce ? 'cat-photo-bounce' : ''}`}
          />
          {particles.map(p => (
            <span key={p.id} className="particle-float" style={{ left: `${p.left}%` }}>{p.emoji}</span>
          ))}
        </button>
        <div className="small text-muted mt-1">
          <i className="bi bi-hand-index-thumb me-1" />Нажми на котика, чтобы погладить
        </div>

        <div className="speech-bubble">{message}</div>
      </div>

      <div className="mt-3">
        <div className="stat-bar-label">
          <span><i className="bi bi-egg-fried me-1" />Сытость</span>
          <span>{Math.round(hunger)}%</span>
        </div>
        <div className="stat-bar-track mb-3">
          <div className="stat-bar-fill fill-hunger" style={{ width: `${hunger}%` }} />
        </div>

        <div className="text-center mb-3">
          <button className="feed-btn" onClick={handleFeed} disabled={coins < FEED_COST || hunger >= 100}>
            <i className="bi bi-cup-straw me-2" />
            Покормить (🪙 {FEED_COST})
          </button>
          {hunger >= 100 && <div className="small text-muted mt-2">Котик наелся под завязку 😽</div>}
        </div>

        <div className="cat-color-row">
          <span className="pomo-setting-label"><i className="bi bi-palette me-1" />Окрас котика</span>
          <div className="cat-color-swatches">
            {CAT_COLORS.map(c => (
              <button
                key={c.id}
                type="button"
                className={`cat-swatch ${catColor === c.id ? 'cat-swatch-active' : ''}`}
                style={{ background: c.swatch }}
                title={c.label}
                aria-label={c.label}
                onClick={() => onChangeCatColor(c.id)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="small text-muted text-center mt-3">
        {idleMinutes < 1 ? 'Активность только что была' : `Без активности: ${idleMinutes} мин.`}
      </div>
    </div>
  )
}
