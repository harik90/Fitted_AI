export type BackgroundOption =
  | 'white'
  | 'light-gray'
  | 'dark-gray'
  | 'blue'
  | 'black';

export interface PresetUniform {
  id: string;
  name: string;
  imageUrl: string;
  icon?: string;
}

export type ProcessingStep = 'analyzing' | 'matching' | 'checking';

export type FeatureKey = 'head' | 'lips' | 'hair' | 'clothes';
export type QualityMode = '4k' | 'hd';

export interface MatchResponse {
  success: boolean;
  result_url: string;
  result_base64?: string;
  score?: number;
  attempts?: number;
  request_id?: string;
  message?: string;
  gender?: string;
  resolution?: string;
  hair_adapted?: boolean;
}


export interface MatchError {
  detail: string;
}
