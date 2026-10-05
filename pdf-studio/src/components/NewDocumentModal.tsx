import { useState } from 'react'
import { X } from 'lucide-react'
import { useEditorStore, PAGE_SIZES } from '../store/editorStore'
import { getCanvasInstance } from '../canvasInstance'

export function NewDocumentModal() {
  const { setShowNewDocModal, setCurrentPage } = useEditorStore()
  const [selectedSize, setSelectedSize] = useState(0)
  const [customW, setCustomW] = useState(794)
  const [customH, setCustomH] = useState(1123)
  const [landscape, setLandscape] = useState(false)

  const size = selectedSize < PAGE_SIZES.length ? PAGE_SIZES[selectedSize] : null
  const w = size ? (landscape ? size.height : size.width) : customW
  const h = size ? (landscape ? size.width : size.height) : customH

  const handleCreate = () => {
    const canvas = getCanvasInstance()
    if (canvas) {
      canvas.clear()
      canvas.backgroundColor = '#ffffff'
      canvas.setWidth(w)
      canvas.setHeight(h)
      canvas.renderAll()
    }

    useEditorStore.setState({
      pages: [{ id: crypto.randomUUID(), width: w, height: h, canvasJSON: null, thumbnail: '' }],
      currentPageIndex: 0,
      undoStacks: [[]],
      redoStacks: [[]],
      selectedObject: null,
    })
    setCurrentPage(0)
    setShowNewDocModal(false)
  }

  return (
    <div className="modal-overlay" onClick={() => setShowNewDocModal(false)}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>New Document</h2>
          <button className="modal-close" onClick={() => setShowNewDocModal(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <label className="prop-label">Page Size</label>
          <div className="size-grid">
            {PAGE_SIZES.map((ps, i) => (
              <button
                key={ps.label}
                className={`size-btn${selectedSize === i ? ' active' : ''}`}
                onClick={() => setSelectedSize(i)}
              >
                <div className="size-preview" style={{ aspectRatio: `${ps.width} / ${ps.height}` }} />
                <span>{ps.label}</span>
                <small>{ps.width}×{ps.height}</small>
              </button>
            ))}
            <button
              className={`size-btn${selectedSize === PAGE_SIZES.length ? ' active' : ''}`}
              onClick={() => setSelectedSize(PAGE_SIZES.length)}
            >
              <div className="size-preview" />
              <span>Custom</span>
            </button>
          </div>

          {selectedSize < PAGE_SIZES.length && (
            <label className="orientation-row">
              <input
                type="checkbox"
                checked={landscape}
                onChange={e => setLandscape(e.target.checked)}
              />
              Landscape orientation
            </label>
          )}

          {selectedSize === PAGE_SIZES.length && (
            <div className="prop-row" style={{ marginTop: 12 }}>
              <div className="prop-col">
                <label className="prop-label">Width (px)</label>
                <input
                  type="number"
                  className="prop-input"
                  min={100}
                  max={4000}
                  value={customW}
                  onChange={e => setCustomW(Number(e.target.value))}
                />
              </div>
              <div className="prop-col">
                <label className="prop-label">Height (px)</label>
                <input
                  type="number"
                  className="prop-input"
                  min={100}
                  max={4000}
                  value={customH}
                  onChange={e => setCustomH(Number(e.target.value))}
                />
              </div>
            </div>
          )}

          <p className="modal-preview-text">
            Document size: <strong>{w} × {h} px</strong>
          </p>
        </div>

        <div className="modal-footer">
          <button className="modal-cancel" onClick={() => setShowNewDocModal(false)}>
            Cancel
          </button>
          <button className="modal-create" onClick={handleCreate}>
            Create Document
          </button>
        </div>
      </div>
    </div>
  )
}
