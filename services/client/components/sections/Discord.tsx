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
    const filterAndCalculateData = (type, data, setFilteredData) => {
      const referenceDate = new Date()
      let daysToSubtract = 90
      if (timeRange === '30 days') {
        daysToSubtract = 30
      } else if (timeRange === '7 days') {
        daysToSubtract = 7
      }

      const startDate = new Date(referenceDate)
      startDate.setDate(startDate.getDate() - daysToSubtract)

      const filteredData = data.filter((item) => {
        const date = new Date(item.date)
        return date >= startDate
      })
      setFilteredData(filteredData)

      if (type === 'growth') {
        const totalNewUsers = filteredData
          .reduce((sum, item) => sum + (item.total_joins || 0), 0)
          .toLocaleString()
        setTotalNewUsers(totalNewUsers)
      } else if (type === 'engagement') {
        const totalVisitors = filteredData
          .reduce((sum, item) => sum + (item.visitors || 0), 0)
          .toLocaleString()
        setTotalVisitors(totalVisitors)

        const totalMessagesCount = filteredData
          .reduce((sum, item) => sum + (item.messages || 0), 0)
          .toLocaleString()
        setTotalMessages(totalMessagesCount)

        if (setAverageMessagesPerCommunicator) {
          const totalMessagesPerCommunicator = filteredData
            .reduce(
              (sum, item) => sum + (item.messages_per_communicator || 0),
              0,
            )
            .toLocaleString()

          const averageMessages =
            filteredData.length > 0
              ? (totalMessagesPerCommunicator / filteredData.length).toFixed(2)
              : '0.00'
          setAverageMessagesPerCommunicator(averageMessages)
        }
      }
    }

    if (discordGrowthData) {
      filterAndCalculateData('growth', discordGrowthData, setFilteredGrowthData)
    }

    if (discordEngagementData) {
      filterAndCalculateData(
        'engagement',
        discordEngagementData,
        setFilteredEngagementData,
      )
    }
  }, [discordGrowthData, discordEngagementData, timeRange])

  return (
    <div>
      <div className="bg-white rounded-xl p-4">
        <h3 className="mb-2">Discord</h3>
        <div className="grid gap-2 grid-cols-2 md:max-w-[450px]">
          <div className="font-bold flex flex-col gap-2">
            <p>New Users:</p>
            <p>Visitors:</p>
            <p>Messages:</p>
            <p>Avg. Messages per User:</p>
          </div>
          <div className="italic flex flex-col gap-2">
            <p>{totalNewUsers}</p>
            <p>{totalVisitors}</p>
            <p>{totalMessages}</p>
            <p>{averageMessagesPerCommunicator}</p>
          </div>
        </div>
      </div>
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
