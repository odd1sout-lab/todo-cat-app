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

const WEEKDAY_SHORT = { ru: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'], en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] }
const MONTHS = {
  ru: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
}
const MONTHS_SHORT = {
  ru: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
}

export function weekdayShort(date, lang = 'ru') {
  return (WEEKDAY_SHORT[lang] || WEEKDAY_SHORT.ru)[date.getDay()]
}

export function formatFullDate(date, lang = 'ru') {
  return `${date.getDate()} ${(MONTHS[lang] || MONTHS.ru)[date.getMonth()]}`
}

export function formatMonthYear(date, lang = 'ru') {
  return `${(MONTHS_SHORT[lang] || MONTHS_SHORT.ru)[date.getMonth()]}. ${date.getFullYear()}`
}

export function relativeDayLabel(date, lang = 'ru') {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(date)
  target.setHours(0, 0, 0, 0)
  const diffDays = Math.round((target - today) / 86400000)
  if (lang === 'en') {
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays === -1) return 'Yesterday'
    return `${weekdayShort(target, lang)}, ${formatFullDate(target, lang)}`
  }
  if (diffDays === 0) return 'Сегодня'
  if (diffDays === 1) return 'Завтра'
  if (diffDays === -1) return 'Вчера'
  return `${weekdayShort(target, lang)}, ${formatFullDate(target, lang)}`
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

// Сколько дней завершено, текущая серия дней подряд, процент выполнения —
// для ежедневных (повторяющихся) задач.
export function computeRecurringStats(task) {
  const start = fromISODate(task.dueDate)
  start.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const totalDays = Math.max(1, Math.round((today - start) / 86400000) + 1)
  const completedSet = new Set(task.completedDates || [])
  const doneDays = completedSet.size
  const percent = Math.min(100, Math.round((doneDays / totalDays) * 100))

  let streak = 0
  let cursor = new Date(today)
  if (!completedSet.has(toISODate(cursor))) cursor = addDays(cursor, -1)
  while (completedSet.has(toISODate(cursor))) {
    streak++
    cursor = addDays(cursor, -1)
  }
  return { totalDays, doneDays, percent, streak }
}
