import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://faded.ro";
  return ["","/forum","/regulament","/magazin","/login","/register","/noutati","/suport","/search","/privacy"].map(route => ({
    url: `${base}${route}`, lastModified: new Date(), changeFrequency: "weekly", priority: route === "" ? 1 : 0.6,
  }));
}
