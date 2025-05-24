
import Link from '@/components/shared/Link'
import SectionHeader from '@/components/shared/SectionHeader'
import { carMakes } from '@/constants'
import Image from 'next/image'

const BrowseByMake = () => {
    return (
        <section className="py-12 bg-gray-50">
            <div className="container">
                <SectionHeader 
                    title="Browse by make"
                    linkHref="/cars"
                />

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mx-auto gap-4">
                    {carMakes.map((make) => (
                        <Link 
                            key={make.id} 
                            href={`car?make=${make.name}`} 
                            className="bg-white rounded-lg shadow p-4 text-center hover:shadow-md transition cursor-pointer"
                        >
                            <div className='relative h-16 mx-auto w-auto mb-2'>
                                <Image 
                                    src={make.image} 
                                    alt={make.name} 
                                    fill 
                                    className="object-contain size-full" 
                                />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default BrowseByMake