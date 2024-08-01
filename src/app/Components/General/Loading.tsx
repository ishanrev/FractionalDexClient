import React from 'react'
import ReactLoading from "react-loading"
function Loading() {
  return (
      <div className="items-center flex justify-center w-full">

        <ReactLoading type={"bubbles"} height={32} width={32} />
      </div>
  )
}

export default Loading