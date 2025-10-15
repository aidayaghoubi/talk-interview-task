import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IDevice, IRootState } from "../store/type";
import { setCameraOutput, setMicrophoneOutput, setSoundOutput } from "../store/slice";
import { ErrorIcon, VolumeUpIcon } from "../svgs";
import toast from "react-hot-toast";

export const Setting = () => {
  const dispatch = useDispatch();
  const { devices } = useSelector((state: IRootState) => state);
  const {
    soundOutput,
    cameraOutput,
    microphoneOutput,
    permissions: { camera, microphone },
  } = useSelector((state: IRootState) => state);

  const audioInput = devices.filter((device: IDevice) => device.kind === "audioinput");
  const cameraDevices = devices.filter((device: IDevice) => device.kind === "videoinput");
  const audioOutput = devices.filter((device: IDevice) => device.kind === "audiooutput");

  const [isTesting, setIsTesting] = useState(false);

  const playTestSound = async () => {
    if (!soundOutput) {
      toast("Please select a speaker to test.");
      return;
    }

    try {
      setIsTesting(true);
      const audio = new Audio("/test.mp3"); 
      //@ts-ignore
      if (audio?.setSinkId) {
        //@ts-ignore
        await audio?.setSinkId(soundOutput);
      } else {
        toast("Your browser does not support speaker switching.");
      }

      await audio.play();

      // stop testing state after 3 seconds
      setTimeout(() => setIsTesting(false), 3000);
    } catch (err) {
      toast.error(`Speaker test failed: ${err}`);
      setIsTesting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Settings</h2>

      {/* Audio output Section */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Audio output</h3>
        <div className="flex items-center gap-3">
          <select
            value={soundOutput || ""}
            onChange={(e) => dispatch(setSoundOutput(e.target.value as string))}
            className="w-full bg-gray-100 rounded-lg px-4 py-3 border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {audioOutput.map((device: IDevice) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || "Unknown speaker"}
              </option>
            ))}
          </select>

          <button
            onClick={playTestSound}
            disabled={isTesting}
            className={`${
              isTesting ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            } text-white p-3 rounded-lg transition-colors duration-200 flex items-center gap-2`}
          >
            <VolumeUpIcon className="w-5 h-5" />
            {isTesting ? "Testing..." : "Test"}
          </button>
        </div>
      </div>

      {/* Microphone Output Section */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          MicrophoneOutput
          {!microphone.granted && (
            <div className="relative group">
              <ErrorIcon className="text-red-500 w-4 h-4" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                {microphone.error}
              </div>
            </div>
          )}
        </h3>
        <select
          value={microphoneOutput || ""}
          onChange={(e) => dispatch(setMicrophoneOutput(e.target.value as string))}
          className="w-full bg-gray-100 rounded-lg px-4 py-3 border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          {audioInput.map((device: IDevice) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label}
            </option>
          ))}
        </select>
      </div>

      {/* Video Input Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          Video Input
          {!camera.granted && (
            <div className="relative group">
              <ErrorIcon className="text-red-500 w-4 h-4" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                {camera.error}
              </div>
            </div>
          )}
        </h3>
        <select
          value={cameraOutput || ""}
          onChange={(e) => dispatch(setCameraOutput(e.target.value as string))}
          className="w-full bg-gray-100 rounded-lg px-4 py-3 border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option key={"none"} value={"none"}>
            none
          </option>
          {cameraDevices.map((device: IDevice) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
