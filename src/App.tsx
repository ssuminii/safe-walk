import { MapPage } from './pages/map'
import './shared/lib/proj4Defs'
import TouristSpotPage from './pages/tourist-spot/TouristSpotPage'
import { Route, Routes } from 'react-router-dom'
import { MainLayout } from './shared/layout'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path='/' element={<MapPage />} />
        <Route path='/tourist-spot' element={<TouristSpotPage />} />
      </Route>
    </Routes>
  )
}

export default App
