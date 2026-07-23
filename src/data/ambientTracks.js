const BASE = import.meta.env.BASE_URL

// labelKey ссылается на ключ в src/i18n.js — так название звука
// переключается вместе с языком интерфейса.
export const AMBIENT_TRACKS = {
  rain: { labelKey: 'soundRain', icon: 'bi-cloud-rain-heavy', src: `${BASE}sounds/rain.mp3` },
  forest: { labelKey: 'soundForest', icon: 'bi-tree', src: `${BASE}sounds/forest.mp3` },
  fire: { labelKey: 'soundFire', icon: 'bi-fire', src: `${BASE}sounds/fire.mp3` },
  waterfall: { labelKey: 'soundWaterfall', icon: 'bi-droplet-half', src: `${BASE}sounds/waterfall.mp3` },
}
