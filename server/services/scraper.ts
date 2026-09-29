import * as cheerio from "cheerio";

export interface ScrapedSiteData {
  url: string;
  finalUrl: string;
  title: string;
  description: string;
  meta: {
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    favicon?: string;
    keywords?: string;
  };
  navigation: {
    brand: string;
    brandLogo?: string;
    items: Array<{ text: string; href: string }>;
    buttons: string[];
  };
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
  };
  paragraphs: string[];
  sections: Array<{
    tag: string;
    id?: string;
    classes: string;
    heading?: string;
    textSample: string;
    buttonTexts: string[];
    imageCount: number;
  }>;
  images: Array<{
    src: string;
    alt: string;
  }>;
  colors: string[];
  fontFamilies: string[];
  stats: {
    elementCount: number;
    wordCount: number;
    linkCount: number;
  };
  rawHtmlSnippet: string;
}

export async function scrapeWebsite(targetUrl: string): Promise<ScrapedSiteData> {
  // 1. Sanitize & normalize URL
  let parsedUrl: URL;
  try {
    let urlToParse = targetUrl.trim();
    if (!/^https?:\/\//i.test(urlToParse)) {
      urlToParse = `https://${urlToParse}`;
    }
    parsedUrl = new URL(urlToParse);
  } catch (err: any) {
    throw new Error(`Invalid website URL format: "${targetUrl}". Please provide a valid web address.`);
  }

  // Prevent local/internal IP access for security
  const hostname = parsedUrl.hostname.toLowerCase();
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.") ||
    hostname.endsWith(".internal") ||
    hostname.endsWith(".local")
  ) {
    throw new Error("Access to local or private network addresses is restricted. Please specify a publicly accessible URL.");
  }

  // 2. Fetch page with browser headers & timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 14000);

  let response: Response;
  try {
    response = await fetch(parsedUrl.toString(), {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 WebClone/1.0",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
      },
      redirect: "follow",
    });
  } catch (fetchErr: any) {
    clearTimeout(timeoutId);
    if (fetchErr.name === "AbortError") {
      throw new Error(`Connection timed out while trying to reach ${parsedUrl.hostname}. The website took too long to respond.`);
    }
    throw new Error(`Unable to reach website (${parsedUrl.hostname}): ${fetchErr.message || "Network request failed"}`);
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    if (response.status === 403 || response.status === 401) {
      throw new Error(`Unable to access ${parsedUrl.hostname} (HTTP ${response.status}). This website requires authentication or blocks automated requests.`);
    }
    if (response.status === 404) {
      throw new Error(`Website not found (HTTP 404). Please verify that ${parsedUrl.toString()} exists.`);
    }
    throw new Error(`Received HTTP ${response.status} (${response.statusText}) when accessing ${parsedUrl.hostname}.`);
  }

  const html = await response.text();
  if (!html || html.trim().length === 0) {
    throw new Error(`The target website at ${parsedUrl.hostname} returned an empty HTML document.`);
  }

  const finalUrl = response.url || parsedUrl.toString();
  const baseUrl = new URL(finalUrl);

  // Helper to resolve relative URLs
  const toAbsolute = (link: string | undefined): string => {
    if (!link) return "";
    try {
      return new URL(link, baseUrl).toString();
    } catch {
      return link;
    }
  };

  // 3. Parse with Cheerio
  const $ = cheerio.load(html);

  // Meta & Title
  const title =
    $('meta[property="og:title"]').attr("content") ||
    $("title").text().trim() ||
    $('meta[name="twitter:title"]').attr("content") ||
    parsedUrl.hostname;

  const description =
    $('meta[name="description"]').attr("content") ||
    $('meta[property="og:description"]').attr("content") ||
    $('meta[name="twitter:description"]').attr("content") ||
    "";

  const ogImage = toAbsolute($('meta[property="og:image"]').attr("content"));
  let favicon =
    toAbsolute($('link[rel="icon"]').attr("href")) ||
    toAbsolute($('link[rel="shortcut icon"]').attr("href")) ||
    toAbsolute("/favicon.ico");

  // Navigation extraction
  let brand = "";
  let brandLogo: string | undefined;

  const navElem = $("nav, header").first();
  if (navElem.length) {
    const logoImg = navElem.find("img").first();
    if (logoImg.length) {
      brandLogo = toAbsolute(logoImg.attr("src"));
      brand = logoImg.attr("alt") || "";
    }
    if (!brand) {
      const brandLink = navElem.find('a[href="/"], a.logo, a.brand, .logo, .brand').first();
      brand = brandLink.text().trim();
    }
  }
  if (!brand) {
    brand = title.split(/[-|•:]/)[0].trim() || parsedUrl.hostname.replace("www.", "");
  }

  const navItems: Array<{ text: string; href: string }> = [];
  const navButtons: string[] = [];

  $("nav a, header a").each((_, el) => {
    const text = $(el).text().trim();
    const href = $(el).attr("href") || "#";
    if (text && text.length < 35 && !navItems.some((n) => n.text.toLowerCase() === text.toLowerCase())) {
      if ($(el).is(".btn, [class*='button'], [class*='btn'], [class*='cta']")) {
        navButtons.push(text);
      } else {
        navItems.push({ text, href });
      }
    }
  });

  // Headings
  const h1: string[] = [];
  $("h1").each((_, el) => {
    const t = $(el).text().trim();
    if (t && !h1.includes(t)) h1.push(t);
  });

  const h2: string[] = [];
  $("h2").each((_, el) => {
    const t = $(el).text().trim();
    if (t && t.length < 120 && !h2.includes(t)) h2.push(t);
  });

  const h3: string[] = [];
  $("h3").each((_, el) => {
    const t = $(el).text().trim();
    if (t && t.length < 100 && !h3.includes(t)) h3.push(t);
  });

  // Paragraphs
  const paragraphs: string[] = [];
  $("p").each((_, el) => {
    const t = $(el).text().trim();
    if (t.length > 25 && t.length < 350 && !paragraphs.includes(t)) {
      paragraphs.push(t);
    }
  });

  // Images
  const images: Array<{ src: string; alt: string }> = [];
  $("img").each((_, el) => {
    const src = $(el).attr("src") || $(el).attr("data-src");
    const alt = $(el).attr("alt") || "";
    if (src && !src.startsWith("data:image/svg+xml")) {
      const absSrc = toAbsolute(src);
      if (absSrc && !images.some((img) => img.src === absSrc)) {
        images.push({ src: absSrc, alt: alt.trim() });
      }
    }
  });

  // Semantic sections
  const sections: Array<{
    tag: string;
    id?: string;
    classes: string;
    heading?: string;
    textSample: string;
    buttonTexts: string[];
    imageCount: number;
  }> = [];

  $("header, section, footer, main > div, article").each((_, el) => {
    const $el = $(el);
    const tag = el.tagName.toLowerCase();
    const id = $el.attr("id");
    const classes = $el.attr("class") || "";
    const heading = $el.find("h1, h2, h3, h4").first().text().trim();
    const textSample = $el.find("p, span").slice(0, 3).text().trim().slice(0, 200);
    const buttonTexts: string[] = [];
    $el.find("button, a[class*='btn'], a[class*='button']").each((__, btn) => {
      const bt = $(btn).text().trim();
      if (bt && bt.length < 30) buttonTexts.push(bt);
    });
    const imageCount = $el.find("img").length;

    if (heading || textSample || buttonTexts.length > 0 || tag === "footer" || tag === "header") {
      sections.push({
        tag,
        id,
        classes: classes.slice(0, 100),
        heading: heading || undefined,
        textSample,
        buttonTexts: buttonTexts.slice(0, 4),
        imageCount,
      });
    }
  });

  // Extract color tokens from inline styles & style elements
  const colorMatches = new Set<string>();
  const hexRegex = /#(?:[0-9a-fA-F]{3,4}){1,2}\b/g;
  const rgbRegex = /rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*[\d.]+\s*)?\)/gi;

  const styleText = $("style").text() + " " + $("[style]").map((_, e) => $(e).attr("style")).get().join(" ");
  let match: RegExpExecArray | null;
  while ((match = hexRegex.exec(styleText)) !== null) {
    const col = match[0].toLowerCase();
    if (col !== "#fff" && col !== "#ffffff" && col !== "#000" && col !== "#000000") {
      colorMatches.add(col);
    }
  }
  while ((match = rgbRegex.exec(styleText)) !== null) {
    colorMatches.add(match[0]);
  }

  // Extract fonts
  const fontFamilies: string[] = [];
  $('link[href*="fonts.googleapis.com"]').each((_, el) => {
    const href = $(el).attr("href") || "";
    const familyMatch = href.match(/family=([^:&]+)/);
    if (familyMatch && familyMatch[1]) {
      fontFamilies.push(decodeURIComponent(familyMatch[1].replace(/\+/g, " ")));
    }
  });

  // Clean body text word count
  const allText = $("body").text().replace(/\s+/g, " ").trim();
  const wordCount = allText ? allText.split(" ").length : 0;
  const elementCount = $("*").length;
  const linkCount = $("a").length;

  return {
    url: parsedUrl.toString(),
    finalUrl,
    title,
    description,
    meta: {
      ogTitle: $('meta[property="og:title"]').attr("content"),
      ogDescription: $('meta[property="og:description"]').attr("content"),
      ogImage,
      favicon,
      keywords: $('meta[name="keywords"]').attr("content"),
    },
    navigation: {
      brand: brand || parsedUrl.hostname,
      brandLogo,
      items: navItems.slice(0, 8),
      buttons: navButtons.slice(0, 3),
    },
    headings: {
      h1: h1.slice(0, 5),
      h2: h2.slice(0, 10),
      h3: h3.slice(0, 10),
    },
    paragraphs: paragraphs.slice(0, 15),
    sections: sections.slice(0, 12),
    images: images.slice(0, 12),
    colors: Array.from(colorMatches).slice(0, 10),
    fontFamilies: Array.from(new Set(fontFamilies)),
    stats: {
      elementCount,
      wordCount,
      linkCount,
    },
    rawHtmlSnippet: html.slice(0, 4000), // useful preview snippet
  };
}
