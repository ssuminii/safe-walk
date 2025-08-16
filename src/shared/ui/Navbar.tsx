import { SearchBar } from './'
import { useNavigate } from 'react-router-dom'
import Logo from '../../assets/logo.svg?react'

const Navbar = () => {
  const navigate = useNavigate()

  return (
    <nav className='flex gap-4 py-[20px] px-6 items-center border-b border-gray-8'>
      <Logo className='cursor-pointer' onClick={() => navigate('/')} />
      <SearchBar />
    </nav>
  )
}

export default Navbar
