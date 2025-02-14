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
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/core-ui/chart'
import { format } from 'date-fns'

const chartConfig = {
  discord_messages: {
    label: 'Discord',
    color: 'var(--chart-1)',
  },
  telegram_messages: {
    label: 'Telegram',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

export default function ChartCrossMessages(props) {
  const { telegramData, discordEngagementData, chartTitle, chartDescription } =
    props

  // Combine data
  const combinedData = telegramData.map((telegramEntry) => {
    const discordEntry = discordEngagementData.find(
      (discordEntry) => discordEntry.date === telegramEntry.date,
    )

    return {
      date: telegramEntry.date,
      telegram_messages: telegramEntry.messages,
      discord_messages: discordEntry ? discordEntry.messages : 0,
    }
  })

  return (
    <div className="w-full">
      <Card className="border-none shadow-none">
        <CardHeader className="flex flex-row gap-2 py-5">
          <div className="grid text-left">
            <CardTitle className="text-lg">{chartTitle}</CardTitle>
            <CardDescription>{chartDescription}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:px-6 sm:pt-2">
          {telegramData &&
          telegramData.length > 0 &&
          discordEngagementData &&
          discordEngagementData.length > 0 ? (
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <AreaChart data={combinedData}>
                <defs>
                  <linearGradient
                    id="telegram_messagesGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={chartConfig.telegram_messages.color}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="70%"
                      stopColor={chartConfig.telegram_messages.color}
                      stopOpacity={0.3}
                    />
                  </linearGradient>
                  <linearGradient
                    id="discord_messagesGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={chartConfig.discord_messages.color}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="70%"
                      stopColor={chartConfig.discord_messages.color}
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
                    const utcDate = new Date(
                      date.getTime() + date.getTimezoneOffset() * 60000,
                    )
                    return format(utcDate, 'MMM d')
                  }}
                />
                <YAxis yAxisId="left_id" />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        const date = new Date(value)
                        const utcDate = new Date(
                          date.getTime() + date.getTimezoneOffset() * 60000,
                        )
                        return format(utcDate, 'MMM d')
                      }}
                      indicator="dot"
                    />
                  }
                />
                <Area
                  yAxisId="left_id"
                  dataKey="discord_messages"
                  type="natural"
                  fill="url(#discord_messagesGradient)"
                  stroke={chartConfig.discord_messages.color}
                  name={chartConfig.discord_messages.label}
                  fillOpacity={1}
                />
                <Area
                  yAxisId="left_id"
                  dataKey="telegram_messages"
                  type="natural"
                  fill="url(#telegram_messagesGradient)"
                  stroke={chartConfig.telegram_messages.color}
                  name={chartConfig.telegram_messages.label}
                  fillOpacity={1}
                />

                <ChartLegend />
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
