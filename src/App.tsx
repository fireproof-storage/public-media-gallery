import './App.css'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { Home } from './pages/Home'
import { Gallery } from './pages/Gallery'
import { Upload } from './pages/Upload'
import { Sidebar } from './components/Sidebar'



function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="MainContent flex-1 p-4 ">{children}</div>
    </div>
  )
}

function App() {
  const routes = [
    // { path: '/item/:id', component: Detail },
    { path: '/gallery/:id', component: Gallery },
    { path: '/upload/:id', component: Upload },
    { path: '/', component: Home }
  ]

  return (
    <>
      <Header />
      <Routes>
        {routes.map(({ path, component }, index) => (
          <Route
            key={index}
            path={path}
            element={<Layout>{React.createElement(component)}</Layout>}
          />
        ))}
      </Routes>
    </>
  )
}

export default App
