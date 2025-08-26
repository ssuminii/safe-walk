import Alert from '@/assets/alert.svg?react'

interface EmptyStateProps {
  isUnselected: boolean
}

const EmptyState = ({ isUnselected }: EmptyStateProps) => {
  const text = isUnselected
    ? '지도를 확대하거나 원하는 동을 클릭해 \n 사고 데이터를 확인해보세요.'
    : '해당 위치에는 사고 데이터가 없습니다. \n 위치를 변경하여 확인해보세요.'

  return (
    <div className='flex flex-col justify-center items-center gap-3 h-full'>
      <Alert />
      <p className='text-center r2 text-gray-1 whitespace-pre-line'>{text}</p>
    </div>
  )
}

export default EmptyState
