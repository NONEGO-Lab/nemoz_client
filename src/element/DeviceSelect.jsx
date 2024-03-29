import React from "react";


const DeviceSelect = (props) => {

    const {
        name, register, options, required, label,
        width, height, marginBottom, placeholder, selectStyle, defaultValue, fontSize, mb,
    } = props;
    
    let styleCode = 'px-[15px] py-[18px] flex border border-[#c7c7c7] rounded-[10px] min-h-[45px] text-[#444] text-[20.3px] font-medium items-center';
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
                         overflow-hidden whitespace-nowrap appearance-none bg-arrow-down bg-no-repeat bg-19-10 bg-right pr-[15px]
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

