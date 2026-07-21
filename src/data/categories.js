export const CATEGORIES = [
  { id: 'work', label: 'Работа', icon: 'bi-briefcase', color: '#6C5CE7' },
  { id: 'study', label: 'Учёба', icon: 'bi-book', color: '#2FBF96' },
  { id: 'health', label: 'Здоровье', icon: 'bi-heart-pulse', color: '#FF7A66' },
  { id: 'home', label: 'Дом', icon: 'bi-house', color: '#FFB648' },
  { id: 'personal', label: 'Личное', icon: 'bi-person', color: '#FF6FA5' },
  { id: 'other', label: 'Другое', icon: 'bi-three-dots', color: '#9B9BA8' },
]

export function getCategory(id) {
  return CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1]
}
