import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { getServerSession, isDemoMode, getDemoPublisherId, requireWriteAccess, canWrite } from '@/lib/auth';

interface CSVProduct {
  name: string;
  sku?: string;
  description?: string;
  category?: string;
  price?: string;
  vendor?: string;
  tags?: string;
  externalId?: string;
}

// Import products from CSV
export async function POST(request: NextRequest) {
  try {
    // SECURITY: Get publisherId from session, not form data
    // SECURITY: Require write access (owner/admin only)
    let publisherId: string;

    const session = await getServerSession();

    if (session?.user?.publisherId) {
      // User is logged in - always check RBAC regardless of demo mode
      if (!canWrite(session.user.role)) {
        return NextResponse.json({ error: 'Write access required' }, { status: 403 });
      }
      publisherId = session.user.publisherId;
    } else if (isDemoMode()) {
      // No session but demo mode - allow anonymous access
      publisherId = getDemoPublisherId();
    } else {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const connectorId = formData.get('connectorId') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'CSV file is required' },
        { status: 400 }
      );
    }

    // Read and parse CSV
    const text = await file.text();
    const lines = text.split('\n').filter((line) => line.trim());

    if (lines.length < 2) {
      return NextResponse.json(
        { error: 'CSV file must have a header row and at least one data row' },
        { status: 400 }
      );
    }

    // Parse header
    const header = parseCSVLine(lines[0]);
    const headerLower = header.map((h) => h.toLowerCase().trim());

    // Find column indices
    const nameIndex = headerLower.findIndex(
      (h) => h === 'name' || h === 'title' || h === 'product name' || h === 'product_name'
    );
    const skuIndex = headerLower.findIndex((h) => h === 'sku' || h === 'product_sku');
    const descriptionIndex = headerLower.findIndex(
      (h) => h === 'description' || h === 'body' || h === 'body_html'
    );
    const categoryIndex = headerLower.findIndex(
      (h) => h === 'category' || h === 'type' || h === 'product_type'
    );
    const priceIndex = headerLower.findIndex(
      (h) => h === 'price' || h === 'variant_price'
    );
    const vendorIndex = headerLower.findIndex((h) => h === 'vendor');
    const tagsIndex = headerLower.findIndex((h) => h === 'tags');
    const externalIdIndex = headerLower.findIndex(
      (h) => h === 'id' || h === 'handle' || h === 'external_id'
    );

    if (nameIndex === -1) {
      return NextResponse.json(
        { error: 'CSV must have a "name" or "title" column' },
        { status: 400 }
      );
    }

    // Parse data rows
    const productsToInsert: CSVProduct[] = [];
    const errors: Array<{ row: number; error: string }> = [];

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = parseCSVLine(lines[i]);

        if (values.length === 0 || !values[nameIndex]?.trim()) {
          continue; // Skip empty rows
        }

        productsToInsert.push({
          name: values[nameIndex]?.trim() || '',
          sku: skuIndex >= 0 ? values[skuIndex]?.trim() : undefined,
          description: descriptionIndex >= 0 ? values[descriptionIndex]?.trim() : undefined,
          category: categoryIndex >= 0 ? values[categoryIndex]?.trim() : undefined,
          price: priceIndex >= 0 ? values[priceIndex]?.trim() : undefined,
          vendor: vendorIndex >= 0 ? values[vendorIndex]?.trim() : undefined,
          tags: tagsIndex >= 0 ? values[tagsIndex]?.trim() : undefined,
          externalId: externalIdIndex >= 0 ? values[externalIdIndex]?.trim() : undefined,
        });
      } catch (err) {
        errors.push({ row: i + 1, error: String(err) });
      }
    }

    // Insert products into database
    const insertedProducts = [];
    const insertErrors: Array<{ product: string; error: string }> = [];

    for (const csvProduct of productsToInsert) {
      try {
        const categoryMap: Record<string, 'apparel' | 'collectibles' | 'accessories' | 'home' | 'digital' | 'other'> = {
          apparel: 'apparel',
          clothing: 'apparel',
          accessories: 'accessories',
          collectibles: 'collectibles',
          toys: 'collectibles',
          figures: 'collectibles',
          home: 'home',
          homeware: 'home',
          digital: 'digital',
        };

        const normalizedCategory = csvProduct.category?.toLowerCase() || '';
        const category = categoryMap[normalizedCategory] || 'other';

        const [inserted] = await db
          .insert(products)
          .values({
            publisherId,
            connectorId: connectorId || null,
            externalId: csvProduct.externalId || null,
            name: csvProduct.name,
            description: csvProduct.description || null,
            category,
            price: csvProduct.price || null,
            sku: csvProduct.sku || null,
            vendor: csvProduct.vendor || null,
            tags: csvProduct.tags ? csvProduct.tags.split(',').map((t) => t.trim()) : [],
            mappingStatus: 'unmapped',
          })
          .returning();

        insertedProducts.push(inserted);
      } catch (err) {
        insertErrors.push({ product: csvProduct.name, error: String(err) });
      }
    }

    return NextResponse.json({
      success: true,
      imported: insertedProducts.length,
      total: productsToInsert.length,
      parseErrors: errors,
      insertErrors,
    });
  } catch (error) {
    console.error('CSV import error:', error);
    return NextResponse.json(
      { error: 'Failed to import CSV file' },
      { status: 500 }
    );
  }
}

// Helper function to parse CSV line handling quotes
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}
