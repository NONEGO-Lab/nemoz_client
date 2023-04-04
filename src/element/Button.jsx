import React from "react";

const Button = (props) => {

  const { children, _onClick, type, style, tabIndex, disabled,
    margin, borderColor, width, height, color, bgColor } = props;

  if(disabled) {
    return (
        <button
            disabled={true}
            tabIndex={tabIndex}
            onClick={_onClick}
            type={type ? type : "button"}
            className={`rounded border-solid border-2 p-2 pointer-cursor bg-gray-200
                    ${margin}
                    ${borderColor ? borderColor : "border-blue-600"}
                    ${width}
                    ${height}
                    ${bgColor}
                    ${color ? color : "text-blue-600"}
                    ${style}
        `}>
          {children}
        </button>
    )

  } else {
    return(
        <button
            tabIndex={tabIndex}
            onClick={_onClick}
            type={type ? type : "button"}
            className={`border-2 rounded border-solid p-2 pointer-cursor
                    ${margin}
                    ${borderColor ? borderColor : "border-blue-600"}
                    ${width}
                    ${height}
                    ${bgColor}
                    ${color ? color : "text-blue-600"}
                    ${style}
        `}>
          {children}
        </button>
    )
  }


};


export default Button;