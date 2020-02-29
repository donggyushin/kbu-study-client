import React from 'react';
import Private from './components/private/privateRoutes'
import Public from './components/public/publicRoutes'

function App() {

  const token = localStorage.getItem('token')

  if (token) {
    return <Private />
  } else {
    return <Public />
  }

}

export default App;
