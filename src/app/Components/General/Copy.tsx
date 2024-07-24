import { truncateAddress } from '@/Functions/General'
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import React from 'react'

function Copy({
  text,
  length = 4,
  icon = true
}: {
  text: string
  length?:number
  icon?:boolean
}
) {
  function copyToClipboard() {
    navigator.clipboard.writeText(text)
  }
  return (
    <span className='flex gap-2 hover:opacity-30 cursor-pointer '>
      <span onClick={copyToClipboard} className='text'>{text && truncateAddress(text, length)}</span>

      {icon &&<span className='pt-1'><DocumentDuplicateIcon className='w-4 h-4' /></span>}

    </span>
  )
}

export default Copy