import { SearchBar } from './'
import Logo from '@/assets/logo.svg?react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <header className='flex py-[20px] px-6 pr-56 justify-between items-center border-b border-gray-8'>
      <div className='flex items-center gap-4'>
        <Logo className='cursor-pointer' onClick={() => (window.location.href = '/')} />
        <SearchBar />
      </div>
      <nav className='flex gap-6'>
        <NavLink
          to='/'
          className={({ isActive }) => `r3 ${isActive ? 'text-primary' : 'text-gray-1'}`}
          end
        >
          지도
        </NavLink>
        <NavLink
          to='/tourist-spot'
          className={({ isActive }) => `r3 ${isActive ? 'text-primary' : 'text-gray-1'}`}
        >
          관광지
        </NavLink>
      </nav>
    </header>
  )
}

export default Navbar
