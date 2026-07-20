// Фоновые звуки для помодоро/табаты. Файлы сюда НЕ включены (чтобы не нарушать
// авторские права и не полагаться на нестабильные внешние ссылки) — просто положи
// свои mp3 в public/sounds/ с такими именами, и плеер сразу их подхватит.
//
// Где бесплатно и легально взять звуки: pixabay.com/sound-effects/
// (не требует указания авторства, можно использовать где угодно).
//   Дождь:     https://pixabay.com/sound-effects/search/rain/
//   Лес:       https://pixabay.com/sound-effects/search/forest/
//   Костёр:    https://pixabay.com/sound-effects/search/campfire/
//   Водопад:   https://pixabay.com/sound-effects/search/waterfall/

// Используем import.meta.env.BASE_URL, чтобы пути работали и локально,
// и на GitHub Pages (где сайт живёт в подпапке /название-репозитория/).
const BASE = import.meta.env.BASE_URL

export const AMBIENT_TRACKS = {
  rain: { label: 'Дождь', icon: 'bi-cloud-rain-heavy', src: `${BASE}sounds/rain.mp3` },
  forest: { label: 'Лес', icon: 'bi-tree', src: `${BASE}sounds/forest.mp3` },
  fire: { label: 'Костёр', icon: 'bi-fire', src: `${BASE}sounds/fire.mp3` },
  waterfall: { label: 'Водопад', icon: 'bi-droplet-half', src: `${BASE}sounds/waterfall.mp3` },
}
