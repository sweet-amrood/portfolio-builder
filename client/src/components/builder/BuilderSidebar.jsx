import { useState } from 'react';
import { HiSquares2X2, HiSwatch, HiAdjustmentsHorizontal } from 'react-icons/hi2';
import SortableSectionList from '../SortableSectionList';
import SectionAddMenu from '../SectionAddMenu';
import BuilderThemePicker from '../BuilderThemePicker';
import BuilderTemplateFontPicker from './BuilderTemplateFontPicker';

const TABS = [
  { id: 'sections', label: 'Sections', icon: HiSquares2X2 },
  { id: 'theme', label: 'Theme', icon: HiSwatch },
  { id: 'layout', label: 'Layout', icon: HiAdjustmentsHorizontal },
];

export default function BuilderSidebar({
  sections,
  order,
  activeSection,
  fixedSectionIds,
  sectionsToAdd,
  templateId,
  activeThemeId,
  templateBodyFont,
  templateHeadingFont,
  canvasZoom,
  onSectionSelect,
  onSectionReorder,
  onSectionRemove,
  onSectionAdd,
  onThemeSelect,
  onTemplateBodyFontSelect,
  onTemplateHeadingFontSelect,
  onZoomChange,
  onResetPortfolio,
  isBuiltTemplate,
}) {
  const [tab, setTab] = useState('sections');

  return (
    <aside className="builder-v2-sidebar">
      <div className="builder-v2-tabs" role="tablist">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={`builder-v2-tab${tab === id ? ' builder-v2-tab--active' : ''}`}
            onClick={() => setTab(id)}
          >
            <Icon size={16} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="builder-v2-sidebar-body">
        {tab === 'sections' && (
          <div className="builder-v2-panel">
            <div className="builder-v2-panel-head">
              <h2>Page sections</h2>
              <p>Drag to reorder · click to edit</p>
            </div>
            <SortableSectionList
              sections={sections}
              order={order}
              activeSection={activeSection}
              onSelect={onSectionSelect}
              onReorder={onSectionReorder}
              onRemove={onSectionRemove}
              fixedSections={fixedSectionIds}
            />
            <SectionAddMenu
              sections={sections}
              availableIds={sectionsToAdd}
              onAdd={onSectionAdd}
            />
          </div>
        )}

        {tab === 'theme' && (
          <div className="builder-v2-panel">
            <div className="builder-v2-panel-head">
              <h2>Color theme</h2>
              <p>Applies palette tokens across the template</p>
            </div>
            {isBuiltTemplate ? (
              <BuilderThemePicker
                templateId={templateId}
                activeThemeId={activeThemeId}
                onSelect={onThemeSelect}
              />
            ) : (
              <p className="builder-v2-muted">Themes are available for built templates only.</p>
            )}

            <div className="builder-v2-panel-divider" />

            <div className="builder-v2-panel-head">
              <h2>Typography</h2>
              <p>Body and heading fonts for the whole portfolio</p>
            </div>
            {isBuiltTemplate ? (
              <BuilderTemplateFontPicker
                templateBodyFont={templateBodyFont}
                templateHeadingFont={templateHeadingFont}
                onBodyFontSelect={onTemplateBodyFontSelect}
                onHeadingFontSelect={onTemplateHeadingFontSelect}
              />
            ) : (
              <p className="builder-v2-muted">Font controls are available for built templates only.</p>
            )}
          </div>
        )}

        {tab === 'layout' && (
          <div className="builder-v2-panel">
            <div className="builder-v2-panel-head">
              <h2>Canvas & layout</h2>
              <p>Preview scale and portfolio reset</p>
            </div>

            <label className="builder-v2-field">
              <span className="builder-v2-field-label">Canvas zoom</span>
              <div className="builder-v2-zoom-row">
                <input
                  type="range"
                  min={60}
                  max={120}
                  step={5}
                  value={canvasZoom}
                  onChange={(e) => onZoomChange(Number(e.target.value))}
                  className="builder-v2-range"
                />
                <span className="builder-v2-zoom-value">{canvasZoom}%</span>
              </div>
            </label>

            <div className="builder-v2-zoom-presets">
              {[75, 90, 100, 110].map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`builder-v2-chip${canvasZoom === value ? ' builder-v2-chip--active' : ''}`}
                  onClick={() => onZoomChange(value)}
                >
                  {value}%
                </button>
              ))}
            </div>

            <div className="builder-v2-danger-zone">
              <p className="builder-v2-danger-title">Reset portfolio</p>
              <p className="builder-v2-muted">Restore default content and section order for this template.</p>
              <button type="button" className="builder-v2-btn builder-v2-btn--danger" onClick={onResetPortfolio}>
                Reset to defaults
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
