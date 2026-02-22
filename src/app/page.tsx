import VoterCardGenerator from "@/components/VoterCardGenerator";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";

export const metadata = {
  title: `${APP_NAME} | Social Voter Card Generator`,
  description: APP_DESCRIPTION,
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-potato-light text-potato-dark selection:bg-hyper selection:text-white pb-12">
      {/* Subtle potato pattern background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.15]"
        style={{
          backgroundImage: "radial-gradient(circle, #A68A5B 2px, transparent 2px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Main Content */}
      <main className="relative z-10 pt-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-left mb-12 flex flex-col items-center">
            <div className="inline-block relative group cursor-pointer mb-6">
              <div className="absolute inset-0 bg-hyper translate-x-1 translate-y-1 rounded-2xl group-hover:translate-x-2 group-hover:translate-y-2 transition-transform" />
              <div className="relative bg-sprout border-4 border-potato-dark px-8 py-3 rounded-2xl transform -rotate-2 group-hover:-rotate-3 transition-transform flex items-center gap-3">
                <span className="text-5xl md:text-6xl origin-bottom group-hover:rotate-12 transition-transform">🥔</span>
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-potato-dark mix-blend-multiply">
                  {APP_NAME}
                </h1>
              </div>
            </div>

            <h2 className="text-4xl md:text-3xl font-black text-potato-dark uppercase tracking-tight mt-4 max-w-2xl mx-auto leading-[1.1]">
              Create and Share your potato.
            </h2>
            <p className="text-lg md:text-xl text-potato-muted font-bold mt-4 max-w-xl mx-auto">
              The easiest way to share your voting decisions with your friends. Generate your ballot by filling the form below and click generate.
            </p>
          </div>

          <VoterCardGenerator />
        </div>

        {/* Footer */}
        <footer className="mt-20 py-8 text-center text-potato-muted text-sm font-bold relative z-10">
          <p>&copy; {new Date().getFullYear()} {APP_NAME} <span className="mx-2">—</span> Keep democracy starchy.</p>
        </footer>
      </main>
    </div>
  );
}
