"use client";

import { useState } from "react";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";

type RiveMascotDemoProps = {
  src: string;
  stateMachine: string;
  inputName: string;
};

export default function RiveMascotDemo({
  src,
  stateMachine,
  inputName
}: RiveMascotDemoProps) {
  const [isTalking, setIsTalking] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { rive, RiveComponent } = useRive({
    src,
    stateMachines: stateMachine,
    autoplay: false
  });
  const isTalkingInput = useStateMachineInput(rive, stateMachine, inputName);

  const switchStates = () => {
    const nextIsTalking = !isTalking;
    setIsTalking(nextIsTalking);

    if (isTalkingInput) {
      // Rive boolean state-machine inputs are controlled through this mutable SDK value.
      // eslint-disable-next-line react-hooks/immutability
      isTalkingInput.value = nextIsTalking;
    }
  };

  const togglePlayback = () => {
    if (!rive) {
      return;
    }

    if (isPlaying) {
      setIsTalking(false);

      if (isTalkingInput) {
        // Rive boolean state-machine inputs are controlled through this mutable SDK value.
        // eslint-disable-next-line react-hooks/immutability
        isTalkingInput.value = false;
      }

      rive.pause(stateMachine);
    } else {
      rive.play(stateMachine);
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <div className="rive-mascot-demo">
      <div className="rive-mascot-canvas">
        <RiveComponent aria-label="Steve Irwin learning mascot animation" />
      </div>
      <div className="rive-mascot-controls">
        <button
          className="rive-state-button"
          type="button"
          aria-pressed={isTalking}
          disabled={!isPlaying}
          onClick={switchStates}
        >
          switch states
        </button>
        <button
          className="rive-state-button"
          type="button"
          aria-pressed={isPlaying}
          onClick={togglePlayback}
        >
          {isPlaying ? "stop" : "play"}
        </button>
      </div>
    </div>
  );
}
