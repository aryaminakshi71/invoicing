import { HeadContent, Scripts, Link } from '@tanstack/react-router'

export function NotFoundPage() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
            <h2 className="text-xl font-semibold text-foreground mb-4">Page Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The page you are looking for does not exist or has been moved.
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  )
}
