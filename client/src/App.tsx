
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/home/Home'
import BookList from './pages/Book-List/BookList'
import LinkArchive from './pages/Link-Archive/LinkArchive'
import Login from './pages/login/Login'

function App() {
  

  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/book-list' element={<BookList/>} />
        <Route path='/link-archive' element={<LinkArchive/>} />
        <Route path='/login' element={<Login/>} />
      </Routes>
    </>
  )
}

export default App
