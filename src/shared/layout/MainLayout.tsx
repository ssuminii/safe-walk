import { Navbar } from '@/shared/ui'
import { Outlet } from 'react-router-dom'

export default function MainLayout() {
  return (
    <div className='w-full flex flex-col h-dvh bg-white'>
      <Navbar />
      <div className='flex-1 min-h-0'>
        <Outlet />
      </div>
    </div>
  )
}
