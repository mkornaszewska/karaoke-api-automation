import fs from 'fs';
import path from 'path';

const seedFile = path.join(__dirname, 'db.seed.json');
const dbFile = path.join(__dirname, 'db.json');

export default async function globalSetup() {
  fs.copyFileSync(seedFile, dbFile);
}
