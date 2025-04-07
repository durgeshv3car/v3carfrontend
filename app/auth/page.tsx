import React from 'react'
import { redirect } from 'next/navigation'
const page = ({ params: { locale } }: { params: { locale: string } }) => {
  redirect(`/auth/login`)
  return null
}

export default page