import { ai, GEMINI_MODEL } from "./gemini.ts";
import { ScrapedSiteData } from "./scraper.ts";
import { WebsiteAnalysis } from "../types.ts";

export async function analyzeWebsiteWithAI(scraped: ScrapedSiteData): Promise<WebsiteAnalysis> {
  const prompt = `You are a Principal Frontend Architect and Design System Specialist analyzing a scraped website to plan its complete React reconstruction.

Analyze the following website data extracted from "${scraped.url}":

TITLE: ${scraped.title}
DESCRIPTION: ${scraped.description}
BRAND: ${scraped.navigation.brand}
LOGO: ${scraped.navigation.brandLogo || "none"}
NAV ITEMS: ${JSON.stringify(scraped.navigation.items)}
NAV BUTTONS: ${JSON.stringify(scraped.navigation.buttons)}
H1 HEADINGS: ${JSON.stringify(scraped.headings.h1)}
H2 HEADINGS: ${JSON.stringify(scraped.headings.h2)}
H3 HEADINGS: ${JSON.stringify(scraped.headings.h3)}
SAMPLE PARAGRAPHS: ${JSON.stringify(scraped.paragraphs.slice(0, 8))}
DETECTED SECTIONS: ${JSON.stringify(scraped.sections.slice(0, 8))}
DETECTED IMAGES: ${JSON.stringify(scraped.images.slice(0, 6))}
DETECTED COLORS: ${JSON.stringify(scraped.colors)}
DETECTED FONTS: ${JSON.stringify(scraped.fontFamilies)}

Synthesize this into a structured website architecture JSON object with:
1. "theme":
   - "primaryColor": hex color (e.g. #2563EB or from detected colors)
   - "secondaryColor": hex color complementary to primary
   - "backgroundColor": background hex (e.g. #0F172A, #FAFAF9, or #FFFFFF)
   - "surfaceColor": card/surface hex
   - "textColor": main text hex (e.g. #0F172A or #F8FAFC)
   - "accentColor": accent hex for highlights/badges
   - "fontStyle": typography style, e.g. "modern sans", "editorial serif", "developer mono"
   - "borderRadius": e.g. "rounded-xl", "rounded-2xl", "rounded-full"
   - "mood": design mood description, e.g. "Modern Enterprise SaaS", "Warm Artisanal Bakery", "Bold Creative Studio"

2. "navigation":
   - "brandName": string
   - "brandLogoUrl": string (if available or empty)
   - "links": array of { "label": string, "href": string }
   - "ctaButton": { "label": string, "variant": string }

3. "sections": array of sections in actual logical order:
   - "id": kebab-case identifier (e.g. "hero", "features", "testimonials", "pricing", "cta", "footer")
   - "type": "hero" | "features" | "stats" | "testimonials" | "pricing" | "cta" | "gallery" | "team" | "faq" | "footer" | "content"
   - "name": display title of section
   - "headline": compelling headline for the section (derived from actual site headings or content)
   - "subheadline": descriptive supporting text
   - "badge": optional badge/tag text (e.g. "NEW", "FEATURES", "TRUSTED BY 10,000+")
   - "items": array of cards/items with "title", "description", "iconName" (Lucide icon name like "CheckCircle", "Zap", "Shield", "Star", "ArrowRight", etc.), "imageUrl", "tag", "metric"
   - "actions": array of { "label": string, "primary": boolean }
   - "layoutHint": e.g. "split-hero-image-right", "3-col-card-grid", "testimonial-carousel-cards", "4-col-stats-strip"

4. "typography":
   - "headings": list of fonts/styles
   - "bodyFont": body font description

5. "assets": array of detected or suggested assets with { "url": string, "alt": string, "type": "logo" | "hero" | "feature" | "avatar" | "icon" | "background" }

6. "responsiveStructure":
   - "mobileNav": "collapsible-drawer" or "sheet"
   - "gridStacking": "stack-to-single-column-below-768px"
   - "spacingScale": "compact" | "normal" | "spacious"

Respond ONLY with valid JSON. Do not include markdown codeblocks or extra prose.`;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const text = response.text?.trim() || "";
    // Clean potential markdown wrap if any
    const cleaned = text.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    const parsed = JSON.parse(cleaned);

    return {
      url: scraped.url,
      title: parsed.title || scraped.title || "Website Clone",
      description: parsed.description || scraped.description || "",
      theme: {
        primaryColor: parsed.theme?.primaryColor || "#3B82F6",
        secondaryColor: parsed.theme?.secondaryColor || "#1D4ED8",
        backgroundColor: parsed.theme?.backgroundColor || "#FFFFFF",
        surfaceColor: parsed.theme?.surfaceColor || "#F8FAFC",
        textColor: parsed.theme?.textColor || "#0F172A",
        accentColor: parsed.theme?.accentColor || "#F59E0B",
        fontStyle: parsed.theme?.fontStyle || "modern sans",
        borderRadius: parsed.theme?.borderRadius || "rounded-xl",
        mood: parsed.theme?.mood || "Professional Modern Web Application",
      },
      navigation: {
        brandName: parsed.navigation?.brandName || scraped.navigation.brand || "Brand",
        brandLogoUrl: parsed.navigation?.brandLogoUrl || scraped.navigation.brandLogo,
        links: parsed.navigation?.links || scraped.navigation.items.map((i) => ({ label: i.text, href: i.href })),
        ctaButton: parsed.navigation?.ctaButton || {
          label: scraped.navigation.buttons[0] || "Get Started",
          variant: "primary",
        },
      },
      sections: parsed.sections || createDefaultSections(scraped),
      typography: {
        headings: parsed.typography?.headings || ["Inter", "system-ui"],
        bodyFont: parsed.typography?.bodyFont || "Inter, sans-serif",
      },
      assets: parsed.assets || scraped.images.map((img) => ({
        url: img.src,
        alt: img.alt,
        type: "feature" as const,
      })),
      responsiveStructure: parsed.responsiveStructure || {
        mobileNav: "collapsible-drawer",
        gridStacking: "stack-to-single-column-below-768px",
        spacingScale: "normal",
      },
      rawDomSummary: {
        totalElements: scraped.stats.elementCount,
        textWordCount: scraped.stats.wordCount,
        detectedImagesCount: scraped.images.length,
        detectedColors: scraped.colors,
      },
    };
  } catch (error: any) {
    console.warn("Gemini analysis fallback triggered:", error.message);
    // Intelligent deterministic fallback based directly on scraped DOM
    return createDeterministicAnalysis(scraped);
  }
}

function createDefaultSections(scraped: ScrapedSiteData) {
  const h1 = scraped.headings.h1[0] || scraped.title;
  const desc = scraped.paragraphs[0] || scraped.description || "Discover the future of modern digital experiences.";
  return [
    {
      id: "hero",
      type: "hero" as const,
      name: "Hero Section",
      headline: h1,
      subheadline: desc,
      badge: "Reconstructed with AI",
      actions: [
        { label: scraped.navigation.buttons[0] || "Get Started", primary: true },
        { label: "Learn More", primary: false },
      ],
      layoutHint: "split-hero",
    },
    {
      id: "features",
      type: "features" as const,
      name: "Core Features",
      headline: scraped.headings.h2[0] || "Key Capabilities",
      subheadline: scraped.paragraphs[1] || "Designed for performance, scale, and delightful experience.",
      items: [
        {
          title: scraped.headings.h3[0] || "Intelligent Architecture",
          description: scraped.paragraphs[2] || "Optimized for lightning-fast responsiveness and fluid interactions.",
          iconName: "Zap",
        },
        {
          title: scraped.headings.h3[1] || "Secure & Scalable",
          description: scraped.paragraphs[3] || "Built with enterprise standards from the ground up.",
          iconName: "Shield",
        },
        {
          title: scraped.headings.h3[2] || "Delightful UX",
          description: scraped.paragraphs[4] || "Crafted with attention to detail and modern aesthetics.",
          iconName: "Sparkles",
        },
      ],
      layoutHint: "3-col-card-grid",
    },
    {
      id: "footer",
      type: "footer" as const,
      name: "Footer",
      headline: scraped.navigation.brand,
      subheadline: "All rights reserved.",
      items: [],
      layoutHint: "standard-footer",
    },
  ];
}

function createDeterministicAnalysis(scraped: ScrapedSiteData): WebsiteAnalysis {
  const primaryColor = scraped.colors[0] || "#2563EB";
  const sections = createDefaultSections(scraped);

  return {
    url: scraped.url,
    title: scraped.title,
    description: scraped.description,
    theme: {
      primaryColor,
      secondaryColor: "#1E40AF",
      backgroundColor: "#FFFFFF",
      surfaceColor: "#F8FAFC",
      textColor: "#0F172A",
      accentColor: "#F59E0B",
      fontStyle: "modern sans",
      borderRadius: "rounded-xl",
      mood: "Modern Clean Web Application",
    },
    navigation: {
      brandName: scraped.navigation.brand || "Brand",
      brandLogoUrl: scraped.navigation.brandLogo,
      links: scraped.navigation.items.length
        ? scraped.navigation.items.map((i) => ({ label: i.text, href: i.href }))
        : [
            { label: "Home", href: "#hero" },
            { label: "Features", href: "#features" },
            { label: "About", href: "#about" },
            { label: "Contact", href: "#footer" },
          ],
      ctaButton: {
        label: scraped.navigation.buttons[0] || "Get Started",
        variant: "primary",
      },
    },
    sections,
    typography: {
      headings: ["Inter", "system-ui"],
      bodyFont: "Inter, sans-serif",
    },
    assets: scraped.images.map((img) => ({
      url: img.src,
      alt: img.alt,
      type: "feature" as const,
    })),
    responsiveStructure: {
      mobileNav: "collapsible-drawer",
      gridStacking: "stack-to-single-column-below-768px",
      spacingScale: "normal",
    },
    rawDomSummary: {
      totalElements: scraped.stats.elementCount,
      textWordCount: scraped.stats.wordCount,
      detectedImagesCount: scraped.images.length,
      detectedColors: scraped.colors,
    },
  };
}
