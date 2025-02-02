import AudioRecorder from './AudioRecorder';
import './App.css';
import { useState } from 'react';

function App() {
  const [speechToText, setSpeechToText] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleAudioRecorded = async (audioBlob: Blob) => {
    setProcessing(true);
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.webm');

    const response = await fetch('http://localhost:3000/transcribe', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    console.log('Transcription:', data);
    setSpeechToText(data.transcription);
    setProcessing(false);
  };

  return (
    <AudioRecorder
      onAudioRecorded={handleAudioRecorded}
      speechToText={speechToText}
      processing={processing}
    />
  );
}

export default App;
