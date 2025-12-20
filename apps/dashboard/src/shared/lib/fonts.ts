import { 
  Inter, 
  Noto_Sans, 
  Nunito_Sans, 
  Figtree,
  Roboto,
  Poppins,
  Montserrat,
  PT_Sans
} from 'next/font/google';

/**
 * Fuentes cargadas con next/font/google para optimización automática
 * Estas fuentes se cargan solo cuando se usan (lazy loading)
 */

export const fontInter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const fontNotoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans',
  display: 'swap',
});

export const fontNunitoSans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-nunito-sans',
  display: 'swap',
});

export const fontFigtree = Figtree({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-figtree',
  display: 'swap',
});

export const fontRoboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

export const fontPoppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const fontMontserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const fontPTSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
  display: 'swap',
});

/**
 * Mapa de todas las fuentes disponibles
 * Se usa para aplicar la fuente correcta según la selección del usuario
 */
export const fontVariables = {
  inter: fontInter.variable,
  'noto-sans': fontNotoSans.variable,
  'nunito-sans': fontNunitoSans.variable,
  figtree: fontFigtree.variable,
  roboto: fontRoboto.variable,
  poppins: fontPoppins.variable,
  montserrat: fontMontserrat.variable,
  'pt-sans': fontPTSans.variable,
} as const;

/**
 * Clase CSS que incluye todas las variables de fuentes
 * Se aplica al body/html para que todas las fuentes estén disponibles
 */
export const fontVariablesClass = Object.values(fontVariables).join(' ');






