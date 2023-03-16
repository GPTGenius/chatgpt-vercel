import { FC, useState } from 'react'

const MessageInput: FC<{ onSubmit: (message: string) => Promise<void> }> = ({ onSubmit }) => {
  const [input, setInput] = useState('');

  return (
    <div className="flex mt-[20px]">
      <input placeholder='请输入' className="shadow-inner flex-1 border-none rounded-md text-[#273346] bg-[#f8f8fa] p-[12px]" value={input} onChange={(event) => {
        setInput(event.target.value)
      }}/>
      <button disabled={input.trim() === ''} className="shadow-sm text-white bg-[#0086ff] ml-[10px] p-[12px] px-[20px] border-none rounded-md" onClick={() => {
        onSubmit(input)
        setInput('')
      }}>Submit</button>
    </div>
  )
}

export default MessageInput