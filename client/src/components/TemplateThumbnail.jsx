import ScaledTemplatePreview from './ScaledTemplatePreview';
import TemplateThumbnailArt from './TemplateThumbnailArt';
import { getDefaultThemeId, getThemeById } from '../constants/templateThemes';
import './template-thumbnail-art.css';

export default function TemplateThumbnail({ template, size = 'card' }) {
  if (size === 'card' || size === 'large') {
    return (
      <div className={`tpl-live-thumb tpl-live-thumb--${size}`}>
        <TemplateThumbnailArt template={template} />
      </div>
    );
  }

  const themeId = getDefaultThemeId(template.id);
  const theme = themeId ? getThemeById(template.id, themeId) : null;

  return (
    <div className={`tpl-live-thumb tpl-live-thumb--${size} tpl-live-thumb--live`}>
      <div className="tpl-live-thumb-chrome">
        <span className="tpl-art-dot tpl-art-dot--r" />
        <span className="tpl-art-dot tpl-art-dot--y" />
        <span className="tpl-art-dot tpl-art-dot--g" />
      </div>
      <ScaledTemplatePreview
        templateId={template.id}
        preview
        height={520}
        fill
        theme={theme}
        thumbnail
      />
    </div>
  );
}
