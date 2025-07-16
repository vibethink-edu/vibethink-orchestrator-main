
# Google Workspace Integration - AI Pair Orchestrator Pro

## GOOGLE WORKSPACE AUTHENTICATION
Enterprise-grade Google Workspace integration with domain restrictions.

## OAUTH CONFIGURATION
```typescript
// ✅ REQUIRED: Google OAuth setup with company domain restriction
export const googleWorkspaceAuth = {
  // Authenticate user with Google Workspace
  authenticateUser: async (companyId: string) => {
    const { data: company } = await supabase
      .from('companies')
      .select('google_workspace_domain, google_client_id')
      .eq('id', companyId)
      .single();
    
    if (!company) {
      throw new Error('Company not found');
    }
    
    const oauth2Client = new google.auth.OAuth2(
      company.google_client_id,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/documents',
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/gmail.readonly',
        'openid',
        'email',
        'profile'
      ],
      hd: company.google_workspace_domain, // Restrict to company domain
      prompt: 'consent'
    });
    
    return authUrl;
  },
  
  // Handle OAuth callback
  handleCallback: async (code: string, companyId: string) => {
    const { data: company } = await supabase
      .from('companies')
      .select('google_client_id')
      .eq('id', companyId)
      .single();
    
    const oauth2Client = new google.auth.OAuth2(
      company.google_client_id,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    
    // Get user info
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();
    
    // Validate domain
    const userDomain = userInfo.data.email?.split('@')[1];
    if (userDomain !== company.google_workspace_domain) {
      throw new Error('Email domain does not match company workspace');
    }
    
    // Store tokens securely
    await supabase
      .from('google_workspace_tokens')
      .upsert({
        user_id: getCurrentUserId(),
        company_id: companyId,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: new Date(tokens.expiry_date!).toISOString(),
        scope: tokens.scope,
        token_type: tokens.token_type || 'Bearer'
      });
    
    return userInfo.data;
  }
};
```

## GOOGLE DOCS INTEGRATION
```typescript
// ✅ REQUIRED: Save AI content to Google Docs
export const saveToGoogleDocs = async (
  companyId: string,
  userId: string,
  content: string,
  options: GoogleDocsOptions
) => {
  const userAuth = await getUserGoogleAuth(userId, companyId);
  const docs = google.docs({ version: 'v1', auth: userAuth });
  
  // Create new document
  const doc = await docs.documents.create({
    requestBody: {
      title: options.title || `AI Generated Content - ${new Date().toLocaleDateString()}`
    }
  });
  
  // Insert content with formatting
  await docs.documents.batchUpdate({
    documentId: doc.data.documentId!,
    requestBody: {
      requests: [
        {
          insertText: {
            location: { index: 1 },
            text: content
          }
        },
        {
          updateTextStyle: {
            range: {
              startIndex: 1,
              endIndex: content.length + 1
            },
            textStyle: {
              fontSize: { magnitude: 11, unit: 'PT' },
              fontFamily: 'Arial'
            },
            fields: 'fontSize,fontFamily'
          }
        }
      ]
    }
  });
  
  // Share with team if requested
  if (options.shareWithTeam) {
    await shareWithCompanyTeam(companyId, doc.data.documentId!);
  }
  
  // Move to specific folder if requested
  if (options.folderLocation) {
    await moveToFolder(doc.data.documentId!, options.folderLocation, userAuth);
  }
  
  // Save reference in database
  await supabase
    .from('google_docs_integration')
    .insert({
      company_id: companyId,
      user_id: userId,
      document_id: doc.data.documentId,
      document_url: `https://docs.google.com/document/d/${doc.data.documentId}`,
      content_type: 'ai_generated',
      title: options.title || 'AI Generated Content'
    });
  
  return {
    documentId: doc.data.documentId,
    documentUrl: `https://docs.google.com/document/d/${doc.data.documentId}`,
    title: doc.data.title
  };
};

// ✅ REQUIRED: Share document with company team
export const shareWithCompanyTeam = async (companyId: string, documentId: string) => {
  const { data: teamMembers } = await supabase
    .from('user_profiles')
    .select('email')
    .eq('company_id', companyId)
    .eq('is_active', true);
  
  const userAuth = await getCompanyGoogleAuth(companyId);
  const drive = google.drive({ version: 'v3', auth: userAuth });
  
  // Share with each team member
  for (const member of teamMembers || []) {
    await drive.permissions.create({
      fileId: documentId,
      requestBody: {
        role: 'writer',
        type: 'user',
        emailAddress: member.email
      }
    });
  }
};
```

## GOOGLE DRIVE ORGANIZATION
```typescript
// ✅ REQUIRED: Folder structure management
export const createCompanyFolderStructure = async (
  companyId: string,
  folderStructure: FolderStructure
) => {
  const userAuth = await getCompanyGoogleAuth(companyId);
  const drive = google.drive({ version: 'v3', auth: userAuth });
  
  // Create main company folder
  const mainFolder = await drive.files.create({
    requestBody: {
      name: `AI Pair - ${folderStructure.companyName}`,
      mimeType: 'application/vnd.google-apps.folder',
      parents: ['root']
    }
  });
  
  // Create subfolders
  const subfolders = [
    'AI Generated Content',
    'Shared Templates',
    'Team Collaboration',
    'Archive'
  ];
  
  const createdFolders: Record<string, string> = {
    main: mainFolder.data.id!
  };
  
  for (const subfolder of subfolders) {
    const folder = await drive.files.create({
      requestBody: {
        name: subfolder,
        mimeType: 'application/vnd.google-apps.folder',
        parents: [mainFolder.data.id!]
      }
    });
    
    createdFolders[subfolder] = folder.data.id!;
  }
  
  // Save folder structure in database
  await supabase
    .from('google_drive_folders')
    .insert({
      company_id: companyId,
      folder_structure: createdFolders,
      main_folder_id: mainFolder.data.id,
      created_by: getCurrentUserId()
    });
  
  return createdFolders;
};

// ✅ REQUIRED: Move file to specific folder
export const moveToFolder = async (
  fileId: string,
  folderPath: string,
  userAuth: any
) => {
  const drive = google.drive({ version: 'v3', auth: userAuth });
  
  // Get folder ID from path
  const folderId = await getFolderIdFromPath(folderPath, userAuth);
  
  if (folderId) {
    await drive.files.update({
      fileId,
      addParents: folderId,
      fields: 'id, parents'
    });
  }
};
```

## GOOGLE WORKSPACE SYNC
```typescript
// ✅ REQUIRED: Sync user data from Google Workspace
export const syncUserFromWorkspace = async (companyId: string, googleUser: GoogleUser) => {
  // Validate user belongs to company domain
  const { data: company } = await supabase
    .from('companies')
    .select('google_workspace_domain')
    .eq('id', companyId)
    .single();
  
  const userDomain = googleUser.email.split('@')[1];
  if (userDomain !== company.google_workspace_domain) {
    throw new Error('User email domain does not match company workspace');
  }
  
  const { data: existingUser } = await supabase
    .from('user_profiles')
    .select('id, role')
    .eq('email', googleUser.email)
    .eq('company_id', companyId)
    .single();
  
  if (existingUser) {
    // Update existing user info
    await supabase
      .from('user_profiles')
      .update({
        google_workspace_id: googleUser.id,
        profile_picture: googleUser.picture,
        last_sync: new Date().toISOString(),
        full_name: googleUser.name
      })
      .eq('id', existingUser.id);
  } else {
    // Create new user with default role
    await supabase
      .from('user_profiles')
      .insert({
        company_id: companyId,
        email: googleUser.email,
        full_name: googleUser.name,
        google_workspace_id: googleUser.id,
        role: 'EMPLOYEE', // Default role for new workspace users
        profile_picture: googleUser.picture,
        is_active: true
      });
  }
};

// ✅ REQUIRED: Get user Google authentication
export const getUserGoogleAuth = async (userId: string, companyId: string) => {
  const { data: token } = await supabase
    .from('google_workspace_tokens')
    .select('*')
    .eq('user_id', userId)
    .eq('company_id', companyId)
    .single();
  
  if (!token) {
    throw new Error('User not authenticated with Google Workspace');
  }
  
  const { data: company } = await supabase
    .from('companies')
    .select('google_client_id')
    .eq('id', companyId)
    .single();
  
  const oauth2Client = new google.auth.OAuth2(
    company.google_client_id,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  
  oauth2Client.setCredentials({
    access_token: token.access_token,
    refresh_token: token.refresh_token,
    expiry_date: new Date(token.expires_at).getTime(),
    token_type: token.token_type,
    scope: token.scope
  });
  
  return oauth2Client;
};
```

## GOOGLE WORKSPACE PERMISSIONS
```typescript
// ✅ REQUIRED: Validate Google Workspace access
export const validateGoogleWorkspaceAccess = async (
  userId: string, 
  companyId: string, 
  googleWorkspaceId: string
) => {
  const { data: company } = await supabase
    .from('companies')
    .select('google_workspace_domain')
    .eq('id', companyId)
    .single();
    
  const { data: user } = await supabase
    .from('user_profiles')
    .select('email, company_id, google_workspace_id')
    .eq('id', userId)
    .single();
    
  if (user?.company_id !== companyId) {
    throw new UnauthorizedError('User not in company');
  }
  
  if (!user.email.endsWith(`@${company.google_workspace_domain}`)) {
    throw new UnauthorizedError('Email not in company workspace domain');
  }
  
  if (user.google_workspace_id !== googleWorkspaceId) {
    throw new UnauthorizedError('Google Workspace ID mismatch');
  }
  
  return true;
};
```

**Google Workspace Success Criteria**: Domain-restricted authentication, seamless document integration, team collaboration.
