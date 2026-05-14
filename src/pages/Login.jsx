import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/auth'
import { upsertProfile } from '@/lib/db'
import { createPageUrl } from '@/utils'

const OAUTH_PENDING_STORAGE_KEY = 'skinaid-oauth-pending'
const POST_AUTH_PATH_STORAGE_KEY = 'skinaid-post-auth-path'

function getFriendlyAuthError(error) {
  const message = error?.message?.toLowerCase() ?? ''

  if (message.includes('invalid login credentials')) {
    return "That email or password doesn't match."
  }

  if (message.includes('email not confirmed')) {
    return 'Check your email and confirm your address first.'
  }

  if (message.includes('already registered')) {
    return 'That email already has an account.'
  }

  if (message.includes('password')) {
    return 'Use a stronger password.'
  }

  return 'We could not complete that request. Please try again.'
}

export default function Login() {
  const { loading, signIn, signInWithGoogle, signUp, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const [mode, setMode] = useState('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false)
  const [infoMessage, setInfoMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const redirectPath =
    location.state?.from?.pathname ||
    sessionStorage.getItem(POST_AUTH_PATH_STORAGE_KEY) ||
    createPageUrl('SkinCheck')

  async function syncProfile(nextUser, nextFullName = fullName) {
    if (!nextUser?.id) {
      return
    }

    const profileFullName = nextFullName || nextUser.user_metadata?.full_name || nextUser.user_metadata?.name || ''

    const { error: profileError } = await upsertProfile({
      userId: nextUser.id,
      fullName: profileFullName,
      email: nextUser.email || email,
    })

    if (profileError) {
      console.error('Profile upsert error:', profileError)
    }
  }

  useEffect(() => {
    let ignore = false

    async function handleAuthenticatedUser() {
      const oauthPending = sessionStorage.getItem(OAUTH_PENDING_STORAGE_KEY) === 'true'

      if (oauthPending) {
        await syncProfile(user)
      }

      if (ignore) {
        return
      }

      sessionStorage.removeItem(OAUTH_PENDING_STORAGE_KEY)
      sessionStorage.removeItem(POST_AUTH_PATH_STORAGE_KEY)
      navigate(redirectPath, { replace: true })
    }

    if (!loading && user) {
      handleAuthenticatedUser()
    }

    return () => {
      ignore = true
    }
  }, [loading, navigate, redirectPath, user])

  async function handleSubmit(event) {
    event.preventDefault()
    setErrorMessage('')
    setInfoMessage('')
    setIsSubmitting(true)

    try {
      if (mode === 'sign-up') {
        const { data, error } = await signUp(email, password)
        if (error) {
          throw error
        }

        if (data?.user) {
          await syncProfile(data.user, fullName)
        }

        if (data?.session) {
          sessionStorage.removeItem(OAUTH_PENDING_STORAGE_KEY)
          sessionStorage.removeItem(POST_AUTH_PATH_STORAGE_KEY)
          navigate(redirectPath, { replace: true })
          return
        }

        setInfoMessage('Account created. Check your email to confirm your address before signing in.')
        setMode('sign-in')
      } else {
        const { data, error } = await signIn(email, password)
        if (error) {
          throw error
        }

        if (data?.user) {
          await syncProfile(data.user)
        }

        sessionStorage.removeItem(OAUTH_PENDING_STORAGE_KEY)
        sessionStorage.removeItem(POST_AUTH_PATH_STORAGE_KEY)
        navigate(redirectPath, { replace: true })
      }
    } catch (error) {
      setErrorMessage(getFriendlyAuthError(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleGoogleSignIn() {
    setErrorMessage('')
    setInfoMessage('')
    setIsGoogleSubmitting(true)

    try {
      sessionStorage.setItem(OAUTH_PENDING_STORAGE_KEY, 'true')
      sessionStorage.setItem(POST_AUTH_PATH_STORAGE_KEY, redirectPath)

      const { error } = await signInWithGoogle(`${window.location.origin}${createPageUrl('Login')}`)
      if (error) {
        throw error
      }
    } catch (error) {
      sessionStorage.removeItem(OAUTH_PENDING_STORAGE_KEY)
      sessionStorage.removeItem(POST_AUTH_PATH_STORAGE_KEY)
      setErrorMessage(getFriendlyAuthError(error))
      setIsGoogleSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 dark:bg-slate-900">
      <div className="container mx-auto grid max-w-5xl gap-6 px-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-3xl bg-gradient-to-br from-[#1E5EFF] to-[#1CB5A3] p-8 text-white shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/80">Sign in</p>
          <h1 className="mt-4 text-4xl font-semibold">Save your checks and come back anytime</h1>
          <p className="mt-4 text-base leading-7 text-white/85">
            Your account keeps your past checks private and easy to find.
          </p>
          <div className="mt-8 space-y-3 text-sm text-white/90">
            <p>Save your past checks.</p>
            <p>Keep your photos private.</p>
            <p>Use email or Google to sign in fast.</p>
            <p>Your account helps keep results just for you.</p>
          </div>
          <div className="mt-10">
            <Link className="text-sm font-medium text-white underline underline-offset-4" to={createPageUrl('Home')}>
              Back home
            </Link>
          </div>
        </div>

        <Card className="rounded-3xl border-slate-200 shadow-sm dark:border-slate-800">
          <CardHeader>
            <div className="inline-flex rounded-xl border border-slate-200 p-1 dark:border-slate-800">
              <button
                type="button"
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  mode === 'sign-in'
                    ? 'bg-[#1E5EFF] text-white'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
                onClick={() => {
                  setMode('sign-in')
                  setErrorMessage('')
                  setInfoMessage('')
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  mode === 'sign-up'
                    ? 'bg-[#1E5EFF] text-white'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
                onClick={() => {
                  setMode('sign-up')
                  setErrorMessage('')
                  setInfoMessage('')
                }}
              >
                Create Account
              </button>
            </div>
            <CardTitle className="text-3xl text-slate-900 dark:text-white">
              {mode === 'sign-in' ? 'Welcome back' : 'Create your account'}
            </CardTitle>
            <CardDescription className="text-base leading-7 text-slate-600 dark:text-slate-300">
              {mode === 'sign-in'
                ? 'Sign in to run a check and see saved results.'
                : 'Create an account to save checks and pick up where you left off.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {errorMessage ? (
              <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-700">
                <AlertTitle>Sign-in didn't work</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            ) : null}

            {infoMessage ? (
              <Alert className="border-emerald-200 bg-emerald-50 text-emerald-700">
                <AlertTitle>Check your inbox</AlertTitle>
                <AlertDescription>{infoMessage}</AlertDescription>
              </Alert>
            ) : null}

            <Button
              type="button"
              variant="outline"
              className="w-full border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
              disabled={isGoogleSubmitting || isSubmitting}
              onClick={handleGoogleSignIn}
            >
              <svg aria-hidden="true" className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M21.805 10.023H12.25v3.954h5.47c-.236 1.272-.944 2.352-2.01 3.075v2.56h3.253c1.904-1.753 2.842-4.334 2.842-7.39 0-.73-.065-1.43-.185-2.199Z"
                  fill="#4285F4"
                />
                <path
                  d="M12.25 22c2.585 0 4.75-.857 6.333-2.323l-3.253-2.56c-.903.606-2.058.964-3.08.964-2.367 0-4.372-1.598-5.09-3.748H3.804v2.64A9.75 9.75 0 0 0 12.25 22Z"
                  fill="#34A853"
                />
                <path
                  d="M7.16 14.333A5.844 5.844 0 0 1 6.875 12c0-.81.14-1.593.286-2.333V7.027H3.804A9.75 9.75 0 0 0 2.75 12c0 1.563.372 3.043 1.054 4.973l3.356-2.64Z"
                  fill="#FBBC05"
                />
                <path
                  d="M12.25 5.919c1.406 0 2.67.484 3.665 1.437l2.75-2.75C16.995 3.061 14.83 2 12.25 2a9.75 9.75 0 0 0-8.446 5.027l3.357 2.64c.713-2.15 2.718-3.748 5.089-3.748Z"
                  fill="#EA4335"
                />
              </svg>
              {isGoogleSubmitting ? 'Redirecting to Google...' : 'Continue with Google'}
            </Button>

            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500">
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              or use email
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {mode === 'sign-up' ? (
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full name</Label>
                  <Input
                    id="full-name"
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="Jane Doe"
                  />
                </div>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#1E5EFF] text-white hover:bg-[#1a52e0]"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? mode === 'sign-in'
                    ? 'Signing in...'
                    : 'Creating account...'
                  : mode === 'sign-in'
                    ? 'Sign In'
                    : 'Create Account'}
              </Button>
            </form>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              By continuing, you agree to use SkinAid as a guide, not medical advice.
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              We only use your sign-in to protect your private checks.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}