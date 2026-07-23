const BASE = import.meta.env.BASE_URL

export const AMBIENT_TRACKS = {
  rain: { label: 'Дождь', icon: 'bi-cloud-rain-heavy', src: `${BASE}sounds/rain.mp3` },
  forest: { label: 'Лес', icon: 'bi-tree', src: `${BASE}sounds/forest.mp3` },
  fire: { label: 'Костёр', icon: 'bi-fire', src: `${BASE}sounds/fire.mp3` },
  waterfall: { label: 'Водопад', icon: 'bi-droplet-half', src: `${BASE}sounds/waterfall.mp3` },
}
