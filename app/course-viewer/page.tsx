import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { CourseViewerContent } from "@/components/course-viewer-content"

// Loading component for the Suspense fallback
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-ksa-gray subtle-pattern">
      <header className="basketball-gradient text-white py-6 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Keep Shooting Academy</h1>
        </div>
      </header>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4 text-ksa-black">Loading Training Program</h1>
          <div className="flex justify-center mt-8">
            <div className="basketball-gradient p-8 rounded-full shadow-xl">
              <Loader2 className="h-16 w-16 animate-spin text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main page component that doesn't directly use useSearchParams
export default function CourseViewerPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CourseViewerContent />
    </Suspense>
  )
}
