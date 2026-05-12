import React, { createContext, useContext, useEffect, useState } from 'react'

import { supabase } from './supabase'

const AuthContext = createContext(undefined)

export async function signUp(email, password) {
  return supabase.auth.signUp({ email, password })
}

export async function signIn(email, password) {
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signInWithGoogle(redirectTo) {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      scopes: 'email profile',
    },
  })
}

export async function signOut() {
  return supabase.auth.signOut()
}

export async function getUser() {
  return supabase.auth.getUser()
}

export async function getSession() {
  return supabase.auth.getSession()
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadUser() {
      const { data, error } = await getUser()
      if (!isMounted) {
        return
      }

      setUser(error ? null : data?.user ?? null)
      setLoading(false)
    }

    loadUser()

    const { data: authListener } = onAuthStateChange((_event, session) => {
      if (!isMounted) {
        return
      }

      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      isMounted = false
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  return React.createElement(
    AuthContext.Provider,
    { value: { user, loading, signIn, signInWithGoogle, signUp, signOut } },
    children,
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}