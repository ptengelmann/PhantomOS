'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';
import { formatCompactNumber } from '@/lib/utils';

interface CategoryData {
  name: string;
  value: number;
  percentage: number;
}

interface CategoryBreakdownProps {
  data: CategoryData[];
  title?: string;
  description?: string;
  valuePrefix?: string;
}

export function CategoryBreakdown({
  data,
  title = 'Category Breakdown',
  description = 'Revenue distribution by product category',
  valuePrefix = '$'
}: CategoryBreakdownProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={item.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-[#0a0a0a]">{item.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#0a0a0a]">
                    {valuePrefix}{formatCompactNumber(item.value)}
                  </span>
                  <span className="text-xs text-[#737373]">
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="h-2 bg-[#f5f5f5] border border-[#e5e5e5]">
                <div
                  className="h-full bg-[#0a0a0a] transition-all duration-500"
                  style={{
                    width: `${item.percentage}%`,
                    opacity: 1 - (index * 0.15)
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-[#e5e5e5]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#737373]">Total</span>
            <span className="text-lg font-semibold text-[#0a0a0a]">
              {valuePrefix}{formatCompactNumber(total)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
