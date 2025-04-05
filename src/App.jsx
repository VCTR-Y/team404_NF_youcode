import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from './lib/supabase'
import './App.css'

function App() {
  return (
    <div className="App">
      <h1>Vite + React + Supabase</h1>
      <div className="card">
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
        />
      </div>
    </div>
  )
}

export default App
