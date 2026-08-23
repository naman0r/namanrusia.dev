/**
 * Deliberately tiny user-agent parsing. A real UA library is a large lookup
 * table, and we only need coarse answers to three questions.
 */

const BOT = /bot|crawler|spider|crawl|slurp|curl|wget|headless|phantom|lighthouse|pingdom|preview|scrape|monitor|python-requests|node-fetch|axios|go-http|facebookexternalhit|whatsapp|telegram|discordbot|slackbot|embedly|vercel-screenshot/i;

export function isBot(userAgent: string): boolean {
  return !userAgent || BOT.test(userAgent);
}

export type Device = "mobile" | "tablet" | "desktop";

export function parseUserAgent(ua: string): {
  device: Device;
  browser: string;
  os: string;
} {
  return { device: device(ua), browser: browser(ua), os: os(ua) };
}

function device(ua: string): Device {
  if (/iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(ua)) return "tablet";
  if (/Mobi|iPhone|iPod|Android|BlackBerry|IEMobile|Opera Mini/i.test(ua)) return "mobile";
  return "desktop";
}

function browser(ua: string): string {
  // Order matters: most of these also claim to be Chrome or Safari later in
  // the string, so the most specific token has to win.
  if (/Edg\//.test(ua)) return "Edge";
  if (/OPR\/|Opera/.test(ua)) return "Opera";
  if (/Arc\//.test(ua)) return "Arc";
  if (/Brave\//.test(ua)) return "Brave";
  if (/SamsungBrowser/.test(ua)) return "Samsung Internet";
  if (/Firefox\/|FxiOS/.test(ua)) return "Firefox";
  if (/CriOS/.test(ua)) return "Chrome";
  if (/Chrome\//.test(ua)) return "Chrome";
  if (/Safari\//.test(ua)) return "Safari";
  return "Other";
}

function os(ua: string): string {
  if (/Windows NT/.test(ua)) return "Windows";
  if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
  if (/Mac OS X|Macintosh/.test(ua)) return "macOS";
  if (/Android/.test(ua)) return "Android";
  if (/CrOS/.test(ua)) return "ChromeOS";
  if (/Linux/.test(ua)) return "Linux";
  return "Other";
}
