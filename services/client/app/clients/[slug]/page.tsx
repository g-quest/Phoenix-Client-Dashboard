'use client'

import ClientHeading from '@/components/ui/ClientHeading'
import PageContainer from '@/components/ui/PageContainer'
import { use, useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/core-ui/select'
import ChartDiscordGrowth from '@/components/charts/DiscordGrowth'
import ChartDiscordEngagement from '@/components/charts/DiscordEngagement'
export default function ClientPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params) as { slug: string }
  const { toast } = useToast()
  // console.log(slug)
  const [client, setClient] = useState(null)
  const [discordGrowthData, setDiscordGrowthData] = useState(null)
  const [discordEngagementData, setDiscordEngagementData] = useState(null)
  const [filteredGrowthData, setFilteredGrowthData] = useState([])
  const [filteredEngagementData, setFilteredEngagementData] = useState([])
  const [timeRange, setTimeRange] = useState('3 months')
  const [totalNewUsers, setTotalNewUsers] = useState(0)

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

  const fetchDiscordGrowthData = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/v1/client/${slug}/discord_growth`,
    )
    const data = await response.json()
    setDiscordGrowthData(data)
  }

  const fetchDiscordEngagementData = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/v1/client/${slug}/discord_engagement`,
    )
    const data = await response.json()
    setDiscordEngagementData(data)
  }

  useEffect(() => {
    fetchClientData()
    fetchDiscordGrowthData()
    fetchDiscordEngagementData()
  }, [slug])

  useEffect(() => {
    if (discordGrowthData) {
      const referenceDate = new Date()
      let daysToSubtract = 90
      if (timeRange === '30 days') {
        daysToSubtract = 30
      } else if (timeRange === '7 days') {
        daysToSubtract = 7
      }

      const startDate = new Date(referenceDate)
      startDate.setDate(startDate.getDate() - daysToSubtract)

      const newFilteredData = discordGrowthData.filter((item) => {
        const date = new Date(item.date)
        return date >= startDate
      })

      const totalUsers = newFilteredData
        .reduce((sum, item) => sum + item.total_joins, 0)
        .toLocaleString()

      setFilteredGrowthData(newFilteredData)
      setTotalNewUsers(totalUsers)
    }
  }, [discordGrowthData, timeRange])

  // TODO: Combine with the above
  useEffect(() => {
    if (discordEngagementData) {
      const referenceDate = new Date()
      let daysToSubtract = 90
      if (timeRange === '30 days') {
        daysToSubtract = 30
      } else if (timeRange === '7 days') {
        daysToSubtract = 7
      }

      const startDate = new Date(referenceDate)
      startDate.setDate(startDate.getDate() - daysToSubtract)

      const newFilteredData = discordEngagementData.filter((item) => {
        const date = new Date(item.date)
        return date >= startDate
      })

      setFilteredEngagementData(newFilteredData)
    }
  }, [discordEngagementData, timeRange])

  return (
    <div>
      <PageContainer>
        <ClientHeading client={client} />
        <div className="w-full pb-4">
          <div className="flex justify-end mb-8">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                className="w-[160px] rounded-lg"
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
          </div>
          <div className="grid grid-cols-2 gap-4 w-full my-4">
            <div className="w-full bg-white flex items-center justify-center rounded-xl">
              <ChartDiscordGrowth
                slug={slug}
                chartData={filteredGrowthData}
                chartTitle="Discord Growth"
                chartDescription={`New member activity in the last ${timeRange}.`}
                fetchDiscordGrowthData={fetchDiscordGrowthData}
                toast={toast}
                totalNewUsers={totalNewUsers}
              />
            </div>
            <div className="w-full bg-white flex items-center justify-center rounded-xl">
              <ChartDiscordEngagement
                slug={slug}
                chartData={filteredEngagementData}
                chartTitle="Discord Engagement"
                chartDescription={`Engagement in the last ${timeRange}.`}
                fetchDiscordEngagementData={fetchDiscordEngagementData}
                toast={toast}
              />
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  )
}
