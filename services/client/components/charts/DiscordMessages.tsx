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
  messages: {
    label: 'Messages',
    color: 'var(--chart-1)',
  },
  messages_per_communicator: {
    label: 'Messages per Communicator',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

export default function ChartDiscordMessages(props) {
  const {
    slug,
    chartData,
    chartTitle,
    chartDescription,
    fetchDiscordMessagesData,
    toast,
    totalMessages,
    averageMessagesPerCommunicator,
  } = props

  const handleMessagesFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/v1/discord/upload/engagement_csv/?client_slug=${slug}&csv_type=messages`,
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
      await fetchDiscordMessagesData()
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
              onChange={handleMessagesFileUpload}
              className="hidden"
              id="messages-csv-upload"
            />
            <label
              htmlFor="messages-csv-upload"
              className="text-primary cursor-pointer"
            >
              <Upload />
            </label>
          </div>
        </CardHeader>
        <Separator className="my-2" />
        <CardContent className="p-4 sm:px-6 sm:pt-2">
          <div className="mb-4">
            <p>
              <span className="font-bold">Total Messages:</span> {totalMessages}
            </p>
            <p>
              <span className="font-bold">Average Messages Per User:</span>{' '}
              {averageMessagesPerCommunicator}
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
                    id="messagesGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={chartConfig.messages.color}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="70%"
                      stopColor={chartConfig.messages.color}
                      stopOpacity={0.3}
                    />
                  </linearGradient>
                  <linearGradient
                    id="messages_per_communicatorGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={chartConfig.messages_per_communicator.color}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="70%"
                      stopColor={chartConfig.messages_per_communicator.color}
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
                  dataKey="messages"
                  type="natural"
                  fill="url(#messagesGradient)"
                  stroke={chartConfig.messages.color}
                  stackId="a"
                />
                <Area
                  yAxisId="right"
                  dataKey="messages_per_communicator"
                  type="natural"
                  fill="url(#messages_per_communicatorGradient)"
                  stroke={chartConfig.messages_per_communicator.color}
                  stackId="a"
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
