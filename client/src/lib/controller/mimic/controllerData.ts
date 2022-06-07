export interface ControllerData {
  position: {
    x: number;
    y: number;
  };
  yaw: number;
  view: number;
  throttle: number;
  buttons: {
    trigger: boolean;
    side_grip: boolean;
    controller_buttons: {
      bottom_left: boolean;
      bottom_right: boolean;
      top_left: boolean;
      top_right: boolean;
    };
    side_panel: {
      bottom_left: boolean,
      top_left: boolean,
      bottom_middle: boolean,
      top_middle: boolean,
      bottom_right: boolean,
      top_right: boolean
    }
  }
}