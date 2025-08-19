import { SearchBar } from './'
import { useNavigate } from 'react-router-dom'
import Logo from '../../assets/logo.svg?react'

const Navbar = () => {
  const navigate = useNavigate()

  return (
    <nav className='flex gap-4 py-[20px] px-6 items-center border-b border-gray-8'>
      <Logo className='cursor-pointer' onClick={() => navigate('/')} />
      <SearchBar />
      <div className='ml-auto flex gap-4'>
        <button
          onClick={() => navigate('/')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            location.pathname === '/' 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          지도 검색
        </button>
        <button
          onClick={() => navigate('/api-test')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            location.pathname === '/api-test' 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          API 테스트
        </button>
      </div>
    </nav>
  )
}

export default Navbar
