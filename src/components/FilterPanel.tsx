import { useState } from 'react'
import { ColumnType, FilterState } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X, Filter } from 'lucide-react'

interface FilterPanelProps {
  columnTypes: ColumnType[]
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  data: Record<string, any>[]
}

export function FilterPanel({ columnTypes, filters, onFiltersChange, data }: FilterPanelProps) {
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(new Set())

  const toggleFilter = (columnName: string) => {
    const newExpanded = new Set(expandedFilters)
    if (newExpanded.has(columnName)) {
      newExpanded.delete(columnName)
    } else {
      newExpanded.add(columnName)
    }
    setExpandedFilters(newExpanded)
  }

  const updateFilter = (columnName: string, update: Partial<FilterState[string]>) => {
    onFiltersChange({
      ...filters,
      [columnName]: {
        ...filters[columnName],
        ...update
      }
    })
  }

  const removeFilter = (columnName: string) => {
    const newFilters = { ...filters }
    delete newFilters[columnName]
    onFiltersChange(newFilters)
  }

  const clearAllFilters = () => {
    onFiltersChange({})
  }

  const addFilter = (columnName: string, column: ColumnType) => {
    const newFilter: FilterState[string] = { type: column.type as any }
    
    if (column.type === 'string' && column.uniqueValues) {
      newFilter.values = []
    } else if (column.type === 'number') {
      newFilter.min = column.min
      newFilter.max = column.max
    } else if (column.type === 'date') {
      newFilter.dateRange = [undefined, undefined]
    }

    onFiltersChange({
      ...filters,
      [columnName]: newFilter
    })
  }

  const activeFilterCount = Object.keys(filters).length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </span>
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              Clear All
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Filter Dropdown */}
        <Select onValueChange={(columnName) => {
          const column = columnTypes.find(col => col.name === columnName)
          if (column && !filters[columnName]) {
            addFilter(columnName, column)
          }
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Add a filter..." />
          </SelectTrigger>
          <SelectContent>
            {columnTypes
              .filter(col => !filters[col.name])
              .map(col => (
                <SelectItem key={col.name} value={col.name}>
                  {col.name} ({col.type})
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        {/* Active Filters */}
        {Object.entries(filters).map(([columnName, filter]) => {
          const column = columnTypes.find(col => col.name === columnName)
          if (!column) return null

          return (
            <Card key={columnName} className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-sm">{columnName}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFilter(columnName)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>

                {/* Text Filter */}
                {filter.type === 'text' && column.uniqueValues && (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {column.uniqueValues.map((value) => (
                      <div key={String(value)} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${columnName}-${value}`}
                          checked={filter.values?.includes(value) ?? false}
                          onCheckedChange={(checked) => {
                            const currentValues = filter.values || []
                            const newValues = checked
                              ? [...currentValues, value]
                              : currentValues.filter(v => v !== value)
                            updateFilter(columnName, { values: newValues })
                          }}
                        />
                        <label htmlFor={`${columnName}-${value}`} className="text-sm">
                          {String(value)}
                        </label>
                      </div>
                    ))}
                  </div>
                )}

                {/* Number Filter */}
                {filter.type === 'number' && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-muted-foreground">Min</label>
                        <Input
                          type="number"
                          placeholder="Min"
                          value={filter.min ?? ''}
                          onChange={(e) => updateFilter(columnName, { 
                            min: e.target.value ? parseFloat(e.target.value) : undefined 
                          })}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Max</label>
                        <Input
                          type="number"
                          placeholder="Max"
                          value={filter.max ?? ''}
                          onChange={(e) => updateFilter(columnName, { 
                            max: e.target.value ? parseFloat(e.target.value) : undefined 
                          })}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Date Filter */}
                {filter.type === 'date' && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-muted-foreground">From</label>
                        <Input
                          type="date"
                          value={filter.dateRange?.[0]?.toISOString().split('T')[0] ?? ''}
                          onChange={(e) => {
                            const date = e.target.value ? new Date(e.target.value) : undefined
                            updateFilter(columnName, { 
                              dateRange: [date, filter.dateRange?.[1]] 
                            })
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">To</label>
                        <Input
                          type="date"
                          value={filter.dateRange?.[1]?.toISOString().split('T')[0] ?? ''}
                          onChange={(e) => {
                            const date = e.target.value ? new Date(e.target.value) : undefined
                            updateFilter(columnName, { 
                              dateRange: [filter.dateRange?.[0], date] 
                            })
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </CardContent>
    </Card>
  )
}