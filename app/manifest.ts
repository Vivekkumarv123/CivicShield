import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CivicShield Indian Election Assistant',
    short_name: 'CivicShield',
    description: 'AI-powered education and fact-checking for Indian Elections',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      // You would typically include more icon sizes here for a real PWA
    ],
  }
}
