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
  // Use a more conservative threshold to ensure nothing gets cut off
  if (y + requiredHeight > pageHeight - 30) {
    doc.addPage()
    return 20 // Reduced top margin to maximize space usage
  }
  return y
}

// Function to ensure consistent spacing between header and content
function enforceHeaderContentSpacing(doc: jsPDF, headerEndY: number): number {
  // CRITICAL FIX: Force exactly 15mm spacing after any header
  // This is a hard-coded value to ensure consistency across all pages
  const FIXED_HEADER_SPACING = 15 // Exactly 15mm

  // Return a position that ensures exactly 15mm spacing after the header
  return headerEndY + FIXED_HEADER_SPACING
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

// Find the generateDrillSpecificMessage function and replace it with this enhanced version:

function generateDrillSpecificMessage(drill: any, playerName: string, dayNumber: number): string {
  // Comprehensive drill knowledge base with detailed information about each drill
  const drillKnowledgeBase = {
    // Guide Hand and One-Hand Form Drills
    "One Hand Shooting": `${playerName}, this drill isolates your shooting hand mechanics by removing your guide hand entirely. As you shoot one-handed, you'll feel any wobble in your release and learn to push the ball with proper alignment. Focus on the ball rolling off your fingertips with backspin. This directly addresses your guide-hand interference issues by training a clean, controlled release without off-hand pressure.`,

    "1 Hand Shooting": `${playerName}, by removing your guide hand, this drill forces your shooting hand to do all the work. Pay attention to how the ball feels as it leaves your fingertips - any wobble indicates misalignment. This directly addresses your inconsistent release point by building pure shooting mechanics. The ball-before-body sequencing you'll develop here will eliminate that guide hand push affecting your accuracy.`,

    "Guide Hand Positioning": `Your guide hand should only balance the ball, never push it, ${playerName}. This drill teaches you to position your off-hand on the side with fingers pointing up, not toward the basket. This directly addresses your thumb flick issue by training your guide hand to stay neutral. Notice how a properly positioned guide hand leads to a straighter ball flight and more consistent accuracy.`,

    "Ball Raises": `${playerName}, the starting position of your shot affects everything that follows. This drill eliminates unnecessary dipping by bringing the ball up in one fluid motion. Focus on initiating upward motion with the ball while keeping your lower body loaded. This addresses your shot sequencing issues and establishes a consistent shot pocket, which will improve your rhythm and eliminate that hitch in your release.`,

    "1-2 Through": `This drill connects your lower and upper body timing, ${playerName}. The 1-2 step creates rhythm while the "through" motion ensures continuous upward momentum. Focus on footwork and keeping the guide-hand pressure minimal. This addresses your tendency to pause during your shooting motion, reinforcing a smooth push with proper one-two foot rhythm instead of that jerky motion you've developed.`,

    // Footwork and Sequencing Drills
    "Floor Taps": `${playerName}, this drill teaches you to get low and use your legs properly. By dropping into a deep stance and tapping the floor, you're training proper sequencing - legs powering the shot after the ball begins to rise. This addresses your balance issues and insufficient leg engagement. The explosive upward motion after the tap will build the stable base you've been missing in your shot.`,

    "High Ball Drop": `This drill creates a smooth shooting rhythm by using a high-to-low motion as a trigger, ${playerName}. Starting with the ball overhead and dropping it into your shooting pocket creates fluid sequencing - the ball's downward and upward moves merge into one motion. This eliminates the hitches in your shot and reinforces balance and timing, helping you harness momentum for a more consistent release.`,

    "1 Position Drops": `${playerName}, this drill helps you generate more power while maintaining proper form. By executing a quick drop while holding the ball at your set point, you give the ball a head start upward and gain range without sacrificing form. This addresses your tendency to push with your arms for distance - instead, you'll learn to use your legs efficiently while keeping your upper-body mechanics clean.`,

    "Jab Phase I": `This drill improves your footwork out of triple threat, ${playerName}. The quick jab step into your jump shot teaches you to transfer weight properly without losing alignment. This addresses your balance issues when shooting off the dribble or after movement. By practicing this quick weight shift and reset, you'll develop a quicker, more balanced shot that doesn't drift in the air.`,

    // Off-Dribble Shooting Drills
    "Pullback 1-2 Step": `${playerName}, this drill works on creating space for your jumper using a pull-back dribble into a one-two step shot. It addresses your balance after sudden direction changes - you'll learn to stop on a dime and get your feet set quickly. Focus on dropping into your hips after the pullback and letting the ball come up smoothly, maintaining that one-motion shot even after creating separation.`,

    "Dribble 1-2 Step": `This drill builds your ability to shoot off the dribble with proper footwork, ${playerName}. The key is timing between your dribble and your feet - the ball and your lead foot should arrive together. This addresses your tendency to rush shots off the dribble. Stay low during the dribble, then push up through the shot in one motion once your feet are set for better accuracy under pressure.`,

    "Dribble Hop Fade": `${playerName}, this drill trains body control when creating space with a hop-back. After the dribble, focus on quickly setting your feet during the hop and squaring up in mid-air. This addresses your tendency to fade without proper alignment. Keep your shoulders over your feet and maintain vertical alignment even as you move away from the basket - this will eliminate those short shots when you're creating space.`,

    "Hang Dribbles": `This drill improves your ability to shoot off a hesitation dribble, ${playerName}. The "hang" dribble forces you to stay low and balanced while changing pace, then quickly transition to your shooting motion. This addresses your rhythm changes - you'll learn to go from a slow, controlled dribble to an immediate, high-speed release without disrupting form. Keep your shooting mechanics ready during the dribble for a smooth transition.`,

    // Movement and Game Situation Drills
    "Backward Catch & Shoot": `${playerName}, this drill simulates catching with your back to the basket and quickly turning to shoot. It addresses your footwork and orientation - you'll learn to locate the rim and set your feet rapidly. This builds the quick decision-making you need in games, training you to go from not seeing the hoop to a squared-up shot in one smooth sequence, eliminating those rushed, off-balance attempts after catches.`,

    "Roll Out": `This drill trains shooting on the move, ${playerName}, simulating a lead pass to yourself. After chasing the ball, you must quickly come to a balanced stop for your shot. This addresses your footwork at speed - you'll learn to pick up the ball in stride and get into your shooting motion without rushing. This builds the transition from movement to a stable, on-balance shot that you've struggled with in game situations.`,

    "Ghost Screen into Back Pedal": `${playerName}, this drill simulates a fake screen and pop-out for a shot. It addresses your footwork when moving from forward to backward motion while staying shot-ready. The quick feet and balance you'll develop will ensure you can retreat rapidly yet still plant and rise into a smooth shot. This improves your ability to create space and fire with proper alignment, fixing those off-balance shots after movement.`,

    "Sprint to Corner": `This drill emphasizes shooting after a full sprint, ${playerName}, which addresses your conditioning and footwork under fatigue. Coming off a sprint, you have to quickly gather yourself and execute proper one-two alignment. This trains you to be shot-ready at high speed, keeping your hips low and steps controlled even when winded. This builds the habit of getting balanced quickly after running - crucial for those corner threes in transition.`,

    // Range and Endurance Drills
    "Rapid Fire": `${playerName}, this drill builds stamina and confidence by having you shoot repeatedly from one spot. It addresses your shooting endurance and concentration - as fatigue sets in, you must maintain your form. This also develops a quicker release and rhythm under pressure. Focus on mindful repetition at speed: even though you're shooting fast, keep each shot fundamentally sound to build consistency when tired or rushed.`,

    "100 3's": `This volume shooting drill gauges and improves your consistency, ${playerName}. Making shot 100 as solid as shot 1 ingrains proper muscle memory through repetition. This addresses your endurance and focus issues - your balance, follow-through, and arc shouldn't change even as you tire. Tracking your makes builds mental toughness as well, teaching you that consistency comes from keeping your technique constant regardless of fatigue.`,

    "Wiper Shooting": `${playerName}, this drill involves shooting while moving side-to-side across the court. It addresses your conditioning and footwork - you're constantly moving laterally or diagonally, then quickly setting your feet at each new spot. This builds your ability to square your hips and shoulders repeatedly under fatigue, similar to running off multiple screens in games. This will fix those alignment issues you have when shooting after movement.`,

    "Free Throws": `Free throws are the foundation of shooting confidence, ${playerName}. With no defenders or movement, you can focus purely on balance, routine, and concentration. This addresses your fundamental mechanics under pressure - practice your exact routine (breathing, dribbles, alignment) and repeat the same motion every time. This reinforces muscle memory and teaches you to calm your mind, crucial since games often hinge on these shots.`,

    "Momentum Shots": `${playerName}, this drill focuses on generating extra range by stepping into your shot with momentum. It addresses range extension by incorporating your body's motion - you'll coordinate a controlled forward step with your shooting motion to shoot farther without straining. Focus on a strong upward finish and stable core, using momentum for distance while keeping your mechanics consistent. This will help extend your range without those flat shots you tend to shoot from distance.`,

    "Stabilize The Shooting Elbow": `Elbow alignment is crucial for shot consistency, ${playerName}. This drill helps you keep your elbow under the ball rather than flaring out. Notice how proper alignment creates a straight line from elbow to fingertips toward the basket. This addresses your tendency to let your elbow drift, which causes those shots that miss left or right. By stabilizing this key joint, you'll develop a much more repeatable, accurate shot.`,

    "3 Exercises to Stabilize Elbow": `${playerName}, these progressive exercises address your elbow positioning by working backward from the finish position. This builds proper alignment throughout your shot, directly improving your accuracy and consistency. The exercises isolate and strengthen the correct movement patterns, eliminating that elbow flare that's causing your shots to spray left and right. Focus on feeling the proper alignment in each repetition.`,

    "Jump Turns With Pass": `Creating separation is crucial in games, ${playerName}. This drill helps you maintain balance and alignment when turning to receive passes. Focus on planting your outside foot and quickly squaring your shoulders to the basket. This addresses your tendency to shoot off-balance after movement, building the body control needed to deliver accurate shots even when you have to adjust your position quickly.`,

    "Catch and Shoot With Pass Fake": `${playerName}, game situations require quick decisions. This drill develops your ability to maintain shooting mechanics while adding decision-making elements. The pass fake forces you to stay balanced through a complex movement before shooting. This addresses your tendency to rush shots after fakes - you'll learn to keep your form consistent despite the added complexity, improving your effectiveness in game situations.`,

    "Lateral Movement into DDS": `Defenders often force lateral movement before shots, ${playerName}. This drill helps you maintain mechanics after sideways movement. Focus on quickly squaring your shoulders and hips to the basket after the lateral move. This addresses your struggle to shoot consistently after side-to-side movement, building the footwork needed to deliver accurate shots even when forced to move laterally before shooting.`,

    "90 Degree Elevator Drops": `${playerName}, this complex movement pattern challenges your balance and coordination. By mastering this drill, you'll develop the body control needed for difficult game shots. Focus on maintaining vertical alignment despite the rotational movement. This addresses your tendency to lose balance on complex footwork, building the stability needed to shoot accurately after quick directional changes.`,

    "Wide Stance Shots": `A stable base is crucial for shooting consistency, ${playerName}. This drill helps you feel proper weight distribution and balance throughout your shot. Notice how a wider stance creates stability but sacrifices some power - finding your optimal width is key. This addresses your tendency to shoot with your feet too close together, which creates those wobbly, inconsistent releases.`,

    "Skinny Side Backboard Shots": `This precision drill develops both arc and accuracy, ${playerName}. The narrow target on the backboard requires perfect trajectory and touch. This addresses your tendency to shoot with inconsistent arc heights. By focusing on hitting this challenging target, you'll develop a feel for the optimal arc that gives your shot the best chance of going in, eliminating those flat line-drives you sometimes shoot.`,

    "Flat Side Backboard Shots": `Your shot arc has been too flat, ${playerName}. This drill forces you to create proper trajectory by using the backboard as feedback. A higher arc increases your shooting percentage by creating a softer touch and better angle into the basket. This addresses your tendency to shoot line drives that hit the front rim. Focus on getting the ball up and over the flat side of the backboard for optimal arc.`,

    "Ball Does Not Stop": `Continuous motion creates shooting rhythm, ${playerName}. This drill eliminates the hitch in your shot by keeping the ball moving relative to the ground. Notice how this creates a smoother release and more consistent power generation. This addresses your tendency to pause during your shooting motion, which disrupts your timing and power transfer. Keep that upward momentum flowing through your shot for better results.`,

    "Slow Motion 1-2-Thru @ Hoop": `Slowing down helps you feel each component of your shot, ${playerName}. This deliberate practice builds awareness of proper sequencing. Focus on the connection between your footwork and hand position throughout the motion. This addresses your tendency to rush through your mechanics, helping you understand exactly how each part of your body should move in sequence for optimal shooting.`,

    Gauntlet: `${playerName}, this high-intensity challenge combines multiple movements and shot types in succession. It addresses both endurance and mental toughness - you must maintain form through exhaustion and quickly adapt from one action to the next. This builds confidence that you can shoot tired and under pressure, reinforcing that deliberate practice and simplicity in technique will carry you through even the most challenging game situations.`,
  }

  // Basic drill categories for fallback messages
  const drillCategories = {
    form: ["hand", "guide", "form", "elbow", "release", "follow", "through", "wrist"],
    balance: ["balance", "foot", "stance", "base", "stable", "position", "drop"],
    arc: ["arc", "backboard", "trajectory", "flat", "skinny", "high"],
    rhythm: ["rhythm", "flow", "through", "continuous", "stop", "motion", "timing"],
    game: ["game", "catch", "fake", "pass", "sprint", "movement", "situation"],
    advanced: ["gauntlet", "elevator", "momentum", "lateral", "complex", "fade"],
  }

  // Get the drill name
  const drillName = drill.name

  // Look for an exact match in our knowledge base
  let message = drillKnowledgeBase[drillName]

  // If no exact match, try partial matches
  if (!message) {
    for (const [knownDrill, knowledgeText] of Object.entries(drillKnowledgeBase)) {
      if (drillName.includes(knownDrill) || knownDrill.includes(drillName)) {
        message = knowledgeText
        break
      }
    }
  }

  // If still no match, categorize the drill and use a default message
  if (!message) {
    let category = "advanced" // Default category

    // Determine the category based on drill name
    for (const [cat, keywords] of Object.entries(drillCategories)) {
      if (keywords.some((keyword) => drillName.toLowerCase().includes(keyword))) {
        category = cat
        break
      }
    }

    // Create a category-specific message
    switch (category) {
      case "form":
        message = `${playerName}, this form-focused drill targets your shooting mechanics at a fundamental level. It isolates proper hand positioning, elbow alignment, and release point - all crucial elements you need to refine. Focus on keeping your shooting elbow under the ball and follow through with your fingers pointing to the target. This creates muscle memory for proper form that will transfer to all your shots and address your inconsistent release issues.`
        break
      case "balance":
        message = `Balance is the foundation of consistent shooting, ${playerName}. This drill specifically challenges your stability to improve your base. Pay attention to how your weight distributes through your feet and how it affects your shot. A stable base eliminates those drifting shots you've been struggling with. Notice how proper weight distribution leads to a more consistent release point and better accuracy, especially when you're fatigued or under defensive pressure.`
        break
      case "arc":
        message = `${playerName}, this drill directly addresses your shot trajectory issues. You've been shooting too flat, which reduces your margin for error. By focusing on proper arc, you'll create a softer touch and better angle into the basket. This increases your shooting percentage significantly. Work on feeling the difference between a flat shot and one with optimal arc - about 45 degrees is ideal. This will help eliminate those front-rim misses that have been frustrating you.`
        break
      case "rhythm":
        message = `Shooting rhythm creates consistency, ${playerName}, and this drill targets the timing issues in your shot. Focus on creating a smooth, continuous motion without hitches or pauses. The connection between your lower and upper body timing is crucial - your legs should power the shot as the ball begins its upward movement. This addresses your tendency to have a disjointed motion where your upper and lower body aren't working together efficiently.`
        break
      case "game":
        message = `${playerName}, this game-simulation drill addresses your struggle to maintain proper mechanics under pressure. By replicating game situations, you're training your body to execute the same consistent form regardless of circumstances. Focus on maintaining balance, alignment, and follow-through even with the added complexity. This builds the muscle memory needed to perform in games, not just in practice, addressing that performance gap you've noticed in competition.`
        break
      case "advanced":
        message = `This advanced drill challenges your mechanics under complex conditions, ${playerName}. It's specifically designed to address your ability to maintain proper form while adding multiple movement elements. By mastering this pattern, you'll develop the body control and coordination needed for difficult game shots. Focus on keeping your core principles (balance, alignment, follow-through) consistent despite the challenge, which will translate to better performance in unpredictable game situations.`
        break
    }
  }

  // Coaching wisdom to add variety (will be appended to some messages based on day number)
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

  // Add coaching wisdom to some messages based on day number (for variety)
  if (dayNumber % 3 === 0) {
    const wisdomIndex = (dayNumber + drillName.length) % coachingWisdom.length
    message += " " + coachingWisdom[wisdomIndex]
  }

  return message
}

// Add this function before the generatePdf function, after the generateDrillSpecificMessage function

function generateCoachesNotes(day: any, dayNumber: number, playerName: string): string {
  // Determine if we're in week 1 (fundamentals) or week 2 (application)
  const isWeek1 = dayNumber <= 7

  // FIXED: Properly filter drills vs explanation videos
  const dayDrills =
    day.drills?.filter((item) => {
      // Check if it's an explanation video by looking at sets/reps
      const isExplanationVideo = item.sets === "N/A" || item.reps === "Watch & Understand"
      return !isExplanationVideo // Only return actual drills
    }) || []

  const dayExplanations =
    day.drills?.filter((item) => {
      // Check if it's an explanation video
      const isExplanationVideo = item.sets === "N/A" || item.reps === "Watch & Understand"
      return isExplanationVideo // Only return explanation videos
    }) || []

  // Drill knowledge base - detailed information about specific drills
  const drillKnowledge = {
    // Guide Hand and One-Hand Form Drills
    "One Hand Shooting":
      "Focus on pushing the ball with your shooting hand only. This isolates your shooting mechanics and eliminates guide hand interference.",
    "Guide Hand Positioning":
      "Your guide hand should only balance the ball, never push it. Position it on the side with fingers pointing up, not toward the basket.",
    "Ball Raises":
      "The starting position affects everything that follows. Eliminate unnecessary dipping by bringing the ball up in one fluid motion.",
    "1-2 Through":
      "Connect your lower and upper body timing with this footwork. The 1-2 step creates rhythm while the 'through' motion ensures continuous upward momentum.",

    // Footwork and Sequencing Drills
    "Floor Taps":
      "Get low and use your legs properly. The deep stance and floor tap trains proper sequencing - legs powering the shot after the ball begins to rise.",
    "High Ball Drop":
      "The high-to-low motion creates a smooth trigger. Start with the ball overhead, drop it to your pocket, then flow into your shot.",
    "1 Position Drops":
      "Generate more power while maintaining form by dropping your hips while keeping the ball high. This gives the ball a head start upward.",
    "Jab Phase I":
      "Improve your footwork out of triple threat with this quick jab step into your shot. Transfer weight from the jab into the shot without losing alignment.",

    // Off-Dribble Shooting Drills
    "Pullback 1-2 Step":
      "Create space with a pull-back dribble into a one-two step shot. Practice stopping on a dime and getting your feet set quickly.",
    "Dribble 1-2 Step":
      "Time your dribble and footwork so the ball and your lead foot arrive together. Stay low on the dribble and push up through the shot.",
    "Dribble Hop Fade":
      "Control your body when creating space with a hop-back. Set your feet during the hop and square up in mid-air, keeping shoulders over feet.",
    "Hang Dribbles":
      "Use the hesitation dribble to freeze defenders. Stay low and balanced during the pause, then explode into your shot without disrupting form.",

    // Movement and Game Situation Drills
    "Backward Catch & Shoot":
      "Quickly locate the rim and set your feet when catching with your back to the basket. Practice pivoting 180° into a squared-up shot.",
    "Roll Out":
      "Simulate a lead pass by chasing the ball, then quickly stopping with balance. Pick up the ball in stride and get into your shooting motion.",
    "Ghost Screen into Back Pedal":
      "Transition from moving forward (into the screen) to moving backward while staying shot-ready. Use quick feet to retreat rapidly.",
    "Sprint to Corner":
      "After a full sprint, quickly gather yourself with a one-two step. Keep your hips low and steps controlled even when winded.",

    // Range and Endurance Drills
    "Rapid Fire":
      "Shoot repeatedly from one spot to build stamina and confidence. Maintain your form despite fatigue and develop a quicker release.",
    "100 3's":
      "Focus on consistency through volume. Make shot 100 as solid as shot 1 by maintaining balance, follow-through, and arc even as you tire.",
    "Wiper Shooting":
      "Move side-to-side across the court, quickly setting your feet at each new spot. Square your hips and shoulders repeatedly under fatigue.",
    "Free Throws":
      "Use the simplest shot to ingrain consistency and mental toughness. Practice your exact routine and repeat the same motion every time.",
  }

  // Identify the drills for this day (only actual drills, not explanation videos)
  const drillNames = dayDrills.map((drill) => drill.name)

  // Create a personalized opening based on the day number and week
  let notesOpening = ""
  if (isWeek1) {
    const week1Openings = [
      `${playerName}, today we're focusing on building your foundation. `,
      `Day ${dayNumber} is all about establishing proper mechanics, ${playerName}. `,
      `${playerName}, today's work is crucial for developing your shooting base. `,
      `As we continue building fundamentals on Day ${dayNumber}, ${playerName}, remember that quality trumps quantity. `,
      `${playerName}, today's session is designed to reinforce the core principles of your shot. `,
      `In today's fundamental work, ${playerName}, we'll be emphasizing the details that make a huge difference. `,
      `Day ${dayNumber} focuses on deliberate practice of key mechanics, ${playerName}. `,
    ]
    notesOpening = week1Openings[dayNumber % week1Openings.length]
  } else {
    const week2Openings = [
      `${playerName}, today we're applying your improved mechanics to game situations. `,
      `Day ${dayNumber} challenges you to maintain form under pressure, ${playerName}. `,
      `${playerName}, today's work bridges the gap between practice and performance. `,
      `As we advance your training on Day ${dayNumber}, ${playerName}, we'll test your mechanics in more complex scenarios. `,
      `today's session simulates the challenges you'll face in competition. `,
      `In today's application work, ${playerName}, we'll be pushing your new skills under game-like conditions. `,
      `Day ${dayNumber} focuses on transferring your improved mechanics to real game scenarios, ${playerName}. `,
    ]
    notesOpening = week2Openings[(dayNumber - 8) % week2Openings.length]
  }

  // Add explanation video notes if present (separate from drills)
  let explanationNotes = ""
  if (dayExplanations.length > 0) {
    explanationNotes = `\n\nToday's explanation video (${dayExplanations[0].name}): Watch this carefully to understand the key concepts behind fixing your shooting issues. The visual breakdown will help you better execute the drills that follow.`
  }

  // Create drill-specific notes for up to 3 ACTUAL DRILLS from today's session
  let drillSpecificNotes = ""
  const drillsToHighlight = Math.min(3, dayDrills.length) // Only count actual drills

  for (let i = 0; i < drillsToHighlight; i++) {
    const drillName = dayDrills[i].name

    // Look for exact match first
    let drillNote = drillKnowledge[drillName]

    // If no exact match, look for partial matches
    if (!drillNote) {
      for (const [knownDrill, note] of Object.entries(drillKnowledge)) {
        if (drillName.includes(knownDrill) || knownDrill.includes(drillName)) {
          drillNote = note
          break
        }
      }
    }

    // If still no match, create a generic note based on drill name
    if (!drillNote) {
      if (drillName.toLowerCase().includes("hand") || drillName.toLowerCase().includes("guide")) {
        drillNote =
          "Focus on proper hand positioning and minimal guide hand interference. This builds the foundation for a clean release."
      } else if (
        drillName.toLowerCase().includes("foot") ||
        drillName.toLowerCase().includes("step") ||
        drillName.toLowerCase().includes("stance")
      ) {
        drillNote =
          "Pay attention to your footwork and balance. Proper foot alignment creates the base for your entire shooting motion."
      } else if (drillName.toLowerCase().includes("dribble") || drillName.toLowerCase().includes("pull")) {
        drillNote =
          "Maintain your shooting mechanics even after the dribble. The transition from handling to shooting should be smooth."
      } else if (
        drillName.toLowerCase().includes("sprint") ||
        drillName.toLowerCase().includes("run") ||
        drillName.toLowerCase().includes("movement")
      ) {
        drillNote =
          "Focus on quickly transitioning from movement to a balanced shooting position. Your feet should be set properly."
      } else {
        drillNote =
          "Focus on maintaining consistent form with each repetition. Quality practice builds reliable game performance."
      }
    }

    // Add the drill name and note with proper spacing
    drillSpecificNotes += `\n\nIn the ${drillName} drill: ${drillNote}`
  }

  // Create a personalized closing with a key focus point
  let notesClosing = ""
  const closings = [
    `\n\nRemember, ${playerName}, the goal is progress, not perfection. Stay patient with the process.`,
    `\n\n${playerName}, focus on feeling the improvements rather than just seeing results. Your body is learning with each rep.`,
    `\n\nTrust your training, ${playerName}. These deliberate repetitions are building the muscle memory you'll rely on in games.`,
    `\n\n${playerName}, shooting excellence comes from attention to detail. Be present with each rep today.`,
    `\n\nRemember that consistency comes from repeatable mechanics, ${playerName}. Build habits you can trust under pressure.`,
    `\n\n${playerName}, the mind leads the body - visualize success before each attempt and your body will follow.`,
    `\n\nThe ball doesn't stop relative to the ground, ${playerName}. Keep that upward momentum flowing through your shot.`,
    `\n\n${playerName}, sometimes the quickest way to get where you want to go is slowly. Master these fundamentals first.`,
    `\n\nBe Ye Doers, ${playerName}. Put in the work with intention and the results will follow.`,
    `\n\n${playerName}, shooting IS movement. The better you get at moving, the better you'll get at shooting.`,
    `\n\nProgress in anything is not always linear, ${playerName}. Trust the process and stay committed.`,
    `\n\n${playerName}, your body follows where your eyes lead. Focus on the target with each shot.`,
    `\n\nSmall improvements compound over time, ${playerName}. Each day's work builds on the previous.`,
    `\n\n${playerName}, the shot begins the moment you begin to move. Your preparation is everything.`,
  ]
  notesClosing = closings[(dayNumber + drillNames.length) % closings.length]

  // Combine all parts into the final coach's notes with proper spacing
  // Put explanation notes first, then drill notes, then closing
  return notesOpening + explanationNotes + drillSpecificNotes + notesClosing
}

// Find the createDrillBox function and replace it with this standardized version:

function createDrillBox(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  drill: any,
  playerName: string,
  dayNumber: number,
): number {
  // Standardized spacing constants
  const padding = 14 // Outer padding of the box
  const innerWidth = width - padding * 2
  const titleHeight = 12 // Height for title
  const titleLineSpacing = 12 // Space after title line
  const sectionSpacing = 10 // Standard spacing between sections
  const labelWidth = 40 // Width for labels (FOCUS:, SETS/REPS:, etc.)
  const videoLabelSpacing = 10 // Space after video label
  const struggleLabelSpacing = 10 // Space after struggle label
  const paragraphLineHeight = 7 // Line height for paragraph text
  const bottomPadding = padding + 4 // Extra padding at bottom

  // Start with initial y position for content
  let currentY = y + padding
  let contentHeight = 0

  // Calculate content height first without drawing
  contentHeight += titleHeight // Title height
  contentHeight += titleLineSpacing // Line + spacing after title

  // Focus area
  contentHeight += sectionSpacing

  // Sets/Reps
  contentHeight += sectionSpacing

  // Time
  contentHeight += sectionSpacing

  // Video link (if it exists)
  if (drill.video && drill.video.url) {
    contentHeight += sectionSpacing // Space before video section

    // Ensure the URL is properly formatted
    let videoUrl = drill.video.url
    if (!videoUrl.startsWith("http://") && !videoUrl.startsWith("https://")) {
      videoUrl = "https://" + videoUrl.replace(/^(www\.)/, "")
    }

    // Calculate link text height
    const linkText = drill.video.title || "Watch drill demonstration"
    const linkLines = doc.splitTextToSize(linkText, innerWidth)
    contentHeight += linkLines.length * 9 * 0.5 + sectionSpacing // Link text + spacing after
  }

  // Addressing struggle section
  // Generate the drill-specific message
  const drillSpecificMessage = generateDrillSpecificMessage(drill, playerName, dayNumber)

  // Calculate the height needed for this message
  const explanationLines = doc.splitTextToSize(drillSpecificMessage, innerWidth)
  contentHeight += sectionSpacing // Space before struggle section
  contentHeight += struggleLabelSpacing // Space after struggle label
  contentHeight += explanationLines.length * paragraphLineHeight // Text height

  // Add final padding
  contentHeight += bottomPadding

  // Now draw the box with the calculated height
  // Box background
  doc.setFillColor(colors.white[0], colors.white[1], colors.white[2])
  doc.roundedRect(x, y, width, contentHeight, 4, 4, "F")

  // Box border
  doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2], 0.3)
  doc.setLineWidth(0.5)
  doc.roundedRect(x, y, width, contentHeight, 4, 4, "S")

  // Reset currentY to start drawing content
  currentY = y + padding

  // Drill name
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2])
  doc.text(drill.name, x + padding, currentY)
  currentY += titleHeight

  // Line under name
  drawLine(doc, x + padding, currentY, x + width - padding, currentY, 0.75, colors.accent)
  currentY += titleLineSpacing

  // Focus area
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(colors.black[0], colors.black[1], colors.black[2])
  doc.text("FOCUS:", x + padding, currentY)

  doc.setFont("helvetica", "normal")
  const focusText = drill.focus || "General improvement"
  const focusLines = doc.splitTextToSize(focusText, innerWidth - labelWidth)
  doc.text(focusLines, x + padding + labelWidth, currentY)
  currentY += sectionSpacing

  // Sets/Reps
  doc.setFont("helvetica", "bold")
  doc.setTextColor(colors.black[0], colors.black[1], colors.black[2])
  doc.text("SETS/REPS:", x + padding, currentY)

  doc.setFont("helvetica", "normal")
  const setsRepsText = !drill.sets || !drill.reps ? "As Many As Possible" : `${drill.sets}, ${drill.reps}`
  doc.text(setsRepsText, x + padding + labelWidth, currentY)
  currentY += sectionSpacing

  // Time (estimated)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(colors.black[0], colors.black[1], colors.black[2])
  doc.text("TIME:", x + padding, currentY)

  doc.setFont("helvetica", "normal")
  doc.text("10-15 minutes", x + padding + labelWidth, currentY)
  currentY += sectionSpacing

  // Video link (if it exists)
  if (drill.video && drill.video.url) {
    // Video label
    doc.setFont("helvetica", "bold")
    doc.setTextColor(colors.black[0], colors.black[1], colors.black[2])
    doc.text("VIDEO:", x + padding, currentY)
    currentY += videoLabelSpacing

    // Ensure the URL is properly formatted
    let videoUrl = drill.video.url
    if (!videoUrl.startsWith("http://") && !videoUrl.startsWith("https://")) {
      videoUrl = "https://" + videoUrl.replace(/^(www\.)/, "")
    }

    // Add clickable link
    const linkText = drill.video.title || "Watch drill demonstration"
    currentY = addLink(doc, linkText, videoUrl, x + padding, currentY, innerWidth, 10, colors.accent) + sectionSpacing
  }

  // Addressing struggle section
  currentY += sectionSpacing - 5 // Adjust spacing before struggle section
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(colors.black[0], colors.black[1], colors.black[2])
  doc.text("ADDRESSING YOUR STRUGGLE:", x + padding, currentY)
  currentY += struggleLabelSpacing

  // Set up text styling for the explanation paragraph
  doc.setFont("helvetica", "normal")
  doc.setTextColor(colors.darkGray[0], colors.darkGray[1], colors.darkGray[2])
  doc.setFontSize(11)

  // Format the text as a proper paragraph with consistent line spacing
  const textX = x + padding
  const textWidth = innerWidth

  // Split the text to fit the width while maintaining paragraph format
  const explanationLinesForDrawing = doc.splitTextToSize(drillSpecificMessage, textWidth)

  // Draw the text as a single paragraph with proper spacing
  explanationLinesForDrawing.forEach((line, index) => {
    doc.text(line, textX, currentY + index * paragraphLineHeight)
  })

  return contentHeight
}

// Add this function before the generatePdf function
function getResponsiveFontSize(text: string, maxWidth: number, defaultSize: number): number {
  // If text is very long, reduce the font size
  if (text.length > 40) {
    return Math.max(defaultSize - 4, 14) // Minimum size of 14
  } else if (text.length > 30) {
    return Math.max(defaultSize - 2, 16) // Minimum size of 16
  }
  return defaultSize
}

// Update the generatePdf function to use a programmatically generated basketball court
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
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%20May%2019%2C%202025%2C%2009_57_18%20PM-ZCTCCVKP7H6X4aYapo5ngKhSiXxmqb.png"
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

    // SIMPLIFIED TEXT LAYOUT - Just white text directly on the image with responsive sizing
    // Main title text in the top half
    const titleParts = [`${playerName.toUpperCase()}'S`, "CUSTOM ELITE", "SHOOTING PROGRAM"]

    titleParts.forEach((part, index) => {
      const fontSize = getResponsiveFontSize(part, pageWidth - 40, 48)
      doc.setFontSize(fontSize)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(255, 255, 255) // White text
      doc.text(part, pageWidth / 2, 70 + index * 30, { align: "center" })
    })

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

    // ===== COURSE OUTLINE PAGE =====
    doc.addPage()

    // Add a subtle header background
    doc.setFillColor(colors.veryLightBlue[0], colors.veryLightBlue[1], colors.veryLightBlue[2])
    doc.rect(0, 0, pageWidth, 50, "F")

    // Course Outline Title
    doc.setFontSize(24)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2])
    doc.text("COURSE OUTLINE", pageWidth / 2, 30, { align: "center" })

    // Subtitle with player name
    doc.setFontSize(16)
    doc.setFont("helvetica", "italic")
    doc.setTextColor(colors.darkGray[0], colors.darkGray[1], colors.darkGray[2])
    doc.text(`Personalized for ${playerName}`, pageWidth / 2, 45, { align: "center" })

    // Draw a line under the header
    drawLine(doc, margin, 55, pageWidth - margin, 55, 0.75, colors.accent)

    // Start position for content
    let outlineY = 70

    // Introduction text
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(colors.darkGray[0], colors.darkGray[1], colors.darkGray[2])

    // Add a brief explanation of the course structure
    const courseExplanation =
      "This 14-day program is designed to systematically address your shooting issues through targeted drills and progressive training. The program is divided into two phases:"
    const explanationLines = doc.splitTextToSize(courseExplanation, contentWidth)
    explanationLines.forEach((line) => {
      doc.text(line, margin, outlineY)
      outlineY += 6
    })
    outlineY += 10

    // Phase descriptions
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2])
    doc.text("Phase 1 (Days 1-7): Foundation Building", margin, outlineY)
    outlineY += 8

    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(colors.darkGray[0], colors.darkGray[1], colors.darkGray[2])
    const phase1Text =
      "Focus on establishing proper mechanics and building a strong technical foundation. These days emphasize deliberate practice of fundamental movements to correct your specific shooting flaws."
    const phase1Lines = doc.splitTextToSize(phase1Text, contentWidth)
    phase1Lines.forEach((line) => {
      doc.text(line, margin, outlineY)
      outlineY += 6
    })
    outlineY += 10

    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2])
    doc.text("Phase 2 (Days 8-14): Application & Game Transfer", margin, outlineY)
    outlineY += 8

    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(colors.darkGray[0], colors.darkGray[1], colors.darkGray[2])
    const phase2Text =
      "Apply your improved mechanics in more game-like situations. These days incorporate movement, decision-making, and pressure elements to help transfer your technical improvements to actual gameplay."
    const phase2Lines = doc.splitTextToSize(phase2Text, contentWidth)
    phase2Lines.forEach((line) => {
      doc.text(line, margin, outlineY)
      outlineY += 6
    })
    outlineY += 15

    // Daily overview section
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2])
    doc.text("Daily Overview", margin, outlineY)
    outlineY += 10

    // Create a table-like structure for the daily overview
    const dayWidth = 15
    const titleWidth = contentWidth - dayWidth - 10

    // Table header with solid color
    doc.setFillColor(123, 175, 212) // Solid accent blue color
    doc.rect(margin, outlineY - 6, dayWidth, 8, "F")
    doc.rect(margin + dayWidth, outlineY - 6, titleWidth, 8, "F")

    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(0, 0, 0) // Black text for header
    doc.text("Day", margin + 3, outlineY)
    doc.text("Focus", margin + dayWidth + 5, outlineY)
    outlineY += 4

    // Draw a line under the header
    drawLine(doc, margin, outlineY, margin + dayWidth + titleWidth, outlineY, 0.5, colors.accent)
    outlineY += 6

    // List each day with its title
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")

    courseData.days.forEach((day, index) => {
      // Check if we need a new page
      if (outlineY > pageHeight - 30) {
        doc.addPage()

        // Add a subtle header background
        doc.setFillColor(colors.veryLightBlue[0], colors.veryLightBlue[1], colors.veryLightBlue[2])
        doc.rect(0, 0, pageWidth, 30, "F")

        // Continue Course Outline title
        doc.setFontSize(18)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2])
        doc.text("COURSE OUTLINE (CONTINUED)", pageWidth / 2, 20, { align: "center" })

        // Reset Y position
        outlineY = 40

        // Redraw table header with solid color
        doc.setFillColor(123, 175, 212) // Solid accent blue color
        doc.rect(margin, outlineY - 6, dayWidth, 8, "F")
        doc.rect(margin + dayWidth, outlineY - 6, titleWidth, 8, "F")

        doc.setFontSize(11)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(0, 0, 0) // Black text for header
        doc.text("Day", margin + 3, outlineY)
        doc.text("Focus", margin + dayWidth + 5, outlineY)
        outlineY += 4

        // Draw a line under the header
        drawLine(doc, margin, outlineY, margin + dayWidth + titleWidth, outlineY, 0.5, colors.accent)
        outlineY += 6

        // Reset font for content
        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
      }

      // Alternate row background for better readability with solid colors
      if (index % 2 === 0) {
        // Light blue for even rows (no opacity)
        doc.setFillColor(200, 220, 240) // Lighter solid blue
        doc.rect(margin, outlineY - 5, dayWidth + titleWidth, 7, "F")
      } else {
        // Slightly darker blue for odd rows (no opacity)
        doc.setFillColor(170, 200, 230) // Darker solid blue
        doc.rect(margin, outlineY - 5, dayWidth + titleWidth, 7, "F")
      }

      // Day number
      doc.setTextColor(0, 0, 0) // Black text for day number
      doc.text(`Day ${day.day}`, margin + 3, outlineY)

      // Day title - remove "Day X: " prefix if it exists
      let dayTitle = day.title
      if (dayTitle.startsWith(`Day ${day.day}:`)) {
        dayTitle = dayTitle.substring(`Day ${day.day}:`.length).trim()
      } else if (dayTitle.startsWith(`Day ${day.day}`)) {
        dayTitle = dayTitle.substring(`Day ${day.day}`.length).trim()
      }

      // If title is still too long, truncate it
      if (dayTitle.length > 60) {
        dayTitle = dayTitle.substring(0, 57) + "..."
      }

      doc.text(dayTitle, margin + dayWidth + 5, outlineY)
      outlineY += 7

      // Add a subtle line between rows
      drawLine(doc, margin, outlineY - 2, margin + dayWidth + titleWidth, outlineY - 2, 0.2, colors.lightGray)
    })

    // Add a note about the issues being addressed
    outlineY += 15
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2])
    doc.text("Issues Addressed:", margin, outlineY)
    outlineY += 8

    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2])
    courseData.issues.forEach((issue) => {
      doc.text("- " + issue, margin, outlineY)
      outlineY += 6
    })

    // ===== INTRODUCTION PAGE =====
    // Skip the introduction page entirely - we'll go straight to the daily training pages

    // Find the section in the generatePdf function where we handle the daily training pages
    // Replace the entire daily training pages loop with this improved version that prevents blank pages

    // ===== DAILY TRAINING PAGES =====
    let y = 0
    for (let i = 0; i < courseData.days.length; i++) {
      const day = courseData.days[i]
      const dayNumber = day.day || i + 1 // Use day.day if available, otherwise use index + 1
      const isFirstDay = i === 0 // Flag to identify Day 1

      // Only add a new page if this isn't the first day (first day follows intro page)
      // Always add a new page for each day since we removed the intro page
      // First day should come right after the course outline page
      doc.addPage()

      // Add a subtle header background
      doc.setFillColor(colors.veryLightBlue[0], colors.veryLightBlue[1], colors.veryLightBlue[2])
      doc.rect(0, 0, pageWidth, 50, "F")

      // Start position for content - consistent header positioning
      y = 30

      // Day Title with improved wrapping
      const dayTitleFontSize = getResponsiveFontSize(day.title, contentWidth - 10, 22)
      doc.setFontSize(dayTitleFontSize)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2])

      // Split day title if needed
      const dayTitleLines = doc.splitTextToSize(day.title, contentWidth - 5)
      dayTitleLines.forEach((line, index) => {
        doc.text(line, margin, y + index * 10)
      })
      y += dayTitleLines.length * 10 + 4

      // Day Description - CRITICAL FIX: Keep it very brief to avoid overlap
      doc.setFontSize(12)
      doc.setFont("helvetica", "italic")
      doc.setTextColor(colors.black[0], colors.black[1], colors.black[2])

      // Only use the first sentence of the description to avoid text being cut off
      const firstDescriptionLine = day.description.split(".")[0] + "."
      const descriptionLines = doc.splitTextToSize(firstDescriptionLine, contentWidth)
      descriptionLines.forEach((line) => {
        doc.text(line, margin, y)
        y += 6
      })

      // Calculate header height and enforce consistent spacing
      const headerEndPosition = y

      // CRITICAL FIX: For Day 1, completely skip any introduction text
      // This prevents the course introduction from being displayed on Day 1
      if (isFirstDay) {
        // Force a much larger spacing for Day 1 to avoid any overlap with introduction text
        y = headerEndPosition + 70 // Greatly increased spacing for Day 1 only
      } else {
        // Normal spacing for other days
        y = headerEndPosition + 25
      }

      // Remove separator line completely

      // Rest of the code remains the same...
      // Drills for the Day - CRITICAL FIX: We need to ensure the first drill is on the same page
      if (day.drills && day.drills.length > 0) {
        // Process each drill
        for (let drillIndex = 0; drillIndex < day.drills.length; drillIndex++) {
          const drill = day.drills[drillIndex]
          const drillBoxWidth = contentWidth

          // First, calculate the height of the drill box without actually drawing it
          const tempDoc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
          })
          const estimatedHeight = createDrillBox(tempDoc, 0, 0, drillBoxWidth, drill, playerInfo.name, dayNumber)

          // Check if we need a new page - more precise calculation with a larger margin
          // IMPORTANT: For the first drill of each day, we'll be more aggressive about keeping it on the same page
          // by using a higher threshold for the page break
          const isFirstDrill = drillIndex === 0
          const pageBreakThreshold = isFirstDrill ? pageHeight - 100 : pageHeight - 30

          if (y + estimatedHeight + 30 > pageBreakThreshold) {
            // If this is the first drill and we're about to create a new page,
            // we need to make sure we don't leave the previous page blank with just a header
            if (isFirstDrill) {
              // We're at the first drill and need a new page - this means the header would be alone
              // Let's reduce the spacing or font size to try to fit it on the current page
              y = 40 // Reduce the starting position to give more space

              // If it still won't fit, then we have to add a new page
              if (y + estimatedHeight + 20 > pageHeight - 50) {
                doc.addPage()

                // Add the subtle header background on the new page
                doc.setFillColor(colors.veryLightBlue[0], colors.veryLightBlue[1], colors.veryLightBlue[2])
                doc.rect(0, 0, pageWidth, 40, "F") // Reduced header height

                // Add day title on the new page (more compact)
                doc.setFontSize(16)
                doc.setFont("helvetica", "bold")
                doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2])
                doc.text(`${day.title} (continued)`, margin, 25)

                // Ensure exactly 15mm spacing after the header on continued pages
                const continuedHeaderHeight = 40
                y = enforceHeaderContentSpacing(doc, continuedHeaderHeight)
              }
            } else {
              // Not the first drill, so we can add a new page normally
              doc.addPage()

              // Add the subtle header background on the new page
              doc.setFillColor(colors.veryLightBlue[0], colors.veryLightBlue[1], colors.veryLightBlue[2])
              doc.rect(0, 0, pageWidth, 40, "F") // Reduced header height

              // Add day title on the continued page
              doc.setFontSize(16)
              doc.setFont("helvetica", "bold")
              doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2])
              doc.text(`${day.title} (continued)`, margin, 25)

              // Ensure exactly 15mm spacing after the header on continued pages
              const continuedHeaderHeight = 40
              y = enforceHeaderContentSpacing(doc, continuedHeaderHeight)
            }
          }

          // CRITICAL FIX: For the first drill of each day, ensure proper spacing
          if (drillIndex === 0) {
            // Double-check that we have proper spacing from header
            const minYPosition = headerEndPosition + 15 // Minimum 15mm from header end
            if (y < minYPosition) {
              y = minYPosition // Force minimum spacing
            }

            // No visual indicators
          }

          // Now create the actual drill box
          const drillBoxHeight = createDrillBox(doc, margin, y, drillBoxWidth, drill, playerInfo.name, dayNumber)

          // Standardized spacing between drill boxes
          y += drillBoxHeight + 20
        }
      } else {
        // No drills for this day - add a placeholder message
        doc.setFontSize(12)
        doc.setFont("helvetica", "italic")
        doc.setTextColor(colors.mediumGray[0], colors.mediumGray[1], colors.mediumGray[2])
        doc.text("No drills scheduled for this day. Use this time for recovery or review.", margin, y)
        y += 20
      }

      // Day Notes
      // Generate custom coaches notes
      const customCoachesNotes = generateCoachesNotes(day, dayNumber, playerName)

      // More precise page break check for notes
      if (y + 200 > pageHeight - 30) {
        // Use a conservative height estimate
        doc.addPage()

        // Add the subtle header background on the new page
        doc.setFillColor(colors.veryLightBlue[0], colors.veryLightBlue[1], colors.veryLightBlue[2])
        doc.rect(0, 0, pageWidth, 40, "F")

        // Add day title on the continued page
        doc.setFontSize(16)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2])
        doc.text(`${day.title} - Coach's Notes`, margin, 25)

        // Ensure exactly 15mm spacing after the header on continued pages
        const continuedHeaderHeight = 40
        y = enforceHeaderContentSpacing(doc, continuedHeaderHeight)
      }

      // Store the starting y position
      const notesStartY = y
      y += 15 // Space before notes

      // Split the notes text with a narrower width to ensure it fits
      const maxNotesWidth = contentWidth - 40 // Narrower width with more margin
      const customNotesLines = doc.splitTextToSize(customCoachesNotes, maxNotesWidth)

      // Calculate the total height needed for the notes
      const notesContentHeight = customNotesLines.length * 7 + 50 // Text height + padding

      // Draw the background rectangle first
      doc.setFillColor(colors.veryLightBlue[0], colors.veryLightBlue[1], colors.veryLightBlue[2])
      doc.roundedRect(margin, notesStartY, contentWidth, notesContentHeight, 4, 4, "F")

      // Add a subtle border
      doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2], 0.3)
      doc.setLineWidth(0.5)
      doc.roundedRect(margin, notesStartY, contentWidth, notesContentHeight, 4, 4, "S")

      // Notes title
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2])
      doc.text("COACH'S NOTES:", margin + 10, notesStartY + 20)

      // Notes content
      doc.setFontSize(12)
      doc.setFont("helvetica", "normal")
      doc.setTextColor(colors.darkGray[0], colors.darkGray[1], colors.darkGray[2])

      // Draw each line with proper positioning
      let currentY = notesStartY + 40 // Start position after title
      customNotesLines.forEach((line) => {
        doc.text(line, margin + 15, currentY)
        currentY += 7 // Line spacing
      })

      // Update y position for next content
      y = notesStartY + notesContentHeight + 15
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
