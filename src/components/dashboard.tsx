import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { Navbar } from './navbar';
import { createClient } from '../lib/supabase/client';
// import { ImageAnalyzer } from './image-analyzer'
// import { Button } from './ui/button'

type FoodCategory = 'dairy_and_eggs' | 'meat' | 'vegetables' | 'fruits' | 'grains' | 'beverages' | 'snacks' | 'condiments' | 'leftovers'

type FoodItem = {
  id: string
  name: string
  expiry_date: string
  category: FoodCategory
  quantity: number
  image_url?: string
}

const categories: FoodCategory[] = [
  'dairy_and_eggs',
  'meat',
  'vegetables',
  'fruits',
  'grains',
  'beverages',
  'snacks',
  'condiments',
  'leftovers'
]

export function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | null>(null)
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  // const [showAnalyzer, setShowAnalyzer] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchFoodItems()
  }, [selectedCategory])

  async function fetchFoodItems() {
    let query = supabase.from('food_items').select('*')
    if (selectedCategory) {
      query = query.eq('category', selectedCategory)
    }
    const { data, error } = await query
    if (error) {
      console.error('Error fetching food items:', error)
      return
    }
    setFoodItems(data || [])
  }

  function formatCategory(category: string): string {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <div className="h-full">
      <Navbar />
      <main className="container mx-auto py-8">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedCategory === null
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {formatCategory(category)}
              </button>
            ))}
          </div>

          {/* <div className="flex justify-end mb-4">
            <Button
              variant={showAnalyzer ? "secondary" : "default"}
              onClick={() => setShowAnalyzer(!showAnalyzer)}
            >
              {showAnalyzer ? "Hide Analyzer" : "Analyze Food"}
            </Button>
          </div>

          {showAnalyzer && <ImageAnalyzer />} */}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {foodItems.map((item) => (
              <Link key={item.id} to={`/food/${item.id}`} className="block rounded-lg border bg-card p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                {item.image_url && (
                  <div className="mb-4">
                  <img
                    src={item.image_url} 
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-md"
                  />
                  </div>
                )}
                <h3 className="font-semibold mb-2">{item.name}</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>Category: {formatCategory(item.category)}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Expires: {new Date(item.expiry_date).toLocaleDateString()}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
