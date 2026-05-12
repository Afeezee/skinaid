import { LoaderCircle } from 'lucide-react'

export default function LoadingSpinner({ message = 'Loading...', fullScreen = false }) {
  const wrapperClassName = fullScreen
    ? 'flex min-h-screen items-center justify-center px-4'
    : 'flex justify-center py-8'

  return (
    <div className={wrapperClassName}>
      <div className="flex min-w-[240px] flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 px-6 py-5 text-center shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <LoaderCircle className="h-8 w-8 animate-spin text-[#1E5EFF]" />
        <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p>
      </div>
    </div>
  )
}