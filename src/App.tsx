import React, { useEffect, useState } from 'react';
import './App.css';
import { PostSatalite } from './services/DatabaseService'

import { ChatApp } from './components/ChatApp'

function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    PostSatalite.SendToOrbit().then(() => {
      console.log("Sent to orbit")
      setLoading(false)
    })
  })

  return (
    <div className="App">
      {loading ? <div>Loading...</div> : <ChatApp />}
    </div>
  );
}

export default App;
