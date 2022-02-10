import React, { useEffect, useState } from 'react';
import './App.css';
import { PostSatalite } from './services/PostService'
import { UserSatalite } from './services/UserService';

import { ChatApp } from './components/ChatApp'

function App() {
  const [postsLoaded, setPostsLoaded] = useState(false);
  const [usersLoaded, setUserLoading] = useState(false)
  useEffect(() => {
    PostSatalite.SendToOrbit().then(() => {
      console.log("Sent to orbit")
      setPostsLoaded(true)
    })
    UserSatalite.SendToOrbit().then(() => {
      console.log("Sent Users to Orbit")
      setUserLoading(true)
    })
  })

  return (
    <div className="App">
      {(postsLoaded && usersLoaded) ? <ChatApp /> : <div>Loading...</div>}
    </div>
  );
}

export default App;
