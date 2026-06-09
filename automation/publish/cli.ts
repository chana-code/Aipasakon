import { readFileSync } from 'fs';
import { publishCardPost } from './meta';

const PAGE_ID = '992580240609596'; // AI ภาษาคน

async function main() {
  const args = process.argv.slice(2);
  const live = args.includes('--live');
  const imagePath = args.find(a => a.endsWith('.png'));
  const captionPath = args.find(a => a.endsWith('.txt'));

  if (!imagePath || !captionPath) {
    console.error('usage: tsx automation/publish/cli.ts <card.png> <caption.txt> [--live]');
    process.exit(1);
  }

  const token = process.env.FB_PAGE_TOKEN;
  if (live && !token) {
    console.error('FB_PAGE_TOKEN env var is required for --live');
    process.exit(1);
  }

  const caption = readFileSync(captionPath, 'utf8').trim();
  const res = await publishCardPost({
    pageId: PAGE_ID,
    token: token ?? '',
    imagePath,
    caption,
    dryRun: !live,
  });

  if (res.dryRun) {
    console.log('DRY RUN — would POST to', res.endpoint);
    console.log('caption:\n' + res.fields.message);
  } else {
    console.log('POSTED. post id:', res.postId);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
