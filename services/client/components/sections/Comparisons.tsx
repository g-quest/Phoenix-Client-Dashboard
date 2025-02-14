import { useEffect, useState } from 'react'

import ChartCrossNewUsers from '../charts/CrossNewUsers'
import ChartCrossMessages from '../charts/CrossMessages'

export default function SectionComparisons(props) {
  const {
    slug,
    timeRange,
    telegramData,
    discordGrowthData,
    discordEngagementData,
  } = props

  const [filteredTelegramData, setFilteredTelegramData] = useState([])
  const [filteredDiscordGrowthData, setFilteredDiscordGrowthData] = useState([])
  const [filteredDiscordEngagementData, setFilteredDiscordEngagementData] =
    useState([])

  useEffect(() => {
    const filterAndCalculateData = (type, data) => {
      if (!data) {
        if (type === 'telegram') {
          setFilteredTelegramData([])
        } else if (type === 'discordGrowth') {
          setFilteredDiscordGrowthData([])
        } else if (type === 'discordEngagement') {
          setFilteredDiscordEngagementData([])
        }
        return
      }

      const referenceDate = new Date()
      let daysToSubtract = 90
      if (timeRange === '30 days') {
        daysToSubtract = 30
      } else if (timeRange === '7 days') {
        daysToSubtract = 7
      }

      const startDate = new Date(referenceDate)
      startDate.setDate(startDate.getDate() - daysToSubtract)

      const filteredData = data
        .filter((item) => {
          const date = new Date(item.date)
          return date >= startDate
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      if (type === 'telegram') {
        setFilteredTelegramData(filteredData)
      } else if (type === 'discordGrowth') {
        setFilteredDiscordGrowthData(filteredData)
      } else if (type === 'discordEngagement') {
        setFilteredDiscordEngagementData(filteredData)
      }
    }

    filterAndCalculateData('telegram', telegramData)
    filterAndCalculateData('discordGrowth', discordGrowthData)
    filterAndCalculateData('discordEngagement', discordEngagementData)
  }, [timeRange, telegramData, discordGrowthData, discordEngagementData])

  return (
    <div>
      <div className="bg-white rounded-xl p-4">
        <h3>Cross Channel Comparisons</h3>
      </div>
      <div className="w-full bg-white flex items-center justify-center rounded-xl my-4">
        <ChartCrossNewUsers
          slug={slug}
          telegramData={filteredTelegramData}
          discordGrowthData={filteredDiscordGrowthData}
          chartTitle="Discord vs Telegram New Users"
          chartDescription={`New users in the last ${timeRange}.`}
        />
      </div>
      <div className="w-full bg-white flex items-center justify-center rounded-xl my-4">
        <ChartCrossMessages
          slug={slug}
          telegramData={filteredTelegramData}
          discordEngagementData={filteredDiscordEngagementData}
          chartTitle="Discord vs Telegram Messages"
          chartDescription={`Messages in the last ${timeRange}.`}
        />
      </div>
    </div>
  )
}
