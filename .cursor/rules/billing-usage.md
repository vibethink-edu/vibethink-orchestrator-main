
# Billing & Usage Tracking - AI Pair Orchestrator Pro

## PLAN MANAGEMENT SYSTEM
Enterprise billing with usage tracking and plan limits enforcement.

## PLAN DEFINITIONS
```typescript
// ✅ REQUIRED: Plan configuration and limits
export const PLAN_DEFINITIONS = {
  STARTER: {
    name: 'Starter',
    price: 29,
    limits: {
      users: 5,
      aiRequests: 100,
      scrapingPages: 50,
      storageGB: 5,
      googleWorkspace: true,
      advancedFeatures: false,
      apiAccess: false,
      priority_support: false
    }
  },
  PROFESSIONAL: {
    name: 'Professional', 
    price: 99,
    limits: {
      users: 25,
      aiRequests: 1000,
      scrapingPages: 500,
      storageGB: 50,
      googleWorkspace: true,
      advancedFeatures: true,
      apiAccess: true,
      priority_support: false
    }
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 299,
    limits: {
      users: -1, // Unlimited
      aiRequests: 10000,
      scrapingPages: 5000,
      storageGB: 500,
      googleWorkspace: true,
      advancedFeatures: true,
      apiAccess: true,
      priority_support: true,
      customIntegrations: true,
      dedicatedSupport: true
    }
  }
} as const;

// ✅ REQUIRED: Usage tracking implementation
export const trackUsage = async (
  companyId: string,
  userId: string,
  serviceType: 'openai' | 'firecrawl' | 'storage' | 'api_call',
  operationType: string,
  amount: number,
  costUSD?: number,
  metadata?: Record<string, any>
) => {
  // Validate company exists and is active
  const { data: company } = await supabase
    .from('companies')
    .select('id, status, subscription_plan')
    .eq('id', companyId)
    .single();
    
  if (!company || company.status !== 'ACTIVE') {
    throw new Error('Company not found or inactive');
  }
  
  // Calculate cost if not provided
  const calculatedCost = costUSD || calculateServiceCost(serviceType, operationType, amount);
  
  // Insert usage record
  const { data: usage } = await supabase
    .from('usage_tracking')
    .insert({
      company_id: companyId,
      user_id: userId,
      service_name: serviceType,
      usage_type: operationType,
      amount,
      cost_usd: calculatedCost,
      metadata: {
        ...metadata,
        plan: company.subscription_plan,
        tracked_at: new Date().toISOString()
      }
    })
    .select()
    .single();
    
  // Check if approaching limits
  await checkUsageLimits(companyId, company.subscription_plan);
  
  return usage;
};
```

## USAGE LIMIT ENFORCEMENT
```typescript
// ✅ REQUIRED: Real-time usage limit checking
export const checkUsageLimits = async (
  companyId: string, 
  plan: SubscriptionPlan
) => {
  const planLimits = PLAN_DEFINITIONS[plan].limits;
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  
  // Get current month usage
  const { data: usage } = await supabase
    .from('usage_tracking')
    .select('usage_type, amount')
    .eq('company_id', companyId)
    .gte('created_at', `${currentMonth}-01`)
    .lt('created_at', `${getNextMonth(currentMonth)}-01`);
  
  // Aggregate usage by type
  const usageByType = usage?.reduce((acc, record) => {
    const type = record.usage_type;
    acc[type] = (acc[type] || 0) + record.amount;
    return acc;
  }, {} as Record<string, number>) || {};
  
  // Check AI requests limit
  const aiUsage = usageByType['ai_content_generation'] || 0;
  if (aiUsage >= planLimits.aiRequests) {
    await sendUsageLimitNotification(companyId, 'ai_requests', aiUsage, planLimits.aiRequests);
    throw new UsageLimitError(`AI requests limit reached: ${aiUsage}/${planLimits.aiRequests}`);
  }
  
  // Check scraping pages limit
  const scrapingUsage = usageByType['web_scraping'] || 0;
  if (scrapingUsage >= planLimits.scrapingPages) {
    await sendUsageLimitNotification(companyId, 'scraping_pages', scrapingUsage, planLimits.scrapingPages);
    throw new UsageLimitError(`Scraping pages limit reached: ${scrapingUsage}/${planLimits.scrapingPages}`);
  }
  
  // Check user count limit
  if (planLimits.users > 0) {
    const { count: userCount } = await supabase
      .from('user_profiles')
      .select('id', { count: 'exact' })
      .eq('company_id', companyId)
      .eq('is_active', true);
      
    if (userCount >= planLimits.users) {
      throw new UsageLimitError(`User limit reached: ${userCount}/${planLimits.users}`);
    }
  }
  
  // Send warning at 80% usage
  const warningThreshold = 0.8;
  if (aiUsage >= planLimits.aiRequests * warningThreshold) {
    await sendUsageWarning(companyId, 'ai_requests', aiUsage, planLimits.aiRequests);
  }
};

// ✅ REQUIRED: Usage validation before operations
export const validateUsageBeforeOperation = async (
  companyId: string,
  operationType: 'ai_generation' | 'web_scraping' | 'api_call',
  estimatedUsage: number = 1
) => {
  const { data: company } = await supabase
    .from('companies')
    .select('subscription_plan, status')
    .eq('id', companyId)
    .single();
    
  if (!company || company.status !== 'ACTIVE') {
    throw new Error('Company not found or inactive');
  }
  
  const planLimits = PLAN_DEFINITIONS[company.subscription_plan].limits;
  const currentUsage = await getCurrentMonthUsage(companyId, operationType);
  
  switch (operationType) {
    case 'ai_generation':
      if (currentUsage + estimatedUsage > planLimits.aiRequests) {
        throw new UsageLimitError(
          `Operation would exceed AI requests limit. Current: ${currentUsage}, Limit: ${planLimits.aiRequests}`
        );
      }
      break;
      
    case 'web_scraping':
      if (currentUsage + estimatedUsage > planLimits.scrapingPages) {
        throw new UsageLimitError(
          `Operation would exceed scraping limit. Current: ${currentUsage}, Limit: ${planLimits.scrapingPages}`
        );
      }
      break;
      
    case 'api_call':
      if (!planLimits.apiAccess) {
        throw new Error('API access not included in current plan');
      }
      break;
  }
  
  return true;
};
```

## BILLING CALCULATION
```typescript
// ✅ REQUIRED: Monthly billing calculation
export const calculateMonthlyBilling = async (companyId: string, month: string) => {
  const { data: company } = await supabase
    .from('companies')
    .select('subscription_plan, custom_max_users, custom_max_monthly_ai_requests, custom_max_monthly_scraping_pages')
    .eq('id', companyId)
    .single();
    
  if (!company) {
    throw new Error('Company not found');
  }
  
  const plan = PLAN_DEFINITIONS[company.subscription_plan];
  let totalCost = plan.price;
  
  // Calculate overage charges
  const usage = await getMonthlyUsage(companyId, month);
  const overages = calculateOverages(usage, plan.limits, company);
  
  totalCost += overages.aiRequestsOverage;
  totalCost += overages.scrapingOverage;
  totalCost += overages.storageOverage;
  totalCost += overages.userOverage;
  
  // Custom plan adjustments
  if (company.custom_max_users) {
    const additionalUsers = Math.max(0, company.custom_max_users - plan.limits.users);
    totalCost += additionalUsers * 5; // $5 per additional user
  }
  
  if (company.custom_max_monthly_ai_requests) {
    const additionalRequests = Math.max(0, company.custom_max_monthly_ai_requests - plan.limits.aiRequests);
    totalCost += (additionalRequests / 100) * 2; // $2 per 100 additional requests
  }
  
  // Store billing record
  await supabase
    .from('monthly_billing')
    .upsert({
      company_id: companyId,
      billing_month: month,
      total_cost_usd: totalCost,
      base_plan_cost: plan.price,
      overage_charges: overages,
      usage_details: usage,
      status: 'CALCULATED'
    });
    
  return {
    companyId,
    month,
    totalCost,
    planCost: plan.price,
    overages,
    usage
  };
};

// ✅ REQUIRED: Overage calculation
export const calculateOverages = (
  usage: MonthlyUsage, 
  planLimits: PlanLimits,
  company: Company
) => {
  const overages = {
    aiRequestsOverage: 0,
    scrapingOverage: 0,
    storageOverage: 0,
    userOverage: 0
  };
  
  // AI requests overage ($0.02 per request over limit)
  if (usage.aiRequests > planLimits.aiRequests) {
    overages.aiRequestsOverage = (usage.aiRequests - planLimits.aiRequests) * 0.02;
  }
  
  // Scraping overage ($0.01 per page over limit)
  if (usage.scrapingPages > planLimits.scrapingPages) {
    overages.scrapingOverage = (usage.scrapingPages - planLimits.scrapingPages) * 0.01;
  }
  
  // Storage overage ($0.50 per GB over limit)
  if (usage.storageGB > planLimits.storageGB) {
    overages.storageOverage = (usage.storageGB - planLimits.storageGB) * 0.50;
  }
  
  // User overage ($5 per user over limit) 
  if (planLimits.users > 0 && usage.activeUsers > planLimits.users) {
    overages.userOverage = (usage.activeUsers - planLimits.users) * 5;
  }
  
  return overages;
};
```

## USAGE ANALYTICS
```typescript
// ✅ REQUIRED: Usage analytics for dashboard
export const useUsageAnalytics = (companyId: string) => {
  const { data: currentUsage } = useQuery({
    queryKey: ['usage', 'current', companyId],
    queryFn: () => getCurrentMonthUsage(companyId),
    refetchInterval: 5 * 60 * 1000 // Refresh every 5 minutes
  });
  
  const { data: historicalUsage } = useQuery({
    queryKey: ['usage', 'historical', companyId],
    queryFn: () => getHistoricalUsage(companyId, 6), // Last 6 months
    staleTime: 60 * 60 * 1000 // Cache for 1 hour
  });
  
  const { data: costProjection } = useQuery({
    queryKey: ['usage', 'projection', companyId],
    queryFn: () => calculateCostProjection(companyId),
    staleTime: 60 * 60 * 1000
  });
  
  return {
    currentUsage,
    historicalUsage,
    costProjection,
    isLoading: !currentUsage && !historicalUsage
  };
};

// ✅ REQUIRED: Real-time usage monitoring
export const useRealTimeUsage = (companyId: string) => {
  const [usage, setUsage] = useState<UsageMetrics>();
  
  useEffect(() => {
    const subscription = supabase
      .channel(`usage:${companyId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'usage_tracking',
        filter: `company_id=eq.${companyId}`
      }, (payload) => {
        // Update usage metrics in real-time
        setUsage(prev => updateUsageMetrics(prev, payload.new));
      })
      .subscribe();
      
    return () => subscription.unsubscribe();
  }, [companyId]);
  
  return usage;
};
```

## COST OPTIMIZATION
```typescript
// ✅ REQUIRED: Cost optimization recommendations
export const generateCostOptimizationRecommendations = async (companyId: string) => {
  const usage = await getLastThreeMonthsUsage(companyId);
  const { data: company } = await supabase
    .from('companies')
    .select('subscription_plan')
    .eq('id', companyId)
    .single();
    
  const recommendations: CostRecommendation[] = [];
  
  // Analyze usage patterns
  const avgAIUsage = usage.reduce((sum, month) => sum + month.aiRequests, 0) / usage.length;
  const avgScrapingUsage = usage.reduce((sum, month) => sum + month.scrapingPages, 0) / usage.length;
  
  const currentPlan = PLAN_DEFINITIONS[company.subscription_plan];
  
  // Recommend plan upgrade if consistently over limits
  if (avgAIUsage > currentPlan.limits.aiRequests * 0.9) {
    const nextPlan = getNextPlanTier(company.subscription_plan);
    if (nextPlan) {
      recommendations.push({
        type: 'PLAN_UPGRADE',
        title: `Consider upgrading to ${nextPlan.name}`,
        description: `Your AI usage is consistently near the limit. Upgrading would save on overage charges.`,
        potentialSavings: calculateUpgradeSavings(usage, currentPlan, nextPlan),
        priority: 'HIGH'
      });
    }
  }
  
  // Recommend plan downgrade if consistently under-utilizing
  if (avgAIUsage < currentPlan.limits.aiRequests * 0.3) {
    const prevPlan = getPreviousPlanTier(company.subscription_plan);
    if (prevPlan) {
      recommendations.push({
        type: 'PLAN_DOWNGRADE',
        title: `Consider downgrading to ${prevPlan.name}`,
        description: `You're only using ${Math.round((avgAIUsage / currentPlan.limits.aiRequests) * 100)}% of your plan limits.`,
        potentialSavings: currentPlan.price - prevPlan.price,
        priority: 'MEDIUM'
      });
    }
  }
  
  // Recommend usage optimization
  if (usage.some(month => month.costPerAIRequest > 0.05)) {
    recommendations.push({
      type: 'USAGE_OPTIMIZATION',
      title: 'Optimize AI prompt efficiency',
      description: 'Some AI requests are using more tokens than necessary. Consider optimizing prompts.',
      potentialSavings: calculatePromptOptimizationSavings(usage),
      priority: 'LOW'
    });
  }
  
  return recommendations;
};
```

## PAYMENT PROCESSING
```typescript
// ✅ REQUIRED: Stripe integration for billing
export const processMonthlyPayment = async (companyId: string, month: string) => {
  const billing = await calculateMonthlyBilling(companyId, month);
  const { data: company } = await supabase
    .from('companies')
    .select('stripe_customer_id, billing_email')
    .eq('id', companyId)
    .single();
    
  if (!company.stripe_customer_id) {
    throw new Error('No Stripe customer ID found');
  }
  
  // Create invoice in Stripe
  const invoice = await stripe.invoices.create({
    customer: company.stripe_customer_id,
    description: `AI Pair Orchestrator Pro - ${month}`,
    metadata: {
      company_id: companyId,
      billing_month: month
    }
  });
  
  // Add line items
  await stripe.invoiceItems.create({
    customer: company.stripe_customer_id,
    invoice: invoice.id,
    amount: Math.round(billing.planCost * 100), // Convert to cents
    currency: 'usd',
    description: `${PLAN_DEFINITIONS[company.subscription_plan].name} Plan - ${month}`
  });
  
  // Add overage charges if any
  if (billing.overages.aiRequestsOverage > 0) {
    await stripe.invoiceItems.create({
      customer: company.stripe_customer_id,
      invoice: invoice.id,
      amount: Math.round(billing.overages.aiRequestsOverage * 100),
      currency: 'usd',
      description: `AI Requests Overage - ${month}`
    });
  }
  
  // Finalize and send invoice
  const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);
  
  // Update billing record
  await supabase
    .from('monthly_billing')
    .update({
      stripe_invoice_id: finalizedInvoice.id,
      invoice_url: finalizedInvoice.hosted_invoice_url,
      status: 'INVOICED'
    })
    .eq('company_id', companyId)
    .eq('billing_month', month);
    
  return finalizedInvoice;
};
```

**Billing Success Criteria**: Accurate usage tracking, automated billing, cost optimization, payment processing integration.
