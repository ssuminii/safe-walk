import { SearchBar } from './'

const Navbar = () => {
  return (
    <nav className='flex gap-4 py-[20px] px-6 items-center border-b border-gray-8'>
      <h1 className='font-family-aggro text-2xl text-primary'>SafeWalk</h1>
      <SearchBar />
    </nav>
  )
}

export default Navbar
