import { HeadContent, Scripts, Outlet, createRootRoute } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { queryClient } from '@/lib/query'
import { NotFoundPage } from '@/components/error'
import appCss from '@/styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Invoicing - Invoice Management Made Simple' },
      {
        name: 'description',
        content:
          'Create professional invoices, track payments, and get paid faster with a simple invoicing platform.',
      },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  component: RootDocument,
  notFoundComponent: NotFoundPage,
})

function RootDocument() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <Outlet />
          <Toaster richColors position="top-right" />
          <Scripts />
        </QueryClientProvider>
      </body>
    </html>
  )
}
