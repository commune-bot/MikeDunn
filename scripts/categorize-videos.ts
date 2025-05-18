import { categorizeAllDrills, categorizeAllLoomVideos } from "@/lib/skill-level-categorization"

// This script would be run to verify our categorization
function main() {
  const categorizedDrills = categorizeAllDrills()
  const categorizedLoomVideos = categorizeAllLoomVideos()

  // Count by skill level
  const drillCounts = {
    beginner: categorizedDrills.filter((d) => d.skillLevel === "beginner").length,
    intermediate: categorizedDrills.filter((d) => d.skillLevel === "intermediate").length,
    pro: categorizedDrills.filter((d) => d.skillLevel === "pro").length,
  }

  const loomCounts = {
    beginner: categorizedLoomVideos.filter((v) => v.skillLevel === "beginner").length,
    intermediate: categorizedLoomVideos.filter((v) => v.skillLevel === "intermediate").length,
    pro: categorizedLoomVideos.filter((v) => v.skillLevel === "pro").length,
  }

  console.log("Drill categorization results:")
  console.log(drillCounts)
  console.log("\nLoom video categorization results:")
  console.log(loomCounts)

  // Output a few examples of each category
  console.log("\nSample beginner drills:")
  console.log(
    categorizedDrills
      .filter((d) => d.skillLevel === "beginner")
      .slice(0, 5)
      .map((d) => d.title),
  )

  console.log("\nSample intermediate drills:")
  console.log(
    categorizedDrills
      .filter((d) => d.skillLevel === "intermediate")
      .slice(0, 5)
      .map((d) => d.title),
  )

  console.log("\nSample pro drills:")
  console.log(
    categorizedDrills
      .filter((d) => d.skillLevel === "pro")
      .slice(0, 5)
      .map((d) => d.title),
  )
}

// This would be executed in a Node.js environment
// main();
