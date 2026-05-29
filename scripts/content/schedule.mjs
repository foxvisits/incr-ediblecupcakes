import fs from 'fs';
import path from 'path';
import {
  loadConfig,
  loadIdeas,
  saveIdeas,
  updateIdeaStatus,
  loadGuideIdeas,
  saveGuideIdeas,
  updateGuideIdeaStatus,
} from './lib/config.mjs';
import {
  DRAFTS,
  SCHEDULED,
  GUIDE_DRAFTS,
  GUIDE_SCHEDULED,
  ensureDirs,
  readJson,
  writeJson,
} from './lib/paths.mjs';

function randomMinutesInWindow(start, end) {
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  const lo = sh * 60 + sm;
  const hi = eh * 60 + em;
  return lo + Math.floor(Math.random() * Math.max(1, hi - lo));
}

function formatPublishAt(date, minutesFromMidnight, offsetStr) {
  const y = date.getUTCFullYear();
  const mo = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  const h = String(Math.floor(minutesFromMidnight / 60)).padStart(2, '0');
  const mi = String(minutesFromMidnight % 60).padStart(2, '0');
  return `${y}-${mo}-${d}T${h}:${mi}:00${offsetStr}`;
}

function nextDay(date, skipWeekends) {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + 1);
  if (skipWeekends) {
    while (d.getUTCDay() === 0 || d.getUTCDay() === 6) {
      d.setUTCDate(d.getUTCDate() + 1);
    }
  }
  return d;
}

function itemsPerDay(schedule) {
  if (schedule.mode === 'fixed') return schedule.fixedPerDay ?? 2;
  const min = schedule.minPerDay ?? 1;
  const max = schedule.maxPerDay ?? 3;
  return min + Math.floor(Math.random() * (max - min + 1));
}

function buildInterleavedQueue(recipes, guides, interleave) {
  if (!interleave) {
    return [
      ...recipes.map((i) => ({ ...i, contentType: 'recipe' })),
      ...guides.map((i) => ({ ...i, contentType: 'guide' })),
    ];
  }

  const queue = [];
  const r = [...recipes];
  const g = [...guides];
  while (r.length || g.length) {
    if (r.length) queue.push({ ...r.shift(), contentType: 'recipe' });
    if (g.length) queue.push({ ...g.shift(), contentType: 'guide' });
  }
  return queue;
}

function scheduleItem(item, publishAt, ideasData, guideIdeasData) {
  if (item.contentType === 'guide') {
    const draftPath = path.join(GUIDE_DRAFTS, `${item.id}.json`);
    const draft = readJson(draftPath);
    draft.publishAt = publishAt;
    draft.contentIdeaId = item.id;
    draft.contentType = 'guide';
    writeJson(path.join(GUIDE_SCHEDULED, `${draft.slug}.json`), draft);
    updateGuideIdeaStatus(guideIdeasData, item.id, 'scheduled', {
      publishAt,
      slug: draft.slug,
    });
    console.log(`  [guide] ${item.id} → ${publishAt}  (${draft.title})`);
    return;
  }

  const draftPath = path.join(DRAFTS, `${item.id}.json`);
  const draft = readJson(draftPath);
  draft.publishAt = publishAt;
  draft.contentIdeaId = item.id;
  draft.contentType = 'recipe';
  writeJson(path.join(SCHEDULED, `${draft.slug}.json`), draft);
  updateIdeaStatus(ideasData, item.id, 'scheduled', { publishAt, slug: draft.slug });
  console.log(`  [recipe] ${item.id} → ${publishAt}  (${draft.title})`);
}

export function cmdSchedule() {
  ensureDirs();
  const config = loadConfig();
  const schedule = config.schedule;
  const offsetStr = schedule.utcOffset || '+01:00';
  const ideasData = loadIdeas();
  const guideIdeasData = loadGuideIdeas();

  const approvedRecipes = ideasData.ideas
    .filter((i) => i.status === 'approved')
    .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));

  const approvedGuides = guideIdeasData.ideas
    .filter((i) => i.status === 'approved')
    .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));

  const queue = buildInterleavedQueue(
    approvedRecipes,
    approvedGuides,
    schedule.interleaveTypes !== false
  );

  if (queue.length === 0) {
    console.log('Nothing approved to schedule.');
    return;
  }

  let cursor = schedule.startDate
    ? new Date(schedule.startDate + 'T12:00:00Z')
    : new Date();
  cursor.setUTCHours(0, 0, 0, 0);

  if (schedule.skipWeekends) {
    while (cursor.getUTCDay() === 0 || cursor.getUTCDay() === 6) {
      cursor = nextDay(cursor, true);
    }
  }

  let remaining = [...queue];
  console.log(`\n📅 Scheduling ${remaining.length} item(s) (recipes + guides)...\n`);

  while (remaining.length > 0) {
    const n = Math.min(itemsPerDay(schedule), remaining.length);
    const daySlots = [];

    for (let i = 0; i < n; i++) {
      daySlots.push(
        randomMinutesInWindow(
          schedule.publishWindowStart || '09:00',
          schedule.publishWindowEnd || '19:00'
        )
      );
    }
    daySlots.sort((a, b) => a - b);

    for (const mins of daySlots) {
      const item = remaining.shift();
      if (!item) break;
      const publishAt = formatPublishAt(cursor, mins, offsetStr);
      scheduleItem(item, publishAt, ideasData, guideIdeasData);
    }

    cursor = nextDay(cursor, schedule.skipWeekends);
  }

  saveIdeas(ideasData);
  saveGuideIdeas(guideIdeasData);
  console.log('\nSchedule saved. Run content:publish-due when times arrive.\n');
}
