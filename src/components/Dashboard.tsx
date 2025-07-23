import { useState, useEffect, useMemo, useRef } from 'react'
import { CSVData, ColumnType, ChartConfig, FilterState, DashboardState } from '@/types'
import { parseCSV, detectColumnTypes } from '@/utils/csvParser'
import { applyFilters, prepareChartData } from '@/utils/dataFilter'
import { FileUpload } from './FileUpload'
import { DataPreview } from './DataPreview'
import { ChartSelector } from './ChartSelector'
import { FilterPanel } from './FilterPanel'
import { SimpleChart } from './chart/SimpleChart'
import { DownloadButton } from './DownloadButton'
import { BulkDownloadButton } from './BulkDownloadButton'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Download, RefreshCw, Settings, BarChart3 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Switch } from './ui/switch'
import { Moon, Sun } from 'lucide-react'

function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
      )
    }
    return false
  })

  useEffect(() => {
    const root = window.document.documentElement
    if (isDark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  return [isDark, setIsDark] as const
}

export function Dashboard() {
  const { toast } = useToast()
  const chartRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLDivElement>(null)
  
  const [state, setState] = useState<DashboardState>({
    csvData: null,
    columnTypes: [],
    chartConfig: { type: 'bar' },
    filters: {},
    filteredData: [],
    isLoading: false,
    error: null
  })

  const [isDark, setIsDark] = useDarkMode()

  const handleFileSelect = async (file: File) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const csvData = await parseCSV(file)
      const columnTypes = detectColumnTypes(csvData.rows)
      
      // Set default chart config
      const numericColumns = columnTypes.filter(col => col.type === 'number')
      const defaultConfig: ChartConfig = {
        type: 'bar',
        xField: columnTypes[0]?.name,
        yField: numericColumns[0]?.name,
        yFields: numericColumns[0] ? [numericColumns[0].name] : []
      }

      setState(prev => ({
        ...prev,
        csvData,
        columnTypes,
        chartConfig: defaultConfig,
        filteredData: csvData.rows,
        isLoading: false
      }))

      toast({
        title: "CSV Loaded Successfully",
        description: `${csvData.rows.length} rows and ${csvData.headers.length} columns detected.`
      })
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to parse CSV',
        isLoading: false
      }))
      
      toast({
        title: "Error Loading CSV",
        description: error instanceof Error ? error.message : 'Failed to parse CSV',
        variant: "destructive"
      })
    }
  }

  // Apply filters when data or filters change
  const filteredData = useMemo(() => {
    if (!state.csvData) return []
    return applyFilters(state.csvData.rows, state.filters, state.columnTypes)
  }, [state.csvData, state.filters, state.columnTypes])

  // Prepare chart data based on current config and filtered data
  const chartData = useMemo(() => {
    return prepareChartData(
      filteredData,
      state.chartConfig.xField,
      state.chartConfig.yField,
      state.chartConfig.categoryField,
      state.chartConfig.valueField,
      state.chartConfig.yFields
    )
  }, [filteredData, state.chartConfig])

  const handleConfigChange = (chartConfig: ChartConfig) => {
    setState(prev => ({ ...prev, chartConfig }))
  }

  const handleFiltersChange = (filters: FilterState) => {
    setState(prev => ({ ...prev, filters }))
  }

  const resetDashboard = () => {
    setState({
      csvData: null,
      columnTypes: [],
      chartConfig: { type: 'bar' },
      filters: {},
      filteredData: [],
      isLoading: false,
      error: null
    })
  }

  if (!state.csvData) {
    return (
      <div className="min-h-screen bg-gradient-subtle p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              VizionBoard
            </h1>
            <p className="text-xl text-muted-foreground">
              Transform your CSV data into beautiful interactive visualizations
            </p>
          </div>
          
          <FileUpload
            onFileSelect={handleFileSelect}
            isLoading={state.isLoading}
            error={state.error}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b shadow-card p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              VizionBoard
            </h1>
            <Badge variant="outline" className="flex items-center gap-1">
              <BarChart3 className="h-3 w-3" />
              {filteredData.length} of {state.csvData.rows.length} rows
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {state.csvData && (
              <BulkDownloadButton
                chartRef={chartRef}
                tableRef={tableRef}
                csvData={filteredData}
                filename="dashboard_export"
              />
            )}
            <Button variant="outline" size="sm" onClick={resetDashboard}>
              <RefreshCw className="h-4 w-4 mr-2" />
              New Data
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Filters and Config */}
        <div className="lg:col-span-1 space-y-6">
          <ChartSelector
            columnTypes={state.columnTypes}
            config={state.chartConfig}
            onConfigChange={handleConfigChange}
          />
          
          <FilterPanel
            columnTypes={state.columnTypes}
            filters={state.filters}
            onFiltersChange={handleFiltersChange}
            data={state.csvData.rows}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Chart */}
          <Card className="shadow-data" ref={chartRef}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Visualization</span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {state.chartConfig.type} chart
                  </Badge>
                  <DownloadButton
                    elementRef={chartRef}
                    filename="chart"
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleChart
                data={chartData}
                config={state.chartConfig}
                className="w-full"
              />
            </CardContent>
          </Card>

          {/* Data Preview */}
          <DataPreview
            ref={tableRef}
            data={{ ...state.csvData, rows: filteredData }}
            columnTypes={state.columnTypes}
            maxRows={20}
          />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Sun size={18} />
        <Switch checked={isDark} onCheckedChange={setIsDark} />
        <Moon size={18} />
      </div>
    </div>
  )
}