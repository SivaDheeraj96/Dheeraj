import { PDFDocument } from 'pdf-lib'
import { fabric } from 'fabric'
import type { Page } from '../store/editorStore'

async function renderPageToDataURL(page: Page): Promise<string> {
  return new Promise(resolve => {
    const el = document.createElement('canvas')
    el.width = page.width
    el.height = page.height
    document.body.appendChild(el)

    const fc = new fabric.Canvas(el, {
      width: page.width,
      height: page.height,
      backgroundColor: '#ffffff',
    })

    const finish = () => {
      fc.renderAll()
      const dataURL = fc.toDataURL({ format: 'png', multiplier: 1 })
      fc.dispose()
      document.body.removeChild(el)
      resolve(dataURL)
    }

    if (page.canvasJSON) {
      fc.loadFromJSON(page.canvasJSON, finish)
    } else {
      finish()
    }
  })
}

export async function exportToPDF(
  pages: Page[],
  currentIndex: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentCanvasJSON: any,
): Promise<void> {
  const pdfDoc = await PDFDocument.create()

  const allPages = pages.map((p, i) =>
    i === currentIndex ? { ...p, canvasJSON: currentCanvasJSON } : p
  )

  for (const page of allPages) {
    const dataURL = await renderPageToDataURL(page)
    const base64 = dataURL.split(',')[1]
    const binary = atob(base64)
    const imgBytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) imgBytes[i] = binary.charCodeAt(i)

    const pdfPage = pdfDoc.addPage([page.width, page.height])
    const pdfImage = await pdfDoc.embedPng(imgBytes)
    pdfPage.drawImage(pdfImage, {
      x: 0,
      y: 0,
      width: page.width,
      height: page.height,
    })
  }

  const pdfBytes = await pdfDoc.save()
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'document.pdf'
  a.click()
  URL.revokeObjectURL(url)
}
