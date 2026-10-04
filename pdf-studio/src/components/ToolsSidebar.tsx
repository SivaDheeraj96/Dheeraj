import {
  MousePointer2,
  Type,
  Square,
  Circle,
  Minus,
  Triangle,
  Pencil,
  Eraser,
  ImagePlus,
} from 'lucide-react'
import { useEditorStore, type Tool } from '../store/editorStore'

const TOOLS: { id: Tool; icon: React.ReactNode; label: string }[] = [
  { id: 'select', icon: <MousePointer2 size={18} />, label: 'Select (V)' },
  { id: 'text', icon: <Type size={18} />, label: 'Text (T)' },
  { id: 'draw', icon: <Pencil size={18} />, label: 'Draw (D)' },
  { id: 'rect', icon: <Square size={18} />, label: 'Rectangle (R)' },
  { id: 'circle', icon: <Circle size={18} />, label: 'Ellipse (E)' },
  { id: 'triangle', icon: <Triangle size={18} />, label: 'Triangle' },
  { id: 'line', icon: <Minus size={18} />, label: 'Line (L)' },
  { id: 'eraser', icon: <Eraser size={18} />, label: 'Delete object' },
  { id: 'image', icon: <ImagePlus size={18} />, label: 'Insert image (I)' },
]

export function ToolsSidebar() {
  const { activeTool, setActiveTool } = useEditorStore()

  return (
    <aside className="tools-sidebar">
      <div className="tools-list">
        {TOOLS.map(t => (
          <button
            key={t.id}
            title={t.label}
            onClick={() => setActiveTool(t.id)}
            className={`tool-btn${activeTool === t.id ? ' active' : ''}`}
          >
            {t.icon}
          </button>
        ))}
      </div>
    </aside>
  )
}
