import React from 'react';
import type { ProcessingStep } from '../types';
import { translations, type Translations } from '../lib/i18n';
import { SparklesIcon } from './Icons';

interface ProcessingStateProps {
  currentStep: ProcessingStep;
  sourcePreviewUrl: string | null;
  templatePreviewUrl: string | null;
  t?: Translations;
}

export const ProcessingState: React.FC<ProcessingStateProps> = ({
  currentStep,
  sourcePreviewUrl,
  templatePreviewUrl,
  t,
}) => {
  const activeT = t || translations.en;

  const steps: { id: ProcessingStep; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'analyzing',
      label: activeT.stepAnalyzing,
      desc: activeT.stepAnalyzingDesc,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      ),
    },
    {
      id: 'matching',
      label: activeT.stepMatching,
      desc: activeT.stepMatchingDesc,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        </svg>
      ),
    },
    {
      id: 'checking',
      label: activeT.stepChecking,
      desc: activeT.stepCheckingDesc,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ),
    },
  ];

  const getStepStatus = (stepId: ProcessingStep) => {
    const order: ProcessingStep[] = ['analyzing', 'matching', 'checking'];
    const currentIndex = order.indexOf(currentStep);
    const stepIndex = order.indexOf(stepId);

    if (stepIndex < currentIndex) return 'done';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="processing">
      <h2 className="processing__title">{activeT.analyzingTitle}</h2>
      <p className="processing__sub">{activeT.analyzingSub}</p>

      <div className="processing__steps">
        {steps.map((s, idx) => {
          const status = getStepStatus(s.id);
          const isDone = status === 'done';
          const isActive = status === 'active';

          return (
            <React.Fragment key={s.id}>
              <div
                className={`processing__step ${
                  isDone
                    ? 'processing__step--done'
                    : isActive
                    ? 'processing__step--active'
                    : ''
                }`}
              >
                <div className="processing__step-icon">{s.icon}</div>
                <div className="processing__step-label">{s.label}</div>
                <div className="processing__step-desc">{s.desc}</div>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`processing__line ${
                    getStepStatus(steps[idx + 1].id) !== 'pending'
                      ? 'processing__line--active'
                      : ''
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="processing__visual">
        <div className="processing__animation">
          {sourcePreviewUrl && (
            <img
              src={sourcePreviewUrl}
              alt="Source"
              className="processing__anim-img"
              style={{ transform: 'rotate(-4deg)' }}
            />
          )}
          <div className="processing__sparkle" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SparklesIcon size={24} color="var(--accent)" />
          </div>
          {templatePreviewUrl && (
            <img
              src={templatePreviewUrl}
              alt="Template"
              className="processing__anim-img"
              style={{ transform: 'rotate(4deg)' }}
            />
          )}
        </div>
        <div className="processing__status">{activeT.processingImages}</div>
      </div>
    </div>
  );
};
