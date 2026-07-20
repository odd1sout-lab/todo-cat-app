import { addDays, formatMonthYear, isSameDay, toISODate, weekdayShort } from '../utils/date'

export default function WeekCalendar({ weekStart, selectedDateISO, taskCounts, onSelectDate, onPrevWeek, onNextWeek, onToday, onJumpToDate }) {
  const today = new Date()
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  return (
    <div className="calendar-panel mb-3">
      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2">
          <button className="btn-ghost-icon btn-ghost-icon-sm" onClick={onPrevWeek} aria-label="Предыдущая неделя">
            <i className="bi bi-chevron-left" />
          </button>
          <span className="calendar-month text-capitalize">{formatMonthYear(weekStart)}</span>
          <button className="btn-ghost-icon btn-ghost-icon-sm" onClick={onNextWeek} aria-label="Следующая неделя">
            <i className="bi bi-chevron-right" />
          </button>
        </div>
        <div className="d-flex gap-2">
          <label className="btn btn-pill btn-outline-soft btn-sm calendar-jump-btn mb-0">
            <i className="bi bi-calendar3 me-1" />Выбрать дату
            <input
              type="date"
              className="calendar-jump-input"
              value={selectedDateISO}
              onChange={e => e.target.value && onJumpToDate(e.target.value)}
              aria-label="Перейти к дате"
            />
          </label>
          <button className="btn btn-pill btn-outline-soft btn-sm" onClick={onToday}>
            Сегодня
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        {days.map(day => {
          const iso = toISODate(day)
          const isSelected = iso === selectedDateISO
          const isToday = isSameDay(day, today)
          const counts = taskCounts[iso] || { total: 0, done: 0 }
          return (
            <button
              key={iso}
              type="button"
              className={`calendar-day ${isSelected ? 'calendar-day-selected' : ''} ${isToday ? 'calendar-day-today' : ''}`}
              onClick={() => onSelectDate(iso)}
            >
              <span className="calendar-weekday">{weekdayShort(day)}</span>
              <span className="calendar-date">{day.getDate()}</span>
              {counts.total > 0 && (
                <span className="calendar-count">
                  {counts.done === counts.total ? (
                    <i className="bi bi-check-circle-fill" />
                  ) : (
                    `${counts.total - counts.done}`
                  )}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
