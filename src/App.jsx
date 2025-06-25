import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from './Layout.jsx'
import { routes, routeArray } from './config/routes.js'

function App() {
  return (
    <BrowserRouter>
      <div className="crosshair-cursor">
        <Routes>
          <Route path="/" element={<Layout />}>
            {routeArray.map(route => (
              <Route 
                key={route.id} 
                path={route.path} 
                element={<route.component />} 
              />
            ))}
            <Route path="*" element={<routes.home.component />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          className="z-[9999]"
        />
      </div>
    </BrowserRouter>
  )
}

export default App