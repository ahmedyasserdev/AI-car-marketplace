import Link from '@/components/shared/Link'
import { Button } from '@/components/ui/button'
import { SignedOut } from '@clerk/nextjs'
import React from 'react'

const CTA = () => {
  return (
    <section className="py-16 dotted-background text-white">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-3xl font-bold mb-4">
        Ready to Find Your Dream Car?
      </h2>
      <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
        Join thousands of satisfied customers who found their perfect
        vehicle through our platform.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button size="lg" variant="secondary" >
          <Link href="/cars">View All Cars</Link>
        </Button>
        <SignedOut>
          <Button size="lg" >
            <Link href="/sign-up">Sign Up Now</Link>
          </Button>
        </SignedOut>
      </div>
    </div>
  </section>
  )
}

export default CTA