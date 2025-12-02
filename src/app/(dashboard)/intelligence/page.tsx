'use client';

import { useState } from 'react';
import { Brain, Sparkles, TrendingUp, AlertCircle, TrendingDown, Target, DollarSign, RefreshCw, ChevronRight, Globe, Zap } from 'lucide-react';
import { Header, StatsCard } from '@/components/dashboard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui';
import { CategoryBreakdown } from '@/components/charts';
import {
  demoAssets,
  demoInsights,
  demoDemandForecast,
  demoSummaryStats,
  demoGameIP
} from '@/lib/demo-data';

export default function IntelligencePage() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <Sparkles className="w-5 h-5 text-[#22c55e]" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-[#eab308]" />;
      default: return <Brain className="w-5 h-5 text-[#0a0a0a]" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge variant="error" className="bg-[#0a0a0a] text-white border-0">High Priority</Badge>;
      case 'medium': return <Badge variant="warning">Medium</Badge>;
      default: return <Badge>Low</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-[#22c55e]';
    if (score >= 60) return 'text-[#eab308]';
    return 'text-[#ef4444]';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="w-4 h-4 text-[#22c55e]" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-[#ef4444]" />;
      default: return <Target className="w-4 h-4 text-[#737373]" />;
    }
  };

  // Transform forecast data
  const forecastData = demoDemandForecast.map(item => ({
    name: item.name,
    value: item.value,
    percentage: item.percentage,
  }));

  return (
    <div>
      <Header
        title="Fan Intelligence Hub"
        description={`${demoGameIP.name} • AI-powered demand intelligence`}
        action={{ label: 'Export Report', onClick: () => console.log('Export') }}
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <StatsCard
            title="Phantom Demand Score"
            value={demoSummaryStats.phantomDemandScore.toString()}
            change={4.2}
            icon={<Brain className="w-5 h-5" />}
          />
          <StatsCard
            title="Active Insights"
            value={demoInsights.length.toString()}
            change={3}
            icon={<Sparkles className="w-5 h-5" />}
          />
          <StatsCard
            title="Revenue Opportunity"
            value={`$${(demoInsights.filter(i => i.type === 'opportunity').reduce((sum, i) => sum + i.potentialRevenue, 0) / 1000).toFixed(0)}K`}
            icon={<DollarSign className="w-5 h-5" />}
          />
          <StatsCard
            title="Prediction Accuracy"
            value={`${demoSummaryStats.predictionAccuracy}%`}
            change={2.1}
            icon={<Target className="w-5 h-5" />}
          />
        </div>

        {/* AI Insights - The Star of the Show */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                AI-Powered Insights
              </CardTitle>
              <CardDescription>Real-time analysis revealing hidden demand signals and opportunities</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh Analysis
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {demoInsights.map((insight) => (
                <div
                  key={insight.id}
                  className={`border transition-all ${
                    selectedInsight === insight.id
                      ? 'border-[#0a0a0a] bg-white'
                      : 'border-[#e5e5e5] bg-[#fafafa] hover:border-[#a3a3a3]'
                  }`}
                >
                  {/* Insight Header */}
                  <div
                    className="p-4 cursor-pointer"
                    onClick={() => setSelectedInsight(selectedInsight === insight.id ? null : insight.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-0.5">{getInsightIcon(insight.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          {getPriorityBadge(insight.priority)}
                          <Badge variant="outline">{insight.asset}</Badge>
                          {insight.region && <Badge variant="outline"><Globe className="w-3 h-3 mr-1" />{insight.region}</Badge>}
                          <span className="text-xs text-[#737373] ml-auto">{insight.createdAt}</span>
                        </div>
                        <h4 className="font-semibold text-[#0a0a0a] mb-1">{insight.title}</h4>
                        <p className="text-sm text-[#737373]">{insight.description}</p>

                        {/* Quick Stats Row */}
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-[#737373]">Confidence:</span>
                            <span className="text-xs font-medium text-[#0a0a0a]">{insight.confidence}%</span>
                          </div>
                          {insight.potentialRevenue > 0 && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-[#737373]">Potential:</span>
                              <span className="text-xs font-medium text-[#22c55e]">+${(insight.potentialRevenue / 1000).toFixed(0)}K</span>
                            </div>
                          )}
                          {insight.potentialRevenue < 0 && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-[#737373]">At Risk:</span>
                              <span className="text-xs font-medium text-[#ef4444]">${(Math.abs(insight.potentialRevenue) / 1000).toFixed(0)}K</span>
                            </div>
                          )}
                          <ChevronRight className={`w-4 h-4 text-[#737373] ml-auto transition-transform ${selectedInsight === insight.id ? 'rotate-90' : ''}`} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedInsight === insight.id && (
                    <div className="border-t border-[#e5e5e5] p-4 bg-white">
                      <div className="grid grid-cols-2 gap-6">
                        {/* Data Points */}
                        <div>
                          <h5 className="text-sm font-medium text-[#0a0a0a] mb-3">Supporting Data</h5>
                          <div className="space-y-2">
                            {insight.dataPoints.map((point, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <div className="w-1.5 h-1.5 bg-[#0a0a0a]" />
                                <span className="text-[#737373]">{point}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Recommendations */}
                        <div>
                          <h5 className="text-sm font-medium text-[#0a0a0a] mb-3">Recommended Actions</h5>
                          <div className="space-y-2">
                            {insight.recommendations.map((rec, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <div className="w-5 h-5 bg-[#f5f5f5] border border-[#e5e5e5] flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-xs font-medium text-[#737373]">{idx + 1}</span>
                                </div>
                                <span className="text-sm text-[#0a0a0a]">{rec}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-[#e5e5e5] flex gap-2">
                        <Button size="sm">Take Action</Button>
                        <Button variant="outline" size="sm">Dismiss</Button>
                        <Button variant="ghost" size="sm">Share with Team</Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Asset Scorecard & Demand Forecast */}
        <div className="grid grid-cols-2 gap-4">
          {/* Asset Performance Scorecard - Detailed */}
          <Card>
            <CardHeader>
              <CardTitle>Asset Performance Scorecard</CardTitle>
              <CardDescription>AI-computed scores based on sales velocity, sentiment, and market signals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demoAssets.map((asset) => (
                  <div key={asset.id} className="p-3 bg-[#fafafa] border border-[#e5e5e5] hover:border-[#a3a3a3] transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#e5e5e5] border border-[#d4d4d4] flex items-center justify-center">
                          <span className="text-xs font-medium text-[#737373]">{asset.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-[#0a0a0a]">{asset.name}</p>
                          <p className="text-xs text-[#737373]">{asset.products} products</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getTrendIcon(asset.trend)}
                        <span className={`text-2xl font-bold ${getScoreColor(asset.score)}`}>
                          {asset.score}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-[#737373]">Revenue</span>
                        <p className="font-medium text-[#0a0a0a]">${(asset.revenue / 1000).toFixed(0)}K</p>
                      </div>
                      <div>
                        <span className="text-[#737373]">Growth</span>
                        <p className={`font-medium ${asset.growth >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                          {asset.growth >= 0 ? '+' : ''}{asset.growth}%
                        </p>
                      </div>
                      <div>
                        <span className="text-[#737373]">Top Region</span>
                        <p className="font-medium text-[#0a0a0a]">{asset.topRegion}</p>
                      </div>
                    </div>
                    {asset.insights && asset.insights.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-[#e5e5e5]">
                        <p className="text-xs text-[#737373]">
                          <Sparkles className="w-3 h-3 inline mr-1" />
                          {asset.insights[0]}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <CategoryBreakdown
            data={forecastData}
            title="30-Day Demand Forecast"
            description="AI-predicted demand by product category"
          />
        </div>

        {/* Methodology Note */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Brain className="w-5 h-5 text-[#737373] mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#0a0a0a]">How PhantomOS AI Works</p>
                <p className="text-sm text-[#737373]">
                  Our AI analyzes sales velocity, inventory levels, social sentiment, seasonal patterns, and market signals
                  across all connected data sources. Predictions are updated hourly with a {demoSummaryStats.predictionAccuracy}% historical accuracy rate.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
