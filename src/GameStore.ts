import { createStore } from "solid-js/store";
import { LevelData, levels } from "./LevelData.ts";
import { Docket } from "@grinstead/ambush";

export type GameLoopTypes = "step";

export type KeyboardTask =
  | {
      type: "pressed";
      key: string;
    }
  | {
      type: "released";
      key: string;
    }
  | {
      type: "focus";
    }
  | {
      type: "blur";
    };

export type GameTasks = {
  input: KeyboardTask;
  render: null;
};

export type GameStore = {
  level: LevelData;
  paused: boolean;
  loop: Docket<GameTasks, GameLoopTypes>;
};

export function createGameStore() {
  return createStore<GameStore>({
    level: { ...levels[0] },
    paused: true,
    loop: new Docket<GameTasks, GameLoopTypes>({
      input: { events: ["step"] },
      render: {},
    }),
  });
}
