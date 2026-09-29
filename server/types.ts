export interface WebsiteAnalysis {
  url: string;
  title: string;
  description: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    surfaceColor: string;
    textColor: string;
    accentColor: string;
    fontStyle: string;
    borderRadius: string;
    mood: string;
  };
  navigation: {
    brandName: string;
    brandLogoUrl?: string;
    links: { label: string; href?: string }[];
    ctaButton?: { label: string; variant?: string };
  };
  sections: Array<{
    id: string;
    type: 'hero' | 'features' | 'stats' | 'testimonials' | 'pricing' | 'cta' | 'gallery' | 'team' | 'faq' | 'footer' | 'content';
    name: string;
    headline?: string;
    subheadline?: string;
    badge?: string;
    items?: Array<{
      title?: string;
      description?: string;
      iconName?: string;
      imageUrl?: string;
      tag?: string;
      metric?: string;
    }>;
    actions?: Array<{ label: string; primary: boolean }>;
    layoutHint?: string;
  }>;
  typography: {
    headings: string[];
    bodyFont: string;
  };
  assets: Array<{
    url: string;
    alt?: string;
    type: 'logo' | 'hero' | 'feature' | 'avatar' | 'icon' | 'background';
  }>;
  responsiveStructure: {
    mobileNav: string;
    gridStacking: string;
    spacingScale: string;
  };
  rawDomSummary?: {
    totalElements: number;
    textWordCount: number;
    detectedImagesCount: number;
    detectedColors: string[];
  };
}

export interface ProjectFile {
  path: string;
  content: string;
  language: string;
}

export interface AgentLog {
  id: string;
  timestamp: string;
  stage: 'INIT' | 'FETCH' | 'ANALYZE' | 'CODEGEN' | 'VALIDATE' | 'REPAIR' | 'PREVIEW' | 'MODIFY' | 'ERROR';
  message: string;
  details?: string;
  status: 'info' | 'success' | 'warning' | 'error' | 'in_progress';
}

export interface ProjectMetadata {
  id: string;
  url: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  status: 'analyzing' | 'generating' | 'validating' | 'ready' | 'error';
  repairAttempts: number;
  lastValidationErrors?: string[];
  files: string[];
}
