'use client'

import { useEffect, useState } from 'react'
import { experience, projects, stackLayers, type StackLayer } from '@/data/content'
import { techAnchorId } from './sections'
import { traceTechnology, type StackTrace, type TraceHit } from './traceStack'

interface TracedTechnology {
  name: string
  trace: StackTrace
}

// Traced once: the content is static, and a technology that no role or
// project names is not drawn at all (the diagram claims nothing it can't
// point at).
const layers = new Map(
  stackLayers.map((layer: StackLayer) => [
    layer.id,
    {
      label: layer.label,
      technologies: layer.technologies
        .map((technology) => ({
          name: technology.name,
          trace: traceTechnology(technology, experience, projects),
        }))
        .filter(({ trace }) => trace.roles.length + trace.projects.length > 0),
    },
  ])
)

const traced = [...layers.values()].flatMap((layer) => layer.technologies)
const firstTraced = traced[0]
const byAnchor = new Map(traced.map((technology) => [techAnchorId(technology.name), technology]))

function count(n: number, noun: string) {
  return `${n} ${noun}${n === 1 ? '' : 's'}`
}

function Block({
  layerId,
  selected,
  onSelect,
  className = '',
}: {
  layerId: string
  selected: string
  onSelect: (technology: TracedTechnology) => void
  className?: string
}) {
  const layer = layers.get(layerId)
  if (!layer || layer.technologies.length === 0) return null
  return (
    <div className={`border border-ds-ink bg-ds-paper p-2.5 ${className}`}>
      <p className="mb-1.5 text-[0.6875rem] font-bold tracking-[0.06em] text-ds-ink-2 uppercase [font-stretch:85%]">
        {layer.label}
      </p>
      {/* Technologies are the block's pins: a square marker and a name, the
          marker the same cell the rating meters fill. The selected pin is
          filled; the rest stay open on the paper. */}
      <ul className="-mx-1.5 flex flex-wrap gap-x-1 gap-y-0.5">
        {layer.technologies.map((technology) => {
          const isSelected = technology.name === selected
          return (
            <li key={technology.name}>
              <button
                id={techAnchorId(technology.name)}
                type="button"
                aria-pressed={isSelected}
                aria-controls="stack-trace"
                onClick={() => onSelect(technology)}
                className={`group inline-flex min-h-7 cursor-pointer items-center gap-1.5 px-1.5 text-[0.8125rem] leading-tight font-semibold transition-colors duration-[120ms] ${
                  isSelected ? 'bg-ds-accent text-ds-accent-ink' : 'text-ds-ink hover:bg-ds-fill'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`size-2 shrink-0 ${isSelected ? 'bg-ds-accent-ink' : 'bg-ds-cell-off group-hover:bg-ds-ink-2'}`}
                />
                {technology.name}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

// A signal line between blocks, labelled with what travels on it.
function Signal({ label, direction }: { label: string; direction: 'down' | 'across' }) {
  return direction === 'down' ? (
    <div className="flex h-9 items-stretch gap-2 pl-6" aria-hidden="true">
      <span className="w-px bg-ds-ink" />
      <span className="self-center text-[0.6875rem] font-semibold text-ds-ink-3 [font-stretch:85%]">{label}</span>
    </div>
  ) : (
    <div className="flex min-w-10 flex-col items-stretch justify-center gap-1 px-1" aria-hidden="true">
      <span className="text-center text-[0.6875rem] font-semibold text-ds-ink-3 [font-stretch:85%]">{label}</span>
      <span className="h-px bg-ds-ink" />
    </div>
  )
}

function HitList({ label, hits }: { label: string; hits: TraceHit[] }) {
  if (hits.length === 0) return null
  return (
    <div>
      <p className="mb-1 text-[0.6875rem] font-bold tracking-[0.06em] text-ds-ink-2 uppercase [font-stretch:85%]">
        {label}
      </p>
      <ul className="space-y-1">
        {hits.map((hit) => (
          <li key={hit.id}>
            <a href={`#${hit.id}`} className="group flex gap-2 text-[0.875rem] leading-snug text-ds-ink">
              <span className="w-7 shrink-0 font-semibold text-ds-accent tabular-nums">{hit.number}</span>
              <span className="underline decoration-ds-rule group-hover:decoration-ds-ink">{hit.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function StackDiagram() {
  const [selected, setSelected] = useState<TracedTechnology>(firstTraced)
  const select = (technology: TracedTechnology) => setSelected(technology)
  const { roles, projects: projectHits } = selected.trace

  // Links elsewhere on the page point at a pin (#tech-react) to show where
  // that technology shipped. Following one, or arriving with one in the URL,
  // selects it. Clicks are watched as well as hashchange, because following
  // the link the URL already holds fires no hashchange.
  useEffect(() => {
    const selectAnchor = (hash: string) => {
      const technology = byAnchor.get(hash.replace(/^#/, ''))
      if (technology) setSelected(technology)
    }
    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest('a[href^="#tech-"]') : null
      if (link) selectAnchor(link.getAttribute('href') ?? '')
    }
    const onHashChange = () => selectAnchor(window.location.hash)

    onHashChange()
    document.addEventListener('click', onClick)
    window.addEventListener('hashchange', onHashChange)
    return () => {
      document.removeEventListener('click', onClick)
      window.removeEventListener('hashchange', onHashChange)
    }
  }, [])

  return (
    <figure aria-labelledby="stack-figure-caption" className="m-0">
      <div className="grid grid-cols-[1fr_auto_1fr]">
        <Block layerId="frontend" selected={selected.name} onSelect={select} className="col-span-3" />
        <div className="col-span-3">
          <Signal label="REST · JSON" direction="down" />
        </div>
        <Block layerId="server" selected={selected.name} onSelect={select} />
        <Signal label="APIs" direction="across" />
        <Block layerId="integrations" selected={selected.name} onSelect={select} />
        <div className="col-span-3">
          <Signal label="SQL" direction="down" />
        </div>
        <Block layerId="data" selected={selected.name} onSelect={select} />
      </div>

      <figcaption id="stack-figure-caption" className="mt-3 text-[0.8125rem] text-ds-ink-2">
        <span className="font-bold text-ds-ink">Figure 1.</span> Functional block diagram. Select a technology to
        see the roles and projects that name it.
      </figcaption>

      <div id="stack-trace" role="status" className="mt-4 border border-ds-rule">
        <p className="flex flex-wrap items-baseline justify-between gap-x-3 border-b border-ds-rule bg-ds-fill px-3 py-2">
          <span className="text-[0.9375rem] font-bold">{selected.name}</span>
          <span className="text-[0.75rem] text-ds-ink-2">
            Named in {[roles.length && count(roles.length, 'role'), projectHits.length && count(projectHits.length, 'project')]
              .filter(Boolean)
              .join(' and ')}
          </span>
        </p>
        <div className="space-y-3 px-3 py-3">
          <HitList label="Roles" hits={roles} />
          <HitList label="Projects" hits={projectHits} />
        </div>
      </div>
    </figure>
  )
}
