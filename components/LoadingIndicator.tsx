/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "Warming up the digital director...",
  "Gathering pixels and photons...",
  "Storyboarding your vision...",
  "Consulting with the AI muse...",
  "Rendering the first scene...",
  "Applying cinematic lighting...",
  "This can take a few minutes, hang tight!",
  "Adding a touch of movie magic...",
  "Composing the final cut...",
  "Polishing the masterpiece...",
  "Teaching the AI to say 'I'll be back'...",
  "Checking for digital dust bunnies...",
  "Calibrating the irony sensors...",
  "Untangling the timelines...",
  "Enhancing to ludicrous speed...",
  "Don't worry, the pixels are friendly.",
  "Harvesting nano banana stems...",
  "Praying to the Gemini star...",
  "Starting a draft for your oscar speech..."
];

const LoadingIndicator: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 3000); // Change message every 3 seconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-12 bg-[#121212] rounded-2xl border border-gray-800 shadow-2xl relative">
       {/* Ambient glow */}
      <div className="absolute inset-0 bg-amber-500/5 blur-xl rounded-2xl"></div>
      
      <div className="relative">
        <div className="w-16 h-16 border-2 border-gray-800 rounded-full"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-2 border-t-transparent border-amber-500 rounded-full animate-spin"></div>
      </div>
      <h2 className="text-xl font-medium mt-8 text-amber-500 tracking-wide uppercase">Generating Video</h2>
      <p className="mt-3 text-gray-500 text-center text-sm transition-opacity duration-500 max-w-xs">
        {loadingMessages[messageIndex]}
      </p>
    </div>
  );
};

export default LoadingIndicator;