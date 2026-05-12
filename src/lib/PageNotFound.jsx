import { Link, useLocation } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export default function PageNotFound() {
  const location = useLocation()
  const pageName = location.pathname === '/' ? 'home' : location.pathname

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1E5EFF]">404</p>
        <h1 className="mt-4 text-4xl font-semibold text-slate-900 dark:text-white">Page not found</h1>
        <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
          The route <span className="font-semibold text-slate-900 dark:text-white">{pageName}</span> does not exist in this SkinAid deployment.
        </p>
        <div className="mt-8 flex justify-center">
          <Button asChild className="bg-[#1E5EFF] text-white hover:bg-[#1a52e0]">
            <Link to="/">Return to home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}