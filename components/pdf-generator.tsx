"use client"

import jsPDF from "jspdf"
import { Button } from "@/components/ui/button"

interface PdfGeneratorProps {
  courseData: any
  playerName?: string
}

// Modern, minimalist color scheme with updated accent color
const colors = {
  black: [0, 0, 0],
  darkGray: [50, 50, 50],
  mediumGray: [100, 100, 100],
  lightGray: [200, 200, 200],
  white: [255, 255, 255],
  gold: [212, 175, 55], // Gold accent for special elements
  accent: [123, 175, 212], // #7BAFD4 - New accent color
  veryLightBlue: [240, 248, 255], // Very faint light blue for backgrounds
}

// Function to check if a new page is needed
function checkForNewPage(doc: jsPDF, y: number, requiredHeight: number): number {
  const pageHeight = doc.internal.pageSize.getHeight()
  if (y + requiredHeight > pageHeight - 20) {
    doc.addPage()
    return 30 // Reset y position with a top margin
  }
  return y
}

// Function to add a clickable link
function addLink(
  doc: jsPDF,
  text: string,
  url: string,
  x: number,
  y: number,
  maxWidth: number,
  fontSize: number,
  color: number[],
): number {
  doc.setFontSize(fontSize)
  doc.setFont("times", "normal") // Using Times New Roman for consistency
  doc.setTextColor(color[0], color[1], color[2])

  // Split text into lines that fit within maxWidth
  const lines = doc.splitTextToSize(text, maxWidth)

  // Calculate line height based on font size
  const lineHeight = fontSize * 0.5

  lines.forEach((line, index) => {
    const currentY = y + index * lineHeight
    doc.textWithLink(line, x, currentY, { url })
  })

  return y + lines.length * lineHeight // Return the new Y position
}

// Function to draw a horizontal line
function drawLine(doc: jsPDF, x1: number, y1: number, x2: number, y2: number, width = 0.5, color = colors.black) {
  doc.setDrawColor(color[0], color[1], color[2])
  doc.setLineWidth(width)
  doc.line(x1, y1, x2, y2)
}

// Find the addKSALogo function and replace it with this fixed version:

// Function to add the KSA logo
function addKSALogo(doc: jsPDF, x: number, y: number, width: number) {
  const logoUrl =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/372d12_c7210207e3e34496b9465a71c39cb290~mv2-CIhuCW3iZtBhJvAzuvcoACodJ9wCFr.png"

  // Create an image element to load the logo
  const img = new Image()
  img.crossOrigin = "Anonymous" // To avoid CORS issues

  // Set up a promise to handle the async image loading
  return new Promise<void>((resolve) => {
    img.onload = () => {
      try {
        // Calculate height based on aspect ratio
        const aspectRatio = img.height / img.width
        const height = width * aspectRatio

        // Add the image to the PDF
        doc.addImage(img, "PNG", x, y, width, height)
        resolve()
      } catch (error) {
        console.error("Error adding KSA logo to PDF:", error)
        // Continue without the logo
        resolve()
      }
    }

    img.onerror = () => {
      console.error("Error loading KSA logo")
      // Continue without the logo
      resolve()
    }

    // Start loading the image
    img.src = logoUrl
  })
}

// Improve the createDrillBox function for better aesthetics
function createDrillBox(doc: jsPDF, x: number, y: number, width: number, drill: any, playerName: string): number {
  const padding = 12 // Increased padding for better aesthetics
  const innerWidth = width - padding * 2

  // Start with initial y position for content
  let currentY = y + padding
  let contentHeight = 0

  // Calculate content height first without drawing
  // Drill name
  contentHeight += 10 // Name height - increased
  contentHeight += 10 // Line + spacing - increased

  // Focus area
  contentHeight += 8 // Increased

  // Sets/Reps
  contentHeight += 8 // Increased

  // Time
  contentHeight += 12 // Increased

  // Video link (if it exists)
  if (drill.video && drill.video.url) {
    contentHeight += 8 // Video label - increased

    // Ensure the URL is properly formatted
    let videoUrl = drill.video.url
    if (!videoUrl.startsWith("http://") && !videoUrl.startsWith("https://")) {
      videoUrl = "https://" + videoUrl.replace(/^(www\.)/, "")
    }

    // Calculate link text height
    const linkText = drill.video.title || "Watch drill demonstration"
    const linkLines = doc.splitTextToSize(linkText, innerWidth)
    contentHeight += linkLines.length * 9 * 0.5 + 6 // Increased spacing
  }

  // Addressing struggle section
  if (drill.explanation) {
    contentHeight += 8 // Spacing - increased
    contentHeight += 8 // Label - increased

    // Calculate explanation text height
    const explanationLines = doc.splitTextToSize(drill.explanation, innerWidth)
    contentHeight += explanationLines.length * 6 // Increased line height
  }

  // Add final padding
  contentHeight += padding

  // Now draw the box with the calculated height
  // Box background
  doc.setFillColor(colors.white[0], colors.white[1], colors.white[2])
  doc.roundedRect(x, y, width, contentHeight, 4, 4, "F") // Increased corner radius

  // Box border
  doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2], 0.3) // Using accent color with transparency
  doc.setLineWidth(0.5)
  doc.roundedRect(x, y, width, contentHeight, 4, 4, "S") // Increased corner radius

  // Reset currentY to start drawing content
  currentY = y + padding

  // Drill name
  doc.setFontSize(16) // Increased font size
  doc.setFont("times", "bold") // Times New Roman bold
  doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]) // Using accent color instead of black
  doc.text(drill.name, x + padding, currentY)
  currentY += 10 // Increased spacing

  // Line under name
  drawLine(doc, x + padding, currentY, x + width - padding, currentY, 0.75, colors.accent) // Using accent color
  currentY += 10 // Increased spacing

  // Focus area
  doc.setFontSize(11) // Increased font size
  doc.setFont("times", "bold") // Times New Roman bold
  doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]) // Changed to black
  doc.text("FOCUS:", x + padding, currentY)

  doc.setFont("times", "normal") // Times New Roman normal
  const focusText = drill.focus || "General improvement"
  const focusLines = doc.splitTextToSize(focusText, innerWidth - 40) // Increased offset
  doc.text(focusLines, x + padding + 40, currentY) // Increased offset
  currentY += 8 // Increased spacing

  // Sets/Reps
  doc.setFont("times", "bold") // Times New Roman bold
  doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]) // Changed to black
  doc.text("SETS/REPS:", x + padding, currentY)

  doc.setFont("times", "normal") // Times New Roman normal
  const setsRepsText = !drill.sets || !drill.reps ? "As Many As Possible" : `${drill.sets}, ${drill.reps}`
  doc.text(setsRepsText, x + padding + 40, currentY) // Increased offset
  currentY += 8 // Increased spacing

  // Time (estimated)
  doc.setFont("times", "bold") // Times New Roman bold
  doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]) // Changed to black
  doc.text("TIME:", x + padding, currentY)

  doc.setFont("times", "normal") // Times New Roman normal
  doc.text("10-15 minutes", x + padding + 40, currentY) // Increased offset
  currentY += 12 // Increased spacing

  // Video link (if it exists)
  if (drill.video && drill.video.url) {
    // Video label
    doc.setFont("times", "bold") // Times New Roman bold
    doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]) // Changed to black
    doc.text("VIDEO:", x + padding, currentY)
    currentY += 8 // Increased spacing

    // Ensure the URL is properly formatted
    let videoUrl = drill.video.url
    if (!videoUrl.startsWith("http://") && !videoUrl.startsWith("https://")) {
      videoUrl = "https://" + videoUrl.replace(/^(www\.)/, "")
    }

    // Add clickable link
    const linkText = drill.video.title || "Watch drill demonstration"
    currentY = addLink(doc, linkText, videoUrl, x + padding, currentY, innerWidth, 10, colors.accent) + 6 // Using accent color
  }

  // Addressing struggle section
  if (drill.explanation) {
    currentY += 8 // Increased spacing
    doc.setFontSize(11) // Increased font size
    doc.setFont("times", "bold") // Times New Roman bold
    doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]) // Changed to black
    doc.text("ADDRESSING YOUR STRUGGLE:", x + padding, currentY)
    currentY += 8 // Increased spacing

    doc.setFont("times", "normal") // Times New Roman normal
    doc.setTextColor(colors.darkGray[0], colors.darkGray[1], colors.darkGray[2])
    const explanationLines = doc.splitTextToSize(drill.explanation, innerWidth)
    explanationLines.forEach((line) => {
      doc.text(line, x + padding, currentY)
      currentY += 6 // Increased line height
    })
  }

  return contentHeight
}

// Update the generatePdf function to improve cover page aesthetics
export async function generatePdf(
  courseData: any,
  playerInfo: { name: string },
  academyInfo: { name: string },
  date: string,
) {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    const contentWidth = pageWidth - margin * 2

    // ===== COVER PAGE =====
    // Add a subtle background color
    doc.setFillColor(252, 252, 252) // Very light gray
    doc.rect(0, 0, pageWidth, pageHeight, "F")

    // Start with a clean y position
    let y = 40 // Start higher on the page

    // Find the cover page section and change the text colors from accent to black
    // Keep "keep shooting" in accent color as it's the brand name

    // Change "14 DAY TRANSFORMATION" to black
    doc.setFontSize(18) // Increased font size
    doc.setFont("times", "bold") // Times New Roman bold
    doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]) // Changed to black
    doc.text("14 DAY TRANSFORMATION", margin, y) // Positioned at the top

    // Keep the horizontal line in accent color
    drawLine(doc, margin, y + 5, margin + 90, y + 5, 1.5, colors.accent) // Using accent color

    // Move down for the next element with adequate spacing
    y += 60 // Increased spacing to avoid overlap

    // Keep "keep shooting" in accent color as it's the brand name
    doc.setFontSize(42) // Increased font size
    doc.setFont("times", "italic") // Using Times italic as a substitute for Pushkin High
    doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]) // Using accent color
    doc.text("keep shooting", margin, y)

    y += 30 // Adjusted spacing between elements

    // Get player's first name or full name
    const playerName = playerInfo.name || "Player"
    // Use player's name instead of "YOUR"

    // Change to black and use player's name
    doc.setFontSize(32) // Slightly reduced font size to prevent overlap
    doc.setFont("times", "bold") // Times New Roman bold
    doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]) // Changed to black

    // Split the title into multiple lines with proper spacing
    // Replace "YOUR" with the player's name
    const titleLines = [`${playerName.toUpperCase()}'S`, "CUSTOM ELITE", "SHOOTING PROGRAM"]

    titleLines.forEach((line) => {
      doc.text(line, margin, y)
      y += 25 // Reduced spacing between lines to prevent overlap
    })

    // Add the KSA logo at middle right - repositioned to avoid overlap
    const logoX = pageWidth - margin - 40
    const logoY = pageHeight / 2 - 40 // Centered vertically
    const logoWidth = 60 // Slightly reduced size

    // Add the KSA logo from the provided URL
    try {
      await addKSALogo(doc, logoX, logoY, logoWidth)
    } catch (error) {
      console.error("Error adding logo to cover page:", error)
    }

    // Change "DESIGNED FOR:" to black
    y = pageHeight - 40 // Positioned closer to bottom
    doc.setFontSize(16) // Increased font size
    doc.setFont("times", "bold") // Times New Roman bold
    doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]) // Changed to black
    doc.text("DESIGNED FOR:", margin, y)

    // Player name
    doc.setFont("times", "normal") // Times New Roman normal
    doc.text(playerName, margin + 55, y) // Adjusted offset

    // ===== INTRODUCTION PAGE =====
    doc.addPage()
    y = 30

    // Course Title
    doc.setFontSize(24)
    doc.setFont("times", "bold") // Times New Roman bold
    doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]) // Using accent color
    y = checkForNewPage(doc, y, 15)
    doc.text(courseData.title, margin, y)
    y += 15

    // Introduction Text
    doc.setFontSize(12)
    doc.setFont("times", "normal") // Times New Roman normal (simulating Be Vietnam)
    doc.setTextColor(colors.darkGray[0], colors.darkGray[1], colors.darkGray[2])
    const introductionLines = doc.splitTextToSize(courseData.introduction, contentWidth)
    introductionLines.forEach((line) => {
      y = checkForNewPage(doc, y, 6)
      doc.text(line, margin, y)
      y += 6
    })
    y += 10

    // Issues Addressed
    doc.setFontSize(14)
    doc.setFont("times", "bold") // Times New Roman bold
    doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]) // Changed to black
    y = checkForNewPage(doc, y, 8)
    doc.text("Issues Addressed:", margin, y)
    y += 8

    doc.setFontSize(12)
    doc.setFont("times", "normal") // Times New Roman normal
    doc.setTextColor(colors.darkGray[0], colors.darkGray[1], colors.darkGray[2])
    courseData.issues.forEach((issue) => {
      y = checkForNewPage(doc, y, 6)
      doc.text("- " + issue, margin, y)
      y += 6
    })

    // ===== DAILY TRAINING PAGES =====
    for (const day of courseData.days) {
      doc.addPage()

      // Add a subtle header background - changed to very light blue
      doc.setFillColor(colors.veryLightBlue[0], colors.veryLightBlue[1], colors.veryLightBlue[2]) // Using very light blue
      doc.rect(0, 0, pageWidth, 50, "F")

      y = 30

      // Day Title
      doc.setFontSize(22) // Increased font size
      doc.setFont("times", "bold") // Times New Roman bold
      doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]) // Using accent color
      doc.text(day.title, margin, y)
      y += 14 // Increased spacing

      // Day Description
      doc.setFontSize(12)
      doc.setFont("times", "italic") // Times New Roman italic
      doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]) // Changed to black
      const descriptionLines = doc.splitTextToSize(day.description, contentWidth)
      descriptionLines.forEach((line) => {
        doc.text(line, margin, y)
        y += 6
      })
      y += 12 // Increased spacing

      // Add a small KSA logo in the top right corner of each day page
      try {
        await addKSALogo(doc, pageWidth - margin - 10, 25, 20)
      } catch (error) {
        console.error("Error adding logo to day page:", error)
      }

      // Drills for the Day
      for (const drill of day.drills) {
        const drillBoxWidth = contentWidth

        // Check if we need a new page for this drill box
        // First, calculate the height of the drill box
        const tempDoc = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        })
        const estimatedHeight = createDrillBox(tempDoc, 0, 0, drillBoxWidth, drill, playerInfo.name)

        // Check if we need a new page - leave extra space for notes
        if (y + estimatedHeight + 30 > pageHeight - 30) {
          doc.addPage()

          // Add the subtle header background on the new page - changed to very light blue
          doc.setFillColor(colors.veryLightBlue[0], colors.veryLightBlue[1], colors.veryLightBlue[2]) // Using very light blue
          doc.rect(0, 0, pageWidth, 50, "F")

          // Add day title on the continued page
          doc.setFontSize(16)
          doc.setFont("times", "bold")
          doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]) // Using accent color
          doc.text(`${day.title} (continued)`, margin, 30)

          // Add a small KSA logo in the top right corner
          try {
            await addKSALogo(doc, pageWidth - margin - 10, 25, 20)
          } catch (error) {
            console.error("Error adding logo to continued page:", error)
          }

          y = 50 // Start a bit lower to account for the header
        }

        // Now create the actual drill box
        const drillBoxHeight = createDrillBox(doc, margin, y, drillBoxWidth, drill, playerInfo.name)
        y += drillBoxHeight + 15 // Increased spacing between drill boxes
      }

      // Day Notes
      // Check if we need a new page for notes
      const notesLines = doc.splitTextToSize(day.notes, contentWidth)
      const notesHeight = notesLines.length * 6 + 20 // Added extra space

      if (y + notesHeight > pageHeight - 30) {
        doc.addPage()

        // Add the subtle header background on the new page - changed to very light blue
        doc.setFillColor(colors.veryLightBlue[0], colors.veryLightBlue[1], colors.veryLightBlue[2]) // Using very light blue
        doc.rect(0, 0, pageWidth, 50, "F")

        // Add day title on the continued page
        doc.setFontSize(16)
        doc.setFont("times", "bold")
        doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]) // Using accent color
        doc.text(`${day.title} (continued)`, margin, 30)

        // Add a small KSA logo in the top right corner
        try {
          await addKSALogo(doc, pageWidth - margin - 10, 25, 20)
        } catch (error) {
          console.error("Error adding logo to notes page:", error)
        }

        y = 50 // Start a bit lower to account for the header
      }

      // Add a notes section with a light background - changed to very light blue
      doc.setFillColor(colors.veryLightBlue[0], colors.veryLightBlue[1], colors.veryLightBlue[2]) // Using very light blue
      doc.roundedRect(margin, y, contentWidth, notesHeight, 4, 4, "F")

      y += 10 // Add space before notes title

      // Notes title
      doc.setFontSize(14)
      doc.setFont("times", "bold")
      doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]) // Changed to black
      doc.text("COACH'S NOTES:", margin + 5, y)
      y += 10

      // Notes content
      doc.setFontSize(12)
      doc.setFont("times", "normal") // Times New Roman normal
      doc.setTextColor(colors.darkGray[0], colors.darkGray[1], colors.darkGray[2])

      notesLines.forEach((line) => {
        doc.text(line, margin + 5, y)
        y += 6
      })
    }

    // Create a blob from the PDF
    const pdfBlob = doc.output("blob")
    const blobUrl = URL.createObjectURL(pdfBlob)

    // Create a temporary anchor element for downloading with custom filename
    const a = document.createElement("a")
    a.href = blobUrl
    a.download = `${playerInfo.name} Elite Shooting Course.pdf`

    // Trigger the download
    document.body.appendChild(a)
    a.click()

    // Clean up
    document.body.removeChild(a)
    URL.revokeObjectURL(blobUrl)
  } catch (error) {
    console.error("Error generating PDF:", error)
    throw error
  }
}

export function PdfGenerator({ courseData, playerName = "Player" }: PdfGeneratorProps) {
  const handleGeneratePdf = async () => {
    try {
      // Show a message to the user that the PDF is being generated
      console.log("Generating PDF, please wait...")

      await generatePdf(
        courseData,
        { name: playerName },
        { name: "Keep Shooting Academy" },
        new Date().toLocaleDateString(),
      )
    } catch (err) {
      console.error("PDF Generation Error:", err)
      // Show a more descriptive error message
      alert("There was an error generating the PDF. Please check if pop-ups are allowed in your browser and try again.")
    }
  }

  return (
    <Button onClick={handleGeneratePdf} className="w-full bg-ksa-blue hover:bg-ksa-blue/90 text-white btn-animated">
      Download PDF Training Plan
    </Button>
  )
}

