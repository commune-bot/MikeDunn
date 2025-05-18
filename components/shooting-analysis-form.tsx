"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Sparkles } from "lucide-react"
import { analyzeShootingDescription } from "@/app/actions/shooting-analysis"

export function ShootingAnalysisForm() {
  const [description, setDescription] = useState("")
  const [playerName, setPlayerName] = useState("")
  const [skillLevel, setSkillLevel] = useState<"beginner" | "intermediate" | "pro" | "advanced">("intermediate")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!description.trim()) {
      setError("Please describe your shooting issues")
      return
    }

    setError("")
    setIsAnalyzing(true)

    try {
      // Store the description in localStorage for potential use in the course viewer
      localStorage.setItem("shootingDescription", description)
      localStorage.setItem("playerName", playerName || "Player")
      localStorage.setItem("skillLevel", skillLevel)

      // Analyze the description
      const result = await analyzeShootingDescription(description, playerName || "Player", skillLevel)

      // Store the analysis result in localStorage
      localStorage.setItem("analysisResult", JSON.stringify(result))

      // Convert the training plan to a course format and store it
      localStorage.setItem("basketballCourse", JSON.stringify(result.trainingPlan))

      toast({
        title: "Analysis complete!",
        description: "Your personalized training plan is ready.",
      })

      // Redirect to the course viewer
      router.push("/course-viewer?source=analysis")
    } catch (error) {
      console.error("Error:", error)
      setError("There was a problem analyzing your description. Please try again.")

      toast({
        title: "Analysis failed",
        description: "There was a problem creating your training plan. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <Card className="border-none shadow-lg overflow-hidden">
      <CardHeader className="basketball-gradient text-white">
        <CardTitle className="flex items-center">
          <Sparkles className="mr-2 h-5 w-5" />
          Shooting Analysis
        </CardTitle>
        <CardDescription className="text-white/80">
          Describe your shooting issues for a personalized training plan
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="playerName" className="text-ksa-black">
              Your Name
            </Label>
            <Input
              id="playerName"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="border-ksa-blue/20 focus:border-ksa-blue focus-visible:ring-ksa-blue/30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skillLevel" className="text-ksa-black">
              Skill Level
            </Label>
            <Select value={skillLevel} onValueChange={(value: any) => setSkillLevel(value)}>
              <SelectTrigger className="border-ksa-blue/20 focus:border-ksa-blue focus-visible:ring-ksa-blue/30">
                <SelectValue placeholder="Select your skill level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="pro">Pro / Advanced</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-ksa-darkgray">This helps us tailor drills to your experience level</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-ksa-black">
              Shooting Issues
            </Label>
            <Textarea
              id="description"
              placeholder="Describe what's wrong with your jump shot in detail (e.g., 'My guide hand pushes the ball during release, I have a flat shot with inconsistent arc, and I struggle with balance when shooting off the dribble. My elbow tends to flare out when I'm tired.')"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="w-full border-ksa-blue/20 focus:border-ksa-blue focus-visible:ring-ksa-blue/30"
            />
            <p className="text-sm text-ksa-darkgray">
              The more specific details you provide about your issues, the more personalized your training plan will be
            </p>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </CardContent>
        <CardFooter className="border-t border-ksa-gray/20 py-4">
          <Button type="submit" disabled={isAnalyzing} className="w-full bg-ksa-blue hover:bg-ksa-blue/90 text-white">
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Create Training Plan"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

