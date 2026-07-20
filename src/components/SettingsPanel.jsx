export default function SettingsPanel({ show, onClose, theme, onSetTheme, onExport, onImportClick }) {
  if (!show) return null

  return (
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div className="modal-panel p-3 p-md-4" onClick={e => e.stopPropagation()}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="panel-title mb-0"><i className="bi bi-gear" /> Настройки</h2>
          <button className="btn-ghost-icon" onClick={onClose} aria-label="Закрыть">
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="settings-row mb-3">
          <span className="pomo-setting-label">Тема оформления</span>
          <div className="theme-toggle">
            <button
              type="button"
              className={theme === 'light' ? 'theme-active' : ''}
              onClick={() => onSetTheme('light')}
            >
              <i className="bi bi-sun me-1" />Светлая
            </button>
            <button
              type="button"
              className={theme === 'dark' ? 'theme-active' : ''}
              onClick={() => onSetTheme('dark')}
            >
              <i className="bi bi-moon-stars me-1" />Тёмная
            </button>
          </div>
        </div>

        <hr className="my-3" />

        <div className="d-flex gap-2">
          <button className="btn btn-pill btn-outline-soft btn-sm flex-fill" onClick={onExport}>
            <i className="bi bi-download me-1" /> Экспорт JSON
          </button>
          <button className="btn btn-pill btn-outline-soft btn-sm flex-fill" onClick={onImportClick}>
            <i className="bi bi-upload me-1" /> Импорт JSON
          </button>
        </div>
      </div>
    </div>
  )
}
