import { RegionInfo } from './'
import AccidentInfoCard from './AccidentInfoCard'

const SideBar = () => {
  return (
    <div className='flex flex-col flex-1 py-4 px-6 gap-[18px]'>
      <RegionInfo />
      <AccidentInfoCard />
    </div>
  )
}

export default SideBar
