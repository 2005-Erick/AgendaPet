import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const frontendRoot = path.resolve(scriptDir, '..');
const envPath = path.join(frontendRoot, '.env');
const outputDir = path.join(frontendRoot, 'src', 'environments');

const parsedEnv = fs.existsSync(envPath) ? dotenv.parse(fs.readFileSync(envPath)) : {};

const backendUrl = parsedEnv.BACKEND_URL || 'http://localhost:8080';

const fileContent = `export const environment = {
  backendUrl: '${backendUrl.replace(/'/g, "\\'")}',
};
`;

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, 'environment.ts'), fileContent);
fs.writeFileSync(path.join(outputDir, 'environment.development.ts'), fileContent);
