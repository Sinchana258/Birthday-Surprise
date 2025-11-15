// src/App.jsx
import React, { useEffect, useMemo, useState } from "react";
import { PartyPopper, Share2, Printer, Heart, Image as ImageIcon, Music, Info } from "lucide-react";
import "./custom.css"; // your petal CSS (must include .petal and @keyframes petalFall)

// Local images (put these exact files in src/assets/)
import argImg from "./assets/argument.jpg";
import foodImg from "./assets/biryani.jpeg";
import movieImg from "./assets/movie.jpg";
import choreImg from "./assets/chore.jpg";
import visitImg from "./assets/visit.jpeg";

/* ----------------- Config ----------------- */
const FRIEND_NAME = "Ranjj";
const THEME = { accent: "from-fuchsia-500 via-pink-500 to-rose-500", emoji: "🩵" };
// !! PASTE YOUR FRIEND'S SPOTIFY PLAYLIST ID HERE !!
const SPOTIFY_PLAYLIST_ID = "37i9dQZF1E8OaG4d0v8N9f";
const DEFAULT_FLIPBOOK_URL = "https://heyzine.com/flip-book/d80cbd2e37.html"; // Default used on first load/if link is cleared


const PASSES = [
  { id: "argument-immunity", title: "Argument Immunity ", description: "You automatically win the argument. I must agree — no debates. even if you are wrong", image: argImg },
  { id: "food-treat", title: "Food Treat ", description: "I will take you to your fav Restaurant or order for you whatever you want instantly.", image: foodImg },
  { id: "movie-night", title: "Movie Night ", description: "I will take you to one  movie. You will pick the movie and the place.", image: movieImg },
  { id: "chore-pass", title: "Make Me Do Your Chore ", description: "I’ll do any one of your task or work . Loudly complain while I do it.", image: choreImg },
  { id: "visit-home", title: "Home Visit", description: "I will come to your home Again. Actually this is my pass😉 ", image: visitImg },
];

const STORAGE_KEY = "birthday-pass-website:v1";
const FLIP_LINK_KEY = "birthday-pass-fliplink:v1";

/* ----------------- Helpers ----------------- */
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

/* Background gradient layer (separate so petals are visible) */
function BackgroundGradient() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        background: "linear-gradient(180deg, rgba(253,242,248,1) 0%, rgba(250,245,255,1) 100%)",
      }}
    />
  );
}

/* Petals only (no confetti) — uses classes from custom.css */
function PetalField() {
  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 5, overflow: "hidden" }}>
      {Array.from({ length: 28 }).map((_, i) => {
        const left = Math.floor(Math.random() * 100);
        const delay = (i % 7) * 0.6 + Math.random() * 0.8;
        const dur = 9 + Math.random() * 8;
        const hue = 320 + Math.floor(Math.random() * 40);
        const size = 10 + Math.floor(Math.random() * 18);
        return (
          <div
            key={i}
            className="petal"
            style={{
              left: `${left}vw`,
              width: `${size}px`,
              height: `${Math.round(size * 1.3)}px`,
              animation: `petalFall ${dur}s linear ${delay}s infinite`,
              background: `linear-gradient(135deg, hsla(${hue},80%,88%,0.95), hsla(${hue + 20},70%,72%,0.9))`,
              transform: `rotate(${Math.random() * 60 - 30}deg)`,
            }}
          />
        );
      })}
    </div>
  );
}

/* Small UI blocks */
function Card({ children, className = "" }) {
  // Enhanced Card with backdrop-blur and a subtle white border for floating feel
  return (
    <div className={`relative z-10 rounded-3xl shadow-2xl p-6 bg-white/95 backdrop-blur-sm border border-white/50 ${className}`}>
      {children}
    </div>
  );
}

function PassCard({ pass, redeemed, onRedeem }) {
  const isRedeemed = Boolean(redeemed?.date);
  return (
    <Card className={`overflow-hidden border ${isRedeemed ? "opacity-70" : ""}`}>
      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        {/* Improved image height for better mobile responsiveness and grayscale effect on redeemed */}
        <div className={`w-full md:w-64 h-40 sm:h-64 rounded-xl overflow-hidden flex-shrink-0 transform transition-transform hover:scale-105 ${isRedeemed ? "grayscale" : ""}`}>
          {pass.image ? <img src={pass.image} alt={`${pass.title} image`} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl">{pass.title.charAt(0)}</div>}
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-2xl">{pass.title}</h3>
            <p className="mt-2 text-gray-600 text-sm">{pass.description}</p>
            <p className="mt-3 text-xs text-gray-400">Use within 1 year · Redeem in person or show this page.</p>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm font-semibold px-3 py-1 rounded-full bg-black/5">{isRedeemed ? "Redeemed" : "Available"}</span>
            <div className="flex items-center gap-3">
              <button
                disabled={isRedeemed}
                onClick={() => onRedeem(pass.id)}
                // Added hover/transition effect for Redeem button
                className={`px-4 py-2 rounded-2xl text-sm font-semibold transition hover:scale-[1.03] ${isRedeemed
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : `bg-gradient-to-r ${THEME.accent} text-white hover:brightness-105`}`}
              >
                {isRedeemed ? "Used" : "Redeem"}
              </button>
              <button onClick={() => alert(`${pass.title}\n\n${pass.description}`)} className="px-3 py-2 rounded-md bg-white/90 shadow text-sm flex items-center gap-2 hover:bg-gray-100 transition-colors">
                <Info className="w-4 h-4" /> Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ----------------- App ----------------- */
export default function BirthdayPassSite() {
  const [state, setState] = useLocalState(STORAGE_KEY, { redeemed: {} });
  const [flipLink, setFlipLink] = useLocalState(FLIP_LINK_KEY, DEFAULT_FLIPBOOK_URL);
  const [localFlipInput, setLocalFlipInput] = useState(flipLink || "");

  const allRedeemed = useMemo(() => PASSES.every((p) => state.redeemed[p.id]?.date), [state]);

  function redeem(id) {
    const confirmed = confirm("Are you sure you want to redeem this pass now? The power will be used! (You can ask nicely to un-redeem later.)");
    if (!confirmed) return;
    setState((s) => ({ ...s, redeemed: { ...s.redeemed, [id]: { date: Date.now() } } }));
  }

  function resetAll() {
    const ok = confirm("Reset all passes to Available?");
    if (!ok) return;
    setState({ redeemed: {} });
  }

  function saveFlipLink() {
    const url = localFlipInput.trim();
    if (!url) return alert("Paste a valid flipbook URL (Heyzine or any shareable URL).");
    setFlipLink(url);
    alert("Flipbook link saved! Refresh the page to see changes if needed.");
  }

  function clearFlipLink() {
    setLocalFlipInput("");
    setFlipLink(DEFAULT_FLIPBOOK_URL);
    alert("Flipbook link reset to default.");
  }

  // Spotify Embed URL using the defined ID
  const spotifyEmbedUrl = "https://open.spotify.com/embed/playlist/3tc4TLYRYfvrhiT9J7TBEB?utm_source=generator";

  return (
    <>
      <BackgroundGradient />
      <PetalField />

      <div style={{ position: "relative", zIndex: 10 }} className="min-h-screen text-gray-900 p-6 overflow-x-hidden">

        {/* ENHANCED HEADER SECTION */}
        <header className="max-w-6xl mx-auto text-center py-8 relative" style={{ zIndex: 11 }}>

          {/* Celebratory Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 shadow-md backdrop-blur-sm text-sm font-medium border border-pink-200/50`}>
            <PartyPopper className="w-4 h-4 text-pink-500" />
            <span className="text-gray-800">Happy Happy Happy Birthday {FRIEND_NAME}! {THEME.emoji}</span>
          </div>

          <h1 className="mt-6 text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-fuchsia-600 to-rose-500">🫶🏻HAPPIEST BIRTHDAY, RANJJ 🎂🫶🏻 </h1>
          <p className="mt-3 text-gray-700 max-w-2xl mx-auto text-lg">No sweets — just power, memories, and small promises. Use them when you want.</p>

          <div className="mt-6 flex items-center justify-center gap-3">
            {/* Enhanced Button Styling */}
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Link copied"); }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white shadow-md hover:scale-[1.03] transition-transform">
              <Share2 className="w-4 h-4" /> Share
            </button>
            <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white shadow-md hover:scale-[1.03] transition-transform">
              <Printer className="w-4 h-4" /> Print
            </button>
            {/* Reset button distinguished visually */}
            <button onClick={resetAll} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white shadow-md text-gray-500 hover:text-red-500 hover:scale-[1.03] transition-transform">
              Reset Passes
            </button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto" style={{ zIndex: 11 }}>

          {/* Passes Section */}
          <section className="grid md:grid-cols-2 gap-6">
            {PASSES.map((p) => (
              <div key={p.id}>
                <PassCard pass={p} redeemed={state.redeemed[p.id]} onRedeem={redeem} />
              </div>
            ))}
          </section>

          {/* All Redeemed Message */}
          {allRedeemed && (
            <div className="mt-8">
              <Card>
                <div className="flex items-start gap-3">
                  <Heart className="w-6 h-6 mt-1 text-red-500" />
                  <div>
                    <h3 className="font-semibold text-lg">You used ALL the power. Proud of you.</h3>
                    <p className="text-sm text-gray-600">New season releases soon… if you’re nice to me.</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Flipbook embed (Now using dynamic URL) */}
          <section className="mt-10">
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <ImageIcon className="w-5 h-5" />
                <div>
                  <h2 className="text-xl font-semibold">❤️Tiny Moments, Big Memories❤️</h2>
                  <p className="text-sm text-gray-600">These pages aren’t perfect pictures. They may look simple, but every picture holds a memory I’m genuinely grateful for.🤗</p>
                </div>
              </div>

              <div className="w-full overflow-hidden rounded-xl shadow-lg border bg-white">
                <iframe
                  allowFullScreen
                  allow="clipboard-write"
                  scrolling="no"
                  className="fp-iframe"
                  // Uses the saved link, or falls back to the default
                  src={flipLink || DEFAULT_FLIPBOOK_URL}
                  style={{ border: "1px solid lightgray", width: "100%", height: "420px" }}
                  title="Flipbook of Our Shared Memories"
                />
              </div>

              <div className="mt-4 flex gap-2 items-center">
                <input value={localFlipInput} onChange={(e) => setLocalFlipInput(e.target.value)} placeholder="Paste flipbook URL" className="px-3 py-2 border rounded flex-1" />
                <button onClick={saveFlipLink} className="px-3 py-2 rounded bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:brightness-105">Save</button>
                <button onClick={clearFlipLink} className="px-3 py-2 rounded bg-white shadow hover:bg-gray-100">Clear</button>
              </div>
            </Card>
          </section>

          {/* Spotify (Now conditionally rendered) */}
          <section className="mt-10">
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <Music className="w-5 h-5" />
                <h2 className="text-xl font-semibold">A Playlist Just For You ( Songs I thought you might like )</h2>
              </div>

              {SPOTIFY_PLAYLIST_ID ? (
                <div className="w-full overflow-hidden rounded-xl shadow-lg">
                  <iframe
                    data-testid="embed-iframe"
                    style={{ borderRadius: 12 }}
                    // Uses the dynamic Spotify URL
                    src={spotifyEmbedUrl}
                    width="100%"
                    height="352"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    title="Spotify birthday playlist"
                  />
                </div>
              ) : (
                <p className="text-center text-gray-500 p-4 border border-dashed rounded-xl">
                  (Please add a Spotify Playlist ID in the configuration to activate this section)
                </p>
              )}
            </Card>
          </section>


          <footer className="text-center text-xs text-gray-500 mt-8 pb-8">Made with drama & patience. If this made you smile, mission complete.</footer>
        </main>
      </div>
    </>
  );
}