import React, { useEffect } from 'react';
import './App.css';
import { Preview } from './components/preview';
import { Setting } from './components/setting';
import { setDevices, setCameraPermission, setMicrophonePermission } from './store/slice';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { TOAST_MESSAGES } from './constant';
import { Toast } from './components/Toast';
import { SoundBar } from './components/soundBar';

//show only on https and localhost
const HTTPS = "https:";
const LOCALHOST = "localhost";

function ControlAccess() {
  const dispatch = useDispatch();

  const getDevices = async () => {
    if (window.location.protocol !== HTTPS && window.location.hostname !== LOCALHOST) {
      toast.error(TOAST_MESSAGES.SecurityError);
      return;
    }

    let cameraGranted = false;
    let micGranted = false;

    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoStream.getTracks().forEach(track => track.stop());
      dispatch(setCameraPermission({ granted: true }));
      cameraGranted = true;
    } catch (error: any) {
      dispatch(setCameraPermission({ granted: false, error: `camera: ${error.message}` }));
    }

    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStream.getTracks().forEach(track => track.stop());
      dispatch(setMicrophonePermission({ granted: true }));
      micGranted = true;
    } catch (error: any) {
      dispatch(setMicrophonePermission({ granted: false, error: `microphone: ${error.message}` }));
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      dispatch(setDevices(devices));
    } catch (deviceError) {
      toast.error(TOAST_MESSAGES.GetDevicesError);
    }

    if (cameraGranted && micGranted) {
      toast.success(TOAST_MESSAGES.CameraAndMicrophonePermissionsGranted);
    } else if (cameraGranted && !micGranted) {
      toast.error(TOAST_MESSAGES.CameraGrantedButMicrophoneDenied);
    } else if (!cameraGranted && micGranted) {
      toast.error(TOAST_MESSAGES.MicrophoneGrantedButCameraDenied);
    } else {
      toast.error(TOAST_MESSAGES.BothCameraAndMicrophoneDenied);
    }
  };

  useEffect(() => {
    getDevices();
  }, []);


  useEffect(() => {
    //hotplugging device change detection
    const handleDeviceChange = async () => {
      const devices = await navigator.mediaDevices.enumerateDevices();
      dispatch(setDevices(devices));
    };

    //add event listener for device change
    navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange);
    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", handleDeviceChange);
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen min-w-full p-6 box-border bg-gray-200">
      <div className="max-w-7xl min-h-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-center justify-center">
        <div className="flex flex-col gap-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Live Preview</h2>
          <Preview />
          <SoundBar />
        </div>
        <Setting />
      </div>
      <Toast />
    </div>
  );
}

export default ControlAccess;
