// src/App.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  PartyPopper,
  Share2,
  Printer,
  Heart,
  Image as ImageIcon,
  Music,
  MapPin,
  Trash2,
  Info,
} from "lucide-react";

/**
 * Clean, self-contained Birthday Pass site
 * - Big redeem cards with images + descriptions
 * - Petal background effect
 * - Flipbook link placeholder (no uploads)
 * - Spotify playlist embed
 * - LocalStorage persistence
 */

const FRIEND_NAME = "Ranjitha (Ranjj)";
const THEME = { accent: "from-fuchsia-500 via-pink-500 to-rose-500", emoji: "💚" };

const PASSES = [
  {
    id: "argument-immunity",
    title: "Argument Immunity Pass",
    description: "You automatically win the argument. I must agree — no debates.",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=9b872d0f6f3f5b0b2c8c3a5f0f6c6b3d",
  },
  {
    id: "food-treat",
    title: "Food Treat Pass",
    description: "Take me to my fav food or order it instantly — fries and savoury first.",
    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=3f9f8b6c2c9b6a4d6e8b3c2a1f2d3a4b",
  },
  {
    id: "movie-night",
    title: "Movie Night Pass",
    description: "One stupid/fun movie night (or we pretend to). You pick the place.",
    image:
      "https://images.unsplash.com/photo-1517604931442-7fbc9a9f5d2b?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=0c2b7b7d8f2d7a8c6b1f4e9a6c9b8d7f",
  },
  {
    id: "chore-pass",
    title: "Make Me Do Your Chore Pass",
    description: "I’ll do one chore you pick. Loudly complain while I do it.",
    image:
      "https://images.unsplash.com/photo-1484981184820-2e84ea0e2b6f?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d",
  },
  {
    id: "visit-home",
    title: "I Will Visit Your Home Pass",
    description: "I will come to your home — for my peace and your happiness. Bring snacks.",
    image:
      "https://images.unsplash.com/photo-1505691723518-36a6b845f0b6?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e",
  },
];

const STORAGE_KEY = "birthday-pass:v1";
const FLIP_LINK_KEY = "birthday-pass-fliplink:v1";

function useLocalState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch { }
  }, [key, value]);
  return [value, setValue];
}

function PetalField() {
  // simple animated petals (CSS-only) — decorative background
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <style>{`
        .petal { position: absolute; top: -10%; width: 18px; height: 18px; border-radius: 60% 40% 50% 50%; opacity: 0.9; }
        @keyframes fall { 0% { transform: translateY(-10vh) rotate(0deg) scale(0.6); opacity: 1 } 100% { transform: translateY(120vh) rotate(360deg) scale(1); opacity: 0.25 } }
      `}</style>
      {Array.from({ length: 16 }).map((_, i) => {
        const left = Math.round(Math.random() * 100);
        const delay = (i % 6) * 0.6;
        const dur = 8 + Math.random() * 8;
        const hue = 320 + Math.floor(Math.random() * 30);
        return (
          <div
            key={i}
            className="petal"
            style={{
              left: `${left}vw`,
              animation: `fall ${dur}s linear ${delay}s infinite`,
              background: `linear-gradient(135deg, hsla(${hue},70%,88%,0.95), hsla(${hue + 20},70%,72%,0.85))`,
              transform: `rotate(${Math.random() * 50 - 25}deg)`,
            }}
          />
        );
      })}
    </div>
  );
}

function Card({ children, className = "" }) {
  return <div className={`rounded-2xl shadow-2xl p-5 bg-white/95 ${className}`}>{children}</div>;
}

function PassCard({ pass, redeemed, onRedeem }) {
  const isRedeemed = Boolean(redeemed?.date);
  return (
    <Card className={`overflow-hidden border ${isRedeemed ? "opacity-60" : ""}`}>
      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        <div className="w-full md:w-56 h-56 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          {pass.image ? (
            // eslint-disable-next-line jsx-a11y/img-redundant-alt
            <img src={pass.image} alt={`${pass.title} image`} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">{pass.title.charAt(0)}</div>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-2xl">{pass.title}</h3>
            <p className="mt-2 text-gray-600 text-sm">{pass.description}</p>
            <p className="mt-3 text-xs text-gray-400">Use within 1 year · Redeem in person or show this page.</p>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm font-semibold px-3 py-1 rounded-full bg-black/5">{isRedeemed ? "Redeemed" : "Available"}</span>
            <div className="flex items-center gap-2">
              <button
                disabled={isRedeemed}
                onClick={() => onRedeem(pass.id)}
                className={`px-4 py-2 rounded-2xl text-sm font-semibold transition ${isRedeemed ? "bg-gray-200 text-gray-500 cursor-not-allowed" : `bg-gradient-to-r ${THEME.accent} text-white hover:brightness-105`}`}
              >
                {isRedeemed ? "Used" : "Redeem"}
              </button>
              <button
                onClick={() => alert(`${pass.title}\n\n${pass.description}`)}
                className="px-3 py-2 rounded-md bg-white/90 shadow text-sm flex items-center gap-2"
              >
                <Info className="w-4 h-4" /> Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function App() {
  const [state, setState] = useLocalState(STORAGE_KEY, { redeemed: {} });
  const [flipLink, setFlipLink] = useLocalState(FLIP_LINK_KEY, "");
  const [localFlipInput, setLocalFlipInput] = useState(flipLink || "");

  const allRedeemed = useMemo(() => PASSES.every((p) => state.redeemed[p.id]?.date), [state]);

  function redeem(id) {
    const ok = confirm("Redeem this pass now? You can't undo this.");
    if (!ok) return;
    setState((s) => ({ ...s, redeemed: { ...s.redeemed, [id]: { date: Date.now() } } }));
  }

  function resetAll() {
    const ok = confirm("Reset all passes?");
    if (!ok) return;
    setState({ redeemed: {} });
  }

  function saveFlipLink() {
    const url = localFlipInput.trim();
    if (!url) return alert("Paste a valid flipbook URL (Heyzine or any host).");
    setFlipLink(url);
    alert("Flipbook link saved!");
  }

  function clearFlipLink() {
    setLocalFlipInput("");
    setFlipLink("");
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 text-gray-900 p-6 overflow-x-hidden">
      <PetalField />

      <header className="max-w-6xl mx-auto text-center py-8">
        <div className={`inline-flex items-center gap-3 px-5 py-3 rounded-full bg-gradient-to-r ${THEME.accent} text-white shadow-lg`}>
          <PartyPopper className="w-5 h-5" />
          <span className="text-sm font-medium">Happy Birthday {FRIEND_NAME}! {THEME.emoji}</span>
        </div>

        <h1 className="mt-6 text-5xl font-extrabold tracking-tight">Your 5 Redeemable Passes</h1>
        <p className="mt-3 text-gray-600 max-w-2xl mx-auto">No sweets — just power, memories, and small promises. Use them when you want.</p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Link copied"); }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white shadow">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white shadow">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button onClick={resetAll} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white shadow">
            Reset
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        <section className="grid md:grid-cols-2 gap-6">
          {PASSES.map((p) => (
            <div key={p.id}>
              <PassCard pass={p} redeemed={state.redeemed[p.id]} onRedeem={redeem} />
            </div>
          ))}
        </section>

        {allRedeemed && (
          <div className="mt-8">
            <Card>
              <div className="flex items-start gap-3">
                <Heart className="w-6 h-6 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">You used ALL the power. Proud of you.</h3>
                  <p className="text-sm text-gray-600">New season releases soon… if you’re nice to me.</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Letter */}
        <section className="mt-10">
          <Card>
            <div className="flex items-center gap-3 mb-3">
              <Heart className="w-5 h-5" />
              <h2 className="text-xl font-semibold">A Short Letter</h2>
            </div>
            <pre className="whitespace-pre-wrap leading-relaxed text-gray-700 text-sm md:text-base">{`Dear ${FRIEND_NAME},

You do so many small things for me every day — holding my things, waiting for me in class, reserving my seat, bringing lunch or snacks, helping with project work, listening to my rants, and gossiping with me until you finally say “Classic Namgyake.”

You share things with me that you don’t share with others. You walk, talk, and eat everything on the way, and somehow make it all funny. The way you love your family — I really respect that.

I still remember the day I was stressed with a project and told you to tell me later. You cried — and I hated that I made you cry. But it also made me realize how much I matter to you, and that means a lot.

Whenever your friends tease you by calling me your only best friend, and you just agree without pretending — I love that you accept the truth so confidently.

We’ve been together for 3 years and we’re still going strong. Sorry for getting you in trouble when I laugh in class. And thanks for making those boring lectures bearable.

So... happy birthday, Ranjj 😉

— your permanent clown & bodyguard`}</pre>
          </Card>
        </section>

        {/* Flipbook link placeholder */}
        <section className="mt-10">
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <ImageIcon className="w-5 h-5" />
              <div>
                <h2 className="text-xl font-semibold">Tiny Moments, Big Memories</h2>
                <p className="text-sm text-gray-600">A small flipbook of the moments we’ve shared — funny ones, random ones, and the ones that became special.</p>
              </div>
            </div>

            <div className="mt-4 grid md:grid-cols-3 gap-4 items-start">
              <div className="md:col-span-2">
                <div className="w-full h-48 rounded-xl bg-gradient-to-r from-pink-50 to-rose-50 border-dashed border-2 border-gray-200 flex items-center justify-center text-gray-400">
                  {flipLink ? (
                    <a href={flipLink} target="_blank" rel="noreferrer" className="text-sm underline text-pink-600">Open flipbook link</a>
                  ) : (
                    <div className="text-center">
                      <p className="font-medium">No flipbook link yet</p>
                      <p className="text-xs">Upload your flipbook to Heyzine or any host and paste the share URL here.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <input value={localFlipInput} onChange={(e) => setLocalFlipInput(e.target.value)} placeholder="Paste Heyzine / flipbook URL" className="px-3 py-2 border rounded" />
                <div className="flex gap-2">
                  <button onClick={saveFlipLink} className="px-3 py-2 rounded bg-gradient-to-r from-pink-500 to-rose-500 text-white">Save Link</button>
                  <button onClick={clearFlipLink} className="px-3 py-2 rounded bg-white shadow">Clear</button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Spotify Playlist */}
        <section className="mt-10">
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <Music className="w-5 h-5" />
              <h2 className="text-xl font-semibold">A Playlist Just For You</h2>
            </div>
            <p className="text-sm text-gray-600 mb-3">Songs you’ll like. Songs that remind me of you. Play it while flipping the pages.</p>

            <div className="w-full overflow-hidden rounded-xl shadow-lg">
              <iframe
                data-testid="embed-iframe"
                style={{ borderRadius: 12 }}
                src="https://open.spotify.com/embed/playlist/3tc4TLYRYfvrhiT9J7TBEB?utm_source=generator"
                width="100%"
                height="352"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="Spotify playlist"
              ></iframe>
            </div>
          </Card>
        </section>

        {/* Little extras */}
        <section className="mt-10">
          <Card>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5" />
              <div>
                <h3 className="font-semibold">Little Extras</h3>
                <p className="text-sm text-gray-600">Attach the Amul dark chocolate & lava cake next to the bouquet. Add the redeem cards into an envelope. Don’t forget the handwritten letter inside the pop-up card.</p>
              </div>
            </div>
          </Card>
        </section>

        <footer className="text-center text-xs text-gray-500 mt-12 pb-10">Made with drama & patience. If this made you smile, mission complete.</footer>
      </main>
    </div>
  );
}
