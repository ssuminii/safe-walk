import { Navbar } from './shared/ui'
import { SearchPage } from './pages/search-page'
import { ApiTestPage } from './pages/api-test-page'
import { Route, Routes } from 'react-router-dom'

function App() {
  return (
    <div className='w-full flex flex-col h-dvh bg-white'>
      <Navbar />
      <Routes>
        <Route path='/' element={<SearchPage />} />
        <Route path='/api-test' element={<ApiTestPage />} />
      </Routes>
    </div>
  )
}

export default App
