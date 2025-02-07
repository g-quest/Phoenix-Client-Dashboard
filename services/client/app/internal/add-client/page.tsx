'use client'

import { Button } from '@/components/core-ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/core-ui/card'
import { Input } from '@/components/core-ui/input'
import { Label } from '@/components/core-ui/label'
import PageContainer from '@/components/ui/PageContainer'

import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import { useClientContext } from '../../../context/ClientContext'

export default function AddClient() {
  const [clientName, setClientName] = useState('')
  const { toast } = useToast()
  const { refreshClients } = useClientContext()

  const handleSubmit = async (event) => {
    event.preventDefault()

    const clientData = {
      name: clientName,
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/v1/client/add`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(clientData),
        },
      )

      if (!response.ok) {
        const { detail } = await response.json()
        throw new Error(detail || 'Failed to add client')
      }

      toast({
        variant: 'success',
        title: 'Client Added!',
        description: `${clientName} has been added to the system.`,
      })
      setClientName('')

      refreshClients()
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred'
      console.error('Error:', errorMessage)
      toast({
        variant: 'destructive',
        title: 'Oops!',
        description: errorMessage,
      })
    }
  }

  return (
    <PageContainer>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>New Client</CardTitle>
          <CardDescription>Add a new client to the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name*</Label>
                <Input
                  id="name"
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                />
              </div>
              <p className="text-xs text-gray-500">
                NOTE: More fields can be added in the future.
              </p>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleSubmit}>Submit</Button>
        </CardFooter>
      </Card>
    </PageContainer>
  )
}
