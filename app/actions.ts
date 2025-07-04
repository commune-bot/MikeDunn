import { analyzeShootingIssues, getRelatedIssues } from "@/lib/shooting-analysis"
import { getDrillRecommendations, createTrainingPlan } from "@/lib/drill-recommendation"

// Remove the createFallbackCourse function and replace generateCourseWithAI with proper analysis
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

    // Step 2: Get related issues that might not have been explicitly mentioned
    const relatedIssues = getRelatedIssues(identifiedIssues)

    // Step 3: Combine primary and related issues (limit related issues to top 2)
    const allIssues = [...identifiedIssues, ...relatedIssues.slice(0, 2)]

    // Step 4: Get drill recommendations for the identified issues
    const recommendations = getDrillRecommendations(
      allIssues,
      skillLevel as "beginner" | "intermediate" | "advanced" | "pro",
    )

    // Step 5: Create a structured training plan
    const trainingPlan = createTrainingPlan(
      playerName,
      allIssues,
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

  // Last resort fallback with generic content
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
