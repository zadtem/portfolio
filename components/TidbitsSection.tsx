"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { tidbits, type TidbitCard } from "@/data/portfolio";

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIframeAPI) => void;
  }
}

type PreviewImage = {
  id: string;
  imageUrl: string;
  alt: string;
  link?: string;
};

type PinterestPreviewResponse = {
  items?: PreviewImage[];
};

const cardRevealViewport = { once: true, amount: 0.05 } as const;

type SpotifyEmbedController = {
  addListener: (event: string, cb: (e?: unknown) => void) => void;
  removeListener: (event: string) => void;
  loadUri: (uri: string) => void;
  play: () => void;
  pause: () => void;
};

type SpotifyIframeAPI = {
  createController: (
    el: HTMLElement,
    options: { width: string; height: string; uri: string },
    cb: (controller: SpotifyEmbedController) => void
  ) => void;
};

function SpotifyEmbed({
  card,
  api,
}: {
  card: Extract<TidbitCard, { kind: "spotify" }>;
  api: SpotifyIframeAPI | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<SpotifyEmbedController | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!api || !ref.current || loaded) return;

    api.createController(
      ref.current,
      {
        width: "100%",
        height: "352",
        uri: `spotify:playlist:${card.playlistId}`,
      },
      (controller) => {
        controller.addListener("ready", () => {
          setLoaded(true);
        });
        controllerRef.current = controller;
      }
    );

    return () => {
      if (controllerRef.current) {
        controllerRef.current.removeListener("playback_update");
      }
    };
  }, [api, card.playlistId, loaded]);

  return (
    <div className="tidbit-embed tidbit-embed--spotify">
      <div ref={ref} />
    </div>
  );
}

function PinterestPreview({ card }: { card: Extract<TidbitCard, { kind: "pinterest" }> }) {
  const [images, setImages] = useState<PreviewImage[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ boardUrl: card.boardUrl });

    fetch(`/api/pinterest-board?${params.toString()}`, {
      signal: controller.signal
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Pinterest board preview failed");
        }

        return (await response.json()) as PinterestPreviewResponse;
      })
      .then((payload) => {
        if (!controller.signal.aborted) {
          const items = (payload.items ?? []).map(({ id, imageUrl, alt }) => ({
            id,
            imageUrl,
            alt
          }));
          setImages(randomizeInitialImage(items));
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setImages([]);
        }
      });

    return () => controller.abort();
  }, [card.boardUrl]);

  return (
    <PreviewCard
      eyebrow="Pinterest"
      fallbackText={card.boardDescription}
      href={card.boardUrl}
      images={images}
      title={card.title}
    />
  );
}

function IframeEmbed({ card }: { card: Extract<TidbitCard, { kind: "iframe" }> }) {
  return (
    <div className="tidbit-embed tidbit-embed--iframe">
      <iframe
        src={card.src}
        width="100%"
        height="100%"
        frameBorder="0"
        loading="lazy"
        title={card.title}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  );
}

function SideProjectPreview({
  card
}: {
  card: Extract<TidbitCard, { kind: "promo" | "visual" }>;
}) {
  const fallbackImage = card.kind === "promo" ? card.logo : card.image;
  const images = useMemo(
    () =>
      (card.previewImages?.length ? card.previewImages : [fallbackImage]).map((image) => ({
        id: image,
        imageUrl: image,
        alt: card.title,
        link: card.href
      })),
    [card.href, card.previewImages, card.title, fallbackImage]
  );

  return (
    <PreviewCard
      eyebrow="Sideproject"
      fallbackText={card.kind === "promo" ? card.tagline : card.title}
      href={card.href}
      imageFit={card.kind === "promo" ? "contain" : "cover"}
      images={images}
      title={card.title}
    />
  );
}

function PreviewCard({
  eyebrow,
  fallbackText,
  href,
  imageFit = "cover",
  images,
  title
}: {
  eyebrow: string;
  fallbackText: string;
  href: string;
  imageFit?: "contain" | "cover";
  images: PreviewImage[];
  title: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const activeImage = images.length ? images[activeImageIndex % images.length] : undefined;

  const changeImage = () => {
    if (images.length <= 1) {
      return;
    }

    setActiveImageIndex((currentIndex) => {
      const offset = Math.floor(Math.random() * (images.length - 1)) + 1;
      return (currentIndex + offset) % images.length;
    });
  };

  return (
    <motion.a
      className={`tidbit-embed tidbit-preview tidbit-preview--${imageFit}`}
      href={activeImage?.link ?? href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${eyebrow}: ${title}`}
      onFocus={changeImage}
      onMouseEnter={changeImage}
    >
      <span className="tidbit-preview__label">
        <span>{eyebrow}</span>
        <span className="tidbit-preview__separator" aria-hidden="true">
          ·
        </span>
        <span>{title}</span>
      </span>
      <span className="tidbit-preview__media" aria-hidden={!activeImage}>
        <AnimatePresence mode="wait" initial={false}>
          {activeImage ? (
            <motion.img
              key={activeImage.id}
              src={activeImage.imageUrl}
              alt={activeImage.alt}
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 1.16, y: 34, filter: "blur(10px)" }
              }
              animate={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }
              }
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.98, y: -18, filter: "blur(8px)" }
              }
              transition={
                prefersReducedMotion
                  ? { duration: 0.16 }
                  : { duration: 0.82, ease: [0.16, 1, 0.3, 1] }
              }
            />
          ) : null}
        </AnimatePresence>
        {!activeImage ? <span className="tidbit-preview__fallback">{fallbackText}</span> : null}
      </span>
    </motion.a>
  );
}

function randomizeInitialImage(images: PreviewImage[]) {
  if (images.length <= 1) {
    return images;
  }

  const firstIndex = Math.floor(Math.random() * images.length);
  return [...images.slice(firstIndex), ...images.slice(0, firstIndex)];
}

function TidbitContent({
  card,
  spotifyApi,
}: {
  card: TidbitCard;
  spotifyApi: SpotifyIframeAPI | null;
}) {
  switch (card.kind) {
    case "pinterest":
      return <PinterestPreview card={card} />;
    case "spotify":
      return <SpotifyEmbed card={card} api={spotifyApi} />;
    case "iframe":
      return <IframeEmbed card={card} />;
    case "promo":
    case "visual":
      return <SideProjectPreview card={card} />;
  }
}

export default function TidbitsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [spotifyApi, setSpotifyApi] = useState<SpotifyIframeAPI | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const cardRevealVariants = useMemo<Variants>(
    () => ({
      hidden: prefersReducedMotion
        ? { opacity: 0 }
        : { opacity: 0, scale: 1.34, x: 320 },
      visible: (cardIndex: number) =>
        prefersReducedMotion
          ? {
              opacity: 1,
              transition: { duration: 0.16 }
            }
          : {
              opacity: 1,
              scale: 1,
              transition: {
                delay: cardIndex * 0.09,
                duration: 1.08,
                ease: [0.16, 1, 0.3, 1]
              },
              x: 0
            }
    }),
    [prefersReducedMotion]
  );

  // Spotify iFrame API
  useEffect(() => {
    if (spotifyApi) return;

    const script = document.createElement("script");
    script.src = "https://open.spotify.com/embed/iframe-api/v1";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyIframeApiReady = (api) => {
      setSpotifyApi(api);
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [spotifyApi]);

  useEffect(() => {
    let frame = 0;

    const updateActiveCard = () => {
      frame = 0;

      if (!window.matchMedia("(max-width: 767px)").matches || !sectionRef.current) {
        return;
      }

      const cards = Array.from(
        sectionRef.current.querySelectorAll<HTMLElement>("[data-tidbit-card]")
      );
      const viewportCenter = window.innerHeight / 2;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const distance = Math.abs(cardCenter - viewportCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    };

    const requestUpdate = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(updateActiveCard);
    };

    updateActiveCard();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return (
    <section
      className="tidbits-section"
      id="tidbits"
      ref={sectionRef}
      data-card-reveal-section
      data-section
    >
      <div className="tidbits-header">
        <h2>Tidbits</h2>
        <p>Some things I like, and some things I made!</p>
      </div>
      <div className="tidbits-grid">
        {tidbits.map((card, index) => {
          const isActive = activeIndex === index;

          return (
            <motion.article
              custom={index}
              initial="hidden"
              layout={!prefersReducedMotion}
              key={card.title}
              className={`tidbit-card tidbit-card--${card.tone} ${isActive ? "is-active" : ""}`}
              data-tidbit-card
              data-active={isActive}
              variants={cardRevealVariants}
              viewport={cardRevealViewport}
              whileInView="visible"
              transition={{ type: "spring", stiffness: 210, damping: 28 }}
              tabIndex={0}
            >
              <TidbitContent card={card} spotifyApi={spotifyApi} />
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
