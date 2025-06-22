import React from 'react'

type MainLayoutProps = {
    children : React.ReactNode
}

const MainLayout = ({children}: MainLayoutProps) => {
  return (
    <div className = "contianer my-32 " >{children}</div>
  )
}

export default MainLayout