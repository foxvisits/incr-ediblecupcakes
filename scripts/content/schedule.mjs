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

/**
 * Seasonal recipes are worthless out of season: a Christmas cupcake published
 * in June is stale before anyone searches for it, and the page carries a
 * publish date six months adrift from its own subject. Priority order alone
 * scattered them at random — Valentine's landed in October, Easter in October,
 * Christmas in June.
 *
 * Each pattern maps to the month the post should appear in, set a few weeks
 * ahead of the occasion so it is indexed by the time interest builds.
 */
const SEASONAL_TARGETS = [
  [/valentine/i, 1], // February 14 → publish in January
  [/easter/i, 2], // late March or April → publish in March
  [/mother'?s day/i, 3],
  [/4th of july|independence/i, 5], // July 4 → publish in June
  [/s'?mores|summer lemonade|picnic/i, 5],
  [/pumpkin|harvest|autumn|apple cider|fair/i, 8], // October → publish in September
  [/halloween/i, 8],
  [/thanksgiving/i, 9],
  [/christmas|reindeer|snowman|eggnog|gingerbread|snowflake|holiday|peppermint|cranberry orange/i, 10], // December → publish in November
  [/spring|floral|blossom/i, 1], // spring → publish in February
];

const seasonalMonthFor = (title) => SEASONAL_TARGETS.find(([re]) => re.test(title))?.[1] ?? null;

/**
 * Move each seasonal item to the first slot whose month matches its target,
 * taking the slot of whatever evergreen post sat there. Items whose season has
 * already passed within the run wait for the next occurrence of that month, and
 * anything that cannot be placed inside the run keeps its original slot rather
 * than being dropped.
 */
function applySeasonalOrder(queue, startDate) {
  const monthAt = (index) => {
    const d = new Date(startDate);
    d.setUTCDate(d.getUTCDate() + index);
    return d.getUTCMonth();
  };

  const seasonal = [];
  const evergreen = [];
  for (const item of queue) {
    const target = seasonalMonthFor(item.title ?? '');
    (target === null ? evergreen : seasonal).push({ item, target });
  }
  if (!seasonal.length) return queue;

  const out = new Array(queue.length).fill(null);
  const taken = new Set();
  const deferred = [];

  for (const { item, target } of seasonal) {
    let placed = false;
    for (let i = 0; i < queue.length; i++) {
      if (taken.has(i) || monthAt(i) !== target) continue;
      out[i] = item;
      taken.add(i);
      placed = true;
      break;
    }
    // The run does not reach this item's season. Filling the gap with it anyway
    // is how Valentine's ends up published on Christmas Day. Hold it back
    // instead and schedule it in a later run, closer to when it is worth
    // reading.
    if (!placed) deferred.push(item);
  }

  let next = 0;
  for (const { item } of evergreen) {
    while (next < out.length && out[next] !== null) next++;
    if (next >= out.length) break;
    out[next] = item;
    taken.add(next);
  }

  return { queue: out.filter(Boolean), deferred };
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

  const recipesPerDay = schedule.recipesPerDay;
  const guidesPerDay = schedule.guidesPerDay;
  const useSplitDaily =
    Number.isFinite(recipesPerDay) && recipesPerDay > 0 &&
    Number.isFinite(guidesPerDay) && guidesPerDay > 0;

  let remainingRecipes = approvedRecipes.map((i) => ({ ...i, contentType: 'recipe' }));
  let remainingGuides = approvedGuides.map((i) => ({ ...i, contentType: 'guide' }));

  if (!useSplitDaily) {
    const queue = buildInterleavedQueue(
      approvedRecipes,
      approvedGuides,
      schedule.interleaveTypes !== false
    );
    if (queue.length === 0) {
      console.log('Nothing approved to schedule.');
      return;
    }
  } else if (remainingRecipes.length === 0 && remainingGuides.length === 0) {
    console.log('Nothing approved to schedule.');
    return;
  }

  const totalCount = remainingRecipes.length + remainingGuides.length;

  let cursor = schedule.startDate
    ? new Date(schedule.startDate + 'T12:00:00Z')
    : new Date();
  cursor.setUTCHours(0, 0, 0, 0);

  // A startDate left behind in the config back-dates the whole run. With the
  // date two months stale, every slot up to today was already due, so the next
  // publish job would have emptied sixty-odd posts at once — which is both the
  // opposite of the daily pacing and exactly what scaled-content dumping looks
  // like. Never schedule into the past.
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  if (cursor < today) {
    console.log(
      `  ℹ️  startDate ${schedule.startDate} is in the past; starting from today instead ` +
        `(would otherwise have published ${Math.round((today - cursor) / 86400000)} days of backlog at once)`,
    );
    cursor = today;
  }

  if (schedule.skipWeekends) {
    while (cursor.getUTCDay() === 0 || cursor.getUTCDay() === 6) {
      cursor = nextDay(cursor, true);
    }
  }

  console.log(
    `\n📅 Scheduling ${totalCount} item(s)` +
      (useSplitDaily
        ? ` (${recipesPerDay} recipe(s) + ${guidesPerDay} guide(s) per day)...\n`
        : '...\n')
  );

  if (!useSplitDaily) {
    const queue = buildInterleavedQueue(
      approvedRecipes,
      approvedGuides,
      schedule.interleaveTypes !== false
    );
    let remaining = [...queue];

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
  } else {
    // Only recipes carry seasonal titles; guides are evergreen technique posts.
    const seasonalPass = applySeasonalOrder(remainingRecipes, cursor);
    remainingRecipes = seasonalPass.queue;
    if (seasonalPass.deferred.length) {
      console.log(
        `  ℹ️  Holding back ${seasonalPass.deferred.length} recipe(s) whose season falls after this run; ` +
          `schedule them nearer the date:`,
      );
      seasonalPass.deferred.forEach((i) => console.log(`      ${i.id}  ${i.title}`));
      console.log('');
    }

    while (remainingRecipes.length > 0 || remainingGuides.length > 0) {
      const dayItems = [];
      for (let i = 0; i < recipesPerDay && remainingRecipes.length; i++) {
        dayItems.push(remainingRecipes.shift());
      }
      for (let i = 0; i < guidesPerDay && remainingGuides.length; i++) {
        dayItems.push(remainingGuides.shift());
      }

      const daySlots = [];
      for (let i = 0; i < dayItems.length; i++) {
        daySlots.push(
          randomMinutesInWindow(
            schedule.publishWindowStart || '09:00',
            schedule.publishWindowEnd || '19:00'
          )
        );
      }
      daySlots.sort((a, b) => a - b);

      for (let i = 0; i < dayItems.length; i++) {
        const publishAt = formatPublishAt(cursor, daySlots[i], offsetStr);
        scheduleItem(dayItems[i], publishAt, ideasData, guideIdeasData);
      }

      cursor = nextDay(cursor, schedule.skipWeekends);
    }
  }

  saveIdeas(ideasData);
  saveGuideIdeas(guideIdeasData);
  console.log('\nSchedule saved. Run content:publish-due when times arrive.\n');
}
