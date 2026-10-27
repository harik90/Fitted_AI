import type { PresetUniform } from '../types';

export const MALE_UNIFORMS: PresetUniform[] = [
  {
    id: 'formal',
    name: 'Formal Suit',
    imageUrl: '/presets/formal.jpg',
  },
  {
    id: 'male_doctor',
    name: 'Doctor (Lab Coat)',
    imageUrl: '/presets/male_doctor.jpg',
  },
  {
    id: 'police',
    name: 'Police Uniform',
    imageUrl: '/presets/police.jpg',
  },
  {
    id: 'school',
    name: 'College Blazer',
    imageUrl: '/presets/school.jpg',
  },
  {
    id: 'military',
    name: 'Military Camo',
    imageUrl: '/presets/military.jpg',
  },
  {
    id: 'casual',
    name: 'Casual Polo',
    imageUrl: '/presets/casual.jpg',
  },
];

export const FEMALE_UNIFORMS: PresetUniform[] = [
  {
    id: 'female_formal',
    name: 'Formal Blazer',
    imageUrl: '/presets/female_formal.jpg',
  },
  {
    id: 'female_doctor',
    name: 'Doctor (Lab Coat)',
    imageUrl: '/presets/female_doctor.jpg',
  },
  {
    id: 'female_police',
    name: 'Police Uniform',
    imageUrl: '/presets/female_police.jpg',
  },
  {
    id: 'female_pilot',
    name: 'Pilot Uniform',
    imageUrl: '/presets/female_pilot.jpg',
  },
  {
    id: 'school',
    name: 'College Blazer',
    imageUrl: '/presets/school.jpg',
  },
  {
    id: 'casual',
    name: 'Casual Polo',
    imageUrl: '/presets/casual.jpg',
  },
];

export const PRESET_UNIFORMS: PresetUniform[] = MALE_UNIFORMS;
