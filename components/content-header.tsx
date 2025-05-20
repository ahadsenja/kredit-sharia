import React from 'react'
import { PlusIcon } from 'lucide-react'

export default function ContentHeader({title, button}: {title: string, button: React.ReactNode}) {
  return (
    <div className='flex justify-between items-center py-5 mb-5'>
      <h2 className='text-2xl font-bold'>{title}</h2>
      
      <div>
         {button}
      </div>
    </div>
  )
}
