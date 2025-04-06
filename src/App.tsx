import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoginForm } from './components/login-form'
import { Dashboard } from './components/dashboard'
import { SignUpForm } from './components/sign-up-form'
import { ForgotPasswordForm } from './components/forgot-password-form'
import { UpdatePasswordForm } from './components/update-password-form'
import { DonateForm } from './components/donate-form'

function App() {
  const [session, setSession] = useState<boolean | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setSession(!!user)
    }
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') setSession(true)
      if (event === 'SIGNED_OUT') setSession(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // if (session === null) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center">
  //       <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
  //     </div>
  //   )
  // }

  return (
<BrowserRouter>
  {session ? (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  ) : (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <Routes>
        <Route path="/login" element={<LoginForm className="w-full max-w-[400px]" />} />
        <Route path="/signup" element={<SignUpForm className="w-full max-w-[400px]" />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm className="w-full max-w-[400px]" />} />
        <Route path="/update-password" element={<UpdatePasswordForm className="w-full max-w-[400px]" />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  )}
</BrowserRouter>
  )
}

export default App
