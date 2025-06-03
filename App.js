import { useState } from 'react'
import Login from './components/Login'

function App() {
  const [session, setSession] = useState(null)

  return (
    <div className="App">
      {!session ? (
        <Login onLogin={setSession} />
      ) : (
        <div>
          <h2>Bem-vindo!</h2>
          <p>Role: {session.role}</p>
        </div>
      )}
    </div>
  )
}

export default App