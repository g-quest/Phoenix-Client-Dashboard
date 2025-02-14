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
  vanity_joins: {
    label: 'Vanity URL',
    color: 'var(--chart-1)',
  },
  invites: {
    label: 'Invite',
    color: 'var(--chart-2)',
  },
  discovery_joins: {
    label: 'Discovery',
    color: 'var(--chart-3)',
  },
  integration_joins: {
    label: 'Integration',
    color: 'var(--chart-4)',
  },
  other_joins: {
    label: 'Others',
    color: 'var(--chart-5)',
  },
} satisfies ChartConfig

export default function ChartDiscordGrowth(props) {
  const {
    slug,
    chartData,
    chartTitle,
    chartDescription,
    fetchDiscordGrowthData,
    toast,
  } = props

  const handleGrowthFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/v1/discord/upload/growth_csv/?client_slug=${slug}`,
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
      await fetchDiscordGrowthData()
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
          <div className="grid text-left">
            <CardTitle className="text-lg">{chartTitle}</CardTitle>
            <CardDescription>{chartDescription}</CardDescription>
          </div>
          <div className="mr-0 ml-auto">
            <input
              type="file"
              accept=".csv"
              onChange={handleGrowthFileUpload}
              className="hidden"
              id="growth-csv-upload"
            />
            <label
              htmlFor="growth-csv-upload"
              className="text-primary cursor-pointer"
            >
              <Upload />
            </label>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:px-6 sm:pt-2">
          {chartData && chartData.length > 0 ? (
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient
                    id="vanityGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={chartConfig.vanity_joins.color}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="70%"
                      stopColor={chartConfig.vanity_joins.color}
                      stopOpacity={0.3}
                    />
                  </linearGradient>
                  <linearGradient
                    id="discoveryGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={chartConfig.discovery_joins.color}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="70%"
                      stopColor={chartConfig.discovery_joins.color}
                      stopOpacity={0.3}
                    />
                  </linearGradient>
                  <linearGradient
                    id="invitesGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={chartConfig.invites.color}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="70%"
                      stopColor={chartConfig.invites.color}
                      stopOpacity={0.3}
                    />
                  </linearGradient>
                  <linearGradient
                    id="integrationGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={chartConfig.integration_joins.color}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="70%"
                      stopColor={chartConfig.integration_joins.color}
                      stopOpacity={0.3}
                    />
                  </linearGradient>
                  <linearGradient
                    id="otherGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={chartConfig.other_joins.color}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="70%"
                      stopColor={chartConfig.other_joins.color}
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
                <YAxis />
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
                {/* <Area
                  dataKey="other_joins"
                  type="natural"
                  fill="url(#otherGradient)"
                  stroke={chartConfig.other_joins.color}
                  stackId="a"
                />
                <Area
                  dataKey="integration_joins"
                  type="natural"
                  fill="url(#integrationGradient)"
                  stroke={chartConfig.integration_joins.color}
                  stackId="a"
                /> */}
                <Area
                  dataKey="discovery_joins"
                  type="natural"
                  fill="url(#discoveryGradient)"
                  stroke={chartConfig.discovery_joins.color}
                  stackId="a"
                />
                <Area
                  dataKey="invites"
                  type="natural"
                  fill="url(#invitesGradient)"
                  stroke={chartConfig.invites.color}
                  stackId="a"
                />
                <Area
                  dataKey="vanity_joins"
                  type="natural"
                  fill="url(#vanityGradient)"
                  stroke={chartConfig.vanity_joins.color}
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
