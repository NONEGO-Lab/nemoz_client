import React from "react";


const Input = (props) => {

  const { name, register, label, required, type, onChange, value,
    width, height, marginBottom, placeholder, fileName } = props;

  const _onChange = onChange !== undefined ? onChange : () => {}

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
              </>
              :
              <>
                <label className="text-gray-400 text-[12px]">
                  {label}
                </label>

                <input

                    {
                      ...register(name, {
                        required: required,
                        onChange: (e) => _onChange(e)
                      })
                    }

                    className={`mt-2 text-sm border-2 rounded-[6px] border-gray-400 outline-none p-[10px]
                                    ${width}
                                    ${height}
                                    ${marginBottom}
                            `}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    type={type ? type : "text"}
                />
              </>

        }
      </div>
  )

};


export default Input;

