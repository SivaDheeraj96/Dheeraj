import { useEffect, useRef, useCallback } from 'react'
import { fabric } from 'fabric'
import { useEditorStore } from '../store/editorStore'
import { setCanvasInstance } from '../canvasInstance'

export function CanvasEditor() {
  const canvasElRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<fabric.Canvas | null>(null)
  const prevPageIndexRef = useRef(-1)
  const isDrawingShapeRef = useRef(false)
  const shapeStartRef = useRef({ x: 0, y: 0 })
  const activeShapeRef = useRef<fabric.Object | null>(null)
  const suppressHistoryRef = useRef(false)

  const {
    currentPageIndex,
    pages,
    activeTool,
    zoom,
    fontSize,
    fontFamily,
    textColor,
    bold,
    italic,
    underline,
    fillColor,
    strokeColor,
    strokeWidth,
    opacity,
    savePage,
    pushHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    setSelectedObject,
    setActiveTool,
  } = useEditorStore()

  /* ─── Initialize canvas once ─────────────────────────────────────── */
  useEffect(() => {
    if (!canvasElRef.current || fabricRef.current) return

    const page = pages[0]
    const canvas = new fabric.Canvas(canvasElRef.current, {
      width: page.width,
      height: page.height,
      backgroundColor: '#ffffff',
      selection: true,
      preserveObjectStacking: true,
      enableRetinaScaling: true,
    })

    fabricRef.current = canvas
    setCanvasInstance(canvas)
    prevPageIndexRef.current = 0

    canvas.on('selection:created', (e: { selected?: fabric.Object[] }) => setSelectedObject(e.selected?.[0] ?? null))
    canvas.on('selection:updated', (e: { selected?: fabric.Object[] }) => setSelectedObject(e.selected?.[0] ?? null))
    canvas.on('selection:cleared', () => setSelectedObject(null))

    canvas.on('object:added', () => {
      if (!suppressHistoryRef.current) pushHistory(canvas)
    })
    canvas.on('object:modified', () => pushHistory(canvas))
    canvas.on('object:removed', () => pushHistory(canvas))

    /* Initial history snapshot */
    pushHistory(canvas)

    return () => {
      canvas.dispose()
      fabricRef.current = null
      setCanvasInstance(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ─── Page switching ─────────────────────────────────────────────── */
  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas) return

    const prev = prevPageIndexRef.current

    /* Save the page we're leaving */
    if (prev >= 0 && prev !== currentPageIndex) {
      const json = canvas.toJSON(['name', 'data'])
      const thumb = canvas.toDataURL({ format: 'png', multiplier: 0.15 })
      savePage(prev, json, thumb)
    }

    const page = pages[currentPageIndex]
    canvas.setWidth(page.width)
    canvas.setHeight(page.height)

    suppressHistoryRef.current = true
    if (page.canvasJSON && page.canvasJSON.objects?.length >= 0) {
      canvas.loadFromJSON(page.canvasJSON, () => {
        canvas.renderAll()
        suppressHistoryRef.current = false
      })
    } else {
      canvas.clear()
      canvas.backgroundColor = '#ffffff'
      canvas.renderAll()
      suppressHistoryRef.current = false
    }

    prevPageIndexRef.current = currentPageIndex
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPageIndex])

  /* ─── Tool changes ───────────────────────────────────────────────── */
  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas) return

    canvas.isDrawingMode = false

    const makeSelectable = (v: boolean) =>
      canvas.forEachObject((obj: fabric.Object) => {
        if ((obj as fabric.Object & { name?: string }).name !== '__pdf_background__') {
          obj.selectable = v
          obj.evented = v
        }
      })

    switch (activeTool) {
      case 'select':
        canvas.selection = true
        canvas.defaultCursor = 'default'
        makeSelectable(true)
        break
      case 'draw':
        canvas.isDrawingMode = true
        canvas.selection = false
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.color = fillColor
          canvas.freeDrawingBrush.width = strokeWidth
        }
        break
      case 'eraser':
        canvas.selection = true
        canvas.defaultCursor = 'pointer'
        makeSelectable(true)
        break
      case 'text':
        canvas.selection = false
        canvas.defaultCursor = 'text'
        makeSelectable(false)
        break
      default:
        canvas.selection = false
        canvas.defaultCursor = 'crosshair'
        makeSelectable(false)
    }
    canvas.renderAll()
  }, [activeTool, fillColor, strokeWidth])

  /* ─── Shape/text drawing handlers ───────────────────────────────── */
  const handleMouseDown = useCallback(
    (opt: fabric.IEvent) => {
      const canvas = fabricRef.current
      if (!canvas) return

      if (activeTool === 'text') {
        const pointer = canvas.getPointer(opt.e as MouseEvent)
        const text = new fabric.IText('Type here', {
          left: pointer.x,
          top: pointer.y,
          fontFamily,
          fontSize,
          fill: textColor,
          fontWeight: bold ? 'bold' : 'normal',
          fontStyle: italic ? 'italic' : 'normal',
          underline,
          editable: true,
          padding: 4,
        })
        canvas.add(text)
        canvas.setActiveObject(text)
        text.enterEditing()
        text.selectAll()
        setSelectedObject(text)
        canvas.renderAll()
        return
      }

      if (['rect', 'circle', 'line', 'triangle'].includes(activeTool)) {
        isDrawingShapeRef.current = true
        const pointer = canvas.getPointer(opt.e as MouseEvent)
        shapeStartRef.current = { x: pointer.x, y: pointer.y }

        const baseProps = {
          left: pointer.x,
          top: pointer.y,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth,
          opacity,
          selectable: false,
          evented: false,
        }

        if (activeTool === 'rect') {
          activeShapeRef.current = new fabric.Rect({ ...baseProps, width: 1, height: 1 })
        } else if (activeTool === 'circle') {
          activeShapeRef.current = new fabric.Ellipse({ ...baseProps, rx: 1, ry: 1 })
        } else if (activeTool === 'triangle') {
          activeShapeRef.current = new fabric.Triangle({ ...baseProps, width: 1, height: 1 })
        } else if (activeTool === 'line') {
          activeShapeRef.current = new fabric.Line(
            [pointer.x, pointer.y, pointer.x, pointer.y],
            { stroke: strokeColor, strokeWidth, selectable: false, evented: false, opacity },
          )
        }

        if (activeShapeRef.current) {
          suppressHistoryRef.current = true
          canvas.add(activeShapeRef.current)
        }
      }
    },
    [activeTool, fontFamily, fontSize, textColor, bold, italic, underline, fillColor, strokeColor, strokeWidth, opacity, setSelectedObject],
  )

  const handleMouseMove = useCallback(
    (opt: fabric.IEvent) => {
      const canvas = fabricRef.current
      if (!isDrawingShapeRef.current || !activeShapeRef.current || !canvas) return

      const pointer = canvas.getPointer(opt.e as MouseEvent)
      const { x: sx, y: sy } = shapeStartRef.current
      const w = pointer.x - sx
      const h = pointer.y - sy

      if (activeTool === 'rect' || activeTool === 'triangle') {
        activeShapeRef.current.set({
          left: w < 0 ? pointer.x : sx,
          top: h < 0 ? pointer.y : sy,
          width: Math.abs(w),
          height: Math.abs(h),
        })
      } else if (activeTool === 'circle' && activeShapeRef.current instanceof fabric.Ellipse) {
        activeShapeRef.current.set({
          left: w < 0 ? pointer.x : sx,
          top: h < 0 ? pointer.y : sy,
          rx: Math.abs(w) / 2,
          ry: Math.abs(h) / 2,
        })
      } else if (activeTool === 'line' && activeShapeRef.current instanceof fabric.Line) {
        activeShapeRef.current.set({ x2: pointer.x, y2: pointer.y })
      }

      canvas.renderAll()
    },
    [activeTool],
  )

  const handleMouseUp = useCallback(() => {
    const canvas = fabricRef.current
    if (!isDrawingShapeRef.current || !activeShapeRef.current || !canvas) return

    activeShapeRef.current.set({ selectable: true, evented: true })
    canvas.setActiveObject(activeShapeRef.current)
    setSelectedObject(activeShapeRef.current)
    isDrawingShapeRef.current = false
    suppressHistoryRef.current = false
    activeShapeRef.current = null
    canvas.renderAll()
    pushHistory(canvas)
    /* After drawing a shape, switch back to select tool */
    setActiveTool('select')
  }, [setSelectedObject, pushHistory, setActiveTool])

  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas) return
    canvas.on('mouse:down', handleMouseDown)
    canvas.on('mouse:move', handleMouseMove)
    canvas.on('mouse:up', handleMouseUp)
    return () => {
      canvas.off('mouse:down', handleMouseDown)
      canvas.off('mouse:move', handleMouseMove)
      canvas.off('mouse:up', handleMouseUp)
    }
  }, [handleMouseDown, handleMouseMove, handleMouseUp])

  /* ─── Keyboard shortcuts ─────────────────────────────────────────── */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const canvas = fabricRef.current
      if (!canvas) return

      const active = canvas.getActiveObject()

      /* Undo/Redo */
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        if (e.shiftKey) {
          if (canRedo()) redo(canvas)
        } else {
          if (canUndo()) undo(canvas)
        }
        return
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault()
        if (canRedo()) redo(canvas)
        return
      }

      /* Duplicate */
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && active) {
        e.preventDefault()
        active.clone((clone: fabric.Object) => {
          clone.set({ left: (clone.left ?? 0) + 20, top: (clone.top ?? 0) + 20 })
          canvas.add(clone)
          canvas.setActiveObject(clone)
          canvas.renderAll()
          pushHistory(canvas)
        })
        return
      }

      if (!active) return

      /* Delete */
      if ((e.key === 'Delete' || e.key === 'Backspace')) {
        if (active instanceof fabric.IText && (active as fabric.IText).isEditing) return
        canvas.remove(...canvas.getActiveObjects())
        canvas.discardActiveObject()
        canvas.renderAll()
        setSelectedObject(null)
        return
      }

      /* Nudge with arrow keys */
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        if (active instanceof fabric.IText && (active as fabric.IText).isEditing) return
        e.preventDefault()
        const step = e.shiftKey ? 10 : 1
        const map: Record<string, Partial<fabric.Object>> = {
          ArrowLeft: { left: (active.left ?? 0) - step },
          ArrowRight: { left: (active.left ?? 0) + step },
          ArrowUp: { top: (active.top ?? 0) - step },
          ArrowDown: { top: (active.top ?? 0) + step },
        }
        active.set(map[e.key])
        canvas.renderAll()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [undo, redo, canUndo, canRedo, pushHistory, setSelectedObject])

  /* ─── Live property sync to selected object ──────────────────────── */
  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas) return
    const active = canvas.getActiveObject()
    if (!active) return

    if (active instanceof fabric.IText || active instanceof fabric.Text) {
      active.set({
        fontSize,
        fontFamily,
        fill: textColor,
        fontWeight: bold ? 'bold' : 'normal',
        fontStyle: italic ? 'italic' : 'normal',
        underline,
      })
    } else if (!(active instanceof fabric.Image)) {
      active.set({ fill: fillColor, stroke: strokeColor, strokeWidth, opacity })
    }
    canvas.renderAll()
  }, [fontSize, fontFamily, textColor, bold, italic, underline, fillColor, strokeColor, strokeWidth, opacity])

  /* ─── Zoom via CSS transform ─────────────────────────────────────── */
  const page = pages[currentPageIndex]

  return (
    <div className="canvas-scroll-area">
      <div
        className="canvas-page-wrapper"
        style={{
          width: page.width,
          height: page.height,
          transform: `scale(${zoom})`,
          transformOrigin: 'top center',
          marginBottom: `${(page.height * zoom) - page.height + 60}px`,
        }}
      >
        <canvas ref={canvasElRef} />
      </div>
    </div>
  )
}
