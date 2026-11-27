import type { ProjectFigure, ProjectScreen, ProjectVideo } from '@/data/content'

// One item of a project's figure, in the order the figure and the media
// viewer both number them: the screens, then the demo video if there is one.
export type MediaItem = { kind: 'screen'; screen: ProjectScreen } | { kind: 'video'; video: ProjectVideo }

export function mediaItems(figure: ProjectFigure): MediaItem[] {
  const screens: MediaItem[] = figure.screens.map((screen) => ({ kind: 'screen', screen }))
  return figure.video ? [...screens, { kind: 'video', video: figure.video }] : screens
}

export function itemName(item: MediaItem): string {
  return item.kind === 'screen' ? item.screen.name : item.video.name
}

export function itemDescription(item: MediaItem): string {
  return item.kind === 'screen' ? item.screen.description : item.video.description
}

// Items are numbered within their figure ("2.3"), the way entries are within
// their section.
export function itemNumber(figureNumber: number, index: number): string {
  return `${figureNumber}.${index + 1}`
}

export function isPortrait(figure: ProjectFigure): boolean {
  return figure.height > figure.width
}

// The capture to show for each theme: one image when the app was captured in
// one theme, or both, with CSS showing the one matching the page. The other
// stays display:none, so its lazily loaded image is never fetched.
export function variants(screen: ProjectScreen) {
  return screen.srcDark
    ? [
        { src: screen.src, className: 'dark:hidden' },
        { src: screen.srcDark, className: 'hidden dark:block' },
      ]
    : [{ src: screen.src, className: '' }]
}

// A chapter's start ("4:13") in seconds.
export function chapterSeconds(time: string): number {
  const [minutes, seconds] = time.split(':').map(Number)
  return minutes * 60 + seconds
}
