"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronRight, FileText, BarChart3 } from "lucide-react"

export default function HomePage() {
  const [playerName, setPlayerName] = useState("")
  const [issues, setIssues] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  // Add skillLevel state
  const [skillLevel, setSkillLevel] = useState<"beginner" | "intermediate" | "pro">("intermediate")
  const router = useRouter()

  // Update the handleSubmit function to include skillLevel
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const trimmedIssues = issues.trim()

    if (!trimmedIssues) {
      toast({
        title: "Missing information",
        description: "Please describe your jumpshot issues to generate a program.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      // Parse the issues into a comma-separated list
      const formattedIssues = trimmedIssues
        .split(/[.,;]/)
        .map((issue) => issue.trim())
        .filter((issue) => issue.length > 0)
        .join(",")

      if (!formattedIssues) {
        throw new Error("No valid issues found after formatting")
      }

      // Redirect to the course viewer with the issues as query parameters
      router.push(
        `/course-viewer?issues=${encodeURIComponent(formattedIssues)}&name=${encodeURIComponent(
          playerName || "Player",
        )}&method=built-in&skillLevel=${encodeURIComponent(skillLevel)}`,
      )
    } catch (error) {
      console.error("Error in form submission:", error)
      toast({
        title: "Error submitting form",
        description: "Please check your input and try again.",
        variant: "destructive",
      })
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Updated header with darker text for better visibility */}
      <header className="py-6 border-b border-unc-blue/20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center">
            <h1 className="text-xl font-bold text-unc-navy">KSAssistant</h1>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section with white background and UNC blue text */}
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-16 text-center"
            >
              <h2 className="text-4xl font-bold mb-4 text-unc-blue">TRANSFORM YOUR JUMP SHOT IN 14 DAYS</h2>
              <p className="text-xl text-unc-blue max-w-2xl mx-auto">
                Get a custom-built training program that targets your specific weaknesses and turns them into strengths
              </p>
            </motion.div>
          </div>
        </div>

        {/* Form Section */}
        <div className="py-12 bg-white">
          <div className="container mx-auto px-4 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl shadow-md border border-unc-blue/20 p-8 mb-16 -mt-24 relative z-10"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label htmlFor="playerName" className="block text-sm font-medium text-gray-800 mb-2">
                    What should we call you?
                  </label>
                  <input
                    id="playerName"
                    type="text"
                    placeholder="Your name"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-unc-blue focus:ring focus:ring-unc-blue/20 transition-all duration-200 outline-none text-gray-800"
                  />
                </div>
                {/* Add the skill level selector to the form */}
                <div>
                  <label htmlFor="skillLevel" className="block text-sm font-medium text-gray-800 mb-2">
                    What's your skill level?
                  </label>
                  <select
                    id="skillLevel"
                    value={skillLevel}
                    onChange={(e) => setSkillLevel(e.target.value as "beginner" | "intermediate" | "pro")}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-unc-blue focus:ring focus:ring-unc-blue/20 transition-all duration-200 outline-none text-gray-800"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="pro">Pro / Advanced</option>
                  </select>
                  <p className="mt-2 text-sm text-gray-700">
                    This helps us tailor your program to your current abilities.
                  </p>
                </div>

                <div>
                  <label htmlFor="issues" className="block text-sm font-medium text-gray-800 mb-2">
                    What's holding your jump shot back?
                  </label>
                  <textarea
                    id="issues"
                    placeholder="Tell us what's frustrating you about your shot (e.g., inconsistent release, guide hand pushing the ball, off-balance when shooting)"
                    value={issues}
                    onChange={(e) => setIssues(e.target.value)}
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-unc-blue focus:ring focus:ring-unc-blue/20 transition-all duration-200 outline-none text-gray-800"
                  />
                  <p className="mt-2 text-sm text-gray-700">
                    Be specific! The more details you provide, the more targeted your program will be.
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full bg-unc-blue hover:bg-unc-blue/90 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    {isGenerating ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Building Your Program...
                      </div>
                    ) : (
                      "GET MY CUSTOM TRAINING PLAN"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>

            {/* Advanced Features Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mb-16"
            >
              <h3 className="text-2xl font-bold text-center mb-8 text-unc-navy">Advanced Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/shooting-analysis" className="block">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
                    <div className="flex items-center mb-4">
                      <div className="bg-unc-blue/10 p-3 rounded-full mr-4">
                        <BarChart3 className="h-6 w-6 text-unc-blue" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-800">Detailed Shooting Analysis</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">
                      Get an in-depth analysis of your shooting mechanics with specific recommendations.
                    </p>
                    <div className="flex items-center text-unc-blue font-medium">
                      Try Analysis Tool <ChevronRight className="ml-1 h-4 w-4" />
                    </div>
                  </div>
                </Link>

                <Link href="/training-guide" className="block">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
                    <div className="flex items-center mb-4">
                      <div className="bg-unc-blue/10 p-3 rounded-full mr-4">
                        <FileText className="h-6 w-6 text-unc-blue" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-800">Training Guide</h3>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">
                      Learn about shooting mechanics and how to structure your training for maximum improvement.
                    </p>
                    <div className="flex items-center text-unc-blue font-medium">
                      View Guide <ChevronRight className="ml-1 h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {[
                {
                  title: "Personalized For You",
                  description: "No generic drills. Every exercise is selected specifically for your shooting flaws.",
                  color: "bg-unc-blue",
                },
                {
                  title: "Video Demonstrations",
                  description: "Watch pro-quality videos showing exactly how to perform each drill correctly.",
                  color: "bg-unc-light-blue",
                },
                {
                  title: "Instant PDF Download",
                  description: "Get your complete 14-day program immediately with clickable video links.",
                  color: "bg-unc-blue",
                },
              ].map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className={`${feature.color} h-1 -mx-6 -mt-6 mb-5`}></div>
                  <h3 className="text-lg font-medium mb-2 text-gray-800">{feature.title}</h3>
                  <p className="text-sm text-gray-700">{feature.description}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </main>

      <footer className="py-8 bg-unc-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-white mb-4 md:mb-0">
              © {new Date().getFullYear()} KSAssistant. Transform your shot today.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-white hover:text-white/90 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-white hover:text-white/90 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-white hover:text-white/90 transition-colors">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
