// Sanity Studio: schemas/index.ts
// State и MainSettings убраны — они захардкожены на фронте

import painting from './painting';
import workshop from './workshop';
import installation from './installation';
import project from './project';
import thought from './thought';

export const schemaTypes = [
  painting,
  workshop,
  installation,
  project,
  thought,
];
