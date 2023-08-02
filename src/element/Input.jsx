import React from "react";


const Input = (props) => {

  const { name, register, required, type, onChange, value,
    width, height, marginBottom, placeholder, fileName, errors } = props;
console.log(errors,'?')
  const _onChange = onChange !== undefined ? onChange : () => {}
  const reset = (name) =>{

  }
  return(
      <div className={`flex flex-col items-start ${width} justify-center`}>

        {
          type === "file" ?
              <>
                <div className="text-gray-400 text-[12px]">
                  파일 선택
                </div>
                <label className={`mt-2 w-full text-sm rounded-lg border border-gray-400 cursor-pointer
                            dark:text-gray-400 focus:outline-none dark:border-gray-400 dark:placeholder-gray-400 flex items-center
                            pl-4
                                ${width}
                                ${height}
                                ${marginBottom}
                       
                            `}
                       htmlFor="file_input">
                  { fileName ? fileName : "파일 선택" }
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
                {errors.exampleRequired && <span>This field is required</span>}
              </>
              :
              <>
                <input

                    {
                      ...register(name, {
                        required: required,
                        onChange: (e) => _onChange(e)
                      })
                    }

                    className={`mt-2 text-sm border-b-2 border-b-[#c7c7c7] outline-none p-[10px] placeholder: text-[#646464] focus:bg-none
                                    ${width}
                                    ${height}
                                    ${marginBottom}
                                    ${errors && 'text-[#848484]'}
                            `}
                    name={name}
                    placeholder={placeholder}
                    value={errors?errors:value}
                    type={type ? type : "text"}
                />


              </>

        }
      </div>
  )

};


export default Input;

