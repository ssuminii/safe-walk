import { Navbar } from './shared/ui'
import { SearchPage } from './pages/search-page'
import './shared/lib/proj4Defs'

function App() {
  return (
    <div className='w-full flex flex-col h-dvh bg-white'>
      <Navbar />
      <SearchPage />
    </div>
  )
}

export default App
