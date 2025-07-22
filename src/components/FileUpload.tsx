import { useState, useCallback } from 'react'
import { Upload, File, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  isLoading?: boolean
  error?: string | null
}

export function FileUpload({ onFileSelect, isLoading, error }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        onFileSelect(file)
      }
    }
  }, [onFileSelect])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      onFileSelect(files[0])
    }
  }, [onFileSelect])

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-8">
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200",
            isDragOver 
              ? "border-primary bg-primary/5 scale-105" 
              : "border-muted-foreground/25 hover:border-primary/50",
            isLoading && "opacity-50 pointer-events-none"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-4">
            {isLoading ? (
              <div className="animate-spin">
                <File className="h-12 w-12 text-primary" />
              </div>
            ) : (
              <Upload className="h-12 w-12 text-muted-foreground" />
            )}
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                {isLoading ? 'Processing CSV...' : 'Upload your CSV file'}
              </h3>
              <p className="text-muted-foreground">
                Drag and drop your CSV file here, or click to browse
              </p>
            </div>

            <Button
              variant="outline"
              disabled={isLoading}
              className="relative"
            >
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isLoading}
              />
              Choose File
            </Button>

            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}