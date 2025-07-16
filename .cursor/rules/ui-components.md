
# UI Components - AI Pair Orchestrator Pro

## AI-POWERED COMPONENT PATTERNS
Specialized UI components for AI content generation and collaboration.

## AI CONTENT GENERATOR
```typescript
// ✅ REQUIRED: Main AI content generation component
export const AIContentGenerator: React.FC = () => {
  const { user, company } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [usageStatus, setUsageStatus] = useState<UsageStatus>();
  const [selectedContentType, setSelectedContentType] = useState<ContentType>('blog_post');
  
  // Check usage limits before allowing generation
  useEffect(() => {
    checkUsageLimit(company.id, 'ai_content_generation')
      .then(setUsageStatus);
  }, [company.id]);
  
  const handleGenerate = async (prompt: string, options: GenerationOptions) => {
    if (!hasAIPermission(user.role, 'ai_generation')) {
      toast.error('Insufficient permissions for AI generation');
      return;
    }
    
    if (usageStatus?.remaining <= 0) {
      toast.error('Monthly AI usage limit reached. Please upgrade your plan.');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const content = await generateContent({
        companyId: company.id,
        userId: user.id,
        prompt,
        contentType: selectedContentType,
        targetAudience: options.targetAudience,
        tone: options.tone,
        googleWorkspaceIntegration: options.googleWorkspaceIntegration
      });
      
      setGeneratedContent(content.content);
      toast.success('Content generated successfully!');
      
      // Update usage status
      setUsageStatus(prev => ({
        ...prev!,
        remaining: prev!.remaining - 1,
        used: prev!.used + 1
      }));
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate content');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          AI Content Generator
        </CardTitle>
        <CardDescription>
          Generate professional content with AI assistance
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <UsageIndicator 
          current={usageStatus?.used || 0}
          limit={usageStatus?.limit || 0}
          plan={company.subscription_plan}
        />
        
        <ContentTypeSelector 
          value={selectedContentType}
          onChange={setSelectedContentType}
        />
        
        <PromptInput 
          onGenerate={handleGenerate}
          disabled={isGenerating || (usageStatus?.remaining || 0) <= 0}
          contentType={selectedContentType}
        />
        
        {isGenerating && <AIGenerationSpinner />}
        
        {generatedContent && (
          <GeneratedContentDisplay 
            content={generatedContent}
            contentType={selectedContentType}
            onSaveToGoogleDocs={() => {
              // Save to Google Docs functionality
            }}
            onShare={() => {
              // Share with team functionality
            }}
            onSaveAsTemplate={() => {
              // Save as company template
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

// ✅ REQUIRED: Usage indicator component
export const UsageIndicator: React.FC<UsageIndicatorProps> = ({ 
  current, 
  limit, 
  plan 
}) => {
  const percentage = (current / limit) * 100;
  const isNearLimit = percentage > 80;
  const isAtLimit = percentage >= 100;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">
          AI Generation Usage ({plan} Plan)
        </span>
        <span className={cn(
          "text-sm",
          isAtLimit ? "text-red-500" : isNearLimit ? "text-orange-500" : "text-green-500"
        )}>
          {current} / {limit} requests
        </span>
      </div>
      
      <Progress 
        value={percentage} 
        className={cn(
          "h-2",
          isAtLimit ? "bg-red-100" : isNearLimit ? "bg-orange-100" : "bg-green-100"
        )}
      />
      
      {isNearLimit && !isAtLimit && (
        <p className="text-xs text-orange-600">
          You're approaching your monthly limit. Consider upgrading your plan.
        </p>
      )}
      
      {isAtLimit && (
        <p className="text-xs text-red-600">
          Monthly limit reached. Upgrade your plan to continue generating content.
        </p>
      )}
    </div>
  );
};
```

## COLLABORATIVE EDITOR
```typescript
// ✅ REQUIRED: Real-time collaborative editor
export const CollaborativeEditor: React.FC<CollaborativeEditorProps> = ({ 
  documentId 
}) => {
  const { company } = useAuth();
  const { collaborators, documentState } = useRealtimeCollaboration(company.id, documentId);
  const [content, setContent] = useState(documentState?.content || '');
  const [lastSaved, setLastSaved] = useState<Date>();
  
  // Auto-save functionality
  useEffect(() => {
    const autoSave = debounce(async () => {
      await broadcastDocumentChange(company.id, documentId, content);
      setLastSaved(new Date());
    }, 2000);
    
    if (content !== documentState?.content) {
      autoSave();
    }
    
    return autoSave.cancel;
  }, [content, company.id, documentId]);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <CollaboratorAvatars collaborators={collaborators} />
        
        <div className="flex items-center gap-4">
          {lastSaved && (
            <span className="text-xs text-muted-foreground">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}
          
          <AIAssistantTrigger 
            onAIGenerate={(prompt) => {
              // Trigger AI generation for current content
            }}
          />
        </div>
      </div>
      
      <RichTextEditor 
        content={content}
        onChange={setContent}
        collaborators={collaborators}
        placeholder="Start writing or use AI to generate content..."
      />
      
      <DocumentActions 
        documentId={documentId}
        content={content}
        onExportToGoogleDocs={() => {
          // Export to Google Docs
        }}
        onShareWithTeam={() => {
          // Share with team
        }}
      />
    </div>
  );
};

// ✅ REQUIRED: Collaborator avatars display
export const CollaboratorAvatars: React.FC<CollaboratorAvatarsProps> = ({ 
  collaborators 
}) => {
  const maxVisible = 5;
  const visibleCollaborators = collaborators.slice(0, maxVisible);
  const hiddenCount = collaborators.length - maxVisible;
  
  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {visibleCollaborators.map((collaborator) => (
          <TooltipWrapper key={collaborator.id} content={collaborator.name}>
            <Avatar className="h-8 w-8 border-2 border-background">
              <AvatarImage src={collaborator.avatar} />
              <AvatarFallback>
                {collaborator.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </TooltipWrapper>
        ))}
        
        {hiddenCount > 0 && (
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted border-2 border-background text-xs font-medium">
            +{hiddenCount}
          </div>
        )}
      </div>
      
      {collaborators.length > 0 && (
        <span className="ml-3 text-sm text-muted-foreground">
          {collaborators.length} active
        </span>
      )}
    </div>
  );
};
```

## PROMPT TEMPLATE SYSTEM
```typescript
// ✅ REQUIRED: Prompt template selector
export const PromptTemplateSelector: React.FC<PromptTemplateSelectorProps> = ({
  companyId,
  contentType,
  onSelectTemplate
}) => {
  const { templates } = usePromptTemplates(companyId);
  const filteredTemplates = templates?.filter(t => 
    t.category === contentType || t.category === 'general'
  );
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Template className="h-4 w-4 mr-2" />
          Use Template
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium">Prompt Templates</h4>
          
          <ScrollArea className="h-60">
            <div className="space-y-2">
              {filteredTemplates?.map((template) => (
                <Card 
                  key={template.id}
                  className="p-3 cursor-pointer hover:bg-muted/50"
                  onClick={() => onSelectTemplate(template)}
                >
                  <h5 className="font-medium text-sm">{template.title}</h5>
                  <p className="text-xs text-muted-foreground mt-1">
                    {template.description}
                  </p>
                  <div className="flex gap-1 mt-2">
                    {template.tags?.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => {
              // Open template creation dialog
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Template
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

// ✅ REQUIRED: AI generation spinner
export const AIGenerationSpinner: React.FC = () => {
  const [dots, setDots] = useState('');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <p className="text-muted-foreground">
          AI is generating your content{dots}
        </p>
        <p className="text-xs text-muted-foreground">
          This usually takes 10-30 seconds
        </p>
      </div>
    </div>
  );
};
```

## GOOGLE WORKSPACE INTEGRATION UI
```typescript
// ✅ REQUIRED: Google Workspace connection status
export const GoogleWorkspaceStatus: React.FC<GoogleWorkspaceStatusProps> = ({
  companyId
}) => {
  const { config, token, isConnected } = useGoogleWorkspace();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <img src="/google-workspace-icon.svg" alt="Google Workspace" className="h-5 w-5" />
          Google Workspace Integration
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {isConnected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              Connected and Active
            </div>
            
            <div className="space-y-2 text-sm">
              <p><strong>Domain:</strong> {config?.redirect_uri}</p>
              <p><strong>Scopes:</strong> Documents, Drive, Gmail</p>
              <p><strong>Status:</strong> Active</p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  // Test connection
                }}
              >
                Test Connection
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  // Disconnect
                }}
              >
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-orange-600">
              <AlertCircle className="h-4 w-4" />
              Not Connected
            </div>
            
            <p className="text-sm text-muted-foreground">
              Connect your Google Workspace to enable document integration, 
              team collaboration, and automated content saving.
            </p>
            
            <Button onClick={() => {
              // Initiate OAuth flow
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Connect Google Workspace
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
```

## RESPONSIVE DESIGN PATTERNS
```typescript
// ✅ REQUIRED: Mobile-first responsive components
export const ResponsiveAIGenerator: React.FC = () => {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return (
      <div className="px-4 py-6 space-y-4">
        <MobileUsageIndicator />
        <MobilePromptInput />
        <MobileContentDisplay />
      </div>
    );
  }
  
  return <AIContentGenerator />;
};

// ✅ REQUIRED: Performance optimized components
export const OptimizedContentDisplay = React.memo<ContentDisplayProps>(({ 
  content, 
  contentType 
}) => {
  const formattedContent = useMemo(() => {
    return formatContentForDisplay(content, contentType);
  }, [content, contentType]);
  
  return (
    <div className="prose prose-sm max-w-none">
      {formattedContent}
    </div>
  );
});
```

**UI Components Success Criteria**: Responsive design, real-time collaboration, optimistic updates, accessibility compliance.
