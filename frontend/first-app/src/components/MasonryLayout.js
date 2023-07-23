import React from 'react'
import Masonry from 'react-masonry-css'
import Pin from './Pin'

const breakpointobj = {
    default: 4,
    3000:6,
    2000:5,
    1200:3,
    900:2,
    500:1
}
function MasonryLayout({pins}) {
  return (
    <Masonry className='flex animate-slide-fwd' breakpointCols={breakpointobj}>
        {pins?.map(pin=> <Pin key={pin.id} pin={pin} className="w-max" />)}
    </Masonry>
  )
}

export default MasonryLayout
