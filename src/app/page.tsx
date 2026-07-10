import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { LiveStats } from "@/components/sections/live-stats";
import { About } from "@/components/sections/about";
import { Features } from "@/components/sections/features";
import { Gallery } from "@/components/sections/gallery";
import { Team } from "@/components/sections/team";
import { News } from "@/components/sections/news";
import { Footer } from "@/components/sections/footer";
import { getSiteSettings, getTeamMembers, getPublishedNews } from "@/lib/cms";
export const revalidate = 30;
export default async function Home() {
  const [settings, teamMembers, newsPosts] = await Promise.all([getSiteSettings(), getTeamMembers(), getPublishedNews()]);
  return (
    <main className="relative">
      <Navbar/>
      <Hero discordUrl={settings.discordInviteUrl}/>
      <LiveStats/>
      <About/>
      <Features/>
      <Gallery/>
      <Team members={teamMembers.map(m=>({id:m.id,name:m.name,role:m.role,avatarUrl:m.avatarUrl}))}/>
      <News posts={newsPosts.map(p=>({id:p.id,title:p.title,excerpt:p.excerpt,category:p.category}))}/>
      <Footer discordUrl={settings.discordInviteUrl}/>
    </main>
  );
}
