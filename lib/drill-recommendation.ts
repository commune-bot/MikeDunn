import type { ShootingIssue } from "./shooting-analysis"
import { type VideoEntry, videoDatabase, loomExplanationVideos } from "./video-database"

export interface DrillProgression {
  beginner: string[]
  intermediate: string[]
  advanced: string[]
}

export interface DrillRecommendation {
  drillId: string
  drillTitle: string
  targetIssue: string
  relevanceScore: number
  explanation: string
  video?: VideoEntry
  category: "foundation" | "movement" | "application" | "conditioning"
  complexity: number
}

// Enhanced drill categorization for better workout flow
const drillCategories = {
  foundation: [
    "1 Hand Shooting",
    "Guide Hand Positioning (KSS)",
    "Form Shooting",
    "Ball Raises",
    "Free Throws",
    "Wide Stance Shots",
    "Stabilize The Shooting Elbow",
    "3 Exercises to Stabilize Elbow and Keep Ball Moving",
    "Ball Does Not Stop (KSS)",
    "Wrist Flips",
    "Layering in the Guide Hand",
    "Adding Guide Hand - One Hand Shots",
  ],
  movement: [
    "1 2 Through",
    "1 2 Step With Drop",
    "Jump Turns With Pass",
    "Dribble 1-2 Step",
    "Pullback 1-2 Step",
    "90 Degree 1 Position Turn",
    "180 Degree 1 Position Turn",
    "Cliff Walk (1 Position)",
    "Forward 1 Position Jog",
    "Backward 1 Position Jog",
  ],
  application: [
    "Catch and Shoot With Pass Fake",
    "Jump Turns With A Pass",
    "Momentum Shots",
    "Sprint to Corner",
    "Lateral Movement into DDS",
    "Ghost Screen into Back Pedal",
    "Rollouts",
    "Catch and Shoot (Drop, Left Right, Right Left)",
    "Backpedal Catch and Shoot",
  ],
  conditioning: [
    "Rapid Fire 1 Minute @ Each of 5 Spots",
    "100 3's",
    "Wiper Shooting",
    "3 Minute 3's",
    "3 in a Row 5 Spots",
    "2 In a Row 5 Spots",
    "The Gauntlet",
    "Full Court Threes",
  ],
}

// Map of issue IDs to recommended drill progressions with better flow structure
const issueToDrillMap: Record<string, DrillProgression> = {
  "inconsistent-release": {
    beginner: ["1 Hand Shooting", "Guide Hand Positioning (KSS)", "Ball Raises"],
    intermediate: ["Stabilize The Shooting Elbow", "Ball Does Not Stop (KSS)", "1 2 Through"],
    advanced: ["Catch and Shoot With Pass Fake", "Jump Turns With Pass", "Momentum Shots"],
  },
  "poor-follow-through": {
    beginner: ["1 Hand Shooting", "3 Exercises to Stabilize Elbow and Keep Ball Moving", "Free Throws"],
    intermediate: ["Ball Does Not Stop (KSS)", "Stabilize The Shooting Elbow", "1 2 Through"],
    advanced: ["Catch and Shoot With Pass Fake", "Momentum Shots", "Jump Turns With A Pass"],
  },
  "guide-hand-interference": {
    beginner: ["1 Hand Shooting", "Guide Hand Positioning (KSS)", "Layering in the Guide Hand"],
    intermediate: ["Ball Does Not Stop (KSS)", "Adding Guide Hand - One Hand Shots", "1 2 Through"],
    advanced: ["Catch and Shoot With Pass Fake", "Jump Turns With Pass", "Momentum Shots"],
  },
  "thumb-flick": {
    beginner: ["Guide Hand Positioning (KSS)", "1 Hand Shooting", "Wrist Flips"],
    intermediate: ["Ball Does Not Stop (KSS)", "Stabilize The Shooting Elbow", "Free Throws"],
    advanced: ["Catch and Shoot With Pass Fake", "Jump Turns With Pass", "Momentum Shots"],
  },
  "low-arc": {
    beginner: ["Skinny Side Backboard Shots", "Flat Side Backboard Shots", "Ball Raises"],
    intermediate: ["1 Hand Shooting", "High Ball Drop", "Free Throws"],
    advanced: ["Catch and Shoot With Pass Fake", "Momentum Shots", "Jump Turns With A Pass"],
  },
  "elbow-alignment": {
    beginner: [
      "Stabilize The Shooting Elbow",
      "3 Exercises to Stabilize Elbow and Keep Ball Moving",
      "Wide Stance Shots",
    ],
    intermediate: ["1 2 Through", "Ball Does Not Stop (KSS)", "Free Throws"],
    advanced: ["Catch and Shoot With Pass Fake", "Jump Turns With Pass", "Momentum Shots"],
  },
  "balance-issues": {
    beginner: ["Wide Stance Shots", "1 Foot Drops", "1 Foot Elevator Drops"],
    intermediate: ["1 2 Step With Drop", "Jump Turns With Pass", "90 Degree 1 Position Turn"],
    advanced: ["Sprint to Corner", "Lateral Movement into DDS", "Ghost Screen into Back Pedal"],
  },
  footwork: {
    beginner: ["1 2 Step With Drop", "1 2 Through", "Wide Stance Shots"],
    intermediate: ["Jump Turns With Pass", "Dribble 1-2 Step", "90 Degree 1 Position Turn"],
    advanced: ["Sprint to Corner", "Lateral Movement into DDS", "180 Degree 1 Position Turn"],
  },
  "base-width": {
    beginner: ["Wide Stance Shots", "1 2 Step With Drop", "Free Throws"],
    intermediate: ["Jump Turns With Pass", "1 Foot Drops", "1 2 Through"],
    advanced: ["Momentum Shots", "Jump Turns With A Pass", "Sprint to Corner"],
  },
  rhythm: {
    beginner: ["Ball Does Not Stop (KSS)", "1 2 Through", "Ball Raises"],
    intermediate: ["Slow Motion 1-2-Thru @ Hoop", "1-2-Thru With Stop at Hoop", "High Ball Drop"],
    advanced: ["Momentum Shots", "Catch and Shoot With Pass Fake", "Jump Turns With A Pass"],
  },
  dipping: {
    beginner: ["Ball Raises", "High Ball Drop", "Ball Does Not Stop (KSS)"],
    intermediate: ["1 2 Through", "Pullback with Drop", "Free Throws"],
    advanced: ["Catch and Shoot With Pass Fake", "Momentum Shots", "Jump Turns With Pass"],
  },
  "shot-pocket": {
    beginner: ["Ball Raises", "High Ball Drop", "Pullback with Drop"],
    intermediate: ["1 2 Through", "Ball Does Not Stop (KSS)", "Free Throws"],
    advanced: ["Catch and Shoot With Pass Fake", "Momentum Shots", "Jump Turns With Pass"],
  },
  "wrist-snap": {
    beginner: ["1 Hand Shooting", "Wrist Flips", "Free Throws"],
    intermediate: ["Ball Does Not Stop (KSS)", "Stabilize The Shooting Elbow", "1 2 Through"],
    advanced: ["Catch and Shoot With Pass Fake", "Momentum Shots", "Jump Turns With A Pass"],
  },
  alignment: {
    beginner: ["Wide Stance Shots", "Free Throws", "1 2 Step With Drop"],
    intermediate: ["Jump Turns With Pass", "1 2 Through", "90 Degree 1 Position Turn"],
    advanced: ["Momentum Shots", "Jump Turns With A Pass", "Catch and Shoot With Pass Fake"],
  },
  rushing: {
    beginner: ["Free Throws", "Slow Motion 1-2-Thru @ Hoop", "1 2 Through"],
    intermediate: ["1-2-Thru With Stop at Hoop", "Ball Does Not Stop (KSS)", "High Ball Drop"],
    advanced: ["Catch and Shoot With Pass Fake", "Jump Turns With Pass", "Momentum Shots"],
  },
  "game-transfer": {
    beginner: ["Free Throws", "Catch and Shoot With Pass Fake", "Jump Turns With Pass"],
    intermediate: ["Momentum Shots", "Jump Turns With A Pass", "Sprint to Corner"],
    advanced: ["Lateral Movement into DDS", "Ghost Screen into Back Pedal", "The Gauntlet"],
  },
  consistency: {
    beginner: ["Free Throws", "1 Hand Shooting", "Ball Does Not Stop (KSS)"],
    intermediate: ["1 2 Through", "Ball Raises", "Rapid Fire 1 Minute @ Each of 5 Spots"],
    advanced: ["100 3's", "3 Minute 3's", "The Gauntlet"],
  },
  "power-generation": {
    beginner: ["1 2 Step With Drop", "Wide Stance Shots", "High Ball Drop"],
    intermediate: ["1 2 Through", "Jump Turns With Pass", "Momentum Shots"],
    advanced: ["Sprint to Corner", "Jump Turns With A Pass", "Lateral Movement into DDS"],
  },
  "off-hand-placement": {
    beginner: ["Guide Hand Positioning (KSS)", "1 Hand Shooting", "Layering in the Guide Hand"],
    intermediate: ["Ball Does Not Stop (KSS)", "Adding Guide Hand - One Hand Shots", "Free Throws"],
    advanced: ["Catch and Shoot With Pass Fake", "Jump Turns With Pass", "Momentum Shots"],
  },
  "ball-position": {
    beginner: ["Ball Raises", "High Ball Drop", "Pullback with Drop"],
    intermediate: ["1 2 Through", "Ball Does Not Stop (KSS)", "Free Throws"],
    advanced: ["Catch and Shoot With Pass Fake", "Momentum Shots", "Jump Turns With Pass"],
  },
}

// Function to find video for a drill, checking both databases
function findVideoForDrill(drillTitle: string): VideoEntry | undefined {
  // First check the main video database
  let video = videoDatabase.find((v) => v.title === drillTitle)

  if (video) {
    return video
  }

  // If not found, check for partial matches in main database
  video = videoDatabase.find(
    (v) =>
      v.title.toLowerCase().includes(drillTitle.toLowerCase()) ||
      drillTitle.toLowerCase().includes(v.title.toLowerCase()),
  )

  if (video) {
    return video
  }

  // Check the Loom explanation videos
  video = loomExplanationVideos.find((v) => v.title === drillTitle)

  if (video) {
    return video
  }

  // Check for partial matches in Loom videos
  video = loomExplanationVideos.find(
    (v) =>
      v.title.toLowerCase().includes(drillTitle.toLowerCase()) ||
      drillTitle.toLowerCase().includes(v.title.toLowerCase()),
  )

  if (video) {
    return video
  }

  // If still no match, create a fallback video entry
  return {
    title: `${drillTitle} Demonstration`,
    description: `Video demonstration of the ${drillTitle} drill`,
    url: "https://youtu.be/8MyR2srjCRA", // Default to Free Throws video as fallback
    type: "youtube",
  }
}

// Function to categorize a drill
function categorizeDrill(drillTitle: string): "foundation" | "movement" | "application" | "conditioning" {
  for (const [category, drills] of Object.entries(drillCategories)) {
    if (drills.includes(drillTitle)) {
      return category as "foundation" | "movement" | "application" | "conditioning"
    }
  }

  // Default categorization based on drill name
  const lowerTitle = drillTitle.toLowerCase()
  if (lowerTitle.includes("form") || lowerTitle.includes("hand") || lowerTitle.includes("stance")) {
    return "foundation"
  } else if (lowerTitle.includes("step") || lowerTitle.includes("turn") || lowerTitle.includes("position")) {
    return "movement"
  } else if (lowerTitle.includes("catch") || lowerTitle.includes("sprint") || lowerTitle.includes("game")) {
    return "application"
  } else {
    return "conditioning"
  }
}

// Function to assign complexity score (1-10, where 1 is simplest)
function getComplexityScore(drillTitle: string, category: string): number {
  const complexityMap = {
    foundation: {
      "1 Hand Shooting": 1,
      "Guide Hand Positioning (KSS)": 2,
      "Form Shooting": 1,
      "Ball Raises": 2,
      "Free Throws": 1,
      "Wide Stance Shots": 2,
      "Stabilize The Shooting Elbow": 3,
      "3 Exercises to Stabilize Elbow and Keep Ball Moving": 4,
      "Ball Does Not Stop (KSS)": 3,
      "Wrist Flips": 2,
    },
    movement: {
      "1 2 Through": 3,
      "1 2 Step With Drop": 4,
      "Jump Turns With Pass": 5,
      "Dribble 1-2 Step": 4,
      "Pullback 1-2 Step": 5,
      "90 Degree 1 Position Turn": 4,
      "180 Degree 1 Position Turn": 6,
    },
    application: {
      "Catch and Shoot With Pass Fake": 6,
      "Jump Turns With A Pass": 7,
      "Momentum Shots": 5,
      "Sprint to Corner": 6,
      "Lateral Movement into DDS": 7,
      "Ghost Screen into Back Pedal": 8,
    },
    conditioning: {
      "Rapid Fire 1 Minute @ Each of 5 Spots": 7,
      "100 3's": 8,
      "The Gauntlet": 10,
    },
  }

  return complexityMap[category]?.[drillTitle] || 5 // Default to medium complexity
}

// Explanations for why each drill helps with specific issues
const drillExplanations: Record<string, Record<string, string>> = {
  "1 Hand Shooting": {
    "guide-hand-interference":
      "Removes the guide hand entirely, allowing you to focus on proper shooting hand mechanics without interference.",
    "thumb-flick": "Isolates the shooting hand, helping you develop proper finger control and eliminate thumb pushing.",
    "inconsistent-release":
      "Simplifies the shooting motion by removing variables, helping you develop a consistent release point.",
    "poor-follow-through":
      "Allows you to focus exclusively on proper wrist snap and follow-through without guide hand distractions.",
    default: "Isolates the shooting hand to develop proper form and feel without the complexity of the guide hand.",
  },
  "Guide Hand Positioning (KSS)": {
    "guide-hand-interference":
      "Teaches the correct placement and role of the guide hand to prevent it from affecting the shot.",
    "thumb-flick": "Helps eliminate thumb influence by establishing proper guide hand position early in the shot.",
    "off-hand-placement":
      "Directly addresses proper positioning of the non-shooting hand to support without interfering.",
    default: "Establishes proper guide hand position to support the ball without affecting the shot trajectory.",
  },
  "Form Shooting": {
    "inconsistent-release":
      "Builds muscle memory for a consistent release point through repetition of proper mechanics.",
    "poor-follow-through": "Emphasizes holding the follow-through position to develop proper finishing mechanics.",
    consistency: "Develops a repeatable shooting motion through focused repetition of proper mechanics.",
    default: "Establishes fundamental shooting mechanics through deliberate practice of proper form.",
  },
  "Ball Raises": {
    "shot-pocket": "Develops a consistent starting position for your shot by focusing on proper ball positioning.",
    dipping: "Teaches proper upward ball movement without unnecessary dipping motion.",
    "ball-position": "Establishes the correct relationship between the ball and your body throughout the shot.",
    default: "Develops proper ball positioning and upward movement to start your shooting motion.",
  },
  "Wide Stance Shots": {
    "balance-issues": "Creates a stable base to develop balance awareness during the shooting motion.",
    "base-width": "Directly addresses stance width to improve stability and balance.",
    alignment: "Helps establish proper body alignment with the basket through a stable stance.",
    default: "Improves stability and balance through a wider, more controlled stance.",
  },
  "Stabilize The Shooting Elbow": {
    "elbow-alignment": "Directly addresses proper elbow positioning and stability throughout the shot.",
    "inconsistent-release": "Stabilizing the elbow helps create a consistent release point for better accuracy.",
    "low-arc": "Proper elbow alignment contributes to better arc on the shot.",
    default: "Develops proper elbow alignment and stability for a more consistent shooting motion.",
  },
  "1 2 Through": {
    rhythm: "Develops fluid timing and sequencing in your shooting motion.",
    consistency: "Establishes a repeatable shooting sequence for greater consistency.",
    "shot-pocket": "Reinforces proper ball positioning throughout the shooting motion.",
    default: "Develops proper sequencing and rhythm in your shooting motion for greater consistency.",
  },
  "Ball Does Not Stop (KSS)": {
    rhythm: "Promotes continuous ball movement for a smoother, more fluid shooting motion.",
    dipping: "Eliminates unnecessary pauses or dips by keeping the ball in constant motion.",
    "guide-hand-interference":
      "Focuses on continuous upward movement, reducing opportunities for guide hand interference.",
    default: "Develops fluid ball movement throughout the shot for better rhythm and timing.",
  },
  "3 Exercises to Stabilize Elbow and Keep Ball Moving": {
    "elbow-alignment": "Directly addresses elbow stability and positioning through targeted exercises.",
    rhythm: "Promotes continuous ball movement for a smoother, more fluid shooting motion.",
    "poor-follow-through": "Develops proper follow-through mechanics by focusing on the end of the shot.",
    default: "Improves elbow stability and continuous ball movement for a more consistent shot.",
  },
  "Free Throws": {
    consistency: "Develops a repeatable routine and shooting motion through focused repetition.",
    "poor-follow-through": "Provides a controlled environment to focus on proper follow-through mechanics.",
    alignment: "Reinforces proper alignment with the basket in a controlled setting.",
    default: "Builds consistency and mental focus through repetition of the same shot.",
  },
  "Jump Turns With Pass": {
    footwork: "Develops proper footwork and balance when turning to receive a pass.",
    "balance-issues": "Challenges balance while incorporating movement similar to game situations.",
    "game-transfer": "Simulates game-like movements to help transfer skills to competition.",
    default: "Improves footwork, balance, and shooting readiness after movement.",
  },
  "Catch and Shoot With Pass Fake": {
    "game-transfer": "Simulates game-like decision-making and shooting under pressure.",
    rushing: "Teaches proper preparation and timing when making quick decisions.",
    rhythm: "Develops fluid timing between the fake and the shot.",
    default: "Improves shooting readiness and decision-making in game-like situations.",
  },
  "Momentum Shots": {
    "game-transfer": "Simulates shooting while moving, as often required in games.",
    "power-generation": "Teaches how to harness momentum to generate power efficiently.",
    "balance-issues": "Challenges balance while incorporating forward momentum.",
    default: "Develops the ability to shoot accurately while moving, as required in games.",
  },
  "Jump Turns With A Pass": {
    footwork: "Develops advanced footwork when turning to receive a pass.",
    "game-transfer": "Simulates game-like movements and decision-making under pressure.",
    "balance-issues": "Challenges balance during complex movements similar to game situations.",
    default: "Improves footwork, balance, and shooting readiness after complex movements.",
  },
  "1 2 Step With Drop": {
    footwork: "Develops proper stepping pattern and timing for shooting off movement.",
    "balance-issues": "Improves balance when transitioning from movement to shooting.",
    "power-generation": "Teaches efficient power transfer from legs to upper body.",
    default: "Improves footwork and balance when shooting after movement.",
  },
  "1 Foot Drops": {
    "balance-issues": "Isolates balance on a single foot to develop greater stability awareness.",
    "base-width": "Simplifies the base to focus on proper weight distribution and balance.",
    default: "Develops balance awareness by isolating weight distribution on a single foot.",
  },
  "1 Foot Elevator Drops": {
    "balance-issues": "Progressively challenges balance through controlled lowering movements.",
    "base-width": "Develops awareness of weight distribution when transitioning between feet.",
    default: "Improves balance and weight distribution awareness through controlled movements.",
  },
  "90 Degree 1 Position Turn": {
    "balance-issues": "Challenges balance during turning movements.",
    footwork: "Develops footwork and balance when changing directions.",
    default: "Improves balance and body control during directional changes.",
  },
  "180 Degree 1 Position Turn": {
    "balance-issues": "Challenges balance during significant directional changes.",
    footwork: "Develops footwork and body control during turning movements.",
    default: "Improves balance and body control during major directional changes.",
  },
  "Sprint to Corner": {
    "game-transfer": "Simulates game-like sprinting to spot-up positions.",
    footwork: "Develops proper footwork when transitioning from sprinting to shooting.",
    default: "Improves shooting readiness and accuracy after sprinting to a spot.",
  },
  "Lateral Movement into DDS": {
    footwork: "Develops coordinated footwork during lateral movement into a shot.",
    "game-transfer": "Simulates game-like lateral movement followed by shooting.",
    default: "Improves footwork and shooting accuracy after lateral movement.",
  },
  "Ghost Screen into Back Pedal": {
    footwork: "Develops footwork when transitioning from forward to backward movement.",
    "game-transfer": "Simulates game-like screen reactions and movement patterns.",
    default: "Improves footwork and shooting readiness after complex movements.",
  },
  "High Ball Drop": {
    dipping: "Establishes a proper floor for the ball to prevent unnecessary dipping.",
    "shot-pocket": "Reinforces proper ball positioning at the start of the shot.",
    "ball-position": "Develops awareness of proper ball height throughout the shot.",
    default: "Improves ball positioning and prevents unnecessary dipping motion.",
  },
  "Pullback with Drop": {
    "shot-pocket": "Develops proper ball positioning when transitioning into the shot.",
    "ball-position": "Reinforces proper relationship between the ball and body.",
    default: "Improves ball positioning and preparation for the shot.",
  },
  "Skinny Side Backboard Shots": {
    "low-arc": "Develops proper shot arc by requiring precise trajectory to hit the target.",
    alignment: "Reinforces proper alignment and aim through challenging target practice.",
    default: "Improves shot arc and accuracy through precise target practice.",
  },
  "Flat Side Backboard Shots": {
    "low-arc": "Directly addresses shot arc by requiring proper trajectory to hit the target.",
    alignment: "Reinforces proper alignment and aim through target practice.",
    default: "Improves shot arc and accuracy through targeted practice.",
  },
  "Wrist Flips": {
    "wrist-snap": "Develops proper wrist flexion and finger control for better release.",
    "thumb-flick": "Helps eliminate thumb influence by focusing on proper finger action.",
    default: "Improves wrist action and finger control for a cleaner release.",
  },
  "Layering in the Guide Hand": {
    "guide-hand-interference": "Teaches gradual integration of the guide hand without interference.",
    "off-hand-placement": "Develops proper guide hand positioning through progressive training.",
    default: "Gradually integrates proper guide hand positioning into the shooting motion.",
  },
  "Adding Guide Hand - One Hand Shots": {
    "guide-hand-interference": "Teaches proper guide hand integration after establishing shooting hand mechanics.",
    "off-hand-placement": "Develops correct guide hand positioning and role.",
    default: "Integrates proper guide hand positioning after establishing shooting hand fundamentals.",
  },
  "Slow Motion 1-2-Thru @ Hoop": {
    rhythm: "Develops awareness of proper sequencing through slow-motion practice at the hoop.",
    rushing: "Teaches proper pacing and sequencing to prevent rushing.",
    default: "Improves shooting rhythm and sequencing through deliberate practice at the hoop.",
  },
  "1-2-Thru With Stop at Hoop": {
    rhythm: "Reinforces proper sequencing with a defined stopping point.",
    rushing: "Teaches proper preparation and timing before shooting.",
    default: "Improves shooting preparation and sequencing.",
  },
  "Dribble 1-2 Step": {
    footwork: "Develops proper stepping pattern when shooting off the dribble.",
    "balance-issues": "Improves balance when transitioning from dribble to shot.",
    default: "Improves footwork and balance when shooting off the dribble.",
  },
  "Pullback 1-2 Step": {
    footwork: "Develops proper footwork when creating space with a pullback dribble.",
    "balance-issues": "Improves balance when transitioning from movement to shooting.",
    default: "Improves footwork and balance when creating space before shooting.",
  },
  "Rapid Fire 1 Minute @ Each of 5 Spots": {
    consistency: "Challenges shooting consistency through timed repetition.",
    conditioning: "Develops shooting accuracy under time pressure and fatigue.",
    default: "Improves shooting consistency and conditioning through timed practice.",
  },
  "100 3's": {
    consistency: "Challenges shooting consistency through high-volume practice.",
    conditioning: "Develops shooting accuracy under fatigue.",
    default: "Improves shooting consistency and endurance through volume practice.",
  },
  "3 Minute 3's": {
    consistency: "Challenges shooting consistency under time pressure.",
    conditioning: "Develops shooting accuracy under fatigue and time constraints.",
    default: "Improves shooting consistency and conditioning under time pressure.",
  },
  "The Gauntlet": {
    "game-transfer": "Simulates high-pressure game situations with multiple challenges.",
    conditioning: "Develops shooting accuracy under extreme fatigue and pressure.",
    default: "Improves shooting performance under maximum pressure and fatigue.",
  },
}

// Function to generate personalized explanations for how each drill addresses the player's specific issues
function generatePersonalizedExplanation(
  drillTitle: string,
  issue: ShootingIssue | undefined,
  playerName: string,
  skillLevel: "beginner" | "intermediate" | "advanced",
  isFoundationalPhase: boolean,
): string {
  if (!issue) {
    return `This drill will help improve your overall shooting mechanics and consistency.`
  }

  // Get the base explanation for this drill and issue
  const baseExplanation =
    drillExplanations[drillTitle]?.[issue.id] ||
    drillExplanations[drillTitle]?.["default"] ||
    `Addresses ${issue.name} through targeted practice.`

  // Create variations for different skill levels
  const skillLevelPhrases = {
    beginner: [
      "As a beginner, this drill is perfect for establishing the fundamental mechanics needed to fix",
      "This foundational drill is designed to help beginners like you correct",
      "For someone just starting to address their shooting mechanics, this drill directly targets",
    ],
    intermediate: [
      "At your intermediate level, this drill will help refine and strengthen the mechanics needed to overcome",
      "This drill is particularly effective for intermediate players working to improve",
      "As you continue developing your shot, this exercise specifically addresses",
    ],
    advanced: [
      "For advanced players like yourself, this drill challenges and perfects the mechanics needed to eliminate",
      "This drill adds the complexity and game-speed elements needed for advanced players to overcome",
      "At your advanced level, this drill will help you fine-tune and perfect",
    ],
  }

  // Create variations for different training phases
  const phasePhrases = {
    foundational: [
      "During this foundational phase, we're focusing on establishing proper mechanics to address",
      "In this early stage of your training, this drill builds the mechanical foundation needed to correct",
      "This drill is part of the foundation-building process to fix",
    ],
    application: [
      "Now that we're in the application phase, this drill helps you apply the mechanics you've learned to overcome",
      "In this application phase, we're challenging you to maintain your improved mechanics while addressing",
      "This drill helps you apply your improved form in more game-like situations while still focusing on fixing",
    ],
  }

  // Mike Dunn style phrases
  const mikeDunnPhrases = [
    "Remember, be present with each rep. It's not just about doing, it's about being mindful while doing.",
    "The shot begins the moment you begin to move. Your preparation is everything.",
    "Sometimes the quickest way to get where you want to go is slowly. Master the fundamentals first.",
    "Shooting IS movement. The better you get at moving, the better you'll get at shooting.",
    "Be Ye Doers. Put in the work with intention and the results will follow.",
    "What separates many is not the willingness to work hard, it's the ability to work hard while also being mindful.",
    "The ball doesn't stop relative to the ground. Keep that upward momentum flowing through your shot.",
    "Empty your mind and take a white belt mentality into this drill.",
    "Progress in anything is not always linear. Trust the process.",
  ]

  // Create personalized outcome statements
  const outcomeStatements = [
    `${playerName}, you'll notice immediate feedback when you're executing this drill correctly, as your ${issue.name.toLowerCase()} will start to improve.`,
    `This is especially important for you, ${playerName}, because your ${issue.name.toLowerCase()} is directly affecting your shooting consistency.`,
    `${playerName}, as you practice this drill, pay particular attention to how it addresses your specific ${issue.name.toLowerCase()} issue.`,
    `You'll know you're making progress, ${playerName}, when you feel more comfortable and consistent with the mechanics this drill develops.`,
  ]

  // Select random variations to create a unique explanation
  const skillPhrase = skillLevelPhrases[skillLevel][Math.floor(Math.random() * skillLevelPhrases[skillLevel].length)]
  const phasePhrase =
    phasePhrases[isFoundationalPhase ? "foundational" : "application"][
      Math.floor(Math.random() * phasePhrases[isFoundationalPhase ? "foundational" : "application"].length)
    ]
  const outcome = outcomeStatements[Math.floor(Math.random() * outcomeStatements.length)]
  const mikeDunnPhrase = mikeDunnPhrases[Math.floor(Math.random() * mikeDunnPhrases.length)]

  // Combine the elements to create a personalized explanation
  return `${skillPhrase} ${issue.name.toLowerCase()}. ${baseExplanation} ${phasePhrase} ${issue.name.toLowerCase()}. ${outcome} ${mikeDunnPhrase}`
}

// Update the getDrillRecommendations function to include categorization and complexity
export function getDrillRecommendations(
  issues: ShootingIssue[],
  skillLevel: "beginner" | "intermediate" | "advanced" | "pro" = "intermediate",
): DrillRecommendation[] {
  // If skillLevel is "pro", treat it as "advanced"
  const normalizedSkillLevel = skillLevel === "pro" ? "advanced" : skillLevel

  const recommendations: DrillRecommendation[] = []

  // Process each issue with priority weighting
  issues.forEach((issue, issueIndex) => {
    // Primary issues (first in the list) get higher relevance
    const issuePriorityMultiplier = Math.max(1, 3 - issueIndex) // 3, 2, 1, 1, 1...

    // Get the appropriate drills for the skill level
    const drillsForIssue = issueToDrillMap[issue.id]?.[normalizedSkillLevel] || []

    // Add each drill to recommendations with explanations and improved relevance scoring
    drillsForIssue.forEach((drillTitle, drillIndex) => {
      // Find the video entry for this drill
      const video = findVideoForDrill(drillTitle)

      // Get the explanation for why this drill helps with this issue
      const explanation =
        drillExplanations[drillTitle]?.[issue.id] ||
        drillExplanations[drillTitle]?.["default"] ||
        `Addresses ${issue.name} through targeted practice.`

      // Calculate relevance score based on issue priority and drill position
      // Drills earlier in the list for each issue are considered more relevant
      const positionScore = Math.max(1, 5 - drillIndex) / 5 // 1.0, 0.8, 0.6, 0.4, 0.2...
      const relevanceScore = issuePriorityMultiplier * positionScore

      // Categorize the drill and get complexity
      const category = categorizeDrill(drillTitle)
      const complexity = getComplexityScore(drillTitle, category)

      // Check if this drill is already in recommendations
      const existingRec = recommendations.find((rec) => rec.drillTitle === drillTitle)

      if (existingRec) {
        // If this drill addresses multiple issues, increase its relevance score
        // and update the explanation to mention both issues
        existingRec.relevanceScore += relevanceScore * 0.5 // Add half the score to avoid overweighting
        existingRec.explanation = `This drill addresses multiple issues including ${issue.name} and ${issues.find((i) => i.id === existingRec.targetIssue)?.name}.`
      } else {
        // Add to recommendations
        recommendations.push({
          drillId: drillTitle.toLowerCase().replace(/\s+/g, "-"),
          drillTitle,
          targetIssue: issue.id,
          relevanceScore,
          explanation,
          video,
          category,
          complexity,
        })
      }
    })
  })

  // Sort by relevance score (higher scores first)
  return recommendations.sort((a, b) => b.relevanceScore - a.relevanceScore)
}

// PERFECTED: This function now creates a highly targeted workout flow.
// It prioritizes drills for the day's primary issue and arranges them logically.
function createTargetedWorkoutFlow(
  primaryIssueDrills: DrillRecommendation[],
  secondaryIssueDrills: DrillRecommendation[],
  isWeek1: boolean,
  dayNumber: number,
): DrillRecommendation[] {
  const targetDrills = 5
  const flowOrder = isWeek1
    ? ["foundation", "foundation", "movement", "foundation", "conditioning"]
    : ["foundation", "movement", "application", "application", "conditioning"]

  const selectedDrills: DrillRecommendation[] = []
  const usedDrills = new Set<string>()

  // Helper to add a drill to the workout
  const addDrill = (drill: DrillRecommendation) => {
    selectedDrills.push(drill)
    usedDrills.add(drill.drillTitle)
  }

  // Fill the workout using the logical flow order
  for (const category of flowOrder) {
    if (selectedDrills.length >= targetDrills) break

    // 1. Prioritize drills for the PRIMARY issue that match the current category
    const primaryDrill = primaryIssueDrills
      .filter((d) => d.category === category && !usedDrills.has(d.drillTitle))
      .sort((a, b) => (isWeek1 ? a.complexity - b.complexity : b.complexity - a.complexity)) // Sort by complexity
      .shift() // Get the best one

    if (primaryDrill) {
      addDrill(primaryDrill)
      continue
    }

    // 2. If no primary drill, use a SECONDARY issue drill for that category
    const secondaryDrill = secondaryIssueDrills
      .filter((d) => d.category === category && !usedDrills.has(d.drillTitle))
      .sort((a, b) => (isWeek1 ? a.complexity - b.complexity : b.complexity - a.complexity))
      .shift()

    if (secondaryDrill) {
      addDrill(secondaryDrill)
      continue
    }
  }

  // 3. If the flow is not filled, use any remaining PRIMARY issue drills regardless of category
  if (selectedDrills.length < targetDrills) {
    const remainingPrimary = primaryIssueDrills.filter((d) => !usedDrills.has(d.drillTitle))
    for (const drill of remainingPrimary) {
      if (selectedDrills.length >= targetDrills) break
      addDrill(drill)
    }
  }

  // 4. If still not filled, use any remaining SECONDARY issue drills
  if (selectedDrills.length < targetDrills) {
    const remainingSecondary = secondaryIssueDrills.filter((d) => !usedDrills.has(d.drillTitle))
    for (const drill of remainingSecondary) {
      if (selectedDrills.length >= targetDrills) break
      addDrill(drill)
    }
  }

  return selectedDrills
}

// Function to calculate rep counts for ~100 makes total
function calculateRepCounts(drillCount: number, isWeek1: boolean): { sets: string; reps: string } {
  if (drillCount === 0) return { sets: "3", reps: "10 makes per set" }

  const targetMakes = 100
  const makesPerDrill = Math.floor(targetMakes / drillCount)

  if (isWeek1) {
    // Week 1: More sets, fewer reps per set (focus on form)
    const sets = Math.max(3, Math.floor(makesPerDrill / 8))
    const repsPerSet = Math.ceil(makesPerDrill / sets)
    return {
      sets: sets.toString(),
      reps: `${repsPerSet} makes per set`,
    }
  } else {
    // Week 2: Fewer sets, more reps per set (focus on endurance)
    const sets = Math.max(2, Math.floor(makesPerDrill / 12))
    const repsPerSet = Math.ceil(makesPerDrill / sets)
    return {
      sets: sets.toString(),
      reps: `${repsPerSet} makes per set`,
    }
  }
}

// Update the createTrainingPlan function with improved workout flow
export function createTrainingPlan(
  playerName: string,
  issues: ShootingIssue[],
  recommendations: DrillRecommendation[],
  skillLevel: "beginner" | "intermediate" | "advanced" | "pro" = "intermediate",
) {
  // If skillLevel is "pro", treat it as "advanced"
  const normalizedSkillLevel = skillLevel === "pro" ? "advanced" : skillLevel

  // Create issue-specific day titles and descriptions
  const createDayTitleAndDescription = (dayNumber: number, primaryIssue: ShootingIssue, isWeek1: boolean) => {
    const issueDisplayName = primaryIssue.name

    if (isWeek1) {
      // Week 1: Foundation building with specific issue focus
      const foundationTitles = {
        "inconsistent-release": "Building Release Point Consistency",
        "poor-follow-through": "Developing Proper Follow-Through",
        "guide-hand-interference": "Eliminating Guide Hand Issues",
        "thumb-flick": "Correcting Thumb Interference",
        "low-arc": "Establishing Proper Shot Arc",
        "elbow-alignment": "Fixing Elbow Positioning",
        "balance-issues": "Building Shooting Balance",
        footwork: "Establishing Proper Footwork",
        "base-width": "Optimizing Stance Width",
        rhythm: "Developing Shooting Rhythm",
        dipping: "Eliminating Ball Dipping",
        "shot-pocket": "Establishing Shot Pocket",
        "wrist-snap": "Developing Wrist Action",
        alignment: "Building Body Alignment",
        rushing: "Controlling Shot Tempo",
        "game-transfer": "Foundation for Game Application",
        consistency: "Building Shot Consistency",
        "power-generation": "Developing Shooting Power",
        "off-hand-placement": "Correcting Off-Hand Position",
        "ball-position": "Optimizing Ball Position",
      }

      const foundationDescriptions = {
        "inconsistent-release": "Focus on developing a repeatable release point through fundamental drills.",
        "poor-follow-through": "Emphasize proper wrist snap and follow-through mechanics.",
        "guide-hand-interference": "Learn to position and use your guide hand without affecting the shot.",
        "thumb-flick": "Eliminate thumb influence and develop clean finger release.",
        "low-arc": "Establish proper shot trajectory and arc through targeted practice.",
        "elbow-alignment": "Build proper elbow positioning and stability throughout the shot.",
        "balance-issues": "Develop a stable shooting base and improve overall balance.",
        footwork: "Establish proper foot positioning and movement patterns.",
        "base-width": "Find your optimal stance width for maximum stability.",
        rhythm: "Develop smooth, consistent timing in your shooting motion.",
        dipping: "Eliminate unnecessary ball movement and establish efficient motion.",
        "shot-pocket": "Create a consistent starting position for your shot.",
        "wrist-snap": "Develop proper wrist flexion and finger control.",
        alignment: "Build proper body alignment toward the target.",
        rushing: "Learn to control your shooting tempo and preparation.",
        "game-transfer": "Build the foundation needed for game application.",
        consistency: "Establish repeatable mechanics through deliberate practice.",
        "power-generation": "Learn to generate power efficiently from your legs.",
        "off-hand-placement": "Position your non-shooting hand correctly.",
        "ball-position": "Establish optimal ball positioning throughout the shot.",
      }

      return {
        title: `Day ${dayNumber}: ${foundationTitles[primaryIssue.id] || `Addressing ${issueDisplayName}`}`,
        description:
          foundationDescriptions[primaryIssue.id] ||
          `Focus on correcting ${issueDisplayName.toLowerCase()} through fundamental drills.`,
      }
    } else {
      // Week 2: Game application with specific issue focus
      const applicationTitles = {
        "inconsistent-release": "Release Consistency Under Pressure",
        "poor-follow-through": "Follow-Through in Game Situations",
        "guide-hand-interference": "Guide Hand Control in Movement",
        "thumb-flick": "Clean Release Under Pressure",
        "low-arc": "Maintaining Arc in Game Shots",
        "elbow-alignment": "Elbow Stability During Movement",
        "balance-issues": "Balance in Game-Like Situations",
        footwork: "Advanced Footwork Applications",
        "base-width": "Stance Consistency Under Pressure",
        rhythm: "Rhythm in Complex Movements",
        dipping: "Efficient Motion Under Pressure",
        "shot-pocket": "Consistent Pocket in Game Situations",
        "wrist-snap": "Wrist Action Under Fatigue",
        alignment: "Alignment During Movement",
        rushing: "Tempo Control Under Pressure",
        "game-transfer": "Full Game Application",
        consistency: "Consistency Under Game Conditions",
        "power-generation": "Power Generation in Movement",
        "off-hand-placement": "Off-Hand Control in Game Situations",
        "ball-position": "Ball Position During Complex Movements",
      }

      const applicationDescriptions = {
        "inconsistent-release": "Apply your improved release point in game-like situations and under pressure.",
        "poor-follow-through": "Maintain proper follow-through during movement and complex shots.",
        "guide-hand-interference": "Keep guide hand control while shooting off movement and under pressure.",
        "thumb-flick": "Maintain clean finger release during quick shots and game situations.",
        "low-arc": "Preserve proper shot arc when shooting under pressure and fatigue.",
        "elbow-alignment": "Keep elbow stability during movement, turns, and game-speed shots.",
        "balance-issues": "Apply improved balance in game-like movements and pressure situations.",
        footwork: "Use advanced footwork patterns in game-simulation drills.",
        "base-width": "Maintain optimal stance width during movement and quick shots.",
        rhythm: "Keep smooth rhythm during complex movements and decision-making.",
        dipping: "Maintain efficient motion during quick shots and game situations.",
        "shot-pocket": "Keep consistent shot pocket during movement and pressure.",
        "wrist-snap": "Maintain proper wrist action when fatigued and under pressure.",
        alignment: "Preserve body alignment during movement and directional changes.",
        rushing: "Control tempo during quick decisions and pressure situations.",
        "game-transfer": "Apply all improved mechanics in full game simulation.",
        consistency: "Maintain consistency during fatigue and pressure situations.",
        "power-generation": "Generate power efficiently during movement and game situations.",
        "off-hand-placement": "Keep proper off-hand position during complex movements.",
        "ball-position": "Maintain optimal ball position during game-speed movements.",
      }

      return {
        title: `Day ${dayNumber}: ${applicationTitles[primaryIssue.id] || `${issueDisplayName} in Game Situations`}`,
        description:
          applicationDescriptions[primaryIssue.id] ||
          `Apply your improved ${issueDisplayName.toLowerCase()} in game-like situations.`,
      }
    }
  }

  // Create a 2-week plan (14 days) with logical workout flow
  const days = Array.from({ length: 14 }, (_, i) => {
    const dayNumber = i + 1
    const isWeek1 = dayNumber <= 7

    // Assign a primary issue for this day by cycling through the issues
    const primaryIssue = issues[i % issues.length]

    // Get the day title and description based on the primary issue
    const { title, description } = createDayTitleAndDescription(dayNumber, primaryIssue, isWeek1)

    // Create a targeted pool of drills for the day
    const primaryIssueDrills = recommendations.filter((r) => r.targetIssue === primaryIssue.id)
    const secondaryIssueDrills = recommendations.filter((r) => r.targetIssue !== primaryIssue.id)

    // Create logical workout flow for this day using the targeted drill pools
    const dayDrills = createTargetedWorkoutFlow(primaryIssueDrills, secondaryIssueDrills, isWeek1, dayNumber)

    // Calculate rep counts for ~100 makes total
    const { sets, reps } = calculateRepCounts(dayDrills.length, isWeek1)

    // Create the day structure
    return {
      day: dayNumber,
      title,
      description,
      drills: dayDrills.map((drill) => {
        // Get the specific issue this drill targets
        const targetIssue = issues.find((i) => i.id === drill.targetIssue) || primaryIssue

        // Create a personalized explanation that addresses the player's specific issue
        const personalizedExplanation = generatePersonalizedExplanation(
          drill.drillTitle,
          targetIssue,
          playerName,
          normalizedSkillLevel as "beginner" | "intermediate" | "advanced",
          isWeek1,
        )

        return {
          name: drill.drillTitle,
          description: `${drill.drillTitle} - ${drill.explanation}`,
          sets,
          reps,
          focus: `Improving ${targetIssue?.name || "shooting mechanics"}`,
          explanation: personalizedExplanation,
          video: drill.video
            ? {
                title: drill.video.title,
                description: drill.video.description || `Video demonstration of the ${drill.drillTitle} drill.`,
                url: drill.video.url,
              }
            : undefined,
        }
      }),
      notes: `Day ${dayNumber} focus: ${
        isWeek1
          ? `Building proper mechanics to address ${primaryIssue.name.toLowerCase()}`
          : `Applying improved ${primaryIssue.name.toLowerCase()} under game-like conditions`
      }. Target ~100 makes total across all drills. Remember to focus on quality repetitions rather than quantity, ${playerName}.`,
    }
  })

  // Create the complete training plan with a more personalized introduction
  return {
    title: `Two-Week ${issues[0].name} Improvement Program`,
    introduction: `Welcome to your personalized jump shot training program, ${playerName}! This 2-week course is specifically designed to address your shooting issues: ${issues.map((i) => i.name).join(", ")}. Each day targets specific issues with 4-5 targeted drills totaling approximately 100 makes. The program progresses from fundamental mechanics in Week 1 to game application in Week 2, ensuring you build proper form before applying it under pressure.`,
    issues: issues.map((i) => i.name),
    days,
  }
}
