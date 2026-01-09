
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Tables = Database['public']['Tables'];
type TableName = keyof Tables;
type Row<T extends TableName> = Tables[T]['Row'];
type Insert<T extends TableName> = Tables[T]['Insert'];
type Update<T extends TableName> = Tables[T]['Update'];

interface QueryResult<T> {
  data: T[] | null;
  error: any;
  count?: number;
}

interface SingleQueryResult<T> {
  data: T | null;
  error: any;
}

export class QueryBuilder<T extends TableName> {
  private tableName: T;
  private selectQuery: string = '*';
  private conditions: string[] = [];
  private orderByClause: string = '';
  private limitValue: number | null = null;
  private offsetValue: number | null = null;

  constructor(tableName: T) {
    this.tableName = tableName;
  }

  select(columns: string = '*'): this {
    this.selectQuery = columns;
    return this;
  }

  eq(column: string, value: any): this {
    this.conditions.push(`${column}.eq.${value}`);
    return this;
  }

  neq(column: string, value: any): this {
    this.conditions.push(`${column}.neq.${value}`);
    return this;
  }

  gt(column: string, value: any): this {
    this.conditions.push(`${column}.gt.${value}`);
    return this;
  }

  gte(column: string, value: any): this {
    this.conditions.push(`${column}.gte.${value}`);
    return this;
  }

  lt(column: string, value: any): this {
    this.conditions.push(`${column}.lt.${value}`);
    return this;
  }

  lte(column: string, value: any): this {
    this.conditions.push(`${column}.lte.${value}`);
    return this;
  }

  like(column: string, pattern: string): this {
    this.conditions.push(`${column}.like.${pattern}`);
    return this;
  }

  ilike(column: string, pattern: string): this {
    this.conditions.push(`${column}.ilike.${pattern}`);
    return this;
  }

  in(column: string, values: any[]): this {
    this.conditions.push(`${column}.in.(${values.join(',')})`);
    return this;
  }

  isNull(column: string): this {
    this.conditions.push(`${column}.is.null`);
    return this;
  }

  isNotNull(column: string): this {
    this.conditions.push(`${column}.not.is.null`);
    return this;
  }

  orderBy(column: string, ascending: boolean = true): this {
    this.orderByClause = `${column}.${ascending ? 'asc' : 'desc'}`;
    return this;
  }

  asc(column: string): this {
    this.orderByClause = `${column}.asc`;
    return this;
  }

  desc(column: string): this {
    this.orderByClause = `${column}.desc`;
    return this;
  }

  limit(count: number): this {
    this.limitValue = count;
    return this;
  }

  offset(count: number): this {
    this.offsetValue = count;
    return this;
  }

  range(from: number, to: number): this {
    this.offsetValue = from;
    this.limitValue = to - from + 1;
    return this;
  }

  private buildQuery() {
    let query = supabase.from(this.tableName).select(this.selectQuery);

    // Apply conditions
    this.conditions.forEach(condition => {
      const [column, operator, ...valueParts] = condition.split('.');
      const value = valueParts.join('.');

      switch (operator) {
        case 'eq':
          query = (query as any).eq(column, value);
          break;
        case 'neq':
          query = (query as any).neq(column, value);
          break;
        case 'gt':
          query = (query as any).gt(column, value);
          break;
        case 'gte':
          query = (query as any).gte(column, value);
          break;
        case 'lt':
          query = (query as any).lt(column, value);
          break;
        case 'lte':
          query = (query as any).lte(column, value);
          break;
        case 'like':
          query = (query as any).like(column, value);
          break;
        case 'ilike':
          query = (query as any).ilike(column, value);
          break;
        case 'in':
          const inValues = value.slice(1, -1).split(','); // Remove parentheses and split
          query = (query as any).in(column, inValues as any);
          break;
        case 'is':
          if (value === 'null') {
            query = (query as any).is(column, null);
          }
          break;
        case 'not':
          if (valueParts.join('.') === 'is.null') {
            query = (query as any).not(column, 'is', null);
          }
          break;
      }
    });

    // Apply ordering
    if (this.orderByClause) {
      const [column, direction] = this.orderByClause.split('.');
      const ascending = direction === 'asc';
      query = (query as any).order(column, { ascending });
    }

    // Apply pagination
    if (this.limitValue !== null && this.offsetValue !== null) {
      const to = this.offsetValue + this.limitValue - 1;
      query = (query as any).range(this.offsetValue, to);
    } else if (this.limitValue !== null) {
      query = (query as any).limit(this.limitValue);
    }

    return query;
  }

  async execute(): Promise<QueryResult<Row<T>>> {
    const query = this.buildQuery();
    const result = await query;
    return {
      // Type assertion justified: Wrapper guarantees T matches table schema
      data: result.data as Row<T>[] | null,
      error: result.error,
      count: result.count || undefined
    };
  }

  async single(): Promise<SingleQueryResult<Row<T>>> {
    const query = this.buildQuery();
    const result = await query.single();
    return {
      // Type assertion justified: Wrapper guarantees T matches table schema
      data: result.data as Row<T> | null,
      error: result.error
    };
  }

  async maybeSingle(): Promise<SingleQueryResult<Row<T>>> {
    const query = this.buildQuery();
    const result = await query.maybeSingle();
    return {
      // Type assertion justified: Wrapper guarantees T matches table schema
      data: result.data as Row<T> | null,
      error: result.error
    };
  }

  // Insert method
  async insert(data: Insert<T> | Insert<T>[]): Promise<QueryResult<Row<T>>> {
    const result = await (supabase.from(this.tableName) as any).insert(data).select();
    return {
      // Type assertion justified: Wrapper guarantees T matches table schema
      data: result.data as Row<T>[] | null,
      error: result.error
    };
  }

  // Update method  
  async update(data: Update<T>): Promise<QueryResult<Row<T>>> {
    let query = (supabase.from(this.tableName) as any).update(data);

    // Apply conditions for update
    this.conditions.forEach(condition => {
      const [column, operator, ...valueParts] = condition.split('.');
      const value = valueParts.join('.');

      switch (operator) {
        case 'eq':
          query = query.eq(column, value);
          break;
        // Add other operators as needed for updates
      }
    });

    const result = await query.select();
    return {
      // Type assertion justified: Wrapper guarantees T matches table schema
      data: result.data as Row<T>[] | null,
      error: result.error
    };
  }

  // Delete method
  async delete(): Promise<{ error: any }> {
    let query = (supabase.from(this.tableName) as any).delete();

    // Apply conditions for delete
    this.conditions.forEach(condition => {
      const [column, operator, ...valueParts] = condition.split('.');
      const value = valueParts.join('.');

      switch (operator) {
        case 'eq':
          query = query.eq(column, value);
          break;
        // Add other operators as needed for deletes
      }
    });

    const result = await query;
    return {
      error: result.error
    };
  }

  // Utility method to clone the query builder
  clone(): QueryBuilder<T> {
    const cloned = new QueryBuilder(this.tableName);
    cloned.selectQuery = this.selectQuery;
    cloned.conditions = [...this.conditions];
    cloned.orderByClause = this.orderByClause;
    cloned.limitValue = this.limitValue;
    cloned.offsetValue = this.offsetValue;
    return cloned;
  }

  // Generate SQL for debugging
  toSQL(): string {
    let sql = `SELECT ${this.selectQuery} FROM ${String(this.tableName)}`;

    if (this.conditions.length > 0) {
      const whereConditions = this.conditions.map(condition => {
        const [column, operator, ...valueParts] = condition.split('.');
        const value = valueParts.join('.');

        switch (operator) {
          case 'eq': return `${column} = ${value}`;
          case 'neq': return `${column} != ${value}`;
          case 'gt': return `${column} > ${value}`;
          case 'gte': return `${column} >= ${value}`;
          case 'lt': return `${column} < ${value}`;
          case 'lte': return `${column} <= ${value}`;
          case 'like': return `${column} LIKE ${value}`;
          case 'ilike': return `${column} ILIKE ${value}`;
          case 'in': return `${column} IN ${value}`;
          case 'is': return `${column} IS ${value}`;
          default: return condition;
        }
      });
      sql += ` WHERE ${whereConditions.join(' AND ')}`;
    }

    if (this.orderByClause) {
      const [column, direction] = this.orderByClause.split('.');
      sql += ` ORDER BY ${column} ${direction.toUpperCase()}`;
    }

    if (this.limitValue) {
      sql += ` LIMIT ${this.limitValue}`;
    }

    if (this.offsetValue) {
      sql += ` OFFSET ${this.offsetValue}`;
    }

    return sql;
  }
}

// Factory functions for each table
export const QueryBuilders = {
  companies: () => new QueryBuilder('companies'),
  userProfiles: () => new QueryBuilder('user_profiles'),
  platformConfigurations: () => new QueryBuilder('platform_configurations'),
  companyConfigurations: () => new QueryBuilder('company_configurations'),
  companyConfigurationOverrides: () => new QueryBuilder('company_configuration_overrides'),
  configurationAuditLog: () => new QueryBuilder('configuration_audit_log'),
  operationalRepositories: () => new QueryBuilder('operational_repositories'),
  promptTemplates: () => new QueryBuilder('prompt_templates'),
  namingConventions: () => new QueryBuilder('naming_conventions'),
  folderStructureTemplates: () => new QueryBuilder('folder_structure_templates'),
  planDefinitions: () => new QueryBuilder('plan_definitions'),
  usageTracking: () => new QueryBuilder('usage_tracking'),
  monthlyBilling: () => new QueryBuilder('monthly_billing'),
  companyApiKeys: () => new QueryBuilder('company_api_keys'),
  googleWorkspaceConfigs: () => new QueryBuilder('google_workspace_configs'),
  googleWorkspaceTokens: () => new QueryBuilder('google_workspace_tokens'),
  companyOrchestrators: () => new QueryBuilder('company_orchestrators')
} as const;

export default QueryBuilder;
