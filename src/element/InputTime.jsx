import React, { Fragment, memo } from "react";


const InputTime = ({_onChange, _value}) => {
  return (
      <Fragment>
        {
          ["hour","min","sec"].map((num, idx)=> {
            return (
                <div key={num} className={"text-[16px] text-gray-500 flex justify-center"}>
                  <input
                      onChange={_onChange}
                      name={num}
                      tabIndex={idx + 1}
                      type="text"
                      className="outline-none w-[20px]"
                      value={_value[num]}
                      placeholder={"00"}/>
                  {idx !== 2 && <div>:</div>}
                </div>
            )
          })
        }
      </Fragment>
  )
}

export default memo(InputTime);