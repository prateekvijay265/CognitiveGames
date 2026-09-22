// @ts-nocheck
import lighthouse from "../../public/images/lighthouse.jpg";
import balloons from "../../public/images/balloons.jpg";
import market from "../../public/images/market.jpg";
import train from "../../public/images/train.jpg";
import harbor from "../../public/images/harbor.jpg";
import vineyard from "../../public/images/vineyard.jpg";
import canyon from "../../public/images/canyon.jpg";
import garden from "../../public/images/garden.jpg";
import snowcabin from "../../public/images/snowcabin.jpg";
import desert from "../../public/images/desert.jpg";

export type Sheet = {
  id: string;
  no: string;
  title: string;
  src: string;
  fallback: string[];
  tag?: string;
};

/** Local poster art first, then curated landscape stock for variety. */
export const SHEETS: Sheet[] = [
  {
    id: "lighthouse",
    no: "01",
    title: "Lighthouse Point",
    src: lighthouse,
    fallback: ["images/lighthouse.jpg"],
    tag: "Coast",
  },
  {
    id: "balloons",
    no: "02",
    title: "Terraces at Dawn",
    src: balloons,
    fallback: ["images/balloons.jpg"],
    tag: "Hills",
  },
  {
    id: "market",
    no: "03",
    title: "Citrus & Flowers",
    src: market,
    fallback: ["images/market.jpg"],
    tag: "Market",
  },
  {
    id: "train",
    no: "04",
    title: "Viaduct Steam",
    src: train,
    fallback: ["images/train.jpg"],
    tag: "Rail",
  },
  {
    id: "harbor",
    no: "05",
    title: "Harbor Lamps",
    src: harbor,
    fallback: ["images/harbor.jpg"],
    tag: "Harbor",
  },
  {
    id: "vineyard",
    no: "06",
    title: "Cypress Rows",
    src: vineyard,
    fallback: ["images/vineyard.jpg"],
    tag: "Wine",
  },
  {
    id: "canyon",
    no: "07",
    title: "Red Rock Cut",
    src: canyon,
    fallback: ["images/canyon.jpg"],
    tag: "Canyon",
  },
  {
    id: "garden",
    no: "08",
    title: "Glasshouse Walk",
    src: garden,
    fallback: ["images/garden.jpg"],
    tag: "Garden",
  },
  {
    id: "snowcabin",
    no: "09",
    title: "Fir & Cabin",
    src: snowcabin,
    fallback: ["images/snowcabin.jpg"],
    tag: "Winter",
  },
  {
    id: "desert",
    no: "10",
    title: "Oasis Pool",
    src: desert,
    fallback: ["images/desert.jpg"],
    tag: "Desert",
  },
  {
    id: "rara",
    no: "11",
    title: "Rara at Dusk",
    src: "https://images.pexels.com/photos/12717158/pexels-photo-12717158.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
    fallback: [],
    tag: "Lake",
  },
  {
    id: "alpine",
    no: "12",
    title: "Alpine Mirror",
    src: "https://images.pexels.com/photos/28438197/pexels-photo-28438197.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
    fallback: [],
    tag: "Peak",
  },
  {
    id: "dawnlake",
    no: "13",
    title: "Dawn Reflection",
    src: "https://images.pexels.com/photos/12365962/pexels-photo-12365962.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
    fallback: [],
    tag: "Lake",
  },
  {
    id: "goldlake",
    no: "14",
    title: "Golden Shore",
    src: "https://images.pexels.com/photos/14588997/pexels-photo-14588997.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
    fallback: [],
    tag: "Shore",
  },
  {
    id: "bonifacio",
    no: "15",
    title: "Cliff Town",
    src: "https://images.pexels.com/photos/38219606/pexels-photo-38219606.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
    fallback: [],
    tag: "Coast",
  },
  {
    id: "cefalu",
    no: "16",
    title: "Sicilian Edge",
    src: "https://images.pexels.com/photos/18377796/pexels-photo-18377796.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
    fallback: [],
    tag: "Town",
  },
  {
    id: "waterfront",
    no: "17",
    title: "Bay & Mountain",
    src: "https://images.pexels.com/photos/18453312/pexels-photo-18453312.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
    fallback: [],
    tag: "Bay",
  },
  {
    id: "winding",
    no: "18",
    title: "Winding Arroyo",
    src: "https://images.pexels.com/photos/6678153/pexels-photo-6678153.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
    fallback: [],
    tag: "Road",
  },
  {
    id: "canyonroad",
    no: "19",
    title: "Canyon Ribbon",
    src: "https://images.pexels.com/photos/9227744/pexels-photo-9227744.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
    fallback: [],
    tag: "Aerial",
  },
  {
    id: "forestlake",
    no: "20",
    title: "Forest Stillwater",
    src: "https://images.pexels.com/photos/17940231/pexels-photo-17940231.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1200",
    fallback: [],
    tag: "Woods",
  },
];

/** Procedural last-resort artwork so the puzzle is always playable. */
export function proceduralSheet(seed: number): string {
  const w = 1200;
  const h = 800;
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  const ctx = cv.getContext("2d");
  if (!ctx) return "";
  const palette = ["#e7dcc6", "#14342b", "#e0451f", "#d99a2b", "#1a1512", "#8c8071"];
  let s = (seed * 9301 + 49297) % 233280;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);

  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "#e7dcc6");
  g.addColorStop(1, "#d8caae");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "#14342b";
  ctx.beginPath();
  ctx.moveTo(0, h * 0.72);
  for (let x = 0; x <= w; x += 60) {
    ctx.lineTo(x, h * 0.72 + Math.sin(x * 0.008 + seed) * 46 + rnd() * 20);
  }
  ctx.lineTo(w, h);
  ctx.lineTo(0, h);
  ctx.closePath();
  ctx.fill();

  for (let i = 0; i < 46; i++) {
    ctx.fillStyle = palette[Math.floor(rnd() * palette.length)];
    ctx.globalAlpha = 0.65 + rnd() * 0.35;
    const r = 26 + rnd() * 96;
    ctx.beginPath();
    ctx.arc(rnd() * w, rnd() * h * 0.8, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.strokeStyle = "#1a1512";
  ctx.lineWidth = 6;
  ctx.strokeRect(10, 10, w - 20, h - 20);
  return cv.toDataURL("image/jpeg", 0.86);
}

function testImage(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img.naturalWidth > 0);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

/** Resolve each sheet to a URL that actually loads (public → bundled → remote → procedural). */
export async function resolveSheets(): Promise<Sheet[]> {
  const out: Sheet[] = [];
  for (let i = 0; i < SHEETS.length; i++) {
    const s = SHEETS[i];
    let src = "";
    const cands = [...s.fallback, s.src].filter(Boolean);
    for (const cand of cands) {
      if (await testImage(cand)) {
        src = cand;
        break;
      }
    }
    if (!src) src = proceduralSheet(i + 3);
    out.push({ ...s, src });
  }
  return out;
}
