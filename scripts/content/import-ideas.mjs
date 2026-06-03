import fs from 'fs';
import path from 'path';
import { CATEGORIES, loadIdeas, saveIdeas } from './lib/config.mjs';
import { CONTENT } from './lib/paths.mjs';

const IDEAS_TXT = path.join(CONTENT, 'ideas.txt');

function nextId(existing) {
  let max = 0;
  for (const idea of existing) {
    const m = String(idea.id || '').match(/^r(\d+)$/i);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  }
  return `r${String(max + 1).padStart(3, '0')}`;
}

function normalizeCategory(raw) {
  if (!raw) return 'classic';
  const c = raw.trim().toLowerCase();
  return CATEGORIES.includes(c) ? c : 'classic';
}

function parseLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return null;

  const parts = trimmed.split('|').map((p) => p.trim());
  const title = parts[0];
  if (!title) return null;

  return {
    title,
    category: normalizeCategory(parts[1]),
    notes: parts[2] || '',
  };
}

export function parseIdeasText(text) {
  return text
    .split(/\r?\n/)
    .flatMap((line) => {
      const trimmed = line.trim();
      if (!trimmed) return [];
      // bullets / numbering: "- Title", "1. Title", "• Title"
      const cleaned = trimmed
        .replace(/^[-*•]\s+/, '')
        .replace(/^\d+[.)]\s+/, '')
        .trim();
      return [parseLine(cleaned)].filter(Boolean);
    });
}

/** Append parsed lines to ideas.txt (for chat / agent workflow) */
export function appendIdeasToFile(lines) {
  const parsed = typeof lines === 'string' ? parseIdeasText(lines) : lines;
  if (!parsed.length) return { appended: 0 };

  const existing = fs.existsSync(IDEAS_TXT) ? fs.readFileSync(IDEAS_TXT, 'utf8') : '';
  const existingTitles = new Set(
    parseIdeasText(existing).map((r) => r.title.trim().toLowerCase())
  );

  const toAdd = parsed.filter((r) => !existingTitles.has(r.title.trim().toLowerCase()));
  if (!toAdd.length) return { appended: 0, skipped: parsed.length };

  const block = toAdd
    .map((r) => {
      const parts = [r.title, r.category !== 'classic' ? r.category : null, r.notes || null].filter(Boolean);
      return parts.join(' | ');
    })
    .join('\n');

  const prefix = existing.endsWith('\n') || !existing ? '' : '\n';
  fs.writeFileSync(IDEAS_TXT, existing + prefix + block + '\n', 'utf8');
  return { appended: toAdd.length, skipped: parsed.length - toAdd.length };
}

/**
 * Remove from ideas.txt any line whose title already exists in ideas.json
 * with status other than "idea" (scheduled, approved, published, etc.).
 */
export function pruneIdeasTxtQueue(ideasData = loadIdeas()) {
  if (!fs.existsSync(IDEAS_TXT)) return { removed: 0 };

  const byTitle = new Map(
    ideasData.ideas.map((i) => [i.title.trim().toLowerCase(), i.status])
  );

  const lines = fs.readFileSync(IDEAS_TXT, 'utf8').split(/\r?\n/);
  const kept = [];
  let removed = 0;

  for (const line of lines) {
    const parsed = parseLine(line.trim().replace(/^[-*•]\s+/, '').replace(/^\d+[.)]\s+/, ''));
    if (!parsed) {
      kept.push(line);
      continue;
    }
    const status = byTitle.get(parsed.title.trim().toLowerCase());
    if (status && status !== 'idea') {
      removed++;
      continue;
    }
    kept.push(line);
  }

  const out = kept.join('\n').replace(/\n{3,}/g, '\n\n');
  fs.writeFileSync(IDEAS_TXT, out.endsWith('\n') ? out : out + '\n', 'utf8');
  return { removed };
}

export function cmdImportIdeas({ merge = true, pruneQueue = true } = {}) {
  if (!fs.existsSync(IDEAS_TXT)) {
    console.error(`Brak pliku: content/ideas.txt`);
    process.exit(1);
  }

  const parsed = parseIdeasText(fs.readFileSync(IDEAS_TXT, 'utf8'));
  if (parsed.length === 0) {
    console.log('content/ideas.txt jest pusty (same komentarze). Wklej pomysły — jeden na linię.');
    return { imported: 0 };
  }

  const ideasData = loadIdeas();
  const existingTitles = new Set(
    ideasData.ideas.map((i) => i.title.trim().toLowerCase())
  );

  let imported = 0;
  let skipped = 0;

  for (const row of parsed) {
    const key = row.title.trim().toLowerCase();
    if (existingTitles.has(key)) {
      skipped++;
      continue;
    }

    const id = nextId(ideasData.ideas);
    ideasData.ideas.push({
      id,
      title: row.title,
      category: row.category,
      notes: row.notes,
      priority: ideasData.ideas.length + 1,
      status: 'idea',
    });
    existingTitles.add(key);
    imported++;
  }

  if (!merge && imported > 0) {
    // keep only newly imported from this file run — not used by default
  }

  saveIdeas(ideasData);

  if (pruneQueue) {
    const { removed } = pruneIdeasTxtQueue(ideasData);
    if (removed) console.log(`   🧹 Usunięto ${removed} linii z ideas.txt (już w pipeline)`);
  }

  console.log(`\n📥 Import: ${imported} nowych pomysłów → content/ideas.json`);
  if (skipped) console.log(`   (${skipped} pominiętych — duplikat tytułu)`);
  console.log(`   Razem w kolejce: ${ideasData.ideas.filter((i) => i.status === 'idea').length} oczekujących\n`);

  return { imported, skipped, total: ideasData.ideas.length };
}
