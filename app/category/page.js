import Card from "../shared/Card";

// 1. Create a helper function to map the URL category to your specific API endpoints
const getApiEndpoint = (category) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  // Map the category to the correct API route
  const endpoints = {
    casual: `${baseUrl}/api/products`,
    formal: `${baseUrl}/api/formal`,
    traditional: `${baseUrl}/api/traditional`,
    sports: `${baseUrl}/api/sports`,
  };

  // Convert the category to lowercase to match the object keys safely
  return endpoints[category.toLowerCase()];
};

// 2. Fetch the data dynamically
async function getProducts(category) {
  const endpoint = getApiEndpoint(category);

  // If the user types a random category in the URL (e.g., /aliens), handle it
  if (!endpoint) {
    return null; 
  }

  const res = await fetch(endpoint, { cache: 'no-store' });
  
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  
  return res.json();
}

// 3. The Page Component receives 'params' automatically
export default async function CategoryPage({ params }) {
  // Extract the category from the URL
  const category = params.category; 
  
  const response = await getProducts(category);
  
  // Handle invalid categories
  if (!response) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Category Not Found</h1>
        <p className="text-gray-500 mt-4">We don't have a "{category}" category.</p>
      </main>
    );
  }

  const products = response.data;

  // Capitalize the first letter for the page title
  const displayTitle = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{displayTitle} Collection</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}