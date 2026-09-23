import os
from PIL import Image

image_dir = 'client/public'

for root, _, files in os.walk(image_dir):
    for f in files:
        if f.lower().endswith(('.jpg', '.jpeg', '.png')):
            path = os.path.join(root, f)
            size = os.path.getsize(path)
            if size > 200 * 1024:  # Compress files larger than 200KB
                print(f"Compressing {path} (Size: {size/1024:.0f}KB)")
                try:
                    img = Image.open(path)
                    # Resize if very large
                    img.thumbnail((800, 800))
                    # Convert to RGB if PNG with alpha, before saving as JPEG/WebP or just save as low quality JPEG
                    if img.mode in ("RGBA", "P"):
                        img = img.convert("RGB")
                    img.save(path, "JPEG", quality=40, optimize=True)
                except Exception as e:
                    print(f"Failed to compress {path}: {e}")
