const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const htmlPath = 'file:///' + path.resolve('scratch/architecture.html').replace(/\\/g, '/');
  const pdfPath = path.resolve('scratch/NeuroMind_Architecture_Guide.pdf');
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(htmlPath, { waitUntil: 'networkidle' });
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
    printBackground: true
  });
  
  await browser.close();
  console.log('PDF generated successfully at ' + pdfPath);
})();
