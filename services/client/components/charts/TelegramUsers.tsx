import { Upload } from 'lucide-react'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/core-ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/core-ui/chart'
import { Separator } from '@/components/core-ui/separator'

const chartConfig = {
  new_users: {
    label: 'New Users',
    color: 'var(--chart-1)',
  },
  active_users: {
    label: 'Active Users',
    color: 'var(--chart-2)',
  },
  left_users: {
    label: 'Left Users',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig

export default function ChartTelegramUsers(props) {
  const {
    chartData,
    chartTitle,
    chartDescription,
    totalNewUsers,
    totalActiveUsers,
    totalLeftUsers,
  } = props

  return (
    <div className="w-full">
      <Card className="border-none shadow-none">
        <CardHeader className="flex flex-row gap-2 py-5">
          <div className="grid text-left">
            <CardTitle className="text-lg">{chartTitle}</CardTitle>
            <CardDescription>{chartDescription}</CardDescription>
          </div>
        </CardHeader>
        <Separator className="my-2" />
        <CardContent className="p-4 sm:px-6 sm:pt-2">
          <div className="mb-4">
            <p>
              <span className="font-bold">Total New Users:</span>{' '}
              {totalNewUsers}
            </p>
            <p>
              <span className="font-bold">Total Active Users:</span>{' '}
              {totalActiveUsers}
            </p>
            <p>
              <span className="font-bold">Total Left Users:</span>{' '}
              {totalLeftUsers}
            </p>
          </div>
          {chartData && chartData.length > 0 ? (
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient
                    id="new_usersGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={chartConfig.new_users.color}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="70%"
                      stopColor={chartConfig.new_users.color}
                      stopOpacity={0.3}
                    />
                  </linearGradient>
                  <linearGradient
                    id="active_usersGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={chartConfig.active_users.color}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="70%"
                      stopColor={chartConfig.active_users.color}
                      stopOpacity={0.3}
                    />
                  </linearGradient>
                  <linearGradient
                    id="left_usersGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={chartConfig.left_users.color}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="70%"
                      stopColor={chartConfig.left_users.color}
                      stopOpacity={0.3}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })
                  }}
                />
                <YAxis yAxisId="left_id" />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })
                      }}
                      indicator="dot"
                    />
                  }
                />
                <Area
                  yAxisId="left_id"
                  dataKey="new_users"
                  type="natural"
                  fill="url(#new_usersGradient)"
                  stroke={chartConfig.new_users.color}
                />
                <Area
                  yAxisId="left_id"
                  dataKey="active_users"
                  type="natural"
                  fill="url(#active_usersGradient)"
                  stroke={chartConfig.active_users.color}
                  fillOpacity={1}
                />
                <Area
                  yAxisId="left_id"
                  dataKey="left_users"
                  type="natural"
                  fill="url(#left_usersGradient)"
                  stroke={chartConfig.left_users.color}
                  fillOpacity={1}
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          ) : (
            <div className="h-[250px] w-full bg-white flex flex-col items-center justify-center text-center">
              <h4>No Data Available</h4>
              <p>Latest data not found. Please update or try again.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
