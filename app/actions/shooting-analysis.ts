"use server"

import { analyzeShootingIssues, getRelatedIssues, type ShootingIssue } from "@/lib/shooting-analysis"
import { getDrillRecommendations, createTrainingPlan } from "@/lib/drill-recommendation"

export interface AnalysisResult {
  identifiedIssues: ShootingIssue[]
  relatedIssues: ShootingIssue[]
  issueDetails?: Record<string, string[]>
  recommendations: any[]
  trainingPlan: any
}

export async function analyzeShootingDescription(
  description: string,
  playerName: string,
  skillLevel: "beginner" | "intermediate" | "advanced" | "pro" = "intermediate",
): Promise<AnalysisResult> {
  try {
    // Step 1: Analyze the description to identify shooting issues
    const identifiedIssues = analyzeShootingIssues(description)

    // Step 2: Get related issues that might not have been explicitly mentioned
    const relatedIssues = getRelatedIssues(identifiedIssues)

    // Step 3: Extract specific details about the player's issues for more personalized recommendations
    // This helps create more tailored explanations
    const issueDetails = extractIssueDetails(description, identifiedIssues)

    // Step 4: Get drill recommendations for the identified issues
    const allIssues = [...identifiedIssues, ...relatedIssues.slice(0, 2)] // Include top 2 related issues
    const recommendations = getDrillRecommendations(allIssues, skillLevel)

    // Step 5: Create a structured training plan with personalized explanations
    const trainingPlan = createTrainingPlan(playerName, allIssues, recommendations, skillLevel)

    return {
      identifiedIssues,
      relatedIssues,
      issueDetails,
      recommendations,
      trainingPlan,
    }
  } catch (error) {
    console.error("Error analyzing shooting description:", error)
    throw new Error("Failed to analyze shooting description")
  }
}

// Add this helper function to extract specific details about the player's issues
function extractIssueDetails(description: string, issues: ShootingIssue[]): Record<string, string[]> {
  const details: Record<string, string[]> = {}

  // For each identified issue, try to extract specific details from the description
  issues.forEach((issue) => {
    const issueRegex = new RegExp(
      `(.*?)(${issue.name.toLowerCase()}|${issue.id.replace(/-/g, " ")})(.*?)(?=\\.|$|when|while|if|but|and)`,
      "gi",
    )
    const matches = [...description.matchAll(issueRegex)]

    if (matches.length > 0) {
      details[issue.id] = matches.map((match) => {
        // Combine the parts around the issue name to get the context
        return (match[1] + match[2] + match[3]).trim()
      })
    } else {
      details[issue.id] = []
    }
  })

  return details
}

