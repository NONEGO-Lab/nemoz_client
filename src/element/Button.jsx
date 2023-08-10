import React from "react";

const Button = (props) => {

    const {
        children, _onClick, type, style, tabIndex, disabled,
        margin, borderColor, width, height, textColor, bgColor, createRoom, textSize
    } = props;

    if (disabled) {
        return (

            <button
                disabled={true}
                tabIndex={tabIndex}
                onClick={_onClick}
                type={type ? type : "button"}
                className={`rounded pointer-cursor bg-gray-200
                    ${margin}
                    ${width}
                    ${height}
                    ${bgColor}
                    ${style}
        `}>
                {children}
            </button>

        )

    } else {
        return (
            <div className={'flex items-center justify-center'}>
                {createRoom &&<div className={'w-[22px] h-[22px]'}>
                    <img src={"../images/plusIcon.png"} alt='create-room-icon'/>
                </div>}
                <button
                    tabIndex={tabIndex}
                    onClick={_onClick}
                    type={type ? type : "button"}
                    className={`rounded  pointer-cursor 
                    ${margin}
                    ${width}
                    ${height}
                    ${bgColor? bgColor : ""}
                    ${textColor ? textColor : "text-blue-600"}
                    ${textSize ? textSize : "text-[20px]"}
                    ${style}
        `}>
                    {children}
                </button>
            </div>
        )
    }


};


export default Button;