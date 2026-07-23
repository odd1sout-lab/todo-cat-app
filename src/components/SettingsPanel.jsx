import { TELEGRAM_SUPPORT_URL, TELEGRAM_CHANNEL_URL, TELEGRAM_PERSONAL_URL } from '../data/contacts'

export default function SettingsPanel({ show, onClose, theme, onSetTheme, language, onSetLanguage, onExport, onImportClick, t }) {
  if (!show) return null

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

        <div className="d-flex gap-2">
          <button className="btn btn-pill btn-outline-soft btn-sm flex-fill" onClick={onExport}>
            <i className="bi bi-download me-1" /> {t('exportJson')}
          </button>
          <button className="btn btn-pill btn-outline-soft btn-sm flex-fill" onClick={onImportClick}>
            <i className="bi bi-upload me-1" /> {t('importJson')}
          </button>
        </div>
      </div>
    </div>
  )
}
