
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './home/Home'
import BookList from './Book-List/BookList'
import LinkArchive from './Link-Archive/LinkArchive'

function App() {
  

  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/book-list' element={<BookList/>} />
        <Route path='/link-archive' element={<LinkArchive/>} />
      </Routes>
    </>
  )
}

export default App
