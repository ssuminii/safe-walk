import { Navbar } from './shared/ui'
import { SearchPage } from './pages/search-page'

function App() {
  return (
    <div className='w-full flex flex-col min-h-screen bg-white'>
      <Navbar />
      <SearchPage />
    </div>
  )
}

export default App
