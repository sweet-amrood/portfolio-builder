import { HiComputerDesktop, HiDevicePhoneMobile, HiDeviceTablet } from 'react-icons/hi2';

const DEVICES = [
  { id: 'desktop', label: 'Desktop', icon: HiComputerDesktop, width: '1280px' },
  { id: 'tablet', label: 'Tablet', icon: HiDeviceTablet, width: '768px' },
  { id: 'mobile', label: 'Mobile', icon: HiDevicePhoneMobile, width: '390px' },
];

export default function BuilderCanvasBar({
  device,
  onDeviceChange,
  canvasZoom,
  leftPanelOpen,
  rightPanelOpen,
  onToggleLeftPanel,
  onToggleRightPanel,
}) {
  const activeDevice = DEVICES.find((d) => d.id === device) || DEVICES[0];

  return (
    <div className="builder-v2-canvas-bar">
      <div className="builder-v2-canvas-bar-left">
        <button
          type="button"
          className={`builder-v2-panel-toggle${leftPanelOpen ? ' builder-v2-panel-toggle--active' : ''}`}
          onClick={onToggleLeftPanel}
          title="Toggle sections panel"
        >
          Sections
        </button>
        <button
          type="button"
          className={`builder-v2-panel-toggle${rightPanelOpen ? ' builder-v2-panel-toggle--active' : ''}`}
          onClick={onToggleRightPanel}
          title="Toggle properties panel"
        >
          Properties
        </button>
      </div>

      <div className="builder-v2-device-switch">
        {DEVICES.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`builder-v2-device-btn${device === id ? ' builder-v2-device-btn--active' : ''}`}
            onClick={() => onDeviceChange(id)}
            title={`${label} preview`}
          >
            <Icon size={17} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="builder-v2-canvas-meta">
        <span>{activeDevice.width}</span>
        <span className="builder-v2-canvas-meta-sep">·</span>
        <span>{canvasZoom}%</span>
      </div>
    </div>
  );
}
