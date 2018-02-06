import { actions } from "./GameHandler";
export default class ClickManager {
  constructor() {
    this.justChorded = false;
    this.rightMouseHeld = false;
  }

  onMouseDown = e => {
    if (e.button === 2) {
      this.rightMouseHeld = true;
    }
  };

  onMouseUp = (e, coord) => {
    let action = actions.NONE;
    // If left click and right is held, chord
    if (e.button === 0 && this.rightMouseHeld) {
      action = actions.CHORD;
      this.justChorded = true;
      // If normal left click, uncover
    } else if (e.button === 0) {
      action = actions.UNCOVER;
    } else if (e.button === 2 && !this.justChorded) {
      // if right button up and haven't just chorded (meaning we didn't hold down left click), then normal right click
      action = actions.FLAG;
      this.rightMouseHeld = false;

      // Otherwise, means we don't need to do anything
    } else if (e.button === 2) {
      action = actions.NONE;
      this.justChorded = false;
      this.rightMouseHeld = false;
    }

    return action;
  };

  reset = () => {
    this.justChorded = false;
    this.rightMouseHeld = false;
  };
}
