import { useEffect, useRef, useState } from 'react'
import SearchIcon from '../../assets/search.svg?react'
import { useNavigate } from 'react-router-dom'
import type { EmnSearchResult } from '../types/map'
import { searchRegionRealTime } from '../../pages/search/api/map'

const SearchBar = () => {
  const [search, setSearch] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<EmnSearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 검색어 변경 시 실시간 검색
  useEffect(() => {
    const searchLocations = async () => {
      if (search.length > 1) {
        setIsLoading(true)
        setError(null)

        try {
          const searchResults = await searchRegionRealTime(search)
          setResults(searchResults)
          setIsOpen(searchResults.length >= 0)
          setSelectedIndex(-1)
        } catch (err) {
          console.error('검색 실패:', err)
          setError('검색 중 오류가 발생했습니다.')
          setResults([])
          setIsOpen(false)
        } finally {
          setIsLoading(false)
        }
      } else {
        setResults([])
        setIsOpen(false)
        setIsLoading(false)
        setError(null)
      }
    }

    // 300ms 후에 검색 실행
    const timer = setTimeout(searchLocations, 300)
    return () => clearTimeout(timer)
  }, [search])

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (search.trim()) {
      // 선택된 항목 사용 없으면 검색어 그대로 사용
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleSelectLocation(results[selectedIndex])
      } else {
        navigate(`?q=${encodeURIComponent(search)}`)
      }
    }
  }

  const handleSelectLocation = (location: EmnSearchResult) => {
    setSearch(location.eupMyeonDong)
    setIsOpen(false)
    setSelectedIndex(-1)

    navigate(`?q=${encodeURIComponent(location.eupMyeonDong)}&code=${location.code}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleSelectLocation(results[selectedIndex])
        } else if (search.trim()) {
          navigate(`?q=${encodeURIComponent(search)}`)
        }
        setIsOpen(false)
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        break
    }
  }

  return (
    <div className='relative'>
      <form onSubmit={handleSubmit} className='relative'>
        <input
          ref={inputRef}
          placeholder='동 이름을 입력해주세요.'
          className='w-[257px] placeholder:text-gray-6 r1 border border-gray-8 py-1 px-3 rounded-full'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button type='submit' className='cursor-pointer'>
          {isLoading ? (
            <div className='absolute right-3 top-1/2 -translate-y-1/2'>
              <div className='animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-500 rounded-full'></div>
            </div>
          ) : (
            <SearchIcon className='absolute right-3 top-1/2 -translate-y-1/2' />
          )}
        </button>
      </form>

      {isOpen && (
        <div
          ref={dropdownRef}
          className='absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto'
        >
          {error ? (
            <div className='text-sm p-2 text-center text-red-500'>{error}</div>
          ) : results.length > 0 ? (
            results.map((location, index) => (
              <div
                key={location.code}
                onClick={() => handleSelectLocation(location)}
                className={`p-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${
                  selectedIndex === index ? 'bg-blue-50' : ''
                }`}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <span className='text-sm text-gray-500'>
                      {location.sido} {location.sigungu}
                    </span>
                    <span className='text-sm font-medium text-gray-900 ml-2'>
                      {location.eupMyeonDong}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            results.length === 0 && (
              <div className='text-sm p-2 text-center text-gray-500'>
                '<span className='text-primary'>{search}</span>' 에 대한 검색 결과가 없습니다.
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar
