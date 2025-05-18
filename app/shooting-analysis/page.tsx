import { ShootingAnalysisForm } from "@/components/shooting-analysis-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ShootingAnalysisPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-ksa-gray subtle-pattern">
      <header className="basketball-gradient text-white py-6 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Keep Shooting Academy</h1>
            <Button variant="ghost" size="sm" asChild className="text-white hover:text-ksa-gray hover:bg-white/10">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-3 text-ksa-black">Shooting Analysis</h1>
            <p className="text-ksa-darkgray text-lg">Get a personalized training plan based on your shooting issues</p>
          </div>

          <ShootingAnalysisForm />

          <div className="mt-16 bg-white rounded-xl p-8 border border-gray-100 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-ksa-black">How It Works</h2>
            <ol className="list-decimal pl-6 space-y-6">
              <li>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-ksa-blue/10 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <span className="text-ksa-blue font-bold">1</span>
                  </div>
                  <div>
                    <span className="font-medium text-ksa-black text-lg">Describe Your Issues</span>
                    <p className="text-ksa-darkgray mt-1">
                      Provide detailed information about your shooting problems. The more specific you are, the better
                      we can help.
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-ksa-blue/10 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <span className="text-ksa-blue font-bold">2</span>
                  </div>
                  <div>
                    <span className="font-medium text-ksa-black text-lg">AI Analysis</span>
                    <p className="text-ksa-darkgray mt-1">
                      Our system analyzes your description to identify specific shooting flaws and related issues.
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-ksa-blue/10 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <span className="text-ksa-blue font-bold">3</span>
                  </div>
                  <div>
                    <span className="font-medium text-ksa-black text-lg">Custom Training Plan</span>
                    <p className="text-ksa-darkgray mt-1">
                      Receive a personalized 2-week training program with specific drills targeting your issues.
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-ksa-blue/10 rounded-full flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                    <span className="text-ksa-blue font-bold">4</span>
                  </div>
                  <div>
                    <span className="font-medium text-ksa-black text-lg">Follow Your Plan</span>
                    <p className="text-ksa-darkgray mt-1">
                      Download your PDF training plan and follow the daily drills to improve your shooting.
                    </p>
                  </div>
                </div>
              </li>
            </ol>
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
