import type { AccidentInfoCard as Accident } from '../types/map'

interface AccidentInfoCardProps {
  accident: Accident
  isSelected?: boolean
}

export const AccidentInfoCard = ({ accident, isSelected = false }: AccidentInfoCardProps) => {
  return (
    <div
      className={`border rounded-xl h-[108px] p-4 ${
        isSelected ? 'border-error' : 'border-[#f7f7f7]'
      }`}
    >
      <div className='rounded-lg text-error s1 py-1 px-1.5 pb-1'>
        사고 {accident.accidentCount}건
      </div>
      <h2 className='r3'>{accident.location}</h2>
      <small className='r1 text-gray-5'>
        사상자 수 {accident.casualties.total}(사망 {accident.casualties.dead} 중상{' '}
        {accident.casualties.severe} 경상 {accident.casualties.minor})
      </small>
    </div>
  )
}
