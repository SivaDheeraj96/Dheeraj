import { useRef } from 'react'
import { fabric } from 'fabric'
import {
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Download,
  FolderOpen,
  FilePlus,
  FileText,
} from 'lucide-react'
import { useEditorStore } from '../store/editorStore'
import { getCanvasInstance } from '../canvasInstance'
import { exportToPDF } from '../utils/pdfExport'
import { importFromPDF } from '../utils/pdfImport'

export function Toolbar() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const {
    pages,
    currentPageIndex,
    zoom,
    setZoom,
    setShowNewDocModal,
    undo,
    redo,
    canUndo,
    canRedo,
    savePage,
    setActiveTool,
  } = useEditorStore()

  const handleUndo = () => {
    const canvas = getCanvasInstance()
    if (canvas && canUndo()) undo(canvas)
  }

  const handleRedo = () => {
    const canvas = getCanvasInstance()
    if (canvas && canRedo()) redo(canvas)
  }

  const handleExport = async () => {
    const canvas = getCanvasInstance()
    if (!canvas) return
    const json = canvas.toJSON(['name', 'data'])
    const thumb = canvas.toDataURL({ format: 'png', multiplier: 0.15 })
    savePage(currentPageIndex, json, thumb)
    await exportToPDF(pages, currentPageIndex, json)
  }

  const handleOpenPDF = () => fileInputRef.current?.click()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    try {
      const importedPages = await importFromPDF(file)
      const { setCurrentPage } = useEditorStore.getState()
      /* Replace all pages with imported ones */
      useEditorStore.setState({
        pages: importedPages,
        currentPageIndex: 0,
        undoStacks: importedPages.map(() => []),
        redoStacks: importedPages.map(() => []),
      })
      setCurrentPage(0)
    } catch (err) {
      console.error('Failed to import PDF:', err)
      alert('Failed to import PDF. Please try a different file.')
    }
  }

  const handleInsertImage = () => imageInputRef.current?.click()

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    const reader = new FileReader()
    reader.onload = ev => {
      const dataURL = ev.target?.result as string
      const canvas = getCanvasInstance()
      if (!canvas) return
      fabric.Image.fromURL(dataURL, (img: fabric.Image) => {
        const maxDim = 400
        if ((img.width ?? 0) > maxDim || (img.height ?? 0) > maxDim) {
          const scale = maxDim / Math.max(img.width ?? 1, img.height ?? 1)
          img.scale(scale)
        }
        img.set({ left: 80, top: 80 })
        canvas.add(img)
        canvas.setActiveObject(img)
        canvas.renderAll()
      })
    }
    reader.readAsDataURL(file)
  }

  /* Keyboard shortcut hint in tool label */
  const zoomPct = Math.round(zoom * 100)

  return (
    <header className="toolbar">
      {/* Brand */}
      <div className="toolbar-brand">
        <FileText size={20} className="brand-icon" />
        <span className="brand-name">PDF Studio</span>
      </div>

      {/* File actions */}
      <div className="toolbar-group">
        <button className="tb-btn" title="New document" onClick={() => setShowNewDocModal(true)}>
          <FilePlus size={16} />
          <span>New</span>
        </button>
        <button className="tb-btn" title="Open PDF" onClick={handleOpenPDF}>
          <FolderOpen size={16} />
          <span>Open</span>
        </button>
        <button className="tb-btn primary" title="Download PDF" onClick={handleExport}>
          <Download size={16} />
          <span>Export PDF</span>
        </button>
      </div>

      <div className="toolbar-divider" />

      {/* History */}
      <div className="toolbar-group">
        <button
          className="tb-btn icon-only"
          title="Undo (Ctrl+Z)"
          onClick={handleUndo}
          disabled={!canUndo()}
        >
          <Undo2 size={16} />
        </button>
        <button
          className="tb-btn icon-only"
          title="Redo (Ctrl+Shift+Z)"
          onClick={handleRedo}
          disabled={!canRedo()}
        >
          <Redo2 size={16} />
        </button>
      </div>

      <div className="toolbar-divider" />

      {/* Zoom */}
      <div className="toolbar-group">
        <button className="tb-btn icon-only" title="Zoom out" onClick={() => setZoom(zoom - 0.1)}>
          <ZoomOut size={16} />
        </button>
        <button
          className="tb-btn zoom-label"
          title="Reset zoom"
          onClick={() => setZoom(1)}
        >
          {zoomPct}%
        </button>
        <button className="tb-btn icon-only" title="Zoom in" onClick={() => setZoom(zoom + 0.1)}>
          <ZoomIn size={16} />
        </button>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageFileChange}
      />
    </header>
  )
}
