import { Car, Calendar, Shield } from 'lucide-react'
import React from 'react'

type FeatureItem = {
  id: number
  icon: typeof Car | typeof Calendar | typeof Shield
  title: string
  description: string
}

const features: FeatureItem[] = [
  {
    id: 1,
    icon: Car,
    title: "Wide Selection",
    description: "Thousands of verified vehicles from trusted dealerships and private sellers."
  },
  {
    id: 2,
    icon: Calendar,
    title: "Easy Test Drive",
    description: "Book a test drive online in minutes, with flexible scheduling options."
  },
  {
    id: 3,
    icon: Shield,
    title: "Secure Process",
    description: "Verified listings and secure booking process for peace of mind."
  }
]

const WhyChooseUs = () => {
  return (
    <section className="py-16">
      <div className="container  px-4">
        <h2 className="p-bold-24 text-center mb-12">
          Why Choose Our Platform
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div key={feature.id} className="text-center">
              <div className="bg-blue-100 text-blue-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 ">
                <feature.icon className="size-8" />
              </div>
              <h3 className="p-bold-20 mb-1">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs