import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { gameData } from "../../data";
import { fetchMonsters } from "../../lib/api";
import { fetchZeldaWikiImage } from "../../lib/zelda-wiki-images";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { BackButton } from "../ui/back-button";
import { GAME_LABELS } from "../../lib/games";
import { GAME_NAMES } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import useStore from "../../store/useStore";
import { usePageTitle } from "../../hooks/usePageTitle";

export function EntityPage({ type, fields }) {
  const loc = useLocation();
  const segments = loc.pathname.split("/").filter(Boolean);
  const game = segments[0] || "oot";
  const { id } = useParams();
  const gameFull = game === "oot" ? "ocarina-of-time" : game === "la" ? "links-awakening" : "majoras-mask";
  const data = gameData[gameFull];
  const isApiType = type === "apiMonsters";
  const [apiEntity, setApiEntity] = useState(null);
  const [loading, setLoading] = useState(isApiType);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const { user } = useAuth();
  const favorites = useStore((s) => s.favorites);
  const addFavorite = useStore((s) => s.addFavorite);
  const removeFavorite = useStore((s) => s.removeFavorite);

  let entity = null;

  if (!isApiType && data) {
    const typeMap = {
      items: data.items,
      characters: data.characters,
      dungeons: data.dungeons,
      locations: data.locations,
      quests: data.quests,
      songs: data.songs,
      masks: data.masks,
      heartPieces: data.heartPieces,
      skulltulas: data.skulltulas,
      greatFairies: data.greatFairies,
      allStrayFairies: data.allStrayFairies,
      bosses: data.bosses,
    };
    entity = typeMap[type]?.find((e) => e.id === id);
  }

  useEffect(() => {
    if (!isApiType) return;
    setLoading(true);

    const fetcher = fetchMonsters;
    fetcher(GAME_NAMES[gameFull === "ocarina-of-time" ? "OOT" : gameFull === "majoras-mask" ? "MM" : "LA"])
      .then((items) => {
        const found = items.find((i) => i.id === id);
        setApiEntity(found);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, type, gameFull, isApiType]);

  if (isApiType) {
    entity = apiEntity;
  }

  usePageTitle(entity?.namePt || entity?.name || "");

  useEffect(() => {
    if (!entity?.name) return;
    setImageUrl(null);
    setImageLoading(true);
    if (entity.image) {
      setImageUrl(entity.image);
      setImageLoading(false);
      return;
    }
    fetchZeldaWikiImage(entity.name).then((url) => {
      setImageUrl(url);
      setImageLoading(false);
    });
  }, [entity?.name, entity?.image]);

  if (!entity && !loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-cinzel text-white mb-4">Entidade não encontrada</h1>
        <BackButton fallbackTo="/" className="text-[var(--color-gold)] hover:underline" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="flex justify-center gap-2 mb-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-2 h-2 bg-[var(--color-gold)] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
        <p className="text-gray-400">Carregando dados da API Zelda...</p>
      </div>
    );
  }

  const variant = gameFull === "ocarina-of-time" ? "oot" : "mm";
  const entityId = entity.id || entity._id;
  const isFavorited = user && favorites.some((f) => f.entity_id === entityId);
  const displayName = entity.namePt || entity.name;
  const subtitle = entity.namePt ? entity.name : null;

  const handleFavorite = () => {
    if (!user) return;
    if (isFavorited) {
      removeFavorite(entityId);
    } else {
      addFavorite(entityId, entity.name, type);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in-up">
      <div className="mb-6">
        <BackButton fallbackTo={game === "oot" ? "/oot" : "/mm"}>
          ← {GAME_LABELS[gameFull]}
        </BackButton>
      </div>

      <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
        <div className="w-full md:w-48 shrink-0">
          <div className="aspect-square bg-[var(--color-bg-card)]/50 rounded-xl border border-[var(--color-border)] flex items-center justify-center p-4">
            {imageLoading ? (
              <div className="flex gap-1">
                {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 bg-[var(--color-gold)] rounded-full animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
              </div>
            ) : imageUrl ? (
              <img
                src={imageUrl}
                alt={entity.name}
                className="w-full h-full object-contain"
                onError={() => setImageUrl(null)}
              />
            ) : (
              <svg className="w-12 h-12 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            )}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Badge variant={variant}>{GAME_LABELS[gameFull]}</Badge>
            {isApiType && <Badge variant="gold">API</Badge>}
            {entity.type && <Badge variant="outline">{entity.type}</Badge>}
            {entity.race && <Badge variant="outline">{entity.race}</Badge>}
            {entity.category && <Badge variant="outline">{entity.category}</Badge>}
          </div>
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-3xl md:text-4xl font-cinzel font-bold text-white">{displayName}</h1>
              {subtitle && <p className="text-sm text-gray-500 mt-1 italic">{subtitle}</p>}
            </div>
            {user && (
              <button
                onClick={handleFavorite}
                className={`text-xl transition-colors shrink-0 ${isFavorited ? "text-[var(--color-gold-light)]" : "text-gray-600 hover:text-[var(--color-gold-light)]"}`}
                title={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              >
                {isFavorited ? "★" : "☆"}
              </button>
            )}
          </div>
          {entity.role && <p className="text-gray-400 mt-1">{entity.role}</p>}
          {entity.gender && <p className="text-gray-500 text-sm">{entity.gender}</p>}
          {entity.location && (
            <p className="text-gray-500 text-sm mt-2 flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-[var(--color-gold)]/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {entity.location}
            </p>
          )}
          {entity.locationDetails && (
            <p className="text-gray-500 text-xs mt-1 ml-5">{entity.locationDetails}</p>
          )}
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <h2 className="text-xl font-cinzel font-bold text-white mb-3 tracking-wide">
            {entity.namePt ? "Sobre" : "Visão Geral"}
          </h2>
          <p className="text-gray-300 leading-relaxed">{entity.descriptionPt || entity.description}</p>
        </Card>

        {fields?.map((field) => {
          const value = entity[field.key];
          if (!value || (Array.isArray(value) && value.length === 0)) return null;

          if (field.render) {
            return (
              <Card key={field.key}>
                <h2 className="text-lg font-cinzel font-bold text-white mb-3">{field.label}</h2>
                {field.render(value, entity)}
              </Card>
            );
          }

          if (Array.isArray(value)) {
            return (
              <Card key={field.key}>
                <h2 className="text-lg font-cinzel font-bold text-white mb-3">{field.label}</h2>
                <ul className="space-y-2">
                  {value.map((item, i) => (
                    <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                      <span className="text-[var(--color-gold)] mt-1 shrink-0">•</span>
                      {typeof item === "string" ? item : (
                        <div>
                          {item.name || item.description || item.action}
                          {item.location && <span className="text-gray-500 block text-xs mt-0.5">📍 {item.location}</span>}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </Card>
            );
          }

          if (typeof value === "string") {
            return (
              <Card key={field.key}>
                <h2 className="text-lg font-cinzel font-bold text-white mb-3">{field.label}</h2>
                <p className="text-gray-300 text-sm leading-relaxed">{value}</p>
              </Card>
            );
          }

          return null;
        })}

        {entity.appearances && entity.appearances.length > 0 && !fields?.some((f) => f.key === "appearances") && (
          <Card>
            <h2 className="text-lg font-cinzel font-bold text-white mb-3">Aparições</h2>
            <div className="flex flex-wrap gap-2">
              {entity.appearances.map((url, i) => (
                <span key={i} className="px-3 py-1 bg-[var(--color-gold)]/5 rounded-full text-xs text-gray-300 border border-[var(--color-border)]">
                  {decodeURIComponent(url.split("/").pop()?.replace(/-/g, " ") || "Zelda")}
                </span>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
