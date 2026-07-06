import { useRef, useState, useLayoutEffect } from 'react';
import TemplateRenderer from '../portfolio-templates/TemplateRenderer';
import { getBuiltTemplateMeta } from '../constants/builtTemplateMeta';
import { getDefaultThemeId, getThemeById } from '../constants/templateThemes';

export default function ScaledTemplatePreview({
  templateId,
  preview = true,
  height = 300,
  fill = false,
  className = '',
  content,
  sectionOrder,
  theme: themeProp,
  thumbnail = false,
}) {
  const { designWidth, rootClass } = getBuiltTemplateMeta(templateId);
  const theme =
    themeProp ||
    (() => {
      const themeId = getDefaultThemeId(templateId);
      return themeId ? getThemeById(templateId, themeId) : null;
    })();
  const wrapRef = useRef(null);
  const contentRef = useRef(null);
  const [metrics, setMetrics] = useState({ scale: 0.35, contentH: height });

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const content = contentRef.current;
    if (!wrap || !content) return;

    const update = () => {
      const cw = wrap.clientWidth;
      const ch = wrap.clientHeight || height;
      const root = content.querySelector(`.${rootClass}`) || content.firstElementChild;
      const contentH = root?.offsetHeight || content.offsetHeight;
      if (!cw || !contentH) return;

      const scale = thumbnail
        ? cw / designWidth
        : Math.min(cw / designWidth, ch / contentH);
      setMetrics({ scale, contentH });
    };

    update();
    const raf = requestAnimationFrame(update);

    const ro = new ResizeObserver(update);
    ro.observe(wrap);
    if (content.firstElementChild) {
      ro.observe(content.firstElementChild);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [templateId, preview, height, designWidth, rootClass, content, sectionOrder, theme, thumbnail]);

  const scaledW = designWidth * metrics.scale;
  const clipH = thumbnail ? height : metrics.contentH * metrics.scale;

  return (
    <div
      ref={wrapRef}
      className={`scaled-template-preview${fill ? ' scaled-template-preview--fill' : ''}${thumbnail ? ' scaled-template-preview--thumbnail' : ''} ${className}`}
      style={fill ? undefined : { height }}
    >
      <div
        className="scaled-template-preview-clip"
        style={{ width: scaledW, height: clipH }}
      >
        <div
          ref={contentRef}
          className="scaled-template-preview-inner"
          style={{
            width: designWidth,
            transform: `scale(${metrics.scale})`,
            transformOrigin: 'top left',
          }}
        >
          <TemplateRenderer
            templateId={templateId}
            preview={preview}
            compact={preview}
            content={content}
            sectionOrder={sectionOrder}
            theme={theme}
          />
        </div>
      </div>
    </div>
  );
}
