  import { createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";
  import { IPermissions, IDevice, IRootState } from "./type";
  import { getFromLocalStorage, saveInLocalStorage } from "../storage/saveInLocalStorage";
import { LOCAL_STORAGE_KEYS } from "../constant";

  export const settingsSlice = createSlice({
    name: "settings",
    initialState: {
      devices: [] as IDevice[],
      permissions: {
        camera: { granted: false },
        microphone: { granted: false }
      } as IPermissions,
      soundOutput: getFromLocalStorage(LOCAL_STORAGE_KEYS.soundOutput),
      cameraOutput: getFromLocalStorage(LOCAL_STORAGE_KEYS.cameraOutput),
      microphoneOutput: getFromLocalStorage(LOCAL_STORAGE_KEYS.microphoneOutput),
    } as IRootState,
    reducers: {
      setSoundOutput: (state, action) => {
        state.soundOutput = action.payload;
        saveInLocalStorage(LOCAL_STORAGE_KEYS.soundOutput, action.payload);
      },
      setCameraOutput: (state, action) => {
        state.cameraOutput = action.payload;
        saveInLocalStorage(LOCAL_STORAGE_KEYS.cameraOutput, action.payload);
      },
      setMicrophoneOutput: (state, action) => {
        state.microphoneOutput = action.payload;
        saveInLocalStorage(LOCAL_STORAGE_KEYS.microphoneOutput, action.payload);
      },
      setDevices: (state, action: PayloadAction<IDevice[]>) => {
        state.devices = action.payload;
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
    setCameraPermission, 
    setMicrophonePermission 
  } = settingsSlice.actions

  export const store = configureStore({
    reducer: settingsSlice.reducer
  })
