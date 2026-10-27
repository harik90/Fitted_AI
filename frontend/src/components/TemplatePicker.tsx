import React, { useState } from 'react';
import type { PresetUniform } from '../types';
import { MALE_UNIFORMS, FEMALE_UNIFORMS } from '../presets/uniforms';
import { translations, type Translations } from '../lib/i18n';
import { UserIcon, UserCheckIcon } from './Icons';
import { sound } from '../lib/sound';

interface TemplatePickerProps {
  selectedPresetId: string | null;
  onSelectPreset: (preset: PresetUniform) => void;
  t?: Translations;
}

export const TemplatePicker: React.FC<TemplatePickerProps> = ({
  selectedPresetId,
  onSelectPreset,
  t,
}) => {
  const [genderCategory, setGenderCategory] = useState<'male' | 'female'>('male');
  const activeT = t || translations.en;

  const currentList = genderCategory === 'male' ? MALE_UNIFORMS : FEMALE_UNIFORMS;

  return (
    <div className="presets">
      <div className="presets__header">
        <div className="presets__label">{activeT.quickPresets}</div>
        <div className="segmented-control">
          <button
            type="button"
            className={`segmented-btn ${genderCategory === 'male' ? 'segmented-btn--active' : ''}`}
            onClick={() => {
              sound.playClick();
              setGenderCategory('male');
            }}
          >
            <UserIcon size={14} />
            <span>Men</span>
          </button>
          <button
            type="button"
            className={`segmented-btn ${genderCategory === 'female' ? 'segmented-btn--active' : ''}`}
            onClick={() => {
              sound.playClick();
              setGenderCategory('female');
            }}
          >
            <UserCheckIcon size={14} />
            <span>Women</span>
          </button>
        </div>
      </div>

      <div className="presets__grid">
        {currentList.map((preset) => {
          const isActive = selectedPresetId === preset.id;
          return (
            <div
              key={preset.id}
              className={`preset-chip ${isActive ? 'preset-chip--active' : ''}`}
              onClick={() => {
                sound.playClick();
                onSelectPreset(preset);
              }}
              title={preset.name}
            >
              <div className="preset-chip__img">
                <img
                  src={preset.imageUrl}
                  alt={preset.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <span className="preset-chip__name">{preset.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
