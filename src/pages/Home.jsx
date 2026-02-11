import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const staggerContainer = {
    visible: { transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="bg-white text-black font-sans selection:bg-black selection:text-white">
      
      
      <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden border-b-8 border-black">
        
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center z-0 grayscale hover:grayscale-0 transition-all duration-1000"
          style={{
            backgroundImage: "url('https://i.pinimg.com/originals/1b/8b/4f/1b8b4f3bd20f737ea9952615eb20490e.gif')",
          }}
        />
        <div className="absolute inset-0 bg-black/40 z-10"></div>

        
        <div className="relative z-20 text-center px-4">
          <motion.h1 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "backOut" }}
            className="text-7xl md:text-9xl font-black italic tracking-tighter text-white uppercase leading-none drop-shadow-[10px_10px_0px_rgba(0,0,0,1)]"
          >
            Under <br/> Ground
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <Link
              to="/products"
              className="group relative inline-block bg-white border-4 border-black px-12 py-4 text-xl font-black uppercase italic tracking-widest hover:bg-black hover:text-white transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-2 active:translate-y-2"
            >
              Enter the Void
            </Link>
          </motion.div>
        </div>

        
        <div className="absolute bottom-10 left-0 w-full overflow-hidden bg-black text-white py-2 z-20 rotate-[-2deg] scale-105 border-y-4 border-white">
          <div className="whitespace-nowrap animate-marquee font-black uppercase italic tracking-tighter text-2xl">
             LIMITED DROPS • HIGH QUALITY STREETWEAR • NO REPRINTS • UNDERGROUND CULTURE • 
             LIMITED DROPS • HIGH QUALITY STREETWEAR • NO REPRINTS • UNDERGROUND CULTURE • 
          </div>
        </div>
      </section>

      
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              title: "No Reprints",
              desc: "Once it's gone, it's dead. We believe in exclusivity.",
              tag: "01"
            },
            {
              title: "Raw Quality",
              desc: "Heavyweight fabrics designed to survive the streets.",
              tag: "02"
            },
            {
              title: "Secure Drop",
              desc: "Fast checkout and tracked shipping worldwide.",
              tag: "03"
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -10 }}
              className="relative p-8 border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] group"
            >
              <span className="absolute -top-6 -left-4 bg-black text-white px-4 py-1 font-black italic border-4 border-black group-hover:bg-red-600 transition-colors">
                {feature.tag}
              </span>
              <h3 className="text-3xl font-black uppercase italic mb-4">{feature.title}</h3>
              <p className="text-lg font-bold leading-tight text-gray-700">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      
      <section className="bg-black text-white py-24 border-y-8 border-black overflow-hidden relative">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            className="text-5xl md:text-7xl font-black uppercase italic mb-8 tracking-tighter"
          >
            Don't sleep on the next drop.
          </motion.h2>
          <Link
            to="/products"
            className="inline-block bg-red-600 border-4 border-white px-10 py-4 text-2xl font-black uppercase italic hover:bg-white hover:text-black transition-all shadow-[8px_8px_0px_0px_rgba(255,255,255,0.3)]"
          >
            Browse Collection
          </Link>
        </div>
        
        
        <div className="absolute top-0 left-0 opacity-10 text-[20rem] font-black pointer-events-none select-none italic leading-none">
          UG
        </div>
      </section>

      
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            display: inline-block;
            animation: marquee 15s linear infinite;
          }
        `}
      </style>
    </div>
  );
}