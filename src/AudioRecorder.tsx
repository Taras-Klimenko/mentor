import { useState, useRef } from 'react';
import Spinner from './components/spinner/Spinner';

const AudioRecorder = ({
  onAudioRecorded,
  speechToText,
  processing,
}: {
  onAudioRecorded: (audioBlob: Blob) => void;
  speechToText: string;
  processing: boolean;
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    audioChunks.current = [];

    recorder.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    recorder.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
      onAudioRecorded(audioBlob);
    };

    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <>
      <div>
        <button onClick={startRecording} disabled={isRecording}>
          🎤 Start Recording
        </button>
        <button onClick={stopRecording} disabled={!isRecording}>
          ⏹ Stop Recording
        </button>
      </div>
      <div>{processing ? <Spinner /> : speechToText}</div>
    </>
  );
};

export default AudioRecorder;
