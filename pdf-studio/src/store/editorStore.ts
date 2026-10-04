import { create } from 'zustand'
import type { fabric as FabricType } from 'fabric'

export type Tool =
  | 'select'
  | 'text'
  | 'rect'
  | 'circle'
  | 'line'
  | 'triangle'
  | 'draw'
  | 'eraser'
  | 'image'

export interface PageSize {
  label: string
  width: number
  height: number
}

export const PAGE_SIZES: PageSize[] = [
  { label: 'A4', width: 794, height: 1123 },
  { label: 'Letter', width: 816, height: 1056 },
  { label: 'A3', width: 1123, height: 1587 },
  { label: 'A5', width: 559, height: 794 },
  { label: 'Presentation (16:9)', width: 960, height: 540 },
  { label: 'Square', width: 794, height: 794 },
]

export interface Page {
  id: string
  width: number
  height: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  canvasJSON: any
  thumbnail: string
}

interface HistoryEntry {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  json: any
}

interface EditorState {
  /* Document */
  pages: Page[]
  currentPageIndex: number

  /* History per page */
  undoStacks: HistoryEntry[][]
  redoStacks: HistoryEntry[][]

  /* Tools */
  activeTool: Tool

  /* Text props */
  fontFamily: string
  fontSize: number
  textColor: string
  bold: boolean
  italic: boolean
  underline: boolean
  textAlign: 'left' | 'center' | 'right'

  /* Shape props */
  fillColor: string
  strokeColor: string
  strokeWidth: number
  opacity: number

  /* View */
  zoom: number

  /* Selection */
  selectedObject: FabricType.Object | null

  /* Modal */
  showNewDocModal: boolean

  /* Actions */
  addPage: (width: number, height: number) => void
  deletePage: (index: number) => void
  duplicatePage: (index: number) => void
  setCurrentPage: (index: number) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  savePage: (index: number, json: any, thumbnail?: string) => void

  setActiveTool: (tool: Tool) => void
  setFontFamily: (v: string) => void
  setFontSize: (v: number) => void
  setTextColor: (v: string) => void
  setBold: (v: boolean) => void
  setItalic: (v: boolean) => void
  setUnderline: (v: boolean) => void
  setTextAlign: (v: 'left' | 'center' | 'right') => void
  setFillColor: (v: string) => void
  setStrokeColor: (v: string) => void
  setStrokeWidth: (v: number) => void
  setOpacity: (v: number) => void
  setZoom: (v: number) => void
  setSelectedObject: (obj: FabricType.Object | null) => void
  setShowNewDocModal: (v: boolean) => void

  pushHistory: (canvas: FabricType.Canvas) => void
  undo: (canvas: FabricType.Canvas) => void
  redo: (canvas: FabricType.Canvas) => void
  canUndo: () => boolean
  canRedo: () => boolean
}

const makeBlankPage = (width: number, height: number): Page => ({
  id: crypto.randomUUID(),
  width,
  height,
  canvasJSON: null,
  thumbnail: '',
})

export const useEditorStore = create<EditorState>((set, get) => ({
  pages: [makeBlankPage(794, 1123)],
  currentPageIndex: 0,
  undoStacks: [[]],
  redoStacks: [[]],

  activeTool: 'select',

  fontFamily: 'Helvetica',
  fontSize: 16,
  textColor: '#000000',
  bold: false,
  italic: false,
  underline: false,
  textAlign: 'left',

  fillColor: '#4f46e5',
  strokeColor: '#312e81',
  strokeWidth: 2,
  opacity: 1,

  zoom: 1,
  selectedObject: null,
  showNewDocModal: false,

  /* Page management */
  addPage: (width, height) =>
    set(s => ({
      pages: [...s.pages, makeBlankPage(width, height)],
      undoStacks: [...s.undoStacks, []],
      redoStacks: [...s.redoStacks, []],
    })),

  deletePage: (index) =>
    set(s => {
      if (s.pages.length === 1) return s
      const pages = s.pages.filter((_, i) => i !== index)
      const undoStacks = s.undoStacks.filter((_, i) => i !== index)
      const redoStacks = s.redoStacks.filter((_, i) => i !== index)
      const current = index >= pages.length ? pages.length - 1 : index
      return { pages, undoStacks, redoStacks, currentPageIndex: current }
    }),

  duplicatePage: (index) =>
    set(s => {
      const page = s.pages[index]
      const copy: Page = { ...page, id: crypto.randomUUID() }
      const pages = [...s.pages.slice(0, index + 1), copy, ...s.pages.slice(index + 1)]
      const undoStacks = [...s.undoStacks.slice(0, index + 1), [], ...s.undoStacks.slice(index + 1)]
      const redoStacks = [...s.redoStacks.slice(0, index + 1), [], ...s.redoStacks.slice(index + 1)]
      return { pages, undoStacks, redoStacks }
    }),

  setCurrentPage: (index) => set({ currentPageIndex: index }),

  savePage: (index, json, thumbnail = '') =>
    set(s => {
      const pages = s.pages.map((p, i) =>
        i === index ? { ...p, canvasJSON: json, thumbnail: thumbnail || p.thumbnail } : p
      )
      return { pages }
    }),

  /* Tool & property setters */
  setActiveTool: (tool) => set({ activeTool: tool }),
  setFontFamily: (fontFamily) => set({ fontFamily }),
  setFontSize: (fontSize) => set({ fontSize }),
  setTextColor: (textColor) => set({ textColor }),
  setBold: (bold) => set({ bold }),
  setItalic: (italic) => set({ italic }),
  setUnderline: (underline) => set({ underline }),
  setTextAlign: (textAlign) => set({ textAlign }),
  setFillColor: (fillColor) => set({ fillColor }),
  setStrokeColor: (strokeColor) => set({ strokeColor }),
  setStrokeWidth: (strokeWidth) => set({ strokeWidth }),
  setOpacity: (opacity) => set({ opacity }),
  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(4, zoom)) }),
  setSelectedObject: (selectedObject) => set({ selectedObject }),
  setShowNewDocModal: (showNewDocModal) => set({ showNewDocModal }),

  /* History */
  pushHistory: (canvas) => {
    const { currentPageIndex } = get()
    const json = canvas.toJSON(['name', 'data'])
    set(s => {
      const undoStacks = [...s.undoStacks]
      const redoStacks = [...s.redoStacks]
      undoStacks[currentPageIndex] = [...(undoStacks[currentPageIndex] || []), { json }].slice(-50)
      redoStacks[currentPageIndex] = []
      return { undoStacks, redoStacks }
    })
  },

  undo: (canvas) => {
    const { currentPageIndex, undoStacks, redoStacks } = get()
    const stack = undoStacks[currentPageIndex] || []
    if (stack.length < 2) return
    const current = stack[stack.length - 1]
    const prev = stack[stack.length - 2]
    set(s => {
      const us = [...s.undoStacks]
      const rs = [...s.redoStacks]
      us[currentPageIndex] = stack.slice(0, -1)
      rs[currentPageIndex] = [...(rs[currentPageIndex] || []), current]
      return { undoStacks: us, redoStacks: rs }
    })
    canvas.loadFromJSON(prev.json, () => canvas.renderAll())
  },

  redo: (canvas) => {
    const { currentPageIndex, undoStacks, redoStacks } = get()
    const rStack = redoStacks[currentPageIndex] || []
    if (rStack.length === 0) return
    const next = rStack[rStack.length - 1]
    set(s => {
      const us = [...s.undoStacks]
      const rs = [...s.redoStacks]
      rs[currentPageIndex] = rStack.slice(0, -1)
      us[currentPageIndex] = [...(us[currentPageIndex] || []), next]
      return { undoStacks: us, redoStacks: rs }
    })
    canvas.loadFromJSON(next.json, () => canvas.renderAll())
  },

  canUndo: () => {
    const { currentPageIndex, undoStacks } = get()
    return (undoStacks[currentPageIndex]?.length ?? 0) >= 2
  },

  canRedo: () => {
    const { currentPageIndex, redoStacks } = get()
    return (redoStacks[currentPageIndex]?.length ?? 0) > 0
  },
}))
