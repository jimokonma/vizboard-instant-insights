import Papa from 'papaparse'
import { CSVData, ColumnType } from '@/types'

export function parseCSV(file: File): Promise<CSVData> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(results.errors[0].message))
          return
        }

        const headers = Object.keys(results.data[0] as Record<string, any>)
        
        resolve({
          headers,
          rows: results.data as Record<string, any>[],
          rawData: results.data as any[][]
        })
      },
      error: (error) => {
        reject(error)
      }
    })
  })
}

export function detectColumnTypes(data: Record<string, any>[]): ColumnType[] {
  if (!data || data.length === 0) return []

  const headers = Object.keys(data[0])
  
  return headers.map(header => {
    const values = data.map(row => row[header]).filter(val => val !== null && val !== undefined && val !== '')
    
    if (values.length === 0) {
      return { name: header, type: 'string' as const }
    }

    // Check if all values are numbers
    const numericValues = values.filter(val => {
      const num = parseFloat(String(val))
      return !isNaN(num) && isFinite(num)
    })

    if (numericValues.length === values.length) {
      const nums = numericValues.map(val => parseFloat(String(val)))
      return {
        name: header,
        type: 'number' as const,
        min: Math.min(...nums),
        max: Math.max(...nums)
      }
    }

    // Check if values are dates
    const dateValues = values.filter(val => {
      const date = new Date(String(val))
      return !isNaN(date.getTime())
    })

    if (dateValues.length > values.length * 0.8) { // 80% threshold for date detection
      return { name: header, type: 'date' as const }
    }

    // Default to string with unique values for filtering
    const uniqueValues = [...new Set(values)].slice(0, 100) // Limit to 100 unique values
    
    return {
      name: header,
      type: 'string' as const,
      uniqueValues
    }
  })
}

export function formatValue(value: any, type: 'number' | 'string' | 'date'): string {
  if (value === null || value === undefined) return ''
  
  switch (type) {
    case 'number':
      return parseFloat(String(value)).toLocaleString()
    case 'date':
      return new Date(String(value)).toLocaleDateString()
    default:
      return String(value)
  }
}