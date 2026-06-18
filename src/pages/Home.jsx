import { Link } from "react-router-dom";
import { SearchBar } from "../components/search/SearchBar";
import { Card } from "../components/ui/card";
import { usePageTitle } from "../hooks/usePageTitle";
import useStore from "../store/useStore";

export function Home() {
  usePageTitle("");
  const recentlyViewed = useStore((s) => s.recentlyViewed);
  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      <section className="relative max-w-3xl mx-auto px-4 py-16 md:py-24 text-center overflow-hidden">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[var(--color-gold)]/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute top-40 -left-20 w-[200px] h-[200px] bg-[var(--color-gold)]/5 rounded-full blur-[60px] pointer-events-none" />
        <div className="absolute top-40 -right-20 w-[200px] h-[200px] bg-[var(--color-gold)]/10 rounded-full blur-[60px] pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 glass border border-[var(--color-gold)]/20 rounded-full text-sm text-[var(--color-gold)] mb-6 animate-fade-in-up">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] animate-pulse" />
            A Wiki Definitiva dos Clássicos do N64
          </div>
          <h1 className="text-4xl md:text-6xl font-cinzel font-bold text-[var(--color-gold)] mb-4 animate-fade-in-up stagger-2 glow-text-lg">
            Zelda Chronicles
          </h1>
          <p className="text-base text-[var(--color-text-muted)] mb-8 max-w-xl mx-auto animate-fade-in-up stagger-3">
            A enciclopédia completa de Ocarina of Time e Majora's Mask com rastreador de progresso interativo.
          </p>
          <div className="animate-fade-in-up stagger-4"><SearchBar /></div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-4">
          <Link to="/oot" className="group animate-fade-in-up stagger-4">
            <div
              className="relative rounded-xl overflow-hidden border-2 border-[var(--color-gold)]/40 hover:border-[var(--color-gold)]/80 transition-all duration-300 min-h-[160px] flex items-end"
              style={{
                backgroundImage: 'url("/images/banner ocarina of time.jpg")',
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-main)] via-[var(--color-bg-main)]/60 to-transparent" />
              <div className="relative p-5 w-full">
                <h2 className="text-2xl font-cinzel font-bold text-white mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  Ocarina of Time
                </h2>
                <p className="text-sm text-gray-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  Explore Hyrule, colete as 100 Gold Skulltulas, encontre todos os Heart Pieces e complete a jornada do Herói do Tempo.
                </p>
              </div>
            </div>
          </Link>

          <Link to="/mm" className="group animate-fade-in-up stagger-5">
            <div
              className="relative rounded-xl overflow-hidden border-2 border-[var(--color-green-sage)]/40 hover:border-[var(--color-green-sage)]/80 transition-all duration-300 min-h-[160px] flex items-end"
              style={{
                backgroundImage: 'url("/images/zelda majoras mask banner.jpg")',
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-main)] via-[var(--color-bg-main)]/60 to-transparent" />
              <div className="relative p-5 w-full">
                <h2 className="text-2xl font-cinzel font-bold text-white mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  Majora's Mask
                </h2>
                <p className="text-sm text-gray-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  Colete todas as 24 máscaras, salve Termina, complete a missão de Anju & Kafei e derrote Majora.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Vistos Recentemente */}
      {recentlyViewed.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 pb-8">
          <h2 className="text-sm font-cinzel font-bold text-[var(--color-gold)] mb-3 uppercase tracking-wider glow-text-sm">Vistos Recentemente</h2>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {recentlyViewed.map((item) => (
              <Link
                key={item.id}
                to={`/${item.game}/${item.tab}/${item.id}`}
                className="shrink-0 px-4 py-2 glass rounded-xl border border-[var(--color-border)] hover:border-[var(--color-gold)]/30 transition-all text-sm text-white hover:bg-white/[0.03]"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-3 gap-3">
          {[
            { title: "Wiki Completa", desc: "Páginas detalhadas de itens, personagens, dungeons, missões e muito mais.", icon: "📖" },
            { title: "Busca Instantânea", desc: "Encontre qualquer coisa com nossa busca global.", icon: "⚡" },
            { title: "Rastreador", desc: "Marque itens coletados e acompanhe seu progresso para o 100%.", icon: "🎯" },
          ].map((f, i) => (
            <Card key={f.title} className={`animate-fade-in-up stagger-${i + 4}`}>
              <div className="text-xl mb-2">{f.icon}</div>
              <h3 className="text-base font-cinzel font-bold text-[var(--color-gold)] mb-1">{f.title}</h3>
              <p className="text-xs text-[var(--color-text-muted)]">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t border-[var(--color-border)] py-6 text-center text-xs text-[var(--color-text-dim)] glass-dark">
        Zelda Chronicles — Uma wiki de fãs para fãs.
      </footer>
    </div>
  );
}
