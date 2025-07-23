import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Button } from '@repo/ui/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/ui/card'
import { Badge } from '@repo/ui/components/ui/badge'
import { Plus, Edit, Eye, Trash2, Copy, Globe } from 'lucide-react'
import { pagesApi } from '@/lib/api/pages'

export const Route = createFileRoute('/admin/pages/')({
  component: PagesIndex,
})

interface Page {
  id: string
  title: string
  slug: string
  status: 'draft' | 'published' | 'archived'
  isHomepage: boolean
  metaTitle?: string
  metaDescription?: string
  createdAt: string
  updatedAt: string
}

function PagesIndex() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPages()
  }, [])

  const loadPages = async () => {
    try {
      const response = await pagesApi.getPages()
      setPages(response.data)
    } catch (error) {
      console.error('Failed to load pages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return
    
    try {
      await pagesApi.deletePage(id)
      await loadPages()
    } catch (error) {
      console.error('Failed to delete page:', error)
    }
  }

  const handleDuplicate = async (id: string) => {
    try {
      await pagesApi.duplicatePage(id)
      await loadPages()
    } catch (error) {
      console.error('Failed to duplicate page:', error)
    }
  }

  const handlePublish = async (id: string) => {
    try {
      await pagesApi.publishPage(id)
      await loadPages()
    } catch (error) {
      console.error('Failed to publish page:', error)
    }
  }

  const handleUnpublish = async (id: string) => {
    try {
      await pagesApi.unpublishPage(id)
      await loadPages()
    } catch (error) {
      console.error('Failed to unpublish page:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading pages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Storefront Pages</h1>
          <p className="text-muted-foreground">
            Manage your storefront pages with the visual page builder
          </p>
        </div>
        <Link to="/admin/pages/editor/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Page
          </Button>
        </Link>
      </div>

      {/* Pages Grid */}
      {pages.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Globe className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No pages yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Create your first storefront page using our visual page builder. 
              Build engaging layouts with events, carousels, and more.
            </p>
            <Link to="/admin/pages/editor/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Page
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => (
            <Card key={page.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{page.title}</CardTitle>
                    <CardDescription className="mt-1">
                      /{page.slug}
                      {page.isHomepage && (
                        <Badge variant="secondary" className="ml-2">
                          Homepage
                        </Badge>
                      )}
                    </CardDescription>
                  </div>
                  <Badge 
                    variant={
                      page.status === 'published' ? 'default' : 
                      page.status === 'draft' ? 'secondary' : 'outline'
                    }
                  >
                    {page.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Meta Info */}
                  {page.metaDescription && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {page.metaDescription}
                    </p>
                  )}
                  
                  {/* Timestamps */}
                  <div className="text-xs text-muted-foreground">
                    <p>Created: {new Date(page.createdAt).toLocaleDateString()}</p>
                    <p>Updated: {new Date(page.updatedAt).toLocaleDateString()}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <Link to={`/admin/pages/editor/${page.id}`}>
                        <Button size="sm" variant="outline">
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(`/pages/${page.slug}`, '_blank')}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Preview
                      </Button>
                    </div>

                    <div className="flex items-center space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDuplicate(page.id)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      
                      {page.status === 'published' ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleUnpublish(page.id)}
                        >
                          Unpublish
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handlePublish(page.id)}
                        >
                          Publish
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(page.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
