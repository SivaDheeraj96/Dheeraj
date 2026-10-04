import { useRef } from 'react'
import { Plus, Trash2, Copy } from 'lucide-react'
import { useEditorStore } from '../store/editorStore'
import { getCanvasInstance } from '../canvasInstance'

export function PagePanel() {
  const {
    pages,
    currentPageIndex,
    setCurrentPage,
    addPage,
    deletePage,
    duplicatePage,
    savePage,
  } = useEditorStore()

  const handlePageClick = (index: number) => {
    if (index === currentPageIndex) return
    /* Save current page first */
    const canvas = getCanvasInstance()
    if (canvas) {
      const json = canvas.toJSON(['name', 'data'])
      const thumb = canvas.toDataURL({ format: 'png', multiplier: 0.15 })
      savePage(currentPageIndex, json, thumb)
    }
    setCurrentPage(index)
  }

  const handleAddPage = () => {
    const currentPage = pages[currentPageIndex]
    addPage(currentPage.width, currentPage.height)
    /* Navigate to new page */
    const canvas = getCanvasInstance()
    if (canvas) {
      const json = canvas.toJSON(['name', 'data'])
      const thumb = canvas.toDataURL({ format: 'png', multiplier: 0.15 })
      savePage(currentPageIndex, json, thumb)
    }
    setCurrentPage(pages.length) /* will be the new index */
  }

  const handleDuplicate = (e: React.MouseEvent, index: number) => {
    e.stopPropagation()
    duplicatePage(index)
  }

  const handleDelete = (e: React.MouseEvent, index: number) => {
    e.stopPropagation()
    if (pages.length === 1) return
    deletePage(index)
  }

  return (
    <footer className="page-panel">
      <div className="page-panel-inner">
        {pages.map((page, i) => (
          <div
            key={page.id}
            className={`page-thumb-wrapper${i === currentPageIndex ? ' active' : ''}`}
            onClick={() => handlePageClick(i)}
            title={`Page ${i + 1}`}
          >
            <div
              className="page-thumb"
              style={{ aspectRatio: `${page.width} / ${page.height}` }}
            >
              {page.thumbnail ? (
                <img src={page.thumbnail} alt={`Page ${i + 1}`} />
              ) : (
                <div className="page-thumb-blank" />
              )}
            </div>
            <span className="page-thumb-number">{i + 1}</span>
            <div className="page-thumb-actions">
              <button
                className="thumb-action-btn"
                title="Duplicate page"
                onClick={e => handleDuplicate(e, i)}
              >
                <Copy size={11} />
              </button>
              {pages.length > 1 && (
                <button
                  className="thumb-action-btn danger"
                  title="Delete page"
                  onClick={e => handleDelete(e, i)}
                >
                  <Trash2 size={11} />
                </button>
              )}
            </div>
          </div>
        ))}

        <button className="add-page-btn" title="Add new page" onClick={handleAddPage}>
          <Plus size={18} />
          <span>Add Page</span>
        </button>
      </div>
    </footer>
  )
}
