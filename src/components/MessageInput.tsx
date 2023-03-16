import { FC } from 'react'

const MessageInput: FC = () => {
  return (
    <div className="flex mt-[20px]">
      <input placeholder='请输入' className="flex-1 border-none rounded-md text-[#273346] bg-[#f8f8fa] p-[12px]"/>
      <button className="text-white bg-[#0086ff] ml-[10px] p-[12px] px-[20px] border-none rounded-md">提交</button>
    </div>
  )
}

export default MessageInput