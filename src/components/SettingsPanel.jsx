import { useState } from 'react'
import { TELEGRAM_SUPPORT_URL, TELEGRAM_CHANNEL_URL, TELEGRAM_PERSONAL_URL, SUPPORT_CARD_NUMBER } from '../data/contacts'

export default function SettingsPanel({
  show, onClose, theme, onSetTheme, language, onSetLanguage,
  notificationsEnabled, onToggleNotifications,
  geminiApiKey, onSetGeminiApiKey,
  onExport, onImportClick, t,
}) {
  const [copied, setCopied] = useState(false)
  const [keyInput, setKeyInput] = useState(geminiApiKey || '')
  const [keySaved, setKeySaved] = useState(false)
  const [showKey, setShowKey] = useState(false)
  if (!show) return null

  const copyCard = () => {
    navigator.clipboard?.writeText(SUPPORT_CARD_NUMBER).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const saveKey = () => {
    onSetGeminiApiKey(keyInput.trim())
    setKeySaved(true)
    setTimeout(() => setKeySaved(false), 1500)
  }

  return (
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div className="modal-panel p-3 p-md-4" onClick={e => e.stopPropagation()}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="panel-title mb-0"><i className="bi bi-gear" /> {t('settings')}</h2>
          <button className="btn-ghost-icon" onClick={onClose} aria-label={t('close')}>
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="settings-row mb-3">
          <span className="pomo-setting-label">{t('themeLabel')}</span>
          <div className="theme-toggle">
            <button
              type="button"
              className={theme === 'light' ? 'theme-active' : ''}
              onClick={() => onSetTheme('light')}
            >
              <i className="bi bi-sun me-1" />{t('themeLight')}
            </button>
            <button
              type="button"
              className={theme === 'dark' ? 'theme-active' : ''}
              onClick={() => onSetTheme('dark')}
            >
              <i className="bi bi-moon-stars me-1" />{t('themeDark')}
            </button>
          </div>
        </div>

        <div className="settings-row mb-3">
          <span className="pomo-setting-label">{t('languageLabel')}</span>
          <div className="theme-toggle">
            <button
              type="button"
              className={language === 'ru' ? 'theme-active' : ''}
              onClick={() => onSetLanguage('ru')}
            >
              Русский
            </button>
            <button
              type="button"
              className={language === 'en' ? 'theme-active' : ''}
              onClick={() => onSetLanguage('en')}
            >
              English
            </button>
          </div>
        </div>

        <div className="settings-row mb-1">
          <span className="pomo-setting-label">{t('notificationsLabel')}</span>
          <button
            type="button"
            className={`recurring-toggle-btn ${notificationsEnabled ? 'recurring-toggle-active' : ''}`}
            onClick={onToggleNotifications}
          >
            <i className={`bi ${notificationsEnabled ? 'bi-bell-fill' : 'bi-bell'} me-1`} />
            {notificationsEnabled ? t('notificationsOn') : t('notificationsEnable')}
          </button>
        </div>
        <p className="small text-muted mb-3">{t('notificationsHint')}</p>

        <hr className="my-3" />

        <div className="mb-1 small fw-semibold text-muted">{t('geminiKeyLabel')}</div>
        <p className="small text-muted mb-2">
          {t('geminiKeyHint')}{' '}
          <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer">{t('geminiGetKeyLink')}</a>
        </p>
        <div className="d-flex gap-2 mb-3">
          <div className="task-time-input flex-grow-1">
            <i className="bi bi-key" />
            <input
              type={showKey ? 'text' : 'password'}
              value={keyInput}
              onChange={e => setKeyInput(e.target.value)}
              placeholder={t('geminiKeyPlaceholder')}
              style={{ width: '100%' }}
            />
            <button type="button" className="task-time-clear" onClick={() => setShowKey(s => !s)} aria-label="toggle visibility">
              <i className={`bi ${showKey ? 'bi-eye-slash' : 'bi-eye'}`} />
            </button>
          </div>
          <button type="button" className="btn btn-pill btn-outline-soft btn-sm" onClick={saveKey}>
            <i className={`bi ${keySaved ? 'bi-check-lg' : 'bi-save'} me-1`} />
            {keySaved ? t('geminiKeySaved') : t('geminiKeySave')}
          </button>
        </div>

        <hr className="my-3" />

        <div className="mb-1 small fw-semibold text-muted">{t('support')}</div>
        <div className="d-flex flex-column gap-2 mb-3">
          <a className="btn btn-pill btn-outline-soft btn-sm" href={TELEGRAM_SUPPORT_URL} target="_blank" rel="noreferrer">
            <i className="bi bi-telegram me-1" /> {t('supportChat')}
          </a>
          <a className="btn btn-pill btn-outline-soft btn-sm" href={TELEGRAM_CHANNEL_URL} target="_blank" rel="noreferrer">
            <i className="bi bi-megaphone me-1" /> {t('supportChannel')}
          </a>
          <a className="btn btn-pill btn-outline-soft btn-sm" href={TELEGRAM_PERSONAL_URL} target="_blank" rel="noreferrer">
            <i className="bi bi-person-lines-fill me-1" /> {t('supportPersonal')}
          </a>
        </div>

        <hr className="my-3" />

        <div className="d-flex gap-2 mb-3">
          <button className="btn btn-pill btn-outline-soft btn-sm flex-fill" onClick={onExport}>
            <i className="bi bi-download me-1" /> {t('exportJson')}
          </button>
          <button className="btn btn-pill btn-outline-soft btn-sm flex-fill" onClick={onImportClick}>
            <i className="bi bi-upload me-1" /> {t('importJson')}
          </button>
        </div>

        <hr className="my-3" />

        <div className="small text-muted">
          {t('supportDeveloper')}: <span className="fw-semibold text-body">{SUPPORT_CARD_NUMBER}</span>
          <button type="button" className="btn-ghost-icon btn-ghost-icon-sm ms-2" onClick={copyCard} aria-label={t('supportCopy')}>
            <i className={`bi ${copied ? 'bi-check-lg' : 'bi-clipboard'}`} />
          </button>
        </div>
      </div>
    </div>
  )
}
