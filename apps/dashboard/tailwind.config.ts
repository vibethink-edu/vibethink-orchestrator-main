// Tailwind v4 Configuration
// Matches globals.css @import "tailwindcss" syntax
// NO plugins needed - handled by @plugin directives in CSS

import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class', // Critical: Enable dark mode with class strategy
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../src/shared/components/bundui-premium/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}", // Include new UI package
  ],
}

export default config 