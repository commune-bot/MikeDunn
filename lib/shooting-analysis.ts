// Types for our shooting analysis system
export interface ShootingIssue {
  id: string
  name: string
  description: string
  keywords: string[]
  relatedIssues: string[]
  severity?: "minor" | "moderate" | "major"
  skillLevel?: "beginner" | "intermediate" | "advanced"
}

export interface DrillRecommendation {
  drillId: string
  relevanceScore: number
  targetIssue: string
  explanation: string
  progression?: string
}

// Database of common shooting issues
export const shootingIssueDatabase: ShootingIssue[] = [
  {
    id: "inconsistent-release",
    name: "Inconsistent Release Point",
    description: "Variation in the point at which the ball leaves the hand, leading to inconsistent accuracy.",
    keywords: ["release", "inconsistent", "varies", "different", "changing", "release point", "let go"],
    relatedIssues: ["follow-through", "guide-hand-interference"],
  },
  {
    id: "poor-follow-through",
    name: "Poor Follow-Through",
    description: "Inadequate extension and holding of the follow-through position after release.",
    keywords: ["follow", "through", "follow-through", "extension", "snap", "wrist", "finish", "short"],
    relatedIssues: ["inconsistent-release", "wrist-snap"],
  },
  {
    id: "guide-hand-interference",
    name: "Guide Hand Interference",
    description: "The non-shooting hand affects the shot by pushing or guiding the ball.",
    keywords: [
      "guide",
      "hand",
      "off",
      "thumb",
      "push",
      "interference",
      "second",
      "non-shooting",
      "left hand",
      "right hand",
    ],
    relatedIssues: ["inconsistent-release", "thumb-flick"],
  },
  {
    id: "thumb-flick",
    name: "Thumb Flick",
    description: "Using the thumb to propel the ball, causing inconsistent direction and spin.",
    keywords: ["thumb", "flick", "push", "thumbing", "steering"],
    relatedIssues: ["guide-hand-interference", "inconsistent-release"],
  },
  {
    id: "low-arc",
    name: "Low Arc",
    description: "Shot trajectory is too flat, reducing the chance of the ball going in.",
    keywords: ["arc", "flat", "line", "trajectory", "angle", "rainbow", "height"],
    relatedIssues: ["elbow-alignment", "wrist-snap"],
  },
  {
    id: "elbow-alignment",
    name: "Poor Elbow Alignment",
    description: "Shooting elbow is not properly aligned under the ball or drifts outward.",
    keywords: ["elbow", "alignment", "flying", "chicken wing", "out", "tucked", "under"],
    relatedIssues: ["low-arc", "inconsistent-release"],
  },
  {
    id: "balance-issues",
    name: "Poor Balance",
    description: "Lack of stability during the shooting motion, affecting consistency.",
    keywords: ["balance", "stable", "stability", "wobble", "leaning", "falling", "drifting"],
    relatedIssues: ["footwork", "base-width"],
  },
  {
    id: "footwork",
    name: "Inconsistent Footwork",
    description: "Variation in foot positioning and movement before shooting.",
    keywords: ["feet", "foot", "footwork", "stance", "step", "hop", "jump"],
    relatedIssues: ["balance-issues", "rhythm"],
  },
  {
    id: "base-width",
    name: "Improper Base Width",
    description: "Feet positioned too wide or too narrow, affecting balance and power.",
    keywords: ["base", "width", "stance", "wide", "narrow", "feet", "foot"],
    relatedIssues: ["balance-issues", "footwork"],
  },
  {
    id: "rhythm",
    name: "Poor Rhythm",
    description: "Lack of fluid, consistent timing in the shooting motion.",
    keywords: ["rhythm", "timing", "fluid", "choppy", "hitchy", "pause", "hitch"],
    relatedIssues: ["footwork", "dipping"],
  },
  {
    id: "dipping",
    name: "Excessive Dipping",
    description: "Bringing the ball too low before shooting, adding unnecessary motion.",
    keywords: ["dip", "dipping", "drop", "low", "down", "motion"],
    relatedIssues: ["rhythm", "shot-pocket"],
  },
  {
    id: "shot-pocket",
    name: "Inconsistent Shot Pocket",
    description: "Variation in the starting position of the shot.",
    keywords: ["pocket", "start", "position", "set point", "gather"],
    relatedIssues: ["dipping", "rhythm"],
  },
  {
    id: "wrist-snap",
    name: "Insufficient Wrist Snap",
    description: "Lack of proper wrist flexion during release, affecting backspin and arc.",
    keywords: ["wrist", "snap", "flick", "flexion", "backspin", "rotation"],
    relatedIssues: ["poor-follow-through", "low-arc"],
  },
  {
    id: "alignment",
    name: "Poor Body Alignment",
    description: "Body not properly aligned toward the basket during the shot.",
    keywords: ["alignment", "square", "facing", "turned", "shoulder", "hip"],
    relatedIssues: ["balance-issues", "elbow-alignment"],
  },
  {
    id: "rushing",
    name: "Rushing the Shot",
    description: "Taking shots too quickly without proper preparation.",
    keywords: ["rush", "hurry", "quick", "fast", "preparation", "ready"],
    relatedIssues: ["rhythm", "balance-issues"],
  },
  {
    id: "game-transfer",
    name: "Practice to Game Transfer",
    description: "Difficulty maintaining shooting form during game situations.",
    keywords: ["game", "transfer", "pressure", "competition", "real", "situation"],
    relatedIssues: ["rushing", "balance-issues", "consistency"],
  },
  {
    id: "consistency",
    name: "Overall Inconsistency",
    description: "General lack of repeatability in the shooting motion.",
    keywords: ["consistency", "repeatable", "reliable", "same", "varies"],
    relatedIssues: ["rhythm", "balance-issues", "shot-pocket"],
  },
  {
    id: "power-generation",
    name: "Poor Power Generation",
    description: "Inefficient use of legs and body to generate power for the shot.",
    keywords: ["power", "strength", "legs", "force", "weak", "short", "energy"],
    relatedIssues: ["balance-issues", "footwork"],
  },
  {
    id: "off-hand-placement",
    name: "Improper Off-Hand Placement",
    description: "Non-shooting hand positioned incorrectly on the ball.",
    keywords: ["off", "hand", "placement", "position", "guide", "support"],
    relatedIssues: ["guide-hand-interference", "thumb-flick"],
  },
  {
    id: "ball-position",
    name: "Improper Ball Position",
    description: "Ball positioned incorrectly in relation to the body during the shot.",
    keywords: ["ball", "position", "high", "low", "side", "front", "back"],
    relatedIssues: ["shot-pocket", "elbow-alignment"],
  },
]

// Function to analyze text and identify shooting issues
export function analyzeShootingIssues(description: string): ShootingIssue[] {
  const normalizedText = description.toLowerCase()
  const words = normalizedText.split(/\s+/)
  const phrases = []

  // Create phrases from the text (1-3 word combinations)
  for (let i = 0; i < words.length; i++) {
    phrases.push(words[i])
    if (i < words.length - 1) phrases.push(`${words[i]} ${words[i + 1]}`)
    if (i < words.length - 2) phrases.push(`${words[i]} ${words[i + 1]} ${words[i + 2]}`)
  }

  // Score each issue based on keyword matches
  const issueScores = shootingIssueDatabase.map((issue) => {
    let score = 0
    const matchedKeywords = new Set<string>()

    // Check for keyword matches
    issue.keywords.forEach((keyword) => {
      const keywordLower = keyword.toLowerCase()
      phrases.forEach((phrase) => {
        if (phrase.includes(keywordLower)) {
          score += 1
          matchedKeywords.add(keyword)
        }
      })

      // Direct mention of the issue name is a strong signal
      if (normalizedText.includes(issue.name.toLowerCase())) {
        score += 3
        matchedKeywords.add(issue.name)
      }
    })

    // Check for explicit mentions of the issue ID (converted to readable form)
    const readableId = issue.id.replace(/-/g, " ")
    if (normalizedText.includes(readableId)) {
      score += 2
      matchedKeywords.add(readableId)
    }

    return {
      issue,
      score,
      matchedKeywords: Array.from(matchedKeywords),
    }
  })

  // Filter issues with a score above 0 and sort by score (descending)
  const significantIssues = issueScores.filter((item) => item.score > 0).sort((a, b) => b.score - a.score)

  // If no issues were found, try to identify the most likely general issues
  if (significantIssues.length === 0) {
    // Look for general terms like "inconsistent", "poor", "problem", etc.
    const generalTerms = ["inconsistent", "poor", "problem", "issue", "struggle", "bad", "trouble"]
    const hasGeneralTerms = generalTerms.some((term) => normalizedText.includes(term))

    if (hasGeneralTerms) {
      // Return the most common general issues
      return [
        shootingIssueDatabase.find((issue) => issue.id === "consistency")!,
        shootingIssueDatabase.find((issue) => issue.id === "balance-issues")!,
        shootingIssueDatabase.find((issue) => issue.id === "rhythm")!,
      ]
    }
  }

  // Return the identified issues (limit to top 5 to avoid overwhelming)
  return significantIssues.slice(0, 5).map((item) => item.issue)
}

// Function to get related issues that might not have been explicitly mentioned
export function getRelatedIssues(identifiedIssues: ShootingIssue[]): ShootingIssue[] {
  const identifiedIds = new Set(identifiedIssues.map((issue) => issue.id))
  const relatedIds = new Set<string>()

  // Collect all related issue IDs
  identifiedIssues.forEach((issue) => {
    issue.relatedIssues.forEach((relatedId) => {
      if (!identifiedIds.has(relatedId)) {
        relatedIds.add(relatedId)
      }
    })
  })

  // Find the related issues in the database
  const relatedIssues = Array.from(relatedIds)
    .map((id) => shootingIssueDatabase.find((issue) => issue.id === id)!)
    .filter(Boolean)

  // Return the top 3 related issues
  return relatedIssues.slice(0, 3)
}
