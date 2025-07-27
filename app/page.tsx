// app/page.tsx ou pages/index.tsx (selon si t'es en App Router ou Pages Router)

import { Analytics } from "@vercel/analytics/react";

export default function Home() {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <iframe
        src="https://bento.me/aurelienlouvel"
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
