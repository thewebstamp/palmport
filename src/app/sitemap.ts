import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://palmport.vercel.app'
  
  // Static pages
  const staticRoutes = [
    '',
    '/shop',
    '/contact',
    '/orders',
    '/cart',
    '/checkout',
    '/payment/success',
    '/auth/login',
    '/auth/register',
    '/tracepage'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Fetch actual batches from your API for dynamic trace pages
  const urlApi = process.env.NEXT_PUBLIC_API_URL || 'https://palmport-server-m116.vercel.app'
  let batchRoutes = []
  try {
    const response = await fetch(`${urlApi}/api/batches`, {
      next: { revalidate: 3600 }
    })
    
    if (response.ok) {
      const batches = await response.json()
      
      batchRoutes = batches.map((batch: any) => ({
        url: `${baseUrl}/trace/${batch.batch_id}`,
        lastModified: new Date(batch.created_at || Date.now()),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))

      console.log(`Added ${batches.length} batch pages to sitemap`)
    } else {
      console.error('Failed to fetch batches:', response.status)
    }
  } catch (error) {
    console.error('Failed to fetch batches for sitemap:', error)
  }

  return [...staticRoutes, ...batchRoutes]
}