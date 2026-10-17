# Кот компаньон 

Список задач с таймером помодоро и виртуальным котиком, которого можно наряжать за монеты. Сделано на React + Bootstrap 5, работает как PWA (устанавливается на телефон как приложение).

## Как это работает

- **Задачи**: добавляй, отмечай выполненными, удаляй. За каждую выполненную задачу — 5 монет.
- **Помодоро**: 25 минут работы / 5 минут отдыха. Завершённая рабочая сессия — 8 монет.
- **Котик**: реагирует на твою активность. Если давно ничего не делал — начинает грустить и просить тебя вернуться к делам. Если активно выполняешь задачи — радуется и хвалит.
- **Магазин нарядов**: трать монеты на аутфиты для котика (бантик, корона, очки и т.д.).
- **Хранение данных**: всё сохраняется прямо в браузере на устройстве (это единственный способ для сайта хранить данные без сервера — браузеры не позволяют сайтам молча писать файлы на диск). Формат хранения — JSON. Дополнительно есть кнопки «Экспорт JSON» и «Импорт JSON» — они сохраняют/загружают самый настоящий `.json` файл, если захочешь сделать бэкап или перенести данные на другое устройство.

## Запуск локально

```bash
npm install
npm run dev
```

Откроется на `http://localhost:5173`.

## Сборка

```bash
npm run build
```

Готовые файлы окажутся в папке `dist/`.

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

## Установка как приложение на телефон

После публикации на GitHub Pages открой сайт в браузере телефона:
- Android (Chrome): появится баннер «Добавить на главный экран» или пункт в меню (⋮) → «Установить приложение».
- iPhone (Safari): кнопка «Поделиться» → «На экран “Домой”».

Сайт откроется как отдельное приложение, без адресной строки браузера, и будет работать офлайн (данные всё равно хранятся локально на устройстве).

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

## Что можно доработать дальше

- Разные категории задач / дедлайны / приоритеты.
- Больше нарядов и анимаций у котика.
- Звук/вибрация по завершении помодоро.
- Push-уведомления с напоминаниями от котика (потребует Service Worker с push-подпиской).


```
# Cat Companion

A to-do list featuring a Pomodoro timer and a virtual cat that you can dress up using coins you earn. Built with React and Bootstrap 5, it functions as a PWA (Progressive Web App), meaning it can be installed on your phone just like a native app.

## How It Works

- **Tasks**: Add, mark as complete, or delete tasks. You earn 5 coins for every completed task.
- **Pomodoro**: 25 minutes of work followed by a 5-minute break. Completing a work session earns you 8 coins.
- **The Cat**: Your cat reacts to your activity. If you’ve been inactive for a while, it will start to feel sad and encourage you to get back to work. If you’re actively completing tasks, it will be happy and cheer you on.
- **Outfit Shop**: Spend your coins on accessories for your cat (bows, crowns, glasses, etc.).
- **Data Storage**: Everything is stored locally in your browser (this is the only way for a website to save data without a server, as browsers do not allow sites to silently write files to your disk). Data is stored in JSON format. There are also "Export JSON" and "Import JSON" buttons, which allow you to save or load an actual `.json` file—useful for creating backups or transferring your data to another device.

## Running Locally

```bash
npm install
npm run dev
```

The app will open at `http://localhost:5173`.

## Building

```bash
npm run build
```

The compiled files will be generated in the `dist/` folder.

## Deploying to GitHub Pages

### Option 1 — Automatic (Recommended)

1. Create a new repository on GitHub, for example, `todo-cat-app`.
2. Push this project to the repository:
```bash
git init
git add .
``` git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/odd1sout-lab/todo-cat-app.git
git push -u origin main
```
3. In your repository, go to Settings → Pages, and under the "Build and deployment" section, select "GitHub Actions" as the source.
4. You're all set! Every time you push to the `main` branch, the workflow defined in `.github/workflows/deploy.yml` will automatically build the project and publish it. The site will be available at an address like `https://YOUR_USERNAME.github.io/todo-cat-app/`.

### Option 2 — Manual deployment

```bash
npm run build
npx gh-pages -d dist
```
(First, run `npm install gh-pages --save-dev`, and in Settings → Pages, set the source to the `gh-pages` branch.)

### Important note regarding `base` in `vite.config.js`

If your repository name differs from `todo-cat-app`, you do not need to change the `base` setting in `vite.config.js`. It is already configured as `'./'` (using relative paths), which works regardless of the repository name or its nesting level.

## Installing as an app on your phone

Once published on GitHub Pages, open the site in your phone's browser:
- Android (Chrome): A "Add to Home screen" banner will appear, or you can select "Install app" from the menu (⋮).
- iPhone (Safari): Tap the "Share" button and select "Add to Home Screen."

The site will open as a standalone application—without the browser's address bar—and will function offline (since data is stored locally on your device). ## Project Structure

```
src/
components/
TodoList.jsx        — To-do list
PomodoroTimer.jsx   — Pomodoro timer
VirtualCat.jsx       — Virtual cat and its dialogue lines
CatShop.jsx          — Outfit shop
data/
catMessages.js       — Cat’s phrases (joy / sadness / reproach)
outfits.js            — List of outfits and their prices
hooks/
useJsonStore.js       — JSON-based data storage (localStorage + file export/import)
App.jsx
​​ main.jsx
public/
icons/                 — Icons for PWA
.github/workflows/deploy.yml — Auto-deployment to GitHub Pages
```

## What’s New in This Version

- **Bottom navigation tabs** (similar to mobile apps): To-do, Pomodoro, Tabata, and Cat.
- **Dark/light theme** — toggleable via settings (gear icon in the header); the choice is saved.
- **Tabata timer** — work/rest intervals and number of rounds can be adjusted directly within the app (via the button with sliders ⚙️).
- **Pomodoro timer** — also features flexible settings: focus duration, short and long break lengths, and the number of rounds before a long break.
- **Calendar** — the "Select Date" button opens the system calendar (on your phone or in your browser), allowing you to jump directly to any day in any month.
- **Image-based cat** — the cat’s color, mood, and outfit are rendered using images mapped by filename (see below).
- **Background sounds** (rain / forest / campfire / waterfall) — the player is ready to go; you just need to add the audio files yourself (see below). ### How to add cat images

Images are organized according to a filename pattern:
```
{color}_{mood}_{outfit}.png
```
For example: `orange_sad_standard.png`, `grey_happy_king.png`.

- **Color** (`catColor`, selected via swatches on the "Cat" tab): `orange`, `grey`, `white`, `black`
- **Mood** (determined automatically based on activity level and hunger): `sad`, `happy`, `calm`, `angry`, `hungry`
- **Outfit** (an item from the wardrobe; see `src/data/outfits.js`): `standard`, `tie`, `smart`, `king`, `magician`, `british`, `party`, `bad`, `japan`

Simply place your image files into the `public/cat/` directory using these naming conventions, and the application will automatically select the correct image. If a specific combination is missing, the app will attempt to use a fallback: first it will look for `{color}_{mood}_standard.png`, and if that is also missing, it will default to a generic placeholder image located at `public/cat/cat.png`.
```
