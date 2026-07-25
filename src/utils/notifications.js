// Локальные уведомления работают, только пока приложение открыто (хотя бы
// свёрнуто в фоне) — без сервера невозможно "разбудить" телефон, если
// приложение полностью закрыто. Честно предупреждаем об этом в интерфейсе.

export function isNotificationSupported() {
  return typeof window !== 'undefined' && 'Notification' in window
}

export async function requestNotificationPermission() {
  if (!isNotificationSupported()) return 'unsupported'
  if (Notification.permission === 'granted') return 'granted'
  if (Notification.permission === 'denied') return 'denied'
  try {
    return await Notification.requestPermission()
  } catch {
    return 'denied'
  }
}

export async function showNotification(title, options = {}) {
  if (!isNotificationSupported() || Notification.permission !== 'granted') return

  // Через service worker уведомления надёжнее показываются на Android/PWA.
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready
      if (reg && reg.showNotification) {
        reg.showNotification(title, options)
        return
      }
    } catch {
      // нет активного service worker — используем обычный способ ниже
    }
  }

  try {
    new Notification(title, options)
  } catch {
    // тихо игнорируем — например, если браузер требует SW для уведомлений
  }
}
