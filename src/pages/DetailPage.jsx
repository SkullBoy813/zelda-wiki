import { useParams, useLocation, Link } from "react-router-dom";
import { gameData } from "../data";
import { EntityPage } from "../components/wiki/EntityPage";

export function ItemPage() {
  return (
    <EntityPage
      type="items"
      fields={[
        { key: "era", label: "Era" },
        { key: "location", label: "Localização" },
        { key: "usage", label: "Utilização" },
        { key: "lore", label: "Curiosidades" },
        { key: "category", label: "Categoria" },
        { key: "relatedQuests", label: "Missões Relacionadas" },
      ]}
    />
  );
}

export function CharacterPage() {
  return (
    <EntityPage
      type="characters"
      fields={[
        { key: "role", label: "Função" },
        { key: "location", label: "Localização" },
        { key: "species", label: "Espécie" },
        { key: "age", label: "Idade" },
        { key: "gender", label: "Gênero" },
        { key: "trivia", label: "Curiosidades" },
        { key: "relatedQuests", label: "Missões Relacionadas" },
      ]}
    />
  );
}

export function DungeonPage() {
  return (
    <EntityPage
      type="dungeons"
      fields={[
        { key: "location", label: "Localização" },
        { key: "item", label: "Item Obtido" },
        { key: "boss", label: "Chefe" },
        { key: "bossDescription", label: "Sobre o Chefe" },
        {
          key: "smallKeys", label: "Informações",
          render: (value, entity) => (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-[var(--color-gold)]/5 rounded-lg p-3">
                <span className="text-gray-400">Chaves Pequenas</span>
                <div className="text-white font-bold text-lg">{entity.smallKeys}</div>
              </div>
              <div className="bg-[var(--color-gold)]/5 rounded-lg p-3">
                <span className="text-gray-400">Boss Key</span>
                <div className={`font-bold text-lg ${entity.bossKey ? "text-[var(--color-gold)]" : "text-gray-500"}`}>
                  {entity.bossKey ? "Sim" : "Não"}
                </div>
              </div>
              <div className="bg-[var(--color-gold)]/5 rounded-lg p-3">
                <span className="text-gray-400">Mapa</span>
                <div className={`font-bold text-lg ${entity.map ? "text-[var(--color-gold)]" : "text-gray-500"}`}>
                  {entity.map ? "Sim" : "Não"}
                </div>
              </div>
              <div className="bg-[var(--color-gold)]/5 rounded-lg p-3">
                <span className="text-gray-400">Bússola</span>
                <div className={`font-bold text-lg ${entity.compass ? "text-[var(--color-gold)]" : "text-gray-500"}`}>
                  {entity.compass ? "Sim" : "Não"}
                </div>
              </div>
            </div>
          ),
        },
        { key: "skulltulas", label: "Gold Skulltulas / Stray Fairies" },
        { key: "relatedQuests", label: "Missões Relacionadas" },
      ]}
    />
  );
}

export function LocationPage() {
  return (
    <EntityPage
      type="locations"
      fields={[
        { key: "region", label: "Região" },
        { key: "heartPieces", label: "Heart Pieces" },
        { key: "skulltulas", label: "Gold Skulltulas" },
        { key: "npcs", label: "NPCs" },
        { key: "shops", label: "Lojas" },
        { key: "relatedQuests", label: "Missões Relacionadas" },
      ]}
    />
  );
}

export function QuestPage() {
  return (
    <EntityPage
      type="quests"
      fields={[
        { key: "requirements", label: "Requisitos" },
        { key: "steps", label: "Passo a Passo" },
        { key: "rewards", label: "Recompensas" },
        { key: "warnings", label: "Avisos Importantes" },
        { key: "relatedLocations", label: "Locais Relacionados" },
      ]}
    />
  );
}

export function SongPage() {
  return (
    <EntityPage
      type="songs"
      fields={[
        { key: "notes", label: "Notas" },
        { key: "learnedFrom", label: "Aprendida com" },
        { key: "uses", label: "Utilizações" },
        { key: "relatedQuests", label: "Missões Relacionadas" },
      ]}
    />
  );
}

export function MaskPage() {
  return (
    <EntityPage
      type="masks"
      fields={[
        { key: "type", label: "Tipo" },
        { key: "location", label: "Localização" },
        { key: "howToGet", label: "Como Obter" },
        { key: "usage", label: "Utilização" },
        { key: "lore", label: "Curiosidades" },
        { key: "relatedQuests", label: "Missões Relacionadas" },
      ]}
    />
  );
}

export function BossDetailPage() {
  return (
    <EntityPage
      type="bosses"
      fields={[
        { key: "location", label: "Localização" },
        { key: "dungeon", label: "Dungeon" },
        { key: "type", label: "Tipo" },
      ]}
    />
  );
}

export function MonsterDetailPage() {
  return (
    <EntityPage
      type="apiMonsters"
      fields={[
        {
          key: "appearances", label: "Aparições nos Jogos",
          render: (value) => (
            <div className="flex flex-wrap gap-2">
              {(value || []).map((url, i) => (
                <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-xs text-gray-300">
                  {decodeURIComponent(url.split("/").pop()?.replace(/-/g, " ") || "Zelda")}
                </span>
              ))}
            </div>
          ),
        },
      ]}
    />
  );
}

export function HeartPiecePage() {
  return (
    <EntityPage
      type="heartPieces"
      fields={[
        { key: "location", label: "Localização" },
        { key: "region", label: "Região" },
      ]}
    />
  );
}

export function SkulltulaPage() {
  return (
    <EntityPage
      type="skulltulas"
      fields={[
        { key: "number", label: "Número" },
        { key: "location", label: "Região" },
      ]}
    />
  );
}

export function GreatFairyPage() {
  return (
    <EntityPage
      type="greatFairies"
      fields={[
        { key: "location", label: "Localização" },
        { key: "reward", label: "Recompensa" },
        { key: "era", label: "Era" },
      ]}
    />
  );
}

export function StrayFairyPage() {
  return (
    <EntityPage
      type="allStrayFairies"
      fields={[
        { key: "location", label: "Localização" },
        { key: "number", label: "Número" },
      ]}
    />
  );
}
