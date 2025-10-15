export interface ISetting{
  soundOutput: string | null,
  cameraOutput: string | null,
  microphoneOutput: string | null
}

export interface IPermissions {
  camera: {
    granted: boolean;
    error?: string;
  };
  microphone: {
    granted: boolean;
    error?: string;
  };
}

export interface IDevice {
  deviceId: string;
  kind: string;
  label: string;
  groupId: string;
}

export interface IRootState {
    devices: IDevice[];
    permissions: IPermissions;
    soundOutput: string | null;
    cameraOutput: string | null;
    microphoneOutput: string | null;
}