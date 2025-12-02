'use client';

import { useState } from 'react';
import { Brain, Sparkles, TrendingUp, AlertCircle, Filter, Download, RefreshCw } from 'lucide-react';
import { Header, StatsCard } from '@/components/dashboard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui';
import { AssetPerformanceChart, CategoryBreakdown } from '@/components/charts';

// Mock insights data
const aiInsights = [
  {
    id: 1,
    type: 'opportunity',
    title: 'Master Chief demand spike predicted',
    description: 'Based on upcoming Halo anniversary and social sentiment analysis, we predict a 40% increase in Master Chief merchandise demand in the next 30 days.',
    confidence: 92,
    recommendations: ['Increase inventory by 35%', 'Prepare limited edition drop', 'Alert production partners'],
    asset: 'Master Chief',
    createdAt: '2 hours ago',
  },
  {
    id: 2,
    type: 'warning',
    title: 'Ezio product line underperforming',
    description: 'Sales velocity for Assassins Creed Ezio merchandise has declined 23% over the past 60 days, despite stable traffic.',
    confidence: 87,
    recommendations: ['Consider promotional pricing', 'Test new designs', 'Evaluate product-market fit'],
    asset: 'Ezio',
    createdAt: '5 hours ago',
  },
  {
    id: 3,
    type: 'insight',
    title: 'Vintage aesthetic trending for Geralt products',
    description: 'NLP analysis of 15,000+ reviews shows strong preference for "vintage", "worn", and "authentic" styling in Witcher merchandise.',
    confidence: 78,
    recommendations: ['Brief design team on trend', 'Test distressed prints', 'Consider aged metal finishes'],
    asset: 'Geralt',
    createdAt: '1 day ago',
  },
];

const assetScorecard = [
  { name: 'Master Chief', score: 94, trend: 'rising', revenue: 285000, growth: 24, products: 45 },
  { name: 'Kratos', score: 88, trend: 'rising', revenue: 215000, growth: 18, products: 32 },
  { name: 'Geralt', score: 82, trend: 'stable', revenue: 178000, growth: 12, products: 28 },
  { name: 'Link', score: 76, trend: 'stable', revenue: 156000, growth: 5, products: 38 },
  { name: 'Ezio', score: 54, trend: 'declining', revenue: 98000, growth: -3, products: 22 },
];

const demandForecast = [
  { name: 'Apparel', value: 185000, percentage: 38 },
  { name: 'Collectibles', value: 145000, percentage: 30 },
  { name: 'Accessories', value: 78000, percentage: 16 },
  { name: 'Home', value: 52000, percentage: 11 },
  { name: 'Digital', value: 24000, percentage: 5 },
];

export default function IntelligencePage() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <Sparkles className="w-4 h-4 text-[#22c55e]" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-[#eab308]" />;
      default: return <Brain className="w-4 h-4 text-[#0a0a0a]" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-[#22c55e]';
    if (score >= 60) return 'text-[#eab308]';
    return 'text-[#ef4444]';
  };

  const getTrendBadge = (trend: string) => {
    switch (trend) {
      case 'rising': return <Badge variant="success">Rising</Badge>;
      case 'declining': return <Badge variant="error">Declining</Badge>;
      default: return <Badge>Stable</Badge>;
    }
  };

  return (
    <div>
      <Header
        title="Fan Intelligence Hub"
        description="AI-powered insights to reveal phantom demand"
        action={{ label: 'Export Report', onClick: () => console.log('Export') }}
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <StatsCard
            title="Phantom Demand Score"
            value="87"
            change={4.2}
            icon={<Brain className="w-5 h-5" />}
          />
          <StatsCard
            title="Active Insights"
            value="12"
            change={3}
            icon={<Sparkles className="w-5 h-5" />}
          />
          <StatsCard
            title="Data Sources"
            value="5"
            icon={<Filter className="w-5 h-5" />}
          />
          <StatsCard
            title="Prediction Accuracy"
            value="89%"
            change={2.1}
            icon={<TrendingUp className="w-5 h-5" />}
          />
        </div>

        {/* AI Insights */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>AI-Generated Insights</CardTitle>
              <CardDescription>Real-time analysis of your sales data and market signals</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiInsights.map((insight) => (
                <div
                  key={insight.id}
                  className="p-4 bg-[#fafafa] border border-[#e5e5e5] hover:border-[#0a0a0a] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getInsightIcon(insight.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-[#0a0a0a]">{insight.title}</h4>
                        <Badge variant="outline">{insight.asset}</Badge>
                        <span className="text-xs text-[#737373]">{insight.createdAt}</span>
                      </div>
                      <p className="text-sm text-[#737373] mb-3">{insight.description}</p>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-[#737373]">Confidence:</span>
                        <div className="flex-1 max-w-32 h-1.5 bg-[#e5e5e5]">
                          <div
                            className="h-full bg-[#0a0a0a]"
                            style={{ width: `${insight.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">{insight.confidence}%</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {insight.recommendations.map((rec, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-white border border-[#e5e5e5] text-[#737373]"
                          >
                            {rec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Asset Scorecard & Demand Forecast */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Asset Performance Scorecard</CardTitle>
              <CardDescription>AI-computed scores based on sales velocity, sentiment, and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Trend</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Growth</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assetScorecard.map((asset) => (
                    <TableRow key={asset.name}>
                      <TableCell className="font-medium">{asset.name}</TableCell>
                      <TableCell>
                        <span className={`text-lg font-semibold ${getScoreColor(asset.score)}`}>
                          {asset.score}
                        </span>
                      </TableCell>
                      <TableCell>{getTrendBadge(asset.trend)}</TableCell>
                      <TableCell>${(asset.revenue / 1000).toFixed(0)}K</TableCell>
                      <TableCell>
                        <span className={asset.growth >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}>
                          {asset.growth >= 0 ? '+' : ''}{asset.growth}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <CategoryBreakdown
            data={demandForecast}
            title="30-Day Demand Forecast"
            description="Predicted demand by category"
          />
        </div>
      </div>
    </div>
  );
}
