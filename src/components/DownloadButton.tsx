import { useState } from 'react'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Download, Image, FileText, Loader2 } from 'lucide-react'
import { downloadElementAsImage, DownloadOptions } from '@/utils/downloadUtils'
import { useToast } from '@/hooks/use-toast'

interface DownloadButtonProps {
  elementRef: React.RefObject<HTMLElement> | React.RefObject<HTMLDivElement>
  filename: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  className?: string
}

export function DownloadButton({ 
  elementRef, 
  filename, 
  variant = 'outline', 
  size = 'sm',
  className 
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const { toast } = useToast()

  const handleDownload = async (format: 'png' | 'pdf') => {
    if (!elementRef.current) {
      toast({
        title: "Error",
        description: "Content not available for download",
        variant: "destructive"
      })
      return
    }

    setIsDownloading(true)
    try {
      await downloadElementAsImage(elementRef.current, {
        filename,
        format,
        quality: 0.95
      })
      
      toast({
        title: "Download Complete",
        description: `${filename}.${format} has been downloaded`
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={className}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {size !== 'sm' && (
            <span className="ml-2">Download</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleDownload('png')}>
          <Image className="h-4 w-4 mr-2" />
          Download as PNG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDownload('pdf')}>
          <FileText className="h-4 w-4 mr-2" />
          Download as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}