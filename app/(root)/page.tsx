import Hero from "./_components/Hero"
import FeaturedCars from "./_components/FeaturedCars"
import BrowseByMake from "./_components/BrowseByMake"
import BrowsBodyType from "./_components/BrowsBodyType"
import WhyChooseUs from "./_components/WhyChooseUs"
import FAQS from "./_components/FAQS"
import CTA from "./_components/CTA"

export default function Home() {
  return (
    <div className = " flex flex-col py-20">
        <Hero />
        <FeaturedCars  />
        <BrowseByMake />
        <WhyChooseUs />
        <BrowsBodyType />
        <FAQS/>
        <CTA />
    </div>
  )
}
