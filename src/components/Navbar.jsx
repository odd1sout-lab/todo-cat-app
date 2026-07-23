export default function Navbar({ onOpenSettings, t }) {
  return (
    <nav className="navbar brand-navbar sticky-top py-2">
      <div className="container d-flex justify-content-between align-items-center">
        <a className="brand-logo text-decoration-none d-flex align-items-center" href="#top">
          <img src="./icons/caticon-192.png" alt="brand-logo" className="paw" />
          {t('appName')}
        </a>

        <button
          className="btn-ghost-icon"
          onClick={onOpenSettings}
          aria-label={t('settings')}
          title={t('settings')}
        >
          <i className="bi bi-gear" />
        </button>
      </div>
    </nav>
  )
}
