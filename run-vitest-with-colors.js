// This script runs Vitest with forced color output
const { spawn } = require('child_process');
const fs = require('fs');

// Get the output file path from the command line arguments
const outputFile = process.argv[2] || 'test-results/vitest/temp_output.txt';

// Set environment variables to force color
const env = { 
  ...process.env, 
  FORCE_COLOR: 'true',
  VITEST_FORCE_COLOR: 'true',
  CI: ''  // Unset CI to ensure colors are not disabled
};

// Create a write stream for the output file
const output = fs.createWriteStream(outputFile);

// Start the vitest process with color forced on
console.log('Running Vitest with colors...');
const vitest = spawn('npx', ['vitest', 'run', '--reporter=verbose', '--color'], { 
  env,
  stdio: ['ignore', 'pipe', 'pipe']  // We'll handle stdout and stderr ourselves
});

// Pipe the process output to both the console and our file
vitest.stdout.pipe(output);
vitest.stderr.pipe(output);

vitest.stdout.on('data', (data) => {
  process.stdout.write(data);
});

vitest.stderr.on('data', (data) => {
  process.stderr.write(data);
});

// Handle process completion
vitest.on('close', (code) => {
  output.end();
  console.log(`Vitest exited with code ${code}`);
  console.log(`Output saved to ${outputFile}`);
  
  // Exit with the same code as vitest
  process.exit(code);
}); 