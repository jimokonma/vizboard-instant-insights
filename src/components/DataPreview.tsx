import { CSVData, ColumnType } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatValue } from '@/utils/csvParser'

interface DataPreviewProps {
  data: CSVData
  columnTypes: ColumnType[]
  maxRows?: number
}

export function DataPreview({ data, columnTypes, maxRows = 10 }: DataPreviewProps) {
  const previewData = data.rows.slice(0, maxRows)
  
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Data Preview</span>
          <Badge variant="outline">
            {data.rows.length} rows × {data.headers.length} columns
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                {data.headers.map((header) => (
                  <th key={header} className="text-left p-2 font-medium">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm">{header}</span>
                      <Badge 
                        variant={getTypeBadgeVariant(getColumnType(header))}
                        className="text-xs"
                      >
                        {getColumnType(header)}
                      </Badge>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewData.map((row, index) => (
                <tr key={index} className="border-b hover:bg-muted/50">
                  {data.headers.map((header) => (
                    <td key={header} className="p-2 text-sm">
                      {formatValue(row[header], getColumnType(header))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {data.rows.length > maxRows && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Showing {maxRows} of {data.rows.length} rows
          </div>
        )}
      </CardContent>
    </Card>
  )
}