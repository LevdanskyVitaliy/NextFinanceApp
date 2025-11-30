"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Api, { Transaction, Category } from "@/app/services/logic";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item";
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

export default function EditForm() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const api = new Api();

  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!id) {
        setError("Transaction ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log("Fetching transaction with ID:", id);

        const [cats, transactionsResult] = await Promise.all([
          api.getAllCategories(),
          api.getTransactions({ page: 1, limit: 1000 }),
        ]);

        setCategories(cats);

        const tx = transactionsResult.data?.find(
          (t: Transaction) => String(t.id) === id
        );

        if (!tx) {
          setError(`Transaction with ID ${id} not found`);
          console.log("Available transactions:", transactionsResult.data);
        } else {
          const formattedTransaction = {
            ...tx,
            date: new Date(tx.date).toISOString().split("T")[0],
          };
          setFormData(formattedTransaction);
          console.log("Transaction found:", formattedTransaction);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load transaction data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    if (!formData) return;
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev!,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
  }

  function handleSelectChange(name: string, value: string) {
    if (!formData) return;
    setFormData((prev) => ({
      ...prev!,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData || !formData.id) return;

    setSaving(true);
    setError(null);
    try {
      await api.updateTransaction(formData.id, {
        amount: formData.amount,
        category: formData.category,
        description: formData.description,
        type: formData.type,
        date: new Date(formData.date).toISOString(),
      });
      router.push("/");
    } catch (err) {
      console.error("Error updating transaction:", err);
      setError("Failed to save transaction");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl p-6 border border-gray-300 dark:border-gray-600 dark:text-white bg-[#f5f6fb] dark:bg-[#0c1017] rounded-lg shadow-md shadow-gray-500 dark:shadow-gray-800 mx-auto mt-8">
        <div className="flex justify-center items-center py-8">
          Loading transaction data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl p-6 border border-gray-300 dark:border-gray-600 dark:text-white bg-[#f5f6fb] dark:bg-[#0c1017] rounded-lg shadow-md shadow-gray-500 dark:shadow-gray-800 mx-auto mt-8">
        <div className="text-red-600 p-4 text-center">{error}</div>
        <div className="flex justify-center mt-4">
          <Button
            onClick={() => router.back()}
            className="px-4 py-2 rounded-lg border border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="max-w-4xl p-6 border border-gray-300 dark:border-gray-600 dark:text-white bg-[#f5f6fb] dark:bg-[#0c1017] rounded-lg shadow-md shadow-gray-500 dark:shadow-gray-800 mx-auto mt-8">
        <div className="text-red-600 p-4 text-center">
          Transaction not found
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl p-6 border border-gray-300 dark:border-gray-600  dark:text-white bg-[#f5f6fb] dark:bg-[#0c1017] rounded-lg shadow-md shadow-gray-500 dark:shadow-gray-800">
      <Item variant="muted">
        <ItemContent>
          <ItemTitle className="border-b-2 text-xl font-bold pb-2">
            Edit Transaction ID: {formData.id}
          </ItemTitle>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Separator className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <Label
                    htmlFor="type"
                    className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize border-b-2 block pb-1"
                  >
                    Type
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleSelectChange("type", value)}
                  >
                    <SelectTrigger className="mt-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-900 dark:text-gray-200 rounded-lg p-2 w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-600">
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label
                    htmlFor="amount"
                    className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize border-b-2 block pb-1"
                  >
                    Amount
                  </Label>
                  <Input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    min={0}
                    step="0.01"
                    className="mt-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-900 dark:text-gray-200 rounded-lg p-2 w-full"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="category"
                    className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize border-b-2 block pb-1"
                  >
                    Category
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleSelectChange("category", value)
                    }
                  >
                    <SelectTrigger className="mt-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-900 dark:text-gray-200 rounded-lg p-2 w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-600">
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label
                    htmlFor="date"
                    className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize border-b-2 block pb-1"
                  >
                    Date
                  </Label>
                  <Input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="mt-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-900 dark:text-gray-200 rounded-lg p-2 w-full"
                    required
                  />
                </div>

                <div className="md:col-span-1">
                  <Label
                    htmlFor="description"
                    className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize border-b-2 block pb-1"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-900 dark:text-gray-200 rounded-lg p-2 resize-none w-full"
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="text-red-600 bg-red-100 dark:bg-red-900 p-3 rounded-lg border border-red-300 dark:border-red-700">
                {error}
              </div>
            )}

            <Separator className="my-4" />

            <ItemActions className="space-x-2">
              <Button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 rounded-lg border border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="px-6 py-2 rounded-lg border border-gray-400 dark:bg-blue-900 bg-blue-300 hover:bg-blue-400 dark:hover:bg-gray-500 disabled:opacity-70"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </ItemActions>
          </form>
        </ItemContent>
      </Item>
    </div>
  );
}
