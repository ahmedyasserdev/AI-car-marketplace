import Hero from "./_components/Hero"
import FeaturedCars from "./_components/FeaturedCars"
import BrowseByMake from "./_components/BrowseByMake"

export default function Home() {
  return (
    <div className = " flex flex-col py-20">
        <Hero />
        <FeaturedCars  />

        <BrowseByMake />

    </div>
  )
}
