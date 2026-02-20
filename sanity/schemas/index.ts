// Sanity Studio: schemas/index.ts
// Добавьте эти схемы в ваш Sanity Studio проект

import state from './state';
import painting from './painting';
import mainSettings from './mainSettings';
import workshop from './workshop';
import installation from './installation';
import project from './project';

export const schemaTypes = [
  // Singleton
  mainSettings,
  // Documents
  state,
  painting,
  workshop,
  installation,
  project,
];
