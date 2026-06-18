const ZELDA_WIKI_API = "https://zeldawiki.wiki/w/api.php";

const imageCache = {};

function getCacheKey(title) {
  return `zw-image:${title.replace(/\s+/g, "_")}`;
}

export async function fetchZeldaWikiImage(itemName) {
  const cacheKey = getCacheKey(itemName);
  if (imageCache[cacheKey]) return imageCache[cacheKey];

  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      imageCache[cacheKey] = parsed;
      return parsed;
    } catch {
      sessionStorage.removeItem(cacheKey);
    }
  }

  const tryFetch = async (title) => {
    const params = new URLSearchParams({
      action: "query",
      titles: title,
      prop: "pageimages",
      format: "json",
      pithumbsize: 300,
      origin: "*",
    });

    const res = await fetch(`${ZELDA_WIKI_API}?${params}`);
    const json = await res.json();
    const pages = json?.query?.pages;
    if (!pages) return null;

    const page = Object.values(pages)[0];
    return page?.thumbnail?.source || null;
  };

  try {
    let url = await tryFetch(itemName);

    if (!url) {
      const altNames = [
        `${itemName} (Ocarina of Time)`,
        `${itemName} (Majora's Mask)`,
        `${itemName} (Item)`,
        `${itemName} (Character)`,
        `${itemName} (Object)`,
        `OoT ${itemName}`,
        `MM ${itemName}`,
        itemName.replace(/'/g, "%27"),
      ];
      for (const alt of altNames) {
        url = await tryFetch(alt);
        if (url) break;
      }
    }

    if (url) {
      imageCache[cacheKey] = url;
      sessionStorage.setItem(cacheKey, JSON.stringify(url));
    }
    return url || null;
  } catch {
    return null;
  }
}
