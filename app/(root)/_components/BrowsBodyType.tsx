import Link from '@/components/shared/Link'
import SectionHeader from '@/components/shared/SectionHeader'
import { bodyTypes } from '@/constants'
import Image from 'next/image'


const BrowsBodyType = () => {
    return (
        <section className="py-12 bg-gray-50">
            <div className="container">
                <SectionHeader
                    title="Browse by body type"
                    linkHref="/cars"
                />

                <div className="grid grid-cols-2 md:grid-cols-4  mx-auto gap-4   ">
                    {bodyTypes.map((type) => (
                        <Link
                            key={type.id}
                            href={`car?bodyType=${type.name}`}
                            className="relative group cursor-pointer "
                        >
                            <div className="overflow-hidden rounded-lg flex justify-end h-28 mb-4 relative">
                                <Image
                                    src={
                                        // type.imageUrl ||
                                        `/body/${type.name.toLowerCase()}.webp`
                                    }
                                    alt={type.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition duration-300"
                                />
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-lg flex items-end">
                  <h3 className="text-white p-bold-20 pl-4 pb-2 ">
                    {type.name}
                  </h3>
                </div>

                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default BrowsBodyType