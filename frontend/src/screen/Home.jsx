import React from 'react'
import Navbar from '../components/Navbar'
import Card from '../components/Card'

import Footer from '../components/footer'



function Home() {
   return (
    <div className="flex flex-col min-h-screen bg-base-100 ">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-6">
        <Card />
      </main>
      <footer  className="bg-neutral text-neutral-content p-4 text-center">
        <Footer />
      </footer>
    </div>
  )
}

export default Home