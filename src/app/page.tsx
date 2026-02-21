import VoterCardGenerator from "@/components/VoterCardGenerator";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";

export const metadata = {
  title: `${APP_NAME} | Social Voter Card Generator`,
  description: APP_DESCRIPTION,
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#F9F9F9] p-4 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-5xl font-black italic tracking-tighter text-slate-900">
            POTATO<span className="text-yellow-500">VOTES</span>
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Make your ballot social. Pick a potato, share your picks.
          </p>
        </header>

        <VoterCardGenerator />
        
        <footer className="mt-20 py-8 border-t border-slate-200 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} PotatoVotes - Keep democracy starchy.</p>
        </footer>
      </div>
    </main>
  );
}
