import React from "react";


const Select = (props) => {

    const {
        name, register, options, required, label,
        width, height, marginBottom, placeholder, selectStyle, defaultValue
    } = props;

    return (
        <div className={`flex items-start ${width} border-b-[1.5px] border-b-[#c7c7c7] min-h-[44px]`}>
            <label htmlFor={name} className=" flex justify-center items-center text-[20px] text-[#646464] font-medium">
                {label}
            </label>
            <select
                {...register(name, {
                    required: required
                })}
                className={`bg-white text-sm
                        ${width}
                        ${height}
                        ${marginBottom}
                         ${selectStyle}
                         flex
                         items-center
                    `}
                id={name}
                placeholder={placeholder}
                defaultValue={defaultValue}

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

