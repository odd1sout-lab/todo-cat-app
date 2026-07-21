import { useState } from 'react'
import { toISODate, daysUntil, formatFullDate, fromISODate } from '../utils/date'

const EMOJIS = ['🎉', '🎂', '✈️', '📅', '💼', '🎓', '❤️', '🏆']

function countdownLabel(diff) {
  if (diff === 0) return 'Сегодня!'
  if (diff === 1) return 'Завтра'
  if (diff === -1) return 'Вчера'
  if (diff > 1) return `Через ${diff} дн.`
  return `${Math.abs(diff)} дн. назад`
}

export default function EventsCalendar({ events, onAdd, onDelete }) {
  const [name, setName] = useState('')
  const [date, setDate] = useState(() => toISODate(new Date()))
  const [emoji, setEmoji] = useState(EMOJIS[0])

  const submit = (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed || !date) return
    onAdd(trimmed, date, emoji)
    setName('')
  }

  const withDiff = events
    .map(ev => ({ ...ev, diff: daysUntil(ev.date) }))
    .sort((a, b) => a.diff - b.diff)

  const upcoming = withDiff.filter(ev => ev.diff >= 0)
  const past = withDiff.filter(ev => ev.diff < 0)

  return (
    <div className="panel p-3 p-md-4">
      <div className="mb-3">
        <div className="eyebrow">Важные даты</div>
        <h2 className="panel-title mb-0"><i className="bi bi-calendar-heart" /> События</h2>
      </div>

      <form onSubmit={submit} className="mb-4">
        <div className="d-flex gap-2 mb-2">
          <input
            type="text"
            className="form-control task-form-input"
            placeholder="Название события (день рождения, экзамен...)"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div className="d-flex gap-2 align-items-center flex-wrap">
          <input
            type="date"
            className="form-control task-form-input event-date-input"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
          <div className="event-emoji-picker">
            {EMOJIS.map(em => (
              <button
                type="button"
                key={em}
                className={`event-emoji-btn ${emoji === em ? 'event-emoji-active' : ''}`}
                onClick={() => setEmoji(em)}
              >
                {em}
              </button>
            ))}
          </div>
          <button className="btn btn-pill btn-primary-soft px-3 ms-auto" type="submit">
            <i className="bi bi-plus-lg me-1" />Добавить
          </button>
        </div>
      </form>

      {events.length === 0 && (
        <div className="empty-state">
          <span className="empty-emoji">📅</span>
          Пока нет событий. Добавь день рождения, экзамен или поездку — увидишь обратный отсчёт.
        </div>
      )}

      {upcoming.length > 0 && (
        <ul className="list-unstyled d-flex flex-column gap-2 mb-3">
          {upcoming.map(ev => (
            <li key={ev.id} className={`event-item ${ev.diff === 0 ? 'event-item-today' : ''}`}>
              <span className="event-emoji">{ev.emoji}</span>
              <div className="flex-grow-1 min-w-0">
                <div className="task-text text-truncate">{ev.name}</div>
                <div className="small text-muted">{formatFullDate(fromISODate(ev.date))}</div>
              </div>
              <span className="event-countdown">{countdownLabel(ev.diff)}</span>
              <button className="task-delete-btn" onClick={() => onDelete(ev.id)} aria-label="Удалить событие">
                <i className="bi bi-trash3" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {past.length > 0 && (
        <details>
          <summary className="small text-muted mb-2" style={{ cursor: 'pointer' }}>
            Прошедшие ({past.length})
          </summary>
          <ul className="list-unstyled d-flex flex-column gap-2">
            {past.map(ev => (
              <li key={ev.id} className="event-item event-item-past">
                <span className="event-emoji">{ev.emoji}</span>
                <div className="flex-grow-1 min-w-0">
                  <div className="task-text text-truncate">{ev.name}</div>
                  <div className="small text-muted">{formatFullDate(fromISODate(ev.date))}</div>
                </div>
                <span className="event-countdown">{countdownLabel(ev.diff)}</span>
                <button className="task-delete-btn" onClick={() => onDelete(ev.id)} aria-label="Удалить событие">
                  <i className="bi bi-trash3" />
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  )
}
