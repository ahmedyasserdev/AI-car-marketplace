import CarCard from "@/components/shared/CarCard"
import SectionHeader from "@/components/shared/SectionHeader"
import { featuredCars } from "@/constants"

type Props = {}

const FeaturedCars = (props: Props) => {
  return (
    <section className="py-12">
      <div className="container">
        <SectionHeader 
          title="Featured Cars"
          linkHref="/cars"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-auto gap-4">
          {featuredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedCars