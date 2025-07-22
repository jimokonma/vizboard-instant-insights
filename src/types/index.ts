export interface CSVData {
  headers: string[]
  rows: Record<string, any>[]
  rawData: any[][]
}

export interface ColumnType {
  name: string
  type: 'number' | 'string' | 'date'
  uniqueValues?: any[]
  min?: number
  max?: number
}

export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'area'
  xField?: string
  yField?: string
  yFields?: string[] // Multiple Y-axis fields
  categoryField?: string
  valueField?: string
}

export interface FilterState {
  [columnName: string]: {
    type: 'text' | 'number' | 'date'
    values?: any[]
    min?: number
    max?: number
    dateRange?: [Date?, Date?]
  }
}

export interface DashboardState {
  csvData: CSVData | null
  columnTypes: ColumnType[]
  chartConfig: ChartConfig
  filters: FilterState
  filteredData: Record<string, any>[]
  isLoading: boolean
  error: string | null
}