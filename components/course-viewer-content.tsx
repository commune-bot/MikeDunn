"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, ArrowLeft, CheckCircle, Bug } from "lucide-react"
import Link from "next/link"
import { generateCourseWithAI } from "@/app/actions"
import { useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { PdfGenerator } from "@/components/pdf-generator"
import { PdfGeneratorDebug } from "@/components/pdf-generator-debug"
import { PdfGeneratorFallback } from "@/components/pdf-generator-fallback"
import { DiagnosticInfo } from "@/components/diagnostic-info"
import { AnalysisResultsDisplay } from "@/components/analysis-results-display"

export function CourseViewerContent() {
  const [courseContent, setCourseContent] = useState(null)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [debugMode, setDebugMode] = useState(false)
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const issues = searchParams.get("issues") || ""
  const playerName = searchParams.get("name") || "Player"
  const source = searchParams.get("source")
  // Update the useEffect hook to get the skill level from search params
  const skillLevel = searchParams.get("skillLevel") || "intermediate"

  useEffect(() => {
    const fetchCourseContent = async () => {
      console.log("Fetching course content...", { issues, playerName, source, skillLevel })

      // If coming from analysis, try to get the content from localStorage
      if (source === "analysis") {
        try {
          console.log("Attempting to load analysis result from localStorage")
          const storedAnalysis = localStorage.getItem("analysisResult")
          const storedCourse = localStorage.getItem("basketballCourse")

          if (storedAnalysis) {
            const parsedAnalysis = JSON.parse(storedAnalysis)
            console.log("Analysis result loaded from localStorage:", parsedAnalysis)
            setAnalysisResult(parsedAnalysis)
          }

          if (storedCourse) {
            const parsedContent = JSON.parse(storedCourse)
            console.log("Course content loaded from localStorage:", parsedContent)
            setCourseContent(parsedContent)
            setIsLoading(false)
            return
          } else {
            console.warn("No content found in localStorage with key 'basketballCourse'")
          }
        } catch (error) {
          console.error("Error parsing stored data:", error)
          toast({
            title: "Error loading saved course",
            description: "There was a problem loading your analysis results. Please try again.",
            variant: "destructive",
          })
        }
      }

      // If coming from JSON import, try to get the content from localStorage
      else if (source === "json") {
        try {
          console.log("Attempting to load from localStorage")
          const storedJson = localStorage.getItem("basketballCourse")
          if (storedJson) {
            const parsedContent = JSON.parse(storedJson)
            console.log("Content loaded from localStorage:", parsedContent)
            setCourseContent(parsedContent)
            setIsLoading(false)
            return
          } else {
            console.warn("No content found in localStorage with key 'basketballCourse'")
          }
        } catch (error) {
          console.error("Error parsing stored JSON:", error)
          toast({
            title: "Error loading saved course",
            description: "There was a problem loading your saved course. Please try again.",
            variant: "destructive",
          })
        }
      }

      // Otherwise, generate course with AI
      if (!issues) {
        console.warn("No issues provided, skipping course generation")
        toast({
          title: "Missing information",
          description: "Please provide jumpshot issues to generate a program.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        console.log("Generating course with AI for issues:", issues)
        // Parse the issues
        const issuesArray = issues.split(",").filter((issue) => issue.trim().length > 0)

        if (issuesArray.length === 0) {
          throw new Error("No valid issues provided")
        }

        console.log("Parsed issues array:", issuesArray)

        // Update the fetchCourseContent function to pass the skill level to the generateCourseWithAI function
        // Find the code block that calls generateCourseWithAI and update it:
        // Call the server action to generate the course
        const content = await generateCourseWithAI(playerName, issuesArray, skillLevel)

        if (!content) {
          throw new Error("Course generation returned empty content")
        }

        console.log("Course content generated successfully:", content)
        setCourseContent(content)

        // Store the generated course in localStorage for future reference
        localStorage.setItem("basketballCourse", JSON.stringify(content))
      } catch (error) {
        console.error("Error fetching course content:", error)

        toast({
          title: "Using simplified course",
          description: "We encountered an issue with course generation, so we've created a simplified version.",
          variant: "warning",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourseContent()
  }, [issues, playerName, source, toast, skillLevel])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-ksa-gray subtle-pattern">
        <header className="basketball-gradient text-white py-6 shadow-md">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold">Keep Shooting Academy</h1>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4 text-ksa-black">Creating Your Training Program</h1>
            <p className="text-ksa-darkgray mb-12">
              We're generating your personalized 2-week jumpshot training program...
            </p>
            <div className="flex justify-center">
              <div className="basketball-gradient p-8 rounded-full shadow-xl">
                <Loader2 className="h-16 w-16 animate-spin text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!courseContent) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-ksa-gray subtle-pattern">
        <header className="basketball-gradient text-white py-6 shadow-md">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold">Keep Shooting Academy</h1>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4 text-ksa-black">No Training Program Found</h1>
              <p className="text-ksa-darkgray mb-8">Please provide jumpshot issues to generate a program.</p>
              <Button asChild className="bg-ksa-blue hover:bg-ksa-blue/90 text-white btn-animated">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>

            {/* Add diagnostic component */}
            <DiagnosticInfo
              courseData={courseContent}
              searchParams={{ issues, playerName, source }}
              isLoading={isLoading}
            />

            <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Troubleshooting Steps</h2>
              <ol className="list-decimal pl-6 space-y-3">
                <li>Make sure you've entered at least one jumpshot issue</li>
                <li>Try refreshing the page and submitting again</li>
                <li>Check your internet connection</li>
                <li>Try using the JSON import option if you have a course in JSON format</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-ksa-gray subtle-pattern">
      <header className="basketball-gradient text-white py-6 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Keep Shooting Academy</h1>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDebugMode(!debugMode)}
                className="text-white hover:text-white/80 hover:bg-white/10"
              >
                <Bug className="h-4 w-4 mr-1" />
                {debugMode ? "Normal Mode" : "Debug Mode"}
              </Button>
              <Button variant="ghost" size="sm" asChild className="text-white hover:text-white/80 hover:bg-white/10">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Display analysis results if available */}
          {analysisResult && source === "analysis" && <AnalysisResultsDisplay analysisResult={analysisResult} />}

          <Card className="border-none shadow-xl overflow-hidden card-hover-effect">
            <CardHeader className="basketball-gradient text-white">
              <CardTitle className="text-2xl">Your Training Program is Ready!</CardTitle>
              <CardDescription className="text-white/80">
                We've created a personalized 2-week jumpshot training program based on your issues
              </CardDescription>
            </CardHeader>
            <CardContent className="bg-white p-8">
              {/* Card content remains the same */}
              <div className="py-8">
                <div className="w-24 h-24 mx-auto mb-8 basketball-pattern rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-center text-ksa-black">Download Your PDF</h3>
                <p className="text-center text-ksa-darkgray mb-6">
                  Your 2-week training program includes daily drills, video links, and coaching notes
                </p>

                <div className="bg-ksa-gray/50 rounded-xl p-6 mb-8 border border-ksa-blue/10">
                  <h4 className="font-medium text-ksa-black mb-4">Program Details:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="bg-ksa-blue/10 p-1.5 rounded-full mr-3 mt-0.5">
                        <CheckCircle className="h-4 w-4 text-ksa-blue" />
                      </span>
                      <span className="text-sm text-ksa-darkgray">14 days of structured training</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-ksa-blue/10 p-1.5 rounded-full mr-3 mt-0.5">
                        <CheckCircle className="h-4 w-4 text-ksa-blue" />
                      </span>
                      <span className="text-sm text-ksa-darkgray">Personalized drills for your specific issues</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-ksa-blue/10 p-1.5 rounded-full mr-3 mt-0.5">
                        <CheckCircle className="h-4 w-4 text-ksa-blue" />
                      </span>
                      <span className="text-sm text-ksa-darkgray">Interactive video links for each drill</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-white border-t border-ksa-gray/20 py-6">
              {debugMode ? (
                <PdfGeneratorDebug courseData={courseContent} playerName={playerName} />
              ) : (
                <div className="space-y-4 w-full">
                  <PdfGenerator courseData={courseContent} playerName={playerName} />
                  <div className="text-center">
                    <p className="text-xs text-ksa-darkgray mb-2">Having trouble with the PDF?</p>
                    <PdfGeneratorFallback courseData={courseContent} playerName={playerName} />
                  </div>
                </div>
              )}
            </CardFooter>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-ksa-darkgray">
              Follow your daily training program and upload a new video after two weeks to track your progress.
            </p>
          </div>
        </div>
      </div>

      <footer className="bg-ksa-black text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold mb-2">Keep Shooting Academy</h2>
              <p className="text-white/60">Perfect your jumpshot with personalized training</p>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-white/60 text-sm mb-2">
                © {new Date().getFullYear()} Keep Shooting Academy. All rights reserved.
              </div>
              <div className="flex space-x-4">
                <a href="#" className="text-white/60 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

