import Image from 'next/image';

interface LogoProps {
  size?: number;
  className?: string;
}

// PhantomOS Logo - uses the actual icon
export function PhantomOSLogo({ size = 24, className = '' }: LogoProps) {
  return (
    <Image
      src="/PhantomOSIcon.svg"
      alt="PhantomOS"
      width={size}
      height={size}
      className={className}
    />
  );
}

// Shopify Logo
// Replace /logos/shopify.svg with actual Shopify logo
export function ShopifyLogo({ size = 24, className = '' }: LogoProps) {
  return (
    <Image
      src="/logos/shopify.svg"
      alt="Shopify"
      width={size}
      height={size}
      className={className}
    />
  );
}

// Amazon Logo
// Replace /logos/amazon.svg with actual Amazon logo
export function AmazonLogo({ size = 24, className = '' }: LogoProps) {
  return (
    <Image
      src="/logos/amazon.svg"
      alt="Amazon"
      width={size}
      height={size}
      className={className}
    />
  );
}

// WooCommerce Logo
// Replace /logos/woocommerce.svg with actual WooCommerce logo
export function WooCommerceLogo({ size = 24, className = '' }: LogoProps) {
  return (
    <Image
      src="/logos/woocommerce.svg"
      alt="WooCommerce"
      width={size}
      height={size}
      className={className}
    />
  );
}

// BigCommerce Logo
// Replace /logos/bigcommerce.svg with actual BigCommerce logo
export function BigCommerceLogo({ size = 24, className = '' }: LogoProps) {
  return (
    <Image
      src="/logos/bigcommerce.svg"
      alt="BigCommerce"
      width={size}
      height={size}
      className={className}
    />
  );
}

// CSV/Spreadsheet Logo (using a simple icon representation)
export function CSVLogo({ size = 24, className = '' }: LogoProps) {
  return (
    <Image
      src="/logos/csv.svg"
      alt="CSV"
      width={size}
      height={size}
      className={className}
    />
  );
}

// Generic connector logo component that selects the right logo
export function ConnectorLogo({
  type,
  size = 24,
  className = ''
}: {
  type: 'shopify' | 'amazon' | 'woocommerce' | 'bigcommerce' | 'csv' | 'phantomos';
  size?: number;
  className?: string;
}) {
  switch (type) {
    case 'shopify':
      return <ShopifyLogo size={size} className={className} />;
    case 'amazon':
      return <AmazonLogo size={size} className={className} />;
    case 'woocommerce':
      return <WooCommerceLogo size={size} className={className} />;
    case 'bigcommerce':
      return <BigCommerceLogo size={size} className={className} />;
    case 'csv':
      return <CSVLogo size={size} className={className} />;
    case 'phantomos':
      return <PhantomOSLogo size={size} className={className} />;
    default:
      return null;
  }
}
