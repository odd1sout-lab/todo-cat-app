import { OUTFITS } from '../data/outfits'

export default function CatShop({ show, onClose, coins, ownedOutfits, equippedOutfit, onBuy, onEquip, t }) {
  if (!show) return null

  return (
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div className="modal-panel p-3 p-md-4" onClick={e => e.stopPropagation()}>
        <div className="d-flex justify-content-between align-items-center mb-1">
          <h2 className="panel-title mb-0"><i className="bi bi-bag-heart" /> {t('shopTitle')}</h2>
          <button className="btn-ghost-icon" onClick={onClose} aria-label={t('close')}>
            <i className="bi bi-x-lg" />
          </button>
        </div>
        <p className="small text-muted mb-3">
          <span className="coin-badge me-2"><i className="bi bi-coin" /> {coins}</span>
          {t('earnCoinsHint')}
        </p>

        <div className="row g-2">
          {OUTFITS.map(outfit => {
            const owned = ownedOutfits.includes(outfit.id)
            const equipped = equippedOutfit === outfit.id
            return (
              <div className="col-6 col-sm-4" key={outfit.id}>
                <div className={`outfit-item ${equipped ? 'outfit-equipped' : ''}`}>
                  <div className="fs-1"><i className={`bi ${outfit.icon}`} /></div>
                  <div className="small fw-semibold">{outfit.name}</div>
                  {outfit.price > 0 && (
                    <div className="small text-muted mb-2"><i className="bi bi-coin" /> {outfit.price}</div>
                  )}
                  {owned ? (
                    <button
                      className={`btn btn-pill btn-sm w-100 ${equipped ? 'btn-primary-soft' : 'btn-outline-soft'}`}
                      disabled={equipped}
                      onClick={() => onEquip(outfit.id)}
                    >
                      {equipped ? t('equipped') : t('equip')}
                    </button>
                  ) : (
                    <button
                      className="btn btn-pill btn-primary-soft btn-sm w-100"
                      disabled={coins < outfit.price}
                      onClick={() => onBuy(outfit.id)}
                    >
                      {t('buy')}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
