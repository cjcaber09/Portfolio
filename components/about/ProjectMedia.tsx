'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import type { ProjectFigure } from '@/data/content'
import { projectLinkPrimary } from '../actions'
import { PlayIcon } from '../icons'
import { MediaViewer } from './MediaViewer'
import { mediaItems } from './mediaItems'

// Opens the entry's media viewer at an item of its figure.
const OpenMedia = createContext<(index: number) => void>(() => {})

export function useOpenMedia() {
  return useContext(OpenMedia)
}

// One project entry's media: its figure and its demo button both open the
// same viewer, so the entry is wrapped in this one provider while its text
// and figure stay where they are.
export function ProjectMedia({
  figure,
  number,
  title,
  children,
}: {
  figure: ProjectFigure
  number: number
  title: string
  children: ReactNode
}) {
  const [index, setIndex] = useState<number | null>(null)
  const close = useCallback(() => setIndex(null), [])

  return (
    <OpenMedia.Provider value={setIndex}>
      {children}
      <MediaViewer
        figure={figure}
        number={number}
        title={title}
        index={index}
        onIndexChange={setIndex}
        onClose={close}
      />
    </OpenMedia.Provider>
  )
}

// The entry's first action when its figure has a demo video: it opens the
// viewer at the video, the figure's last item.
export function PlayDemoButton({ figure }: { figure: ProjectFigure }) {
  const open = useOpenMedia()
  if (!figure.video) return null
  return (
    <button type="button" className={projectLinkPrimary} onClick={() => open(mediaItems(figure).length - 1)}>
      <PlayIcon className="text-[0.8125rem]" />
      Demo Video
      <span className="font-normal tabular-nums">{figure.video.duration}</span>
    </button>
  )
}
