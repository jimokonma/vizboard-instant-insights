import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer, Legend } from 'recharts'
import { ChartConfig } from '@/types'

interface SimpleChartProps {
  data: Record<string, any>[]
  config: ChartConfig
  className?: string
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))'
]

export function SimpleChart({ data, config, className }: SimpleChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] border rounded-lg bg-muted/10">
        <p className="text-muted-foreground">No data to display</p>
      </div>
    )
  }

  const chartProps = {
    data,
    margin: { top: 5, right: 30, left: 20, bottom: 5 }
  }

  switch (config.type) {
    case 'bar':
      return (
        <div className={className}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey={config.xField} 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-card)'
                }}
              />
              <Legend />
              {(config.yFields && config.yFields.length > 0 ? config.yFields : [config.yField]).filter(Boolean).map((field, index) => (
                <Bar 
                  key={field}
                  dataKey={field} 
                  fill={COLORS[index % COLORS.length]}
                  radius={[4, 4, 0, 0]}
                  name={field}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )

    case 'line':
      return (
        <div className={className}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey={config.xField} 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-card)'
                }}
              />
              <Legend />
              {(config.yFields && config.yFields.length > 0 ? config.yFields : [config.yField]).filter(Boolean).map((field, index) => (
                <Line 
                  key={field}
                  type="monotone" 
                  dataKey={field} 
                  stroke={COLORS[index % COLORS.length]} 
                  strokeWidth={2}
                  dot={{ fill: COLORS[index % COLORS.length], strokeWidth: 2 }}
                  name={field}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )

    case 'pie':
      return (
        <div className={className}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey={config.valueField}
                nameKey={config.categoryField}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-card)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )

    default:
      return (
        <div className="flex items-center justify-center h-[300px] border rounded-lg bg-muted/10">
          <p className="text-muted-foreground">Unsupported chart type</p>
        </div>
      )
  }
}