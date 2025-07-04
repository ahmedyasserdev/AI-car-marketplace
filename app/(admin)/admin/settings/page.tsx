import React from 'react'
import SettingsForm from './_components/SettingsForm'

type Props = {}

const SettingsPage = (props: Props) => {
  return (
    <section className='container py-6'>
            <h1 className='p-bold-24 '>Settings</h1>
            <SettingsForm/>
    </section>
  )
}

export default SettingsPage