"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generatePdf } from "./pdf-generator"

interface PdfGeneratorDebugProps {
  courseData: any
  playerName?: string
}

export function PdfGeneratorDebug({ courseData, playerName = "Player" }: PdfGeneratorDebugProps) {
  const [jsonData, setJsonData] = useState(JSON.stringify(courseData, null, 2))
  const [error, setError] = useState<string | null>(null)

  const handleGeneratePdf = async () => {
    try {
      setError(null)
      const parsedData = JSON.parse(jsonData)
      await generatePdf(
        parsedData,
        { name: playerName },
        { name: "Keep Shooting Academy" },
        new Date().toLocaleDateString(),
      )
    } catch (err: any) {
      console.error("PDF Generation Error:", err)
      setError(err.message || "Failed to generate PDF")
    }
  }

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonData(e.target.value)
    setError(null)
  }

  return (
    <div className="w-full space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">PDF Generator Debug</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="json">
            <TabsList className="mb-4">
              <TabsTrigger value="json">JSON Data</TabsTrigger>
              <TabsTrigger value="structure">Structure</TabsTrigger>
            </TabsList>
            <TabsContent value="json" className="space-y-4">
              <Textarea
                value={jsonData}
                onChange={handleJsonChange}
                className="font-mono text-sm h-[300px] overflow-auto"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button onClick={handleGeneratePdf} className="w-full bg-unc-blue hover:bg-unc-blue/90">
                Generate PDF from JSON
              </Button>
            </TabsContent>
            <TabsContent value="structure">
              <div className="space-y-4">
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">Expected JSON Structure</h3>
                  <pre className="text-xs overflow-auto bg-gray-100 p-2 rounded">
                    {`{
  "title": "Program Title",
  "introduction": "Program introduction text",
  "issues": ["Issue 1", "Issue 2"],
  "days": [
    {
      "day": 1,
      "title": "Day 1 Title",
      "description": "Day 1 description",
      "drills": [
        {
          "name": "Drill Name",
          "description": "Drill description",
          "sets": "3",
          "reps": "10 makes per set",
          "focus": "Focus area",
          "explanation": "Personalized explanation",
          "video": {
            "title": "Video Title",
            "url": "https://example.com/video"
          }
        }
      ],
      "notes": "Day notes"
    }
  ]
}`}
                  </pre>
                </div>
                <Button onClick={handleGeneratePdf} className="w-full bg-unc-blue hover:bg-unc-blue/90">
                  Generate PDF from Current Data
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

