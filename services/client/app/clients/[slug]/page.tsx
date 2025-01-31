'use client'

import ClientHeading from '@/components/ui/ClientHeading'
import PageContainer from '@/components/ui/PageContainer'
import { use, useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'

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
import OpenAI from 'openai'
import { Separator } from '@/components/core-ui/separator'

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
  const { toast } = useToast()
  // console.log(slug)
  const [client, setClient] = useState(null)
  const [csvData, setCSVData] = useState(null)
  const [insights, setInsights] = useState<string | null>(null)
  const [loadingInsights, setLoadingInsights] = useState(false)

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

  const fetchCSVData = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/v1/client/${slug}/csv_data`,
    )
    const data = await response.json()
    setCSVData(data)
  }

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

    fetchClientData()
    fetchCSVData()
  }, [slug])

  useEffect(() => {
    if (csvData) {
      fetchInsights()
    }
  }, [csvData])

  const fetchInsights = async () => {
    try {
      setLoadingInsights(true)
      const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      })

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'You are a data analyst that provides insights on the data provided.',
          },
          {
            role: 'user',
            content: `As a data analyst, please provide a detailed analysis of the following data: 
            ${JSON.stringify(filteredData)}. 
            
            Focus on identifying trends, anomalies, and correlations between different types of joins (vanity, discovery, invites, integration, and others). Highlight any significant changes over time and suggest potential reasons or implications for these changes. Additionally, provide actionable recommendations based on the insights derived from the data.

            Start directly with the analysis content without any introductory phrases.

            Example of the desired output:

            <p><b>Trends:</b> Vanity joins have increased by 20% over the last month, likely due to a new marketing campaign.</p>

            <p><b>Anomalies:</b> A sudden spike in discovery joins on March 15th, possibly due to a viral event.</p>

            <p><b>Correlations:</b> A strong correlation between invites and integration joins, suggesting effective cross-promotion.</p>

            <p><b>Recommendations:</b> Continue the marketing efforts for vanity joins and investigate the cause of the spike in discovery joins.</p>`,
          },
        ],
      })

      setInsights(response.choices[0].message.content.trim())
    } catch (error) {
      console.error('Failed to fetch insights:', error)
    } finally {
      setLoadingInsights(false)
    }
  }

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/v1/csv/upload_csv/?client_slug=${slug}`,
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
      })

      // Refresh the data
      await fetchCSVData()
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
    <div>
      <PageContainer>
        <ClientHeading client={client} />
        <div className="mb-4 mr-0 ml-auto">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
            id="csv-upload"
          />
          <label
            htmlFor="csv-upload"
            className="text-sm inline-flex items-center px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md cursor-pointer"
          >
            Upload CSV
          </label>
        </div>
        {/* Key Metrics */}
        <div className="w-full">
          <div className="h-[300px] w-full bg-white flex items-center justify-center rounded-xl">
            <h4>Key Metrics</h4>
          </div>
          <div className="grid grid-cols-3 gap-4 w-full my-4">
            <div className="h-[300px] w-full bg-white flex items-center justify-center rounded-xl">
              <h4>Community</h4>
            </div>
            <div className="h-[300px] w-full bg-white flex items-center justify-center rounded-xl">
              <h4>Social</h4>
            </div>
            <div className="h-[300px] w-full bg-white flex items-center justify-center rounded-xl">
              <h4>Web / App</h4>
            </div>
          </div>
        </div>
        {/* Socials Growth and Activation */}
        <Separator className="my-8" />
        <div className="w-full py-4">
          <h4 className="text-center mb-8">Last 30 Days</h4>
          <div className="grid grid-cols-4 gap-4 w-full my-4">
            <div className="h-[300px] w-full bg-white flex items-center justify-center rounded-xl">
              <h4>Discord</h4>
            </div>
            <div className="h-[300px] w-full bg-white flex items-center justify-center rounded-xl">
              <h4>Telegram</h4>
            </div>
            <div className="h-[300px] w-full bg-white flex items-center justify-center rounded-xl">
              <h4>Web / App</h4>
            </div>
            <div className="h-[300px] w-full bg-white flex items-center justify-center rounded-xl">
              <h4>Social</h4>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-4 w-full my-4">
            <div className="h-[300px] w-full bg-white flex items-center justify-center rounded-xl">
              <h4>Discord vs Telegram</h4>
            </div>
            <div className="h-[300px] w-full bg-white flex items-center justify-center rounded-xl">
              <h4>Discord vs X</h4>
            </div>
            <div className="h-[300px] w-full bg-white flex items-center justify-center rounded-xl">
              <h4>Discord vs Web</h4>
            </div>
            <div className="h-[300px] w-full bg-white flex items-center justify-center rounded-xl">
              <h4>X vs Y</h4>
            </div>
            <div className="h-[300px] w-full bg-white flex items-center justify-center rounded-xl">
              <h4>X vs Y</h4>
            </div>
          </div>
        </div>
        {csvData && csvData.length > 0 && (
          <>
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
            {loadingInsights ? (
              <div className="spinner mt-4"></div>
            ) : (
              insights && (
                <div className="w-[650px] mt-4 p-4 bg-gray-100 rounded-lg">
                  <h3 className="text-2xl font-semibold mb-2">Insights</h3>
                  <div dangerouslySetInnerHTML={{ __html: insights }} />
                </div>
              )
            )}
          </>
        )}
      </PageContainer>
    </div>
  )
}
