import { useEffect, useState } from 'react'

import { CloudDownload, Loader2 } from 'lucide-react'

import ChartTelegramUsers from '@/components/charts/TelegramUsers'
import ChartTelegramMessages from '@/components/charts/TelegramMessages'
import { Button } from '../core-ui/button'

export default function SectionTelegram(props) {
  const {
    slug,
    clientName,
    timeRange,
    toast,
    telegramData,
    fetchTelegramData,
  } = props

  const [filteredTelegramData, setFilteredTelegramData] = useState([])
  const [totalNewUsers, setTotalNewUsers] = useState(0)
  const [totalActiveUsers, setTotalActiveUsers] = useState(0)
  const [totalLeftUsers, setTotalLeftUsers] = useState(0)
  const [totalMessages, setTotalMessages] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const filterAndCalculateData = () => {
      if (!telegramData) {
        setFilteredTelegramData([])
        setTotalNewUsers(0)
        setTotalActiveUsers(0)
        setTotalLeftUsers(0)
        setTotalMessages(0)
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

      const filteredData = telegramData
        .filter((item) => {
          const date = new Date(item.date)
          return date >= startDate
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      setFilteredTelegramData(filteredData)

      const totalNewUsers = filteredData
        .reduce((sum, item) => sum + (item.new_users || 0), 0)
        .toLocaleString()
      setTotalNewUsers(totalNewUsers)

      const totalActiveUsers = filteredData
        .reduce((sum, item) => sum + (item.active_users || 0), 0)
        .toLocaleString()
      setTotalActiveUsers(totalActiveUsers)

      const totalLeftUsers = filteredData
        .reduce((sum, item) => sum + (item.left_users || 0), 0)
        .toLocaleString()
      setTotalLeftUsers(totalLeftUsers)

      const totalMessages = filteredData
        .reduce((sum, item) => sum + (item.messages || 0), 0)
        .toLocaleString()
      setTotalMessages(totalMessages)
    }

    filterAndCalculateData()
  }, [telegramData, timeRange])

  const refreshTelegramData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/v1/telegram/add/?client_slug=${slug}&days_back=90`,
        {
          method: 'POST',
        },
      )
      if (!response.ok) {
        throw new Error('Upload failed')
      }

      fetchTelegramData()
      toast({
        title: 'Telegram Data Loaded',
        description: `Latest Telegram data for ${clientName} has been loaded.`,
        variant: 'success',
      })
    } catch (error) {
      console.error('Error fetching telegram data:', error)
      toast({
        title: 'Error',
        description: `Error fetching Telegram data for ${clientName}`,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="bg-white rounded-xl p-4">
        <div className="flex justify-between">
          <h3 className="mb-2">Telegram</h3>
          <Button
            className="w-24"
            onClick={refreshTelegramData}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <CloudDownload className="w-4 h-4" /> Update
              </>
            )}
          </Button>
        </div>
        <div className="grid gap-2 grid-cols-2 md:max-w-[300px]">
          <div className="font-bold flex flex-col gap-2">
            <p>New Users:</p>
            <p>Active Users:</p>
            <p>Left Users:</p>
            <p>Messages:</p>
          </div>
          <div className="italic flex flex-col gap-2">
            <p>{totalNewUsers}</p>
            <p>{totalActiveUsers}</p>
            <p>{totalLeftUsers}</p>
            <p>{totalMessages}</p>
          </div>
        </div>
      </div>
      <div className="w-full bg-white flex items-center justify-center rounded-xl my-4">
        <ChartTelegramUsers
          slug={slug}
          chartData={filteredTelegramData}
          chartTitle="Telegram Users"
          chartDescription={`Users in the last ${timeRange}.`}
        />
      </div>
      <div className="w-full bg-white flex items-center justify-center rounded-xl">
        <ChartTelegramMessages
          slug={slug}
          chartData={filteredTelegramData}
          chartTitle="Messages"
          chartDescription={`Messages in the last ${timeRange}.`}
        />
      </div>
    </div>
  )
}
