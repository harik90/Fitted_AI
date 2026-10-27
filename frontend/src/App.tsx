import React, { useState } from 'react';
import type { ProcessingStep, PresetUniform, BackgroundOption, FeatureKey, QualityMode } from './types';
import { Header } from './components/Header';
import { UploadCard } from './components/UploadCard';
import { TemplatePicker } from './components/TemplatePicker';
import { BackgroundPicker } from './components/BackgroundPicker';
import { FeatureControls } from './components/FeatureControls';
import { ProcessingState } from './components/ProcessingState';
import { ResultPreview } from './components/ResultPreview';
import { GlowingBackground } from './components/GlowingBackground';
import { AlertCircleIcon, CheckIcon, SlidersIcon } from './components/Icons';
import { ServerStatusIndicator } from './components/ServerStatusIndicator';
import { matchPhotos, API_BASE } from './lib/api';
import { translations, type Language } from './lib/i18n';
import { sound } from './lib/sound';
import './index.css';

export const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [lang, setLang] = useState<Language>('en');

  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourcePreview, setSourcePreview] = useState<string | null>(null);

  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [templatePreview, setTemplatePreview] = useState<string | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  const [selectedBg, setSelectedBg] = useState<BackgroundOption>('white');
  const [customInstructions, setCustomInstructions] = useState<string>('');

  const [selectedFeatures, setSelectedFeatures] = useState<Set<FeatureKey>>(
    new Set<FeatureKey>(['head', 'lips', 'hair', 'clothes'])
  );
  const [qualityMode, setQualityMode] = useState<QualityMode>('4k');
  const [resultResolution, setResultResolution] = useState<string>('4K Ultra-HD (2160p)');

  const [status, setStatus] = useState<'idle' | 'processing' | 'result'>('idle');
  const [processingStep, setProcessingStep] = useState<ProcessingStep>('analyzing');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const t = translations[lang];

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const handleSelectSource = (file: File) => {
    setSourceFile(file);
    setSourcePreview(URL.createObjectURL(file));
    setError(null);
  };

  const handleClearSource = () => {
    setSourceFile(null);
    setSourcePreview(null);
  };

  const handleSelectTemplate = (file: File) => {
    setTemplateFile(file);
    setTemplatePreview(URL.createObjectURL(file));
    setSelectedPresetId(null);
    setError(null);
  };

  const handleClearTemplate = () => {
    setTemplateFile(null);
    setTemplatePreview(null);
    setSelectedPresetId(null);
  };

  const handleSelectPreset = async (preset: PresetUniform) => {
    try {
      setSelectedPresetId(preset.id);
      setTemplatePreview(preset.imageUrl);
      setError(null);

      const res = await fetch(preset.imageUrl);
      const blob = await res.blob();
      const file = new File([blob], `${preset.id}.jpg`, { type: 'image/jpeg' });
      setTemplateFile(file);
    } catch {
      setError('Failed to load preset template image.');
    }
  };

  const handleToggleFeature = (feature: FeatureKey) => {
    setSelectedFeatures((prev) => {
      const next = new Set(prev);
      if (next.has(feature)) {
        if (next.size > 1) {
          next.delete(feature);
        }
      } else {
        next.add(feature);
      }
      return next;
    });
  };

  const canMatch = sourceFile !== null && templateFile !== null;

  const handleMatch = async () => {
    if (!sourceFile || !templateFile) {
      sound.playClick();
      setError('Please provide both your photo and a template outfit.');
      return;
    }

    sound.playThud();
    setError(null);
    setStatus('processing');
    setProcessingStep('analyzing');

    const stepTimer1 = setTimeout(() => setProcessingStep('matching'), 900);
    const stepTimer2 = setTimeout(() => setProcessingStep('checking'), 1800);

    try {
      const response = await matchPhotos(
        sourceFile,
        templateFile,
        selectedBg,
        customInstructions,
        Array.from(selectedFeatures).join(','),
        qualityMode
      );
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      if (response.resolution) {
        setResultResolution(response.resolution);
      }

      let finalResultUrl = response.result_base64;
      if (!finalResultUrl) {
        const rawUrl = response.result_url;
        const targetUrl = rawUrl.startsWith('http')
          ? rawUrl
          : `${API_BASE}${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;
        try {
          const imgRes = await fetch(targetUrl);
          if (imgRes.ok) {
            const blob = await imgRes.blob();
            finalResultUrl = URL.createObjectURL(blob);
          } else {
            finalResultUrl = targetUrl;
          }
        } catch {
          finalResultUrl = targetUrl;
        }
      }

      setResultUrl(finalResultUrl);

      setStatus('result');
      sound.playClick();
    } catch (err: any) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setError(err?.message || 'Something went wrong while generating the result.');
      setStatus('idle');
      sound.playClick();
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `fitted_ai_4k_result_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    setStatus('idle');
    setResultUrl(null);
    setError(null);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Dynamic Glowing Dots Wave Background */}
      <GlowingBackground isDark={theme === 'dark'} />

      <Header
        isDark={theme === 'dark'}
        onToggleTheme={toggleTheme}
        currentLang={lang}
        onChangeLang={setLang}
      />

      <main className="main" style={{ position: 'relative', zIndex: 1 }}>
        {error && (
          <div className="error-msg">
            <span className="error-msg__icon" style={{ display: 'flex', alignItems: 'center' }}>
              <AlertCircleIcon size={18} color="#ef4444" />
            </span>
            <div className="error-msg__text">{error}</div>
          </div>
        )}

        {status === 'idle' && (
          <>
            <div className="hero">
              <ServerStatusIndicator t={t} isDark={theme === 'dark'} />
              <h1 className="hero__title">
                {t.heroTitle}
                <span className="hero__accent">{t.heroAccent}</span>
              </h1>
              <p className="hero__sub">{t.heroSub}</p>
            </div>

            {templateFile && !sourceFile && (
              <div className="info-banner">
                <CheckIcon size={16} />
                <span>
                  {lang === 'hi'
                    ? 'यूनिफॉर्म चुन ली गई है! अब केवल अपना चेहरा अपलोड करें।'
                    : 'Uniform selected! Now just upload your face photo to fit.'}
                </span>
              </div>
            )}

            <div className="upload-grid">
              <UploadCard
                title={t.yourPhotoTitle}
                subtitle={t.yourPhotoSub}
                imagePreviewUrl={sourcePreview}
                buttonLabel={t.uploadPhotoBtn}
                changeLabel={t.changePhotoBtn}
                dragDropHint={t.dragDropHint}
                formatHint={t.formatHint}
                onSelectFile={handleSelectSource}
                onClear={handleClearSource}
              />

              <UploadCard
                title={t.templateTitle}
                subtitle={t.templateSub}
                imagePreviewUrl={templatePreview}
                buttonLabel={t.uploadTemplateBtn}
                changeLabel={t.changePhotoBtn}
                dragDropHint={t.dragDropHint}
                formatHint={t.formatHint}
                onSelectFile={handleSelectTemplate}
                onClear={handleClearTemplate}
              />
            </div>

            <div className="presets-section">
              <TemplatePicker
                selectedPresetId={selectedPresetId}
                onSelectPreset={handleSelectPreset}
                t={t}
              />
              <BackgroundPicker
                selectedBg={selectedBg}
                onSelectBg={setSelectedBg}
                t={t}
              />
            </div>

            {/* Granular AI Swap Features & 4K Quality Controls */}
            <FeatureControls
              selectedFeatures={selectedFeatures}
              onToggleFeature={handleToggleFeature}
              qualityMode={qualityMode}
              onChangeQuality={setQualityMode}
              t={t}
            />

            {/* Custom AI Instructions Field */}
            <div className="custom-instructions-card">
              <div className="custom-instructions-header">
                <SlidersIcon size={16} color="var(--accent)" />
                <span>
                  {lang === 'hi'
                    ? 'कस्टम AI निर्देश (वैकल्पिक)'
                    : 'Custom AI Instructions (Optional)'}
                </span>
              </div>
              <input
                type="text"
                className="custom-instructions-input"
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder={
                  lang === 'hi'
                    ? 'उदा. पुरुष हेयरकट, अल्ट्रा-शार्प आंखें, स्टूडियो लाइटिंग, प्राकृतिक स्किन...'
                    : 'e.g. Male haircut, ultra sharp eyes, studio lighting, natural skin tone...'
                }
              />
            </div>

            <button
              className="match-btn"
              disabled={!canMatch}
              onClick={handleMatch}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
              </svg>
              <span>
                {!sourceFile && templateFile
                  ? lang === 'hi'
                    ? 'मैच करने के लिए अपनी फोटो अपलोड करें'
                    : 'Upload your photo to match'
                  : !templateFile && sourceFile
                  ? lang === 'hi'
                    ? 'यूनिफॉर्म या टेम्पलेट चुनें'
                    : 'Select or upload a uniform'
                  : t.matchBtn}
              </span>
            </button>
          </>
        )}

        {status === 'processing' && (
          <ProcessingState
            currentStep={processingStep}
            sourcePreviewUrl={sourcePreview}
            templatePreviewUrl={templatePreview}
            t={t}
          />
        )}

        {status === 'result' && resultUrl && (
          <ResultPreview
            sourceUrl={sourcePreview || ''}
            resultUrl={resultUrl}
            resolution={resultResolution}
            onDownload={handleDownload}
            onReset={handleReset}
            t={t}
          />
        )}

        <div className="footer-notice">
          {t.footerNotice}
        </div>
      </main>
    </div>
  );
};
