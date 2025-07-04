import type { ShootingIssue } from "./shooting-analysis"
import { type VideoEntry, videoDatabase } from "./video-database"

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
}

// Map of issue IDs to recommended drill progressions
const issueToDrillMap: Record<string, DrillProgression> = {
  "inconsistent-release": {
    beginner: ["1 Hand Shooting", "Form Shooting", "Ball Raises"],
    intermediate: ["Guide Hand Positioning (KSS)", "Stabilize The Shooting Elbow", "1 2 Through"],
    advanced: ["Catch and Shoot With Pass Fake", "Jump Turns With Pass", "Momentum Shots"],
  },
  "poor-follow-through": {
    beginner: ["1 Hand Shooting", "Form Shooting", "Free Throws"],
    intermediate: [
      "Ball Does Not Stop (KSS)",
      "3 Exercises to Stabilize Elbow and Keep Ball Moving",
      "Stabilize The Shooting Elbow",
    ],
    advanced: ["Catch and Shoot With Pass Fake", "Momentum Shots", "Jump Turns With A Pass"],
  },
  "guide-hand-interference": {
    beginner: ["1 Hand Shooting", "Guide Hand Positioning (KSS)", "Form Shooting"],
    intermediate: ["Ball Does Not Stop (KSS)", "Free Throws", "1 2 Through"],
    advanced: ["Catch and Shoot With Pass Fake", "Jump Turns With Pass", "Momentum Shots"],
  },
  "thumb-flick": {
    beginner: ["Guide Hand Positioning (KSS)", "1 Hand Shooting", "Form Shooting"],
    intermediate: ["Ball Does Not Stop (KSS)", "Stabilize The Shooting Elbow", "Free Throws"],
    advanced: ["Catch and Shoot With Pass Fake", "Jump Turns With Pass", "Momentum Shots"],
  },
  "low-arc": {
    beginner: ["Form Shooting", "Flat Side Backboard Shots", "Skinny Side Backboard Shots"],
    intermediate: ["1 Hand Shooting", "Ball Raises", "Free Throws"],
    advanced: ["Catch and Shoot With Pass Fake", "Momentum Shots", "Jump Turns With A Pass"],
  },
  "elbow-alignment": {
    beginner: ["Stabilize The Shooting Elbow", "3 Exercises to Stabilize Elbow and Keep Ball Moving", "Form Shooting"],
    intermediate: ["1 2 Through", "Ball Does Not Stop (KSS)", "Free Throws"],
    advanced: ["Elbow Push Out With Stop", "Elbow Push Outs No Stop", "Catch and Shoot With Pass Fake"],
  },
  "balance-issues": {
    beginner: ["Wide Stance Shots", "1 Foot Drops", "1 Foot Elevator Drops"],
    intermediate: ["1 2 Step With Drop", "Jump Turns With Pass", "90 Degree Elevator Drops Off Dribble"],
    advanced: ["Backward Forward Hops", "180 Degree 1 Position Turn", "Sprint to Corner"],
  },
  footwork: {
    beginner: ["1 2 Step With Drop", "1 2 Through", "Form Shooting"],
    intermediate: ["Jump Turns With Pass", "Jump Turns With A Pass", "Dribble 1-2 Step"],
    advanced: ["Sprint to Top of Key with Drop", "Lateral Movement into DDS", "180 Degree 1 Position Step Drop"],
  },
  "base-width": {
    beginner: ["Wide Stance Shots", "Form Shooting", "Free Throws"],
    intermediate: ["1 2 Step With Drop", "Jump Turns With Pass", "1 Foot Drops"],
    advanced: ["Momentum Shots", "Jump Turns With A Pass", "Sprint to Corner"],
  },
  rhythm: {
    beginner: ["Ball Does Not Stop (KSS)", "1 2 Through", "Ball Raises"],
    intermediate: ["1-2-Thru Slow Mo (self)", "1-2-Thru With Stop at Hoop", "Slow Motion 1-2-Thru @ Hoop"],
    advanced: ["Momentum Shots", "Catch and Shoot With Pass Fake", "Jump Turns With A Pass"],
  },
  dipping: {
    beginner: ["Ball Raises", "High Ball Drop", "Form Shooting"],
    intermediate: ["Ball Does Not Stop (KSS)", "1 2 Through", "Pullback with Drop"],
    advanced: ["Catch and Shoot Off Drop", "DDS Fake Pass", "Momentum Shots"],
  },
  "shot-pocket": {
    beginner: ["Ball Raises", "Pullback with Drop", "Form Shooting"],
    intermediate: ["1 2 Through", "Ball Does Not Stop (KSS)", "High Ball Drop"],
    advanced: ["Catch and Shoot Off Drop", "DDS Fake Pass", "Momentum Shots"],
  },
  "wrist-snap": {
    beginner: ["1 Hand Shooting", "Form Shooting", "Free Throws"],
    intermediate: ["Ball Does Not Stop (KSS)", "Stabilize The Shooting Elbow", "1 2 Through"],
    advanced: ["Catch and Shoot With Pass Fake", "Momentum Shots", "Jump Turns With A Pass"],
  },
  alignment: {
    beginner: ["Form Shooting", "Wide Stance Shots", "Free Throws"],
    intermediate: ["1 2 Step With Drop", "Jump Turns With Pass", "1 2 Through"],
    advanced: ["Momentum Shots", "Jump Turns With A Pass", "Catch and Shoot With Pass Fake"],
  },
  rushing: {
    beginner: ["Form Shooting", "Free Throws", "1 2 Through"],
    intermediate: ["1-2-Thru Slow Mo (self)", "Slow Motion 1-2-Thru @ Hoop", "Ball Does Not Stop (KSS)"],
    advanced: ["Catch and Shoot With Pass Fake", "Jump Turns With Pass", "DDS Fake Pass"],
  },
  "game-transfer": {
    beginner: ["Form Shooting", "Free Throws", "Catch and Shoot With Pass Fake"],
    intermediate: ["Jump Turns With Pass", "Momentum Shots", "Jump Turns With A Pass"],
    advanced: ["Sprint to Corner", "Lateral Movement into DDS", "DDS Angle"],
  },
  consistency: {
    beginner: ["Form Shooting", "Free Throws", "1 Hand Shooting"],
    intermediate: ["Ball Does Not Stop (KSS)", "1 2 Through", "Ball Raises"],
    advanced: ["Shoot Until I Miss 2 in a Row 5 Spots", "Full Court Threes", "Momentum Shots"],
  },
  "power-generation": {
    beginner: ["1 2 Step With Drop", "Wide Stance Shots", "Form Shooting"],
    intermediate: ["1 2 Through", "Jump Turns With Pass", "Momentum Shots"],
    advanced: ["Sprint to Corner", "Jump Turns With A Pass", "Catch and Shoot With Pass Fake"],
  },
  "off-hand-placement": {
    beginner: ["Guide Hand Positioning (KSS)", "1 Hand Shooting", "Form Shooting"],
    intermediate: ["Ball Does Not Stop (KSS)", "Free Throws", "1 2 Through"],
    advanced: ["Catch and Shoot With Pass Fake", "Jump Turns With Pass", "Momentum Shots"],
  },
  "ball-position": {
    beginner: ["Ball Raises", "Pullback with Drop", "High Ball Drop"],
    intermediate: ["1 2 Through", "Ball Does Not Stop (KSS)", "Form Shooting"],
    advanced: ["Catch and Shoot Off Drop", "DDS Fake Pass", "Momentum Shots"],
  },
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
  "90 Degree Elevator Drops Off Dribble": {
    "balance-issues": "Challenges balance during turning movements with progressive lowering.",
    footwork: "Develops footwork and balance when changing directions.",
    default: "Improves balance and body control during directional changes.",
  },
  "Backward Forward Hops": {
    "balance-issues": "Challenges balance during multi-directional movement.",
    footwork: "Develops coordinated footwork during complex movements.",
    default: "Improves balance and body control during multi-directional movements.",
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
  "Sprint to Top of Key with Drop": {
    footwork: "Develops proper footwork when transitioning from sprinting to shooting.",
    "game-transfer": "Simulates game-like movement to common shooting positions.",
    default: "Improves shooting readiness and accuracy after sprinting to a spot.",
  },
  "Lateral Movement into DDS": {
    footwork: "Develops coordinated footwork during lateral movement into a shot.",
    "game-transfer": "Simulates game-like lateral movement followed by shooting.",
    default: "Improves footwork and shooting accuracy after lateral movement.",
  },
  "180 Degree 1 Position Step Drop": {
    footwork: "Develops advanced footwork during significant directional changes.",
    "balance-issues": "Challenges balance during complex turning movements.",
    default: "Improves footwork and balance during major directional changes.",
  },
  "Flat Side Backboard Shots": {
    "low-arc": "Directly addresses shot arc by requiring proper trajectory to hit the target.",
    alignment: "Reinforces proper alignment and aim through target practice.",
    default: "Improves shot arc and accuracy through targeted practice.",
  },
  "Skinny Side Backboard Shots": {
    "low-arc": "Develops proper shot arc by requiring precise trajectory to hit the target.",
    alignment: "Reinforces proper alignment and aim through challenging target practice.",
    default: "Improves shot arc and accuracy through precise target practice.",
  },
  "Elbow Push Out With Stop": {
    "elbow-alignment": "Develops proper elbow alignment during movement and stopping.",
    "balance-issues": "Improves balance when transitioning from movement to a stopped position.",
    default: "Improves elbow alignment and balance during movement and stopping.",
  },
  "Elbow Push Outs No Stop": {
    "elbow-alignment": "Develops proper elbow alignment during continuous movement.",
    "balance-issues": "Challenges balance during movement without stopping.",
    default: "Improves elbow alignment and balance during continuous movement.",
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
  "Catch and Shoot Off Drop": {
    dipping: "Teaches efficient preparation without unnecessary ball movement.",
    "shot-pocket": "Reinforces proper ball positioning when catching and shooting.",
    default: "Improves shooting readiness and efficiency when catching passes.",
  },
  "DDS Fake Pass": {
    rushing: "Develops proper timing and preparation when making quick decisions.",
    "game-transfer": "Simulates game-like decision-making and shooting under pressure.",
    default: "Improves decision-making and shooting readiness in game-like situations.",
  },
  "DDS Angle": {
    "game-transfer": "Simulates game-like directional changes before shooting.",
    footwork: "Develops proper footwork when changing directions before shooting.",
    default: "Improves footwork and shooting accuracy after directional changes.",
  },
  "Shoot Until I Miss 2 in a Row 5 Spots": {
    consistency: "Challenges shooting consistency through a competitive format.",
    "mental-focus": "Develops mental toughness and focus under pressure.",
    default: "Improves shooting consistency and mental focus through competition.",
  },
  "Full Court Threes": {
    consistency: "Challenges shooting consistency while managing fatigue.",
    conditioning: "Develops shooting accuracy under physical stress.",
    default: "Improves shooting consistency and conditioning simultaneously.",
  },
  "1-2-Thru Slow Mo (self)": {
    rhythm: "Develops awareness of proper sequencing through slow-motion practice.",
    rushing: "Teaches proper pacing and sequencing to prevent rushing.",
    default: "Improves shooting rhythm and sequencing through deliberate practice.",
  },
  "1-2-Thru With Stop at Hoop": {
    rhythm: "Reinforces proper sequencing with a defined stopping point.",
    rushing: "Teaches proper preparation and timing before shooting.",
    default: "Improves shooting preparation and sequencing.",
  },
  "Slow Motion 1-2-Thru @ Hoop": {
    rhythm: "Develops awareness of proper sequencing through slow-motion practice at the hoop.",
    rushing: "Teaches proper pacing and sequencing to prevent rushing.",
    default: "Improves shooting rhythm and sequencing through deliberate practice at the hoop.",
  },
  "Rollout with Slides": {
    footwork: "Develops lateral movement and positioning for shooting.",
    "game-transfer": "Simulates game-like reactions to moving balls.",
    default: "Improves footwork and shooting readiness after lateral movement.",
  },
  "Jab Phase III": {
    footwork: "Develops advanced footwork with multiple jab steps.",
    "balance-issues": "Challenges balance during complex movements.",
    default: "Improves footwork and balance during complex jab movements.",
  },
  "Dribble 1-2 Step With Ball Raise": {
    footwork: "Develops proper stepping pattern when shooting off the dribble.",
    "ball-position": "Reinforces proper ball raising motion during the shot.",
    default: "Improves footwork and ball positioning when shooting off the dribble.",
  },
  DDS: {
    footwork: "Develops proper footwork when shooting off the dribble.",
    "balance-issues": "Improves balance when transitioning from dribble to shot.",
    default: "Improves footwork and balance when shooting off the dribble.",
  },
  "Dribble 1-2 Step": {
    footwork: "Develops proper stepping pattern when shooting off the dribble.",
    "balance-issues": "Improves balance when transitioning from dribble to shot.",
    default: "Improves footwork and balance when shooting off the dribble.",
  },
  "90 Degree Dribble Turns": {
    footwork: "Develops proper footwork when turning with the dribble.",
    "balance-issues": "Challenges balance during turning movements with the dribble.",
    default: "Improves footwork and balance during turning movements with the dribble.",
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

// Improve the drill recommendation algorithm to better match issues with drills

// Update the getDrillRecommendations function to improve relevance scoring
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
      const video = videoDatabase.find((v) => v.title === drillTitle)

      // Get the explanation for why this drill helps with this issue
      const explanation =
        drillExplanations[drillTitle]?.[issue.id] ||
        drillExplanations[drillTitle]?.["default"] ||
        `Addresses ${issue.name} through targeted practice.`

      // Calculate relevance score based on issue priority and drill position
      // Drills earlier in the list for each issue are considered more relevant
      const positionScore = Math.max(1, 5 - drillIndex) / 5 // 1.0, 0.8, 0.6, 0.4, 0.2...
      const relevanceScore = issuePriorityMultiplier * positionScore

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
        })
      }
    })
  })

  // Sort by relevance score (higher scores first)
  return recommendations.sort((a, b) => b.relevanceScore - a.relevanceScore)
}

// Update the createTrainingPlan function to create more varied daily plans with specific issue focus
export function createTrainingPlan(
  playerName: string,
  issues: ShootingIssue[],
  recommendations: DrillRecommendation[],
  skillLevel: "beginner" | "intermediate" | "advanced" | "pro" = "intermediate",
) {
  // If skillLevel is "pro", treat it as "advanced"
  const normalizedSkillLevel = skillLevel === "pro" ? "advanced" : skillLevel

  // Group recommendations by target issue
  const recommendationsByIssue = recommendations.reduce(
    (acc, rec) => {
      if (!acc[rec.targetIssue]) {
        acc[rec.targetIssue] = []
      }
      acc[rec.targetIssue].push(rec)
      return acc
    },
    {} as Record<string, DrillRecommendation[]>,
  )

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

  // Create a 2-week plan (14 days) with specific issue focus for each day
  const days = Array.from({ length: 14 }, (_, i) => {
    const dayNumber = i + 1
    const isWeek1 = dayNumber <= 7

    // Assign a primary issue for this day by cycling through the issues
    const primaryIssueIndex = i % issues.length
    const primaryIssue = issues[primaryIssueIndex]

    // Get the day title and description based on the primary issue
    const { title, description } = createDayTitleAndDescription(dayNumber, primaryIssue, isWeek1)

    // Get drills specifically for this day's primary issue
    const primaryIssueRecs = recommendationsByIssue[primaryIssue.id] || []

    // Also include some drills from secondary issues (but fewer)
    const secondaryIssues = issues.filter((_, index) => index !== primaryIssueIndex)
    const secondaryRecs = secondaryIssues
      .slice(0, 2)
      .flatMap((issue) => (recommendationsByIssue[issue.id] || []).slice(0, 1))

    // Combine primary and secondary recommendations
    const allDayRecs = [...primaryIssueRecs.slice(0, 3), ...secondaryRecs]

    // Take different drills each day using a rotation pattern
    const offset = (dayNumber - 1) % Math.max(1, allDayRecs.length)
    let dayDrills = allDayRecs.slice(offset, offset + 3)

    // If we don't have enough drills, wrap around
    if (dayDrills.length < 3 && allDayRecs.length > 0) {
      const remaining = 3 - dayDrills.length
      dayDrills = [...dayDrills, ...allDayRecs.slice(0, remaining)]
    }

    // Ensure we have at least some drills
    if (dayDrills.length === 0 && recommendations.length > 0) {
      dayDrills = recommendations.slice(0, 3)
    }

    // Limit to appropriate number of drills based on skill level
    const maxDrills = normalizedSkillLevel === "beginner" ? 3 : normalizedSkillLevel === "intermediate" ? 4 : 5
    const finalDrills = dayDrills.slice(0, Math.min(maxDrills, dayDrills.length))

    // Create the day structure
    return {
      day: dayNumber,
      title,
      description,
      drills: finalDrills.map((drill) => {
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
          sets: isWeek1 ? "3" : "4",
          reps: isWeek1 ? "10 makes per set" : "8 makes per set",
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
      }. Remember to focus on quality repetitions rather than quantity, ${playerName}.`,
    }
  })

  // Create the complete training plan with a more personalized introduction
  return {
    title: `Two-Week ${issues[0].name} Improvement Program`,
    introduction: `Welcome to your personalized jump shot training program, ${playerName}! This 2-week course is specifically designed to address your shooting issues: ${issues.map((i) => i.name).join(", ")}. Each day targets specific issues with targeted drills and video demonstrations. The program progresses from fundamental mechanics in Week 1 to game application in Week 2, ensuring you build proper form before applying it under pressure.`,
    issues: issues.map((i) => i.name),
    days,
  }
}
