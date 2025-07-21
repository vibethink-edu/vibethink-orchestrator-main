import React, { useState, useEffect } from 'react';
import { useUniversalMigration } from '../hooks/useUniversalMigration';
import { UniversalMigrationConfig } from '../types/universal-migration';

// Shadcn/ui Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Progress } from '@/shared/components/ui/progress';
import { Badge } from '@/shared/components/ui/badge';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Separator } from '@/shared/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/shared/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/shared/components/ui/table';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/shared/components/ui/accordion';

interface KenticoV12MigrationDashboardProps {
  companyId: string;
}

export const KenticoV12MigrationDashboard: React.FC<KenticoV12MigrationDashboardProps> = ({ companyId }) => {
  const {
    migrations,
    loading,
    error,
    executeMigration,
    rollbackMigration,
    clearError
  } = useUniversalMigration();

  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [currentMigration, setCurrentMigration] = useState<any>(null);
  const [migrationConfig, setMigrationConfig] = useState<Partial<UniversalMigrationConfig>>({
    source: {
      type: 'kentico',
      version: 'v12',
      config: {
        url: '',
        credentials: {
          type: 'basic',
          username: '',
          password: ''
        }
      },
      contentTypes: ['pages', 'articles', 'blogs', 'products', 'services', 'events', 'forms', 'newsletters'],
      filters: {
        status: ['published']
      }
    },
    target: {
      type: 'strapi',
      version: 'v4',
      config: {
        url: '',
        credentials: {
          type: 'token',
          token: ''
        }
      }
    },
    options: {
      incremental: false,
      preserveIds: true,
      includeMedia: true,
      includeSEO: true,
      includeRelationships: true,
      includeWorkflow: true,
      includeVersionHistory: false,
      includeUserData: false,
      batchSize: 100,
      concurrency: 3,
      retryOnFailure: true,
      maxRetries: 3,
      rollbackOnFailure: true
    }
  });

  const handleStartMigration = async () => {
    try {
      const config: UniversalMigrationConfig = {
        id: `kentico12_strapi_${Date.now()}`,
        name: 'Kentico v12 to Strapi Migration',
        description: 'Migrate content from Kentico v12 to Strapi v4',
        ...migrationConfig,
        companyId,
        createdBy: 'current-user',
        createdAt: new Date(),
        updatedAt: new Date()
      } as UniversalMigrationConfig;

      const result = await executeMigration(config);
      setCurrentMigration(result);
      setShowConfigDialog(false);
    } catch (error) {
      // TODO: log 'Migration failed:' error
    }
  };

  const handleRollback = async (migrationId: string) => {
    try {
      await rollbackMigration(migrationId);
    } catch (error) {
      // TODO: log 'Rollback failed:' error
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Kentico v12 → Strapi Migration</h1>
              <p className="text-gray-600">Migrate your Kentico v12 content to Strapi v4</p>
            </div>
            
            <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  {loading ? 'Processing...' : 'Start Migration'}
                </Button>
              </DialogTrigger>
              
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Kentico v12 → Strapi Migration Configuration</DialogTitle>
                  <DialogDescription>
                    Configure your migration settings for Kentico v12 to Strapi v4
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  {/* Source Configuration */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Kentico v12 Source</CardTitle>
                      <CardDescription>Configure your Kentico v12 source system</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="kentico-url">Kentico URL</Label>
                          <Input
                            id="kentico-url"
                            placeholder="https://your-kentico-site.com"
                            value={migrationConfig.source?.config.url || ''}
                            onChange={(e) => setMigrationConfig(prev => ({
                              ...prev,
                              source: {
                                ...prev.source!,
                                config: {
                                  ...prev.source!.config,
                                  url: e.target.value
                                }
                              }
                            }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="kentico-version">Version</Label>
                          <Select
                            value={migrationConfig.source?.version || 'v12'}
                            onValueChange={(value) => setMigrationConfig(prev => ({
                              ...prev,
                              source: {
                                ...prev.source!,
                                version: value
                              }
                            }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="v12">Kentico v12</SelectItem>
                              <SelectItem value="v11">Kentico v11</SelectItem>
                              <SelectItem value="v10">Kentico v10</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="kentico-username">Username</Label>
                          <Input
                            id="kentico-username"
                            placeholder="admin"
                            value={migrationConfig.source?.config.credentials.username || ''}
                            onChange={(e) => setMigrationConfig(prev => ({
                              ...prev,
                              source: {
                                ...prev.source!,
                                config: {
                                  ...prev.source!.config,
                                  credentials: {
                                    ...prev.source!.config.credentials,
                                    username: e.target.value
                                  }
                                }
                              }
                            }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="kentico-password">Password</Label>
                          <Input
                            id="kentico-password"
                            type="password"
                            placeholder="••••••••"
                            value={migrationConfig.source?.config.credentials.password || ''}
                            onChange={(e) => setMigrationConfig(prev => ({
                              ...prev,
                              source: {
                                ...prev.source!,
                                config: {
                                  ...prev.source!.config,
                                  credentials: {
                                    ...prev.source!.config.credentials,
                                    password: e.target.value
                                  }
                                }
                              }
                            }))}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Target Configuration */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Strapi v4 Target</CardTitle>
                      <CardDescription>Configure your Strapi v4 target system</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="strapi-url">Strapi URL</Label>
                          <Input
                            id="strapi-url"
                            placeholder="https://your-strapi-site.com"
                            value={migrationConfig.target?.config.url || ''}
                            onChange={(e) => setMigrationConfig(prev => ({
                              ...prev,
                              target: {
                                ...prev.target!,
                                config: {
                                  ...prev.target!.config,
                                  url: e.target.value
                                }
                              }
                            }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="strapi-token">API Token</Label>
                          <Input
                            id="strapi-token"
                            type="password"
                            placeholder="••••••••"
                            value={migrationConfig.target?.config.credentials.token || ''}
                            onChange={(e) => setMigrationConfig(prev => ({
                              ...prev,
                              target: {
                                ...prev.target!,
                                config: {
                                  ...prev.target!.config,
                                  credentials: {
                                    ...prev.target!.config.credentials,
                                    token: e.target.value
                                  }
                                }
                              }
                            }))}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Content Types */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Content Types to Migrate</CardTitle>
                      <CardDescription>Select which content types to migrate</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        {['pages', 'articles', 'blogs', 'products', 'services', 'events', 'forms', 'newsletters'].map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                              id={type}
                              checked={migrationConfig.source?.contentTypes?.includes(type) || false}
                              onCheckedChange={(checked) => {
                                const currentTypes = migrationConfig.source?.contentTypes || [];
                                const newTypes = checked 
                                  ? [...currentTypes, type]
                                  : currentTypes.filter(t => t !== type);
                                
                                setMigrationConfig(prev => ({
                                  ...prev,
                                  source: {
                                    ...prev.source!,
                                    contentTypes: newTypes
                                  }
                                }));
                              }}
                            />
                            <Label htmlFor={type} className="capitalize">{type}</Label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Migration Options */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Migration Options</CardTitle>
                      <CardDescription>Configure migration behavior</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="include-media"
                              checked={migrationConfig.options?.includeMedia || false}
                              onCheckedChange={(checked) => setMigrationConfig(prev => ({
                                ...prev,
                                options: {
                                  ...prev.options!,
                                  includeMedia: checked
                                }
                              }))}
                            />
                            <Label htmlFor="include-media">Include Media Files</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="include-seo"
                              checked={migrationConfig.options?.includeSEO || false}
                              onCheckedChange={(checked) => setMigrationConfig(prev => ({
                                ...prev,
                                options: {
                                  ...prev.options!,
                                  includeSEO: checked
                                }
                              }))}
                            />
                            <Label htmlFor="include-seo">Include SEO Data</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="include-workflow"
                              checked={migrationConfig.options?.includeWorkflow || false}
                              onCheckedChange={(checked) => setMigrationConfig(prev => ({
                                ...prev,
                                options: {
                                  ...prev.options!,
                                  includeWorkflow: checked
                                }
                              }))}
                            />
                            <Label htmlFor="include-workflow">Include Workflow Data</Label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="preserve-ids"
                              checked={migrationConfig.options?.preserveIds || false}
                              onCheckedChange={(checked) => setMigrationConfig(prev => ({
                                ...prev,
                                options: {
                                  ...prev.options!,
                                  preserveIds: checked
                                }
                              }))}
                            />
                            <Label htmlFor="preserve-ids">Preserve IDs</Label>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="batch-size">Batch Size</Label>
                            <Input
                              id="batch-size"
                              type="number"
                              min="1"
                              max="1000"
                              value={migrationConfig.options?.batchSize || 100}
                              onChange={(e) => setMigrationConfig(prev => ({
                                ...prev,
                                options: {
                                  ...prev.options!,
                                  batchSize: parseInt(e.target.value)
                                }
                              }))}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="concurrency">Concurrency</Label>
                            <Input
                              id="concurrency"
                              type="number"
                              min="1"
                              max="10"
                              value={migrationConfig.options?.concurrency || 3}
                              onChange={(e) => setMigrationConfig(prev => ({
                                ...prev,
                                options: {
                                  ...prev.options!,
                                  concurrency: parseInt(e.target.value)
                                }
                              }))}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowConfigDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleStartMigration} disabled={loading}>
                    {loading ? 'Starting...' : 'Start Migration'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="migrations">Migrations</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Kentico v12 Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">✅</Badge>
                      <span className="text-sm">REST API</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">✅</Badge>
                      <span className="text-sm">Workflow Management</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">✅</Badge>
                      <span className="text-sm">Version Control</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">✅</Badge>
                      <span className="text-sm">SEO Tools</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">✅</Badge>
                      <span className="text-sm">Media Management</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">✅</Badge>
                      <span className="text-sm">User Management</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Strapi v4 Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">✅</Badge>
                      <span className="text-sm">REST API</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">✅</Badge>
                      <span className="text-sm">GraphQL API</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">✅</Badge>
                      <span className="text-sm">Content Types</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">✅</Badge>
                      <span className="text-sm">Media Library</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">✅</Badge>
                      <span className="text-sm">Role-Based Access</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">✅</Badge>
                      <span className="text-sm">Plugin System</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Migration Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Total Migrations</span>
                        <span className="font-medium">{migrations.length}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Successful</span>
                        <span className="font-medium text-green-600">
                          {migrations.filter(m => m.status === 'completed').length}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Failed</span>
                        <span className="font-medium text-red-600">
                          {migrations.filter(m => m.status === 'failed').length}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Current Migration */}
            {currentMigration && (
              <Card>
                <CardHeader>
                  <CardTitle>Current Migration</CardTitle>
                  <CardDescription>
                    Kentico v12 → Strapi v4
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm">{currentMigration.progress}%</span>
                    </div>
                    <Progress value={currentMigration.progress} className="w-full" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Status</span>
                      <Badge variant={
                        currentMigration.status === 'completed' ? 'default' :
                        currentMigration.status === 'failed' ? 'destructive' :
                        'secondary'
                      }>
                        {currentMigration.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Migrated Items</span>
                      <span className="text-sm">{currentMigration.migratedItems} / {currentMigration.totalItems}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Migrations Tab */}
          <TabsContent value="migrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Migration History</CardTitle>
                <CardDescription>Recent Kentico v12 to Strapi migrations</CardDescription>
              </CardHeader>
              <CardContent>
                {migrations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No migrations found
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Success Rate</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {migrations.map((migration) => (
                        <TableRow key={migration.id}>
                          <TableCell>
                            {new Date(migration.startTime).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={
                              migration.status === 'completed' ? 'default' :
                              migration.status === 'failed' ? 'destructive' :
                              'secondary'
                            }>
                              {migration.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {migration.migratedItems} / {migration.totalItems}
                          </TableCell>
                          <TableCell>
                            {migration.successRate.toFixed(1)}%
                          </TableCell>
                          <TableCell>
                            {migration.duration ? `${Math.round(migration.duration / 1000)}s` : '-'}
                          </TableCell>
                          <TableCell>
                            {migration.status === 'failed' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRollback(migration.id)}
                              >
                                Rollback
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Migration Progress</CardTitle>
                <CardDescription>Real-time migration status</CardDescription>
              </CardHeader>
              <CardContent>
                {currentMigration ? (
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Overall Progress</span>
                        <span className="text-sm">{currentMigration.progress}%</span>
                      </div>
                      <Progress value={currentMigration.progress} className="w-full" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium mb-2">Extraction</div>
                        <Progress value={25} className="w-full" />
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-2">Transformation</div>
                        <Progress value={50} className="w-full" />
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-2">Validation</div>
                        <Progress value={75} className="w-full" />
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-2">Loading</div>
                        <Progress value={90} className="w-full" />
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600">
                      Current Step: {currentMigration.currentStep}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No active migration
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Migration Logs</CardTitle>
                <CardDescription>Detailed migration logs and errors</CardDescription>
              </CardHeader>
              <CardContent>
                {currentMigration?.logs && currentMigration.logs.length > 0 ? (
                  <div className="space-y-4">
                    {currentMigration.logs.map((log, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-sm font-medium">{log.message}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(log.timestamp).toLocaleString()}
                            </div>
                          </div>
                          <Badge variant={
                            log.level === 'error' ? 'destructive' :
                            log.level === 'warning' ? 'secondary' :
                            'default'
                          }>
                            {log.level}
                          </Badge>
                        </div>
                        {log.details && (
                          <div className="mt-2 text-xs text-gray-600">
                            {JSON.stringify(log.details, null, 2)}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No logs available
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Error Display */}
      {error && (
        <Alert className="fixed bottom-4 right-4 max-w-md">
          <AlertDescription>{error}</AlertDescription>
          <Button variant="outline" size="sm" onClick={clearError} className="ml-2">
            Dismiss
          </Button>
        </Alert>
      )}
    </div>
  );
}; 