import { CSVData, ColumnType } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { DownloadButton } from './DownloadButton'
import { ScrollArea } from './ui/scroll-area'
import { Eye, EyeOff } from 'lucide-react'
import { forwardRef, useRef, useImperativeHandle } from 'react'

interface DataPreviewProps {
  data: CSVData
  columnTypes: ColumnType[]
  maxRows?: number
}

export const DataPreview = forwardRef<HTMLDivElement, DataPreviewProps>(
  ({ data, columnTypes, maxRows = 10 }, ref) => {
    const internalRef = useRef<HTMLDivElement>(null)
    
    useImperativeHandle(ref, () => internalRef.current!, [])
    
    if (!data || !data.rows || data.rows.length === 0) {
      return (
        <Card className="shadow-data">
          <CardContent className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">No data to display</p>
          </CardContent>
        </Card>
      )
    }

    const displayRows = data.rows.slice(0, maxRows)
    const hasMoreRows = data.rows.length > maxRows

    const getColumnType = (columnName: string) => {
      return columnTypes.find(col => col.name === columnName)?.type || 'string'
    }

    const getTypeBadgeVariant = (type: string) => {
      switch (type) {
        case 'number': return 'default'
        case 'date': return 'secondary'
        default: return 'outline'
      }
    }

    return (
      <Card className="shadow-data" ref={internalRef}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Data Preview</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {displayRows.length} of {data.rows.length} rows
              </Badge>
              <DownloadButton
                elementRef={internalRef}
                filename="data_table"
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  {data.headers.map((header) => (
                    <TableHead key={header} className="font-medium">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm">{header}</span>
                        <Badge 
                          variant={getTypeBadgeVariant(getColumnType(header))}
                          className="text-xs w-fit"
                        >
                          {getColumnType(header)}
                        </Badge>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayRows.map((row, index) => (
                  <TableRow key={index}>
                    {data.headers.map((header) => (
                      <TableCell key={header} className="text-sm">
                        <span className="max-w-[200px] truncate block">
                          {String(row[header] ?? '')}
                        </span>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
          
          {hasMoreRows && (
            <div className="mt-4 text-center text-sm text-muted-foreground">
              <Badge variant="outline" className="flex items-center gap-2 w-fit mx-auto">
                <EyeOff className="h-3 w-3" />
                Showing {maxRows} of {data.rows.length} rows
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }
)

DataPreview.displayName = "DataPreview"