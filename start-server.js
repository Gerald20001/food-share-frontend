#!/usr/bin/env node

import { execSync } from 'child_process';

const port = process.env.PORT || '3000';

try {
  execSync(`npx serve -s dist -l ${port}`, {
    stdio: 'inherit',
    shell: true
  });
} catch (error) {
  console.error('Error starting server:', error.message);
  process.exit(1);
}

