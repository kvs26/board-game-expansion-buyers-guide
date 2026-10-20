/**
 * Phone-only folding sections (≤767px; styles in base.css under "Folding sections").
 * Every `[data-fold]` element folds behind its first child (its heading). On phones the
 * heading's contents are wrapped in a `.fold-toggle` button; on wider screens the button
 * is unwrapped again so laptop keyboard users get no dead tab stops.
 * `data-fold="open"` starts open. Linking to anything inside a fold opens it.
 *
 * @param {ParentNode & EventTarget} scope
 * @param {MediaQueryList} [phone]
 * @returns {{ openFor: (hash: string) => void }}
 */
export function phoneFolds(scope, phone = matchMedia('(max-width: 767px)')) {
  const folds = /** @type {HTMLElement[]} */ ([...scope.querySelectorAll('[data-fold]')]);

  /** @param {Element} fold @param {boolean} open */
  const setFold = (fold, open) => {
    fold.classList.toggle('is-open', open);
    fold.querySelector('.fold-toggle')?.setAttribute('aria-expanded', String(open));
  };

  const apply = () => {
    for (const fold of folds) {
      const head = /** @type {Element} */ (fold.firstElementChild);
      const btn = head.querySelector('.fold-toggle');
      if (phone.matches && !btn) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'fold-toggle';
        b.append(...head.childNodes);
        head.append(b);
        setFold(fold, fold.dataset.fold === 'open');
      } else if (!phone.matches && btn) {
        head.replaceChildren(...btn.childNodes);
        setFold(fold, false);
      }
    }
  };

  scope.addEventListener('click', (ev) => {
    const fold = /** @type {Element} */ (ev.target).closest('.fold-toggle')?.closest('[data-fold]');
    if (fold) setFold(fold, !fold.classList.contains('is-open'));
  });

  /** @param {string} hash */
  const openFor = (hash) => {
    let id = hash.slice(1);
    try { id = decodeURIComponent(id); } catch { /* malformed escape: use the raw id */ }
    const target = id && document.getElementById(id);
    const fold = target && target.closest('[data-fold]');
    if (fold && phone.matches) setFold(fold, true);
  };

  window.addEventListener('hashchange', () => openFor(location.hash));
  apply();
  openFor(location.hash);
  phone.addEventListener('change', apply);
  return { openFor };
}
