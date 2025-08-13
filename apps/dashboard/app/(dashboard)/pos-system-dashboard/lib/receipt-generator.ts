// Receipt Generation Library
// Following VThink 1.0 methodology with comprehensive receipt support

import { Transaction, ReceiptData, ReceiptLine, Product, Customer } from "../types";
import { formatCurrency, formatDateTime } from "./pos-utils";

export interface ReceiptConfig {
  showLogo: boolean;
  showBarcode: boolean;
  showFooterMessage: boolean;
  paperWidth: number; // characters
  fontSize: 'small' | 'medium' | 'large';
  alignment: 'left' | 'center' | 'right';
  customFooter?: string;
}

export interface CompanyInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website?: string;
  taxId?: string;
  logo?: string;
}

const DEFAULT_CONFIG: ReceiptConfig = {
  showLogo: true,
  showBarcode: true,
  showFooterMessage: true,
  paperWidth: 48,
  fontSize: 'medium',
  alignment: 'center'
};

const DEFAULT_COMPANY_INFO: CompanyInfo = {
  name: "Your Store Name",
  address: "123 Main Street",
  city: "Anytown",
  state: "ST",
  zipCode: "12345",
  phone: "(555) 123-4567",
  email: "info@yourstore.com",
  website: "www.yourstore.com",
  taxId: "TAX-123456789"
};

export class ReceiptGenerator {
  private config: ReceiptConfig;
  private companyInfo: CompanyInfo;

  constructor(config?: Partial<ReceiptConfig>, companyInfo?: Partial<CompanyInfo>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.companyInfo = { ...DEFAULT_COMPANY_INFO, ...companyInfo };
  }

  /**
   * Generate complete receipt data
   */
  generateReceipt(
    transaction: Transaction,
    customer?: Customer,
    cashier?: { name: string; id: string }
  ): ReceiptData {
    const receiptLines: ReceiptLine[] = [];

    // Header
    receiptLines.push(...this.generateHeader());

    // Transaction info
    receiptLines.push(...this.generateTransactionInfo(transaction, cashier));

    // Customer info (if available)
    if (customer) {
      receiptLines.push(...this.generateCustomerInfo(customer));
    }

    // Items
    receiptLines.push(...this.generateItemsList(transaction));

    // Totals
    receiptLines.push(...this.generateTotals(transaction));

    // Payment info
    receiptLines.push(...this.generatePaymentInfo(transaction));

    // Footer
    receiptLines.push(...this.generateFooter(transaction));

    return {
      transaction,
      company_info: this.companyInfo,
      receipt_number: `R-${transaction.transaction_number}`,
      print_time: new Date().toISOString(),
      lines: receiptLines
    };
  }

  /**
   * Generate receipt header
   */
  private generateHeader(): ReceiptLine[] {
    const lines: ReceiptLine[] = [];

    // Logo placeholder
    if (this.config.showLogo && this.companyInfo.logo) {
      lines.push({
        type: 'header',
        content: '[LOGO]',
        align: 'center'
      });
    }

    // Company name
    lines.push({
      type: 'header',
      content: this.companyInfo.name.toUpperCase(),
      align: 'center'
    });

    // Company address
    lines.push({
      type: 'header',
      content: this.companyInfo.address,
      align: 'center'
    });

    lines.push({
      type: 'header',
      content: `${this.companyInfo.city}, ${this.companyInfo.state} ${this.companyInfo.zipCode}`,
      align: 'center'
    });

    // Phone
    lines.push({
      type: 'header',
      content: this.companyInfo.phone,
      align: 'center'
    });

    // Email
    if (this.companyInfo.email) {
      lines.push({
        type: 'header',
        content: this.companyInfo.email,
        align: 'center'
      });
    }

    // Website
    if (this.companyInfo.website) {
      lines.push({
        type: 'header',
        content: this.companyInfo.website,
        align: 'center'
      });
    }

    // Tax ID
    if (this.companyInfo.taxId) {
      lines.push({
        type: 'header',
        content: `Tax ID: ${this.companyInfo.taxId}`,
        align: 'center'
      });
    }

    // Separator
    lines.push({
      type: 'header',
      content: this.generateSeparator(),
      align: 'center'
    });

    return lines;
  }

  /**
   * Generate transaction information
   */
  private generateTransactionInfo(
    transaction: Transaction,
    cashier?: { name: string; id: string }
  ): ReceiptLine[] {
    const lines: ReceiptLine[] = [];

    // Receipt title
    lines.push({
      type: 'header',
      content: 'SALES RECEIPT',
      align: 'center'
    });

    lines.push({
      type: 'header',
      content: this.generateSeparator(),
      align: 'center'
    });

    // Transaction number
    lines.push({
      type: 'header',
      content: `Transaction: ${transaction.transaction_number}`,
      align: 'left'
    });

    // Date and time
    lines.push({
      type: 'header',
      content: `Date: ${formatDateTime(transaction.created_at)}`,
      align: 'left'
    });

    // Cashier info
    if (cashier) {
      lines.push({
        type: 'header',
        content: `Cashier: ${cashier.name} (${cashier.id})`,
        align: 'left'
      });
    }

    lines.push({
      type: 'header',
      content: this.generateSeparator(),
      align: 'center'
    });

    return lines;
  }

  /**
   * Generate customer information
   */
  private generateCustomerInfo(customer: Customer): ReceiptLine[] {
    const lines: ReceiptLine[] = [];

    lines.push({
      type: 'header',
      content: `Customer: ${customer.name}`,
      align: 'left'
    });

    if (customer.email) {
      lines.push({
        type: 'header',
        content: `Email: ${customer.email}`,
        align: 'left'
      });
    }

    if (customer.phone) {
      lines.push({
        type: 'header',
        content: `Phone: ${customer.phone}`,
        align: 'left'
      });
    }

    // Loyalty points
    if (customer.loyalty_points > 0) {
      lines.push({
        type: 'header',
        content: `Loyalty Points: ${customer.loyalty_points}`,
        align: 'left'
      });
    }

    lines.push({
      type: 'header',
      content: this.generateSeparator(),
      align: 'center'
    });

    return lines;
  }

  /**
   * Generate items list
   */
  private generateItemsList(transaction: Transaction): ReceiptLine[] {
    const lines: ReceiptLine[] = [];

    // Items header
    lines.push({
      type: 'item',
      content: this.formatItemHeader(),
      align: 'left'
    });

    lines.push({
      type: 'item',
      content: this.generateSeparator('-'),
      align: 'center'
    });

    // Individual items
    transaction.items.forEach(item => {
      // Item name and quantity
      lines.push({
        type: 'item',
        content: `${item.product.name}`,
        align: 'left'
      });

      // Quantity, price, and total
      const qtyPriceTotal = this.formatItemLine(
        item.quantity,
        item.unit_price,
        item.total
      );

      lines.push({
        type: 'item',
        content: qtyPriceTotal,
        align: 'left'
      });

      // SKU (if space allows)
      if (item.product.sku) {
        lines.push({
          type: 'item',
          content: `  SKU: ${item.product.sku}`,
          align: 'left'
        });
      }

      // Tax info (if applicable)
      if (item.tax_amount > 0) {
        lines.push({
          type: 'item',
          content: `  Tax: ${formatCurrency(item.tax_amount)}`,
          align: 'left'
        });
      }
    });

    lines.push({
      type: 'item',
      content: this.generateSeparator('-'),
      align: 'center'
    });

    return lines;
  }

  /**
   * Generate totals section
   */
  private generateTotals(transaction: Transaction): ReceiptLine[] {
    const lines: ReceiptLine[] = [];

    // Subtotal
    lines.push({
      type: 'subtotal',
      content: this.formatTotalLine('Subtotal:', transaction.subtotal),
      align: 'left'
    });

    // Tax
    if (transaction.tax_total > 0) {
      lines.push({
        type: 'tax',
        content: this.formatTotalLine('Tax:', transaction.tax_total),
        align: 'left'
      });
    }

    // Discount
    if (transaction.discount_amount > 0) {
      lines.push({
        type: 'subtotal',
        content: this.formatTotalLine('Discount:', -transaction.discount_amount),
        align: 'left'
      });
    }

    // Total
    lines.push({
      type: 'total',
      content: this.generateSeparator('='),
      align: 'center'
    });

    lines.push({
      type: 'total',
      content: this.formatTotalLine('TOTAL:', transaction.total_amount),
      align: 'left'
    });

    lines.push({
      type: 'total',
      content: this.generateSeparator('='),
      align: 'center'
    });

    return lines;
  }

  /**
   * Generate payment information
   */
  private generatePaymentInfo(transaction: Transaction): ReceiptLine[] {
    const lines: ReceiptLine[] = [];

    // Payment method
    const paymentMethodDisplay = this.getPaymentMethodDisplay(transaction.payment_method);
    lines.push({
      type: 'payment',
      content: `Payment: ${paymentMethodDisplay}`,
      align: 'left'
    });

    // For cash payments, show tendered and change
    if (transaction.payment_method === 'cash') {
      // This would come from payment data in a real implementation
      const amountTendered = transaction.total_amount + 5.00; // Mock
      const change = amountTendered - transaction.total_amount;

      lines.push({
        type: 'payment',
        content: this.formatTotalLine('Tendered:', amountTendered),
        align: 'left'
      });

      lines.push({
        type: 'payment',
        content: this.formatTotalLine('Change:', change),
        align: 'left'
      });
    }

    // Reference number for card payments
    if (['credit_card', 'debit_card', 'digital_wallet'].includes(transaction.payment_method)) {
      const refNumber = `REF-${Date.now().toString().slice(-6)}`;
      lines.push({
        type: 'payment',
        content: `Ref: ${refNumber}`,
        align: 'left'
      });

      // Auth code for card payments
      if (['credit_card', 'debit_card'].includes(transaction.payment_method)) {
        const authCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        lines.push({
          type: 'payment',
          content: `Auth: ${authCode}`,
          align: 'left'
        });
      }
    }

    return lines;
  }

  /**
   * Generate footer
   */
  private generateFooter(transaction: Transaction): ReceiptLine[] {
    const lines: ReceiptLine[] = [];

    lines.push({
      type: 'footer',
      content: this.generateSeparator(),
      align: 'center'
    });

    // Thank you message
    lines.push({
      type: 'footer',
      content: 'THANK YOU FOR YOUR BUSINESS!',
      align: 'center'
    });

    // Return policy
    lines.push({
      type: 'footer',
      content: 'Returns accepted within 30 days with receipt',
      align: 'center'
    });

    // Survey or feedback message
    if (this.config.showFooterMessage) {
      lines.push({
        type: 'footer',
        content: 'Tell us about your experience:',
        align: 'center'
      });

      if (this.companyInfo.website) {
        lines.push({
          type: 'footer',
          content: `${this.companyInfo.website}/feedback`,
          align: 'center'
        });
      }
    }

    // Custom footer message
    if (this.config.customFooter) {
      lines.push({
        type: 'footer',
        content: this.config.customFooter,
        align: 'center'
      });
    }

    // Barcode (transaction number)
    if (this.config.showBarcode) {
      lines.push({
        type: 'footer',
        content: `|||| ${transaction.transaction_number} ||||`,
        align: 'center'
      });
    }

    return lines;
  }

  /**
   * Format item header
   */
  private formatItemHeader(): string {
    const qtyWidth = 3;
    const priceWidth = 8;
    const totalWidth = 8;
    const nameWidth = this.config.paperWidth - qtyWidth - priceWidth - totalWidth - 3;

    return (
      'ITEM'.padEnd(nameWidth) +
      'QTY'.padStart(qtyWidth) +
      'PRICE'.padStart(priceWidth) +
      'TOTAL'.padStart(totalWidth)
    );
  }

  /**
   * Format individual item line
   */
  private formatItemLine(quantity: number, price: number, total: number): string {
    const qtyWidth = 3;
    const priceWidth = 8;
    const totalWidth = 8;

    return (
      quantity.toString().padStart(qtyWidth) +
      formatCurrency(price).padStart(priceWidth) +
      formatCurrency(total).padStart(totalWidth)
    );
  }

  /**
   * Format total line
   */
  private formatTotalLine(label: string, amount: number): string {
    const totalWidth = 12;
    const labelWidth = this.config.paperWidth - totalWidth;

    return (
      label.padEnd(labelWidth) +
      formatCurrency(amount).padStart(totalWidth)
    );
  }

  /**
   * Generate separator line
   */
  private generateSeparator(char: string = '='): string {
    return char.repeat(this.config.paperWidth);
  }

  /**
   * Get payment method display name
   */
  private getPaymentMethodDisplay(method: string): string {
    const displayNames: Record<string, string> = {
      cash: 'Cash',
      credit_card: 'Credit Card',
      debit_card: 'Debit Card',
      digital_wallet: 'Digital Wallet',
      bank_transfer: 'Bank Transfer',
      loyalty_points: 'Loyalty Points'
    };

    return displayNames[method] || method;
  }

  /**
   * Convert receipt to plain text
   */
  toPlainText(receiptData: ReceiptData): string {
    return receiptData.lines?.map(line => line.content).join('\n') || '';
  }

  /**
   * Convert receipt to HTML
   */
  toHTML(receiptData: ReceiptData): string {
    const lines = receiptData.lines || [];
    
    let html = '<div class="receipt" style="font-family: monospace; white-space: pre-wrap;">';
    
    lines.forEach(line => {
      const alignStyle = `text-align: ${line.align || 'left'}`;
      const typeClass = `receipt-${line.type}`;
      
      html += `<div class="${typeClass}" style="${alignStyle}">${line.content}</div>`;
    });
    
    html += '</div>';
    
    return html;
  }

  /**
   * Print receipt (browser print)
   */
  print(receiptData: ReceiptData): void {
    const htmlContent = this.toHTML(receiptData);
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt - ${receiptData.receipt_number}</title>
            <style>
              body { 
                margin: 0; 
                padding: 20px; 
                font-family: 'Courier New', monospace; 
                font-size: 12px;
              }
              .receipt { 
                max-width: 300px; 
                margin: 0 auto; 
              }
              .receipt-header { font-weight: bold; }
              .receipt-total { font-weight: bold; }
              @media print {
                body { padding: 0; }
              }
            </style>
          </head>
          <body>
            ${htmlContent}
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }
  }

  /**
   * Email receipt
   */
  async emailReceipt(receiptData: ReceiptData, customerEmail: string): Promise<void> {
    // TODO: Implement email sending
    console.log('Emailing receipt to:', customerEmail);
    console.log('Receipt data:', receiptData);
    
    // This would integrate with email service like SendGrid, AWS SES, etc.
  }
}

// Export default instance
export const receiptGenerator = new ReceiptGenerator();

// Export utility functions
export const generateQuickReceipt = (
  transaction: Transaction,
  customer?: Customer
): string => {
  const receipt = receiptGenerator.generateReceipt(transaction, customer);
  return receiptGenerator.toPlainText(receipt);
};

export const printQuickReceipt = (
  transaction: Transaction,
  customer?: Customer
): void => {
  const receipt = receiptGenerator.generateReceipt(transaction, customer);
  receiptGenerator.print(receipt);
};