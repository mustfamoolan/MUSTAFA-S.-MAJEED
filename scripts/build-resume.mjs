import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { readFile } from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  const templatePath = resolve(__dirname, '../assets/resume/template.html');
  const outputPath = resolve(__dirname, '../assets/pdf/olivia_resume.pdf');

  const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: 'new' });
  try {
    const page = await browser.newPage();
    const html = await readFile(templatePath, 'utf8');
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.emulateMediaType('print');
    await page.pdf({ path: outputPath, format: 'A4', printBackground: true, margin: { top: '18mm', right: '12mm', bottom: '18mm', left: '12mm' } });
    console.log('PDF written to:', outputPath);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
