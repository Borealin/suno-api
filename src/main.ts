import { loadCredential, saveCredential } from './auth/credential.js';
import { test } from './studio/index.js';

const main = async (): Promise<void> => {
  await loadCredential();
  await test()
  await saveCredential();
};

main();
