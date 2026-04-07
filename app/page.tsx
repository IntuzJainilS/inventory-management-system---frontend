import Image from "next/image";
import landingPage from "@/public/landing page.jpg"
import img1 from "@/public/img1.jpg"
import img2 from "@/public/img2.jpg"
import img4 from "@/public/img4.png"
import Navbar from "./components/Navbar";
import Footer from "./components/footer";

export default function Home() {
  return (
  <>
  <Navbar/>
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* --- HERO SECTION --- */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">
          Welcome to <span className="text-blue-600">Inventory Management</span>
        </h1>
        <h3 className="text-2xl font-semibold text-slate-600 mb-6">
          Take Control of Your Stock. Scale Your Business.
        </h3>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Real-time inventory tracking, automated restocking, and detailed analytics—all in one place. 
          Stop guessing and start growing with a system built for speed.
        </p>
       
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          
          <div className="flex flex-col items-center text-center group">
            <div className="overflow-hidden rounded-2xl mb-6 shadow-md transition group-hover:shadow-xl">
              <Image src={img1} alt="Dashboard" height={250} width={260} className="object-cover w-auto h-auto" />
            </div>
            <div className="mt-3">
              <h4 className="text-xl font-bold mb-2">Goodbye Spreadsheets</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              Track, manage, and optimize your inventory from anywhere, on any device. Cloud-syncing keeps you mobile.
            </p>
            </div>
            
          </div>

          <div className="flex flex-col items-center text-center group">
            <div className="overflow-hidden rounded-2xl mb-6 shadow-md transition group-hover:shadow-xl">
              <Image src={img2} alt="Alerts" height={250} width={260} loading="eager" className="object-cover w-auto h-auto" />
            </div>
            <div className="mt-8">
              <h4 className="text-xl font-bold mb-2">Smart Syncing</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              Get smart alerts, accurate stock levels, and seamless multi-channel syncing to prevent overselling.
            </p>
            </div>
            
          </div>

          <div className="flex flex-col items-center text-center group">
            <div className="overflow-hidden rounded-2xl mb-6 shadow-md transition group-hover:shadow-xl">
              <Image src={img4} alt="Fulfillment" height={270} width={250} className="object-cover w-auto h-auto" />
            </div>
            <div className="mt-12">
              <h4 className="text-xl font-bold mb-2">Faster Fulfillment</h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              Accurate order fulfillment means happier customers, fewer returns, and a more reputable brand.
            </p>
            </div>
            
          </div>

        </div>
      </section>
    </div>
    <Footer/>
  </>
  );
}
