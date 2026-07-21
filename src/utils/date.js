// Утилиты для работы с датами без внешних библиотек.
// Везде используем локальное время устройства и ISO-строку формата YYYY-MM-DD как ключ дня.

export function toISODate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function fromISODate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(date, n) {
  const next = new Date(date)
  next.setDate(next.getDate() + n)
  return next
}

// Понедельник = начало недели
export function startOfWeek(date) {
  const d = new Date(date)
  const day = d.getDay() // 0 = вс, 1 = пн ...
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

export function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

const WEEKDAY_SHORT = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
const MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
const MONTHS_SHORT = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']

export function weekdayShort(date) {
  return WEEKDAY_SHORT[date.getDay()]
}

export function formatFullDate(date) {
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`
}

export function formatMonthYear(date) {
  return `${MONTHS_SHORT[date.getMonth()]}. ${date.getFullYear()}`
}

export function relativeDayLabel(date) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(date)
  target.setHours(0, 0, 0, 0)
  const diffDays = Math.round((target - today) / 86400000)
  if (diffDays === 0) return 'Сегодня'
  if (diffDays === 1) return 'Завтра'
  if (diffDays === -1) return 'Вчера'
  return `${weekdayShort(target)}, ${formatFullDate(target)}`
}

// Дедлайн задачи. Если указано конкретное время — сравниваем именно с ним.
// Если времени нет — считаем дедлайном конец дня (23:59), чтобы задачи без
// времени не считались просроченными раньше срока в течение своего же дня.
export function isPastDeadline(task) {
  if (!task.dueDate) return false
  const due = fromISODate(task.dueDate)
  if (task.dueTime) {
    const [h, m] = task.dueTime.split(':').map(Number)
    due.setHours(h, m, 0, 0)
  } else {
    due.setHours(23, 59, 59, 999)
  }
  return due.getTime() < Date.now()
}

// Сколько дней осталось до даты события (для вкладки "События"):
// 0 = сегодня, положительное = впереди, отрицательное = уже прошло.
export function daysUntil(dateISO) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = fromISODate(dateISO)
  target.setHours(0, 0, 0, 0)
  return Math.round((target - today) / 86400000)
}
