'use client'

import ClientHeading from '@/components/ui/ClientHeading'
import PageContainer from '@/components/ui/PageContainer'
import { use, useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/core-ui/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/core-ui/tabs'

import SectionDiscord from '@/components/sections/Discord'
import SectionTelegram from '@/components/sections/Telegram'

export default function ClientPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params) as { slug: string }
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const [timeRange, setTimeRange] = useState('30 days')
  const [activeTab, setActiveTab] = useState('discord')

  const [client, setClient] = useState(null)
  const [discordGrowthData, setDiscordGrowthData] = useState(null)
  const [discordEngagementData, setDiscordEngagementData] = useState(null)
  const [telegramData, setTelegramData] = useState(null)

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

  const fetchTelegramData = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/v1/client/${slug}/telegram`,
    )
    const data = await response.json()
    setTelegramData(data)
  }

  useEffect(() => {
    fetchClientData()
    fetchDiscordGrowthData()
    fetchDiscordEngagementData()
    fetchTelegramData()
  }, [slug])

  useEffect(() => {
    const queryTab = searchParams.get('tab')
    if (queryTab) {
      setActiveTab(queryTab)
    }
  }, [searchParams])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    router.push(`${pathname}?tab=${value}`)
  }

  return (
    <div>
      <PageContainer>
        <ClientHeading client={client} />
        <div className="w-full pb-4 max-w-[1400px] mx-auto">
          <div className="flex justify-between mb-8">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full"
            >
              <div className="flex justify-between mb-8">
                <TabsList>
                  <TabsTrigger value="discord">Discord</TabsTrigger>
                  <TabsTrigger value="telegram">Telegram</TabsTrigger>
                </TabsList>
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

              <TabsContent value="discord">
                <SectionDiscord
                  slug={slug}
                  timeRange={timeRange}
                  toast={toast}
                  discordGrowthData={discordGrowthData}
                  discordEngagementData={discordEngagementData}
                  fetchDiscordGrowthData={fetchDiscordGrowthData}
                  fetchDiscordEngagementData={fetchDiscordEngagementData}
                />
              </TabsContent>
              <TabsContent value="telegram">
                <SectionTelegram
                  slug={slug}
                  timeRange={timeRange}
                  toast={toast}
                  telegramData={telegramData}
                  fetchTelegramData={fetchTelegramData}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </PageContainer>
    </div>
  )
}
