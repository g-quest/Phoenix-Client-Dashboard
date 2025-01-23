'use client'

import ClientHeading from '@/components/ui/ClientHeading'
import PageContainer from '@/components/ui/PageContainer'
import { use, useEffect, useState } from 'react'

export default function ClientPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params) as { slug: string }
  // console.log(slug)
  const [client, setClient] = useState(null)

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
  }, [])

  return (
    <div>
      <PageContainer>
        <ClientHeading client={client} />
        <p>{client?.name}</p>
      </PageContainer>
    </div>
  )
}
