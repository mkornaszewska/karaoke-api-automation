import fs from 'fs';
import path from 'path';

const seedFile = path.join(__dirname, 'db.seed.json');
const dbFile = path.join(__dirname, 'db.json');
const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';

type SeedData = Record<string, Record<string, unknown>[]>;

async function resetCollection(name: string, seedRecords: Record<string, unknown>[]) {
  const res = await fetch(`${BASE_URL}/${name}`);
  if (!res.ok) return;

  const current: Record<string, unknown>[] = await res.json();
  for (const record of current) {
    await fetch(`${BASE_URL}/${name}/${record['id']}`, { method: 'DELETE' });
  }
  for (const record of seedRecords) {
    await fetch(`${BASE_URL}/${name}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
  }
}

export default async function globalSetup() {
  fs.copyFileSync(seedFile, dbFile);

  // If a server is already running (reuseExistingServer: true), reset its
  // in-memory state via API — copying db.json only affects a fresh start.
  try {
    const seed: SeedData = JSON.parse(fs.readFileSync(seedFile, 'utf-8'));
    await Promise.all(
      Object.entries(seed).map(([collection, records]) => resetCollection(collection, records))
    );
  } catch {
    // Server not running yet — it will start fresh from the copied db.json.
  }
}
