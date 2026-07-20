import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useJsonStore } from './hooks/useJsonStore'
import { useAmbientSound } from './hooks/useAmbientSound'
import TodoList, { COIN_REWARD } from './components/TodoList'
import PomodoroTimer from './components/PomodoroTimer'
import TabataTimer from './components/TabataTimer'
import VirtualCat from './components/VirtualCat'
import CatShop from './components/CatShop'
import Navbar from './components/Navbar'
import BottomTabBar from './components/BottomTabBar'
import SettingsPanel from './components/SettingsPanel'
import WeekCalendar from './components/WeekCalendar'
import { OUTFITS } from './data/outfits'
import { addDays, fromISODate, startOfWeek, toISODate } from './utils/date'

const HUNGER_DECAY_PER_MINUTE = 0.2 // ~ 1 точка каждые 5 минут
const PET_DAILY_COIN_CAP = 8

function taskDateISO(task) {
  return task.dueDate || toISODate(new Date(task.createdAt))
}

function App() {
  const { data, update, exportJson, importJson } = useJsonStore()
  const [activeTab, setActiveTab] = useState('tasks')
  const [shopOpen, setShopOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [justCompletedTick, setJustCompletedTick] = useState(0)
  const fileInputRef = useRef(null)

  const todayISO = toISODate(new Date())
  const [selectedDateISO, setSelectedDateISO] = useState(todayISO)
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()))

  const persistAmbient = useCallback((track, volume) => {
    update(prev => ({ ...prev, ambientTrack: track, ambientVolume: volume }))
  }, [update])
  const ambient = useAmbientSound(data.ambientTrack, data.ambientVolume, persistAmbient)

  // Тема оформления — применяем к <html>, чтобы работали CSS-переменные тёмной темы,
  // и запоминаем выбор (уже сохраняется в общем JSON-хранилище).
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', data.theme)
    document.documentElement.setAttribute('data-bs-theme', data.theme)
  }, [data.theme])

  // Пересчитываем сытость котика на основе прошедшего реального времени —
  // работает даже если приложение было закрыто.
  useEffect(() => {
    const applyDecay = () => {
      update(prev => {
        const minutesPassed = (Date.now() - prev.lastHungerUpdateAt) / 60000
        if (minutesPassed < 1) return prev
        const nextHunger = Math.max(0, prev.hunger - minutesPassed * HUNGER_DECAY_PER_MINUTE)
        return { ...prev, hunger: nextHunger, lastHungerUpdateAt: Date.now() }
      })
    }
    applyDecay()
    const id = setInterval(applyDecay, 60000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const touchActivity = useCallback(() => {
    update(prev => ({ ...prev, lastActivityAt: Date.now() }))
  }, [update])

  const addTask = (text, priority, dueTime) => {
    update(prev => ({
      ...prev,
      tasks: [...prev.tasks, {
        id: crypto.randomUUID(),
        text,
        priority,
        done: false,
        createdAt: Date.now(),
        dueDate: selectedDateISO,
        dueTime: dueTime || null,
      }],
    }))
    touchActivity()
  }

  const toggleTask = (id) => {
    update(prev => {
      const task = prev.tasks.find(t => t.id === id)
      if (!task) return prev
      const nowDone = !task.done
      const coinsDelta = nowDone ? COIN_REWARD : -COIN_REWARD
      return {
        ...prev,
        tasks: prev.tasks.map(t => t.id === id ? { ...t, done: nowDone } : t),
        coins: Math.max(0, prev.coins + coinsDelta),
        lastActivityAt: Date.now(),
      }
    })
    setJustCompletedTick(t => t + 1)
  }

  const deleteTask = (id) => {
    update(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }))
  }

  const onPomodoroComplete = useCallback((reward) => {
    update(prev => ({
      ...prev,
      coins: prev.coins + reward,
      pomodorosCompleted: prev.pomodorosCompleted + 1,
      lastActivityAt: Date.now(),
    }))
    setJustCompletedTick(t => t + 1)
  }, [update])

  const onTabataComplete = useCallback((reward) => {
    update(prev => ({
      ...prev,
      coins: prev.coins + reward,
      lastActivityAt: Date.now(),
    }))
    setJustCompletedTick(t => t + 1)
  }, [update])

  const buyOutfit = (id) => {
    update(prev => {
      const outfit = OUTFITS.find(o => o.id === id)
      if (!outfit || prev.coins < outfit.price || prev.ownedOutfits.includes(id)) return prev
      return {
        ...prev,
        coins: prev.coins - outfit.price,
        ownedOutfits: [...prev.ownedOutfits, id],
        equippedOutfit: id,
      }
    })
  }

  const equipOutfit = (id) => {
    update(prev => ({ ...prev, equippedOutfit: id }))
  }

  const feedCat = (cost, amount) => {
    update(prev => {
      if (prev.coins < cost) return prev
      return {
        ...prev,
        coins: prev.coins - cost,
        hunger: Math.min(100, prev.hunger + amount),
        lastHungerUpdateAt: Date.now(),
        lastActivityAt: Date.now(),
      }
    })
  }

  const petCat = () => {
    update(prev => {
      const iso = toISODate(new Date())
      const petsToday = prev.petsDate === iso ? prev.petsCount : 0
      const rewardAllowed = petsToday < PET_DAILY_COIN_CAP
      return {
        ...prev,
        petsDate: iso,
        petsCount: petsToday + 1,
        coins: rewardAllowed ? prev.coins + 1 : prev.coins,
        lastActivityAt: Date.now(),
      }
    })
  }

  const setCatColor = (color) => update(prev => ({ ...prev, catColor: color }))
  const setTheme = (theme) => update(prev => ({ ...prev, theme }))

  const updatePomodoroSettings = (next) => {
    update(prev => ({
      ...prev,
      pomodoroWorkMin: next.workMin,
      pomodoroBreakMin: next.breakMin,
      pomodoroLongBreakMin: next.longBreakMin,
      pomodoroRoundsBeforeLong: next.roundsBeforeLong,
    }))
  }

  const updateTabataSettings = (next) => {
    update(prev => ({
      ...prev,
      tabataWorkSec: next.workSec,
      tabataRestSec: next.restSec,
      tabataRounds: next.rounds,
    }))
  }

  const goPrevWeek = () => setWeekStart(prev => addDays(prev, -7))
  const goNextWeek = () => setWeekStart(prev => addDays(prev, 7))
  const goToday = () => {
    setWeekStart(startOfWeek(new Date()))
    setSelectedDateISO(toISODate(new Date()))
  }
  const selectDate = (iso) => setSelectedDateISO(iso)
  const jumpToDate = (iso) => {
    setSelectedDateISO(iso)
    setWeekStart(startOfWeek(fromISODate(iso)))
  }

  const tasksForSelectedDay = useMemo(
    () => data.tasks.filter(t => taskDateISO(t) === selectedDateISO),
    [data.tasks, selectedDateISO]
  )

  const taskCounts = useMemo(() => {
    const map = {}
    for (const t of data.tasks) {
      const iso = taskDateISO(t)
      if (!map[iso]) map[iso] = { total: 0, done: 0 }
      map[iso].total += 1
      if (t.done) map[iso].done += 1
    }
    return map
  }, [data.tasks])

  const handleImportClick = () => fileInputRef.current?.click()

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      await importJson(file)
      alert('Данные успешно загружены!')
    } catch {
      alert('Не удалось прочитать файл. Проверь, что это корректный JSON-бэкап.')
    }
    e.target.value = ''
  }

  return (
    <div className="app-bg min-vh-100 has-bottom-tabs" id="top">
      <Navbar onOpenSettings={() => setSettingsOpen(true)} />
      <input
        type="file"
        accept="application/json"
        ref={fileInputRef}
        className="d-none"
        onChange={handleFileChange}
      />

      <div className="container py-4">
        {activeTab === 'tasks' && (
          <div className="d-flex flex-column gap-4">
            <WeekCalendar
              weekStart={weekStart}
              selectedDateISO={selectedDateISO}
              taskCounts={taskCounts}
              onSelectDate={selectDate}
              onPrevWeek={goPrevWeek}
              onNextWeek={goNextWeek}
              onToday={goToday}
              onJumpToDate={jumpToDate}
            />
            <TodoList
              tasks={tasksForSelectedDay}
              selectedDate={fromISODate(selectedDateISO)}
              onAdd={addTask}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
          </div>
        )}

        {activeTab === 'pomodoro' && (
          <PomodoroTimer
            settings={{
              workMin: data.pomodoroWorkMin,
              breakMin: data.pomodoroBreakMin,
              longBreakMin: data.pomodoroLongBreakMin,
              roundsBeforeLong: data.pomodoroRoundsBeforeLong,
            }}
            onChangeSettings={updatePomodoroSettings}
            onPomodoroComplete={onPomodoroComplete}
            ambient={ambient}
          />
        )}

        {activeTab === 'tabata' && (
          <TabataTimer
            settings={{
              workSec: data.tabataWorkSec,
              restSec: data.tabataRestSec,
              rounds: data.tabataRounds,
            }}
            onChangeSettings={updateTabataSettings}
            onTabataComplete={onTabataComplete}
            ambient={ambient}
          />
        )}

        {activeTab === 'cat' && (
          <VirtualCat
            lastActivityAt={data.lastActivityAt}
            equippedOutfit={data.equippedOutfit}
            coins={data.coins}
            hunger={data.hunger}
            catColor={data.catColor}
            onChangeCatColor={setCatColor}
            justCompletedTaskTick={justCompletedTick}
            onOpenShop={() => setShopOpen(true)}
            onFeed={feedCat}
            onPet={petCat}
          />
        )}
      </div>

      <BottomTabBar activeTab={activeTab} onSelectTab={setActiveTab} />

      <CatShop
        show={shopOpen}
        onClose={() => setShopOpen(false)}
        coins={data.coins}
        ownedOutfits={data.ownedOutfits}
        equippedOutfit={data.equippedOutfit}
        onBuy={buyOutfit}
        onEquip={equipOutfit}
      />

      <SettingsPanel
        show={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        theme={data.theme}
        onSetTheme={setTheme}
        onExport={exportJson}
        onImportClick={handleImportClick}
      />
    </div>
  )
}

export default App
