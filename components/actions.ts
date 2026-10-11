// The datasheet's action controls (DESIGN.md, "Action Strip"): 40px, 2px
// corners, an icon beside the label. Primary is solid green and steps to solid
// ink on hover; secondary is ink on paper with a hairline that darkens.
// Used by the /about front page and the / cover's call to action.
const actionBase =
  'inline-flex h-10 items-center gap-2 rounded-[2px] border px-3 text-[0.875rem] font-semibold no-underline transition-colors duration-[120ms]'

export const actionPrimary = `${actionBase} border-ds-accent bg-ds-accent text-ds-accent-ink hover:bg-ds-ink hover:border-ds-ink hover:text-ds-paper`
export const actionSecondary = `${actionBase} border-ds-rule text-ds-ink hover:border-ds-ink`
