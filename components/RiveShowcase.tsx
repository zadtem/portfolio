"use client";

import { useEffect, useState } from "react";
import { useRive, useStateMachineInput, Layout, Fit, Alignment, type Rive } from "@rive-app/react-canvas";
import { CaretDown, Flame } from "@phosphor-icons/react/dist/ssr";
import type { RiveShowcaseEntry, RiveInput } from "@/data/portfolio";

type RiveShowcaseProps = {
  entries: RiveShowcaseEntry[];
  className?: string;
};

export default function RiveShowcase({ entries, className = "" }: RiveShowcaseProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const activeEntry = entries[activeTab];

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return (
    <div className={`rive-showcase ${className}`.trim()}>
      {entries.length > 1 && (
        <>
          <div className="rive-showcase-tabs" role="tablist" aria-label="Showcase tabs">
            {entries.map((entry, index) => (
              <button
                key={entry.label}
                type="button"
                role="tab"
                aria-selected={activeTab === index}
                className={`rive-showcase-tab ${activeTab === index ? "rive-showcase-tab--active" : ""}`}
                onClick={() => setActiveTab(index)}
              >
                {entry.label}
              </button>
            ))}
          </div>
          <label className="rive-showcase-select">
            <span>Showcase file</span>
            <div className="rive-showcase-select-field">
              <select
                value={activeTab}
                onChange={(event) => setActiveTab(Number(event.target.value))}
                aria-label="Showcase file"
              >
                {entries.map((entry, index) => (
                  <option key={entry.label} value={index}>
                    {entry.label}
                  </option>
                ))}
              </select>
              <CaretDown className="rive-showcase-caret" size={16} weight="bold" aria-hidden="true" />
            </div>
          </label>
        </>
      )}

      {activeEntry.kind === "video" ? (
        <VideoPreview entry={activeEntry} />
      ) : activeEntry.artboards ? (
        <MultiArtboardGrid entry={activeEntry} />
      ) : activeEntry.mobileNotice && isMobile ? (
        <div className="rive-showcase-notice">
          <p>{activeEntry.mobileNotice}</p>
        </div>
      ) : (
        <SingleArtboardView entry={activeEntry} />
      )}
    </div>
  );
}

function VideoPreview({ entry }: { entry: RiveShowcaseEntry }) {
  return (
    <div className="rive-showcase-video">
      <video autoPlay loop muted playsInline aria-label={entry.label}>
        <source src={entry.src} type="video/mp4" />
      </video>
    </div>
  );
}

function MultiArtboardGrid({ entry }: { entry: RiveShowcaseEntry }) {
  const artboards = entry.artboards || [];

  return (
    <div className="rive-showcase-grid">
      {artboards.map((artboardName) => (
        <ArtboardCard key={artboardName} src={entry.src} artboard={artboardName} />
      ))}
    </div>
  );
}

function ArtboardCard({ src, artboard }: { src: string; artboard: string }) {
  const { RiveComponent } = useRive({
    src,
    artboard,
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
  });

  return (
    <div className="rive-artboard-card">
      <div className="rive-artboard-canvas">
        <RiveComponent aria-label={`${artboard} artboard preview`} />
      </div>
      <p className="rive-artboard-label">{artboard}</p>
    </div>
  );
}

function SingleArtboardView({ entry }: { entry: RiveShowcaseEntry }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const { rive, container, RiveComponent } = useRive({
    src: entry.src,
    artboard: entry.artboard,
    stateMachines: entry.stateMachine,
    autoplay: false,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
  });

  // Autoplay the state machine ~2s after the preview scrolls into view.
  useEffect(() => {
    if (!rive || !entry.stateMachine || !container) return;

    let timer: ReturnType<typeof setTimeout> | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          timer = setTimeout(() => {
            rive.play(entry.stateMachine);
            setIsPlaying(true);
          }, 2000);
          observer.disconnect();
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(container);
    return () => {
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [rive, container, entry.stateMachine]);

  const togglePlayback = () => {
    if (!rive || !entry.stateMachine) return;

    if (isPlaying) {
      rive.pause(entry.stateMachine);
    } else {
      rive.play(entry.stateMachine);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="rive-showcase-single">
      <div className="rive-showcase-canvas">
        <RiveComponent aria-label={`${entry.label} animation`} />
      </div>
      {entry.inputs && entry.inputs.length > 0 && (
        <div className="rive-showcase-controls">
          <InputControls
            rive={rive}
            stateMachine={entry.stateMachine}
            inputs={entry.inputs}
            isPlaying={isPlaying}
          />
          <button
            type="button"
            className="rive-state-button rive-play-button"
            onClick={togglePlayback}
            aria-pressed={isPlaying}
          >
            {isPlaying ? "stop" : "play"}
          </button>
        </div>
      )}
    </div>
  );
}

function InputControls({
  rive,
  stateMachine,
  inputs,
  isPlaying,
}: {
  rive: Rive | null;
  stateMachine?: string;
  inputs: RiveInput[];
  isPlaying: boolean;
}) {
  return (
    <>
      {inputs.map((input) => {
        if (input.kind === "boolean") {
          return (
            <BooleanChip
              key={input.name}
              rive={rive}
              stateMachine={stateMachine}
              input={input}
              isPlaying={isPlaying}
            />
          );
        } else {
          return (
            <TriggerButton
              key={input.name}
              rive={rive}
              stateMachine={stateMachine}
              input={input}
              isPlaying={isPlaying}
            />
          );
        }
      })}
    </>
  );
}

function BooleanChip({
  rive,
  stateMachine,
  input,
  isPlaying,
}: {
  rive: Rive | null;
  stateMachine?: string;
  input: Extract<RiveInput, { kind: "boolean" }>;
  isPlaying: boolean;
}) {
  const [isActive, setIsActive] = useState(false);
  const stateMachineInput = useStateMachineInput(rive, stateMachine, input.name);

  const toggle = () => {
    const nextValue = !isActive;
    setIsActive(nextValue);

    if (stateMachineInput) {
      // Rive boolean state-machine inputs are controlled through this mutable SDK value.
      // eslint-disable-next-line react-hooks/immutability
      stateMachineInput.value = nextValue;
    }
  };

  return (
    <button
      type="button"
      className="rive-state-button rive-boolean-chip"
      aria-pressed={isActive}
      disabled={!isPlaying}
      onClick={toggle}
    >
      {input.label || input.name}
    </button>
  );
}

function TriggerButton({
  rive,
  stateMachine,
  input,
  isPlaying,
}: {
  rive: Rive | null;
  stateMachine?: string;
  input: Extract<RiveInput, { kind: "trigger" }>;
  isPlaying: boolean;
}) {
  const stateMachineInput = useStateMachineInput(rive, stateMachine, input.name);

  const fire = () => {
    if (stateMachineInput) {
      stateMachineInput.fire();
    }
  };

  return (
    <button
      type="button"
      className="rive-state-button rive-trigger-button"
      disabled={!isPlaying}
      onClick={fire}
      aria-label={input.label || input.name}
    >
      {input.fireIcon && <Flame size={16} weight="fill" aria-hidden="true" />}
      {input.label || input.name}
    </button>
  );
}
