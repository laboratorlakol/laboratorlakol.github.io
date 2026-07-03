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

// CMS content (news, team, settings) lives in the database and can change
// any time from /admin — this page must read it fresh on every request,
// not get statically cached at build time.
export const revalidate = 30;

export default async function Home() {
  const [settings, teamMembers, newsPosts] = await Promise.all([
    getSiteSettings(),
    getTeamMembers(),
    getPublishedNews(),
  ]);

  return (
    <main className="relative">
      <Navbar />
      <Hero discordUrl={settings.discordInviteUrl} />
      <LiveStats />
      <About />
      <Features />
      <Gallery />
      <Team members={teamMembers} />
      <News posts={newsPosts} />
      <Footer discordUrl={settings.discordInviteUrl} />
    </main>
  );
}
