export function catMood(idleMinutes, hunger) {
  if (hunger <= 15 && idleMinutes >= 45) return 'angry'
  if (idleMinutes >= 60) return 'sad'
  if (hunger <= 30) return 'hungry'
  if (idleMinutes >= 20) return 'calm'
  if (hunger > 70) return 'happy'
  return 'calm'
}

const MESSAGES = {
  ru: {
    happy: [
      'Ты сегодня просто огонь! Мур~',
      'Ещё одна задача побеждена! Я горжусь тобой.',
      'Вжух — и готово! Погладь меня в награду 🐾',
      'Обожаю, когда ты продуктивный. Так держать!',
      'Мяу! Это было впечатляюще.',
    ],
    calm: [
      'Есть ещё дела на сегодня? Я подожду тут, на подоконнике.',
      'Мур... чем займёмся дальше?',
      'Я слежу за тобой одним глазом, всё в порядке 😼',
      'Может, разобьём большую задачу на маленькие?',
    ],
    hungry: [
      'Кажется, у меня в мисочке пустовато... не забудь про меня 🍽️',
      'Животик слегка урчит... есть что-нибудь вкусненькое?',
      'Мяу! Пора бы уже перекусить котику.',
    ],
    sad: [
      'Я уже весь извёлся от скуки... пожалуйста, сделай хоть что-то 😿',
      'Без тебя тут так тихо и грустно... я начинаю переживать.',
      'Ты обо мне забыл? И о делах тоже... мне очень одиноко.',
      'Я свернулся в клубочек и жду хоть каких-то новостей от тебя 😢',
    ],
    angry: [
      'Фыр! Совсем меня забросил — и голодного, и одинокого!',
      'Я не в духе. Покорми меня и вернись к делам, пожалуйста!',
      'Хвост трубой от возмущения! Займись мной и задачами уже.',
      'Кажется, кто-то совсем забыл про своего котика...',
    ],
    fed: [
      'Ммм, вкуснятина! Спасибо тебе! 😻',
      'Ты лучший! Теперь у меня полно сил на мурчание.',
      'Вжух, всё съел! Готов болеть за тебя дальше!',
      'Няшка вкусная была. Обнимаю тебя лапками 🐾',
    ],
    pet: [
      'Мурррр... ещё, ещё! 😻',
      'Обожаю, когда меня гладят!',
      'Мур-мур-мур, тепло и приятно.',
      'Твоя рука просто волшебная, мур~',
      'Промурчал бы весь день, если бы мог.',
    ],
  },
  en: {
    happy: [
      "You're on fire today! Purr~",
      'Another task defeated! I\u2019m so proud of you.',
      'Zoom — and done! Pet me as a reward 🐾',
      'I love it when you\u2019re productive. Keep going!',
      'Meow! That was impressive.',
    ],
    calm: [
      'Got more to do today? I\u2019ll wait here on the windowsill.',
      'Purr... what\u2019s next?',
      'I\u2019m keeping one eye on you, all good 😼',
      'Maybe split that big task into smaller ones?',
    ],
    hungry: [
      'My bowl looks a bit empty... don\u2019t forget about me 🍽️',
      'My tummy is rumbling a little... got any treats?',
      'Meow! Time for a snack, don\u2019t you think?',
    ],
    sad: [
      'I\u2019m so bored I could cry... please do something 😿',
      'It\u2019s so quiet and sad without you... I\u2019m starting to worry.',
      'Did you forget about me? And your tasks too... I feel so lonely.',
      'I\u2019ve curled up in a ball waiting for any news from you 😢',
    ],
    angry: [
      'Hmph! You\u2019ve completely neglected me — hungry AND lonely!',
      'I\u2019m not in the mood. Feed me and get back to your tasks, please!',
      'Tail puffed up with annoyance! Pay attention to me and your tasks already.',
      'Looks like someone completely forgot about their cat...',
    ],
    fed: [
      'Mmm, delicious! Thank you! 😻',
      'You\u2019re the best! Now I\u2019ve got plenty of energy to purr.',
      'Nom nom, all gone! Ready to cheer you on!',
      'That snack was great. Hugging you with my paws 🐾',
    ],
    pet: [
      'Purrrr... more, more! 😻',
      'I love being petted!',
      'Purr purr purr, so warm and nice.',
      'Your hand is pure magic, purr~',
      'I could purr all day if I could.',
    ],
  },
}

export function pickMessage(mood, flags = {}, lang = 'ru') {
  const pools = MESSAGES[lang] || MESSAGES.ru
  const { justCompletedTask, justFed, justPetted } = flags
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

  if (justFed) return pick(pools.fed)
  if (justPetted) return pick(pools.pet)
  if (justCompletedTask) return pick(pools.happy)
  return pick(pools[mood] || pools.calm)
}
