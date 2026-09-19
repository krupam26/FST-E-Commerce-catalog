"use client";

import { FormEvent, useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  stock: number;
  sku: string;
  imageUrl?: string;
  isActive: boolean;
}

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  brand: "",
  stock: "",
  sku: "",
  imageUrl: "",
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [form, setForm] = useState(emptyForm);

  async function fetchProducts() {
    try {
      setLoading(true);

      const response = await fetch("/api/products");
      const data = await response.json();

      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  function handleChange(
    field: keyof typeof emptyForm,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      const url = "/api/products";

      const method = editingId ? "PUT" : "POST";

      const body = {
        ...(editingId ? { id: editingId } : {}),
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        brand: form.brand,
        stock: Number(form.stock),
        sku: form.sku,
        imageUrl: form.imageUrl,
        isActive: true,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Something went wrong");
        return;
      }

      setForm(emptyForm);
      setEditingId(null);

      await fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  }

  function startEditing(product: Product) {
    setEditingId(product._id);

    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      category: product.category,
      brand: product.brand,
      stock: String(product.stock),
      sku: product.sku,
      imageUrl: product.imageUrl || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelEditing() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function deleteProduct(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch("/api/products", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete product");
        return;
      }

      await fetchProducts();
    } catch (error) {
      console.error(error);
    }
  }

  const categories = [
    "All",
    ...Array.from(
      new Set(products.map((product) => product.category))
    ),
  ];

  const filteredProducts = products.filter((product) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      product.name.toLowerCase().includes(searchText) ||
      product.brand.toLowerCase().includes(searchText) ||
      product.category.toLowerCase().includes(searchText) ||
      product.sku.toLowerCase().includes(searchText);

    const matchesCategory =
      category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">

      {/* HEADER */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Catalog
              <span className="text-blue-600">Hub</span>
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              E-commerce product management
            </p>
          </div>

          <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            {products.length} Products
          </div>

        </div>
      </header>

      {/* MAIN */}
      <div className="mx-auto max-w-7xl px-6 py-8">

        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">

          {/* FORM */}
          <section className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-6">

              <div className="flex items-center justify-between">

                <h2 className="text-xl font-bold">
                  {editingId ? "Edit Product" : "Add Product"}
                </h2>

                {editingId && (
                  <button
                    onClick={cancelEditing}
                    className="text-sm font-medium text-slate-500 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                )}

              </div>

              <p className="mt-1 text-sm text-slate-500">
                {editingId
                  ? "Update product information."
                  : "Add a new item to your catalog."}
              </p>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* NAME */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Product Name
                </label>

                <input
                  type="text"
                  placeholder="e.g. Wireless Headphones"
                  value={form.name}
                  onChange={(e) =>
                    handleChange("name", e.target.value)
                  }
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Description
                </label>

                <textarea
                  placeholder="Describe your product..."
                  value={form.description}
                  onChange={(e) =>
                    handleChange(
                      "description",
                      e.target.value
                    )
                  }
                  required
                  rows={3}
                  className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* PRICE + STOCK */}
              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Price
                  </label>

                  <div className="relative">

                    <span className="absolute left-3 top-2.5 text-sm text-slate-500">
                      ₹
                    </span>

                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={form.price}
                      onChange={(e) =>
                        handleChange(
                          "price",
                          e.target.value
                        )
                      }
                      required
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 pl-7 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Stock
                  </label>

                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={form.stock}
                    onChange={(e) =>
                      handleChange(
                        "stock",
                        e.target.value
                      )
                    }
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

              </div>

              {/* CATEGORY + BRAND */}
              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Category
                  </label>

                  <input
                    type="text"
                    placeholder="Electronics"
                    value={form.category}
                    onChange={(e) =>
                      handleChange(
                        "category",
                        e.target.value
                      )
                    }
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Brand
                  </label>

                  <input
                    type="text"
                    placeholder="Sony"
                    value={form.brand}
                    onChange={(e) =>
                      handleChange(
                        "brand",
                        e.target.value
                      )
                    }
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

              </div>

              {/* SKU */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  SKU
                </label>

                <input
                  type="text"
                  placeholder="e.g. SONY-WH-001"
                  value={form.sku}
                  onChange={(e) =>
                    handleChange("sku", e.target.value)
                  }
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* IMAGE */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Product Image URL
                </label>

                <input
                  type="url"
                  placeholder="https://example.com/product.jpg"
                  value={form.imageUrl}
                  onChange={(e) =>
                    handleChange(
                      "imageUrl",
                      e.target.value
                    )
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                {editingId
                  ? "Update Product"
                  : "+ Add Product"}
              </button>

            </form>

          </section>

          {/* CATALOG */}
          <section>

            <div className="mb-6">

              <h2 className="text-2xl font-bold">
                Product Catalog
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage your available products
              </p>

            </div>

            {/* SEARCH + FILTER */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row">

              <div className="relative flex-1">

                <span className="absolute left-3 top-2.5 text-slate-400">
                  🔍
                </span>

                <input
                  type="text"
                  placeholder="Search products, brands, SKU..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

            </div>

            {/* PRODUCTS */}
            {loading ? (

              <div className="rounded-2xl border bg-white p-12 text-center">
                Loading products...
              </div>

            ) : filteredProducts.length === 0 ? (

              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

                <div className="text-4xl">
                  📦
                </div>

                <h3 className="mt-3 font-semibold">
                  No products found
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Try changing your search or filter.
                </p>

              </div>

            ) : (

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">

                {filteredProducts.map((product) => (

                  <article
                    key={product._id}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >

                    {/* IMAGE */}
                    <div className="relative h-48 overflow-hidden bg-slate-100">

                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.style.display =
                              "none";
                            e.currentTarget.nextElementSibling?.classList.remove(
                              "hidden"
                            );
                          }}
                        />
                      ) : null}

                      <div
                        className={`${
                          product.imageUrl
                            ? "hidden"
                            : ""
                        } flex h-full w-full items-center justify-center`}
                      >
                        <div className="text-center">

                          <div className="text-4xl">
                            📦
                          </div>

                          <p className="mt-2 text-xs text-slate-400">
                            No image
                          </p>

                        </div>
                      </div>

                      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold shadow">
                        {product.category}
                      </span>

                    </div>

                    {/* CONTENT */}
                    <div className="p-5">

                      <div className="flex justify-between gap-3">

                        <div className="min-w-0">

                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            {product.brand}
                          </p>

                          <h3 className="mt-1 truncate text-lg font-bold">
                            {product.name}
                          </h3>

                        </div>

                        <span className="whitespace-nowrap text-lg font-bold text-blue-600">
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>

                      </div>

                      <p className="mt-3 line-clamp-3 text-sm leading-5 text-slate-500">
                        {product.description}
                      </p>

                      <div className="mt-5 grid grid-cols-2 border-t border-slate-100 pt-4">

                        <div>
                          <p className="text-xs text-slate-400">
                            Stock
                          </p>

                          <p
                            className={`mt-1 text-sm font-semibold ${
                              product.stock > 0
                                ? "text-emerald-600"
                                : "text-red-600"
                            }`}
                          >
                            {product.stock > 0
                              ? `${product.stock} available`
                              : "Out of stock"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-400">
                            SKU
                          </p>

                          <p className="mt-1 truncate text-sm font-medium">
                            {product.sku}
                          </p>
                        </div>

                      </div>

                      {/* ACTIONS */}
                      <div className="mt-5 grid grid-cols-2 gap-2">

                        <button
                          onClick={() =>
                            startEditing(product)
                          }
                          className="rounded-lg bg-blue-50 px-3 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            deleteProduct(product._id)
                          }
                          className="rounded-lg bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </article>

                ))}

              </div>

            )}

          </section>

        </div>

      </div>

    </main>
  );
}