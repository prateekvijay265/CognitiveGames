from PIL import Image
import os

img_path = 'client/public/logo.jpg'
try:
    img = Image.open(img_path).convert('RGBA')
    
    # 192x192
    img_192 = img.resize((192, 192), Image.Resampling.LANCZOS)
    img_192.save('client/public/pwa-192x192.png', 'PNG')
    
    # 512x512
    img_512 = img.resize((512, 512), Image.Resampling.LANCZOS)
    img_512.save('client/public/pwa-512x512.png', 'PNG')
    
    # Apple touch icon (180x180)
    img_180 = img.resize((180, 180), Image.Resampling.LANCZOS)
    img_180.save('client/public/apple-touch-icon.png', 'PNG')

    # favicon.ico (32x32)
    img_32 = img.resize((32, 32), Image.Resampling.LANCZOS)
    img_32.save('client/public/favicon.ico', format='ICO', sizes=[(32, 32)])

    print("Successfully generated PWA and favicon icons.")
except Exception as e:
    print(f"Error: {e}")
