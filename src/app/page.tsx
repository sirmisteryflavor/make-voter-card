import VoterCardGenerator from "@/components/VoterCardGenerator";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";

export const metadata = {
  title: `${APP_NAME} | Social Voter Card Generator`,
  description: APP_DESCRIPTION,
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDF6EC]">
      {/* Subtle potato pattern background */}
      <div
        className="fixed inset-0 opacity-3 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #A68A5B 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Header */}
      <header className="border-b border-[#E8D5B8] bg-[#FFFCF5]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🥔</span>
            <div>
              <h1 className="text-lg font-semibold text-[#3D2E16]">{APP_NAME}</h1>
            </div>
          </div>
          <p className="text-xs text-[#8B7355] font-medium">Voter Card Generator</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#3D2E16]">
              Create Your Voter Card
            </h2>
            <p className="text-sm text-[#8B7355] mt-2">
              Share your voting decisions on Instagram, Facebook, and TikTok
            </p>
          </div>

          <VoterCardGenerator />
        </div>

        {/* Footer */}
        <footer className="mt-20 py-8 border-t border-[#E8D5B8] text-center text-[#8B7355] text-sm relative z-10">
          <p>&copy; {new Date().getFullYear()} {APP_NAME} - Keep democracy starchy.</p>
        </footer>
      </main>
    </div>
  );
}
