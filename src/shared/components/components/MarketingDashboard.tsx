/**
 * MarketingDashboard - Dashboard de Marketing
 * 
 * Dashboard especializado en métricas de marketing, campañas,
 * análisis de leads, conversiones y ROI de marketing.
 */

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users,
  Target,
  MousePointer,
  Eye,
  Mail,
  Share2,
  DollarSign,
  BarChart3,
  PieChart,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Smartphone,
  Search,
  Filter,
  Download,
  Play,
  Pause,
  ExternalLink,
  Star,
  Heart,
  MessageCircle,
  Zap
} from 'lucide-react';

// Bundui UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/bundui-premium/components/ui/card';
import { Button } from '@/shared/components/bundui-premium/components/ui/button';
import { Badge } from '@/shared/components/bundui-premium/components/ui/badge';
import { Input } from '@/shared/components/bundui-premium/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/bundui-premium/components/ui/tabs';
import { Progress } from '@/shared/components/bundui-premium/components/ui/progress';
import { Separator } from '@/shared/components/bundui-premium/components/ui/separator';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/bundui-premium/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/bundui-premium/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/bundui-premium/components/ui/dropdown-menu';

// Debug Panel
import SystemDebugPanel from './SystemDebugPanel';

interface MarketingMetrics {
  totalLeads: number;
  qualifiedLeads: number;
  conversionRate: number;
  costPerLead: number;
  marketingROI: number;
  totalSpend: number;
  impressions: number;
  clicks: number;
  ctr: number;
  emailOpenRate: number;
  emailClickRate: number;
  socialEngagement: number;
}

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'social' | 'ppc' | 'content' | 'display';
  status: 'active' | 'paused' | 'completed' | 'draft';
  budget: number;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
  conversionRate: number;
  roi: number;
  startDate: string;
  endDate: string;
}

interface Channel {
  name: string;
  leads: number;
  cost: number;
  conversionRate: number;
  costPerLead: number;
  roi: number;
  trend: 'up' | 'down' | 'stable';
}

interface ContentPerformance {
  title: string;
  type: 'blog' | 'video' | 'infographic' | 'ebook' | 'webinar';
  views: number;
  shares: number;
  leads: number;
  engagement: number;
  publishDate: string;
}

interface SocialMetrics {
  platform: string;
  followers: number;
  engagement: number;
  reach: number;
  clicks: number;
  conversions: number;
  growthRate: number;
}

interface EmailCampaign {
  name: string;
  sent: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  sentDate: string;
}

const MarketingDashboard: React.FC = () => {
  const [showDebug, setShowDebug] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedTab, setSelectedTab] = useState('overview');

  // Mock data - Marketing Metrics
  const marketingMetrics: MarketingMetrics = {
    totalLeads: 2845,
    qualifiedLeads: 1278,
    conversionRate: 18.5,
    costPerLead: 45.30,
    marketingROI: 4.2,
    totalSpend: 128900,
    impressions: 2456000,
    clicks: 89567,
    ctr: 3.65,
    emailOpenRate: 24.8,
    emailClickRate: 4.2,
    socialEngagement: 12.7
  };

  // Mock data - Active Campaigns
  const activeCampaigns: Campaign[] = [
    {
      id: '1',
      name: 'Q3 SaaS Growth Campaign',
      type: 'ppc',
      status: 'active',
      budget: 25000,
      spend: 18450,
      impressions: 456000,
      clicks: 12340,
      conversions: 234,
      ctr: 2.7,
      cpc: 1.49,
      conversionRate: 1.9,
      roi: 3.8,
      startDate: '2025-07-01',
      endDate: '2025-09-30'
    },
    {
      id: '2',
      name: 'Enterprise Email Series',
      type: 'email',
      status: 'active',
      budget: 5000,
      spend: 3200,
      impressions: 89000,
      clicks: 2340,
      conversions: 156,
      ctr: 2.6,
      cpc: 1.37,
      conversionRate: 6.7,
      roi: 5.2,
      startDate: '2025-06-15',
      endDate: '2025-08-15'
    },
    {
      id: '3',
      name: 'LinkedIn Thought Leadership',
      type: 'social',
      status: 'active',
      budget: 8000,
      spend: 5670,
      impressions: 234000,
      clicks: 8900,
      conversions: 89,
      ctr: 3.8,
      cpc: 0.64,
      conversionRate: 1.0,
      roi: 2.1,
      startDate: '2025-06-01',
      endDate: '2025-08-31'
    },
    {
      id: '4',
      name: 'Content Marketing Hub',
      type: 'content',
      status: 'active',
      budget: 12000,
      spend: 8900,
      impressions: 567000,
      clicks: 15600,
      conversions: 312,
      ctr: 2.75,
      cpc: 0.57,
      conversionRate: 2.0,
      roi: 4.5,
      startDate: '2025-05-01',
      endDate: '2025-07-31'
    }
  ];

  // Mock data - Marketing Channels
  const marketingChannels: Channel[] = [
    {
      name: 'Google Ads',
      leads: 456,
      cost: 23400,
      conversionRate: 2.8,
      costPerLead: 51.32,
      roi: 3.9,
      trend: 'up'
    },
    {
      name: 'LinkedIn Ads',
      leads: 234,
      cost: 15600,
      conversionRate: 4.2,
      costPerLead: 66.67,
      roi: 4.8,
      trend: 'up'
    },
    {
      name: 'Email Marketing',
      leads: 345,
      cost: 4500,
      conversionRate: 8.5,
      costPerLead: 13.04,
      roi: 7.2,
      trend: 'stable'
    },
    {
      name: 'Content Marketing',
      leads: 289,
      cost: 8900,
      conversionRate: 3.1,
      costPerLead: 30.80,
      roi: 5.1,
      trend: 'up'
    },
    {
      name: 'Social Media',
      leads: 178,
      cost: 6700,
      conversionRate: 2.1,
      costPerLead: 37.64,
      roi: 2.8,
      trend: 'down'
    },
    {
      name: 'Referrals',
      leads: 123,
      cost: 2300,
      conversionRate: 12.3,
      costPerLead: 18.70,
      roi: 8.9,
      trend: 'up'
    }
  ];

  // Mock data - Content Performance
  const contentPerformance: ContentPerformance[] = [
    {
      title: 'Ultimate Guide to SaaS Marketing',
      type: 'ebook',
      views: 15600,
      shares: 456,
      leads: 234,
      engagement: 87.3,
      publishDate: '2025-06-15'
    },
    {
      title: 'ROI Calculation Best Practices',
      type: 'blog',
      views: 8900,
      shares: 234,
      leads: 89,
      engagement: 72.1,
      publishDate: '2025-07-01'
    },
    {
      title: 'Product Demo Webinar Series',
      type: 'webinar',
      views: 2340,
      shares: 89,
      leads: 156,
      engagement: 94.2,
      publishDate: '2025-06-30'
    },
    {
      title: 'Customer Success Stories',
      type: 'video',
      views: 5670,
      shares: 178,
      leads: 67,
      engagement: 81.5,
      publishDate: '2025-07-05'
    }
  ];

  // Mock data - Social Media Metrics
  const socialMetrics: SocialMetrics[] = [
    {
      platform: 'LinkedIn',
      followers: 12450,
      engagement: 4.8,
      reach: 89000,
      clicks: 2340,
      conversions: 89,
      growthRate: 12.5
    },
    {
      platform: 'Twitter',
      followers: 8900,
      engagement: 3.2,
      reach: 45600,
      clicks: 1560,
      conversions: 34,
      growthRate: 8.7
    },
    {
      platform: 'YouTube',
      followers: 5670,
      engagement: 6.7,
      reach: 34500,
      clicks: 890,
      conversions: 45,
      growthRate: 15.3
    },
    {
      platform: 'Instagram',
      followers: 3450,
      engagement: 5.4,
      reach: 23400,
      clicks: 567,
      conversions: 23,
      growthRate: 9.8
    }
  ];

  // Mock data - Email Campaigns
  const emailCampaigns: EmailCampaign[] = [
    {
      name: 'Monthly Newsletter - July',
      sent: 15600,
      opened: 3900,
      clicked: 456,
      bounced: 234,
      unsubscribed: 23,
      openRate: 25.0,
      clickRate: 2.9,
      conversionRate: 4.8,
      sentDate: '2025-07-01'
    },
    {
      name: 'Product Update Announcement',
      sent: 8900,
      opened: 2670,
      clicked: 534,
      bounced: 89,
      unsubscribed: 12,
      openRate: 30.0,
      clickRate: 6.0,
      conversionRate: 8.2,
      sentDate: '2025-06-28'
    },
    {
      name: 'Webinar Invitation Series',
      sent: 5670,
      opened: 1701,
      clicked: 340,
      bounced: 56,
      unsubscribed: 8,
      openRate: 30.0,
      clickRate: 6.0,
      conversionRate: 12.1,
      sentDate: '2025-06-25'
    }
  ];

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getCampaignTypeIcon = (type: string) => {
    const icons = {
      'email': <Mail className="h-5 w-5" />,
      'social': <Share2 className="h-5 w-5" />,
      'ppc': <Target className="h-5 w-5" />,
      'content': <BarChart3 className="h-5 w-5" />,
      'display': <Eye className="h-5 w-5" />
    };
    return icons[type] || <Target className="h-5 w-5" />;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'active': 'bg-green-100 text-green-800',
      'paused': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-blue-100 text-blue-800',
      'draft': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTrendColor = (trend: string) => {
    const colors = {
      'up': 'text-green-600',
      'down': 'text-red-600',
      'stable': 'text-gray-600'
    };
    return colors[trend] || 'text-gray-600';
  };

  const getContentTypeIcon = (type: string) => {
    const icons = {
      'blog': <BarChart3 className="h-4 w-4" />,
      'video': <Play className="h-4 w-4" />,
      'infographic': <PieChart className="h-4 w-4" />,
      'ebook': <Star className="h-4 w-4" />,
      'webinar': <Calendar className="h-4 w-4" />
    };
    return icons[type] || <BarChart3 className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Marketing Dashboard
          </h1>
          <p className="text-gray-600">
            Análisis de campañas, leads y ROI de marketing
          </p>
        </div>
        
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 días</SelectItem>
              <SelectItem value="30d">Últimos 30 días</SelectItem>
              <SelectItem value="90d">Últimos 90 días</SelectItem>
              <SelectItem value="12m">Último año</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowDebug(!showDebug)}
          >
            Debug
          </Button>
        </div>
      </div>

      {/* Key Marketing Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(marketingMetrics.totalLeads)}</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +18.5% vs mes anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qualified</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(marketingMetrics.qualifiedLeads)}</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +22.1% vs mes anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marketingMetrics.conversionRate}%</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +2.3% vs mes anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost/Lead</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(marketingMetrics.costPerLead)}</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowDownRight className="h-3 w-3 mr-1" />
              -8.2% vs mes anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Marketing ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marketingMetrics.marketingROI}x</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +15.3% vs mes anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CTR</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marketingMetrics.ctr}%</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +0.8% vs mes anterior
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Marketing Funnel */}
            <Card>
              <CardHeader>
                <CardTitle>Marketing Funnel</CardTitle>
                <CardDescription>
                  Conversión a través del funnel de marketing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { stage: 'Impressions', value: 2456000, percentage: 100, color: 'bg-blue-500' },
                    { stage: 'Clicks', value: 89567, percentage: 3.65, color: 'bg-green-500' },
                    { stage: 'Leads', value: 2845, percentage: 3.18, color: 'bg-yellow-500' },
                    { stage: 'Qualified', value: 1278, percentage: 44.9, color: 'bg-orange-500' },
                    { stage: 'Customers', value: 234, percentage: 18.3, color: 'bg-red-500' }
                  ].map((stage) => (
                    <div key={stage.stage} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{stage.stage}</span>
                        <span className="text-sm text-gray-500">
                          {formatNumber(stage.value)} ({stage.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${stage.color}`}
                          style={{ width: `${stage.stage === 'Impressions' ? 100 : (stage.value / 2456000) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Channel Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Channel Performance</CardTitle>
                <CardDescription>
                  ROI por canal de marketing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketingChannels.slice(0, 4).map((channel) => (
                    <div key={channel.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">{channel.name}</span>
                        <Badge variant={channel.trend === 'up' ? 'default' : channel.trend === 'down' ? 'destructive' : 'secondary'}>
                          {channel.trend === 'up' ? '↗' : channel.trend === 'down' ? '↘' : '→'} {channel.trend}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{channel.roi}x ROI</div>
                        <div className="text-sm text-gray-500">{channel.leads} leads</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Email Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Email Campaigns</CardTitle>
              <CardDescription>
                Rendimiento de campañas de email recientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Sent</TableHead>
                    <TableHead>Open Rate</TableHead>
                    <TableHead>Click Rate</TableHead>
                    <TableHead>Conversion</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emailCampaigns.map((campaign, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell>{formatNumber(campaign.sent)}</TableCell>
                      <TableCell>{campaign.openRate}%</TableCell>
                      <TableCell>{campaign.clickRate}%</TableCell>
                      <TableCell>{campaign.conversionRate}%</TableCell>
                      <TableCell>{campaign.sentDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Active Campaigns</CardTitle>
                  <CardDescription>
                    Campañas activas y su rendimiento
                  </CardDescription>
                </div>
                <Button size="sm">
                  <Target className="h-4 w-4 mr-2" />
                  New Campaign
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Spend</TableHead>
                    <TableHead>CTR</TableHead>
                    <TableHead>Conversions</TableHead>
                    <TableHead>ROI</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getCampaignTypeIcon(campaign.type)}
                          <span className="font-medium">{campaign.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{campaign.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(campaign.budget)}</TableCell>
                      <TableCell>{formatCurrency(campaign.spend)}</TableCell>
                      <TableCell>{campaign.ctr}%</TableCell>
                      <TableCell>{campaign.conversions}</TableCell>
                      <TableCell>{campaign.roi}x</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
                            <DropdownMenuItem>Pause/Resume</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Channels</CardTitle>
              <CardDescription>
                Rendimiento y ROI por canal de marketing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {marketingChannels.map((channel) => (
                  <Card key={channel.name}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{channel.name}</CardTitle>
                        <Badge variant={channel.trend === 'up' ? 'default' : channel.trend === 'down' ? 'destructive' : 'secondary'}>
                          {channel.trend === 'up' ? '↗' : channel.trend === 'down' ? '↘' : '→'} {channel.trend}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Leads:</span>
                            <div className="font-medium text-lg">{channel.leads}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Cost:</span>
                            <div className="font-medium text-lg">{formatCurrency(channel.cost)}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Conv. Rate:</span>
                            <div className="font-medium text-lg">{channel.conversionRate}%</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Cost/Lead:</span>
                            <div className="font-medium text-lg">{formatCurrency(channel.costPerLead)}</div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{channel.roi}x</div>
                          <div className="text-sm text-gray-500">ROI</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Performance</CardTitle>
              <CardDescription>
                Rendimiento del contenido de marketing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Content</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Shares</TableHead>
                    <TableHead>Leads</TableHead>
                    <TableHead>Engagement</TableHead>
                    <TableHead>Published</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contentPerformance.map((content, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium max-w-xs truncate">
                        {content.title}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getContentTypeIcon(content.type)}
                          <Badge variant="outline">{content.type}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>{formatNumber(content.views)}</TableCell>
                      <TableCell>{content.shares}</TableCell>
                      <TableCell>{content.leads}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Progress value={content.engagement} className="w-16 h-2" />
                          <span className="text-sm">{content.engagement}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{content.publishDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {socialMetrics.map((platform) => (
              <Card key={platform.platform}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{platform.platform}</CardTitle>
                    <Badge variant="outline">
                      +{platform.growthRate}% growth
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatNumber(platform.followers)}
                        </div>
                        <div className="text-sm text-gray-500">Followers</div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {platform.engagement}%
                        </div>
                        <div className="text-sm text-gray-500">Engagement</div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Reach:</span>
                        <span className="font-medium">{formatNumber(platform.reach)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Clicks:</span>
                        <span className="font-medium">{formatNumber(platform.clicks)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Conversions:</span>
                        <span className="font-medium">{platform.conversions}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Debug Panel */}
      {showDebug && (
        <div className="fixed bottom-4 right-4 z-50">
          <SystemDebugPanel />
        </div>
      )}
    </div>
  );
};

export default MarketingDashboard;
