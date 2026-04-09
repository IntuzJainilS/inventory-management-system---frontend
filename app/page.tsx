import Image from "next/image";
import landingPage from "@/public/landing page.jpg"
import img1 from "@/public/img1.jpg"
import img2 from "@/public/img2.jpg"
import img4 from "@/public/img4.png"
import Navbar from "./components/Navbar";
import Footer from "./components/footer";

export default function Home() {
  return (
  <div className="h-screen overflow-hidden flex flex-col bg-slate-50 text-slate-900 font-sans">
    <Navbar />
    
    <main className="grow flex flex-col justify-center">
      
      <section className="max-w-5xl mx-auto px-6 py-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
          Welcome to <span className="text-blue-600">Inventory Management</span>
        </h1>
        <h3 className="text-xl md:text-2xl font-semibold text-slate-600 mb-4">
          Take Control of Your Stock. Scale Your Business.
        </h3>
        <p className="text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Real-time inventory tracking, automated restocking, and detailed analytics—all in one place. 
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="flex flex-col items-center text-center">
            <div className="overflow-hidden rounded-2xl mb-4 shadow-md">
              <Image src={img1} alt="Dashboard" height={220} width={240} className="object-cover" />
            </div>
            <h4 className="text-lg font-bold mb-1">Goodbye Spreadsheets</h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              Track, manage, and optimize your inventory from anywhere.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="overflow-hidden rounded-2xl mb-4 shadow-md">
              <Image src={img2} alt="Alerts" height={220} width={240} className="object-cover" />
            </div>
            <h4 className="text-lg font-bold mb-1 mt-4">Smart Syncing</h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              Get smart alerts and seamless multi-channel syncing.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="overflow-hidden rounded-2xl mb-4 shadow-md">
              <Image src={img4} alt="Fulfillment" height={200} width={220} className="object-cover" />
            </div>
            <h4 className="text-lg font-bold mb-1">Faster Fulfillment</h4>
            <p className="text-slate-600 text-xs leading-relaxed">
              Accurate order fulfillment means happier customers.
            </p>
          </div>

        </div>
      </section>
    </main>

    <Footer />
  </div>
);
}
