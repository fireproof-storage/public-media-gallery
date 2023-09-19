import './App.css'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { Home } from './pages/Home'
import { Album } from './pages/Album'
import { Upload } from './pages/Upload'
import { Sidebar } from './components/Sidebar'
import { DragProvider } from './components/DragContext'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen dark:bg-gray-950 bg-slate-200 text-slate-800 dark:text-slate-200">
      <Sidebar />
      <div className="MainContent flex-1 p-4 ">{children}</div>
    </div>
  )
}

function App() {
  const routes = [
    // { path: '/item/:id', component: Detail },
    { path: '/album/:id', component: Album },
    { path: '/upload/:id', component: Upload },
    { path: '/', component: Home }
  ]

  return (
    <DragProvider>
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
    </DragProvider>
  )
}

export default App
