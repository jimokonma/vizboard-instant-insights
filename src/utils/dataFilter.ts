import { FilterState, ColumnType } from '@/types'

export function applyFilters(
  data: Record<string, any>[],
  filters: FilterState,
  columnTypes: ColumnType[]
): Record<string, any>[] {
  return data.filter(row => {
    return Object.entries(filters).every(([columnName, filter]) => {
      const value = row[columnName]
      
      if (value === null || value === undefined) return false

      switch (filter.type) {
        case 'text':
          return !filter.values || filter.values.length === 0 || filter.values.includes(value)
        
        case 'number':
          const numValue = parseFloat(String(value))
          if (isNaN(numValue)) return false
          
          if (filter.min !== undefined && numValue < filter.min) return false
          if (filter.max !== undefined && numValue > filter.max) return false
          return true
        
        case 'date':
          const dateValue = new Date(String(value))
          if (isNaN(dateValue.getTime())) return false
          
          if (filter.dateRange) {
            const [start, end] = filter.dateRange
            if (start && dateValue < start) return false
            if (end && dateValue > end) return false
          }
          return true
        
        default:
          return true
      }
    })
  })
}

export function prepareChartData(
  data: Record<string, any>[],
  xField?: string,
  yField?: string,
  categoryField?: string,
  valueField?: string
): Record<string, any>[] {
  if (!data || data.length === 0) return []

  // For pie charts, aggregate by category
  if (categoryField && valueField) {
    const aggregated = data.reduce((acc, row) => {
      const category = String(row[categoryField])
      const value = parseFloat(String(row[valueField])) || 0
      
      if (acc[category]) {
        acc[category] += value
      } else {
        acc[category] = value
      }
      
      return acc
    }, {} as Record<string, number>)

    return Object.entries(aggregated).map(([name, value]) => ({
      [categoryField]: name,
      [valueField]: value
    }))
  }

  // For bar/line charts, ensure numeric values
  if (xField && yField) {
    return data.map(row => ({
      ...row,
      [yField]: parseFloat(String(row[yField])) || 0
    }))
  }

  return data
}