// Default pricing data matching the existing site
const DEFAULT_PRICING = {
  website: [
    {
      id: "landing-page",
      name: "Conversion Landing Page",
      myrPrice: 988,
      period: "one-time",
      features: ["Full Custom Design", "Lead Capture Ready", "Mobile Optimized", "Next.js Core Structure"]
    },
    {
      id: "corporate-site",
      name: "Corporate Website",
      myrPrice: 3888,
      period: "one-time",
      features: ["Instant Credibility", "CMS & Admin Console", "Full SEO Setup", "Security-first Cookies", "Multi-lingual Ready"]
    },
    {
      id: "basic-ecommerce",
      name: "Basic E-Commerce",
      myrPrice: 4188,
      period: "one-time",
      features: ["Secure Payments (FPX + eWallet)", "Inventory Management", "Order Notifications", "Tailwind Adaptive Styling"]
    },
    {
      id: "ecommerce-plus",
      name: "E-Commerce Plus (Unlimited Products)",
      myrPrice: 8888,
      period: "one-time",
      features: ["Unlimited Products", "Loyalty & Referral System", "Advanced Analytics Dashboard", "Convex Serverless Integration"]
    }
  ],
  automation: [
    {
      id: "auto-starter",
      name: "Workflow Automation Starter",
      myrPrice: 1488,
      period: "one-time",
      features: ["Save Time", "AI Prompt Logic", "30-Day Support", "CRM Hook Integration"]
    },
    {
      id: "process-auto",
      name: "Business Process Automation",
      myrPrice: 5888,
      period: "one-time",
      features: ["Custom Logic", "Role-Based Routing", "AI-Assisted Alerts", "Convex Reactive Triggers"]
    }
  ],
  seo: [
    {
      id: "seo-standard",
      name: "SEO Standard",
      myrPrice: 688,
      period: "monthly",
      features: ["25 Keywords", "4 Blogs/Month", "GBP Optimisation", "Core Web Vitals Audit"]
    },
    {
      id: "seo-plus",
      name: "SEO Plus",
      myrPrice: 1888,
      period: "monthly",
      features: ["50 Keywords", "8 Blogs/Month", "Competitor Tracking", "Backlink Authority Setup"]
    }
  ],
  ads: [
    {
      id: "ads-starter",
      name: "Starter Ads Management",
      myrPrice: 888,
      period: "monthly",
      features: ["Fast Launch", "A/B Testing", "Monthly Call", "Google & Meta Setup"]
    },
    {
      id: "ads-growth",
      name: "Growth Ads Management",
      myrPrice: 1288,
      period: "monthly",
      features: ["Retargeting Campaigns", "ROAS Dashboard", "Weekly Reports", "Multi-Platform Optimization"]
    }
  ],
  social: [
    {
      id: "social-visibility",
      name: "Social Visibility Plan",
      myrPrice: 588,
      period: "monthly",
      features: ["12 Posts/Month", "Monthly Analytics", "Content Calendar", "Stories & Reels Option"]
    }
  ],
  professional: [
    {
      id: "strategy-consult",
      name: "Digital Strategy Consultation",
      myrPrice: 1188,
      period: "per session",
      features: ["3-Month Roadmap", "Competitor Brief", "Session Recording"]
    },
    {
      id: "seo-audit",
      name: "SEO Deep Dive Audit",
      myrPrice: 688,
      period: "one-time",
      features: ["Actionable Top 10 Fixes", "Core Web Vitals Report", "Google Business Profile Audit"]
    },
    {
      id: "maintenance-support",
      name: "Website Maintenance & Support",
      myrPrice: 688,
      period: "monthly",
      features: ["99.9% Uptime Monitoring", "SSL Management", "Quarterly Health Audit"]
    }
  ]
};

const STORAGE_KEY = "jxing_pricing_data";
const TIMESTAMP_KEY = "jxing_pricing_last_updated";

window.PricingData = {
  getPricing: function() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error("Failed to parse pricing data, resetting to default.", e);
      }
    }
    return DEFAULT_PRICING;
  },

  savePricing: function(pricing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pricing));
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = now.toLocaleDateString('en-US', options);
    localStorage.setItem(TIMESTAMP_KEY, formattedDate);
    return formattedDate;
  },

  getLastUpdated: function() {
    return localStorage.getItem(TIMESTAMP_KEY) || "April 1, 2026";
  },

  resetPricing: function() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TIMESTAMP_KEY);
    return DEFAULT_PRICING;
  }
};
