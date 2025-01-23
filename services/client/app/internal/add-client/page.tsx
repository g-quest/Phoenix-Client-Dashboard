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
import { ToastAction } from '@/components/core-ui/toast'
import PageContainer from '@/components/ui/PageContainer'

import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'

export default function AddClient() {
  const [clientName, setClientName] = useState('')
  const [profileUrl, setProfileUrl] = useState('')
  const { toast } = useToast()

  const handleSubmit = async (event) => {
    event.preventDefault()

    const clientData = {
      name: clientName,
      profileUrl: profileUrl || undefined,
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
      setProfileUrl('')
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
                <Label htmlFor="name">Client Name</Label>
                <Input
                  id="name"
                  placeholder="Name of the client"
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Client Logo URL (optional)</Label>
                <Input
                  id="name"
                  placeholder="URL of the client's logo"
                  type="url"
                  value={profileUrl}
                  onChange={(e) => setProfileUrl(e.target.value)}
                />
              </div>
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
