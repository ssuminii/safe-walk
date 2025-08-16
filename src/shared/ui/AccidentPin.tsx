import AccidentPinIcon from '../../assets/accident-pin.svg?react'

const AccidentPin = ({ accidentCount }: { accidentCount: number }) => {
  return (
    <div className='relative'>
      <AccidentPinIcon />
      <span className='absolute r2 text-white left-6.5 top-4.5'>{accidentCount}</span>
    </div>
  )
}

export default AccidentPin
