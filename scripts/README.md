# Development Scripts - VibeThink Orchestrator

> **Purpose:** Bulletproof PowerShell scripts for starting/stopping dev servers  
> **Platform:** Windows (PowerShell 5.1+)  
> **Maintainer:** VibeThink Engineering Team

---

## 📋 Available Scripts

### Admin Console

#### `start-admin.ps1`
**Purpose:** Start the Admin Console dev server  
**Port:** 3002  
**Usage:**
```powershell
.\scripts\start-admin.ps1
```

**Features:**
- ✅ Detects port conflicts (EADDRINUSE)
- ✅ Handles TIME_WAIT connections gracefully
- ✅ Validates `.env.local` exists (critical for Admin)
- ✅ Validates `apps/admin` directory exists
- ✅ Security warning (internal tool reminder)

**Example Output:**
```
🔐 Starting ViTo Admin Console (Internal Staff Only)...
⚠️  SECURITY: This is an internal tool. Never expose to public internet.
Starting Admin Console on port 3002...
   ▲ Next.js 15.3.4
   - Local:        http://localhost:3002
```

---

#### `stop-admin.ps1`
**Purpose:** Stop the Admin Console dev server  
**Usage:**
```powershell
.\scripts\stop-admin.ps1
```

**Features:**
- ✅ Finds all processes using port 3002
- ✅ Gracefully terminates processes
- ✅ Handles zombie processes (TIME_WAIT)
- ✅ Waits for port to be released
- ✅ Verifies port is free after shutdown

**Example Output:**
```
🛑 Stopping ViTo Admin Console...
Stopping node (PID: 12345)...
✅ Stopped node
✅ Port 3002 is now free
```

---

### Client Dashboard

#### `start-dashboard.ps1`
**Purpose:** Start the Client Dashboard dev server  
**Port:** 3005  
**Usage:**
```powershell
.\scripts\start-dashboard.ps1
```

**Features:**
- ✅ Detects port conflicts (EADDRINUSE)
- ✅ Handles TIME_WAIT connections gracefully
- ✅ Validates `apps/dashboard` directory exists
- ✅ Uses `pnpm run dev` (monorepo-aware)

**Example Output:**
```
🚀 Starting ViTo Dashboard (VibeThink Orchestrator)...
Starting Next.js dev server on port 3005...
   ▲ Next.js 15.3.4
   - Local:        http://localhost:3005
```

---

#### `stop-dashboard.ps1`
**Purpose:** Stop the Client Dashboard dev server  
**Usage:**
```powershell
.\scripts\stop-dashboard.ps1
```

*(Same features as `stop-admin.ps1` but for port 3005)*

---

## 🛠️ Technical Details

### Port Conflict Detection

All scripts use this robust pattern:

```powershell
# Get connections on port
$connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue

# Filter out system processes (Idle = 0)
$uniqueProcessIds = $connections | 
    Select-Object -ExpandProperty OwningProcess -Unique | 
    Where-Object { $_ -gt 0 }

# Validate processes still exist (not TIME_WAIT)
foreach ($processId in $uniqueProcessIds) {
    try {
        $proc = Get-Process -Id $processId -ErrorAction Stop
        # Process exists, port is truly in use
    }
    catch {
        # Process doesn't exist, connection is TIME_WAIT
    }
}
```

### TIME_WAIT Handling

When a port has TIME_WAIT connections (process already exited but OS hasn't released port):

1. Script detects no valid process owns the port
2. Waits 3 seconds for OS to release
3. Re-checks port status
4. Proceeds if clear, errors if still blocked

**Why 3 seconds?** Windows TCP TIME_WAIT is typically 30-120 seconds, but most connections clear within 3s after process exit.

---

## 🚨 Common Issues & Solutions

### Issue: "Port already in use"

**Cause:** Previous dev server didn't terminate cleanly

**Solution:**
```powershell
# Run the stop script first
.\scripts\stop-admin.ps1

# Then start again
.\scripts\start-admin.ps1
```

---

### Issue: "Admin directory not found"

**Cause:** Running script from wrong directory

**Solution:**
```powershell
# Always run from project root
cd C:\IA Marcelo Labs\vibethink-orchestrator-main
.\scripts\start-admin.ps1
```

---

### Issue: ".env.local not found" (Admin only)

**Cause:** Environment file not configured

**Solution:**
```powershell
# Copy example file
cp apps\admin\.env.local.example apps\admin\.env.local

# Edit with real Supabase credentials
notepad apps\admin\.env.local
```

---

### Issue: "Access is denied" when stopping

**Cause:** Process is owned by another user or system

**Solution:**
```powershell
# Run PowerShell as Administrator
# Right-click PowerShell → "Run as Administrator"
.\scripts\stop-admin.ps1
```

---

## 📊 Port Allocation

| Application | Port | Script | URL |
|-------------|------|--------|-----|
| Admin Console | 3002 | `start-admin.ps1` | `http://localhost:3002` |
| Client Dashboard | 3005 | `start-dashboard.ps1` | `http://localhost:3005` |
| API Server | 3000 | *(manual)* | `http://localhost:3000` |
| Docs (Astro) | 4321 | *(Astro CLI)* | `http://localhost:4321` |

**Why these ports?**
- **3002:** Admin (low number, critical infrastructure)
- **3005:** Dashboard (higher number, client-facing)
- **3000:** API (Next.js default, kept for compatibility)

---

## 🔧 Customization

### Changing Default Port

Edit the script and modify this line:

```powershell
# In start-admin.ps1
$port = 3002  # Change to desired port
```

Then update the corresponding stop script:

```powershell
# In stop-admin.ps1
$port = 3002  # Must match start script
```

### Adding New Application

1. Copy `start-admin.ps1` to `start-[app].ps1`
2. Update these variables:
   ```powershell
   $port = 3XXX
   $appPath = Join-Path $projectRoot "apps\[app]"
   ```
3. Update the start command:
   ```powershell
   npx next dev --port $port
   # or
   pnpm run dev -- -p $port
   ```

---

## 🧪 Testing Scripts

To test if a script works correctly:

```powershell
# Test start script
.\scripts\start-admin.ps1
# Should start server without errors

# In another terminal, test stop script
.\scripts\stop-admin.ps1
# Should gracefully shutdown

# Verify port is free
Get-NetTCPConnection -LocalPort 3002
# Should return "No MSFT_NetTCPConnection objects found"
```

---

## 📚 Related Documentation

- `apps/admin/TROUBLESHOOTING.md` - Port conflict solutions
- `apps/admin/.env.local.example` - Environment setup
- `README.md` - Project overview

---

## 🔄 Maintenance

**Review Frequency:** Quarterly or when adding new applications

**Update Checklist:**
- [ ] Port allocation table is current
- [ ] All scripts tested on Windows 10/11
- [ ] Error messages are clear and actionable
- [ ] New applications have corresponding scripts

---

**Last Updated:** 2026-01-10  
**Script Version:** 1.0  
**PowerShell Version Required:** 5.1+
