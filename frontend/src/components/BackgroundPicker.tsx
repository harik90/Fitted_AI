import React from 'react';
import type { BackgroundOption } from '../types';
import { translations, type Translations } from '../lib/i18n';
import { sound } from '../lib/sound';

interface BackgroundPickerProps {
  selectedBg: BackgroundOption;
  onSelectBg: (bg: BackgroundOption) => void;
  t?: Translations;
}

interface ColorDef {
  id: BackgroundOption;
  color: string;
}

const COLOR_DEFS: ColorDef[] = [
  { id: 'white', color: '#ffffff' },
  { id: 'light-gray', color: '#cbd5e1' },
  { id: 'dark-gray', color: '#475569' },
  { id: 'blue', color: '#2563eb' },
  { id: 'black', color: '#0f172a' },
];

export const BackgroundPicker: React.FC<BackgroundPickerProps> = ({
  selectedBg,
  onSelectBg,
  t,
}) => {
  const activeT = t || translations.en;

  const getLocalizedName = (id: BackgroundOption): string => {
    switch (id) {
      case 'white':
        return activeT.bgColors.white;
      case 'light-gray':
        return activeT.bgColors.lightGray;
      case 'dark-gray':
        return activeT.bgColors.darkGray;
      case 'blue':
        return activeT.bgColors.blue;
      case 'black':
        return activeT.bgColors.black;
    }
  };

  return (
    <div className="bg-picker">
      <div className="bg-picker__label">{activeT.bgColorTitle}</div>
      <div className="bg-picker__options">
        {COLOR_DEFS.map((opt) => {
          const isActive = selectedBg === opt.id;
          const localizedName = getLocalizedName(opt.id);
          return (
            <div
              key={opt.id}
              className={`bg-option ${isActive ? 'bg-option--active' : ''}`}
              onClick={() => {
                sound.playClick();
                onSelectBg(opt.id);
              }}
              title={localizedName}
            >
              <div
                className="bg-option__swatch"
                style={{
                  backgroundColor: opt.color,
                  border:
                    opt.id === 'white'
                      ? '2px solid var(--border)'
                      : opt.id === 'black'
                      ? '2px solid rgba(255, 255, 255, 0.25)'
                      : '2px solid rgba(0, 0, 0, 0.12)',
                }}
              />
              <span className="bg-option__name">{localizedName}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
