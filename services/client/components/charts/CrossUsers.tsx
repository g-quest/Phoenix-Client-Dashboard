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
import { format, parseISO } from 'date-fns'

const chartConfig = {
  discord_new_joins: {
    label: 'Discord',
    color: 'var(--chart-1)',
  },
  telegram_new_users: {
    label: 'Telegram',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

export default function ChartCrossUsers(props) {
  const { telegramData, discordGrowthData, chartTitle, chartDescription } =
    props

  // Combine data
  const combinedData = telegramData.map((telegramEntry) => {
    const discordEntry = discordGrowthData.find(
      (discordEntry) => discordEntry.date === telegramEntry.date,
    )

    return {
      date: telegramEntry.date,
      new_users: telegramEntry.new_users,
      total_joins: discordEntry ? discordEntry.total_joins : 0,
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
          discordGrowthData &&
          discordGrowthData.length > 0 ? (
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <AreaChart data={combinedData}>
                <defs>
                  <linearGradient
                    id="telegram_new_usersGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={chartConfig.telegram_new_users.color}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="70%"
                      stopColor={chartConfig.telegram_new_users.color}
                      stopOpacity={0.3}
                    />
                  </linearGradient>
                  <linearGradient
                    id="discord_new_joinsGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={chartConfig.discord_new_joins.color}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="70%"
                      stopColor={chartConfig.discord_new_joins.color}
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
                  dataKey="total_joins"
                  type="natural"
                  fill="url(#discord_new_joinsGradient)"
                  stroke={chartConfig.discord_new_joins.color}
                  name={chartConfig.discord_new_joins.label}
                  fillOpacity={1}
                />
                <Area
                  yAxisId="left_id"
                  dataKey="new_users"
                  type="natural"
                  fill="url(#telegram_new_usersGradient)"
                  stroke={chartConfig.telegram_new_users.color}
                  name={chartConfig.telegram_new_users.label}
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
