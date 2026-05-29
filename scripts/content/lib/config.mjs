import fs from 'fs';
import { PATHS, readJson, writeJson } from './paths.mjs';

export function loadConfig() {
  return readJson(PATHS.config);
}

export function loadIdeas() {
  const data = readJson(PATHS.ideas);
  if (!Array.isArray(data.ideas)) throw new Error('ideas.json must have an "ideas" array');
  return data;
}

export function saveIdeas(data) {
  writeJson(PATHS.ideas, data);
}

export function loadGuideIdeas() {
  if (!fs.existsSync(PATHS.guideIdeas)) {
    return { ideas: [] };
  }
  const data = readJson(PATHS.guideIdeas);
  if (!Array.isArray(data.ideas)) throw new Error('guide-ideas.json must have an "ideas" array');
  return data;
}

export function saveGuideIdeas(data) {
  writeJson(PATHS.guideIdeas, data);
}

export function updateGuideIdeaStatus(ideasData, id, status, extra = {}) {
  const idea = ideasData.ideas.find((i) => i.id === id);
  if (!idea) throw new Error(`Guide idea not found: ${id}`);
  idea.status = status;
  Object.assign(idea, extra);
  return idea;
}

export function updateIdeaStatus(ideasData, id, status, extra = {}) {
  const idea = ideasData.ideas.find((i) => i.id === id);
  if (!idea) throw new Error(`Idea not found: ${id}`);
  idea.status = status;
  Object.assign(idea, extra);
  return idea;
}

export const CATEGORIES = [
  'classic',
  'keto',
  'vegan',
  'nut-free',
  'gluten-free',
  'gourmet',
  'tropical',
  'spiced',
  'seasonal',
];
