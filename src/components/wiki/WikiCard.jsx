import { Card } from "../ui/card";

export function WikiCard({ title, children }) {
  return (
    <Card>
      {title && <h2 className="text-lg font-cinzel font-bold text-white mb-3 tracking-wide">{title}</h2>}
      <div className="text-gray-300 text-sm leading-relaxed space-y-2">{children}</div>
    </Card>
  );
}
