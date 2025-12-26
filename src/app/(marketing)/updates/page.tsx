'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { CalendarDays, Sparkles, Users, Code, Shield, Zap, Bug, ChevronDown, ChevronRight, Search, X, Filter, History, Map, Tag, Brain, AlertTriangle, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

type UpdateCategory = 'feature' | 'improvement' | 'fix' | 'security' | 'announcement';

interface Update {
  id: string;
  date: string;
  month: string;
  year: string;
  title: string;
  summary: string;
  category: UpdateCategory;
  icon: typeof Code;
  content: string[];
  highlights?: string[];
}

const categoryConfig: Record<UpdateCategory, { label: string; color: string; bg: string }> = {
  feature: { label: 'Feature', color: 'text-[#0a0a0a]', bg: 'bg-[#0a0a0a] text-white' },
  improvement: { label: 'Improvement', color: 'text-[#525252]', bg: 'bg-[#f5f5f5] text-[#525252]' },
  fix: { label: 'Fix', color: 'text-[#dc2626]', bg: 'bg-[#fef2f2] text-[#dc2626]' },
  security: { label: 'Security', color: 'text-[#7c3aed]', bg: 'bg-[#f5f3ff] text-[#7c3aed]' },
  announcement: { label: 'Announcement', color: 'text-[#0369a1]', bg: 'bg-[#f0f9ff] text-[#0369a1]' },
};

const updates: Update[] = [
  {
    id: 'dec-2025-ai-tagging-fix',
    date: 'December 23, 2025',
    month: 'December',
    year: '2025',
    title: 'AI Tagging Accuracy Fix',
    summary: 'Fixed a critical bug where AI tagging suggestions were returning invalid asset IDs, causing tag confirmations to fail.',
    category: 'fix',
    icon: Bug,
    content: [
      'Fixed a bug where AI tagging would return invalid asset identifiers, causing the "confirm tag" action to fail with a database error.',
      'AI now correctly returns the exact asset UUID from your catalog, ensuring 100% compatibility with the tagging workflow.',
      'Added validation layer that filters out any malformed suggestions before they reach the UI - an extra safety net.',
    ],
    highlights: ['Bug fix', 'AI tagging', 'Validation added'],
  },
  {
    id: 'dec-2025-insight-comparison',
    date: 'December 23, 2025',
    month: 'December',
    year: '2025',
    title: 'AI Insight Batch Comparison',
    summary: 'Compare two batches of AI insights to see what changed - new issues, resolved recommendations, and recurring themes.',
    category: 'feature',
    icon: BarChart3,
    content: [
      'New comparison mode in the Intelligence Hub lets you select two insight batches and see exactly what changed between them.',
      'Three comparison views: New Insights (issues that appeared), Resolved Insights (recommendations you addressed), and Recurring Insights (persistent themes the AI keeps flagging).',
      'Perfect for tracking progress over time - prove to stakeholders that you\'re acting on AI recommendations and seeing results.',
      'Summary counts show at-a-glance how many insights are new vs resolved vs recurring.',
    ],
    highlights: ['Batch comparison', 'Progress tracking', 'New/Resolved/Recurring views'],
  },
  {
    id: 'dec-2025-platform-security',
    date: 'December 23, 2025',
    month: 'December',
    year: '2025',
    title: 'Enterprise Security & Compliance',
    summary: 'Your connector credentials are now encrypted at rest, and all actions are logged for compliance auditing.',
    category: 'security',
    icon: Shield,
    content: [
      'Connector credentials (like Shopify access tokens) are now encrypted at rest. Your API keys are protected even if the database were compromised.',
      'Full audit trail for compliance - every significant action is logged with who did it, when, and what changed. Perfect for SOC 2 and enterprise security reviews.',
    ],
    highlights: ['Encrypted credentials', 'Audit trail', 'Compliance-ready'],
  },
  {
    id: 'dec-2025-platform-polish',
    date: 'December 21, 2025',
    month: 'December',
    year: '2025',
    title: 'Platform Polish & Reliability',
    summary: '10 UX improvements including error handling, better notifications, chart persistence, and improved data display consistency.',
    category: 'improvement',
    icon: Zap,
    content: [
      'Added dashboard error state with retry button — no more infinite loading spinners when API calls fail.',
      'Fixed forecast confidence bar visibility at 60-79% range (was white on white, now visible gray).',
      'Improved AI JSON parsing with better error handling and structured fallbacks instead of showing raw text.',
      'Growth metrics now show context-aware comparison periods: "vs previous 7 days" instead of always "vs last month".',
      'Increased notification auto-dismiss from 5 seconds to 15 seconds for better readability.',
      'Added progress indicator during bulk AI tagging with count of products being analyzed.',
      'Improved low confidence forecast messages to show exactly how much more data is needed.',
      'Standardized currency formatting across dashboard (consistent $XX.XX format).',
      'Chart type preference (line/bar/area) now persists when changing date ranges.',
      'Added "Download all" button for unmatched products during CSV import instead of showing only first 5.',
    ],
    highlights: ['Error handling', 'Notification timing', 'Chart persistence', 'CSV import UX'],
  },
  {
    id: 'dec-2025-demand-forecast',
    date: 'December 21, 2025',
    month: 'December',
    year: '2025',
    title: 'AI Demand Forecasting',
    summary: 'Predict next period demand with AI-powered forecasting. See confidence levels, contributing factors, and actionable recommendations.',
    category: 'feature',
    icon: Brain,
    content: [
      'Added AI-powered demand forecasting to the Overview dashboard. Click "Generate Forecast" to analyze your historical sales data and predict demand for the next period.',
      'Each forecast includes: predicted units, confidence score (displayed as a visual progress bar), contributing factors that influenced the prediction, and a specific AI recommendation.',
      'Forecasts use AI to analyze trends, seasonality, and product performance. The more historical data you have, the more accurate predictions become.',
      'Forecasting works at publisher-wide, product-specific, or asset-specific levels — helping you plan inventory and marketing spend with data-backed confidence.',
    ],
    highlights: ['AI-powered predictions', 'Confidence scoring', 'Contributing factors', 'Actionable recommendations'],
  },
  {
    id: 'dec-2025-trend-alerts',
    date: 'December 21, 2025',
    month: 'December',
    year: '2025',
    title: 'Trend Alerts Dashboard',
    summary: 'Automatic alerts for surging characters, declining assets, and revenue opportunities. Never miss a trend again.',
    category: 'feature',
    icon: AlertTriangle,
    content: [
      'New Trend Alerts section on the Overview dashboard automatically detects and surfaces notable changes in your merchandise performance.',
      'Four alert types: Surge (character revenue up 25%+), Drop (revenue down 20%+), Opportunity (strong overall momentum), and Warning (declining AOV or concerning patterns).',
      'Each alert includes the affected asset, percentage change, and a suggested action. Color-coded for instant recognition — green for surges, red for drops, gold for warnings.',
      'Alerts are generated automatically from your real data — no configuration needed. As your sales data updates, alerts refresh to show the latest trends.',
    ],
    highlights: ['4 alert types', 'Auto-generated', 'Actionable suggestions', 'Real-time updates'],
  },
  {
    id: 'dec-2025-asset-tagging-ux',
    date: 'December 15, 2025',
    month: 'December',
    year: '2025',
    title: 'Enhanced Asset Tagging Experience',
    summary: 'Faster, smarter product tagging with auto-loading AI suggestions, progress tracking, and keyboard shortcuts.',
    category: 'improvement',
    icon: Tag,
    content: [
      'AI suggestions now load automatically when you select an unmapped product. No more clicking "AI Suggest" for every item - the system anticipates your workflow.',
      'Added a progress bar showing your tagging completion: "42/100 tagged (42%)". Gives you a sense of accomplishment and helps track remaining work.',
      'New "Next Unmapped" button instantly jumps to the next product needing attention. Press N on your keyboard for even faster navigation.',
      'Full keyboard shortcuts: Arrow keys or J/K to navigate products, A to accept the top AI suggestion, S to skip it, N to jump to next unmapped.',
      'Redesigned the AI suggestions panel to match the PhantomOS design system - monochrome styling with clear confidence indicators.',
    ],
    highlights: ['Auto-load suggestions', 'Progress bar', 'Keyboard shortcuts', 'Next Unmapped navigation'],
  },
  {
    id: 'dec-2025-sales-map',
    date: 'December 15, 2025',
    month: 'December',
    year: '2025',
    title: 'Interactive Sales Map',
    summary: 'New world map visualization showing revenue distribution by region. See where your fans are buying from at a glance.',
    category: 'feature',
    icon: Map,
    content: [
      'Added an interactive world map to the dashboard overview. Toggle between the traditional Recent Orders table and the new geographic map view.',
      'The map displays revenue intensity by region - darker shades indicate higher sales volume. Hover over any region to see exact revenue figures and order counts.',
      'Currently supports North America, Europe, Asia Pacific, and Latin America regions. Perfect for identifying geographic expansion opportunities.',
      'Built with react-simple-maps for a clean, monochromatic aesthetic that matches the PhantomOS design language.',
    ],
    highlights: ['World map view', 'Revenue by region', 'Interactive tooltips', 'Toggle between views'],
  },
  {
    id: 'dec-2025-few-shot-learning',
    date: 'December 15, 2025',
    month: 'December',
    year: '2025',
    title: 'AI Learning from Confirmed Tags',
    summary: 'AI tagging now learns from your confirmed mappings. Every product you tag teaches the system to make better suggestions.',
    category: 'improvement',
    icon: Sparkles,
    content: [
      'Implemented few-shot prompting for AI auto-tagging. When you confirm a product-to-asset mapping, that example is used to improve future suggestions.',
      'The AI fetches up to 15 recent confirmed mappings as examples when suggesting tags for new products. Examples from the same category are prioritized.',
      'This creates a network effect: more publishers tagging products = smarter suggestions for everyone. Your data contributions improve the entire platform.',
      'Unlike traditional ML training, this approach works immediately with any amount of data and doesn\'t require expensive model fine-tuning.',
    ],
    highlights: ['Few-shot prompting', 'Category-aware examples', 'Network effect', 'Immediate learning'],
  },
  {
    id: 'dec-2025-ai-insights-history',
    date: 'December 15, 2025',
    month: 'December',
    year: '2025',
    title: 'AI Insights History & Action Tracking',
    summary: 'Full history of AI recommendations with the ability to track which insights you\'ve actioned. Prove AI value over time.',
    category: 'feature',
    icon: History,
    content: [
      'AI insights now persist across sessions. Return to the Intelligence Hub and see your last generated insights without regenerating.',
      'New "Mark as Actioned" feature lets you track which AI recommendations you\'ve acted on. Green checkmarks show completed items.',
      'Collapsible history view shows all previous insight batches with timestamps. Compare what AI recommended last month vs today.',
      'Perfect for proving AI value to stakeholders: "Here\'s what AI recommended, here\'s what we did, here\'s the result."',
    ],
    highlights: ['Persistent insights', 'Action tracking', 'History view', 'Batch grouping'],
  },
  {
    id: 'dec-2025-analytics-system',
    date: 'December 15, 2025',
    month: 'December',
    year: '2025',
    title: 'Analytics & Insights Infrastructure',
    summary: 'Complete analytics system with Posthog tracking, AI insights persistence, and automated analytics snapshots.',
    category: 'feature',
    icon: Sparkles,
    content: [
      'Integrated Posthog analytics for comprehensive user behavior tracking. Events include dashboard views, AI insight generation, product tagging, connector setup, and more.',
      'AI insights now persist to database instead of being ephemeral. Users can view historical insights and track which recommendations have been actioned.',
      'Added automated analytics snapshot generation for daily, weekly, and monthly metrics aggregation.',
    ],
    highlights: ['Posthog integration', 'Insight persistence', '200+ daily snapshots', 'Event tracking'],
  },
  {
    id: 'dec-2025-pricing-tiers',
    date: 'December 15, 2025',
    month: 'December',
    year: '2025',
    title: 'Pricing Page & Strategy',
    summary: 'New pricing page with future pricing tiers, moat articulation, and pilot program details.',
    category: 'improvement',
    icon: Zap,
    content: [
      'Redesigned pricing page to clearly show pilot program benefits alongside future pricing tiers (Starter $299/mo, Growth $799/mo, Enterprise custom).',
      'Added "Why Free?" section explaining the IP Asset Graph moat - helping users understand how their data contributions make the platform more valuable.',
      'New FAQ section addressing Revenue Under Management (RUM) pricing model and grandfathered discounts for pilot members.',
    ],
    highlights: ['3 pricing tiers', 'RUM-based pricing', 'Moat explanation', '40-60% pilot discount'],
  },
  {
    id: 'dec-2025-roadmap-refocus',
    date: 'December 15, 2025',
    month: 'December',
    year: '2025',
    title: 'Roadmap Restructured for Focus',
    summary: 'Separated current focus (Intelligence Platform) from long-term vision. IP Asset Graph is the moat.',
    category: 'announcement',
    icon: Code,
    content: [
      'Restructured the roadmap to clearly separate Phase 1 (Intelligence Platform - current focus) from future phases. This prevents scope creep and keeps the team focused.',
      'Added decision framework for feature prioritization: Does it grow the IP Asset Graph? Does it improve AI tagging? Then prioritize.',
      'Created dedicated COMPETITIVE_MOAT.md document explaining our defensibility through the IP Asset Graph.',
    ],
    highlights: ['IP Asset Graph focus', 'Decision framework', 'PMF metrics', 'Moat documentation'],
  },
  {
    id: 'dec-2025-rbac',
    date: 'December 13, 2025',
    month: 'December',
    year: '2025',
    title: 'Role-Based Access Control Enhanced',
    summary: 'Fixed RBAC bypass in demo mode - role checks now enforced for all logged-in users.',
    category: 'security',
    icon: Shield,
    content: [
      'Fixed a critical issue where demo mode was bypassing RBAC checks for logged-in users. Now all authenticated users have role permissions enforced regardless of demo mode status.',
      'Member and Analyst roles now correctly receive 403 Forbidden when attempting write operations like tagging products or modifying mappings.',
    ],
    highlights: ['11 API endpoints patched', 'Session-first authentication', 'Demo mode isolation'],
  },
  {
    id: 'dec-2025-how-it-works',
    date: 'December 13, 2025',
    month: 'December',
    year: '2025',
    title: 'How It Works Page',
    summary: 'New comprehensive guide explaining the PhantomOS workflow from setup to insights.',
    category: 'feature',
    icon: Sparkles,
    content: [
      'Added a dedicated How It Works page that walks users through the four-step process: Connect Data, AI Tagging, Revenue Analytics, and Actionable Insights.',
      'Includes visual demos, timeline showing "0 to insights in 20 minutes", and links to detailed feature pages.',
    ],
    highlights: ['4-step guide', 'Interactive visuals', 'Timeline showcase'],
  },
  {
    id: 'dec-2025-updates-page',
    date: 'December 13, 2025',
    month: 'December',
    year: '2025',
    title: 'Updates Page Redesign',
    summary: 'Interactive updates page with filtering, search, and expandable cards.',
    category: 'improvement',
    icon: Zap,
    content: [
      'Completely redesigned the updates page to be more scalable and interactive. Now supports filtering by year, category, and search.',
      'Updates are now expandable cards - click to see full details. Much better UX when there are 20+ updates to browse.',
    ],
    highlights: ['Year filtering', 'Category badges', 'Expandable cards', 'Search'],
  },
  {
    id: 'dec-2025-tagging-routes',
    date: 'December 12, 2025',
    month: 'December',
    year: '2025',
    title: 'Write Protection for Tagging Routes',
    summary: 'Added missing RBAC protection to auto-tag and bulk mapping endpoints.',
    category: 'fix',
    icon: Bug,
    content: [
      'Discovered that the /api/products/auto-tag and /api/products/mapping/bulk routes were missing RBAC checks. Fixed by adding canWrite() validation.',
      'All write operations now require owner or admin role.',
    ],
    highlights: ['Auto-tag protected', 'Bulk mapping protected'],
  },
  {
    id: 'nov-2025-rbac',
    date: 'November 28, 2025',
    month: 'November',
    year: '2025',
    title: 'Role-Based Access Control',
    summary: 'Introduced RBAC system with owner, admin, member, and analyst roles.',
    category: 'feature',
    icon: Shield,
    content: [
      'Implemented comprehensive role-based access control. Owner and Admin roles have full write access, while Member and Analyst roles are read-only.',
      'All write endpoints now validate user roles before allowing modifications. This enables publishers to safely share dashboards with team members and external analysts.',
    ],
    highlights: ['4 role types', 'Write protection', 'Team collaboration'],
  },
  {
    id: 'nov-2025-team-invites',
    date: 'November 25, 2025',
    month: 'November',
    year: '2025',
    title: 'Team Invitation System',
    summary: 'Invite team members with role assignment and secure token-based onboarding.',
    category: 'feature',
    icon: Users,
    content: [
      'Publishers can now invite team members directly from the Settings page. Each invitation includes a role assignment that determines access level.',
      'Invitations use secure tokens with expiration. New users are automatically linked to the correct publisher account on signup.',
    ],
    highlights: ['Email invitations', 'Role assignment', 'Secure tokens'],
  },
  {
    id: 'nov-2025-platform-dev',
    date: 'November 15, 2025',
    month: 'November',
    year: '2025',
    title: 'Platform Development Begins',
    summary: 'Started building PhantomOS after extensive market research.',
    category: 'announcement',
    icon: Code,
    content: [
      'Started building PhantomOS after extensive research into gaming merchandise operations.',
      'Initial focus: solving the fundamental problem of understanding what characters and IP elements drive sales.',
    ],
  },
  {
    id: 'oct-2025-discovery',
    date: 'October 2025',
    month: 'October',
    year: '2025',
    title: 'Market Research',
    summary: 'Researched the gaming merchandise space to identify gaps.',
    category: 'announcement',
    icon: Users,
    content: [
      'Conducted extensive research into how game publishers manage merchandise revenue. Identified a consistent pattern: teams manually track sales in spreadsheets, guess at what fans want, and struggle to justify inventory decisions.',
      'The problem is clear. Time to build.',
    ],
    highlights: ['Problem identified', 'Gap validated', 'Market research'],
  },
];

// Get unique years from updates
const years = [...new Set(updates.map(u => u.year))].sort((a, b) => b.localeCompare(a));
const categories = Object.keys(categoryConfig) as UpdateCategory[];

function UpdateCard({ update, isExpanded, onToggle }: { update: Update; isExpanded: boolean; onToggle: () => void }) {
  const Icon = update.icon;
  const config = categoryConfig[update.category];

  return (
    <div
      className={cn(
        'bg-white border transition-all duration-300',
        isExpanded ? 'border-[#0a0a0a] shadow-lg' : 'border-[#e5e5e5] hover:border-[#a3a3a3]'
      )}
    >
      {/* Header - Always visible */}
      <button
        onClick={onToggle}
        className="w-full p-6 text-left flex items-start gap-4"
      >
        <div className={cn(
          'w-10 h-10 flex items-center justify-center flex-shrink-0 transition-colors',
          isExpanded ? 'bg-[#0a0a0a]' : 'bg-[#f5f5f5]'
        )}>
          <Icon className={cn('w-5 h-5', isExpanded ? 'text-white' : 'text-[#737373]')} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className={cn('text-xs font-medium px-2 py-0.5', config.bg)}>
              {config.label}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-[#a3a3a3]">
              <CalendarDays className="w-3 h-3" />
              {update.date}
            </div>
          </div>

          <h3 className="text-lg font-bold text-[#0a0a0a] mb-1">{update.title}</h3>
          <p className="text-sm text-[#737373] line-clamp-2">{update.summary}</p>

          {update.highlights && !isExpanded && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {update.highlights.slice(0, 3).map((highlight, i) => (
                <span key={i} className="text-xs px-2 py-1 bg-[#fafafa] text-[#525252]">
                  {highlight}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className={cn(
          'w-8 h-8 flex items-center justify-center flex-shrink-0 transition-transform duration-300',
          isExpanded ? 'rotate-180' : ''
        )}>
          <ChevronDown className="w-5 h-5 text-[#a3a3a3]" />
        </div>
      </button>

      {/* Expanded Content */}
      <div className={cn(
        'overflow-hidden transition-all duration-300',
        isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
      )}>
        <div className="px-6 pb-6 pt-0 border-t border-[#f5f5f5]">
          <div className="pl-14 pt-4">
            <div className="space-y-3">
              {update.content.map((paragraph, i) => (
                <p key={i} className="text-[#525252] leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {update.highlights && (
              <div className="mt-6 pt-4 border-t border-[#f5f5f5]">
                <div className="text-xs text-[#a3a3a3] uppercase tracking-wider mb-3">Highlights</div>
                <div className="flex items-center gap-2 flex-wrap">
                  {update.highlights.map((highlight, i) => (
                    <span key={i} className="text-xs px-3 py-1.5 bg-[#0a0a0a] text-white">
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UpdatesPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<UpdateCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showMobileYearDropdown, setShowMobileYearDropdown] = useState(false);
  const [showMobileCategoryDropdown, setShowMobileCategoryDropdown] = useState(false);
  const yearDropdownRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const mobileYearDropdownRef = useRef<HTMLDivElement>(null);
  const mobileCategoryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target as Node)) {
        setShowYearDropdown(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
      if (mobileYearDropdownRef.current && !mobileYearDropdownRef.current.contains(event.target as Node)) {
        setShowMobileYearDropdown(false);
      }
      if (mobileCategoryDropdownRef.current && !mobileCategoryDropdownRef.current.contains(event.target as Node)) {
        setShowMobileCategoryDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredUpdates = useMemo(() => {
    return updates.filter(update => {
      const matchesYear = selectedYear === 'all' || update.year === selectedYear;
      const matchesCategory = selectedCategory === 'all' || update.category === selectedCategory;
      const matchesSearch = searchQuery === '' ||
        update.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        update.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        update.content.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesYear && matchesCategory && matchesSearch;
    });
  }, [selectedYear, selectedCategory, searchQuery]);

  const clearFilters = () => {
    setSelectedYear('all');
    setSelectedCategory('all');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedYear !== 'all' || selectedCategory !== 'all' || searchQuery !== '';

  return (
    <div className="min-h-screen bg-white">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

      <div className="relative">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="text-xs tracking-[0.2em] text-[#a3a3a3] uppercase mb-6">UPDATES</div>
          <h1 className="text-5xl md:text-6xl font-bold text-[#0a0a0a] mb-6 tracking-tight">
            What's <span className="italic font-light">New</span>
          </h1>
          <p className="text-xl text-[#737373] max-w-3xl mx-auto leading-relaxed mb-8">
            Follow our journey building revenue intelligence for game publishers.
            Features, fixes, and improvements - all in one place.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#22c55e] rounded-full" />
              <span className="text-[#737373]">{updates.length} updates</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#0a0a0a] rounded-full" />
              <span className="text-[#737373]">{updates.filter(u => u.category === 'feature').length} features</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#7c3aed] rounded-full" />
              <span className="text-[#737373]">{updates.filter(u => u.category === 'security').length} security</span>
            </div>
          </div>
        </section>

        {/* Filters Bar */}
        <section className="max-w-4xl mx-auto px-6 mb-8">
          <div className="bg-[#fafafa] border border-[#e5e5e5] p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a3a3a3]" />
                <input
                  type="text"
                  placeholder="Search updates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e5e5e5] text-sm focus:outline-none focus:border-[#0a0a0a] transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-[#a3a3a3] hover:text-[#0a0a0a]" />
                  </button>
                )}
              </div>

              {/* Desktop Filters */}
              <div className="hidden md:flex items-center gap-2">
                {/* Year Filter */}
                <div className="relative" ref={yearDropdownRef}>
                  <button
                    onClick={() => setShowYearDropdown(!showYearDropdown)}
                    className="px-4 py-2.5 flex items-center gap-2 bg-white border border-[#e5e5e5] text-sm hover:border-[#a3a3a3] transition-colors"
                  >
                    <span>{selectedYear === 'all' ? 'All Years' : selectedYear}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-[#737373] transition-transform ${showYearDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  {showYearDropdown && (
                    <div className="absolute left-0 top-full mt-1 w-32 bg-white border border-[#e5e5e5] shadow-lg z-50">
                      <button
                        onClick={() => { setSelectedYear('all'); setShowYearDropdown(false); }}
                        className={`w-full px-4 py-2 text-left text-sm transition-colors ${selectedYear === 'all' ? 'bg-[#0a0a0a] text-white' : 'text-[#0a0a0a] hover:bg-[#f5f5f5]'}`}
                      >
                        All Years
                      </button>
                      {years.map(year => (
                        <button
                          key={year}
                          onClick={() => { setSelectedYear(year); setShowYearDropdown(false); }}
                          className={`w-full px-4 py-2 text-left text-sm transition-colors ${selectedYear === year ? 'bg-[#0a0a0a] text-white' : 'text-[#0a0a0a] hover:bg-[#f5f5f5]'}`}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Category Filter */}
                <div className="relative" ref={categoryDropdownRef}>
                  <button
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    className="px-4 py-2.5 flex items-center gap-2 bg-white border border-[#e5e5e5] text-sm hover:border-[#a3a3a3] transition-colors"
                  >
                    <span>{selectedCategory === 'all' ? 'All Types' : categoryConfig[selectedCategory].label}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-[#737373] transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  {showCategoryDropdown && (
                    <div className="absolute left-0 top-full mt-1 w-36 bg-white border border-[#e5e5e5] shadow-lg z-50">
                      <button
                        onClick={() => { setSelectedCategory('all'); setShowCategoryDropdown(false); }}
                        className={`w-full px-4 py-2 text-left text-sm transition-colors ${selectedCategory === 'all' ? 'bg-[#0a0a0a] text-white' : 'text-[#0a0a0a] hover:bg-[#f5f5f5]'}`}
                      >
                        All Types
                      </button>
                      {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => { setSelectedCategory(cat); setShowCategoryDropdown(false); }}
                          className={`w-full px-4 py-2 text-left text-sm transition-colors ${selectedCategory === cat ? 'bg-[#0a0a0a] text-white' : 'text-[#0a0a0a] hover:bg-[#f5f5f5]'}`}
                        >
                          {categoryConfig[cat].label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2.5 text-sm text-[#737373] hover:text-[#0a0a0a] transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#e5e5e5] text-sm"
              >
                <Filter className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <span className="w-5 h-5 bg-[#0a0a0a] text-white text-xs flex items-center justify-center">
                    {(selectedYear !== 'all' ? 1 : 0) + (selectedCategory !== 'all' ? 1 : 0)}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Filters Dropdown */}
            {showFilters && (
              <div className="md:hidden mt-4 pt-4 border-t border-[#e5e5e5] space-y-3">
                <div className="relative" ref={mobileYearDropdownRef}>
                  <button
                    onClick={() => setShowMobileYearDropdown(!showMobileYearDropdown)}
                    className="w-full px-4 py-2.5 flex items-center justify-between bg-white border border-[#e5e5e5] text-sm"
                  >
                    <span>{selectedYear === 'all' ? 'All Years' : selectedYear}</span>
                    <ChevronDown className={`w-4 h-4 text-[#737373] transition-transform ${showMobileYearDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  {showMobileYearDropdown && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#e5e5e5] shadow-lg z-50">
                      <button
                        onClick={() => { setSelectedYear('all'); setShowMobileYearDropdown(false); }}
                        className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${selectedYear === 'all' ? 'bg-[#0a0a0a] text-white' : 'text-[#0a0a0a] hover:bg-[#f5f5f5]'}`}
                      >
                        All Years
                      </button>
                      {years.map(year => (
                        <button
                          key={year}
                          onClick={() => { setSelectedYear(year); setShowMobileYearDropdown(false); }}
                          className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${selectedYear === year ? 'bg-[#0a0a0a] text-white' : 'text-[#0a0a0a] hover:bg-[#f5f5f5]'}`}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative" ref={mobileCategoryDropdownRef}>
                  <button
                    onClick={() => setShowMobileCategoryDropdown(!showMobileCategoryDropdown)}
                    className="w-full px-4 py-2.5 flex items-center justify-between bg-white border border-[#e5e5e5] text-sm"
                  >
                    <span>{selectedCategory === 'all' ? 'All Types' : categoryConfig[selectedCategory].label}</span>
                    <ChevronDown className={`w-4 h-4 text-[#737373] transition-transform ${showMobileCategoryDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  {showMobileCategoryDropdown && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#e5e5e5] shadow-lg z-50">
                      <button
                        onClick={() => { setSelectedCategory('all'); setShowMobileCategoryDropdown(false); }}
                        className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${selectedCategory === 'all' ? 'bg-[#0a0a0a] text-white' : 'text-[#0a0a0a] hover:bg-[#f5f5f5]'}`}
                      >
                        All Types
                      </button>
                      {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => { setSelectedCategory(cat); setShowMobileCategoryDropdown(false); }}
                          className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${selectedCategory === cat ? 'bg-[#0a0a0a] text-white' : 'text-[#0a0a0a] hover:bg-[#f5f5f5]'}`}
                        >
                          {categoryConfig[cat].label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2.5 text-sm text-[#737373] border border-[#e5e5e5]"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Results count */}
          {hasActiveFilters && (
            <div className="mt-4 text-sm text-[#737373]">
              Showing {filteredUpdates.length} of {updates.length} updates
            </div>
          )}
        </section>

        {/* Updates List */}
        <section className="max-w-4xl mx-auto px-6 pb-24">
          {filteredUpdates.length > 0 ? (
            <div className="space-y-4">
              {filteredUpdates.map((update) => (
                <UpdateCard
                  key={update.id}
                  update={update}
                  isExpanded={expandedId === update.id}
                  onToggle={() => setExpandedId(expandedId === update.id ? null : update.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-[#f5f5f5] flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-[#a3a3a3]" />
              </div>
              <h3 className="text-lg font-medium text-[#0a0a0a] mb-2">No updates found</h3>
              <p className="text-[#737373] mb-4">Try adjusting your search or filters</p>
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-[#0a0a0a] text-white text-sm font-medium"
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>

        {/* Social CTA */}
        <section className="bg-[#0a0a0a] py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Stay in the <span className="italic font-light">Loop</span>
            </h2>
            <p className="text-lg text-[#a3a3a3] mb-10 max-w-2xl mx-auto leading-relaxed">
              Get notified about new features, updates, and pilot program news.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 bg-white text-[#0a0a0a] font-medium hover:bg-[#f5f5f5] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                X / Twitter
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 bg-white text-[#0a0a0a] font-medium hover:bg-[#f5f5f5] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
