// Разбивка большой задачи на подзадачи через Gemini API.
// Ключ вводит сам пользователь в настройках (свой бесплатный ключ с
// aistudio.google.com) и хранится только в его браузере — мы никуда его не
// отправляем, кроме самого Google при вызове API.
//
// Если Google снова переименует модель — поменяй константу ниже.
const GEMINI_MODEL = 'gemini-2.5-flash'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

const PROMPT = {
  ru: (task) => `Раздели крупную задачу на 4-6 маленьких конкретных подзадач, которые вместе её выполняют. Задача: "${task}".
Ответь СТРОГО в формате JSON-массива строк, без пояснений и markdown, например: ["Подзадача 1", "Подзадача 2"]`,
  en: (task) => `Break this big task into 4-6 small, concrete subtasks that together accomplish it. Task: "${task}".
Reply with STRICTLY a JSON array of strings, no explanation, no markdown, e.g.: ["Subtask 1", "Subtask 2"]`,
}

function extractJsonArray(text) {
  // Модель иногда оборачивает ответ в ```json ... ``` несмотря на просьбу не делать этого — подчищаем.
  const cleaned = text.replace(/```json|```/g, '').trim()
  const match = cleaned.match(/\[[\s\S]*\]/)
  if (!match) return null
  try {
    const parsed = JSON.parse(match[0])
    if (Array.isArray(parsed)) return parsed.filter(x => typeof x === 'string' && x.trim())
    return null
  } catch {
    return null
  }
}

// Возвращает { ok: true, subtasks } или { ok: false, error: 'missing_key' | 'invalid_key' | 'network' | 'empty' }
export async function splitTaskWithGemini(apiKey, taskText, lang = 'en') {
  if (!apiKey) return { ok: false, error: 'missing_key' }

  const prompt = (PROMPT[lang] || PROMPT.en)(taskText)

  let res
  try {
    res = await fetch(`${GEMINI_URL}?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    })
  } catch {
    return { ok: false, error: 'network' }
  }

  if (res.status === 400 || res.status === 403) return { ok: false, error: 'invalid_key' }
  if (!res.ok) return { ok: false, error: 'network' }

  let data
  try {
    data = await res.json()
  } catch {
    return { ok: false, error: 'empty' }
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) return { ok: false, error: 'empty' }

  const subtasks = extractJsonArray(text)
  if (!subtasks || subtasks.length === 0) return { ok: false, error: 'empty' }

  return { ok: true, subtasks }
}
