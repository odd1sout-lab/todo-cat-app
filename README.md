# Кот-компаньон

Планируй дела, работай по таймеру и заботься о виртуальном коте. Выполняй задачи, зарабатывай монеты и покупай коту наряды. Приложение создано на React и Bootstrap 5. Его можно установить на телефон и использовать офлайн.

## English

# Cat Companion

Plan your day, use the timers, and look after a virtual cat. Complete tasks, earn coins, and buy outfits for your cat. Built with React and Bootstrap 5, the app can be installed on your phone and used offline.

## Как это работает

- **Задачи**: добавляй, отмечай выполненными, удаляй. За каждую выполненную задачу — 5 монет.
- **Помодоро**: 25 минут работы / 5 минут отдыха. Завершённая рабочая сессия — 8 монет.
- **Котик**: реагирует на твою активность. Если давно ничего не делал — начинает грустить и просить тебя вернуться к делам. Если активно выполняешь задачи — радуется и хвалит.
- **Магазин нарядов**: трать монеты на аутфиты для котика (бантик, корона, очки и т.д.).
- **Данные**: сохраняются в браузере на устройстве. Кнопки «Экспорт JSON» и «Импорт JSON» помогут сделать резервную копию или перенести данные на другое устройство.

## How it works

- **Tasks**: add, complete, or delete tasks. Earn 5 coins for each completed task.
- **Pomodoro**: work for 25 minutes, then take a 5-minute break. Earn 8 coins for each completed work session.
- **Cat**: its mood changes with your activity. Spend coins on outfits like a bow tie, crown, or glasses.
- **Data**: saved in your browser. Use “Export JSON” to make a backup or “Import JSON” to restore or transfer your data.

## Запуск локально

```bash
npm install
npm run dev
```

Откроется на `http://localhost:5173`.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Сборка

```bash
npm run build
```

Готовые файлы окажутся в папке `dist/`.

## Build

```bash
npm run build
```

The built files will be in the `dist/` folder.

## Деплой на GitHub Pages

### Вариант 1 — автоматически (рекомендуется)

1. Создай новый репозиторий на GitHub, например `todo-cat-app`.
2. Залей в него этот проект:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/odd1sout-lab/todo-cat-app.git
   git push -u origin main
   ```
3. В репозитории зайди в Settings → Pages и в разделе Build and deployment выбери источник GitHub Actions.
4. Готово — при каждом пуше в main workflow из `.github/workflows/deploy.yml` сам соберёт проект и опубликует его. Сайт появится по адресу вида `https://ТВОЙ_НИК.github.io/todo-cat-app/`.

### Вариант 2 — вручную

```bash
npm run build
npx gh-pages -d dist
```
(предварительно `npm install gh-pages --save-dev`, и в Settings → Pages указать источник — ветку `gh-pages`).

### Важно про base в vite.config.js

Если название репозитория будет отличаться от `todo-cat-app`, менять `base` в `vite.config.js` не нужно — он уже стоит как `'./'` (относительные пути), это работает для любого имени репозитория и вложенности.

### Note about `base` in vite.config.js

You do not need to change `base` if your repository has a different name. It is already set to `'./'`, which works for different repository names and nested paths.

## Установка как приложение на телефон

После публикации на GitHub Pages открой сайт в браузере телефона:
- Android (Chrome): появится баннер «Добавить на главный экран» или пункт в меню (⋮) → «Установить приложение».
- iPhone (Safari): кнопка «Поделиться» → «На экран “Домой”».

Сайт откроется как отдельное приложение, без адресной строки браузера, и будет работать офлайн (данные всё равно хранятся локально на устройстве).

## Install on your phone

After publishing the site, open it in your phone's browser. On Android, choose “Install app” or “Add to Home screen” from the menu. On iPhone, tap Share → “Add to Home Screen” in Safari. The app can work offline, and your data stays on your device.

## Структура проекта

```
src/
  components/
    TodoList.jsx        — список задач
    PomodoroTimer.jsx   — таймер помодоро
    VirtualCat.jsx       — виртуальный котик и его реплики
    CatShop.jsx          — магазин нарядов
  data/
    catMessages.js       — фразы котика (радость / грусть / укор)
    outfits.js            — список нарядов и цен
  hooks/
    useJsonStore.js       — хранение данных в JSON (localStorage + экспорт/импорт файла)
  App.jsx
  main.jsx
public/
  icons/                 — иконки для PWA
.github/workflows/deploy.yml — автодеплой на GitHub Pages
```

## Что нового в этой версии

- **Нижние вкладки** (как в мобильных приложениях): Задачи, Помодоро, Табата, Котик.
- **Тёмная/светлая тема** — переключается в настройках (шестерёнка в шапке), выбор запоминается.
- **Табата-таймер** — работа/отдых/раунды регулируются прямо в приложении (кнопка со слайдерами ⚙️).
- **Помодоро** тоже с гибкими настройками: длительность фокуса, короткого и длинного отдыха, количество раундов до длинного перерыва.
- **Календарь** — кнопка «Выбрать дату» открывает системный календарь телефона/браузера, можно сразу прыгнуть на любой день в любом месяце.
- **Котик по картинкам** — цвет, настроение и наряд подставляются картинкой по имени файла (см. ниже).
- **Фоновые звуки** (дождь / лес / костёр / водопад) — плеер уже готов, файлы нужно положить самому (см. ниже).

## What's new in this version

- **Bottom tabs** for Tasks, Pomodoro, Tabata, and Cat.
- **Dark and light themes** that remember your choice.
- **Tabata timer** with adjustable work, rest, and round settings.
- **Pomodoro settings** for focus time, breaks, and rounds before a long break.
- **Calendar** to jump to any date.
- **Cat pictures** that change with the cat's color, mood, and outfit.
- **Ambient sounds**: rain, forest, fire, and waterfall. Add your own audio files as described below.

### Как подставить картинки котика

Картинки собираются по шаблону имени файла:
```
{цвет}_{настроение}_{образ}.png
```
Например: `orange_sad_standard.png`, `grey_happy_king.png`.

- **Цвет** (`catColor`, выбирается свотчами на вкладке «Котик»): `orange`, `grey`, `white`, `black`
- **Настроение** (считается автоматически по активности и сытости): `sad`, `happy`, `calm`, `angry`, `hungry`
- **Образ** (наряд из гардероба, см. `src/data/outfits.js`): `standard`, `tie`, `smart`, `king`, `magician`, `british`, `party`, `bad`, `japan`

Просто положи готовые файлы в `public/cat/` с такими именами — приложение подставит нужную картинку само. Если какого-то конкретного сочетания ещё нет, приложение автоматически попробует запасной вариант: сначала `{цвет}_{настроение}_standard.png`, а если и его нет — общую заглушку `public/cat/cat.png`.

public/sounds/rain.mp3
public/sounds/forest.mp3
public/sounds/fire.mp3
public/sounds/waterfall.mp3
```
Просто положи туда свои mp3 с такими именами. Бесплатно и без указания авторства можно взять на [pixabay.com/sound-effects](https://pixabay.com/sound-effects/) (разделы rain, forest, campfire, waterfall). Пока файла нет — кнопка звука покажет подсказку об этом, ничего не сломается.

Список звуков и их названия — в `src/data/ambientTracks.js`.

### Cat images and ambient sounds

Cat image filenames use this format: `{color}_{mood}_{outfit}.png`, for example `orange_sad_standard.png`. Put the images in `public/cat/`. If an image is missing, the app tries the standard outfit for that color and mood, then `public/cat/cat.png`.

Colors: `orange`, `grey`, `white`, `black`. Moods: `sad`, `happy`, `calm`, `angry`, `hungry`. Outfit names are listed in `src/data/outfits.js`.

To add ambient sounds, place your own `rain.mp3`, `forest.mp3`, `fire.mp3`, and `waterfall.mp3` files in `public/sounds/`. The track list is in `src/data/ambientTracks.js`. If a file is missing, the app will show a hint. You can find free sound effects on [Pixabay](https://pixabay.com/sound-effects/).

## Что можно доработать дальше

- Разные категории задач / дедлайны / приоритеты.
- Больше нарядов и анимаций у котика.
- Звук/вибрация по завершении помодоро.
- Push-уведомления с напоминаниями от котика (потребует Service Worker с push-подпиской).

## Ideas for later

- Task categories, deadlines, and priorities.
- More cat outfits and animations.
- A sound or vibration when a Pomodoro session ends.
- Push notification reminders from the cat (requires a service worker and push subscription).
