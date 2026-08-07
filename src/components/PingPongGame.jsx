import { useEffect, useRef, useState } from 'react'

const W = 300
const H = 420
const PADDLE_W = 10
const PADDLE_H = 64
const BALL_R = 7
const PLAYER_X = 14
const AI_X = W - 14 - PADDLE_W
const BASE_SPEED = 3.4
const MAX_SPEED = 7.5
const AI_SPEED = 3.1

function freshBall(direction) {
  const angle = (Math.random() * 0.6 - 0.3) // небольшой случайный угол
  return {
    x: W / 2,
    y: H / 2,
    vx: BASE_SPEED * direction,
    vy: BASE_SPEED * angle,
  }
}

export default function PingPongGame({ onEarnGameCoins, t }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const stateRef = useRef({
    playerY: H / 2 - PADDLE_H / 2,
    aiY: H / 2 - PADDLE_H / 2,
    ball: freshBall(1),
    running: false,
  })
  const [running, setRunning] = useState(false)
  const [score, setScore] = useState({ player: 0, ai: 0 })
  const [coinsFlash, setCoinsFlash] = useState(false)

  const draw = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const s = stateRef.current

    ctx.clearRect(0, 0, W, H)

    // фон
    ctx.fillStyle = '#F5F3FB'
    ctx.fillRect(0, 0, W, H)
    // центральная пунктирная линия
    ctx.strokeStyle = '#E9E4F7'
    ctx.lineWidth = 3
    ctx.setLineDash([8, 10])
    ctx.beginPath()
    ctx.moveTo(W / 2, 0)
    ctx.lineTo(W / 2, H)
    ctx.stroke()
    ctx.setLineDash([])

    // ракетка игрока
    ctx.fillStyle = '#6C5CE7'
    ctx.beginPath()
    ctx.roundRect(PLAYER_X, s.playerY, PADDLE_W, PADDLE_H, 5)
    ctx.fill()

    // ракетка ИИ
    ctx.fillStyle = '#FF7A66'
    ctx.beginPath()
    ctx.roundRect(AI_X, s.aiY, PADDLE_W, PADDLE_H, 5)
    ctx.fill()

    // мяч
    ctx.fillStyle = '#241F3D'
    ctx.beginPath()
    ctx.arc(s.ball.x, s.ball.y, BALL_R, 0, Math.PI * 2)
    ctx.fill()
  }

  const step = () => {
    const s = stateRef.current
    if (!s.running) return

    // ИИ едет за мячом с ограниченной скоростью и небольшим запаздыванием
    const aiCenter = s.aiY + PADDLE_H / 2
    const target = s.ball.y
    if (Math.abs(aiCenter - target) > 4) {
      s.aiY += Math.sign(target - aiCenter) * AI_SPEED
    }
    s.aiY = Math.max(0, Math.min(H - PADDLE_H, s.aiY))

    s.ball.x += s.ball.vx
    s.ball.y += s.ball.vy

    // отскок от верха/низа
    if (s.ball.y - BALL_R < 0 || s.ball.y + BALL_R > H) {
      s.ball.vy *= -1
      s.ball.y = Math.max(BALL_R, Math.min(H - BALL_R, s.ball.y))
    }

    // столкновение с ракеткой игрока
    if (
      s.ball.x - BALL_R < PLAYER_X + PADDLE_W &&
      s.ball.x - BALL_R > PLAYER_X - 10 &&
      s.ball.y > s.playerY && s.ball.y < s.playerY + PADDLE_H &&
      s.ball.vx < 0
    ) {
      const hitPos = (s.ball.y - (s.playerY + PADDLE_H / 2)) / (PADDLE_H / 2)
      const speed = Math.min(MAX_SPEED, Math.hypot(s.ball.vx, s.ball.vy) * 1.06)
      s.ball.vx = Math.abs(speed * 0.9)
      s.ball.vy = speed * hitPos
      s.ball.x = PLAYER_X + PADDLE_W + BALL_R
    }

    // столкновение с ракеткой ИИ
    if (
      s.ball.x + BALL_R > AI_X &&
      s.ball.x + BALL_R < AI_X + 10 &&
      s.ball.y > s.aiY && s.ball.y < s.aiY + PADDLE_H &&
      s.ball.vx > 0
    ) {
      const hitPos = (s.ball.y - (s.aiY + PADDLE_H / 2)) / (PADDLE_H / 2)
      const speed = Math.min(MAX_SPEED, Math.hypot(s.ball.vx, s.ball.vy) * 1.06)
      s.ball.vx = -Math.abs(speed * 0.9)
      s.ball.vy = speed * hitPos
      s.ball.x = AI_X - BALL_R
    }

    // гол в ворота ИИ — игрок зарабатывает монетку
    if (s.ball.x > W + BALL_R) {
      setScore(prev => ({ ...prev, player: prev.player + 1 }))
      onEarnGameCoins(1)
      setCoinsFlash(true)
      setTimeout(() => setCoinsFlash(false), 700)
      s.ball = freshBall(-1)
    }
    // гол в ворота игрока
    if (s.ball.x < -BALL_R) {
      setScore(prev => ({ ...prev, ai: prev.ai + 1 }))
      s.ball = freshBall(1)
    }

    draw()
    rafRef.current = requestAnimationFrame(step)
  }

  const start = () => {
    stateRef.current.running = true
    setRunning(true)
    rafRef.current = requestAnimationFrame(step)
  }

  const pause = () => {
    stateRef.current.running = false
    setRunning(false)
    cancelAnimationFrame(rafRef.current)
  }

  const reset = () => {
    pause()
    stateRef.current.playerY = H / 2 - PADDLE_H / 2
    stateRef.current.aiY = H / 2 - PADDLE_H / 2
    stateRef.current.ball = freshBall(Math.random() > 0.5 ? 1 : -1)
    setScore({ player: 0, ai: 0 })
    draw()
  }

  const movePlayerTo = (clientY) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scale = H / rect.height
    const y = (clientY - rect.top) * scale
    stateRef.current.playerY = Math.max(0, Math.min(H - PADDLE_H, y - PADDLE_H / 2))
    if (!stateRef.current.running) draw()
  }

  const handleMouseMove = (e) => movePlayerTo(e.clientY)
  const handleTouchMove = (e) => {
    e.preventDefault()
    if (e.touches[0]) movePlayerTo(e.touches[0].clientY)
  }

  useEffect(() => {
    draw()
    return () => cancelAnimationFrame(rafRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="panel p-3 p-md-4 mb-4">
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <div className="eyebrow">{t('pongEyebrow')}</div>
          <h2 className="panel-title mb-0"><i className="bi bi-circle-fill" style={{ fontSize: '0.7rem' }} /> {t('pongTitle')}</h2>
        </div>
        <div className="pong-score">
          <span className="pong-score-you">{score.player}</span>
          <span className="text-muted">:</span>
          <span className="pong-score-ai">{score.ai}</span>
        </div>
      </div>

      <div className="pong-canvas-wrap">
        <canvas
          ref={canvasRef}
          width={W}
          height={H}
          className="pong-canvas"
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
          onTouchStart={handleTouchMove}
        />
        {coinsFlash && <span className="pong-coin-flash">+1 🪙</span>}
      </div>

      <div className="d-flex gap-2 justify-content-center mt-3">
        <button className="btn btn-pill btn-primary-soft" onClick={running ? pause : start}>
          <i className={`bi ${running ? 'bi-pause-fill' : 'bi-play-fill'} me-1`} />
          {running ? t('pause') : t('start')}
        </button>
        <button className="btn btn-pill btn-outline-soft" onClick={reset}>
          <i className="bi bi-arrow-counterclockwise me-1" />{t('reset')}
        </button>
      </div>

      <p className="small text-muted text-center mt-3 mb-0">
        {t('pongHint')}
      </p>
    </div>
  )
}
