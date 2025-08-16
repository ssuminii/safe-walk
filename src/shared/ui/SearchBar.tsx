import SearchIcon from '../../assets/search.svg?react'

const SearchBar = () => {
  return (
    <div className='relative'>
      <input
        placeholder='동 이름을 입력해주세요.'
        className='w-[257px] placeholder:text-gray-6 r1 border border-gray-8 py-1 px-3 rounded-full'
      />
      <SearchIcon className='absolute right-3 top-1/2 -translate-y-1/2' />
    </div>
  )
}

export default SearchBar
