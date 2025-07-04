import { analyzeShootingIssues } from "@/lib/shooting-analysis"
import { getDrillRecommendations, createTrainingPlan } from "@/lib/drill-recommendation"

// Updated to only address the issues that are actually identified from user input
export async function generateCourseWithAI(
  playerName: string,
  issues: string[],
  skillLevel = "intermediate",
): Promise<any> {
  try {
    // Convert the issues array into a description string for analysis
    const issuesDescription = issues.join(". ") + "."

    // Step 1: Analyze the issues to identify specific shooting problems
    const identifiedIssues = analyzeShootingIssues(issuesDescription)

    // Step 2: ONLY use the issues that were actually identified from user input
    // Do NOT add related issues unless they were explicitly mentioned
    const issuesToAddress = identifiedIssues

    // If no issues were identified from the analysis, fall back to creating issues from the raw input
    if (issuesToAddress.length === 0) {
      // Create a basic fallback that still only addresses what the user mentioned
      return createBasicFallback(playerName, issues, skillLevel)
    }

    // Step 3: Get drill recommendations for ONLY the identified issues
    const recommendations = getDrillRecommendations(
      issuesToAddress,
      skillLevel as "beginner" | "intermediate" | "advanced" | "pro",
    )

    // Step 4: Create a structured training plan using ONLY the user's issues
    const trainingPlan = createTrainingPlan(
      playerName,
      issuesToAddress,
      recommendations,
      skillLevel as "beginner" | "intermediate" | "advanced" | "pro",
    )

    return trainingPlan
  } catch (error) {
    console.error("Error generating course with AI:", error)

    // If there's an error with the analysis system, create a basic fallback
    return createBasicFallback(playerName, issues, skillLevel)
  }
}

// Simple fallback that still uses the analysis system but with minimal processing
function createBasicFallback(playerName: string, issues: string[], skillLevel = "intermediate") {
  try {
    // Try to analyze at least the first issue
    const firstIssue = issues[0] || "inconsistent shooting"
    const identifiedIssues = analyzeShootingIssues(firstIssue)

    if (identifiedIssues.length > 0) {
      const recommendations = getDrillRecommendations(
        identifiedIssues,
        skillLevel as "beginner" | "intermediate" | "advanced" | "pro",
      )
      return createTrainingPlan(
        playerName,
        identifiedIssues,
        recommendations,
        skillLevel as "beginner" | "intermediate" | "advanced" | "pro",
      )
    }
  } catch (error) {
    console.error("Error in basic fallback:", error)
  }

  // Last resort fallback with generic content that only addresses user's stated issues
  return {
    title: "Two-Week Jump Shot Training Program",
    introduction: `Welcome to your personalized jump shot training program, ${playerName}! This 2-week course addresses your shooting issues: ${issues.join(", ")}. The program progresses from fundamental mechanics in week 1 to game application in week 2.`,
    issues: issues,
    days: Array.from({ length: 14 }, (_, i) => ({
      day: i + 1,
      title: `Day ${i + 1}: ${i < 7 ? "Foundation Building" : "Game Application"}`,
      description: i < 7 ? "Focus on fundamental mechanics" : "Apply improved mechanics in game situations",
      drills: [
        {
          name: "Form Shooting",
          description: "Basic shooting form practice",
          sets: "3",
          reps: "10 makes per set",
          focus: "Proper shooting mechanics",
          explanation: `${playerName}, focus on consistent form and follow-through with each repetition.`,
        },
      ],
      notes: `Day ${i + 1} focus: ${i < 7 ? "Building proper mechanics" : "Applying improved form"}. Stay focused on quality repetitions.`,
    })),
  }
}
