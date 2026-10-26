import * as migration_20261026_090708_initial from './20261026_090708_initial';

export const migrations = [
  {
    up: migration_20261026_090708_initial.up,
    down: migration_20261026_090708_initial.down,
    name: '20261026_090708_initial'
  },
];
