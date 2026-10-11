import { Archivo } from 'next/font/google'

// The datasheet's one face (DESIGN.md), with its width axis: the condensed
// widths set the name, the cover's one-liners, and the table heads; the regular
// width sets the reading text. Loaded by both routes and exposed as
// --font-archivo on each page's .datasheet wrapper.
export const archivo = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-archivo' })
