import { getDrillsBySkillLevel, getLoomVideosBySkillLevel } from "@/lib/skill-level-categorization"

// Update the createFallbackCourse function to use the correct Loom videos and all available drills
function createFallbackCourse(playerName: string, issues: string[], skillLevel = "intermediate") {
  const firstName = playerName.split(" ")[0] || playerName || "Player"

  // Make sure all videos are categorized before filtering
  // const categorizedDrills = categorizeAllDrills(); // These functions are not defined in the original code
  // const categorizedLoomVideos = categorizeAllLoomVideos(); // These functions are not defined in the original code

  // Get all drills appropriate for the selected skill level
  // const availableDrills = skillLevel === "beginner"
  //   ? categorizedDrills.filter(drill => drill.skillLevel === "beginner")
  //   : skillLevel === "intermediate"
  //     ? categorizedDrills.filter(drill => drill.skillLevel === "beginner" || drill.skillLevel === "intermediate")
  //     : categorizedDrills; // Pro level gets all drills

  // Get all Loom videos appropriate for the selected skill level
  // const availableLoomVideos = skillLevel === "beginner"
  //   ? categorizedLoomVideos.filter(video => video.skillLevel === "beginner")
  //   : skillLevel === "intermediate"
  //     ? categorizedLoomVideos.filter(video => video.skillLevel === "beginner" || video.skillLevel === "intermediate")
  //     : categorizedLoomVideos; // Pro level gets all videos

  // Get all drills appropriate for the selected skill level
  const availableDrills = getDrillsBySkillLevel(skillLevel as "beginner" | "intermediate" | "pro")
  const availableLoomVideos = getLoomVideosBySkillLevel(skillLevel as "beginner" | "intermediate" | "pro")

  // Convert drills to the format needed for the course
  const drillOptions = availableDrills.map((drill) => {
    return {
      name: drill.title,
      description: drill.description || `Practice ${drill.title.toLowerCase()} technique`,
      sets: skillLevel === "beginner" ? "3" : skillLevel === "intermediate" ? "4" : "5",
      reps:
        skillLevel === "beginner"
          ? "10 makes per set"
          : skillLevel === "intermediate"
            ? "8 makes per set"
            : "6 makes per set",
      explanation: `This drill helps you improve your shooting mechanics, ${firstName}. ${
        drill.description || `Focus on proper technique and consistency with each repetition.`
      }`,
      video: {
        title: drill.title,
        url: drill.url,
        type: drill.type || "youtube",
      },
      skillLevel: drill.skillLevel,
    }
  })

  // Convert Loom videos to the format needed for the course
  const loomExplanations = availableLoomVideos.map((video) => {
    return {
      name: video.title,
      description: video.description || `Detailed explanation of ${video.title.toLowerCase()} technique`,
      explanation: `In this video, I break down exactly how to perform this drill correctly, ${firstName}. This is crucial for your shot development.`,
      video: {
        title: video.title,
        url: video.url,
        type: "loom",
      },
      skillLevel: video.skillLevel,
    }
  })

  // Generate 14 days with different drills each day
  const days = Array.from({ length: 14 }, (_, i) => {
    const dayNumber = i + 1
    const isWeek1 = dayNumber <= 7

    // Select 2-4 different drills for this day (avoiding repeats from previous days when possible)
    const dayDrillCount = Math.floor(Math.random() * 3) + 2 // 2-4 drills
    const shuffledDrills = [...drillOptions].sort(() => Math.random() - 0.5)
    const selectedDrills = shuffledDrills.slice(0, dayDrillCount)

    // Add 1-2 Loom explanation videos
    const loomCount = Math.floor(Math.random() * 2) + 1 // 1-2 explanations
    const shuffledLoom = [...loomExplanations].sort(() => Math.random() - 0.5)
    const selectedLoom = shuffledLoom.slice(0, loomCount)

    // Combine all content for this day
    const allDayContent = [...selectedDrills, ...selectedLoom]

    // Create day title based on skill level
    let dayTitle = ""
    if (skillLevel === "beginner") {
      dayTitle = isWeek1
        ? [
            "Building Your Foundation",
            "Mastering the Basics",
            "Form Development",
            "Mechanical Excellence",
            "Rhythm and Flow",
            "Technical Precision",
            "Core Mechanics",
          ][dayNumber - 1]
        : [
            "Simple Game Applications",
            "Consistency Building",
            "Form Under Fatigue",
            "Basic Combinations",
            "Shooting Rhythm",
            "Accuracy Focus",
            "Confidence Building",
          ][dayNumber - 8]
    } else if (skillLevel === "intermediate") {
      dayTitle = isWeek1
        ? [
            "Refining Your Mechanics",
            "Technical Advancement",
            "Form Consistency",
            "Mechanical Precision",
            "Rhythm Enhancement",
            "Technical Integration",
            "Advanced Mechanics",
          ][dayNumber - 1]
        : [
            "Game Speed Application",
            "Pressure Testing",
            "Performance Integration",
            "Advanced Combinations",
            "Game Situation Training",
            "Speed and Accuracy",
            "Competition Ready",
          ][dayNumber - 8]
    } else {
      // pro
      dayTitle = isWeek1
        ? [
            "Elite Mechanics Refinement",
            "Technical Mastery",
            "Form Perfection",
            "Precision Development",
            "Elite Rhythm Training",
            "Technical Excellence",
            "Pro-Level Mechanics",
          ][dayNumber - 1]
        : [
            "Game Replication",
            "Pressure Excellence",
            "Performance Optimization",
            "Complex Combinations",
            "Elite Game Simulation",
            "Speed and Precision",
            "Competition Mastery",
          ][dayNumber - 8]
    }

    return {
      day: dayNumber,
      title: `Day ${dayNumber}: ${dayTitle}`,
      description: `${isWeek1 ? "Focus on fundamental mechanics" : "Apply improved mechanics in game-like situations"}`,
      drills: allDayContent,
      notes: `Day ${dayNumber} focus: ${isWeek1 ? "Building proper mechanics" : "Applying your improved form under pressure"}. Remember, ${firstName}, consistency is key - focus on quality repetitions rather than rushing through the drills.`,
    }
  })

  // Customize the title based on skill level
  let courseTitle = ""
  if (skillLevel === "beginner") {
    courseTitle = "Two-Week Jump Shot Foundation Course"
  } else if (skillLevel === "intermediate") {
    courseTitle = "Two-Week Jump Shot Advancement Course"
  } else {
    // pro
    courseTitle = "Two-Week Elite Jump Shot Optimization Course"
  }

  return {
    title: courseTitle,
    introduction: `Welcome to your personalized jump shot training program, ${firstName}! This 2-week course is designed for ${skillLevel}-level players and addresses your specific shooting issues: ${issues.join(", ")}. Each day includes targeted drills with video demonstrations to help you improve your form and consistency. The program progresses from fundamental mechanics in week 1 to more game-like applications in week 2.`,
    issues: issues,
    days: days,
  }
}

// Update the generateCourseWithAI function to accept and pass the skill level parameter
export async function generateCourseWithAI(
  playerName: string,
  issues: string[],
  skillLevel = "intermediate",
): Promise<any> {
  try {
    // For now, we'll use the fallback course generation
    // In a production environment, this would call an AI service
    return createFallbackCourse(playerName, issues, skillLevel)
  } catch (error) {
    console.error("Error generating course with AI:", error)
    // If there's an error, still return a fallback course
    return createFallbackCourse(playerName, issues, skillLevel)
  }
}
