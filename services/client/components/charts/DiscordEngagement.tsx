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

const chartConfig = {
  visitors: {
    label: 'Visitors',
    color: 'var(--chart-2)',
  },
  pct_communicated: {
    label: 'Percentage Communicated',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

export default function ChartDiscordEngagement(props) {
  const {
    slug,
    chartData,
    chartTitle,
    chartDescription,
    fetchDiscordEngagementData,
    toast,
  } = props

  const handleEngagementFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/v1/discord/upload/engagement_csv/?client_slug=${slug}&csv_type=engagement`,
        {
          method: 'POST',
          body: formData,
        },
      )

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      toast({
        title: 'Success',
        description: 'CSV file uploaded successfully',
        variant: 'success',
      })

      // Refresh the data
      await fetchDiscordEngagementData()
    } catch (error) {
      console.error('Upload failed:', error)
      toast({
        title: 'Error',
        description: 'Failed to upload CSV file',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="w-full">
      <Card className="border-none shadow-none">
        <CardHeader className="flex flex-row gap-2 py-5">
          <div className="grid gap-1 text-left">
            <CardTitle>{chartTitle}</CardTitle>
            <CardDescription>{chartDescription}</CardDescription>
          </div>
          <div className="mr-0 ml-auto">
            <input
              type="file"
              accept=".csv"
              onChange={handleEngagementFileUpload}
              className="hidden"
              id="engagement-csv-upload"
            />
            <label
              htmlFor="engagement-csv-upload"
              className="text-primary cursor-pointer"
            >
              <Upload />
            </label>
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          {chartData && chartData.length > 0 ? (
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient
                    id="visitorsGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={chartConfig.visitors.color}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="70%"
                      stopColor={chartConfig.visitors.color}
                      stopOpacity={0.3}
                    />
                  </linearGradient>
                  <linearGradient
                    id="pct_communicatedGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={chartConfig.pct_communicated.color}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="70%"
                      stopColor={chartConfig.pct_communicated.color}
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
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
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
                  yAxisId="left"
                  dataKey="visitors"
                  type="natural"
                  fill="url(#visitorsGradient)"
                  stroke={chartConfig.visitors.color}
                  stackId="a"
                />
                <Area
                  yAxisId="right"
                  dataKey="pct_communicated"
                  type="natural"
                  fill="url(#pct_communicatedGradient)"
                  stroke={chartConfig.pct_communicated.color}
                  stackId="a"
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
