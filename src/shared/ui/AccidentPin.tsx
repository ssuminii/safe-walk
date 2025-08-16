import AccidentPinIcon from '../../assets/accident-pin.svg?react'

interface AccidentPinProps {
  accidentCount: number
  onClick: () => void
}

const AccidentPin = ({ accidentCount, onClick }: AccidentPinProps) => {
  return (
    <div className='relative' onClick={onClick}>
      <AccidentPinIcon />
      <span className='absolute r2 text-white left-6.5 top-4.5'>{accidentCount}</span>
    </div>
  )
}

export default AccidentPin
