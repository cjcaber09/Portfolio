export interface RasterizedText {
  data: Uint8ClampedArray
  width: number
  height: number
}

export function rasterizeText(
  text: string,
  options: { width: number; height: number; fontSize: number; fontFamily: string; y?: number }
): RasterizedText {
  const canvas = document.createElement('canvas')
  canvas.width = options.width
  canvas.height = options.height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('2D canvas context is not available')
  }
  ctx.fillStyle = '#fff'
  ctx.font = `700 ${options.fontSize}px ${options.fontFamily}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, options.width / 2, options.y ?? options.height / 2)
  const imageData = ctx.getImageData(0, 0, options.width, options.height)
  return { data: imageData.data, width: imageData.width, height: imageData.height }
}
