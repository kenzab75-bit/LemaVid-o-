/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import {ArrowPathIcon, PlusIcon, SparklesIcon} from './icons';

interface VideoResultProps {
  videoUrl: string;
  onRetry: () => void;
  onNewVideo: () => void;
  onExtend: () => void;
  canExtend: boolean;
}

const VideoResult: React.FC<VideoResultProps> = ({
  videoUrl,
  onRetry,
  onNewVideo,
  onExtend,
  canExtend,
}) => {
  return (
    <div className="w-full flex flex-col items-center gap-8 p-1 bg-[#121212] rounded-xl border border-gray-800 shadow-2xl relative overflow-hidden">
       {/* Golden accent line */}
       <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent opacity-50"></div>
       
      <div className="w-full p-8 flex flex-col items-center gap-8 relative z-10">
        <h2 className="text-xl font-light tracking-widest text-amber-500 uppercase">
          Creation Ready
        </h2>
        <div className="w-full max-w-3xl aspect-video rounded-lg overflow-hidden bg-black shadow-2xl border border-gray-800 ring-1 ring-white/5">
          <video
            src={videoUrl}
            controls
            autoPlay
            loop
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-6 py-3 bg-gray-900 border border-gray-700 hover:bg-gray-800 text-gray-300 font-medium rounded-lg transition-colors shadow-sm">
            <ArrowPathIcon className="w-4 h-4" />
            Retry
          </button>
          {canExtend && (
            <button
              onClick={onExtend}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-medium rounded-lg transition-all shadow-lg shadow-amber-900/30">
              <SparklesIcon className="w-4 h-4 text-amber-200" />
              Extend
            </button>
          )}
          <button
            onClick={onNewVideo}
            className="flex items-center gap-2 px-6 py-3 bg-gray-200 hover:bg-white text-black font-semibold rounded-lg transition-colors shadow-lg shadow-white/5">
            <PlusIcon className="w-4 h-4" />
            New Video
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoResult;