import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { VideocamOffIcon, ScreenShareIcon, VideocamIcon } from "../svgs";

import { IRootState } from "../store/type";
import { ERROR_STATUS, TOAST_MESSAGES } from "../constant";

export const Preview = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const { cameraOutput } = useSelector((state: IRootState) => state);

  useEffect(() => {
    const startPreview = async () => {
      try {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: cameraOutput ? { exact: cameraOutput } : undefined
          },
        });

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraOn(true);
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setIsCameraOn(false);
      }
    };

    if (cameraOutput) startPreview();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [cameraOutput]);

  const toggleDisconnectVideo = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
        if (videoRef.current) videoRef.current.srcObject = null;
        setIsCameraOn(false);
        return;
      }

      if (!cameraOutput) {
        toast.error(TOAST_MESSAGES.NotFoundError);
        setIsCameraOn(false);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: cameraOutput } },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOn(true);
      }
    } catch (error: any) {
      if (error.name === ERROR_STATUS.OverconstrainedError) {
        toast.error(TOAST_MESSAGES.CameraNotSelected);
      } else if (error.name === ERROR_STATUS.NotAllowedError) {
        toast.error(TOAST_MESSAGES.NotAllowedError);
      } else if (error.name === ERROR_STATUS.NotFoundError) {
        toast.error(TOAST_MESSAGES.NotFoundError);
      } else {
        toast.error(TOAST_MESSAGES.UnknownError);
      }
    }
  };

  const handleShareScreen = async () => {
    try {
      //use screen capture api to share screen
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = screenStream;
        setIsCameraOn(false);
      }
      streamRef.current = screenStream;
    } catch (error) {
      toast.error(TOAST_MESSAGES.UnknownError);
    }
  };

  return (
    <div className="relative bg-gray-800 rounded-lg h-96 flex items-center justify-center">
      {cameraOutput ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="text-center text-white">
          <VideocamIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>No camera selected</p>
        </div>
      )}


      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          onClick={toggleDisconnectVideo}
          className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg transition-colors duration-200"
          title="Toggle Camera"
        >
          {isCameraOn ? <VideocamOffIcon className="w-5 h-5" /> :
            <VideocamIcon className="w-5 h-5" />}
        </button>

        <button
          onClick={handleShareScreen}
          className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition-colors duration-200"
          title="Share Screen"
        >
          <ScreenShareIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
