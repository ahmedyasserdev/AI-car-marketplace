import Header from '@/components/shared/Header'
import { getAdmin } from '@/lib/actions/admin.actions'
import { notFound } from 'next/navigation'
import React from 'react'
import AdminSidebar from './_components/AdminSidebar'

type AdminLayoutProps = {
    children : React.ReactNode
}




const AdminLayout = async({children}: AdminLayoutProps) => {
  const admin = await getAdmin()

  if (!admin.authorized) return notFound()
  return (
    <section className  = 'h-full'>
      <Header isAdminPage = {true} />
      <div className='flex h-full w-56 flex-col top-20 fixed  inset-y-0 z-50'>
        <AdminSidebar />
      </div>

      <section className='md:pl-56 pt-[80px] h-full '>
      {children}
      </section>


    </section>
  )
}

export default AdminLayout