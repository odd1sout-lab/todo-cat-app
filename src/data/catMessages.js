// Настроения котика (mood): happy, calm, hungry, sad, angry — под них ты готовишь картинки.
// idleMinutes — сколько минут прошло без выполненных задач.
// hunger — уровень сытости от 0 до 100.

export function catMood(idleMinutes, hunger) {
  if (hunger <= 15 && idleMinutes >= 45) return 'angry'
  if (idleMinutes >= 60) return 'sad'
  if (hunger <= 30) return 'hungry'
  if (idleMinutes >= 20) return 'calm'
  if (hunger > 70) return 'happy'
  return 'calm'
}

export const HAPPY_MESSAGES = [
  'Ты сегодня просто огонь! Мур~',
  'Ещё одна задача побеждена! Я горжусь тобой.',
  'Вжух — и готово! Погладь меня в награду 🐾',
  'Обожаю, когда ты продуктивный. Так держать!',
  'Мяу! Это было впечатляюще.',
]

export const CALM_MESSAGES = [
  'Есть ещё дела на сегодня? Я подожду тут, на подоконнике.',
  'Мур... чем займёмся дальше?',
  'Я слежу за тобой одним глазом, всё в порядке 😼',
  'Может, разобьём большую задачу на маленькие?',
]

export const HUNGRY_MESSAGES = [
  'Кажется, у меня в мисочке пустовато... не забудь про меня 🍽️',
  'Животик слегка урчит... есть что-нибудь вкусненькое?',
  'Мяу! Пора бы уже перекусить котику.',
]

export const SAD_MESSAGES = [
  'Я уже весь извёлся от скуки... пожалуйста, сделай хоть что-то 😿',
  'Без тебя тут так тихо и грустно... я начинаю переживать.',
  'Ты обо мне забыл? И о делах тоже... мне очень одиноко.',
  'Я свернулся в клубочек и жду хоть каких-то новостей от тебя 😢',
]

export const ANGRY_MESSAGES = [
  'Фыр! Совсем меня забросил — и голодного, и одинокого!',
  'Я не в духе. Покорми меня и вернись к делам, пожалуйста!',
  'Хвост трубой от возмущения! Займись мной и задачами уже.',
  'Кажется, кто-то совсем забыл про своего котика...',
]

export const FED_MESSAGES = [
  'Ммм, вкуснятина! Спасибо тебе! 😻',
  'Ты лучший! Теперь у меня полно сил на мурчание.',
  'Вжух, всё съел! Готов болеть за тебя дальше!',
  'Няшка вкусная была. Обнимаю тебя лапками 🐾',
]

export const PET_MESSAGES = [
  'Мурррр... ещё, ещё! 😻',
  'Обожаю, когда меня гладят!',
  'Мур-мур-мур, тепло и приятно.',
  'Твоя рука просто волшебная, мур~',
  'Промурчал бы весь день, если бы мог.',
]

const MOOD_POOLS = {
  happy: HAPPY_MESSAGES,
  calm: CALM_MESSAGES,
  hungry: HUNGRY_MESSAGES,
  sad: SAD_MESSAGES,
  angry: ANGRY_MESSAGES,
}

export function pickMessage(mood, flags = {}) {
  const { justCompletedTask, justFed, justPetted } = flags
  if (justFed) return FED_MESSAGES[Math.floor(Math.random() * FED_MESSAGES.length)]
  if (justPetted) return PET_MESSAGES[Math.floor(Math.random() * PET_MESSAGES.length)]
  if (justCompletedTask) return HAPPY_MESSAGES[Math.floor(Math.random() * HAPPY_MESSAGES.length)]
  const pool = MOOD_POOLS[mood] || CALM_MESSAGES
  return pool[Math.floor(Math.random() * pool.length)]
}
