import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

import { CameraPreviewer } from "./cameraPreviewer";
import { Setting } from "./setting";
import { setDevices, setCameraPermission, setMicrophonePermission } from "../store/slice";
import { ERROR_STATUS, TOAST_MESSAGES } from "../constant";
import { Toast } from "./Toast";
import { SoundBar } from "./soundBar";

const HTTPS = "https:";
const LOCALHOST = "localhost";


function ControlAccess() {
  const dispatch = useDispatch();


  const getDevices = async () => {

    if (window.location.protocol !== HTTPS && window.location.hostname !== LOCALHOST) {
      toast.error(TOAST_MESSAGES.SecurityError);
      return;
    }

    // get camera permission
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoStream.getTracks().forEach((track) => track.stop());
      dispatch(setCameraPermission({ granted: true }));
    } catch (error: any) {
      let massage = "";
      switch (error.name) {
        case ERROR_STATUS.NotAllowedError:
          massage = TOAST_MESSAGES.NotAllowedErrorForCamera
          break;
        case ERROR_STATUS.NotFoundError:
          massage = TOAST_MESSAGES.NotFoundError
          break;
        case ERROR_STATUS.OverconstrainedError:
          massage = TOAST_MESSAGES.CameraNotReadableError
          break;
        default:
          massage = TOAST_MESSAGES.UnknownError
          break;
      }
      toast.error(massage);
      dispatch(setCameraPermission({ granted: false, error: massage }));
    }

    // get microphone permission
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStream.getTracks().forEach((track) => track.stop());
      dispatch(setMicrophonePermission({ granted: true }));
    } catch (error: any) {
      let massage = "";
      switch (error.name) {
        case ERROR_STATUS.NotAllowedError:
          massage = TOAST_MESSAGES.NotAllowedErrorForMicrophone
          break;
        case ERROR_STATUS.NotFoundError:
          massage = TOAST_MESSAGES.NotFoundError
          break;
        case ERROR_STATUS.OverconstrainedError:
          massage = TOAST_MESSAGES.MicrophoneNotReadableError
          break;
      }
      toast.error(massage);
      dispatch(setMicrophonePermission({ granted: false, error: massage }));
    }

    // get list of devices
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      if (!devices.length) {
        toast.error(TOAST_MESSAGES.NoDevicesFound);
      }
      dispatch(setDevices(devices));
    } catch (deviceError: any) {
      toast.error(TOAST_MESSAGES.GetDevicesError);
    }

  };

  useEffect(() => {
    getDevices();
  }, []);

  //hotplugging device change detection
  useEffect(() => {
    const handleDeviceChange = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      dispatch(setDevices(devices));

      //check if camera and microphone are still connected
      const hasCamera = devices.some((d) => d.kind === "videoinput");
      const hasMic = devices.some((d) => d.kind === "audioinput");

      //show toast if camera or microphone is disconnected
      if (!hasCamera) toast.error(TOAST_MESSAGES.CameraDisconnected);
      if (!hasMic) toast.error(TOAST_MESSAGES.MicrophoneDisconnected);
    };

    //add event listener for device change
    navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange);

    //remove event listener on unmount 
    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", handleDeviceChange);
    };
  }, [dispatch]);

  return (
    <div className="min-w-full p-6 box-border bg-gray-200">
      <div className="w-full mx-auto flex gap-6 items-start justify-center">
        <div className="flex h-full flex-col gap-6 bg-white rounded-lg shadow-lg p-6 w-[70%]">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Live Preview</h2>
          <CameraPreviewer />
          <SoundBar />
        </div>
        <div className="w-[30%]">
          <Setting />
        </div>
      </div>
      <Toast />
    </div>
  );
}

export default ControlAccess;
