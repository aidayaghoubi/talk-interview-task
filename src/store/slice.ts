  import { createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";
  import { IPermissions, IDevice, IRootState } from "./type";
  import { getFromLocalStorage, saveInLocalStorage } from "../storage/saveInLocalStorage";

  export const settingsSlice = createSlice({
    name: "settings",
    initialState: {
      devices: [] as IDevice[],
      permissions: {
        camera: { granted: false },
        microphone: { granted: false }
      } as IPermissions,
      soundOutput: getFromLocalStorage("soundOutput"),
      cameraOutput: getFromLocalStorage("cameraOutput"),
      microphoneOutput: getFromLocalStorage("microphoneOutput"),
    } as IRootState,
    reducers: {
      setSoundOutput: (state, action) => {
        state.soundOutput = action.payload;
        saveInLocalStorage("soundOutput", action.payload);
      },
      setCameraOutput: (state, action) => {
        state.cameraOutput = action.payload;
        saveInLocalStorage("cameraOutput", action.payload);
      },
      setMicrophoneOutput: (state, action) => {
        state.microphoneOutput = action.payload;
        saveInLocalStorage("microphoneOutput", action.payload);
      },
      setDevices: (state, action: PayloadAction<IDevice[]>) => {
        state.devices = action.payload;
      },
      setPermissions: (state, action: PayloadAction<IPermissions>) => {
        state.permissions = action.payload;
      },
      setCameraPermission: (state, action: PayloadAction<{ granted: boolean; error?: string }>) => {
        state.permissions.camera = action.payload;
      },
      setMicrophonePermission: (state, action: PayloadAction<{ granted: boolean; error?: string }>) => {
        state.permissions.microphone = action.payload;
      },
    },
  });

  export const { 
    setSoundOutput, 
    setCameraOutput, 
    setMicrophoneOutput, 
    setDevices, 
    setPermissions, 
    setCameraPermission, 
    setMicrophonePermission 
  } = settingsSlice.actions

  export const store = configureStore({
    reducer: settingsSlice.reducer
  })
