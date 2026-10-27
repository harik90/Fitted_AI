import React from 'react';
import type { FeatureKey, QualityMode } from '../types';
import { translations, type Translations } from '../lib/i18n';
import { sound } from '../lib/sound';
import {
  HeadIcon,
  LipsIcon,
  HairIcon,
  ClothesIcon,
  FourKIcon,
  CheckIcon,
  SparklesIcon,
} from './Icons';

interface FeatureControlsProps {
  selectedFeatures: Set<FeatureKey>;
  onToggleFeature: (feature: FeatureKey) => void;
  qualityMode: QualityMode;
  onChangeQuality: (mode: QualityMode) => void;
  t?: Translations;
}

interface FeatureDef {
  key: FeatureKey;
  icon: React.FC<{ size?: number; color?: string }>;
  accentColor: string;
}

const FEATURES_LIST: FeatureDef[] = [
  { key: 'head', icon: HeadIcon, accentColor: '#3b82f6' },
  { key: 'lips', icon: LipsIcon, accentColor: '#ec4899' },
  { key: 'hair', icon: HairIcon, accentColor: '#8b5cf6' },
  { key: 'clothes', icon: ClothesIcon, accentColor: '#10b981' },
];

export const FeatureControls: React.FC<FeatureControlsProps> = ({
  selectedFeatures,
  onToggleFeature,
  qualityMode,
  onChangeQuality,
  t,
}) => {
  const activeT = t || translations.en;

  const getFeatureLabel = (key: FeatureKey) => {
    switch (key) {
      case 'head':
        return { name: activeT.features.head, desc: activeT.features.headDesc };
      case 'lips':
        return { name: activeT.features.lips, desc: activeT.features.lipsDesc };
      case 'hair':
        return { name: activeT.features.hair, desc: activeT.features.hairDesc };
      case 'clothes':
        return { name: activeT.features.clothes, desc: activeT.features.clothesDesc };
    }
  };

  return (
    <div className="feature-controls-card">
      {/* Header section */}
      <div className="feature-controls-header">
        <div className="feature-controls-title-group">
          <div className="feature-controls-icon-badge">
            <SparklesIcon size={16} color="var(--accent)" />
          </div>
          <div>
            <h3 className="feature-controls-title">{activeT.featureControlsTitle}</h3>
            <p className="feature-controls-sub">{activeT.featureControlsSub}</p>
          </div>
        </div>
        <div className="feature-active-count-badge">
          {selectedFeatures.size}/4 Active
        </div>
      </div>

      {/* Feature chips grid */}
      <div className="feature-chips-grid">
        {FEATURES_LIST.map(({ key, icon: Icon, accentColor }) => {
          const isSelected = selectedFeatures.has(key);
          const { name, desc } = getFeatureLabel(key);

          return (
            <button
              key={key}
              type="button"
              className={`feature-chip ${isSelected ? 'feature-chip--active' : ''}`}
              onClick={() => {
                sound.playClick();
                onToggleFeature(key);
              }}
              style={{
                ['--chip-accent' as any]: accentColor,
              }}
              aria-pressed={isSelected}
            >
              <div className="feature-chip__icon-wrapper">
                <Icon size={18} color={isSelected ? accentColor : 'var(--secondary)'} />
              </div>
              <div className="feature-chip__text">
                <div className="feature-chip__name">
                  <span>{name}</span>
                  {isSelected && (
                    <span className="feature-chip__check">
                      <CheckIcon size={12} color="#ffffff" />
                    </span>
                  )}
                </div>
                <div className="feature-chip__desc">{desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Quality mode selector */}
      <div className="quality-mode-container">
        <div className="quality-mode-label">
          <FourKIcon size={15} color="var(--accent)" />
          <span>{activeT.qualityTitle}</span>
        </div>
        <div className="quality-mode-options">
          <button
            type="button"
            className={`quality-btn ${qualityMode === '4k' ? 'quality-btn--active' : ''}`}
            onClick={() => {
              sound.playClick();
              onChangeQuality('4k');
            }}
          >
            <span className="quality-btn__badge">4K 2160p</span>
            <span className="quality-btn__name">{activeT.qualityModes.fourK}</span>
            {qualityMode === '4k' && (
              <span className="quality-btn__dot" />
            )}
          </button>

          <button
            type="button"
            className={`quality-btn ${qualityMode === 'hd' ? 'quality-btn--active' : ''}`}
            onClick={() => {
              sound.playClick();
              onChangeQuality('hd');
            }}
          >
            <span className="quality-btn__badge quality-btn__badge--subtle">1080p</span>
            <span className="quality-btn__name">{activeT.qualityModes.hd}</span>
            {qualityMode === 'hd' && (
              <span className="quality-btn__dot" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
