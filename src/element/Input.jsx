import React from "react";


const Input = (props) => {

    const {
        name, register, required, type, onChange, value, inputStyle,
        width, height, marginBottom, placeholder, fileName, errors, title, inputWidth
    } = props;
    console.log(errors, '?')
    const _onChange = onChange !== undefined ? onChange : () => {
    }

    return (
        <div className={`flex ${width} ${marginBottom} justify-between  border-b-2 border-b-[#c7c7c7]`}>

            {
                type === "file" ?
                    <>
                        <div className="text-[#646464] text-[20px] font-medium">
                            {title}
                        </div>
                        <label className={` cursor-pointer dark:text-gray-400 focus:outline-none dark:border-gray-400 dark:placeholder-gray-400 flex items-center
 `}
                               htmlFor="file_input">
                            {fileName ? fileName : "파일 선택"}
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
                        <div className="text-[#646464] text-[20px] font-medium">
                            {title}
                        </div>
                        <input

                            {
                                ...register(name, {
                                    required: required,
                                    onChange: (e) => _onChange(e)
                                })
                            }

                            className={`text-sm  outline-none 
                                    ${inputWidth}
                                    ${height}
                                    ${errors && 'text-[#848484]'}
                                    ${inputStyle}
                            `}
                            name={name}
                            placeholder={placeholder}
                            value={errors ? errors : value}
                            type={type ? type : "text"}
                        />


                    </>

            }
        </div>
    )

};


export default Input;

