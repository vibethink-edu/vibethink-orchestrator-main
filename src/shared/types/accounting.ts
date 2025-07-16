// Tipos específicos para integraciones de contabilidad colombiana
// VThink 1.0 - Integraciones Contables

export interface InvoiceData {
  number: string;
  date: string;
  dueDate?: string;
  customerId: string;
  customerName: string;
  items: InvoiceItem[];
  total: number;
  tax: number;
  currency: string;
  notes?: string;
}

export interface InvoiceItem {
  code: string;
  name: string;
  quantity: number;
  price: number;
  tax: number;
  total: number;
  description?: string;
}

export interface InvoiceResponse {
  id: string;
  number: string;
  status: string;
  url?: string;
  xml?: string;
  pdf?: string;
  error?: string;
}

export interface Account {
  id: string;
  code: string;
  name: string;
  type: string;
  parent?: string;
  level: number;
  isActive: boolean;
}

export interface JournalEntryData {
  date: string;
  number: string;
  description: string;
  items: JournalEntryItem[];
  reference?: string;
}

export interface JournalEntryItem {
  account: string;
  debit: number;
  credit: number;
  description: string;
  taxCode?: string;
}

export interface JournalEntryResponse {
  id: string;
  number: string;
  status: string;
  error?: string;
}

export interface CustomerData {
  id: string;
  name: string;
  identification: string;
  email?: string;
  phone?: string;
  address?: string;
  type: 'customer' | 'supplier' | 'both';
}

export interface ProductData {
  id: string;
  code: string;
  name: string;
  price: number;
  taxRate: number;
  category?: string;
  isActive: boolean;
}

export interface AccountingIntegrationConfig {
  id: string;
  name: string;
  type: 'cloud' | 'on_premise' | 'hybrid';
  provider: string;
  country: string;
  hasApi: boolean;
  hasElectronicInvoicing: boolean;
  hasPayroll: boolean;
  hasInventory: boolean;
  hasTreasury: boolean;
  apiEndpoint: string;
  authenticationType: 'oauth2' | 'api_key' | 'basic';
  features: string[];
  limitations: string[];
  documentationUrl: string;
  isCertifiedDian: boolean;
}

export interface CompanyAccountingConfig {
  id: string;
  companyId: string;
  accountingSoftwareId: string;
  integrationLevel: 'api' | 'import_export' | 'rpa' | 'browser_extension' | 'manual';
  integrationStatus: 'active' | 'inactive' | 'testing' | 'error';
  enableDocumentClassification: boolean;
  enableDriveOrganization: boolean;
  enableAiAssistant: boolean;
  enableBrowserExtension: boolean;
  enableAutoContabilization: boolean;
  billingModel: 'included' | 'per_document' | 'per_month' | 'enterprise';
  documentLimit: number;
  overageRate: number;
  integrationFee: number;
  apiCredentials?: Record<string, any>;
  apiSettings?: Record<string, any>;
  apiEndpoints?: Record<string, string>;
  importFormat: 'csv' | 'txt' | 'excel' | 'xml';
  exportFormat: 'csv' | 'txt' | 'excel' | 'xml';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SyncResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
  timestamp: string;
}

export interface AccountingMetrics {
  totalInvoices: number;
  totalRevenue: number;
  totalTax: number;
  averageInvoiceAmount: number;
  topCustomers: CustomerData[];
  recentTransactions: JournalEntryData[];
  syncStatus: 'success' | 'error' | 'pending';
  lastSyncAt: string;
}

// Tipos específicos para Colombia
export interface ColombianTaxConfig {
  ivaRate: number; // 19%
  retentionRate: number; // 2.5%
  taxName: string; // 'IVA'
  taxCode: string; // '01'
}

export interface DianInvoiceData extends InvoiceData {
  resolutionNumber: string;
  resolutionDate: string;
  prefix: string;
  consecutive: string;
  qrCode?: string;
  digitalSignature?: string;
}

export interface DianInvoiceResponse extends InvoiceResponse {
  cufe: string; // Código Único de Factura Electrónica
  qrCode: string;
  xmlContent: string;
  pdfUrl: string;
  validationStatus: 'valid' | 'invalid' | 'pending';
} 