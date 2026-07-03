import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { getSiteSettings } from "@/lib/cms";
import { prisma } from "@/lib/prisma";
import { PostContent } from "@/components/forum/post-content";

export const revalidate = 60;

export default async function RegulamentPage() {
  const [chapters, settings] = await Promise.all([
    prisma.regulationChapter.findMany({
      orderBy: { position: "asc" },
      include: { articles: { orderBy: { position: "asc" } } },
    }),
    getSiteSettings(),
  ]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-void px-6 pt-32 pb-24">
        <div className="mx-auto max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-signal">
            Regulament
          </span>
          <h1 className="font-display uppercase text-3xl mt-3">
            Regulamentul serverului
          </h1>

          {chapters.length === 0 ? (
            <p className="mt-10 text-center text-sm text-ink-faint">
              Regulamentul este în curs de redactare. Revino mai târziu.
            </p>
          ) : (
            <div className="mt-10 space-y-10">
              {chapters.map((chapter, i) => (
                <section key={chapter.id} id={chapter.id}>
                  <h2 className="font-display uppercase text-xl text-signal text-glow">
                    Capitolul {i + 1} — {chapter.title}
                  </h2>
                  <div className="mt-4 space-y-4">
                    {chapter.articles.length === 0 && (
                      <p className="text-sm text-ink-faint">Niciun articol încă.</p>
                    )}
                    {chapter.articles.map((article, j) => (
                      <div key={article.id} className="panel rounded-md p-5">
                        <h3 className="font-medium text-sm">
                          Art. {j + 1} — {article.title}
                        </h3>
                        <div className="mt-2">
                          <PostContent content={article.content} />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer discordUrl={settings.discordInviteUrl} />
    </>
  );
}
