import type { MatchResponse } from '../types';

export const API_BASE = (
  import.meta.env.VITE_API_URL || ''
).replace(/\/+$/, '');

export async function matchPhotos(
  sourceImage: File | Blob,
  templateImage: File | Blob,
  background: string,
  instructions: string = '',
  features: string = 'head,lips,hair,clothes',
  qualityMode: string = '4k'
): Promise<MatchResponse> {
  const formData = new FormData();
  formData.append('source_image', sourceImage, 'source.png');
  formData.append('template_image', templateImage, 'template.jpg');
  formData.append('background', background);
  if (instructions.trim()) {
    formData.append('instructions', instructions.trim());
  }
  formData.append('features', features);
  formData.append('quality_mode', qualityMode);

  const endpoint = `${API_BASE}/api/match`;
  const res = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    let errorMsg = 'Something went wrong while generating the result.';
    try {
      const errData = await res.json();
      if (errData.detail) {
        errorMsg = errData.detail;
      }
    } catch {
      // Use fallback
    }
    throw new Error(errorMsg);
  }

  return res.json();
}

export async function checkServerHealth(timeoutMs = 4000): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const endpoint = `${API_BASE}/api/health`;
    const res = await fetch(endpoint, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return false;
    const data = await res.json();
    return data?.status === 'ok';
  } catch {
    return false;
  }
}
