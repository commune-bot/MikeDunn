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

// Enhanced function to generate drill-specific messages
function generateDrillSpecificMessage(drill: any, playerName: string, dayNumber: number): string {
  // Create a mapping of drill names to specific messages about what they help with
  const drillSpecificMessages = {
    // Form shooting drills
    "Form Shooting": `This fundamental drill builds the foundation of your shot mechanics, ${playerName}. Focus on keeping your elbow under the ball and follow through with your fingers pointing to the target. This creates muscle memory for proper form that will transfer to all your shots.`,
    "1 Hand Shooting": `By removing your guide hand, ${playerName}, this drill isolates your shooting hand mechanics. Pay attention to the feeling of the ball rolling off your fingertips with proper backspin. This directly addresses inconsistencies in your release point.`,
    "Guide Hand Positioning": `Your guide hand should support without interfering, ${playerName}. This drill helps eliminate the thumb flick or push that's affecting your accuracy. Position your guide hand on the side of the ball with fingers pointing up, never toward the basket.`,

    // Balance drills
    "Wide Stance Shots": `A stable base is crucial for shooting consistency, ${playerName}. This drill helps you feel proper weight distribution and balance throughout your shot. Notice how a wider stance creates stability but sacrifices some power - finding your optimal width is key.`,
    "1 Foot Drops": `Single-leg balance training develops proprioception and core stability, ${playerName}. This translates directly to better balance when shooting off movement or with defenders nearby. Focus on maintaining your shooting form despite the balance challenge.`,
    "1 2 Step With Drop": `This footwork pattern mimics game situations, ${playerName}. By mastering this specific stepping sequence, you'll develop consistent mechanics when catching and shooting in games. The drop creates rhythm and power transfer from legs to upper body.`,

    // Arc and trajectory drills
    "Flat Side Backboard Shots": `Your shot arc has been too flat, ${playerName}. This drill forces you to create proper trajectory by using the backboard as feedback. A higher arc increases your shooting percentage by creating a softer touch and better angle into the basket.`,
    "Skinny Side Backboard Shots": `This precision drill develops both arc and accuracy, ${playerName}. The narrow target on the backboard requires perfect trajectory and touch. This addresses your tendency to shoot with inconsistent arc heights.`,
    "Ball Raises": `The starting position of your shot affects everything that follows, ${playerName}. This drill eliminates unnecessary dipping motions and establishes a consistent shot pocket. Focus on bringing the ball up in one fluid motion without dropping it first.`,

    // Rhythm drills
    "Ball Does Not Stop": `Continuous motion creates shooting rhythm, ${playerName}. This drill eliminates the hitch in your shot by keeping the ball moving relative to the ground. Notice how this creates a smoother release and more consistent power generation.`,
    "1 2 Through": `This drill connects your lower and upper body timing, ${playerName}. The 1-2 step creates rhythm while the "through" motion ensures continuous upward momentum. This addresses your tendency to pause during your shooting motion.`,
    "Slow Motion 1-2-Thru @ Hoop": `Slowing down helps you feel each component of your shot, ${playerName}. This deliberate practice builds awareness of proper sequencing. Focus on the connection between your footwork and hand position throughout the motion.`,

    // Elbow alignment drills
    "Stabilize The Shooting Elbow": `Elbow alignment is crucial for shot consistency, ${playerName}. This drill helps you keep your elbow under the ball rather than flaring out. Notice how proper alignment creates a straight line from elbow to fingertips toward the basket.`,
    "3 Exercises to Stabilize Elbow": `These progressive exercises address your elbow positioning, ${playerName}. By working backward from the finish position, you'll develop proper alignment throughout your shot. This directly improves your shooting accuracy and consistency.`,
    "Elbow Push Out With Stop": `This drill isolates proper elbow mechanics during your shot, ${playerName}. The push out motion with a deliberate stop helps you feel the correct positioning. This addresses your tendency to let your elbow drift during your shooting motion.`,

    // Game transfer drills
    "Catch and Shoot With Pass Fake": `Game situations require quick decisions, ${playerName}. This drill develops your ability to maintain shooting mechanics while adding decision-making elements. Focus on keeping your form consistent despite the added complexity.`,
    "Jump Turns With Pass": `Creating separation is crucial in games, ${playerName}. This drill helps you maintain balance and alignment when turning to receive passes. This directly translates to catch-and-shoot opportunities in game situations.`,
    "Momentum Shots": `Game shots rarely happen from a static position, ${playerName}. This drill teaches you to harness forward momentum while maintaining shooting mechanics. Focus on converting your forward energy into upward energy through your legs.`,

    // Advanced movement drills
    "Sprint to Corner": `This drill simulates game-speed movement to shooting spots, ${playerName}. Focus on quickly transitioning from running to shooting stance while maintaining balance. This addresses your struggle to shoot consistently after movement.`,
    "Lateral Movement into DDS": `Defenders often force lateral movement before shots, ${playerName}. This drill helps you maintain mechanics after sideways movement. Focus on quickly squaring your shoulders and hips to the basket after the lateral move.`,
    "90 Degree Elevator Drops": `This complex movement pattern challenges your balance and coordination, ${playerName}. By mastering this drill, you'll develop the body control needed for difficult game shots. Focus on maintaining vertical alignment despite the rotational movement.`,

    // Free throw specific
    "Free Throws": `Free throws are the foundation of shooting confidence, ${playerName}. This drill builds a consistent routine and mental approach. Focus on repeating the exact same process every time - from stance to follow-through.`,

    // Default messages for drills not specifically mapped
    default_form: `This form-focused drill helps establish proper mechanics, ${playerName}. Pay attention to the details of your shooting motion and build consistency through repetition. Quality over quantity is essential here.`,
    default_balance: `Balance is the foundation of consistent shooting, ${playerName}. This drill challenges your stability to improve your base. Notice how proper weight distribution affects the consistency of your release.`,
    default_game: `Game-speed application is crucial for skill transfer, ${playerName}. This drill simulates game situations to test your mechanics under pressure. Focus on maintaining your form despite the added complexity.`,
    default_rhythm: `Shooting rhythm creates consistency, ${playerName}. This drill develops the timing between your lower and upper body. Focus on creating a smooth, continuous motion without hitches or pauses.`,
    default_advanced: `This advanced drill challenges your mechanics under complex conditions, ${playerName}. By mastering this movement pattern, you'll be prepared for difficult game situations. Focus on maintaining your core shooting principles despite the challenge.`,
  }

  // Coaching wisdom to add variety (will be appended to some messages)
  const coachingWisdom = [
    "Remember, mastery comes through deliberate practice.",
    "The mind leads the body - visualize success before each attempt.",
    "Small improvements compound over time.",
    "Be present with each rep. It's not just about doing, it's about being mindful while doing.",
    "The shot begins the moment you begin to move. Your preparation is everything.",
    "Sometimes the quickest way to get where you want to go is slowly. Master the fundamentals first.",
    "Shooting IS movement. The better you get at moving, the better you'll get at shooting.",
    "Progress in anything is not always linear. Trust the process.",
    "The ball doesn't stop relative to the ground. Keep that upward momentum flowing through your shot.",
    "Your body follows where your eyes lead. Focus on the target.",
    "Consistency comes from repeatable mechanics.",
  ]

  // Get the drill name
  const drillName = drill.name

  // Look up the specific message for this drill
  let message = drillSpecificMessages[drillName]

  // If no specific message exists, categorize the drill and use a default message
  if (!message) {
    const drillNameLower = drillName.toLowerCase()

    if (drillNameLower.includes("form") || drillNameLower.includes("hand") || drillNameLower.includes("guide")) {
      message = drillSpecificMessages.default_form
    } else if (
      drillNameLower.includes("balance") ||
      drillNameLower.includes("stance") ||
      drillNameLower.includes("foot")
    ) {
      message = drillSpecificMessages.default_balance
    } else if (drillNameLower.includes("game") || drillNameLower.includes("catch") || drillNameLower.includes("fake")) {
      message = drillSpecificMessages.default_game
    } else if (
      drillNameLower.includes("rhythm") ||
      drillNameLower.includes("flow") ||
      drillNameLower.includes("through")
    ) {
      message = drillSpecificMessages.default_rhythm
    } else {
      message = drillSpecificMessages.default_advanced
    }
  }

  // Add coaching wisdom to some messages based on day number (for variety)
  if (dayNumber % 3 === 0) {
    const wisdomIndex = (dayNumber + drillName.length) % coachingWisdom.length
    message += " " + coachingWisdom[wisdomIndex]
  }

  return message
}

// Improved createDrillBox function with better spacing
function createDrillBox(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  drill: any,
  playerName: string,
  dayNumber: number,
): number {
  const padding = 14 // Increased padding for better aesthetics and to prevent text overlap
  const innerWidth = width - padding * 2

  // Start with initial y position for content
  let currentY = y + padding
  let contentHeight = 0

  // Calculate content height first without drawing
  // Drill name
  contentHeight += 12 // Name height - increased
  contentHeight += 12 // Line + spacing - increased

  // Focus area
  contentHeight += 10 // Increased

  // Sets/Reps
  contentHeight += 10 // Increased

  // Time
  contentHeight += 14 // Increased

  // Video link (if it exists)
  if (drill.video && drill.video.url) {
    contentHeight += 10 // Video label - increased

    // Ensure the URL is properly formatted
    let videoUrl = drill.video.url
    if (!videoUrl.startsWith("http://") && !videoUrl.startsWith("https://")) {
      videoUrl = "https://" + videoUrl.replace(/^(www\.)/, "")
    }

    // Calculate link text height
    const linkText = drill.video.title || "Watch drill demonstration"
    const linkLines = doc.splitTextToSize(linkText, innerWidth)
    contentHeight += linkLines.length * 9 * 0.5 + 8 // Increased spacing
  }

  // Addressing struggle section
  // Generate the drill-specific message
  const drillSpecificMessage = generateDrillSpecificMessage(drill, playerName, dayNumber)

  // Calculate the height needed for this message
  const explanationLines = doc.splitTextToSize(drillSpecificMessage, innerWidth)
  contentHeight += 10 // Spacing before label - increased
  contentHeight += 10 // Label - increased
  contentHeight += explanationLines.length * 7 // Increased line height for better readability

  // Add final padding
  contentHeight += padding + 4 // Extra padding at the bottom

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
  currentY += 12 // Increased spacing

  // Line under name
  drawLine(doc, x + padding, currentY, x + width - padding, currentY, 0.75, colors.accent) // Using accent color
  currentY += 12 // Increased spacing

  // Focus area
  doc.setFontSize(11) // Increased font size
  doc.setFont("times", "bold") // Times New Roman bold
  doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]) // Changed to black
  doc.text("FOCUS:", x + padding, currentY)

  doc.setFont("times", "normal") // Times New Roman normal
  const focusText = drill.focus || "General improvement"
  const focusLines = doc.splitTextToSize(focusText, innerWidth - 40) // Increased offset
  doc.text(focusLines, x + padding + 40, currentY) // Increased offset
  currentY += 10 // Increased spacing

  // Sets/Reps
  doc.setFont("times", "bold") // Times New Roman bold
  doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]) // Changed to black
  doc.text("SETS/REPS:", x + padding, currentY)

  doc.setFont("times", "normal") // Times New Roman normal
  const setsRepsText = !drill.sets || !drill.reps ? "As Many As Possible" : `${drill.sets}, ${drill.reps}`
  doc.text(setsRepsText, x + padding + 40, currentY) // Increased offset
  currentY += 10 // Increased spacing

  // Time (estimated)
  doc.setFont("times", "bold") // Times New Roman bold
  doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]) // Changed to black
  doc.text("TIME:", x + padding, currentY)

  doc.setFont("times", "normal") // Times New Roman normal
  doc.text("10-15 minutes", x + padding + 40, currentY) // Increased offset
  currentY += 14 // Increased spacing

  // Video link (if it exists)
  if (drill.video && drill.video.url) {
    // Video label
    doc.setFont("times", "bold") // Times New Roman bold
    doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]) // Changed to black
    doc.text("VIDEO:", x + padding, currentY)
    currentY += 10 // Increased spacing

    // Ensure the URL is properly formatted
    let videoUrl = drill.video.url
    if (!videoUrl.startsWith("http://") && !videoUrl.startsWith("https://")) {
      videoUrl = "https://" + videoUrl.replace(/^(www\.)/, "")
    }

    // Add clickable link
    const linkText = drill.video.title || "Watch drill demonstration"
    currentY = addLink(doc, linkText, videoUrl, x + padding, currentY, innerWidth, 10, colors.accent) + 8 // Using accent color, increased spacing
  }

  // Addressing struggle section
  currentY += 10 // Increased spacing
  doc.setFontSize(11) // Increased font size
  doc.setFont("times", "bold") // Times New Roman bold
  doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]) // Changed to black
  doc.text("ADDRESSING YOUR STRUGGLE:", x + padding, currentY)
  currentY += 10 // Increased spacing

  doc.setFont("times", "normal") // Times New Roman normal
  doc.setTextColor(colors.darkGray[0], colors.darkGray[1], colors.darkGray[2])

  // Use the drill-specific message
  explanationLines.forEach((line) => {
    doc.text(line, x + padding, currentY)
    currentY += 7 // Increased line height for better readability
  })

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
    for (let i = 0; i < courseData.days.length; i++) {
      const day = courseData.days[i]
      const dayNumber = day.day || i + 1 // Use day.day if available, otherwise use index + 1
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
        const estimatedHeight = createDrillBox(tempDoc, 0, 0, drillBoxWidth, drill, playerInfo.name, dayNumber)

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
        const drillBoxHeight = createDrillBox(doc, margin, y, drillBoxWidth, drill, playerInfo.name, dayNumber)
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
