const { spawn } = require('child_process');
const path = require('path');

// Ensure standard Windows system directories are in the PATH
const systemPaths = [
  'C:\\Windows\\System32',
  'C:\\Windows',
  'C:\\Windows\\System32\\wbem',
  'C:\\Windows\\System32\\WindowsPowerShell\\v1.0'
];

const currentPath = process.env.PATH || '';
const delimiter = path.delimiter;
const pathList = currentPath.split(delimiter);

for (const sysPath of systemPaths) {
  if (!pathList.some(p => p.toLowerCase() === sysPath.toLowerCase())) {
    pathList.unshift(sysPath);
  }
}
process.env.PATH = pathList.join(delimiter);

console.log('Environment PATH fixed successfully.');

const { execSync } = require('child_process');

// Install frontend dependencies automatically on startup
console.log('Checking and installing frontend dependencies...');
try {
  execSync('npm install --legacy-peer-deps', {
    cwd: path.join(__dirname, 'frontend'),
    stdio: 'inherit',
    env: process.env
  });
  console.log('Frontend dependencies installed successfully.');
} catch (error) {
  console.error('Failed to install frontend dependencies:', error.message);
}

// Spawn backend and frontend dev servers
console.log('Starting backend server (npm run dev:server)...');
const backend = spawn('npm', ['run', 'dev:server'], {
  stdio: 'inherit',
  shell: true,
  env: process.env
});

console.log('Starting frontend client (npm run dev:client)...');
const client = spawn('npm', ['run', 'dev:client'], {
  stdio: 'inherit',
  shell: true,
  env: process.env
});

// Handle termination signals to kill child processes
let isCleaningUp = false;
const killChildren = () => {
  if (isCleaningUp) return;
  isCleaningUp = true;
  console.log('\nStopping servers...');
  if (backend) {
    try { backend.kill(); } catch (e) {}
  }
  if (client) {
    try { client.kill(); } catch (e) {}
  }
  process.exit();
};

process.on('SIGINT', killChildren);
process.on('SIGTERM', killChildren);
process.on('exit', killChildren);

backend.on('close', (code) => {
  console.log(`Backend server exited with code ${code}`);
  killChildren();
});

client.on('close', (code) => {
  console.log(`Frontend client exited with code ${code}`);
  killChildren();
});
