/* Module-level Fabric.js canvas accessor — lets any module reach the live canvas. */
import type { fabric } from 'fabric'

let _canvas: fabric.Canvas | null = null

export const setCanvasInstance = (c: fabric.Canvas | null) => { _canvas = c }
export const getCanvasInstance = (): fabric.Canvas | null => _canvas
