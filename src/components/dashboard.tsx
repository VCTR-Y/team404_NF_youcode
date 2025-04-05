import { Navbar } from './navbar'

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto py-8">
        <div className="grid gap-6">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Welcome to Your Dashboard</h2>
            <p className="text-gray-600">
              This is your personalized dashboard where you can manage your account and access key features.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg border bg-white p-6 shadow-sm">
                <h3 className="font-semibold mb-2">Card {i}</h3>
                <p className="text-gray-600">This is a sample card that you can customize with your content.</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
