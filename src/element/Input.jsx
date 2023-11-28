import React from "react";


const Input = (props) => {

    const {
        name, register, required, type, onChange, value, inputStyle,autoFocus,
        width, height, marginBottom, placeholder, fileName, errors, title, inputWidth
    } = props;

    const _onChange = onChange !== undefined ? onChange : () => {
    }

    return (
        <div
            className={`flex ${width} ${marginBottom} justify-between items-center  border-b-2 border-b-[#c7c7c7] pb-[15px]`}>
            {
                type === "file" ?
                    <>
                        <div className="text-[#444] text-[1rem] font-medium">
                            {title}
                        </div>
                        <label
                            className={` cursor-pointer dark:text-gray-400 focus:outline-none dark:border-gray-400 dark:placeholder-gray-400 flex items-center`}
                            htmlFor="file_input">
                            {fileName ?
                                <div
                                    className={"bg-[#c7c7c7] px-[15px] py-[7px] rounded-[18px] text-white text-[1.25rem] font-bold text-ellipsis whitespace-nowrap w-[250px] overflow-hidden"}>{fileName} </div>
                                : "파일 선택"}
                        </label>

                        <input
                            {...register(name, {
                                required: required
                            })}
                            onChange={onChange}
                            className={`hidden`}
                            id={"file_input"}
                            type={"file"}
                        />
                        {errors?.exampleRequired && <span>This field is required</span>}
                    </>
                    :
                    <>
                        <div className="text-[#444] text-[1rem] font-medium">
                            {title}
                        </div>
                        <input
                            {...register(name, {
                                    required: required,
                                    onChange: (e) => _onChange(e)
                                    })}
                            className={`outline-none
                                    text-[1.25rem]
                                    ${inputWidth}
                                    ${height}
                                    ${errors && 'text-[#848484]'}
                                    ${inputStyle}
                            `}
                            name={name}
                            placeholder={placeholder}
                            value={errors ? errors : value}
                            type={type ? type : "text"}
                            autoFocus={autoFocus}

                        />
                    </>
            }
        </div>
    )
};


export default Input;

