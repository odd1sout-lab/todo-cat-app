// Проигрывает короткий звуковой эффект из public/sounds/.
// Файл может отсутствовать (пока пользователь его не добавил) — тогда просто
// тихо ничего не происходит, без падения приложения.
export function playSfx(fileName, volume = 0.7) {
  try {
    const audio = new Audio(`${import.meta.env.BASE_URL}sounds/${fileName}`)
    audio.volume = volume
    audio.play().catch(() => { /* файла нет или автоплей заблокирован — это ок */ })
  } catch {
    /* Audio недоступен в этом окружении — не критично */
  }
}
