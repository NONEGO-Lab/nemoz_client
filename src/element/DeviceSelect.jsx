import React from "react";


const DeviceSelect = (props) => {

    const {
        name, register, options, required, isAudio, isVideo,
        width, height, marginBottom, placeholder, selectStyle, defaultValue, fontSize, mb, isTime, pb
    } = props;

    return (
        <div className={`flex border border-[#c7c7c7] rounded-[10px] min-h-[60px] text-[#444] text-[20px] font-medium ${mb} px-[21px] py-[25px]`}>
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
                        <option className={"bg-white"} key={idx} value={value}>
                            {/* {isVideo &&
                                <div>
                                    <img  className="w-[27px] h-[27px]" src="../images/starIcon.png" alt="video" />
                                    <div>비디오 설정</div>
                                </div>}
                            {isAudio &&
                                <div>
                                    <img src="../images/starIcon.png" alt="video" className="w-[27px] h-[27px]" />
                                    <div>오디오 설정</div>
                                </div>
                            } */}
                            {value}
                        </option>
                    )
                })
                }
            </select>
        </div>
    )

};


export default DeviceSelect;

