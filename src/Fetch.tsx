import { useEffect, useRef, useState } from "react";
import { calculatePagination } from "./utils/helper";

interface Product {
  id: number;
  title: string;
}

const BASE_URL = "https://api.escuelajs.co/api/v1";

function Fetch() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setIsLoading(true);

      try {
        const { limit, offset } = calculatePagination(page);
        const response = await fetch(
          `${BASE_URL}/products?offset=${offset}&limit=${limit}`,
          {
            signal: abortControllerRef.current?.signal,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = (await response.json()) as Product[];
        setProducts(data);
      } catch (error: any) {
        if (error.name === "AbortError") {
          console.log("Aborted");
          return;
        }
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [page]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
      <main className="bg-white shadow-2xl rounded-lg p-8 w-full max-w-2xl transform transition duration-500 hover:scale-105">
        <h1 className="font-extrabold text-4xl text-center text-gray-900 mb-6">
          Explore Amazing Products
        </h1>
        <button
          className="mb-6 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold py-3 px-6 rounded-full hover:bg-gradient-to-l hover:from-blue-500 hover:to-green-400 transform transition duration-300 hover:scale-110"
          onClick={() => setPage(page + 1)}
        >
          Load More Products (Page {page})
        </button>

        <ul className="space-y-6">
          {products.map((product) => (
            <li
              key={product.id}
              className="p-6 bg-gradient-to-r from-yellow-200 via-red-200 to-pink-200 rounded-lg shadow-lg hover:shadow-2xl transform transition duration-300 hover:scale-105"
            >
              <span className="block font-bold text-lg text-gray-900">
                Product Title:
              </span>
              <span className="block font-light text-gray-700">
                {product.title}
              </span>
            </li>
          ))}
        </ul>

        {isLoading && (
          <div className="mt-8 text-center text-blue-500 font-medium animate-pulse">
            Loading...
          </div>
        )}
        {error && (
          <div className="mt-8 text-center text-red-600 font-semibold">
            Something went wrong! Please try again.
          </div>
        )}
      </main>
    </div>
  );
}

export default Fetch;
