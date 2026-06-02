import { NextResponse } from "next/server";

type PinterestImage = {
  id: string;
  imageUrl: string;
  alt: string;
  link: string;
};

const CACHE_TTL_MS = 60 * 60 * 1000;
const imageCache = new Map<string, { expiresAt: number; items: PinterestImage[] }>();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rssUrl = getPinterestRssUrl(searchParams.get("rssUrl")?.trim());

  if (!rssUrl) {
    return NextResponse.json({ items: [] }, { status: 400 });
  }

  const cached = imageCache.get(rssUrl);
  if (cached && cached.expiresAt > Date.now()) {
    return jsonWithCache(cached.items);
  }

  const items = await fetchPinterestRssImages(rssUrl);

  imageCache.set(rssUrl, {
    expiresAt: Date.now() + CACHE_TTL_MS,
    items
  });

  return jsonWithCache(items);
}

async function fetchPinterestRssImages(rssUrl: string) {
  const boardUrl = getPinterestBoardUrl(rssUrl);

  try {
    const response = await fetch(rssUrl, {
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"
      },
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      return fetchPinterestBoardImages(boardUrl);
    }

    const items = parsePinterestRss(await response.text());

    return items.length ? items : fetchPinterestBoardImages(boardUrl);
  } catch {
    return fetchPinterestBoardImages(boardUrl);
  }
}

async function fetchPinterestBoardImages(boardUrl: string) {
  try {
    const response = await fetch(boardUrl, {
      headers: {
        Accept: "text/html",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"
      },
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      return [];
    }

    return parsePinterestBoardImages(await response.text(), boardUrl);
  } catch {
    return [];
  }
}

function parsePinterestRss(xml: string) {
  return Array.from(xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/g))
    .map((match) => normalizeRssItem(match[1]))
    .filter((item): item is PinterestImage => Boolean(item));
}

function normalizeRssItem(itemXml: string): PinterestImage | null {
  const link = readXmlTag(itemXml, "link") || readXmlTag(itemXml, "guid");
  const title = readXmlTag(itemXml, "title") || "Pinterest board image";
  const description = decodeXmlEntities(readXmlTag(itemXml, "description"));
  const imageUrl = normalizePinterestImageUrl(readDescriptionImageUrl(description));

  if (!link || !imageUrl) {
    return null;
  }

  return {
    id: link,
    imageUrl,
    alt: title.trim() || "Pinterest board image",
    link
  };
}

function readXmlTag(xml: string, tagName: string) {
  const match = xml.match(new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i"));
  return match ? decodeXmlEntities(match[1]).trim() : "";
}

function readDescriptionImageUrl(description: string) {
  return description.match(/<img\b[^>]*\bsrc=["']([^"']+)["']/i)?.[1] ?? "";
}

function parsePinterestBoardImages(html: string, boardUrl: string) {
  const matches = html.matchAll(
    /https:\/\/i\.pinimg\.com\/(?:200x150|200x|236x|474x)\/[a-f0-9/]+\.(?:jpg|jpeg|png|webp)/gi
  );
  const imageUrls = Array.from(matches, ([imageUrl]) => normalizePinterestImageUrl(imageUrl));

  return Array.from(new Set(imageUrls)).map((imageUrl) => ({
    id: imageUrl,
    imageUrl,
    alt: "Pinterest board image",
    link: boardUrl
  }));
}

function getPinterestRssUrl(rssUrl: string | undefined) {
  if (!rssUrl) {
    return null;
  }

  try {
    const url = new URL(rssUrl);
    const hostname = url.hostname.toLowerCase();
    const pathParts = url.pathname.split("/").filter(Boolean);

    if (
      (hostname !== "pinterest.com" && hostname !== "www.pinterest.com") ||
      pathParts.length !== 2 ||
      !pathParts[1].endsWith(".rss")
    ) {
      return null;
    }

    return `https://www.pinterest.com/${pathParts[0]}/${pathParts[1]}`;
  } catch {
    return null;
  }
}

function getPinterestBoardUrl(rssUrl: string) {
  return rssUrl.replace(/\.rss$/, "/");
}

function normalizePinterestImageUrl(url: string) {
  return url
    .replace(/\/(?:60x60|136x136|170x|200x150|200x|236x|474x)\//, "/736x/")
    .replace(/&amp;/g, "&");
}

function decodeXmlEntities(value = "") {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&quot;/g, "\"")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function jsonWithCache(items: PinterestImage[]) {
  return NextResponse.json(
    { items },
    {
      headers: {
        "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400"
      }
    }
  );
}
