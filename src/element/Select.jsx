import React from "react";


const Select = (props) => {
    const {
        name, register, options,required, label, items, justify, border,
        width, height, marginBottom, placeholder, selectStyle, defaultValue, fontSize, mb, pb
    } = props;
    return (
        <div
            className={`flex ${items} ${justify} ${border ? border : "border-b-[1.5px] border-b-[#c7c7c7]"} min-h-[44px] ${mb} ${pb}`}>
            <label htmlFor={name} className=" flex items-center text-[20px] text-[#646464] font-medium">
                {label}
            </label>
            <select
                {...register(name, {
                    required: required
                })}
                className={`bg-white
                        ${fontSize}
                        ${width}
                        ${height}
                        ${marginBottom}
                        ${selectStyle}
                         flex
                         items-center
                         text-[#646464]
                    `}
                id={name}
                placeholder={placeholder}
                defaultValue={defaultValue}
            >
                {
                    options.map((value, idx) => {
                        return (
                            <option className={"bg-white text-center"} key={idx} value={value}>
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

