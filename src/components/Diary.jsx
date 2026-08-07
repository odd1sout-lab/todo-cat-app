import { useState } from 'react'
import { pickDiaryResponse } from '../data/catMessages'

function formatEntryDate(ts, lang) {
  const d = new Date(ts)
  return d.toLocaleString(lang === 'en' ? 'en-US' : 'ru-RU', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  })
}

export default function Diary({ entries, onAdd, onDelete, t, lang }) {
  const [text, setText] = useState('')
  const [catReply, setCatReply] = useState(null)

  const share = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setText('')
    setCatReply(pickDiaryResponse(lang))
    setTimeout(() => setCatReply(null), 6000)
  }

  return (
    <div className="panel p-3 p-md-4 mb-4">
      <div className="mb-3">
        <div className="eyebrow">{t('diaryEyebrow')}</div>
        <h2 className="panel-title mb-0"><i className="bi bi-journal-heart" /> {t('diaryTitle')}</h2>
      </div>

      <textarea
        className="form-control task-form-input diary-textarea mb-2"
        rows="4"
        placeholder={t('diaryPlaceholder')}
        value={text}
        onChange={e => setText(e.target.value)}
      />

      <div className="text-center mb-2">
        <button className="btn btn-pill btn-primary-soft" onClick={share} disabled={!text.trim()}>
          <i className="bi bi-heart me-1" />{t('diaryShare')}
        </button>
      </div>

      {catReply && (
        <div className="speech-bubble diary-cat-reply mx-auto mb-3">{catReply}</div>
      )}

      <p className="small text-muted mb-3">
        <i className="bi bi-shield-lock me-1" />{t('diaryPrivacyNote')}
      </p>

      {entries.length === 0 ? (
        <div className="empty-state">
          <span className="empty-emoji">📔</span>
          {t('diaryEmpty')}
        </div>
      ) : (
        <ul className="list-unstyled d-flex flex-column gap-2">
          {entries.map(entry => (
            <li key={entry.id} className="diary-entry">
              <div className="d-flex justify-content-between align-items-start gap-2">
                <span className="small text-muted">{formatEntryDate(entry.createdAt, lang)}</span>
                <button className="task-delete-btn" onClick={() => onDelete(entry.id)} aria-label={t('delete')}>
                  <i className="bi bi-trash3" />
                </button>
              </div>
              <div className="task-text mt-1">{entry.text}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
