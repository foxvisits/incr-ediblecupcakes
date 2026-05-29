#!/usr/bin/env node
import { loadEnvFiles } from './lib/env.mjs';
loadEnvFiles();

import { cmdStatus } from './status.mjs';
import { cmdGenerate } from './generate.mjs';
import { cmdApprove } from './approve.mjs';
import { cmdSchedule } from './schedule.mjs';
import { cmdPublishDue } from './publish-due.mjs';
import { cmdImportIdeas } from './import-ideas.mjs';
import { cmdPipeline } from './pipeline.mjs';

const [, , command, ...args] = process.argv;

const help = `
Content pipeline — Incr-EdibleCupCakes

  npm run content:run [-- N]     ← GŁÓWNA KOMENDA (import + generate + schedule)
  npm run content:import         ← wczytaj content/ideas.txt
  npm run content:status
  npm run content:generate [-- N]
  npm run content:approve -- <id|all>
  npm run content:schedule
  npm run content:publish-due

Docs: content/README.md
`;

async function main() {
  switch (command) {
    case 'status':
      cmdStatus();
      break;
    case 'import':
      cmdImportIdeas();
      break;
    case 'run': {
      const n = args[0] ? parseInt(args[0], 10) : undefined;
      await cmdPipeline(n);
      break;
    }
    case 'generate': {
      const n = args[0] ? parseInt(args[0], 10) : undefined;
      await cmdGenerate(n);
      break;
    }
    case 'approve':
      if (!args[0]) {
        console.error('Usage: npm run content:approve -- <id|all>');
        process.exit(1);
      }
      cmdApprove(args[0]);
      break;
    case 'schedule':
      cmdSchedule();
      break;
    case 'publish-due':
      await cmdPublishDue();
      break;
    default:
      console.log(help);
      process.exit(command ? 1 : 0);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
