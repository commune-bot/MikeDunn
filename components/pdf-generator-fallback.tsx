"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface PdfGeneratorFallbackProps {
  courseData: any
  playerName?: string
}

export function PdfGeneratorFallback({ courseData, playerName = "Player" }: PdfGeneratorFallbackProps) {
  const handleDownloadJson = () => {
    // Create a blob with the JSON data
    const blob = new Blob([JSON.stringify(courseData, null, 2)], { type: "application/json" })

    // Create a URL for the blob
    const url = URL.createObjectURL(blob)

    // Create a temporary anchor element
    const a = document.createElement("a")
    a.href = url
    a.download = `${courseData.title || "basketball-training-program"}.json`

    // Trigger the download
    document.body.appendChild(a)
    a.click()

    // Clean up
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownloadJson}
      className="text-unc-blue border-unc-blue/30 hover:bg-unc-blue/10"
    >
      <Download className="h-4 w-4 mr-2" />
      Download JSON Data
    </Button>
  )
}
