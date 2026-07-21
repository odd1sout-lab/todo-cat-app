import { useState } from 'react'
import { relativeDayLabel, isPastDeadline } from '../utils/date'
import { CATEGORIES, getCategory } from '../data/categories'

const COIN_REWARD = 5

const PRIORITIES = [
  { id: 'low', label: 'Легко', icon: 'bi-leaf' },
  { id: 'medium', label: 'Средне', icon: 'bi-lightning-charge' },
  { id: 'high', label: 'Важно', icon: 'bi-fire' },
]

function TaskRow({ task, onToggle, onDelete }) {
  const overdue = !task.done && isPastDeadline(task)
  const category = getCategory(task.category)
  return (
    <li className={`task-item priority-${task.priority} ${task.done ? 'task-done' : ''}`}>
      <div className="d-flex align-items-center gap-3 flex-grow-1 min-w-0">
        <button
          type="button"
          className={`task-check ${task.done ? 'checked' : ''}`}
          onClick={() => onToggle(task.id)}
          aria-label={task.done ? 'Отменить выполнение' : 'Отметить выполненным'}
        >
          {task.done && <i className="bi bi-check-lg" />}
        </button>
        <div className="min-w-0">
          <div className="task-text text-truncate">{task.text}</div>
          <div className="d-flex align-items-center gap-2 mt-1 flex-wrap">
            <span className="task-category-chip" style={{ background: `${category.color}22`, color: category.color }}>
              <i className={`bi ${category.icon} me-1`} />{category.label}
            </span>
            <span className={`task-chip chip-${task.priority}`}>
              {PRIORITIES.find(p => p.id === task.priority)?.label}
            </span>
            {task.dueTime && (
              <span className={`task-time-chip ${overdue ? 'task-time-chip-overdue' : ''}`}>
                <i className={`bi ${overdue ? 'bi-exclamation-triangle-fill' : 'bi-alarm'} me-1`} />
                {task.dueTime}{overdue && ' · просрочено'}
              </span>
            )}
          </div>
        </div>
      </div>
      <button className="task-delete-btn" onClick={() => onDelete(task.id)} aria-label="Удалить задачу">
        <i className="bi bi-trash3" />
      </button>
    </li>
  )
}

export default function TodoList({ tasks, selectedDate, onAdd, onToggle, onDelete }) {
  const [text, setText] = useState('')
  const [priority, setPriority] = useState('medium')
  const [category, setCategory] = useState('work')
  const [dueTime, setDueTime] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')

  const submit = (e) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    onAdd(trimmed, priority, dueTime || null, category)
    setText('')
    setDueTime('')
  }

  const visibleTasks = filterCategory === 'all' ? tasks : tasks.filter(t => (t.category || 'other') === filterCategory)
  const activeTasks = [...visibleTasks.filter(t => !t.done)].sort((a, b) => {
    const ta = a.dueTime || '99:99'
    const tb = b.dueTime || '99:99'
    return ta.localeCompare(tb)
  })
  const doneTasks = visibleTasks.filter(t => t.done)
  const usedCategories = [...new Set(tasks.map(t => t.category || 'other'))]
  const dayLabel = relativeDayLabel(selectedDate)
  const isPast = (() => {
    const d = new Date(selectedDate)
    d.setHours(0, 0, 0, 0)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return d < today
  })()

  return (
    <div className="panel p-3 p-md-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <div className="eyebrow">План на день</div>
          <h2 className="panel-title mb-0"><i className="bi bi-check2-square" /> {dayLabel}</h2>
        </div>
        {activeTasks.length > 0 && (
          <span className="task-chip chip-medium">{activeTasks.length} в работе</span>
        )}
      </div>

      <form onSubmit={submit} className="mb-3">
        <div className="d-flex gap-2 mb-2">
          <input
            type="text"
            className="form-control task-form-input"
            placeholder={isPast ? 'Добавить задним числом...' : 'Что нужно сделать?'}
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <button className="btn btn-pill btn-primary-soft px-3" type="submit">
            <i className="bi bi-plus-lg" />
          </button>
        </div>
        <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
          <div className="priority-toggle">
            {PRIORITIES.map(p => (
              <button
                type="button"
                key={p.id}
                className={priority === p.id ? `active-${p.id}` : ''}
                onClick={() => setPriority(p.id)}
              >
                <i className={`bi ${p.icon} me-1`} />{p.label}
              </button>
            ))}
          </div>
          <label className="task-time-input">
            <i className="bi bi-alarm" />
            <input
              type="time"
              value={dueTime}
              onChange={e => setDueTime(e.target.value)}
              aria-label="Время дедлайна (необязательно)"
            />
            {dueTime && (
              <button type="button" className="task-time-clear" onClick={() => setDueTime('')} aria-label="Убрать время">
                <i className="bi bi-x" />
              </button>
            )}
          </label>
        </div>
        <select
          className="form-select category-select"
          value={category}
          onChange={e => setCategory(e.target.value)}
          aria-label="Категория задачи"
        >
          {CATEGORIES.map(c => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </form>

      {usedCategories.length > 1 && (
        <div className="category-filter-row mb-3">
          <button
            type="button"
            className={`category-filter-chip ${filterCategory === 'all' ? 'category-filter-active' : ''}`}
            onClick={() => setFilterCategory('all')}
          >
            Все
          </button>
          {CATEGORIES.filter(c => usedCategories.includes(c.id)).map(c => (
            <button
              key={c.id}
              type="button"
              className={`category-filter-chip ${filterCategory === c.id ? 'category-filter-active' : ''}`}
              onClick={() => setFilterCategory(c.id)}
            >
              <i className={`bi ${c.icon} me-1`} />{c.label}
            </button>
          ))}
        </div>
      )}

      {activeTasks.length === 0 && doneTasks.length === 0 && (
        <div className="empty-state">
          <span className="empty-emoji">🗂️</span>
          {isPast ? 'В этот день задач не было.' : 'Пока пусто. Добавь задачу — котик ждёт!'}
        </div>
      )}

      <ul className="list-unstyled d-flex flex-column gap-2 mb-2">
        {activeTasks.map(task => (
          <TaskRow key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
        ))}
      </ul>

      {doneTasks.length > 0 && (
        <details className="mt-2" open={isPast}>
          <summary className="small text-muted mb-2" style={{ cursor: 'pointer' }}>
            Выполненные ({doneTasks.length})
          </summary>
          <ul className="list-unstyled d-flex flex-column gap-2">
            {doneTasks.map(task => (
              <TaskRow key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
            ))}
          </ul>
        </details>
      )}

      <p className="small text-muted mt-3 mb-0">
        <i className="bi bi-coin me-1" />Честно выполненная в срок задача — {COIN_REWARD} монет котику. Если отметить после дедлайна — монет не будет.
      </p>
    </div>
  )
}

export { COIN_REWARD }
