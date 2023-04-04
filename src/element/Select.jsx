import React from "react";


const Select = (props) => {

  const { name, register, options, required, label,
    width, height, marginBottom, placeholder } = props;



  return(
      <div className={`flex flex-col items-start ${width} justify-center`}>
        <label htmlFor={name} className="text-gray-400 text-[12px]">
          {label}
        </label>
        <select
            {...register(name, {
              required: required
            })}
            className={`mt-2 border-2 rounded-[6px] border-gray-400 outline-none p-[10px] bg-white text-sm
                        ${width}
                        ${height}
                        ${marginBottom}
                    `}
            id={name}
            placeholder={placeholder}
        >
          {
            options.map((value, idx) => {
              return (
                  <option key={idx} value={value}>
                    {value}
                  </option>
              )
            })
          }
        </select>
      </div>
  )

};


export default Select;

