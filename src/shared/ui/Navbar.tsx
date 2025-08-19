import { SearchBar } from './'
import Logo from '../../assets/logo.svg?react'

const Navbar = () => {
  return (
    <nav className='flex gap-4 py-[20px] px-6 items-center border-b border-gray-8'>
      <Logo className='cursor-pointer' onClick={() => (window.location.href = '/')} />
      <SearchBar />
    </nav>
  )
}

export default Navbar
