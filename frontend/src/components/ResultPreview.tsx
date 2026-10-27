import React from 'react';
import { translations, type Translations } from '../lib/i18n';
import { MaximizeIcon, CheckIcon } from './Icons';
import { sound } from '../lib/sound';

interface ResultPreviewProps {
  sourceUrl: string;
  resultUrl: string;
  onDownload: () => void;
  onReset: () => void;
  t?: Translations;
  resolution?: string;
}

export const ResultPreview: React.FC<ResultPreviewProps> = ({
  sourceUrl,
  resultUrl,
  onDownload,
  onReset,
  t,
  resolution,
}) => {
  const activeT = t || translations.en;

  return (
    <div className="result" style={{ position: 'relative', zIndex: 5 }}>
      <div className="result__badge">
        <CheckIcon size={24} color="#fff" />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
        <h2 className="result__title" style={{ margin: 0 }}>{activeT.resultTitle}</h2>
        <span
          style={{
            background: 'rgba(49, 85, 255, 0.1)',
            color: 'var(--accent)',
            border: '1px solid var(--accent)',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <MaximizeIcon size={12} />
          {resolution || '4K Ultra-HD (2160p)'}
        </span>
      </div>

      <p className="result__sub">{activeT.resultSub}</p>

      <div className="result__images">
        <div className="result__img-wrap">
          <span className="result__tag result__tag--before">{activeT.beforeTag}</span>
          <img src={sourceUrl} alt={activeT.beforeTag} />
        </div>

        <div className="result__img-wrap">
          <span className="result__tag result__tag--after">{activeT.afterTag}</span>
          <img src={resultUrl} alt={activeT.afterTag} />
        </div>
      </div>

      <div className="result__actions">
        <button
          className="btn btn--primary"
          onClick={() => {
            sound.playClick();
            onDownload();
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>{activeT.downloadBtn}</span>
        </button>

        <button
          className="btn btn--secondary"
          onClick={() => {
            sound.playClick();
            onReset();
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          <span>{activeT.tryAgainBtn}</span>
        </button>
      </div>
    </div>
  );
};
