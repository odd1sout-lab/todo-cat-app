export const CAT_COLORS = [
  { id: 'orange', label: 'Рыжий', swatch: '#E8934A' },
  { id: 'grey', label: 'Серый', swatch: '#9B9BA8' },
  { id: 'white', label: 'Белый', swatch: '#F2F0EA' },
  { id: 'black', label: 'Чёрный', swatch: '#2B2A2E' },
]

export const CAT_MOODS = ['sad', 'happy', 'calm', 'angry', 'hungry']

export const CAT_STYLES = ['standard', 'tie', 'smart', 'king', 'magician', 'british', 'party', 'bad', 'japan']

export const FALLBACK_CAT_IMAGE = `${import.meta.env.BASE_URL}cat/cat.png`

export function buildCatImagePath(color, mood, style) {
  return `${import.meta.env.BASE_URL}cat/${color}_${mood}_${style}.png`
}
