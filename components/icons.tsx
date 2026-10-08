// One small icon set for the site, drawn on a 16px grid with a 1.5px stroke
// in currentColor so each icon takes its colour and size from the text it
// sits beside. Decorative only: every icon is aria-hidden, and the control
// or link that holds it carries the accessible name.
import type { SVGProps } from 'react'

function Icon({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

export function DownloadIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M8 2.5v8M4.5 7 8 10.5 11.5 7M3 13.5h10" />
    </Icon>
  )
}

export function ExternalIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M6 3.5h6.5V10M12.5 3.5 4 12" />
    </Icon>
  )
}

export function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M2.5 4h11v8h-11zM2.5 4 8 8.5 13.5 4" />
    </Icon>
  )
}

export function ArrowDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M8 2.5v11M4 9.5l4 4 4-4" />
    </Icon>
  )
}
