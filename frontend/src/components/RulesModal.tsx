import React from 'react';
import type { Language } from '../lib/i18n';
import {
  ShieldCheckIcon,
  CloseIcon,
  UserIcon,
  LayersIcon,
  SparklesIcon,
  MaximizeIcon,
  SlidersIcon,
} from './Icons';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;

  const isHi = lang === 'hi';

  const rules = [
    {
      icon: <UserIcon size={18} color="var(--accent)" />,
      titleEn: '1. Face Alignment & Pose Matching',
      titleHi: '1. फेस अलाइनमेंट व पोश्चर नियम',
      descEn:
        'Source photo should have a clear, front or slight 3/4 angle (under 35° tilt) to ensure natural head geometry and realistic neck alignment.',
      descHi:
        'बेहतर परिणाम के लिए चेहरे का कोण सामने या 35° से कम झुकाव वाला होना चाहिए ताकि सिर और गर्दन की बनावट प्राकृतिक लगे।',
    },
    {
      icon: <SlidersIcon size={18} color="var(--accent)" />,
      titleEn: '2. Hairstyle & Gender Silhouette Adaptation',
      titleHi: '2. हेयरस्टाइल व जेंडर एडेप्टेशन',
      descEn:
        'When swapping a male face onto an outfit or across hairstyles, the AI adapts the haircut and removes cascading shoulder hair strands for a clean masculine finish.',
      descHi:
        'जब पुरुष चेहरे को किसी यूनिफॉर्म पर सेट किया जाता है, तो AI हेयरकट को स्वचालित रूप से अनुकूलित करता है और कंधों के लंबे बालों को हटा देता है।',
    },
    {
      icon: <LayersIcon size={18} color="var(--accent)" />,
      titleEn: '3. 100% Uniform & Badge Preservation',
      titleHi: '3. यूनिफॉर्म, टाई व बैज का 100% संरक्षण',
      descEn:
        'All fabric textures, ties, collars, lapels, embroidery, and organization badges remain completely unaltered with zero warping or distortion.',
      descHi:
        'कपड़े की बनावट, टाई, कॉलर, बटन और संस्थागत लोगो या बैज बिना किसी विकृति के शत-प्रतिशत मूल रूप में सुरक्षित रहते हैं।',
    },
    {
      icon: <SparklesIcon size={18} color="var(--accent)" />,
      titleEn: '4. Dynamic Studio Lighting Harmonization',
      titleHi: '4. स्टूडियो लाइटिंग व स्किन टोन संतुलन',
      descEn:
        'Color temperature, ambient shadows, and skin tones are harmonized so the face matches the lighting environment of the target portrait.',
      descHi:
        'चेहरे की चमक, परछाई और स्किन टोन को बैकग्राउंड और यूनिफॉर्म की स्टूडियो लाइटिंग के अनुसार संतुलित किया जाता है।',
    },
    {
      icon: <MaximizeIcon size={18} color="var(--accent)" />,
      titleEn: '5. 4K Ultra-HD Resolution & Detail Restoration',
      titleHi: '5. 4K अल्ट्रा-एचडी व माइक्रो-डिटेल रिस्टोरेशन',
      descEn:
        'Even low-resolution uploads are restored using GFPGAN neural reconstruction (pupils, iris, skin texture) and super-sampled to crisp 4K Ultra-HD (2160p).',
      descHi:
        'कम रिज़ॉल्यूशन वाली तस्वीरों को भी GFPGAN न्यूरल इंजन द्वारा (आंखें, पलकें, त्वचा) रिस्टोर करके 4K अल्ट्रा-एचडी (2160p) में रेंडर किया जाता है।',
    },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--surface)',
          backdropFilter: 'blur(28px) saturate(190%)',
          WebkitBackdropFilter: 'blur(28px) saturate(190%)',
          border: '1px solid var(--border)',
          borderRadius: '18px',
          maxWidth: '560px',
          width: '100%',
          padding: '28px',
          boxShadow: 'var(--shadow-lg), inset 0 1px 1px 0 var(--glass-highlight)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--accent-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent)',
                boxShadow: '0 2px 10px var(--accent-glow)',
              }}
            >
              <ShieldCheckIcon size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1875rem', fontWeight: 700, margin: 0, color: 'var(--primary)' }}>
                {isHi ? 'AI फोटो जनरेशन नियम व आउटपुट मानक' : 'AI Output Standards & Image Rules'}
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--secondary)' }}>
                {isHi ? '100% स्वाभाविक और 4K सटीक परिणाम के लिए तकनीकी नियम' : 'Generation guidelines for realistic, 4K photo matching'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--secondary)',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '6px',
              transition: 'all 0.15s ease',
            }}
            title="Close"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.8125rem', color: 'var(--secondary)', lineHeight: 1.55 }}>
          {rules.map((rule, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ marginTop: '2px', flexShrink: 0 }}>{rule.icon}</div>
              <div>
                <strong style={{ color: 'var(--primary)', fontSize: '0.875rem', display: 'block', marginBottom: '2px' }}>
                  {isHi ? rule.titleHi : rule.titleEn}
                </strong>
                <p style={{ margin: 0 }}>
                  {isHi ? rule.descHi : rule.descEn}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: '20px',
            width: '100%',
            padding: '13px',
            background: 'linear-gradient(135deg, var(--accent) 0%, #3B82F6 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.875rem',
            cursor: 'pointer',
            boxShadow: '0 4px 16px var(--accent-glow), inset 0 1px 1px 0 rgba(255, 255, 255, 0.35)',
            transition: 'all 0.15s ease',
          }}
        >
          {isHi ? 'स्वीकार करें' : 'Got It'}
        </button>
      </div>
    </div>
  );
};
