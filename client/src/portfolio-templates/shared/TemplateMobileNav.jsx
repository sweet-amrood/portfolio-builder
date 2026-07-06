import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

export default function TemplateMobileNav({
  variant = 'devmin',
  brand,
  brandHref = '#hero',
  onBrandClick,
  sectionLinks = [],
  externalLinks = [],
  trailing = null,
  preview = false,
  children,
}) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const handleSectionClick = (event, link) => {
    if (preview && variant !== 'vsc') return;
    link.onClick?.(event);
    close();
  };

  const handleExternalClick = () => {
    if (!preview) close();
  };

  const menuLayer = createPortal(
    <>
      <div
        className={`tpl-mobile-nav__overlay${open ? ' tpl-mobile-nav__overlay--open' : ''}`}
        onClick={close}
        aria-hidden={!open}
      />
      <nav
        className={`tpl-mobile-nav__panel tpl-mobile-nav__panel--${variant}${open ? ' tpl-mobile-nav__panel--open' : ''}`}
        aria-hidden={!open}
        aria-label="Mobile navigation"
      >
        <div className="tpl-mobile-nav__panel-head">
          <span className="tpl-mobile-nav__panel-title">Menu</span>
          <button type="button" className="tpl-mobile-nav__panel-close" onClick={close} aria-label="Close menu">
            ×
          </button>
        </div>
        <div className="tpl-mobile-nav__panel-inner">
          {sectionLinks.length === 0 ? (
            <p className="tpl-mobile-nav__empty">No sections available</p>
          ) : (
            sectionLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="tpl-mobile-nav__link"
                onClick={(event) => handleSectionClick(event, link)}
              >
                {link.icon ? <span className="tpl-mobile-nav__link-icon">{link.icon}</span> : null}
                <span>{link.label}</span>
              </a>
            ))
          )}
          {externalLinks.length > 0 && (
            <>
              <div className="tpl-mobile-nav__divider" />
              {externalLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="tpl-mobile-nav__link tpl-mobile-nav__link--external"
                  target="_blank"
                  rel="noreferrer"
                  onClick={handleExternalClick}
                >
                  {link.label}
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </>
          )}
        </div>
      </nav>
    </>,
    document.body
  );

  return (
    <>
      <div className={`tpl-mobile-nav tpl-mobile-nav--${variant}${preview ? ' tpl-mobile-nav--preview' : ''}`}>
        <div className="tpl-mobile-nav__bar">
          <a href={brandHref} className="tpl-mobile-nav__brand" onClick={onBrandClick}>
            {brand}
          </a>
          <div className="tpl-mobile-nav__bar-end">
            {trailing}
            <button
              type="button"
              className={`tpl-mobile-nav__toggle${open ? ' tpl-mobile-nav__toggle--open' : ''}`}
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((value) => !value)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </div>

      {menuLayer}

      <div className="tpl-desktop-nav">{children}</div>
    </>
  );
}
