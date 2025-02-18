import { Route, Routes } from 'react-router-dom'
import { useState } from 'react'
import { db, app } from './firebase'

import './App.css'

import Navbar from './components/Navbar'
import Home from './components/Home'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import IncomeForm from './components/IncomeForm'
import Summary from './components/Summary'

import ErrorPage from './pages/ErrorPage'
function App() {

  return (
    <>
      <Navbar/>
      <Sidebar/>

      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path="/incomeForm" element={<IncomeForm />} />
        <Route path="/expenseSummary" element={<Summary />}/>

        <Route path='*' element={<ErrorPage/>}/>
      </Routes>

      <Footer></Footer>
    </>
  )
}

export default App
