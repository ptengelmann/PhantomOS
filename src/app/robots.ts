import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/overview/', '/intelligence/', '/products/', '/connectors/', '/settings/', '/studio/', '/production/', '/storefront/', '/creators/'],
    },
    sitemap: 'https://phantom-os.vercel.app/sitemap.xml',
  };
}
