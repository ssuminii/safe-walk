import Alert from '@/assets/alert.svg?react'

const EmptyState = () => {
  return (
    <div className='flex flex-col justify-center items-center gap-3 h-full'>
      <Alert />
      <p className='text-center r2 text-gray-1'>
        해당 위치에는 사고 데이터가 없습니다. <br /> 위치를 변경하여 확인해보세요.
      </p>
    </div>
  )
}

export default EmptyState
