import React from 'react'

const InnerCircleText = ({ gender, textSize, textColor, fontWeight, width, height, bgcolor, ml }) => {
    return (
        <div className={`rounded-full flex items-center justify-center ${textSize} ${fontWeight} ${textColor} ${width} ${height} ${bgcolor} ${ml}`}>
            {gender}
        </div>
    )
}

export default InnerCircleText