import React from "react";


const DeviceSelect = (props) => {

    const {
        name, register, options, required, label,
        width, height, marginBottom, placeholder, selectStyle, defaultValue, fontSize, mb,
    } = props;
    
    let styleCode = 'px-[21px] py-[25px] flex border border-[#c7c7c7] rounded-[10px] min-h-[60px] text-[#444] text-[20px] font-medium px-[21px] py-[25px]';
    return (
        <div className={`${styleCode} ${mb}`}>
            {label ?? label}
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

                {options.map((value, idx) => {
                    return (
                        <option className={"bg-white"} key={idx} value={value.deviceId}>
                            {value.label}
                        </option>
                    )
                })
                }
            </select>
        </div>
    )

};


export default DeviceSelect;

