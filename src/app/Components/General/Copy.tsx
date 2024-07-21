import { truncateAddress } from '@/Functions/General'
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import React from 'react'

function Copy({
  text,
  length = 4
}: {
  text: string
  length?:number
}
) {
  function copyToClipboard() {
    navigator.clipboard.writeText(text)
  }
  return (
    <span className='flex gap-2 hover:opacity-30 cursor-pointer '>
      <span onClick={copyToClipboard} className='text'>{truncateAddress(text, length)}</span>

      <span className='pt-1'><DocumentDuplicateIcon className='w-4 h-4' /></span>

    </span>
  )
}

export default Copy