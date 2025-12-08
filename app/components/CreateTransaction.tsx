

"use client";

import { useEffect, useState } from "react";
import Api from "../services/logic";
import { Transaction } from "../services/logic";
import { useTransactions } from "../contexts/TransactionContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const api = new Api();

export default function CreateTransaction() {
  const { categories, addTransaction, refreshData } = useTransactions();
  const [formData, setFormData] = useState<Transaction>({
    amount: 0,
    category: "",
    description: "",
    type: "expense",
    date: new Date().toISOString().split("T")[0],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (categories.length > 0 && !formData.category) {
      setFormData((prev) => ({ ...prev, category: String(categories[0].id) }));
    }
  }, [categories, formData.category]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Prevent submission if amount is 0
    if (formData.amount === 0) {
      setMessage({
        type: "error",
        text: "Please enter a valid amount greater than 0",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const result = await api.createTransaction({
        amount: formData.amount,
        category: formData.category,
        description: formData.description,
        type: formData.type,
        date: new Date(formData.date).toISOString(),
      });

      setMessage({
        type: "success",
        text: `Operation created successfully!`,
      });

      if (result) {
        addTransaction(result);
      }

      await refreshData();

      // Reset form but keep first category selected
      setFormData({
        amount: 0,
        category: categories.length > 0 ? String(categories[0].id) : "",
        description: "",
        type: "expense",
        date: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Failed to create operation",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <Card className="max-w-lg sm:max-w-xs mx-auto p-2 z-10 sm:p-4 bg-[#f5f6fb] dark:bg-[#0c1017] rounded-lg shadow-md shadow-gray-500 dark:shadow-gray-800 border-gray-300 dark:border-gray-600">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">
          Create New Operation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="md:space-y-4 space-y-3 p-1">
          <div>
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  type: value as "expense" | "income",
                }))
              }
            >
              <SelectTrigger
                id="type"
                name="type"
                className="bg-white border border-gray-300 dark:bg-gray-600 transition-colors w-full"
              >
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-200 dark:bg-gray-600">
                <SelectItem
                  value="expense"
                  className="bg-white dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-900"
                >
                  Expense
                </SelectItem>
                <SelectItem
                  value="income"
                  className="bg-white dark:bg-gray-600 dark:hover:bg-gray-900"
                >
                  Income
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              className="bg-white border border-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-900"
              type="number"
              id="amount"
              name="amount"
              min={0.01}
              step="0.01"
              value={formData.amount || ""}
              onChange={handleChange}
              required
              placeholder="0.00"
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger
                id="category"
                name="category"
                className="bg-white border border-gray-300 dark:bg-gray-600 transition-colors w-full"
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-gray-200 dark:bg-gray-600">
                {categories.map((cat) => (
                  <SelectItem
                    className="bg-white hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-900"
                    key={cat.id}
                    value={String(cat.id)}
                  >
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              className="bg-white dark:bg-gray-600 border-gray-300 max-w-48 resize-none overflow-hidden"
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              className="bg-white hover:bg-gray-300 dark:bg-gray-600 border border-gray-300"
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          {message && (
            <div
              className={`rounded-md p-3 ${
                message.type === "success"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || formData.amount === 0}
            className="w-full dark:bg-blue-500 bg-blue-400 hover:bg-blue-300 rounded-xl p-2 dark:hover:bg-blue-400"
          >
            {loading ? "Creating..." : "Create Operation"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
