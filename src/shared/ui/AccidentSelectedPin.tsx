import AccidentSelectedPinIcon from '../../assets/accident-active-pin.svg?react'

const AccidentSelectedPin = ({ accidentCount }: { accidentCount: number }) => {
  return (
    <div className='relative'>
      <AccidentSelectedPinIcon />
      <span className='absolute r2 text-error right-3 top-0'>{accidentCount}</span>
    </div>
  )
}

export default AccidentSelectedPin
