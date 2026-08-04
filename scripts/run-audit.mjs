import { spawnSync } from 'node:child_process';

// `npm run` leaks the parent process's resolved `allow-scripts` config
// (from the user's global .npmrc) into child processes as
// `npm_config_allow_scripts`. That collides with this project's own
// `allowScripts` field in package.json and makes a nested `npm audit`
// fail with EALLOWSCRIPTS even though nothing is actually being
// installed. Strip it before spawning the real audit.
const env = { ...process.env };
delete env.npm_config_allow_scripts;

const result = spawnSync('npm', ['audit', ...process.argv.slice(2)], {
  stdio: 'inherit',
  env,
  shell: true,
});

process.exit(result.status ?? 1);
