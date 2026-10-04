import type { Page } from '../store/editorStore'

async function getPdfjsLib() {
  const pdfjsLib = await import('pdfjs-dist')
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
  return pdfjsLib
}

export interface ImportedPage {
  width: number
  height: number
  dataURL: string
}

export async function importFromPDF(file: File): Promise<Page[]> {
  const pdfjsLib = await getPdfjsLib()

  const arrayBuffer = await file.arrayBuffer()
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
  const pdf = await loadingTask.promise

  const pages: Page[] = []

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const pdfPage = await pdf.getPage(pageNum)
    const viewport = pdfPage.getViewport({ scale: 1.5 })

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    canvas.width = viewport.width
    canvas.height = viewport.height

    await pdfPage.render({ canvasContext: ctx, viewport }).promise

    const dataURL = canvas.toDataURL('image/png')

    const fabricJSON = {
      version: '5.3.0',
      objects: [
        {
          type: 'image',
          version: '5.3.0',
          originX: 'left',
          originY: 'top',
          left: 0,
          top: 0,
          width: viewport.width,
          height: viewport.height,
          fill: 'rgb(0,0,0)',
          stroke: null,
          strokeWidth: 0,
          src: dataURL,
          selectable: false,
          evented: false,
          lockMovementX: true,
          lockMovementY: true,
          lockRotation: true,
          lockScalingX: true,
          lockScalingY: true,
          hasControls: false,
          hasBorders: false,
          name: '__pdf_background__',
        },
      ],
      background: '#ffffff',
    }

    pages.push({
      id: crypto.randomUUID(),
      width: Math.round(viewport.width),
      height: Math.round(viewport.height),
      canvasJSON: fabricJSON,
      thumbnail: dataURL,
    })
  }

  return pages
}
