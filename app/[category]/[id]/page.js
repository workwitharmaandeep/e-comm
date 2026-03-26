import Card from '@/app/shared/Card'
import React from 'react'

async function pfulldetail({params}){
  const {category,id}=await params;
  return (
    <div>
<h1>{id} and category is {category}</h1>
    </div>
  )
}

export default pfulldetail