import { ImageResponse } from "next/og";
export const runtime = "edge";
export const alt = "FADED Romania Roleplay";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://faded.ro";
export default async function Image() {
  return new ImageResponse(
    <div style={{ width:"1200px", height:"630px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"#0a0a0a", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:"-150px", left:"300px", width:"600px", height:"600px", borderRadius:"50%", background:"radial-gradient(circle, rgba(78,255,58,0.20) 0%, transparent 70%)" }} />
      <img src={`${SITE_URL}/logo/faded-logo.png`} alt="FADED Logo" width={150} height={150} style={{ borderRadius:"50%", marginBottom:"30px" }} />
      <div style={{ fontSize:"80px", fontWeight:900, color:"#4EFF3A", letterSpacing:"6px", textTransform:"uppercase", textShadow:"0 0 50px rgba(78,255,58,0.55)", marginBottom:"6px" }}>FADED</div>
      <div style={{ fontSize:"30px", fontWeight:400, color:"#D9D9D9", letterSpacing:"4px", textTransform:"uppercase" }}>ROMANIA ROLEPLAY</div>
      <div style={{ fontSize:"18px", color:"#666", marginTop:"22px", letterSpacing:"1px" }}>Experiența roleplay premium din România</div>
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"3px", background:"linear-gradient(90deg, transparent 0%, #4EFF3A 50%, transparent 100%)" }} />
    </div>,
    { width: 1200, height: 630 }
  );
}
