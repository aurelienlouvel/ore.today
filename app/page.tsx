import { Analytics } from "@vercel/analytics/react";

export default function Home() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <iframe
        src="https://aurelienlouvel-ore.notion.site/portfolio"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        title="Bento profile"
        loading="lazy"
      />
      <Analytics />
    </div>
  );
}
