import { useState } from 'react'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Download, FileText, Image, Loader2, Package } from 'lucide-react'
import { downloadMultipleElements, downloadCSV } from '@/utils/downloadUtils'
import { useToast } from '@/hooks/use-toast'

interface BulkDownloadButtonProps {
  chartRef: React.RefObject<HTMLElement>
  tableRef: React.RefObject<HTMLElement>
  csvData: Record<string, any>[]
  filename?: string
  className?: string
}

export function BulkDownloadButton({ 
  chartRef, 
  tableRef, 
  csvData, 
  filename = 'dashboard',
  className 
}: BulkDownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const { toast } = useToast()

  const handleBulkDownload = async (format: 'png' | 'pdf') => {
    const elements = []
    
    if (chartRef.current) {
      elements.push({ element: chartRef.current, name: 'Chart' })
    }
    
    if (tableRef.current) {
      elements.push({ element: tableRef.current, name: 'Data Table' })
    }

    if (elements.length === 0) {
      toast({
        title: "Error",
        description: "No content available for download",
        variant: "destructive"
      })
      return
    }

    setIsDownloading(true)
    try {
      await downloadMultipleElements(elements, { filename, format })
      
      toast({
        title: "Bulk Download Complete",
        description: `${filename}.${format} has been downloaded with all content`
      })
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error downloading the content",
        variant: "destructive"
      })
    } finally {
      setIsDownloading(false)
    }
  }

  const handleCSVDownload = () => {
    try {
      downloadCSV(csvData, filename)
      toast({
        title: "CSV Download Complete",
        description: `${filename}.csv has been downloaded`
      })
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error downloading the CSV",
        variant: "destructive"
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="default" 
          className={className}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Package className="h-4 w-4" />
          )}
          <span className="ml-2">Download All</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleBulkDownload('pdf')}>
          <FileText className="h-4 w-4 mr-2" />
          All as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleBulkDownload('png')}>
          <Image className="h-4 w-4 mr-2" />
          All as Images
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCSVDownload}>
          <Download className="h-4 w-4 mr-2" />
          Data as CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}