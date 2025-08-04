/**
 * Landing Page - VibeThink Orchestrator
 * Inspired by Zeytal's minimalist design excellence
 * Desarrollada siguiendo metodología VThink 1.0 con calidad GOLD STANDARD
 */

'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  ArrowRight, 
  BarChart3, 
  Shield, 
  Zap, 
  Users, 
  Globe,
  CheckCircle,
  Star,
  TrendingUp,
  Database,
  Layers,
  Play,
  Sparkles,
  Moon,
  Sun
} from 'lucide-react'

export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const isDark = localStorage.getItem('darkMode') === 'true'
    setDarkMode(isDark)
    if (isDark) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', newDarkMode.toString())
    document.documentElement.classList.toggle('dark', newDarkMode)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Navigation - Zeytal Style */}
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                <span className="text-sm font-bold">VT</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                  VibeThink Orchestrator
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {darkMode ? (
                  <Sun className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                ) : (
                  <Moon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                )}
              </button>
              
              <Link 
                href="http://localhost:3001" 
                className="inline-flex items-center px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-all font-medium text-sm"
              >
                Dashboard Live
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Zeytal Inspired */}
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 dark:from-blue-950/20 dark:via-transparent dark:to-purple-950/20"></div>
        
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-sm border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full">
              <Sparkles className="h-4 w-4" />
              <span>16+ Dashboards Multi-tenant en una plataforma</span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
              From enterprise chaos
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                to unified control
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              VibeThink Orchestrator transforms complex business operations into a 
              <span className="font-semibold text-slate-900 dark:text-white"> single, powerful dashboard ecosystem</span>. 
              Built with methodology VThink 1.0.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link 
                href="http://localhost:3001"
                className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Play className="h-5 w-5" />
                Experience Live Dashboard
              </Link>
              
              <button className="inline-flex items-center gap-3 px-8 py-4 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-semibold text-lg">
                Interactive Tour
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
            
            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live production system</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>CMMI-ML3 compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>&lt;500ms load time</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid - Zeytal Style */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              Everything you need
              <br />
              <span className="text-slate-600 dark:text-slate-400">in one unified platform</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              From chaos to control in three simple steps
            </p>
          </div>
          
          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
            {/* Large Feature - Dashboard Hub */}
            <div className="md:col-span-2 lg:col-span-2 p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-700">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    16+ Specialized Dashboards
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    Analytics, CRM, Finance, Crypto, E-commerce, Project Management, and more. 
                    Each optimized for maximum productivity.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded">
                      Analytics
                    </span>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded">
                      CRM
                    </span>
                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs rounded">
                      Finance
                    </span>
                    <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 text-xs rounded">
                      +13 more
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Security */}
            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-2xl border border-green-200 dark:border-green-800">
              <Shield className="h-8 w-8 text-green-600 mb-4" />
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                Multi-tenant Security
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Complete company isolation with 5-tier role system
              </p>
            </div>
            
            {/* Performance */}
            <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 rounded-2xl border border-yellow-200 dark:border-yellow-800">
              <Zap className="h-8 w-8 text-yellow-600 mb-4" />
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                Lightning Fast
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                &lt;500ms load time, optimized React 19 + Next.js 15
              </p>
            </div>
            
            {/* Integration */}
            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-2xl border border-purple-200 dark:border-purple-800">
              <Database className="h-8 w-8 text-purple-600 mb-4" />
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                Full Integration
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Supabase, TypeScript, TailwindCSS ready
              </p>
            </div>
            
            {/* Methodology */}
            <div className="md:col-span-2 p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-3">
                <Layers className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                <h3 className="font-bold text-slate-900 dark:text-white">
                  VThink 1.0 Methodology
                </h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                CMMI-ML3 compliant development with 100+ validation scripts ensuring enterprise quality
              </p>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-xs text-slate-600 dark:text-slate-400">CMMI-ML3 Certified</span>
              </div>
            </div>
            
            {/* Responsive */}
            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-2xl border border-blue-200 dark:border-blue-800">
              <Globe className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                Responsive
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Mobile-first design, perfect on any device
              </p>
            </div>
          </div>
          
          {/* Simple 3-step process */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-lg font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Access Dashboard</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Open localhost:3001 and explore 16+ specialized dashboards
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-lg font-bold text-green-600">2</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Configure Setup</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Set up your company profile and multi-tenant security
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-lg font-bold text-purple-600">3</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Start Managing</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Transform your business operations with unified control
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Dashboard Showcase */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              See it in action
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Our dashboard ecosystem has achieved GOLD STANDARD status. 
              Experience perfection in design and functionality.
            </p>
          </div>
          
          <div className="relative">
            {/* Dashboard Preview Card */}
            <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
              {/* Browser mockup header */}
              <div className="flex items-center gap-2 px-6 py-4 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-white dark:bg-slate-900 rounded px-3 py-1 text-sm text-slate-600 dark:text-slate-400">
                    http://localhost:3001
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-slate-600 dark:text-slate-400">Live</span>
                </div>
              </div>
              
              {/* Dashboard content preview */}
              <div className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">16+</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Dashboards</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">&lt;500ms</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Load Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">100%</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Secure</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">CMMI-ML3</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Quality</div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="http://localhost:3001"
                    className="flex-1 inline-flex items-center justify-center gap-3 px-6 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all font-semibold"
                  >
                    <Play className="h-5 w-5" />
                    Open Live Dashboard
                  </Link>
                  
                  <button className="flex-1 inline-flex items-center justify-center gap-3 px-6 py-4 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-semibold">
                    <TrendingUp className="h-5 w-5" />
                    View All Features
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Final CTA - Zeytal Style */}
      <section className="py-32 bg-slate-900 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-6">
            Ready to orchestrate
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              your enterprise?
            </span>
          </h2>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Join companies already using VibeThink Orchestrator to manage 
            operations with enterprise-grade quality and security.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="http://localhost:3001"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-xl hover:bg-slate-100 transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Play className="h-5 w-5" />
              Start with Live Dashboard
            </Link>
            
            <button className="inline-flex items-center gap-3 px-8 py-4 border-2 border-slate-700 text-white rounded-xl hover:bg-slate-800 transition-all font-semibold text-lg">
              Talk to Sales
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex items-center justify-center gap-8 mt-12 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>No setup required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Instant access</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span>Enterprise ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="bg-slate-950 dark:bg-black border-t border-slate-800 dark:border-slate-900">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                <span className="text-sm font-bold">VT</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">VibeThink Orchestrator</h3>
                <p className="text-sm text-slate-400">Built with VThink 1.0 methodology</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 text-sm text-slate-400">
              <Link href="http://localhost:3001" className="hover:text-white transition-colors">
                Dashboard
              </Link>
              <a href="#" className="hover:text-white transition-colors">
                Documentation
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Support
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-slate-500">
            <p>© 2025 VibeThink Orchestrator. All rights reserved.</p>
            <p>Enterprise-grade SaaS platform</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Add dark mode styles to globals.css or tailwind config
// This ensures proper dark mode support