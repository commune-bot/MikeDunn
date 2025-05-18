import { videoDatabase, loomExplanationVideos, type VideoEntry } from "./video-database"

// Define drill difficulty patterns to help with automatic categorization
const beginnerPatterns = [
  "form shooting",
  "1 hand",
  "guide hand",
  "ball raises",
  "wide stance",
  "free throws",
  "stabilize",
  "basic",
  "foundation",
  "beginner",
  "fundamentals",
]

const intermediatePatterns = [
  "1 2 through",
  "ball does not stop",
  "catch and shoot",
  "jump turns",
  "momentum shots",
  "1 foot drops",
  "pullback",
  "dribble 1 2 step",
  "intermediate",
  "dds",
  "elevator",
]

const proPatterns = [
  "sprint",
  "steph curry",
  "fake pass",
  "lateral movement",
  "180 degree",
  "advanced",
  "pro",
  "elite",
  "game speed",
  "full court",
  "gauntlet",
  "2 dribble",
  "reaction",
]

/**
 * Automatically categorizes a drill based on its title and description
 */
export function categorizeDrillByTitle(title: string, description?: string): "beginner" | "intermediate" | "pro" {
  const searchText = (title + " " + (description || "")).toLowerCase()

  // Check for pro patterns first (most specific)
  for (const pattern of proPatterns) {
    if (searchText.includes(pattern)) {
      return "pro"
    }
  }

  // Then check for intermediate patterns
  for (const pattern of intermediatePatterns) {
    if (searchText.includes(pattern)) {
      return "intermediate"
    }
  }

  // Check for beginner patterns
  for (const pattern of beginnerPatterns) {
    if (searchText.includes(pattern)) {
      return "beginner"
    }
  }

  // If no patterns match at all, categorize based on complexity
  if (title.includes("with") || title.includes("turn") || title.includes("drop")) {
    return "intermediate"
  }

  // Default to beginner if nothing else matches
  return "beginner"
}

/**
 * Categorizes all drills in the video database
 */
export function categorizeAllDrills(): VideoEntry[] {
  return videoDatabase.map((drill) => {
    if (!drill.skillLevel) {
      drill.skillLevel = categorizeDrillByTitle(drill.title, drill.description)
    }
    return drill
  })
}

/**
 * Categorizes all Loom explanation videos
 */
export function categorizeAllLoomVideos(): VideoEntry[] {
  return loomExplanationVideos.map((video) => {
    if (!video.skillLevel) {
      // Loom videos are generally more advanced explanations
      const baseLevel = categorizeDrillByTitle(video.title, video.description)

      // Adjust based on content - explanations are often one level higher than the drill itself
      if (baseLevel === "beginner") {
        video.skillLevel = "beginner"
      } else if (baseLevel === "intermediate") {
        video.skillLevel = "intermediate"
      } else {
        video.skillLevel = "pro"
      }
    }
    return video
  })
}

/**
 * Gets all drills filtered by skill level
 */
export function getDrillsBySkillLevel(skillLevel: "beginner" | "intermediate" | "pro"): VideoEntry[] {
  const categorizedDrills = categorizeAllDrills()

  if (skillLevel === "beginner") {
    return categorizedDrills.filter((drill) => drill.skillLevel === "beginner")
  } else if (skillLevel === "intermediate") {
    return categorizedDrills.filter((drill) => drill.skillLevel === "beginner" || drill.skillLevel === "intermediate")
  } else {
    // Pro level gets access to all drills
    return categorizedDrills
  }
}

/**
 * Gets all Loom videos filtered by skill level
 */
export function getLoomVideosBySkillLevel(skillLevel: "beginner" | "intermediate" | "pro"): VideoEntry[] {
  const categorizedVideos = categorizeAllLoomVideos()

  if (skillLevel === "beginner") {
    return categorizedVideos.filter((video) => video.skillLevel === "beginner")
  } else if (skillLevel === "intermediate") {
    return categorizedVideos.filter((video) => video.skillLevel === "beginner" || video.skillLevel === "intermediate")
  } else {
    // Pro level gets access to all videos
    return categorizedVideos
  }
}

/**
 * Manually set the skill level for a specific video by title
 */
export function setVideoSkillLevel(title: string, skillLevel: "beginner" | "intermediate" | "pro"): boolean {
  // Try to find the video in the YouTube database
  const youtubeVideo = videoDatabase.find((v) => v.title === title)
  if (youtubeVideo) {
    youtubeVideo.skillLevel = skillLevel
    return true
  }

  // Try to find the video in the Loom database
  const loomVideo = loomExplanationVideos.find((v) => v.title === title)
  if (loomVideo) {
    loomVideo.skillLevel = skillLevel
    return true
  }

  // Video not found
  return false
}

