import { useState, useEffect } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from './lib/supabase'
import './App.css'

function Dashboard({ session }) {
  return (
    <div className="dashboard">
      <h2>Welcome, {session.user.email}</h2>
      <div className="card">
        <h3>Dashboard</h3>
        <p>You are now signed in to your account.</p>
        <button onClick={() => supabase.auth.signOut()}>
          Sign Out
        </button>
      </div>
    </div>
  )
}

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div className="App">
      <h1>Vite + React + Supabase</h1>
      {!session ? (
        <div className="card">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={['google', 'github']}
          />
        </div>
      ) : (
        <Dashboard session={session} />
      )}
    </div>
  )
}

export default App
