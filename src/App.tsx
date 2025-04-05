import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { LoginForm } from './components/login-form'
import { Dashboard } from './components/dashboard'

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
    <div className="w-full mx-auto min-h-screen flex items-center justify-center">
      {session ? (
      <Dashboard/>
      ) : (
      <LoginForm className="container max-w-md w-full mx-auto py-8" />
      )}
    </div>
  )
}

export default App
