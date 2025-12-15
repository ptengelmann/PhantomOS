'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Brain, Sparkles, TrendingUp, AlertCircle, Target, RefreshCw, ChevronRight,
  ChevronDown, Zap, Loader2, Upload, ShoppingBag, Plug, Package, Lightbulb,
  ArrowRight, Tag, Check, Clock, History, CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { Header, StatsCard } from '@/components/dashboard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge } from '@/components/ui';

interface StoredInsight {
  id: string;
  type: string;
  title: string;
  description: string;
  confidence: string | null;
  data: {
    recommendations?: string[];
    generatedAt?: string;
  };
  isRead: boolean;
  isActioned: boolean;
  actionedAt: string | null;
  batchId: string | null;
  createdAt: string;
}

interface InsightBatch {
  batchId: string;
  createdAt: string;
  insights: StoredInsight[];
  insightCount: number;
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
          <Check className="w-4 h-4" />
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
  onAction,
}: {
  insight: StoredInsight;
  onAction: (id: string, actioned: boolean) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return <Sparkles className="w-5 h-5 text-[#22c55e]" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-[#f59e0b]" />;
      case 'trend':
        return <TrendingUp className="w-5 h-5 text-[#3b82f6]" />;
      default:
        return <Lightbulb className="w-5 h-5 text-[#8b5cf6]" />;
    }
  };

  const getInsightBadge = (type: string) => {
    switch (type) {
      case 'opportunity':
        return <Badge variant="success">Opportunity</Badge>;
      case 'warning':
        return <Badge variant="warning">Alert</Badge>;
      case 'trend':
        return <Badge variant="outline">Trend</Badge>;
      default:
        return <Badge>Recommendation</Badge>;
    }
  };

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
  const hasRecommendations = insight.data?.recommendations && insight.data.recommendations.length > 0;
  const confidence = insight.confidence ? parseFloat(insight.confidence) : 0.7;

  return (
    <div className={`border transition-all ${insight.isActioned ? 'border-[#22c55e] bg-[#f0fdf4]' : 'border-[#e5e5e5] hover:border-[#a3a3a3]'}`}>
      {/* Main content - clickable to expand */}
      <button
        onClick={() => hasRecommendations && setExpanded(!expanded)}
        className="w-full p-4 text-left"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-0.5">
            {insight.isActioned ? (
              <CheckCircle2 className="w-5 h-5 text-[#22c55e]" />
            ) : (
              getInsightIcon(insight.type)
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <p className={`font-medium ${insight.isActioned ? 'text-[#737373] line-through' : 'text-[#0a0a0a]'}`}>
                {insight.title}
              </p>
              {getInsightBadge(insight.type)}
              <span className="text-[10px] px-1.5 py-0.5 bg-[#f5f5f5] text-[#737373]">
                {Math.round(confidence * 100)}% confidence
              </span>
              {insight.isActioned && (
                <span className="text-[10px] px-1.5 py-0.5 bg-[#22c55e] text-white">
                  Actioned
                </span>
              )}
            </div>
            {insight.description && (
              <p className={`text-sm mt-1 ${insight.isActioned ? 'text-[#a3a3a3]' : 'text-[#737373]'}`}>
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
              {insight.data.recommendations?.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-[#f5f5f5] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs text-[#737373]">{idx + 1}</span>
                  </div>
                  <p className="text-sm text-[#525252]">{rec}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-[#f5f5f5] flex items-center gap-3">
              {actionButton}
              {!insight.isActioned ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction(insight.id, true);
                  }}
                >
                  <Check className="w-3 h-3 mr-1" />
                  Mark as Actioned
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction(insight.id, false);
                  }}
                >
                  Undo
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action button for non-expandable insights */}
      {!hasRecommendations && !insight.isActioned && (
        <div className="px-4 pb-4 flex items-center gap-3">
          {actionButton}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAction(insight.id, true)}
          >
            <Check className="w-3 h-3 mr-1" />
            Mark as Actioned
          </Button>
        </div>
      )}
    </div>
  );
}

// History batch component
function HistoryBatch({ batch, onAction }: { batch: InsightBatch; onAction: (id: string, actioned: boolean) => void }) {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(batch.createdAt);
  const actionedCount = batch.insights.filter(i => i.isActioned).length;

  return (
    <div className="border border-[#e5e5e5]">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-[#fafafa] transition-colors"
      >
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-[#a3a3a3]" />
          <div className="text-left">
            <p className="font-medium text-[#0a0a0a]">
              {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
            <p className="text-xs text-[#737373]">
              {batch.insightCount} insights • {actionedCount} actioned
            </p>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-[#a3a3a3] transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <div className="border-t border-[#e5e5e5] p-4 space-y-3 bg-[#fafafa]">
          {batch.insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} onAction={onAction} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function IntelligencePage() {
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentInsights, setCurrentInsights] = useState<StoredInsight[]>([]);
  const [historyBatches, setHistoryBatches] = useState<InsightBatch[]>([]);
  const [insightsError, setInsightsError] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    checkDataAndLoadInsights();
  }, []);

  const checkDataAndLoadInsights = async () => {
    try {
      // Check if we have data
      const statsResponse = await fetch('/api/dashboard/stats');
      if (statsResponse.ok) {
        const data = await statsResponse.json();
        setHasData(data.hasData);

        if (data.hasData) {
          // Load existing insights
          await loadStoredInsights();
        }
      }
    } catch (error) {
      console.error('Failed to check data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStoredInsights = async () => {
    try {
      const response = await fetch('/api/ai/insights?history=true&limit=100');
      if (response.ok) {
        const data = await response.json();
        setCurrentInsights(data.current || []);
        setHistoryBatches(data.history || []);
      }
    } catch (error) {
      console.error('Failed to load insights:', error);
    }
  };

  const generateNewInsights = async () => {
    setRefreshing(true);
    setInsightsError('');

    try {
      const response = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'general' }),
      });

      if (response.ok) {
        // Reload all insights to get the new batch
        await loadStoredInsights();
      } else {
        const errorData = await response.json().catch(() => ({}));
        setInsightsError(errorData.error || 'Failed to generate insights. Please try again.');
      }
    } catch (error) {
      console.error('Failed to generate insights:', error);
      setInsightsError('Failed to connect to AI service. Please try again later.');
    } finally {
      setRefreshing(false);
    }
  };

  const handleActionInsight = async (insightId: string, actioned: boolean) => {
    try {
      await fetch('/api/ai/insights', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ insightId, isActioned: actioned }),
      });

      // Update local state
      setCurrentInsights(prev =>
        prev.map(i => i.id === insightId ? { ...i, isActioned: actioned, actionedAt: actioned ? new Date().toISOString() : null } : i)
      );
      setHistoryBatches(prev =>
        prev.map(batch => ({
          ...batch,
          insights: batch.insights.map(i =>
            i.id === insightId ? { ...i, isActioned: actioned, actionedAt: actioned ? new Date().toISOString() : null } : i
          ),
        }))
      );
    } catch (error) {
      console.error('Failed to update insight:', error);
    }
  };

  const currentBatchDate = currentInsights[0]?.createdAt
    ? new Date(currentInsights[0].createdAt)
    : null;

  const actionedCount = currentInsights.filter(i => i.isActioned).length;

  // Loading state
  if (loading) {
    return (
      <div>
        <Header title="Fan Intelligence Hub" description="AI-powered demand intelligence" />
        <div className="p-6 space-y-6">
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
          <Card>
            <CardContent className="py-12">
              <div className="flex items-center justify-center gap-3 text-[#737373]">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading insights...</span>
              </div>
            </CardContent>
          </Card>
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
                  Connect your sales data to unlock AI-powered insights about fan demand, revenue opportunities, and hidden market signals.
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
        </div>
      </div>
    );
  }

  // Dashboard with data
  return (
    <div>
      <Header
        title="Fan Intelligence Hub"
        description="AI-powered demand intelligence"
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <StatsCard
            title="Current Insights"
            value={currentInsights.length.toString()}
            icon={<Sparkles className="w-5 h-5" />}
          />
          <StatsCard
            title="Actioned"
            value={`${actionedCount}/${currentInsights.length}`}
            icon={<CheckCircle2 className="w-5 h-5" />}
          />
          <StatsCard
            title="History"
            value={`${historyBatches.length} batches`}
            icon={<History className="w-5 h-5" />}
          />
          <StatsCard
            title="AI Confidence"
            value="High"
            icon={<Brain className="w-5 h-5" />}
          />
        </div>

        {/* Current Insights */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Current Insights
              </CardTitle>
              <CardDescription>
                {currentBatchDate ? (
                  <>Generated: {currentBatchDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {currentBatchDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</>
                ) : (
                  <>No insights yet - click Generate to analyze your data</>
                )}
              </CardDescription>
            </div>
            <Button
              onClick={generateNewInsights}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Analyzing...' : 'Generate New'}
            </Button>
          </CardHeader>
          <CardContent>
            {refreshing && currentInsights.length === 0 ? (
              <div className="py-8">
                <div className="max-w-md mx-auto">
                  <div className="relative w-16 h-16 mx-auto mb-6">
                    <div className="absolute inset-0 bg-[#0a0a0a] animate-pulse"></div>
                    <Brain className="absolute inset-0 w-16 h-16 p-4 text-white" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#22c55e] animate-ping"></div>
                  </div>
                  <div className="space-y-3 mb-6">
                    <AnalysisStep icon={<TrendingUp className="w-4 h-4" />} label="Scanning sales patterns" status="complete" />
                    <AnalysisStep icon={<Package className="w-4 h-4" />} label="Analyzing product performance" status="active" />
                    <AnalysisStep icon={<Sparkles className="w-4 h-4" />} label="Generating insights" status="pending" />
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
                <Button variant="outline" size="sm" className="mt-4" onClick={generateNewInsights}>
                  Try Again
                </Button>
              </div>
            ) : currentInsights.length === 0 ? (
              <div className="py-8 text-center">
                <Brain className="w-8 h-8 text-[#e5e5e5] mx-auto mb-4" />
                <p className="text-[#737373]">No insights generated yet</p>
                <p className="text-sm text-[#a3a3a3] mt-1">Click "Generate New" to analyze your data</p>
                <Button size="sm" className="mt-4" onClick={generateNewInsights}>
                  Generate Insights
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {currentInsights.map((insight) => (
                  <InsightCard
                    key={insight.id}
                    insight={insight}
                    onAction={handleActionInsight}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* History Section */}
        {historyBatches.length > 0 && (
          <Card>
            <CardHeader>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="w-full flex items-center justify-between"
              >
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5" />
                    Insight History
                  </CardTitle>
                  <CardDescription>
                    {historyBatches.length} previous analysis {historyBatches.length === 1 ? 'batch' : 'batches'}
                  </CardDescription>
                </div>
                <ChevronDown className={`w-5 h-5 text-[#a3a3a3] transition-transform ${showHistory ? 'rotate-180' : ''}`} />
              </button>
            </CardHeader>
            {showHistory && (
              <CardContent>
                <div className="space-y-3">
                  {historyBatches.map((batch) => (
                    <HistoryBatch
                      key={batch.batchId}
                      batch={batch}
                      onAction={handleActionInsight}
                    />
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        )}

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
                  opportunities, and risks. Insights are saved so you can track recommendations over time and see which ones you've actioned.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
