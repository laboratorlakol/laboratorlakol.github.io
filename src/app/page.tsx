import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { LiveStats } from "@/components/sections/live-stats";
import { About } from "@/components/sections/about";
import { Features } from "@/components/sections/features";
import { Gallery } from "@/components/sections/gallery";
import { Team } from "@/components/sections/team";
import { News } from "@/components/sections/news";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <LiveStats />
      <About />
      <Features />
      <Gallery />
      <Team />
      <News />
      <Footer />
    </main>
  );
}
