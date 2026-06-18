import { Link } from "react-router-dom";
import { Card } from "../components/ui/card";
import { usePageTitle } from "../hooks/usePageTitle";

export function NotFoundPage() {
  usePageTitle("Página não encontrada");

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <Card className="max-w-md w-full text-center p-12">
        <div className="text-6xl mb-4">🕱</div>
        <h1 className="text-3xl font-cinzel font-bold text-white mb-2">404</h1>
        <p className="text-gray-400 mb-6">
          A página que você procura não foi encontrada em Hyrule nem em Termina.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            to="/"
            className="px-6 py-2.5 bg-[var(--color-gold)]/20 hover:bg-[var(--color-gold)]/30 text-[var(--color-gold)] font-medium rounded-lg border border-[var(--color-gold)]/30 hover:border-[var(--color-gold)]/60 glow-shadow-md transition-all duration-300"
          >
            Voltar ao Início
          </Link>
          <div className="flex gap-3 justify-center mt-2">
            <Link to="/oot" className="text-sm text-gray-400 hover:text-[var(--color-gold)] transition-colors">
              Ocarina of Time
            </Link>
            <Link to="/mm" className="text-sm text-gray-400 hover:text-[var(--color-green-sage)] transition-colors">
              Majora's Mask
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
