import React from 'react'
import { Star } from 'lucide-react'

type RatingProps = {
    buzzMeter:number;
}

const BuzzMeter = ({buzzMeter}: RatingProps) => {
  return [1,2,3,4,5].map((index) => (
    <Star
        key={index}
        color={index <= buzzMeter ? "#FFC107" : "#E4E5E9"}
        className='w-4 h-4'
    />
  ))
}

export default BuzzMeter;