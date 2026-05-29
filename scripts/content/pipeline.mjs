import { loadConfig } from './lib/config.mjs';
import { cmdImportIdeas } from './import-ideas.mjs';
import { cmdGenerate } from './generate.mjs';
import { cmdGenerateGuides } from './generate-guides.mjs';
import { cmdApprove } from './approve.mjs';
import { cmdApproveGuides } from './approve-guides.mjs';
import { cmdSchedule } from './schedule.mjs';
import { cmdStatus } from './status.mjs';

export async function cmdPipeline(countArg) {
  const config = loadConfig();
  const workflow = config.workflow ?? {};
  const count = countArg ?? workflow.defaultBatchSize ?? 999;

  console.log('\n═══════════════════════════════════════════');
  console.log('  Pipeline treści — Incr-EdibleCupCakes');
  console.log('═══════════════════════════════════════════\n');

  cmdImportIdeas();

  await cmdGenerate(count);
  await cmdGenerateGuides(count);

  if (workflow.autoApprove !== false) {
    console.log('⚡ Auto-zatwierdzanie...\n');
    cmdApprove('all');
    cmdApproveGuides('all');
  }

  if (workflow.autoSchedule !== false) {
    console.log('📅 Auto-harmonogram (przepisy + guide\'y)...\n');
    cmdSchedule();
  }

  cmdStatus();
  console.log('Gotowe. Publikacja: npm run content:publish-due (lub GitHub Action).\n');
}
