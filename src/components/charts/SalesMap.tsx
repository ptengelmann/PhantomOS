'use client';

import { useState, useMemo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Map region names to ISO country codes
const regionToCountries: Record<string, string[]> = {
  'North America': ['USA', 'CAN', 'MEX'],
  'Europe': ['GBR', 'DEU', 'FRA', 'ITA', 'ESP', 'NLD', 'BEL', 'PRT', 'AUT', 'CHE', 'SWE', 'NOR', 'DNK', 'FIN', 'IRL', 'POL', 'CZE', 'GRC', 'HUN', 'ROU', 'BGR', 'HRV', 'SVK', 'SVN', 'EST', 'LVA', 'LTU', 'LUX', 'MLT', 'CYP'],
  'Asia Pacific': ['CHN', 'JPN', 'KOR', 'AUS', 'NZL', 'IND', 'SGP', 'MYS', 'THA', 'VNM', 'PHL', 'IDN', 'TWN', 'HKG'],
  'Latin America': ['BRA', 'ARG', 'CHL', 'COL', 'PER', 'VEN', 'ECU', 'BOL', 'PRY', 'URY', 'CRI', 'PAN', 'DOM', 'GTM', 'HND', 'SLV', 'NIC'],
  'Middle East': ['SAU', 'ARE', 'ISR', 'TUR', 'EGY', 'QAT', 'KWT', 'BHR', 'OMN', 'JOR', 'LBN'],
  'Africa': ['ZAF', 'NGA', 'KEN', 'EGY', 'MAR', 'GHA', 'TZA', 'ETH'],
};

// Map ISO numeric to ISO alpha-3
const isoNumericToAlpha3: Record<string, string> = {
  '840': 'USA', '124': 'CAN', '484': 'MEX',
  '826': 'GBR', '276': 'DEU', '250': 'FRA', '380': 'ITA', '724': 'ESP',
  '528': 'NLD', '056': 'BEL', '620': 'PRT', '040': 'AUT', '756': 'CHE',
  '752': 'SWE', '578': 'NOR', '208': 'DNK', '246': 'FIN', '372': 'IRL',
  '616': 'POL', '203': 'CZE', '300': 'GRC', '348': 'HUN', '642': 'ROU',
  '100': 'BGR', '191': 'HRV', '703': 'SVK', '705': 'SVN', '233': 'EST',
  '428': 'LVA', '440': 'LTU', '442': 'LUX', '470': 'MLT', '196': 'CYP',
  '156': 'CHN', '392': 'JPN', '410': 'KOR', '036': 'AUS', '554': 'NZL',
  '356': 'IND', '702': 'SGP', '458': 'MYS', '764': 'THA', '704': 'VNM',
  '608': 'PHL', '360': 'IDN', '158': 'TWN', '344': 'HKG',
  '076': 'BRA', '032': 'ARG', '152': 'CHL', '170': 'COL', '604': 'PER',
  '862': 'VEN', '218': 'ECU', '068': 'BOL', '600': 'PRY', '858': 'URY',
  '188': 'CRI', '591': 'PAN', '214': 'DOM', '320': 'GTM', '340': 'HND',
  '222': 'SLV', '558': 'NIC',
  '682': 'SAU', '784': 'ARE', '376': 'ISR', '792': 'TUR', '818': 'EGY',
  '634': 'QAT', '414': 'KWT', '048': 'BHR', '512': 'OMN', '400': 'JOR', '422': 'LBN',
  '710': 'ZAF', '566': 'NGA', '404': 'KEN', '504': 'MAR', '288': 'GHA',
  '834': 'TZA', '231': 'ETH',
};

interface RegionData {
  region: string;
  revenue: number;
  orderCount: number;
  percentage: number;
}

interface SalesMapProps {
  data: RegionData[];
  totalRevenue: number;
}

export function SalesMap({ data, totalRevenue }: SalesMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [tooltipContent, setTooltipContent] = useState<{
    region: string;
    revenue: number;
    orders: number;
    percentage: number;
  } | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Create a map of country code to region data
  const countryToRegionData = useMemo(() => {
    const map: Record<string, RegionData> = {};
    data.forEach((regionData) => {
      const countries = regionToCountries[regionData.region] || [];
      countries.forEach((countryCode) => {
        map[countryCode] = regionData;
      });
    });
    return map;
  }, [data]);

  // Get color intensity based on revenue
  const getRegionColor = (regionData: RegionData | undefined, isHovered: boolean) => {
    if (!regionData) return '#f5f5f5';

    const intensity = Math.min(regionData.percentage / 50, 1); // Cap at 50% for max intensity
    const baseGray = isHovered ? 20 : 40;
    const grayValue = Math.round(baseGray + (200 - baseGray) * (1 - intensity));

    return `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltipPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseEnter = (geo: any) => {
    const countryCode = isoNumericToAlpha3[geo.id] || geo.properties?.['ISO_A3'];
    const regionData = countryToRegionData[countryCode];

    if (regionData) {
      setHoveredRegion(regionData.region);
      setTooltipContent({
        region: regionData.region,
        revenue: regionData.revenue,
        orders: regionData.orderCount,
        percentage: regionData.percentage,
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredRegion(null);
    setTooltipContent(null);
  };

  return (
    <div className="relative w-full h-full" onMouseMove={handleMouseMove}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 120,
          center: [0, 30],
        }}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <ZoomableGroup>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryCode = isoNumericToAlpha3[geo.id] || geo.properties?.['ISO_A3'];
                const regionData = countryToRegionData[countryCode];
                const isHovered = regionData?.region === hoveredRegion;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => handleMouseEnter(geo)}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      default: {
                        fill: getRegionColor(regionData, false),
                        stroke: '#e5e5e5',
                        strokeWidth: 0.5,
                        outline: 'none',
                      },
                      hover: {
                        fill: getRegionColor(regionData, true),
                        stroke: '#0a0a0a',
                        strokeWidth: 1,
                        outline: 'none',
                        cursor: regionData ? 'pointer' : 'default',
                      },
                      pressed: {
                        fill: getRegionColor(regionData, true),
                        stroke: '#0a0a0a',
                        strokeWidth: 1,
                        outline: 'none',
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* Tooltip */}
      {tooltipContent && (
        <div
          className="fixed z-50 pointer-events-none bg-[#0a0a0a] text-white px-3 py-2 text-sm shadow-lg"
          style={{
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y - 10,
          }}
        >
          <div className="font-medium">{tooltipContent.region}</div>
          <div className="text-[#a3a3a3] text-xs mt-1">
            ${tooltipContent.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[#a3a3a3] text-xs">
            {tooltipContent.orders.toLocaleString()} orders ({tooltipContent.percentage}%)
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-2 left-2 bg-white/90 border border-[#e5e5e5] p-2 text-xs">
        <div className="font-medium text-[#0a0a0a] mb-1">Revenue by Region</div>
        <div className="space-y-1">
          {data.slice(0, 4).map((region) => (
            <div key={region.region} className="flex items-center gap-2">
              <div
                className="w-3 h-3"
                style={{ backgroundColor: getRegionColor(region, false) }}
              />
              <span className="text-[#737373]">
                {region.region}: ${(region.revenue / 1000).toFixed(0)}K
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
