/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {Video} from '@google/genai';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  AspectRatio,
  GenerateVideoParams,
  GenerationMode,
  ImageFile,
  Resolution,
  VeoModel,
  VideoFile,
} from '../types';
import {
  ArrowRightIcon,
  ChevronDownIcon,
  FilmIcon,
  FramesModeIcon,
  PlusIcon,
  RectangleStackIcon,
  ReferencesModeIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  TextModeIcon,
  TvIcon,
  XMarkIcon,
} from './icons';

const aspectRatioDisplayNames: Record<AspectRatio, string> = {
  [AspectRatio.LANDSCAPE]: 'Landscape (16:9)',
  [AspectRatio.PORTRAIT]: 'Portrait (9:16)',
};

const modeIcons: Record<GenerationMode, React.ReactNode> = {
  [GenerationMode.TEXT_TO_VIDEO]: <TextModeIcon className="w-5 h-5" />,
  [GenerationMode.FRAMES_TO_VIDEO]: <FramesModeIcon className="w-5 h-5" />,
  [GenerationMode.REFERENCES_TO_VIDEO]: (
    <ReferencesModeIcon className="w-5 h-5" />
  ),
  [GenerationMode.EXTEND_VIDEO]: <FilmIcon className="w-5 h-5" />,
};

const fileToBase64 = <T extends {file: File; base64: string}>(
  file: File,
): Promise<T> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      if (base64) {
        resolve({file, base64} as T);
      } else {
        reject(new Error('Failed to read file as base64.'));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};
const fileToImageFile = (file: File): Promise<ImageFile> =>
  fileToBase64<ImageFile>(file);
const fileToVideoFile = (file: File): Promise<VideoFile> =>
  fileToBase64<VideoFile>(file);

const CustomSelect: React.FC<{
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  icon: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
}> = ({label, value, onChange, icon, children, disabled = false}) => (
  <div>
    <label
      className={`text-xs block mb-1.5 font-medium tracking-wide uppercase ${
        disabled ? 'text-gray-600' : 'text-amber-500/80'
      }`}>
      {label}
    </label>
    <div className="relative group">
      <div className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none transition-colors ${disabled ? 'text-gray-600' : 'text-amber-500/50 group-hover:text-amber-400'}`}>
        {icon}
      </div>
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full bg-[#121212] border border-gray-800 rounded-lg pl-10 pr-8 py-2.5 appearance-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 disabled:bg-gray-900 disabled:border-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed text-gray-200 shadow-inner transition-colors hover:border-gray-700">
        {children}
      </select>
      <ChevronDownIcon
        className={`w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
          disabled ? 'text-gray-700' : 'text-gray-500'
        }`}
      />
    </div>
  </div>
);

const ImageUpload: React.FC<{
  onSelect: (image: ImageFile) => void;
  onRemove?: () => void;
  image?: ImageFile | null;
  label: React.ReactNode;
}> = ({onSelect, onRemove, image, label}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const imageFile = await fileToImageFile(file);
        onSelect(imageFile);
      } catch (error) {
        console.error('Error converting file:', error);
      }
    }
    // Reset input value to allow selecting the same file again
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  if (image) {
    return (
      <div className="relative w-28 h-20 group ring-1 ring-gray-700 rounded-lg">
        <img
          src={URL.createObjectURL(image.file)}
          alt="preview"
          className="w-full h-full object-cover rounded-lg opacity-80 group-hover:opacity-100 transition-opacity"
        />
        <button
          type="button"
          onClick={onRemove}
          className="absolute -top-2 -right-2 w-6 h-6 bg-black border border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:border-amber-500 transition-all shadow-lg"
          aria-label="Remove image">
          <XMarkIcon className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className="w-28 h-20 bg-[#121212] hover:bg-[#1a1a1a] border border-dashed border-gray-700 hover:border-amber-500/50 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:text-amber-500 transition-all group">
      <PlusIcon className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
      <span className="text-[10px] uppercase tracking-wider">{label}</span>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </button>
  );
};

const VideoUpload: React.FC<{
  onSelect: (video: VideoFile) => void;
  onRemove?: () => void;
  video?: VideoFile | null;
  label: React.ReactNode;
}> = ({onSelect, onRemove, video, label}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const videoFile = await fileToVideoFile(file);
        onSelect(videoFile);
      } catch (error) {
        console.error('Error converting file:', error);
      }
    }
  };

  if (video) {
    return (
      <div className="relative w-48 h-28 group ring-1 ring-gray-700 rounded-lg">
        <video
          src={URL.createObjectURL(video.file)}
          muted
          loop
          className="w-full h-full object-cover rounded-lg opacity-80 group-hover:opacity-100 transition-opacity"
        />
        <button
          type="button"
          onClick={onRemove}
          className="absolute -top-2 -right-2 w-6 h-6 bg-black border border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:border-amber-500 transition-all shadow-lg"
          aria-label="Remove video">
          <XMarkIcon className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className="w-48 h-28 bg-[#121212] hover:bg-[#1a1a1a] border border-dashed border-gray-700 hover:border-amber-500/50 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:text-amber-500 transition-all group text-center">
      <PlusIcon className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
      <span className="text-[10px] uppercase tracking-wider px-2 leading-tight">{label}</span>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept="video/*"
        className="hidden"
      />
    </button>
  );
};

interface PromptFormProps {
  onGenerate: (params: GenerateVideoParams) => void;
  initialValues?: GenerateVideoParams | null;
}

const PromptForm: React.FC<PromptFormProps> = ({
  onGenerate,
  initialValues,
}) => {
  const [prompt, setPrompt] = useState(initialValues?.prompt ?? '');
  const [model, setModel] = useState<VeoModel>(
    initialValues?.model ?? VeoModel.VEO_FAST,
  );
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(
    initialValues?.aspectRatio ?? AspectRatio.LANDSCAPE,
  );
  const [resolution, setResolution] = useState<Resolution>(
    initialValues?.resolution ?? Resolution.P720,
  );
  const [generationMode, setGenerationMode] = useState<GenerationMode>(
    initialValues?.mode ?? GenerationMode.TEXT_TO_VIDEO,
  );
  const [startFrame, setStartFrame] = useState<ImageFile | null>(
    initialValues?.startFrame ?? null,
  );
  const [endFrame, setEndFrame] = useState<ImageFile | null>(
    initialValues?.endFrame ?? null,
  );
  const [referenceImages, setReferenceImages] = useState<ImageFile[]>(
    initialValues?.referenceImages ?? [],
  );
  const [styleImage, setStyleImage] = useState<ImageFile | null>(
    initialValues?.styleImage ?? null,
  );
  const [inputVideo, setInputVideo] = useState<VideoFile | null>(
    initialValues?.inputVideo ?? null,
  );
  const [inputVideoObject, setInputVideoObject] = useState<Video | null>(
    initialValues?.inputVideoObject ?? null,
  );
  const [isLooping, setIsLooping] = useState(initialValues?.isLooping ?? false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isModeSelectorOpen, setIsModeSelectorOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modeSelectorRef = useRef<HTMLDivElement>(null);

  // Sync state with initialValues prop when it changes (e.g., for "Extend" or "Try Again")
  useEffect(() => {
    if (initialValues) {
      setPrompt(initialValues.prompt ?? '');
      setModel(initialValues.model ?? VeoModel.VEO_FAST);
      setAspectRatio(initialValues.aspectRatio ?? AspectRatio.LANDSCAPE);
      setResolution(initialValues.resolution ?? Resolution.P720);
      setGenerationMode(initialValues.mode ?? GenerationMode.TEXT_TO_VIDEO);
      setStartFrame(initialValues.startFrame ?? null);
      setEndFrame(initialValues.endFrame ?? null);
      setReferenceImages(initialValues.referenceImages ?? []);
      setStyleImage(initialValues.styleImage ?? null);
      setInputVideo(initialValues.inputVideo ?? null);
      setInputVideoObject(initialValues.inputVideoObject ?? null);
      setIsLooping(initialValues.isLooping ?? false);
    }
  }, [initialValues]);

  useEffect(() => {
    if (generationMode === GenerationMode.REFERENCES_TO_VIDEO) {
      setModel(VeoModel.VEO);
      setAspectRatio(AspectRatio.LANDSCAPE);
      setResolution(Resolution.P720);
    } else if (generationMode === GenerationMode.EXTEND_VIDEO) {
      setResolution(Resolution.P720);
    }
  }, [generationMode]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [prompt]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modeSelectorRef.current &&
        !modeSelectorRef.current.contains(event.target as Node)
      ) {
        setIsModeSelectorOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onGenerate({
        prompt,
        model,
        aspectRatio,
        resolution,
        mode: generationMode,
        startFrame,
        endFrame,
        referenceImages,
        styleImage,
        inputVideo,
        inputVideoObject,
        isLooping,
      });
    },
    [
      prompt,
      model,
      aspectRatio,
      resolution,
      generationMode,
      startFrame,
      endFrame,
      referenceImages,
      styleImage,
      inputVideo,
      inputVideoObject,
      onGenerate,
      isLooping,
    ],
  );

  const handleSelectMode = (mode: GenerationMode) => {
    setGenerationMode(mode);
    setIsModeSelectorOpen(false);
    // Reset media when mode changes to avoid confusion
    setStartFrame(null);
    setEndFrame(null);
    setReferenceImages([]);
    setStyleImage(null);
    setInputVideo(null);
    setInputVideoObject(null);
    setIsLooping(false);
  };

  const promptPlaceholder = {
    [GenerationMode.TEXT_TO_VIDEO]: 'Describe the video you want to create...',
    [GenerationMode.FRAMES_TO_VIDEO]:
      'Describe motion between start and end frames (optional)...',
    [GenerationMode.REFERENCES_TO_VIDEO]:
      'Describe a video using reference and style images...',
    [GenerationMode.EXTEND_VIDEO]: 'Describe what happens next (optional)...',
  }[generationMode];

  const selectableModes = [
    GenerationMode.TEXT_TO_VIDEO,
    GenerationMode.FRAMES_TO_VIDEO,
    GenerationMode.REFERENCES_TO_VIDEO,
  ];

  const renderMediaUploads = () => {
    if (generationMode === GenerationMode.FRAMES_TO_VIDEO) {
      return (
        <div className="mb-4 p-5 bg-[#0f0f0f] rounded-xl border border-gray-800 flex flex-col items-center justify-center gap-5 shadow-inner">
          <div className="flex items-center justify-center gap-6">
            <ImageUpload
              label="Start Frame"
              image={startFrame}
              onSelect={setStartFrame}
              onRemove={() => {
                setStartFrame(null);
                setIsLooping(false);
              }}
            />
            {!isLooping && (
              <ImageUpload
                label="End Frame"
                image={endFrame}
                onSelect={setEndFrame}
                onRemove={() => setEndFrame(null)}
              />
            )}
          </div>
          {startFrame && !endFrame && (
            <div className="flex items-center bg-[#1a1a1a] px-3 py-1.5 rounded-full border border-gray-800">
              <input
                id="loop-video-checkbox"
                type="checkbox"
                checked={isLooping}
                onChange={(e) => setIsLooping(e.target.checked)}
                className="w-4 h-4 text-amber-600 bg-black border-gray-600 rounded focus:ring-amber-500 focus:ring-offset-gray-900 cursor-pointer"
              />
              <label
                htmlFor="loop-video-checkbox"
                className="ml-2 text-xs font-medium text-gray-400 cursor-pointer uppercase tracking-wide">
                Loop Video
              </label>
            </div>
          )}
        </div>
      );
    }
    if (generationMode === GenerationMode.REFERENCES_TO_VIDEO) {
      return (
        <div className="mb-4 p-5 bg-[#0f0f0f] rounded-xl border border-gray-800 flex flex-wrap items-center justify-center gap-3 shadow-inner">
          {referenceImages.map((img, index) => (
            <ImageUpload
              key={index}
              image={img}
              label=""
              onSelect={() => {}}
              onRemove={() =>
                setReferenceImages((imgs) => imgs.filter((_, i) => i !== index))
              }
            />
          ))}
          {referenceImages.length < 3 && (
            <ImageUpload
              label="Add Reference"
              onSelect={(img) => setReferenceImages((imgs) => [...imgs, img])}
            />
          )}
        </div>
      );
    }
    if (generationMode === GenerationMode.EXTEND_VIDEO) {
      return (
        <div className="mb-4 p-5 bg-[#0f0f0f] rounded-xl border border-gray-800 flex items-center justify-center gap-4 shadow-inner">
          <VideoUpload
            label={
              <>
                Input Video
                <br />
                <span className="text-[9px] opacity-70">(must be 720p veo generated)</span>
              </>
            }
            video={inputVideo}
            onSelect={setInputVideo}
            onRemove={() => {
              setInputVideo(null);
              setInputVideoObject(null);
            }}
          />
        </div>
      );
    }
    return null;
  };

  const isRefMode = generationMode === GenerationMode.REFERENCES_TO_VIDEO;
  const isExtendMode = generationMode === GenerationMode.EXTEND_VIDEO;

  let isSubmitDisabled = false;
  let tooltipText = '';

  switch (generationMode) {
    case GenerationMode.TEXT_TO_VIDEO:
      isSubmitDisabled = !prompt.trim();
      if (isSubmitDisabled) {
        tooltipText = 'Please enter a prompt.';
      }
      break;
    case GenerationMode.FRAMES_TO_VIDEO:
      isSubmitDisabled = !startFrame;
      if (isSubmitDisabled) {
        tooltipText = 'A start frame is required.';
      }
      break;
    case GenerationMode.REFERENCES_TO_VIDEO:
      const hasNoRefs = referenceImages.length === 0;
      const hasNoPrompt = !prompt.trim();
      isSubmitDisabled = hasNoRefs || hasNoPrompt;
      if (hasNoRefs && hasNoPrompt) {
        tooltipText = 'Please add reference image(s) and enter a prompt.';
      } else if (hasNoRefs) {
        tooltipText = 'At least one reference image is required.';
      } else if (hasNoPrompt) {
        tooltipText = 'Please enter a prompt.';
      }
      break;
    case GenerationMode.EXTEND_VIDEO:
      isSubmitDisabled = !inputVideoObject;
      if (isSubmitDisabled) {
        tooltipText =
          'An input video from a previous generation is required to extend.';
      }
      break;
  }

  return (
    <div className="relative w-full">
      {isSettingsOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-3 p-6 bg-[#0f0f0f]/95 backdrop-blur-md rounded-2xl border border-gray-800 shadow-2xl z-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CustomSelect
              label="Model"
              value={model}
              onChange={(e) => setModel(e.target.value as VeoModel)}
              icon={<SparklesIcon className="w-5 h-5" />}
              disabled={isRefMode}>
              {Object.values(VeoModel).map((modelValue) => (
                <option key={modelValue} value={modelValue}>
                  {modelValue}
                </option>
              ))}
            </CustomSelect>
            <CustomSelect
              label="Aspect Ratio"
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
              icon={<RectangleStackIcon className="w-5 h-5" />}
              disabled={isRefMode || isExtendMode}>
              {Object.entries(aspectRatioDisplayNames).map(([key, name]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </CustomSelect>
            <div>
              <CustomSelect
                label="Resolution"
                value={resolution}
                onChange={(e) => setResolution(e.target.value as Resolution)}
                icon={<TvIcon className="w-5 h-5" />}
                disabled={isRefMode || isExtendMode}>
                <option value={Resolution.P720}>720p</option>
                <option value={Resolution.P1080}>1080p</option>
              </CustomSelect>
              {resolution === Resolution.P1080 && (
                <p className="text-[10px] text-amber-500/80 mt-2 flex items-center gap-1">
                  <span>⚠️</span> 1080p videos can't be extended.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="w-full">
        {renderMediaUploads()}
        <div className="flex items-end gap-2 bg-[#121212] border border-gray-800 rounded-2xl p-2 shadow-xl focus-within:ring-1 focus-within:ring-amber-500/50 transition-shadow">
          <div className="relative" ref={modeSelectorRef}>
            <button
              type="button"
              onClick={() => setIsModeSelectorOpen((prev) => !prev)}
              className="flex shrink-0 items-center gap-2 px-3 py-3 rounded-xl hover:bg-gray-800 text-gray-400 hover:text-amber-100 transition-colors"
              aria-label="Select generation mode">
              {modeIcons[generationMode]}
              <span className="font-medium text-sm whitespace-nowrap tracking-tight">
                {generationMode}
              </span>
            </button>
            {isModeSelectorOpen && (
              <div className="absolute bottom-full mb-2 w-60 bg-[#1a1a1a] border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-30">
                {selectableModes.map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => handleSelectMode(mode)}
                    className={`w-full text-left flex items-center gap-3 p-3.5 hover:bg-amber-900/20 ${generationMode === mode ? 'bg-amber-900/30 text-amber-100' : 'text-gray-300'}`}>
                    <div className={generationMode === mode ? 'text-amber-400' : 'text-gray-500'}>
                      {modeIcons[mode]}
                    </div>
                    <span className="text-sm">{mode}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={promptPlaceholder}
            className="flex-grow bg-transparent focus:outline-none resize-none text-base text-gray-200 placeholder-gray-600 max-h-48 py-2.5 px-2 leading-relaxed"
            rows={1}
          />
          <button
            type="button"
            onClick={() => setIsSettingsOpen((prev) => !prev)}
            className={`p-3 rounded-full hover:bg-gray-800 transition-colors ${isSettingsOpen ? 'bg-gray-800 text-amber-400' : 'text-gray-500'}`}
            aria-label="Toggle settings">
            <SlidersHorizontalIcon className="w-5 h-5" />
          </button>
          <div className="relative group">
            <button
              type="submit"
              className="p-3 bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 rounded-full hover:from-amber-400 hover:to-amber-500 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-black shadow-lg shadow-amber-900/20 transition-all transform active:scale-95"
              aria-label="Generate video"
              disabled={isSubmitDisabled}>
              <ArrowRightIcon className="w-5 h-5" strokeWidth={2.5} />
            </button>
            {isSubmitDisabled && tooltipText && (
              <div
                role="tooltip"
                className="absolute bottom-full right-0 mb-3 w-max max-w-xs px-3 py-2 bg-gray-900 border border-gray-700 text-gray-200 text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
                {tooltipText}
              </div>
            )}
          </div>
        </div>
        <p className="text-[11px] text-gray-600 text-center mt-3 px-4 font-medium tracking-wide">
          Veo is a paid-only model. You will be charged on your Cloud project. See{' '}
          <a
            href="https://ai.google.dev/gemini-api/docs/pricing#veo-3"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-600 hover:text-amber-500 hover:underline"
          >
            pricing details
          </a>
          .
        </p>
      </form>
    </div>
  );
};

export default PromptForm;