'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, Sparkles, TrendingUp, AlertCircle, TrendingDown, Target, DollarSign, RefreshCw, ChevronRight, Globe, Zap, Loader2, Upload, ShoppingBag, Plug, Package, Lightbulb, ArrowRight, Tag } from 'lucide-react';
import Link from 'next/link';
import { Header, StatsCard } from '@/components/dashboard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge } from '@/components/ui';

interface AIInsight {
  type: 'opportunity' | 'warning' | 'trend' | 'recommendation';
  title: string;
  description: string;
  recommendations?: string[];
  confidence?: number;
}

interface APIInsight {
  title: string;
  description: string;
  confidence: number;
  recommendations: string[];
}

// Analysis step component for loading state
function AnalysisStep({
  icon,
  label,
  status
}: {
  icon: React.ReactNode;
  label: string;
  status: 'pending' | 'active' | 'complete'
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`
        w-8 h-8 flex items-center justify-center border transition-all
        ${status === 'complete' ? 'bg-[#0a0a0a] border-[#0a0a0a] text-white' : ''}
        ${status === 'active' ? 'bg-white border-[#0a0a0a] text-[#0a0a0a] animate-pulse' : ''}
        ${status === 'pending' ? 'bg-[#f5f5f5] border-[#e5e5e5] text-[#a3a3a3]' : ''}
      `}>
        {status === 'complete' ? (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : status === 'active' ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          icon
        )}
      </div>
      <span className={`text-sm ${status === 'pending' ? 'text-[#a3a3a3]' : 'text-[#0a0a0a]'}`}>
        {label}
      </span>
    </div>
  );
}

// Interactive insight card component
function InsightCard({
  insight,
  icon,
  badge
}: {
  insight: AIInsight;
  icon: React.ReactNode;
  badge: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  // Determine action button based on insight type/content
  const getActionButton = () => {
    const text = `${insight.title} ${insight.description}`.toLowerCase();

    if (text.includes('tag') || text.includes('untag') || text.includes('mapping')) {
      return (
        <Button size="sm" variant="outline" onClick={() => router.push('/products')}>
          <Tag className="w-3 h-3 mr-1" />
          Tag Products
        </Button>
      );
    }
    if (text.includes('asset') || text.includes('character') || text.includes('ip')) {
      return (
        <Button size="sm" variant="outline" onClick={() => router.push('/products')}>
          <Zap className="w-3 h-3 mr-1" />
          Manage Assets
        </Button>
      );
    }
    if (text.includes('connect') || text.includes('import') || text.includes('data')) {
      return (
        <Button size="sm" variant="outline" onClick={() => router.push('/connectors')}>
          <Plug className="w-3 h-3 mr-1" />
          Add Data
        </Button>
      );
    }
    return null;
  };

  const actionButton = getActionButton();
  const hasRecommendations = insight.recommendations && insight.recommendations.length > 0;

  return (
    <div className="border border-[#e5e5e5] transition-all hover:border-[#a3a3a3]">
      {/* Main content - clickable to expand */}
      <button
        onClick={() => hasRecommendations && setExpanded(!expanded)}
        className="w-full p-4 text-left"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-0.5">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <p className="font-medium text-[#0a0a0a]">{insight.title}</p>
              {badge}
              {insight.confidence && (
                <span className="text-[10px] px-1.5 py-0.5 bg-[#f5f5f5] text-[#737373]">
                  {Math.round(insight.confidence * 100)}% confidence
                </span>
              )}
            </div>
            {insight.description && (
              <p className="text-sm text-[#737373] mt-1">
                {insight.description}
              </p>
            )}
          </div>
          {hasRecommendations && (
            <ChevronRight
              className={`w-4 h-4 text-[#a3a3a3] transition-transform flex-shrink-0 ${
                expanded ? 'rotate-90' : ''
              }`}
            />
          )}
        </div>
      </button>

      {/* Expanded recommendations */}
      {expanded && hasRecommendations && (
        <div className="px-4 pb-4 border-t border-[#f5f5f5]">
          <div className="pt-4">
            <p className="text-xs font-medium text-[#737373] uppercase tracking-wider mb-3">
              Recommended Actions
            </p>
            <div className="space-y-2">
              {insight.recommendations?.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-[#f5f5f5] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-[#737373]">{idx + 1}</span>
                  </div>
                  <p className="text-sm text-[#525252]">{rec}</p>
                </div>
              ))}
            </div>
            {actionButton && (
              <div className="mt-4 pt-3 border-t border-[#f5f5f5]">
                {actionButton}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action button for non-expandable insights */}
      {!hasRecommendations && actionButton && (
        <div className="px-4 pb-4">
          {actionButton}
        </div>
      )}
    </div>
  );
}

export default function IntelligencePage() {
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [insightsError, setInsightsError] = useState('');
  const [lastAnalyzed, setLastAnalyzed] = useState<Date | null>(null);

  useEffect(() => {
    checkData();
  }, []);

  const checkData = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (response.ok) {
        const data = await response.json();
        setHasData(data.hasData);
        if (data.hasData) {
          // Auto-load insights if we have data
          await fetchInsights();
        }
      }
    } catch (error) {
      console.error('Failed to check data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInsights = async () => {
    setRefreshing(true);
    setInsightsError('');

    try {
      const response = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'general' }),
      });

      if (response.ok) {
        const data = await response.json();
        // The API returns an array of InsightResult objects
        const parsedInsights = parseAPIInsights(data.insights);
        setInsights(parsedInsights);
        setLastAnalyzed(new Date());
      } else {
        const errorData = await response.json().catch(() => ({}));
        setInsightsError(errorData.error || 'Failed to generate insights. Please try again.');
      }
    } catch (error) {
      console.error('Failed to fetch insights:', error);
      setInsightsError('Failed to connect to AI service. Please try again later.');
    } finally {
      setRefreshing(false);
    }
  };

  // Parse the API response (array of InsightResult objects)
  const parseAPIInsights = (rawInsights: APIInsight[] | string | null | unknown): AIInsight[] => {
    if (!rawInsights) return [];

    // Handle string input (try to parse as JSON, or use as plain text)
    let insightsArray: APIInsight[];

    if (typeof rawInsights === 'string') {
      // Strip markdown code blocks if present (```json ... ``` or ``` ... ```)
      let cleanedString = rawInsights.trim();
      if (cleanedString.startsWith('```')) {
        // Remove opening code fence (```json or ```)
        cleanedString = cleanedString.replace(/^```(?:json)?\s*\n?/, '');
        // Remove closing code fence
        cleanedString = cleanedString.replace(/\n?```\s*$/, '');
      }

      try {
        const parsed = JSON.parse(cleanedString);
        insightsArray = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        // If it's just text, create a single insight
        return [{
          type: 'recommendation',
          title: 'AI Analysis',
          description: rawInsights.substring(0, 500), // Limit length
          confidence: 0.7,
        }];
      }
    } else if (Array.isArray(rawInsights)) {
      insightsArray = rawInsights;
    } else if (typeof rawInsights === 'object') {
      insightsArray = [rawInsights as APIInsight];
    } else {
      return [];
    }

    return insightsArray.map((insight) => {
      // Determine type based on keywords in title/description
      let type: AIInsight['type'] = 'recommendation';
      const insightData = insight as APIInsight;
      const text = `${insightData.title || ''} ${insightData.description || ''}`.toLowerCase();

      if (text.includes('opportunity') || text.includes('growth') || text.includes('increase') || text.includes('potential')) {
        type = 'opportunity';
      } else if (text.includes('warning') || text.includes('decline') || text.includes('concern') || text.includes('risk') || text.includes('drop')) {
        type = 'warning';
      } else if (text.includes('trend') || text.includes('pattern') || text.includes('consistent')) {
        type = 'trend';
      }

      return {
        type,
        title: insightData.title || 'Insight',
        description: insightData.description || '',
        recommendations: insightData.recommendations || [],
        confidence: insightData.confidence || 0.7,
      };
    }).slice(0, 5);
  };

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'opportunity':
        return <Sparkles className="w-5 h-5 text-[#22c55e]" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-[#f59e0b]" />;
      case 'trend':
        return <TrendingUp className="w-5 h-5 text-[#3b82f6]" />;
      case 'recommendation':
        return <Lightbulb className="w-5 h-5 text-[#8b5cf6]" />;
    }
  };

  const getInsightBadge = (type: AIInsight['type']) => {
    switch (type) {
      case 'opportunity':
        return <Badge variant="success">Opportunity</Badge>;
      case 'warning':
        return <Badge variant="warning">Alert</Badge>;
      case 'trend':
        return <Badge variant="outline">Trend</Badge>;
      case 'recommendation':
        return <Badge>Recommendation</Badge>;
    }
  };

  // Loading state with skeleton UI
  if (loading) {
    return (
      <div>
        <Header title="Fan Intelligence Hub" description="AI-powered demand intelligence" />
        <div className="p-6 space-y-6">
          {/* Skeleton Stats Grid */}
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="animate-pulse">
                    <div className="h-4 w-24 bg-[#e5e5e5] mb-3"></div>
                    <div className="h-8 w-16 bg-[#f5f5f5]"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Skeleton AI Insights Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Brain className="w-5 h-5 text-[#a3a3a3] animate-pulse" />
                <div>
                  <div className="h-5 w-32 bg-[#e5e5e5] animate-pulse mb-2"></div>
                  <div className="h-3 w-48 bg-[#f5f5f5] animate-pulse"></div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-4 border border-[#e5e5e5]">
                    <div className="flex items-start gap-4">
                      <div className="w-5 h-5 bg-[#e5e5e5] animate-pulse flex-shrink-0"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-48 bg-[#e5e5e5] animate-pulse"></div>
                        <div className="h-3 w-full bg-[#f5f5f5] animate-pulse"></div>
                        <div className="h-3 w-3/4 bg-[#f5f5f5] animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-center gap-3 text-[#737373]">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Connecting to AI engine...</span>
              </div>
            </CardContent>
          </Card>

          {/* Skeleton Quick Actions */}
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 animate-pulse">
                    <div className="w-10 h-10 bg-[#f5f5f5]"></div>
                    <div className="flex-1">
                      <div className="h-4 w-24 bg-[#e5e5e5] mb-2"></div>
                      <div className="h-3 w-32 bg-[#f5f5f5]"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Empty state - no data connected
  if (!hasData) {
    return (
      <div>
        <Header
          title="Fan Intelligence Hub"
          description="AI-powered demand intelligence"
        />
        <div className="p-6 space-y-6">
          {/* Welcome Card */}
          <Card>
            <CardContent className="py-12">
              <div className="text-center max-w-xl mx-auto">
                <div className="w-20 h-20 bg-[#0a0a0a] flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-[#0a0a0a] mb-3">
                  AI Intelligence Awaits
                </h2>
                <p className="text-[#737373] mb-8">
                  Connect your sales data to unlock AI-powered insights about fan demand, revenue opportunities, and hidden market signals. Our AI analyzes your merchandise data to reveal actionable intelligence.
                </p>
                <div className="flex gap-4 justify-center">
                  <Link href="/connectors">
                    <Button size="lg">
                      <ShoppingBag className="w-5 h-5 mr-2" />
                      Connect Shopify
                    </Button>
                  </Link>
                  <Link href="/connectors">
                    <Button variant="outline" size="lg">
                      <Upload className="w-5 h-5 mr-2" />
                      Import CSV
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What You'll Get */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-[#737373]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#0a0a0a] mb-1">Demand Signals</h3>
                    <p className="text-sm text-[#737373]">
                      Identify which characters and IPs are trending before they peak.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-[#737373]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#0a0a0a] mb-1">Revenue Opportunities</h3>
                    <p className="text-sm text-[#737373]">
                      Discover untapped markets and product gaps.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-[#737373]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#0a0a0a] mb-1">Regional Insights</h3>
                    <p className="text-sm text-[#737373]">
                      Understand which markets love which characters.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard with data - Show real AI insights
  return (
    <div>
      <Header
        title="Fan Intelligence Hub"
        description="AI-powered demand intelligence"
        action={{ label: 'Refresh Analysis', onClick: fetchInsights }}
      />

      <div className="p-6 space-y-6">
        {/* Stats - Summary */}
        <div className="grid grid-cols-4 gap-4">
          <StatsCard
            title="Active Insights"
            value={insights.length.toString()}
            icon={<Sparkles className="w-5 h-5" />}
          />
          <StatsCard
            title="Opportunities"
            value={insights.filter(i => i.type === 'opportunity').length.toString()}
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <StatsCard
            title="Alerts"
            value={insights.filter(i => i.type === 'warning').length.toString()}
            icon={<AlertCircle className="w-5 h-5" />}
          />
          <StatsCard
            title="AI Confidence"
            value="High"
            icon={<Brain className="w-5 h-5" />}
          />
        </div>

        {/* AI Insights */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Insights
              </CardTitle>
              <CardDescription>
                {lastAnalyzed ? (
                  <>Last analyzed: {lastAnalyzed.toLocaleTimeString()}</>
                ) : (
                  <>Powered by Claude AI</>
                )}
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchInsights}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Analyzing...' : 'Refresh'}
            </Button>
          </CardHeader>
          <CardContent>
            {refreshing && insights.length === 0 ? (
              <div className="py-8">
                <div className="max-w-md mx-auto">
                  {/* AI Brain Animation */}
                  <div className="relative w-16 h-16 mx-auto mb-6">
                    <div className="absolute inset-0 bg-[#0a0a0a] animate-pulse"></div>
                    <Brain className="absolute inset-0 w-16 h-16 p-4 text-white" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#22c55e] animate-ping"></div>
                  </div>

                  {/* Progress Steps */}
                  <div className="space-y-3 mb-6">
                    <AnalysisStep
                      icon={<TrendingUp className="w-4 h-4" />}
                      label="Scanning sales patterns"
                      status="complete"
                    />
                    <AnalysisStep
                      icon={<Package className="w-4 h-4" />}
                      label="Analyzing product performance"
                      status="active"
                    />
                    <AnalysisStep
                      icon={<Sparkles className="w-4 h-4" />}
                      label="Generating insights"
                      status="pending"
                    />
                  </div>

                  <p className="text-center text-sm text-[#a3a3a3]">
                    AI is analyzing your data to find opportunities...
                  </p>
                </div>
              </div>
            ) : insightsError ? (
              <div className="py-8 text-center">
                <AlertCircle className="w-8 h-8 text-[#f59e0b] mx-auto mb-4" />
                <p className="text-[#737373]">{insightsError}</p>
                <Button variant="outline" size="sm" className="mt-4" onClick={fetchInsights}>
                  Try Again
                </Button>
              </div>
            ) : insights.length === 0 ? (
              <div className="py-8 text-center">
                <Brain className="w-8 h-8 text-[#e5e5e5] mx-auto mb-4" />
                <p className="text-[#737373]">No insights generated yet</p>
                <p className="text-sm text-[#a3a3a3] mt-1">Click Refresh to analyze your data</p>
                <Button size="sm" className="mt-4" onClick={fetchInsights}>
                  Generate Insights
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {insights.map((insight, idx) => (
                  <InsightCard
                    key={idx}
                    insight={insight}
                    icon={getInsightIcon(insight.type)}
                    badge={getInsightBadge(insight.type)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4">
          <Link href="/products">
            <Card hover>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center">
                    <Package className="w-5 h-5 text-[#737373]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#0a0a0a]">Tag Products</p>
                    <p className="text-sm text-[#737373]">Improve AI accuracy</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#a3a3a3]" />
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/connectors">
            <Card hover>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center">
                    <Plug className="w-5 h-5 text-[#737373]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#0a0a0a]">Add More Data</p>
                    <p className="text-sm text-[#737373]">Connect more sources</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#a3a3a3]" />
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/overview">
            <Card hover>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-[#737373]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[#0a0a0a]">View Analytics</p>
                    <p className="text-sm text-[#737373]">See full dashboard</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#a3a3a3]" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Methodology Note */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Brain className="w-5 h-5 text-[#737373] mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#0a0a0a]">How PhantomOS AI Works</p>
                <p className="text-sm text-[#737373]">
                  Our AI analyzes your sales data, product categories, and IP asset mappings to identify patterns,
                  opportunities, and risks. The more data you connect and products you tag, the more accurate our insights become.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
