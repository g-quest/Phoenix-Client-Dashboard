import ChartDiscordGrowth from '@/components/charts/DiscordGrowth'
import ChartDiscordEngagement from '@/components/charts/DiscordEngagement'
import ChartDiscordMessages from '@/components/charts/DiscordMessages'
import { useEffect, useState } from 'react'

export default function SectionDiscord(props) {
  const {
    slug,
    timeRange,
    toast,
    discordGrowthData,
    discordEngagementData,
    fetchDiscordGrowthData,
    fetchDiscordEngagementData,
  } = props

  const [filteredGrowthData, setFilteredGrowthData] = useState([])
  const [filteredEngagementData, setFilteredEngagementData] = useState([])

  const [totalNewUsers, setTotalNewUsers] = useState(0)
  const [totalVisitors, setTotalVisitors] = useState(0)
  const [totalMessages, setTotalMessages] = useState(0)
  const [averageMessagesPerCommunicator, setAverageMessagesPerCommunicator] =
    useState('0.00')

  useEffect(() => {
    const filterAndCalculateData = (
      data,
      setFilteredData,
      setTotal,
      setAverage,
    ) => {
      const referenceDate = new Date()
      let daysToSubtract = 90
      if (timeRange === '30 days') {
        daysToSubtract = 30
      } else if (timeRange === '7 days') {
        daysToSubtract = 7
      }

      const startDate = new Date(referenceDate)
      startDate.setDate(startDate.getDate() - daysToSubtract)

      const newFilteredData = data.filter((item) => {
        const date = new Date(item.date)
        return date >= startDate
      })

      const total = newFilteredData
        .reduce(
          (sum, item) => sum + (item.total_joins || item.visitors || 0),
          0,
        )
        .toLocaleString()

      setFilteredData(newFilteredData)
      setTotal(total)

      if (setAverage) {
        const totalMessagesPerCommunicator = newFilteredData
          .reduce((sum, item) => sum + (item.messages_per_communicator || 0), 0)
          .toLocaleString()
        const averageMessages =
          newFilteredData.length > 0
            ? (totalMessagesPerCommunicator / newFilteredData.length).toFixed(2)
            : '0.00'
        setAverage(averageMessages)
      }
    }

    if (discordGrowthData) {
      filterAndCalculateData(
        discordGrowthData,
        setFilteredGrowthData,
        setTotalNewUsers,
        null,
      )
    }

    if (discordEngagementData) {
      filterAndCalculateData(
        discordEngagementData,
        setFilteredEngagementData,
        setTotalVisitors,
        setAverageMessagesPerCommunicator,
      )
      const totalMessagesCount = discordEngagementData
        .reduce((sum, item) => sum + (item.messages || 0), 0)
        .toLocaleString()
      setTotalMessages(totalMessagesCount)
    }
  }, [discordGrowthData, discordEngagementData, timeRange])

  return (
    <div>
      <h3 className="pl-2">Discord</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full my-4">
        <div className="w-full bg-white flex items-center justify-center rounded-xl">
          <ChartDiscordGrowth
            slug={slug}
            chartData={filteredGrowthData}
            chartTitle="Growth"
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
            chartTitle="Engagement"
            chartDescription={`Engagement in the last ${timeRange}.`}
            fetchDiscordEngagementData={fetchDiscordEngagementData}
            toast={toast}
            totalVisitors={totalVisitors}
          />
        </div>
      </div>
      <div className="w-full bg-white flex items-center justify-center rounded-xl">
        <ChartDiscordMessages
          slug={slug}
          chartData={filteredEngagementData}
          chartTitle="Messages"
          chartDescription={`Messages in the last ${timeRange}.`}
          fetchDiscordMessagesData={fetchDiscordEngagementData}
          toast={toast}
          totalMessages={totalMessages}
          averageMessagesPerCommunicator={averageMessagesPerCommunicator}
        />
      </div>
    </div>
  )
}
