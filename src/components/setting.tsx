import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IDevice, IRootState } from "../store/type";
import { setCameraOutput, setMicrophoneOutput, setSoundOutput } from "../store/slice";
import { ErrorIcon, VolumeUpIcon } from "../svgs";
import toast from "react-hot-toast";
import { TOAST_MESSAGES } from "../constant";
import { SettingDropdown } from "./settingDropown";

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
      toast(TOAST_MESSAGES.PleaseSelectASpeakerToTest);
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
        toast(TOAST_MESSAGES.YourBrowserDoesNotSupportSpeakerSwitching);
      }

      await audio.play();

      // stop testing state after 3 seconds
      setTimeout(() => setIsTesting(false), 3000);
    } catch (err) {
      toast.error(`${TOAST_MESSAGES.SpeakerTestFailed}: ${err}`);
      setIsTesting(false);
    }
  };

  const formData = [
    {
      label: "Audio output",
      value: soundOutput || "",
      onChange: (e: React.ChangeEvent<HTMLSelectElement>) => dispatch(setSoundOutput(e.target.value as string)),
      options: audioOutput,
      status: true,
      error: "",
    },
    {
      label: "Microphone",
      value: microphoneOutput || "",
      onChange: (e: React.ChangeEvent<HTMLSelectElement>) => dispatch(setMicrophoneOutput(e.target.value as string)),
      options: audioInput,
      status: microphone.granted,
      error: microphone.error,
    },
    {
      label: "Video input",
      value: cameraOutput || "",
      onChange: (e: React.ChangeEvent<HTMLSelectElement>) => dispatch(setCameraOutput(e.target.value as string)),
      options: cameraDevices,
      status: camera.granted,
      error: camera.error,
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Settings</h2>
      {formData.map((form) => (
        <div key={form.label} className="flex items-center gap-2">
          <SettingDropdown key={form.label} {...form} />
          {form.label === "Audio output" && (
            <button
              onClick={playTestSound}
              disabled={isTesting}
              className={`${isTesting ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                } text-white p-3 rounded-lg transition-colors duration-200 flex items-center gap-2`}
            >
              <VolumeUpIcon className="w-5 h-5" />
              {isTesting ? "Testing..." : "Test"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
