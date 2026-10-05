import { Toolbar } from './components/Toolbar'
import { ToolsSidebar } from './components/ToolsSidebar'
import { CanvasEditor } from './components/CanvasEditor'
import { PropertiesPanel } from './components/PropertiesPanel'
import { PagePanel } from './components/PagePanel'
import { NewDocumentModal } from './components/NewDocumentModal'
import { useEditorStore } from './store/editorStore'
import { useEffect } from 'react'
import './styles/index.css'

export default function App() {
  const { activeTool, setActiveTool, showNewDocModal } = useEditorStore()

  /* Global keyboard shortcuts for tool switching */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      const map: Record<string, typeof activeTool> = {
        v: 'select',
        t: 'text',
        r: 'rect',
        c: 'circle',
        l: 'line',
        d: 'draw',
        i: 'image',
        Escape: 'select',
      }
      if (map[e.key]) setActiveTool(map[e.key])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeTool, setActiveTool])

  return (
    <div className="app-layout">
      <Toolbar />
      <div className="app-body">
        <ToolsSidebar />
        <main className="canvas-area">
          <CanvasEditor />
        </main>
        <PropertiesPanel />
      </div>
      <PagePanel />
      {showNewDocModal && <NewDocumentModal />}
    </div>
  )
}
