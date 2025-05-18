"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { ShootingIssue } from "@/lib/shooting-analysis"

interface AnalysisResultsDisplayProps {
  analysisResult: any
}

export function AnalysisResultsDisplay({ analysisResult }: AnalysisResultsDisplayProps) {
  if (!analysisResult) return null

  const { identifiedIssues, relatedIssues, recommendations } = analysisResult

  return (
    <Card className="border-none shadow-lg overflow-hidden mb-8">
      <CardHeader className="basketball-gradient text-white">
        <CardTitle>Shooting Analysis Results</CardTitle>
        <CardDescription className="text-white/80">
          We've analyzed your shooting description and identified the following issues
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Primary Issues</h3>
            <div className="flex flex-wrap gap-2">
              {identifiedIssues.map((issue: ShootingIssue) => (
                <Badge key={issue.id} className="bg-ksa-blue text-white">
                  {issue.name}
                </Badge>
              ))}
            </div>
          </div>

          {relatedIssues.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Related Issues</h3>
              <div className="flex flex-wrap gap-2">
                {relatedIssues.map((issue: ShootingIssue) => (
                  <Badge key={issue.id} variant="outline" className="border-ksa-blue/50 text-ksa-blue">
                    {issue.name}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                These related issues often accompany your primary issues and may also need attention.
              </p>
            </div>
          )}

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="issues-details">
              <AccordionTrigger className="text-ksa-blue font-medium">Detailed Issue Descriptions</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 mt-2">
                  {[...identifiedIssues, ...relatedIssues].map((issue: ShootingIssue) => (
                    <div key={issue.id} className="border-b pb-3 last:border-b-0">
                      <h4 className="font-medium text-ksa-black">{issue.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion type="single" collapsible className="w-full mt-4">
            <AccordionItem value="personalized-approach">
              <AccordionTrigger className="text-ksa-blue font-medium">Your Personalized Approach</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 mt-2">
                  <p className="text-sm text-gray-600">
                    Based on your specific description, we've created a training plan that addresses your unique
                    shooting issues. Each drill in your program includes a personalized explanation of how it will help
                    fix your particular shooting flaws.
                  </p>
                  <p className="text-sm text-gray-600">
                    Your training program progresses from foundational mechanics in week 1 to practical application in
                    week 2, ensuring you build proper form before applying it in game-like situations.
                  </p>
                  <div className="bg-ksa-blue/10 p-4 rounded-md mt-4">
                    <h4 className="font-medium text-ksa-blue mb-2">Training Philosophy</h4>
                    <p className="text-sm text-gray-600">
                      We follow Mike Dunn's "Keep Shooting Simple" approach, focusing on proper mechanics, continuous
                      ball movement, and developing a repeatable shooting motion that works under pressure.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  )
}
