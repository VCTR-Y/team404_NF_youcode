import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import './App.css'

function App() {
  const [status, setStatus] = useState('Checking connection...')

  useEffect(() => {
    checkConnection()
  }, [])

  async function checkConnection() {
    try {
      const { error } = await supabase.from('test').select('*').limit(1)
      if (error) throw error
      setStatus('Connected to Supabase!')
    } catch (error) {
      setStatus('Error connecting to Supabase')
      console.error('Error:', error.message)
    }
  }

  return (
    <div className="App">
      <h1>Vite + React + Supabase</h1>
      <div className="card">
        <p>{status}</p>
      </div>
    </div>
  )
}

export default App
