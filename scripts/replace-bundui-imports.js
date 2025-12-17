#!/usr/bin/env node

/**
 * Script para reemplazar imports de bundui-ui con @vibethink/ui
 * 
 * Usage:
 *   node scripts/replace-bundui-imports.js
 */

const fs = require('fs').promises
const path = require('path')
const { execSync } = require('child_process')

// Mapeo de componentes
const COMPONENT_MAP = {
  'accordion': 'Accordion, AccordionItem, AccordionTrigger, AccordionContent',
  'alert': 'Alert, AlertTitle, AlertDescription',
  'alert-dialog': 'AlertDialog, AlertDialogPortal, AlertDialogOverlay, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel',
  'chart': 'ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle, useChart',
  'sonner': 'Toaster',
  'avatar': 'Avatar, AvatarFallback, AvatarImage',
  'badge': 'Badge',
  'button': 'Button',
  'calendar': 'Calendar',
  'card': 'Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter',
  'checkbox': 'Checkbox',
  'collapsible': 'Collapsible, CollapsibleTrigger, CollapsibleContent',
  'command': 'Command, CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut, CommandSeparator',
  'dialog': 'Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose',
  'dropdown-menu': 'DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuRadioGroup, DropdownMenuGroup, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuShortcut',
  'form': 'Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField',
  'input': 'Input',
  'label': 'Label',
  'popover': 'Popover, PopoverTrigger, PopoverContent, PopoverAnchor',
  'progress': 'Progress',
  'radio-group': 'RadioGroup, RadioGroupItem',
  'scroll-area': 'ScrollArea, ScrollBar',
  'select': 'Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectLabel, SelectItem, SelectSeparator, SelectScrollUpButton, SelectScrollDownButton',
  'separator': 'Separator',
  'sheet': 'Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetTrigger, SheetClose',
  'sidebar': 'Sidebar, SidebarProvider, SidebarInset, SidebarTrigger, SidebarContent, SidebarHeader, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuBadge, SidebarMenuAction, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarSeparator, SidebarRail, useSidebar',
  'skeleton': 'Skeleton',
  'slider': 'Slider',
  'switch': 'Switch',
  'table': 'Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption',
  'tabs': 'Tabs, TabsList, TabsTrigger, TabsContent',
  'textarea': 'Textarea',
  'tooltip': 'Tooltip, TooltipTrigger, TooltipContent, TooltipProvider',
}

// Directorios a procesar
const TARGET_DIRS = [
  path.join(__dirname, '../apps/dashboard'),
]

async function replaceImportsInFile(filePath) {
  try {
    let content = await fs.readFile(filePath, 'utf-8')
    let modified = false

    // Reemplazar imports de bundui-ui
    for (const [component, exports] of Object.entries(COMPONENT_MAP)) {
      const oldPattern = new RegExp(
        `from ["']@vibethink/bundui-ui/components/ui/${component}["']`,
        'g'
      )
      
      if (oldPattern.test(content)) {
        // Extraer los componentes importados
        const importMatch = content.match(
          new RegExp(`import\\s*\\{([^}]+)\\}\\s*from\\s*["']@vibethink/bundui-ui/components/ui/${component}["']`, 'g')
        )
        
        if (importMatch) {
          importMatch.forEach(match => {
            const components = match.match(/\{([^}]+)\}/)[1]
            const newImport = `import { ${components.trim()} } from '@vibethink/ui'`
            content = content.replace(match, newImport)
            modified = true
          })
        }
      }
    }

    // Reemplazar imports de hooks
    content = content.replace(
      /from ["']@vibethink\/bundui-ui\/hooks\/([^"']+)["']/g,
      (match, hook) => {
        // Por ahora, los hooks pueden necesitar ser migrados manualmente
        console.log(`⚠️  Hook ${hook} necesita migración manual en: ${filePath}`)
        return match
      }
    )

    if (modified) {
      await fs.writeFile(filePath, content, 'utf-8')
      return true
    }
    return false
  } catch (error) {
    console.error(`Error procesando ${filePath}:`, error.message)
    return false
  }
}

async function processDirectory(dir) {
  const files = []
  
  async function walkDir(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name)
      
      // Ignorar node_modules, .next, dist, etc.
      if (entry.name.startsWith('.') || 
          entry.name === 'node_modules' || 
          entry.name === '.next' || 
          entry.name === 'dist') {
        continue
      }
      
      if (entry.isDirectory()) {
        await walkDir(fullPath)
      } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
        files.push(fullPath)
      }
    }
  }
  
  await walkDir(dir)
  return files
}

async function main() {
  console.log('🔄 Reemplazando imports de bundui-ui con @vibethink/ui...\n')
  
  let totalFiles = 0
  let modifiedFiles = 0
  
  for (const dir of TARGET_DIRS) {
    console.log(`📁 Procesando: ${dir}`)
    const files = await processDirectory(dir)
    totalFiles += files.length
    
    for (const file of files) {
      const modified = await replaceImportsInFile(file)
      if (modified) {
        modifiedFiles++
        console.log(`  ✅ ${path.relative(dir, file)}`)
      }
    }
  }
  
  console.log(`\n📊 Resumen:`)
  console.log(`   Total archivos: ${totalFiles}`)
  console.log(`   Archivos modificados: ${modifiedFiles}`)
  console.log(`\n💡 Próximos pasos:`)
  console.log(`   1. Revisar cambios: git diff`)
  console.log(`   2. Verificar que compile: npm run build:dashboard`)
  console.log(`   3. Probar en desarrollo: npm run dev:dashboard`)
}

main().catch(console.error)

