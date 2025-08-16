import { useState } from 'react'
import SearchIcon from '../../assets/search.svg?react'
import { useNavigate } from 'react-router-dom'

const SearchBar = () => {
  const [search, setSearch] = useState<string>('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`?q=${encodeURIComponent(search)}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='relative'>
      <input
        placeholder='동 이름을 입력해주세요.'
        className='w-[257px] placeholder:text-gray-6 r1 border border-gray-8 py-1 px-3 rounded-full'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button type='submit' className='cursor-pointer'>
        <SearchIcon className='absolute right-3 top-1/2 -translate-y-1/2' />
      </button>
    </form>
  )
}

export default SearchBar
