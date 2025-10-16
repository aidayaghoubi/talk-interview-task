export const TOAST_MESSAGES = {
  NotAllowedErrorForCamera: 'Permission denied by user for camera',
  NotAllowedErrorForMicrophone: 'Permission denied by user for microphone',
  NotFoundError: 'No camera found',
  PleaseSelectASpeakerToTest: 'Please select a speaker to test.',
  YourBrowserDoesNotSupportSpeakerSwitching: 'Your browser does not support speaker switching.',
  SpeakerTestFailed: 'Speaker test failed',
  CameraNotReadableError: 'Camera is being used by another application',
  MicrophoneNotReadableError: 'Microphone is being used by another application',
  UnknownError: 'Unknown error',
  CameraNotSelected:"Camera not selected",
  GetDevicesError: 'Error getting devices',
  NoDevicesFound: 'No devices found',
  ScreenCaptureError: 'Error sharing screen',
  CameraDisconnected: 'Camera disconnected',
  MicrophoneDisconnected: 'Microphone disconnected',
  CameraGrantedButMicrophoneDenied: 'Camera granted, but microphone denied.',
  MicrophoneGrantedButCameraDenied: 'Microphone granted, but camera denied.',
  BothCameraAndMicrophoneDenied: 'Both camera and microphone denied.',
  SecurityError: 'Security error, camera and microphone access requires HTTPS or localhost protocol',
  CameraAndMicrophonePermissionsGranted: 'Camera and microphone permissions granted!'
}

export const ERROR_STATUS = {
  OverconstrainedError: 'OverconstrainedError',
  NotAllowedError: 'NotAllowedError',
  NotFoundError: 'NotFoundError',
  UnknownError: 'UnknownError'
}

export const LOCAL_STORAGE_KEYS = {
  soundOutput: 'soundOutput',
  cameraOutput: 'cameraOutput',
  microphoneOutput: 'microphoneOutput'
}