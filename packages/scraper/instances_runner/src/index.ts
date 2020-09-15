import spawn from '@utils/spawn';

function run() {
  spawn('yarn', [
    'workspace',
    '@scraper/siconv',
    'start',
    'run',
    '12.198.693/0001-58',
    '--cacheKey',
    '123456789',
    // '--verbose',
  ]);
}

run();
run();
run();
