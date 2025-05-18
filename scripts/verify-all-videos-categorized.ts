import { categorizeAllDrills, categorizeAllLoomVideos } from "@/lib/skill-level-categorization"

function verifyAllVideosHaveSkillLevels() {
  // Categorize all videos
  const categorizedDrills = categorizeAllDrills()
  const categorizedLoomVideos = categorizeAllLoomVideos()

  // Check if any videos are missing skill levels
  const uncategorizedDrills = categorizedDrills.filter((drill) => !drill.skillLevel)
  const uncategorizedLoomVideos = categorizedLoomVideos.filter((video) => !video.skillLevel)

  // Print results
  console.log("=== VIDEO CATEGORIZATION VERIFICATION ===")
  console.log(`Total YouTube drills: ${categorizedDrills.length}`)
  console.log(`Total Loom videos: ${categorizedLoomVideos.length}`)
  console.log(`Uncategorized YouTube drills: ${uncategorizedDrills.length}`)
  console.log(`Uncategorized Loom videos: ${uncategorizedLoomVideos.length}`)

  // If any videos are uncategorized, list them
  if (uncategorizedDrills.length > 0) {
    console.log("\nUncategorized YouTube drills:")
    uncategorizedDrills.forEach((drill) => console.log(`- ${drill.title}`))
  }

  if (uncategorizedLoomVideos.length > 0) {
    console.log("\nUncategorized Loom videos:")
    uncategorizedLoomVideos.forEach((video) => console.log(`- ${video.title}`))
  }

  // Print summary by skill level
  const drillsByLevel = {
    beginner: categorizedDrills.filter((d) => d.skillLevel === "beginner").length,
    intermediate: categorizedDrills.filter((d) => d.skillLevel === "intermediate").length,
    pro: categorizedDrills.filter((d) => d.skillLevel === "pro").length,
  }

  const loomByLevel = {
    beginner: categorizedLoomVideos.filter((v) => v.skillLevel === "beginner").length,
    intermediate: categorizedLoomVideos.filter((v) => v.skillLevel === "intermediate").length,
    pro: categorizedLoomVideos.filter((v) => v.skillLevel === "pro").length,
  }

  console.log("\nYouTube drills by skill level:")
  console.log(drillsByLevel)

  console.log("\nLoom videos by skill level:")
  console.log(loomByLevel)

  // Verification result
  if (uncategorizedDrills.length === 0 && uncategorizedLoomVideos.length === 0) {
    console.log("\n✅ SUCCESS: All videos have been categorized!")
  } else {
    console.log("\n❌ ERROR: Some videos are missing skill levels!")
  }
}

// Run the verification
verifyAllVideosHaveSkillLevels()

