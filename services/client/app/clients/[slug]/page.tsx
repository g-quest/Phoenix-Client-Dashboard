'use client'

import ClientHeading from '@/components/ui/ClientHeading'
import PageContainer from '@/components/ui/PageContainer'
import { use, useEffect, useState } from 'react'

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/core-ui/select'

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

export default function ClientPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params) as { slug: string }
  // console.log(slug)
  const [client, setClient] = useState(null)
  const [csvData, setCSVData] = useState(null)

  const [timeRange, setTimeRange] = useState('3 months')
  const filteredData = csvData
    ? csvData.filter((item) => {
        const date = new Date(item.date) // Ensure the date is parsed correctly
        const referenceDate = new Date()
        let daysToSubtract = 90
        if (timeRange === '30 days') {
          daysToSubtract = 30
        } else if (timeRange === '7 days') {
          daysToSubtract = 7
        }
        const startDate = new Date(referenceDate)
        startDate.setDate(startDate.getDate() - daysToSubtract)
        return date >= startDate
      })
    : []
  console.log(filteredData) // Add this line to verify data

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/v1/client/${slug}`,
        )
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        // console.log("DATA: ",data)
        setClient(data)
      } catch (error) {
        console.error('Failed to fetch clients:', error)
      }
    }

    const fetchCSVData = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/v1/client/${slug}/csv_data`,
      )
      const data = await response.json()
      console.log('CSV DATA: ', data)
      setCSVData(data)
    }

    fetchClientData()
    fetchCSVData()
  }, [])

  return (
    <div>
      <PageContainer>
        <ClientHeading client={client} />
        <Card>
          <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
            <div className="grid flex-1 gap-1 text-center sm:text-left">
              <CardTitle>Growth and Activation</CardTitle>
              <CardDescription>
                Total visitors in the last {timeRange}.
              </CardDescription>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                className="w-[160px] rounded-lg sm:ml-auto"
                aria-label="Select a value"
              >
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="3 months" className="rounded-lg">
                  Last 3 months
                </SelectItem>
                <SelectItem value="30 days" className="rounded-lg">
                  Last 30 days
                </SelectItem>
                <SelectItem value="7 days" className="rounded-lg">
                  Last 7 days
                </SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <AreaChart data={filteredData}>
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
                  dataKey="vanity_joins"
                  type="natural"
                  fill="url(#vanityGradient)"
                  stroke={chartConfig.vanity_joins.color}
                  stackId="a"
                />
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
                  dataKey="integration_joins"
                  type="natural"
                  fill="url(#integrationGradient)"
                  stroke={chartConfig.integration_joins.color}
                  stackId="a"
                />
                <Area
                  dataKey="other_joins"
                  type="natural"
                  fill="url(#otherGradient)"
                  stroke={chartConfig.other_joins.color}
                  stackId="a"
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </PageContainer>
    </div>
  )
}
