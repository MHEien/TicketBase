/// <reference types="vite/client" />
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import * as React from 'react'
import type { QueryClient } from '@tanstack/react-query'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { NotFound } from '~/components/NotFound'
import { OrganizationProvider } from '~/contexts/OrganizationContext'
import { PluginProvider } from '~/contexts/PluginContext'
import { CartProvider } from '~/contexts/CartContext'
import { Header } from '~/components/Header'
import { Footer } from '~/components/Footer'
import { OrganizationBranding, DomainDebugInfo } from '~/components/domain/DomainProvider'
import appCss from '~/styles/app.css?url'
import { seo } from '~/utils/seo'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      ...seo({
        title: 'Events Platform | Discover and Book Amazing Events',
        description: 'Discover and book tickets for amazing events near you. From concerts to conferences, find your next unforgettable experience.',
      }),
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <OrganizationProvider>
          <DefaultCatchBoundary {...props} />
        </OrganizationProvider>
      </RootDocument>
    )
  },
  notFoundComponent: () => (
    <OrganizationProvider>
      <NotFound />
    </OrganizationProvider>
  ),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <OrganizationProvider>
        <PluginProvider>
          <CartProvider>
            <OrganizationBranding />
            <Header />
            <main className="flex-1">
              <Outlet />
            </main>
            <Footer />
            <DomainDebugInfo />
          </CartProvider>
        </PluginProvider>
      </OrganizationProvider>
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-gray-50 flex flex-col">
        {children}
        {typeof window !== 'undefined' && (
          <>
            <TanStackRouterDevtools position="bottom-right" />
            <ReactQueryDevtools buttonPosition="bottom-left" />
          </>
        )}
        <Scripts />
      </body>
    </html>
  )
}
