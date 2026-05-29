import fs from 'fs';
import path from 'path';
import { loadConfig, loadIdeas, loadGuideIdeas } from './lib/config.mjs';
import {
  DRAFTS,
  SCHEDULED,
  PUBLISHED_ARCHIVE,
  ASSETS,
  ensureDirs,
  listJsonFiles,
  readJson,
} from './lib/paths.mjs';

export function cmdStatus() {
  ensureDirs();
  const ideas = loadIdeas();
  const guideIdeas = loadGuideIdeas();
  const drafts = listJsonFiles(DRAFTS);
  const scheduled = listJsonFiles(SCHEDULED);
  const archived = listJsonFiles(PUBLISHED_ARCHIVE);

  const counts = ideas.ideas.reduce((acc, i) => {
    acc[i.status] = (acc[i.status] || 0) + 1;
    return acc;
  }, {});

  console.log('\n📋 Content pipeline status\n');
  console.log('Recipes by status:', counts);
  const guideCounts = guideIdeas.ideas.reduce((acc, i) => {
    acc[i.status] = (acc[i.status] || 0) + 1;
    return acc;
  }, {});
  console.log('Guides by status:', guideCounts);
  console.log(`Drafts on disk:     ${drafts.length}`);
  console.log(`Scheduled:          ${scheduled.length}`);
  console.log(`Published archive:  ${archived.length}`);
  console.log('');

  const rows = ideas.ideas
    .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))
    .map((i) => ({
      id: i.id,
      status: i.status,
      title: i.title.slice(0, 40),
      publishAt: i.publishAt?.slice(0, 16) || '-',
    }));

  console.log('ID      Status      Publish (local)   Title');
  console.log('─'.repeat(72));
  for (const r of rows) {
    console.log(
      `${r.id.padEnd(7)} ${r.status.padEnd(11)} ${r.publishAt.padEnd(17)} ${r.title}`
    );
  }

  const guideRows = guideIdeas.ideas
    .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))
    .map((i) => ({
      id: i.id,
      status: i.status,
      title: i.title.slice(0, 40),
      publishAt: i.publishAt?.slice(0, 16) || '-',
    }));

  if (guideRows.length) {
    console.log('\nGuides:');
    console.log('ID      Status      Publish (local)   Title');
    console.log('─'.repeat(72));
    for (const r of guideRows) {
      console.log(
        `${r.id.padEnd(7)} ${r.status.padEnd(11)} ${r.publishAt.padEnd(17)} ${r.title}`
      );
    }
  }
  console.log('');
}
