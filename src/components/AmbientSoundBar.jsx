import { AMBIENT_TRACKS } from '../data/ambientTracks'

export default function AmbientSoundBar({ ambient, t }) {
  const { track, playing, volume, missing, toggleTrack, setVolume } = ambient

  return (
    <div className="ambient-bar">
      <div className="ambient-tracks">
        {Object.entries(AMBIENT_TRACKS).map(([id, cfg]) => (
          <button
            key={id}
            type="button"
            className={`ambient-track-btn ${playing && track === id ? 'ambient-track-active' : ''}`}
            onClick={() => toggleTrack(id)}
            title={t(cfg.labelKey)}
          >
            <i className={`bi ${cfg.icon}`} />
            <span>{t(cfg.labelKey)}</span>
          </button>
        ))}
      </div>
      {playing && (
        <div className="ambient-volume">
          <i className="bi bi-volume-down small" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={e => setVolume(Number(e.target.value))}
          />
          <i className="bi bi-volume-up small" />
        </div>
      )}
      {missing && (
        <div className="small text-muted mt-2">
          {t('soundMissingHint')}
        </div>
      )}
    </div>
  )
}
