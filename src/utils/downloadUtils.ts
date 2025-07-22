import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export interface DownloadOptions {
  filename?: string
  format?: 'png' | 'pdf'
  quality?: number
}

export async function downloadElementAsImage(
  element: HTMLElement,
  options: DownloadOptions = {}
): Promise<void> {
  const { filename = 'download', format = 'png', quality = 1 } = options

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher resolution
      useCORS: true,
      allowTaint: true,
    })

    if (format === 'pdf') {
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      })

      pdf.addImage(
        canvas.toDataURL('image/png', quality),
        'PNG',
        0,
        0,
        canvas.width,
        canvas.height
      )

      pdf.save(`${filename}.pdf`)
    } else {
      // Download as PNG
      const link = document.createElement('a')
      link.download = `${filename}.png`
      link.href = canvas.toDataURL('image/png', quality)
      link.click()
    }
  } catch (error) {
    console.error('Error downloading element:', error)
    throw new Error('Failed to download content')
  }
}

export async function downloadMultipleElements(
  elements: { element: HTMLElement; name: string }[],
  options: DownloadOptions = {}
): Promise<void> {
  const { filename = 'dashboard', format = 'pdf' } = options

  try {
    if (format === 'pdf') {
      const pdf = new jsPDF('portrait', 'mm', 'a4')
      let isFirstPage = true

      for (const { element, name } of elements) {
        const canvas = await html2canvas(element, {
          backgroundColor: '#ffffff',
          scale: 2,
          useCORS: true,
          allowTaint: true,
        })

        if (!isFirstPage) {
          pdf.addPage()
        }

        // Calculate dimensions to fit A4
        const imgWidth = 190 // A4 width in mm minus margins
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        // Add title
        pdf.setFontSize(16)
        pdf.text(name, 10, 20)

        // Add image
        pdf.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          10,
          30,
          imgWidth,
          Math.min(imgHeight, 250) // Max height to fit on page
        )

        isFirstPage = false
      }

      pdf.save(`${filename}.pdf`)
    } else {
      // Download individual PNGs in a zip would require additional library
      // For now, download them separately
      for (let i = 0; i < elements.length; i++) {
        const { element, name } = elements[i]
        await downloadElementAsImage(element, {
          filename: `${filename}_${i + 1}_${name.replace(/\s+/g, '_')}`,
          format: 'png'
        })
      }
    }
  } catch (error) {
    console.error('Error downloading multiple elements:', error)
    throw new Error('Failed to download content')
  }
}

export function downloadCSV(data: Record<string, any>[], filename: string = 'data'): void {
  if (!data || data.length === 0) return

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }).join(',')
    )
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}