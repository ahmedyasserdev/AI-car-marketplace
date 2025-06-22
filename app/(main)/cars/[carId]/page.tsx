import React from 'react'

type CarPageProps = {
    params: Promise<{ carId: string }>
}

const CarPage = async ({ params }: CarPageProps) => {
    const { carId } = await (params)
    return (
        <div>CarPage</div>
    )
}

export default CarPage