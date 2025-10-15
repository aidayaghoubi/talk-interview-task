import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { IRootState } from "../store/type";
import { MicIcon, MicOffIcon } from "../svgs";

export const SoundBar = () => {
  const { microphoneOutput } = useSelector((state: IRootState) => state);
  const [level, setLevel] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const startMic = async () => {
      if (!microphoneOutput) return;
      
      try {
        //get mic with the exact device id
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: { exact: microphoneOutput } },
        });
        streamRef.current = stream;

        //create audio context to filter , analyze and get the sound level
        const audioCtx = new AudioContext();
        // it is like live sound scanner that let me get the sound level
        const analyser = audioCtx.createAnalyser();
        // default fftSize is 2048 but can change to power of 2 from 2 to 15
        analyser.fftSize = 512;
        // create a source with the mic stream to get the sound level
        const source = audioCtx.createMediaStreamSource(stream);
        // move the source to the analyser
        source.connect(analyser);

        //create dataArray with length of the half of the analyser.fftSize and empty
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        // 
        const update = () => {
          // fill the dataArray with the sound level
          analyser.getByteFrequencyData(dataArray);
          // get the average of the dataArray
          const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          // max number is 255 so we divide it by 255 to get the level
          setLevel(avg / 255);
          animationRef.current = requestAnimationFrame(update);
        };

        audioContextRef.current = audioCtx;
        analyserRef.current = analyser;
        sourceRef.current = source;
        setIsMuted(false);
        update();
      } catch (err) {
        console.error("Microphone    error:", err);
      }
    };
    startMic();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (streamRef.current)
        streamRef.current.getTracks().forEach((track) => track.stop());
      audioContextRef.current?.close();
    };
  }, [microphoneOutput]);


  function muteSound() {
    if (sourceRef.current) {
      sourceRef.current.disconnect();
    }
    setIsMuted(true);
  }

  function unmuteSound() {

    if (sourceRef.current) {
      sourceRef.current.connect(analyserRef.current!);
      setIsMuted(false);
    }
  }

  return (
    <div className="flex flex-col w-full items-start justify-start">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Microphone Level</h2>
      <div className="flex gap-4 w-full items-center justify-start" >
        {microphoneOutput ? (
          <div className="w-full max-w-full h-6 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-6 rounded-full transition-all duration-100 bg-green-500`}
              style={{ width: `${level * 100}%` }}
            />
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <MicOffIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No microphone selected</p>
          </div>
        )}
        <div>
          {isMuted ? (
            <button onClick={unmuteSound} className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg transition-colors duration-200 flex items-center gap-2">
              <MicIcon className="w-5 h-5" />
            </button>
          ) : (
            <button onClick={muteSound} className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg transition-colors duration-200 flex items-center gap-2">
              <MicOffIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


// https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/fftSize
// first i read this doc and i create a wave but then 
// i use another approach to show a sound bar not wave