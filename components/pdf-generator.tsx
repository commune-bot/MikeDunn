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

// Function to check if a new page is needed with improved logic
function checkForNewPage(doc: jsPDF, y: number, requiredHeight: number): number {
  const pageHeight = doc.internal.pageSize.getHeight()
  // Only add a new page if we absolutely need to (when content won't fit)
  if (y + requiredHeight > pageHeight - 15) {
    doc.addPage()
    return 20 // Reduced top margin to maximize space usage
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
  doc.setFont("helvetica", "normal") // Using Helvetica for cleaner look
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

// Create a more visible basketball court background
function createBasketballCourtBackground(doc: jsPDF) {
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  // Set background color to a basketball court-like color
  doc.setFillColor(230, 210, 180) // Light wood color
  doc.rect(0, 0, pageWidth, pageHeight, "F")

  // Add court lines with darker color for better visibility
  doc.setDrawColor(120, 80, 40) // Darker brown for court lines
  doc.setLineWidth(1.5) // Thicker lines for better visibility

  // Center circle
  const centerX = pageWidth / 2
  const centerY = pageHeight / 2
  doc.circle(centerX, centerY, 25, "S")

  // Center line
  doc.line(0, centerY, pageWidth, centerY)

  // Free throw lines
  doc.line(centerX - 40, pageHeight - 100, centerX + 40, pageHeight - 100)
  doc.line(centerX - 40, 100, centerX + 40, 100)

  // Key/paint area - bottom
  doc.rect(centerX - 40, pageHeight - 100, 80, 60, "S")

  // Key/paint area - top
  doc.rect(centerX - 40, 40, 80, 60, "S")

  // Baseline - bottom
  doc.line(centerX - 60, pageHeight - 40, centerX + 60, pageHeight - 40)

  // Baseline - top
  doc.line(centerX - 60, 40, centerX + 60, 40)

  // Add basketball texture pattern
  for (let x = 0; x < pageWidth; x += 20) {
    for (let y = 0; x < pageHeight; y += 20) {
      // Draw small dots to simulate basketball texture
      if ((x + y) % 40 === 0) {
        doc.setFillColor(200, 180, 150) // Slightly lighter than background
        doc.circle(x, y, 1, "F")
      }
    }
  }

  // Add a gradient-like effect from top to bottom
  for (let i = 0; i < 10; i++) {
    // Create semi-transparent layers with decreasing opacity
    const opacity = 0.03 * i // Very subtle opacity
    doc.setFillColor(0, 0, 0, opacity)
    doc.rect(0, i * (pageHeight / 10), pageWidth, pageHeight / 10, "F")
  }

  // Add a semi-transparent overlay for better text readability
  // Use a much lighter overlay to ensure the court is still visible
  doc.setFillColor(0, 0, 0, 0.2) // Black with only 20% opacity
  doc.rect(0, 0, pageWidth, pageHeight, "F")
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
  doc.setFont("helvetica", "bold") // Helvetica bold for cleaner look
  doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]) // Using accent color instead of black
  doc.text(drill.name, x + padding, currentY)
  currentY += 12 // Increased spacing

  // Line under name
  drawLine(doc, x + padding, currentY, x + width - padding, currentY, 0.75, colors.accent) // Using accent color
  currentY += 12 // Increased spacing

  // Focus area
  doc.setFontSize(11) // Increased font size
  doc.setFont("helvetica", "bold") // Helvetica bold for cleaner look
  doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]) // Changed to black
  doc.text("FOCUS:", x + padding, currentY)

  doc.setFont("helvetica", "normal") // Helvetica normal for cleaner look
  const focusText = drill.focus || "General improvement"
  const focusLines = doc.splitTextToSize(focusText, innerWidth - 40) // Increased offset
  doc.text(focusLines, x + padding + 40, currentY) // Increased offset
  currentY += 10 // Increased spacing

  // Sets/Reps
  doc.setFont("helvetica", "bold") // Helvetica bold for cleaner look
  doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]) // Changed to black
  doc.text("SETS/REPS:", x + padding, currentY)

  doc.setFont("helvetica", "normal") // Helvetica normal for cleaner look
  const setsRepsText = !drill.sets || !drill.reps ? "As Many As Possible" : `${drill.sets}, ${drill.reps}`
  doc.text(setsRepsText, x + padding + 40, currentY) // Increased offset
  currentY += 10 // Increased spacing

  // Time (estimated)
  doc.setFont("helvetica", "bold") // Helvetica bold for cleaner look
  doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]) // Changed to black
  doc.text("TIME:", x + padding, currentY)

  doc.setFont("helvetica", "normal") // Helvetica normal for cleaner look
  doc.text("10-15 minutes", x + padding + 40, currentY) // Increased offset
  currentY += 14 // Increased spacing

  // Video link (if it exists)
  if (drill.video && drill.video.url) {
    // Video label
    doc.setFont("helvetica", "bold") // Helvetica bold for cleaner look
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
  doc.setFont("helvetica", "bold") // Helvetica bold for cleaner look
  doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]) // Changed to black
  doc.text("ADDRESSING YOUR STRUGGLE:", x + padding, currentY)
  currentY += 10 // Increased spacing

  doc.setFont("helvetica", "normal") // Helvetica normal for cleaner look
  doc.setTextColor(colors.darkGray[0], colors.darkGray[1], colors.darkGray[2])

  // Use the drill-specific message
  explanationLines.forEach((line) => {
    doc.text(line, x + padding, currentY)
    currentY += 7 // Increased line height for better readability
  })

  return contentHeight
}

// Update the generatePdf function to use a programmatically generated basketball court background
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
    // Add the basketball court image as background for the cover page
    const basketballCourtImageUrl =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20May%2019%2C%202025%2C%2001_02_20%20PM-AhsZgJgvy6J1IpyNB5QlU3fKj8vVN3.png"
    try {
      const img = new Image()
      img.crossOrigin = "anonymous" // To avoid CORS issues

      // Create a promise to handle the async image loading
      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          try {
            // Add the image to cover the entire page
            doc.addImage(img, "PNG", 0, 0, pageWidth, pageHeight)
            resolve()
          } catch (error) {
            console.error("Error adding basketball court image to PDF:", error)
            // Fallback to the programmatic court if image fails
            createBasketballCourtBackground(doc)
            resolve()
          }
        }

        img.onerror = () => {
          console.error("Error loading basketball court image")
          // Fallback to the programmatic court if image fails
          createBasketballCourtBackground(doc)
          resolve()
        }

        // Start loading the image
        img.src = basketballCourtImageUrl
      })
    } catch (error) {
      console.error("Error with basketball court image:", error)
      // Fallback to the programmatic court if any error occurs
      createBasketballCourtBackground(doc)
    }

    // Get player's name
    const playerName = playerInfo.name || "Player"

    // SIMPLIFIED TEXT LAYOUT - Just white text directly on the image
    // Main title text in the top half
    doc.setFontSize(48) // Large font size
    doc.setFont("helvetica", "bold")
    doc.setTextColor(255, 255, 255) // White text
    doc.text(`${playerName.toUpperCase()}'S`, pageWidth / 2, 70, { align: "center" })
    doc.text("CUSTOM ELITE", pageWidth / 2, 100, { align: "center" })
    doc.text("SHOOTING PROGRAM", pageWidth / 2, 130, { align: "center" })

    // Add issues at the bottom of the page
    if (courseData.issues && courseData.issues.length > 0) {
      // "ADDRESSING:" text
      doc.setFontSize(18)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(255, 255, 255) // White text
      doc.text("ADDRESSING:", pageWidth / 2, pageHeight - 40, { align: "center" })

      // List of issues
      doc.setFontSize(14)
      doc.setFont("helvetica", "normal")

      // Join issues with bullet points
      const issuesText = courseData.issues.join(" • ")

      // Split text if too long
      const issuesLines = doc.splitTextToSize(issuesText, pageWidth - 40)

      // Display issues
      issuesLines.forEach((line, index) => {
        doc.text(line, pageWidth / 2, pageHeight - 25 + index * 12, { align: "center" })
      })
    }

    // Add KSA branding
    doc.setFontSize(14)
    doc.setFont("helvetica", "italic")
    doc.setTextColor(255, 255, 255) // White text
    doc.text("KEEP SHOOTING ACADEMY", pageWidth / 2, pageHeight - 5, { align: "center" })

    // ===== INTRODUCTION PAGE =====
    doc.addPage()
    let y = 30

    // Course Title
    doc.setFontSize(24)
    doc.setFont("helvetica", "bold") // Helvetica bold for cleaner look
    doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]) // Using accent color
    y = checkForNewPage(doc, y, 15)
    doc.text(courseData.title, margin, y)
    y += 15

    // Introduction Text
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal") // Helvetica normal for cleaner look
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
    doc.setFont("helvetica", "bold") // Helvetica bold for cleaner look
    doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]) // Changed to black
    y = checkForNewPage(doc, y, 8)
    doc.text("Issues Addressed:", margin, y)
    y += 8

    doc.setFontSize(12)
    doc.setFont("helvetica", "normal") // Helvetica normal for cleaner look
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
      doc.setFont("helvetica", "bold") // Helvetica bold for cleaner look
      doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]) // Using accent color
      doc.text(day.title, margin, y)
      y += 14 // Increased spacing

      // Day Description
      doc.setFontSize(12)
      doc.setFont("helvetica", "italic") // Helvetica italic for cleaner look
      doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]) // Changed to black
      const descriptionLines = doc.splitTextToSize(day.description, contentWidth)
      descriptionLines.forEach((line) => {
        doc.text(line, margin, y)
        y += 6
      })

      // Standardize the position after the header section
      // This ensures consistent spacing between header and first drill box on all pages
      y = 80 // Fixed position for the first drill box to start

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

        // In the daily training pages section, update the page break logic:
        // Check if we need a new page - more precise calculation
        if (y + estimatedHeight + 20 > pageHeight - 20) {
          doc.addPage()

          // Add the subtle header background on the new page
          doc.setFillColor(colors.veryLightBlue[0], colors.veryLightBlue[1], colors.veryLightBlue[2])
          doc.rect(0, 0, pageWidth, 40, "F") // Reduced header height

          // Add day title on the continued page
          doc.setFontSize(16)
          doc.setFont("helvetica", "bold")
          doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2])
          doc.text(`${day.title} (continued)`, margin, 25) // Reduced y position

          // Add a small KSA logo in the top right corner
          try {
            await addKSALogo(doc, pageWidth - margin - 10, 20, 15) // Smaller logo
          } catch (error) {
            console.error("Error adding logo to continued page:", error)
          }

          y = 50 // Reduced starting position to maximize space
        }

        // Now create the actual drill box
        const drillBoxHeight = createDrillBox(doc, margin, y, drillBoxWidth, drill, playerInfo.name, dayNumber)
        y += drillBoxHeight + 15 // Increased spacing between drill boxes
      }

      // Day Notes
      // Check if we need a new page for notes
      const notesLines = doc.splitTextToSize(day.notes, contentWidth)
      // Calculate a more precise height based on actual content
      const notesHeight = Math.max(20, notesLines.length * 6 + 15)

      // More precise page break check for notes
      if (y + notesHeight + 10 > pageHeight - 15) {
        doc.addPage()

        // Add the subtle header background on the new page
        doc.setFillColor(colors.veryLightBlue[0], colors.veryLightBlue[1], colors.veryLightBlue[2])
        doc.rect(0, 0, pageWidth, 40, "F") // Reduced header height

        // Add day title on the continued page
        doc.setFontSize(16)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2])
        doc.text(`${day.title} (continued)`, margin, 25) // Reduced y position

        // Add a small KSA logo in the top right corner
        try {
          await addKSALogo(doc, pageWidth - margin - 10, 20, 15) // Smaller logo
        } catch (error) {
          console.error("Error adding logo to notes page:", error)
        }

        y = 50 // Reduced starting position to maximize space
      }

      // Add a notes section with a light background - changed to very light blue
      doc.setFillColor(colors.veryLightBlue[0], colors.veryLightBlue[1], colors.veryLightBlue[2]) // Using very light blue
      doc.roundedRect(margin, y, contentWidth, notesHeight, 4, 4, "F")

      y += 10 // Add space before notes title

      // Notes title
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold") // Helvetica bold for cleaner look
      doc.setTextColor(colors.black[0], colors.black[1], colors.black[2]) // Changed to black
      doc.text("COACH'S NOTES:", margin + 5, y)
      y += 10

      // Notes content
      doc.setFontSize(12)
      doc.setFont("helvetica", "normal") // Helvetica normal for cleaner look
      doc.setTextColor(colors.darkGray[0], colors.darkGray[1], colors.darkGray[2])

      notesLines.forEach((line) => {
        doc.text(line, margin + 5, y)
        y += 6
      })

      // Add this at the end of the day loop to check if we're on the last day
      // and have enough content to avoid a blank page
      if (i === courseData.days.length - 1) {
        // If we're on the last page and there's minimal content, adjust spacing
        if (y < pageHeight / 3) {
          // We have very little content on the last page, adjust the notes section
          // to fill more space and prevent a blank follow-up page
          doc.setFontSize(13) // Slightly larger font
          doc.setLineWidth(0.8) // Thicker lines
          // Add more detailed notes or formatting to fill the page
        }
      }
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
