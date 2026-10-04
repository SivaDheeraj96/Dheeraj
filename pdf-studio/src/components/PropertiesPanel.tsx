import { fabric } from 'fabric'
import { useEditorStore } from '../store/editorStore'
import { getCanvasInstance } from '../canvasInstance'
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Trash2,
  MoveUp,
  MoveDown,
  FlipHorizontal,
  FlipVertical,
} from 'lucide-react'

const FONTS = [
  'Helvetica', 'Arial', 'Times New Roman', 'Courier New',
  'Georgia', 'Verdana', 'Trebuchet MS', 'Impact',
]

export function PropertiesPanel() {
  const store = useEditorStore()
  const {
    selectedObject,
    fontFamily, setFontFamily,
    fontSize, setFontSize,
    textColor, setTextColor,
    bold, setBold,
    italic, setItalic,
    underline, setUnderline,
    textAlign, setTextAlign,
    fillColor, setFillColor,
    strokeColor, setStrokeColor,
    strokeWidth, setStrokeWidth,
    opacity, setOpacity,
    pushHistory,
    setSelectedObject,
  } = store

  const canvas = getCanvasInstance()
  const active = canvas?.getActiveObject() ?? null
  const isText = active instanceof fabric.IText || active instanceof fabric.Text
  const isImage = active instanceof fabric.Image
  const isShape = active && !isText && !isImage

  const deleteSelected = () => {
    if (!canvas || !active) return
    canvas.remove(...canvas.getActiveObjects())
    canvas.discardActiveObject()
    canvas.renderAll()
    setSelectedObject(null)
    pushHistory(canvas)
  }

  const bringForward = () => {
    if (!canvas || !active) return
    canvas.bringForward(active)
    canvas.renderAll()
    pushHistory(canvas)
  }

  const sendBackward = () => {
    if (!canvas || !active) return
    canvas.sendBackwards(active)
    canvas.renderAll()
    pushHistory(canvas)
  }

  const flipH = () => {
    if (!canvas || !active) return
    active.set({ flipX: !active.flipX })
    canvas.renderAll()
    pushHistory(canvas)
  }

  const flipV = () => {
    if (!canvas || !active) return
    active.set({ flipY: !active.flipY })
    canvas.renderAll()
    pushHistory(canvas)
  }

  return (
    <aside className="properties-panel">
      <div className="panel-title">Properties</div>

      {!active && (
        <p className="panel-empty">Select an object to edit its properties.</p>
      )}

      {/* ── Text Properties ── */}
      {isText && (
        <section className="panel-section">
          <div className="panel-section-title">Text</div>

          <label className="prop-label">Font</label>
          <select
            className="prop-select"
            value={fontFamily}
            onChange={e => setFontFamily(e.target.value)}
          >
            {FONTS.map(f => (
              <option key={f} value={f} style={{ fontFamily: f }}>
                {f}
              </option>
            ))}
          </select>

          <div className="prop-row">
            <div className="prop-col">
              <label className="prop-label">Size</label>
              <input
                type="number"
                min={6}
                max={200}
                className="prop-input"
                value={fontSize}
                onChange={e => setFontSize(Number(e.target.value))}
              />
            </div>
            <div className="prop-col">
              <label className="prop-label">Color</label>
              <input
                type="color"
                className="prop-color"
                value={textColor}
                onChange={e => setTextColor(e.target.value)}
              />
            </div>
          </div>

          <div className="prop-row">
            <button
              className={`style-btn${bold ? ' active' : ''}`}
              title="Bold"
              onClick={() => setBold(!bold)}
            >
              <Bold size={14} />
            </button>
            <button
              className={`style-btn${italic ? ' active' : ''}`}
              title="Italic"
              onClick={() => setItalic(!italic)}
            >
              <Italic size={14} />
            </button>
            <button
              className={`style-btn${underline ? ' active' : ''}`}
              title="Underline"
              onClick={() => setUnderline(!underline)}
            >
              <Underline size={14} />
            </button>
          </div>

          <div className="prop-row">
            {(['left', 'center', 'right'] as const).map(align => (
              <button
                key={align}
                className={`style-btn${textAlign === align ? ' active' : ''}`}
                title={`Align ${align}`}
                onClick={() => setTextAlign(align)}
              >
                {align === 'left' && <AlignLeft size={14} />}
                {align === 'center' && <AlignCenter size={14} />}
                {align === 'right' && <AlignRight size={14} />}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── Shape Properties ── */}
      {isShape && (
        <section className="panel-section">
          <div className="panel-section-title">Shape</div>
          <div className="prop-row">
            <div className="prop-col">
              <label className="prop-label">Fill</label>
              <input
                type="color"
                className="prop-color"
                value={fillColor}
                onChange={e => setFillColor(e.target.value)}
              />
            </div>
            <div className="prop-col">
              <label className="prop-label">Stroke</label>
              <input
                type="color"
                className="prop-color"
                value={strokeColor}
                onChange={e => setStrokeColor(e.target.value)}
              />
            </div>
          </div>

          <label className="prop-label">Stroke Width</label>
          <input
            type="range"
            min={0}
            max={20}
            step={1}
            className="prop-range"
            value={strokeWidth}
            onChange={e => setStrokeWidth(Number(e.target.value))}
          />
          <span className="range-val">{strokeWidth}px</span>
        </section>
      )}

      {/* ── Opacity (all objects) ── */}
      {active && (
        <section className="panel-section">
          <div className="panel-section-title">Appearance</div>
          <label className="prop-label">Opacity</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            className="prop-range"
            value={opacity}
            onChange={e => setOpacity(Number(e.target.value))}
          />
          <span className="range-val">{Math.round(opacity * 100)}%</span>
        </section>
      )}

      {/* ── Arrangement ── */}
      {active && (
        <section className="panel-section">
          <div className="panel-section-title">Arrange</div>
          <div className="prop-row">
            <button className="action-btn" title="Bring forward" onClick={bringForward}>
              <MoveUp size={14} /> Forward
            </button>
            <button className="action-btn" title="Send backward" onClick={sendBackward}>
              <MoveDown size={14} /> Backward
            </button>
          </div>
          <div className="prop-row">
            <button className="action-btn" title="Flip horizontal" onClick={flipH}>
              <FlipHorizontal size={14} /> Flip H
            </button>
            <button className="action-btn" title="Flip vertical" onClick={flipV}>
              <FlipVertical size={14} /> Flip V
            </button>
          </div>
        </section>
      )}

      {/* ── Delete ── */}
      {active && (
        <section className="panel-section">
          <button className="delete-btn" onClick={deleteSelected}>
            <Trash2 size={14} /> Delete Object
          </button>
        </section>
      )}
    </aside>
  )
}
