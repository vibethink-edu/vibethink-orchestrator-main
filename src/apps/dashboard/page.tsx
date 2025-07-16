import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect directo al dashboard - VThink 1.0 Standard
  redirect('/dashboard');
} 