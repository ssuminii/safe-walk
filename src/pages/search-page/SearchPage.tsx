import { KakaoMap, SideBar } from '../../shared/ui'
import { mapRegionLabels } from '../../shared/mocks'

const SearchPage = () => {
  return (
    <div className='flex flex-1'>
      <SideBar />
      <KakaoMap mapRegionLabels={mapRegionLabels} />
    </div>
  )
}

export default SearchPage
