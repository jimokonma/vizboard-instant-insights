import { ColumnType, ChartConfig } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { BarChart3, LineChart, PieChart, TrendingUp, X } from 'lucide-react'

interface ChartSelectorProps {
  columnTypes: ColumnType[]
  config: ChartConfig
  onConfigChange: (config: ChartConfig) => void
}

export function ChartSelector({ columnTypes, config, onConfigChange }: ChartSelectorProps) {
  const numericColumns = columnTypes.filter(col => col.type === 'number')
  const allColumns = columnTypes

  const chartTypes = [
    { value: 'bar', label: 'Bar Chart', icon: BarChart3 },
    { value: 'line', label: 'Line Chart', icon: LineChart },
    { value: 'pie', label: 'Pie Chart', icon: PieChart },
    { value: 'area', label: 'Area Chart', icon: TrendingUp }
  ] as const

  const handleTypeChange = (type: 'bar' | 'line' | 'pie' | 'area') => {
    const newConfig: ChartConfig = { type }
    
    // Set default fields based on chart type
    if (type === 'pie') {
      newConfig.categoryField = allColumns[0]?.name
      newConfig.valueField = numericColumns[0]?.name
    } else {
      newConfig.xField = allColumns[0]?.name
      newConfig.yField = numericColumns[0]?.name
      newConfig.yFields = numericColumns[0] ? [numericColumns[0].name] : []
    }
    
    onConfigChange(newConfig)
  }

  const updateConfig = (field: string, value: string) => {
    onConfigChange({ ...config, [field]: value })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chart Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Chart Type Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Chart Type</label>
          <div className="grid grid-cols-2 gap-2">
            {chartTypes.map(({ value, label, icon: Icon }) => (
              <Button
                key={value}
                variant={config.type === value ? "default" : "outline"}
                onClick={() => handleTypeChange(value)}
                className="flex items-center gap-2 h-auto p-3"
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm">{label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Field Selection based on chart type */}
        {config.type === 'pie' ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category Field</label>
              <Select value={config.categoryField} onValueChange={(value) => updateConfig('categoryField', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category field" />
                </SelectTrigger>
                <SelectContent>
                  {allColumns.map((col) => (
                    <SelectItem key={col.name} value={col.name}>
                      {col.name} ({col.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Value Field</label>
              <Select value={config.valueField} onValueChange={(value) => updateConfig('valueField', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select value field" />
                </SelectTrigger>
                <SelectContent>
                  {numericColumns.map((col) => (
                    <SelectItem key={col.name} value={col.name}>
                      {col.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">X-Axis</label>
              <Select value={config.xField} onValueChange={(value) => updateConfig('xField', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select X-axis field" />
                </SelectTrigger>
                <SelectContent>
                  {allColumns.map((col) => (
                    <SelectItem key={col.name} value={col.name}>
                      {col.name} ({col.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Y-Axis Fields</label>
              <div className="space-y-2">
                {config.yFields && config.yFields.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {config.yFields.map((field) => (
                      <Badge key={field} variant="secondary" className="flex items-center gap-1">
                        {field}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => {
                            const newFields = config.yFields?.filter(f => f !== field) || []
                            onConfigChange({ ...config, yFields: newFields, yField: newFields[0] })
                          }}
                        >
                          <X className="h-2 w-2" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="grid gap-2">
                  {numericColumns.map((col) => (
                    <div key={col.name} className="flex items-center space-x-2">
                      <Checkbox
                        id={col.name}
                        checked={config.yFields?.includes(col.name) || false}
                        onCheckedChange={(checked) => {
                          const currentFields = config.yFields || []
                          if (checked) {
                            const newFields = [...currentFields, col.name]
                            onConfigChange({ ...config, yFields: newFields, yField: newFields[0] })
                          } else {
                            const newFields = currentFields.filter(f => f !== col.name)
                            onConfigChange({ ...config, yFields: newFields, yField: newFields[0] })
                          }
                        }}
                      />
                      <label htmlFor={col.name} className="text-sm cursor-pointer">
                        {col.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}