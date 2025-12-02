import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sales, products } from '@/lib/db/schema';
import { getServerSession, isDemoMode, getDemoPublisherId } from '@/lib/auth';
import { eq, and } from 'drizzle-orm';

interface CSVSale {
  productName?: string;
  productSku?: string;
  externalOrderId?: string;
  quantity: number;
  revenue: number;
  cost?: number;
  region?: string;
  channel?: string;
  orderDate: string;
}

// Import sales from CSV
export async function POST(request: NextRequest) {
  try {
    // SECURITY: Get publisherId from session
    let publisherId: string;

    if (isDemoMode()) {
      publisherId = getDemoPublisherId();
    } else {
      const session = await getServerSession();
      if (!session?.user?.publisherId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      publisherId = session.user.publisherId;
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
    const productNameIndex = headerLower.findIndex(
      (h) => h === 'product' || h === 'product_name' || h === 'product name' || h === 'title' || h === 'lineitem_name'
    );
    const skuIndex = headerLower.findIndex(
      (h) => h === 'sku' || h === 'product_sku' || h === 'lineitem_sku'
    );
    const orderIdIndex = headerLower.findIndex(
      (h) => h === 'order_id' || h === 'order' || h === 'order_number' || h === 'name'
    );
    const quantityIndex = headerLower.findIndex(
      (h) => h === 'quantity' || h === 'qty' || h === 'lineitem_quantity'
    );
    const revenueIndex = headerLower.findIndex(
      (h) => h === 'revenue' || h === 'total' || h === 'amount' || h === 'lineitem_price' || h === 'subtotal'
    );
    const costIndex = headerLower.findIndex((h) => h === 'cost' || h === 'cogs');
    const regionIndex = headerLower.findIndex(
      (h) => h === 'region' || h === 'country' || h === 'shipping_country' || h === 'billing_country'
    );
    const channelIndex = headerLower.findIndex(
      (h) => h === 'channel' || h === 'source' || h === 'source_name'
    );
    const dateIndex = headerLower.findIndex(
      (h) => h === 'date' || h === 'order_date' || h === 'created_at' || h === 'processed_at'
    );

    // Validate required columns
    if (quantityIndex === -1 && revenueIndex === -1) {
      return NextResponse.json(
        { error: 'CSV must have a "quantity" or "revenue" column' },
        { status: 400 }
      );
    }

    if (dateIndex === -1) {
      return NextResponse.json(
        { error: 'CSV must have a "date" or "order_date" column' },
        { status: 400 }
      );
    }

    // Get all products for this publisher to match by name/SKU
    const publisherProducts = await db
      .select({ id: products.id, name: products.name, sku: products.sku })
      .from(products)
      .where(eq(products.publisherId, publisherId));

    // Create lookup maps
    const productByName = new Map(
      publisherProducts.map((p) => [p.name.toLowerCase(), p.id])
    );
    const productBySku = new Map(
      publisherProducts.filter((p) => p.sku).map((p) => [p.sku!.toLowerCase(), p.id])
    );

    // Parse data rows
    const salesToInsert: (CSVSale & { productId?: string })[] = [];
    const errors: Array<{ row: number; error: string }> = [];
    const unmatchedProducts: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = parseCSVLine(lines[i]);

        if (values.length === 0) {
          continue; // Skip empty rows
        }

        const productName = productNameIndex >= 0 ? values[productNameIndex]?.trim() : undefined;
        const sku = skuIndex >= 0 ? values[skuIndex]?.trim() : undefined;
        const quantity = quantityIndex >= 0 ? parseInt(values[quantityIndex]) || 1 : 1;
        const revenue = revenueIndex >= 0 ? parseFloat(values[revenueIndex]?.replace(/[^0-9.-]/g, '')) || 0 : 0;
        const orderDate = values[dateIndex]?.trim();

        if (!orderDate) {
          errors.push({ row: i + 1, error: 'Missing order date' });
          continue;
        }

        // Try to match product
        let productId: string | undefined;
        if (sku && productBySku.has(sku.toLowerCase())) {
          productId = productBySku.get(sku.toLowerCase());
        } else if (productName && productByName.has(productName.toLowerCase())) {
          productId = productByName.get(productName.toLowerCase());
        }

        if (!productId && (productName || sku)) {
          const identifier = productName || sku || 'Unknown';
          if (!unmatchedProducts.includes(identifier)) {
            unmatchedProducts.push(identifier);
          }
        }

        salesToInsert.push({
          productId,
          productName,
          productSku: sku,
          externalOrderId: orderIdIndex >= 0 ? values[orderIdIndex]?.trim() : undefined,
          quantity,
          revenue,
          cost: costIndex >= 0 ? parseFloat(values[costIndex]?.replace(/[^0-9.-]/g, '')) || undefined : undefined,
          region: regionIndex >= 0 ? values[regionIndex]?.trim() : undefined,
          channel: channelIndex >= 0 ? values[channelIndex]?.trim() : undefined,
          orderDate,
        });
      } catch (err) {
        errors.push({ row: i + 1, error: String(err) });
      }
    }

    // Insert sales into database
    const insertedSales = [];
    const insertErrors: Array<{ order: string; error: string }> = [];

    for (const csvSale of salesToInsert) {
      // Skip sales without a matched product (for now - could create products on the fly)
      if (!csvSale.productId) {
        continue;
      }

      try {
        // Parse date
        let orderDate: Date;
        try {
          orderDate = new Date(csvSale.orderDate);
          if (isNaN(orderDate.getTime())) {
            throw new Error('Invalid date');
          }
        } catch {
          // Try alternative formats
          const parts = csvSale.orderDate.split(/[-\/]/);
          if (parts.length === 3) {
            // Assume MM/DD/YYYY or YYYY-MM-DD
            if (parts[0].length === 4) {
              orderDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
            } else {
              orderDate = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
            }
          } else {
            throw new Error(`Unable to parse date: ${csvSale.orderDate}`);
          }
        }

        const profit = csvSale.cost ? csvSale.revenue - csvSale.cost : null;

        const [inserted] = await db
          .insert(sales)
          .values({
            publisherId,
            productId: csvSale.productId,
            connectorId: connectorId || null,
            externalOrderId: csvSale.externalOrderId || null,
            quantity: csvSale.quantity,
            revenue: csvSale.revenue.toString(),
            cost: csvSale.cost?.toString() || null,
            profit: profit?.toString() || null,
            region: csvSale.region || null,
            channel: csvSale.channel || null,
            orderDate,
          })
          .returning();

        insertedSales.push(inserted);
      } catch (err) {
        insertErrors.push({
          order: csvSale.externalOrderId || 'Unknown',
          error: String(err),
        });
      }
    }

    return NextResponse.json({
      success: true,
      imported: insertedSales.length,
      total: salesToInsert.length,
      skippedNoProduct: salesToInsert.filter((s) => !s.productId).length,
      unmatchedProducts,
      parseErrors: errors,
      insertErrors,
    });
  } catch (error) {
    console.error('Sales import error:', error);
    return NextResponse.json(
      { error: 'Failed to import sales CSV file' },
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
