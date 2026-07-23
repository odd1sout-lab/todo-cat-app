import { useEffect, useState, useCallback } from 'react'

const STORAGE_KEY = 'todo-cat-app-data-v1'

const defaultData = {
  tasks: [],
  coins: 0,
  ownedOutfits: ['standard'],
  equippedOutfit: 'standard',
  pomodorosCompleted: 0,
  lastActivityAt: Date.now(),
  streak: 0,
  hunger: 100,
  lastHungerUpdateAt: Date.now(),
  petsDate: null,
  petsCount: 0,
  pomodoroWorkMin: 25,
  pomodoroBreakMin: 5,
  pomodoroLongBreakMin: 15,
  pomodoroRoundsBeforeLong: 4,
  tabataWorkSec: 20,
  tabataRestSec: 10,
  tabataRounds: 8,
  tabataWorkMode: 'time',
  tabataReps: 12,
  theme: 'light',
  catColor: 'orange',
  ambientTrack: null,
  ambientVolume: 0.5,
  events: [],
  language: 'ru',
}

function loadFromDisk() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultData
    const parsed = JSON.parse(raw)
    return { ...defaultData, ...parsed }
  } catch (e) {
    console.warn('Не удалось прочитать сохранённые данные, использую значения по умолчанию', e)
    return defaultData
  }
}

export function useJsonStore() {
  const [data, setData] = useState(loadFromDisk)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  const update = useCallback((updater) => {
    setData(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }
      return next
    })
  }, [])

  const exportJson = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `todo-cat-backup-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }, [data])

  const importJson = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result)
          setData({ ...defaultData, ...parsed })
          resolve()
        } catch (e) {
          reject(e)
        }
      }
      reader.onerror = reject
      reader.readAsText(file)
    })
  }, [])

  return { data, update, exportJson, importJson }
}
