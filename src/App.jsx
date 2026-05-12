import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'

import AuthGuard from '@/components/AuthGuard'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Toaster } from '@/components/ui/toaster'
import Layout from '@/Layout'
import { AuthProvider } from '@/lib/auth'

const PageNotFound = lazy(() => import('@/lib/PageNotFound'))
const About = lazy(() => import('@/pages/About'))
const History = lazy(() => import('@/pages/History'))
const Home = lazy(() => import('@/pages/Home'))
const Login = lazy(() => import('@/pages/Login'))
const Privacy = lazy(() => import('@/pages/Privacy'))
const SkinCheck = lazy(() => import('@/pages/SkinCheck'))

function PageFrame({ children, currentPageName }) {
  return <Layout currentPageName={currentPageName}>{children}</Layout>
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<LoadingSpinner fullScreen message="Loading page..." />}>
          <Routes>
            <Route
              path="/"
              element={
                <PageFrame currentPageName="Home">
                  <Home />
                </PageFrame>
              }
            />
            <Route
              path="/about"
              element={
                <PageFrame currentPageName="About">
                  <About />
                </PageFrame>
              }
            />
            <Route
              path="/privacy"
              element={
                <PageFrame currentPageName="Privacy">
                  <Privacy />
                </PageFrame>
              }
            />
            <Route
              path="/login"
              element={
                <PageFrame currentPageName="Login">
                  <Login />
                </PageFrame>
              }
            />
            <Route
              path="/skin-check"
              element={
                <PageFrame currentPageName="SkinCheck">
                  <AuthGuard>
                    <SkinCheck />
                  </AuthGuard>
                </PageFrame>
              }
            />
            <Route
              path="/history"
              element={
                <PageFrame currentPageName="History">
                  <AuthGuard>
                    <History />
                  </AuthGuard>
                </PageFrame>
              }
            />

            <Route path="/Home" element={<Navigate to="/" replace />} />
            <Route path="/About" element={<Navigate to="/about" replace />} />
            <Route path="/Privacy" element={<Navigate to="/privacy" replace />} />
            <Route path="/SkinCheck" element={<Navigate to="/skin-check" replace />} />
            <Route path="/History" element={<Navigate to="/history" replace />} />

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
        <Toaster />
      </Router>
    </AuthProvider>
  )
}

export default App
