// labelKey ссылается на ключ в src/i18n.js — так название категории
// переключается вместе с языком интерфейса.
export const CATEGORIES = [
  { id: 'work', labelKey: 'categoryWork', icon: 'bi-briefcase', color: '#6C5CE7' },
  { id: 'study', labelKey: 'categoryStudy', icon: 'bi-book', color: '#2FBF96' },
  { id: 'health', labelKey: 'categoryHealth', icon: 'bi-heart-pulse', color: '#FF7A66' },
  { id: 'home', labelKey: 'categoryHome', icon: 'bi-house', color: '#FFB648' },
  { id: 'personal', labelKey: 'categoryPersonal', icon: 'bi-person', color: '#FF6FA5' },
  { id: 'other', labelKey: 'categoryOther', icon: 'bi-three-dots', color: '#9B9BA8' },
]

export function getCategory(id) {
  return CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1]
}
