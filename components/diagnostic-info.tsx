"use client"

interface DiagnosticInfoProps {
  courseData: any
  searchParams: {
    issues?: string
    playerName?: string
    source?: string
  }
  isLoading: boolean
}

export function DiagnosticInfo({ courseData, searchParams, isLoading }: DiagnosticInfoProps) {
  if (process.env.NODE_ENV === "production") {
    return null
  }

  return (
    <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs font-mono">
      <h3 className="font-bold mb-2">Diagnostic Information</h3>
      <div className="space-y-2">
        <div>
          <strong>Loading State:</strong> {isLoading ? "Loading" : "Completed"}
        </div>
        <div>
          <strong>Search Params:</strong>
          <pre className="mt-1 p-2 bg-gray-200 rounded overflow-auto">{JSON.stringify(searchParams, null, 2)}</pre>
        </div>
        <div>
          <strong>Course Data:</strong>
          <pre className="mt-1 p-2 bg-gray-200 rounded overflow-auto max-h-40">
            {courseData ? JSON.stringify(courseData, null, 2).substring(0, 500) + "..." : "No data"}
          </pre>
        </div>
      </div>
    </div>
  )
}
