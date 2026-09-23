import asyncio
from playwright.async_api import async_playwright
import os

async def generate_pdf():
    html_path = f"file:///{os.path.abspath('scratch/architecture.html').replace(os.sep, '/')}"
    pdf_path = os.path.abspath('scratch/NeuroMind_Architecture_Guide.pdf')
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto(html_path)
        # Add some margin to the PDF
        await page.pdf(path=pdf_path, format="A4", margin={"top": "20px", "bottom": "20px", "left": "20px", "right": "20px"}, print_background=True)
        await browser.close()
    
    print(f"PDF generated successfully at {pdf_path}")

if __name__ == "__main__":
    asyncio.run(generate_pdf())
