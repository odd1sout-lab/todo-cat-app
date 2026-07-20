// Картинки котика собираются по шаблону имени файла:
//   {цвет}_{настроение}_{образ}.png
// Например: orange_sad_standard.png, grey_happy_king.png
//
// Просто положи готовые файлы в папку public/cat/ с такими именами —
// приложение подставит нужную картинку само, в зависимости от выбранного
// цвета котика, его текущего настроения и надетого наряда.

export const CAT_COLORS = [
  { id: 'orange', label: 'Рыжий', swatch: '#E8934A' },
  { id: 'grey', label: 'Серый', swatch: '#9B9BA8' },
  { id: 'white', label: 'Белый', swatch: '#F2F0EA' },
  { id: 'black', label: 'Чёрный', swatch: '#2B2A2E' },
]

// Настроения — должны совпадать с catMood() в catMessages.js
export const CAT_MOODS = ['sad', 'happy', 'calm', 'angry', 'hungry']

// Образы — должны совпадать с id в data/outfits.js
export const CAT_STYLES = ['standard', 'tie', 'smart', 'king', 'magician', 'british', 'party', 'bad', 'japan']

// Запасная картинка, если нужного файла ещё нет в public/cat/
// Используем import.meta.env.BASE_URL, чтобы путь работал и локально,
// и на GitHub Pages (где сайт живёт в подпапке /название-репозитория/).
export const FALLBACK_CAT_IMAGE = `${import.meta.env.BASE_URL}cat/cat.png`

export function buildCatImagePath(color, mood, style) {
  return `${import.meta.env.BASE_URL}cat/${color}_${mood}_${style}.png`
}
