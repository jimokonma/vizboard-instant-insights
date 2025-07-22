// Simple chart component without complex types
import * as React from "react"

export interface ChartConfig {
  [key: string]: {
    label?: string
    color?: string
  }
}

export const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    config: ChartConfig
    children: React.ReactNode
  }
>(({ children, className, config, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={className}
      {...props}
    >
      {children}
    </div>
  )
})
ChartContainer.displayName = "ChartContainer"

export const ChartTooltip = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>
}

export const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={className}
      {...props}
    />
  )
})
ChartTooltipContent.displayName = "ChartTooltipContent"