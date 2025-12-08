// app/transactions/[id]/page.tsx
import { notFound } from "next/navigation";
import Api from "../../../services/logic";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Head from 'next/head';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";

export default async function TransactionPage({
  params,
}: {
  params: Promise<{ id: string | number}>; 
}) {
  const { id } = await params;
  const api = new Api();
  const categories = await api.getAllCategories();

  // const result = await api.getTransactions({page: 1, limit: 1000}); 
  const transaction = await api.getTransactionById(id)
  // const transaction = result.data?.find((tx: any) => String(tx.id) === id);

  if (!transaction) {
    return notFound();
  }

  function getCategoryName(id: string | number): string {
    if (!categories.length) {
      return "Unknown";
    }

    let category = categories.find((cat) => cat.id == id);

    if (!category) {
      category = categories.find((cat) => String(cat.id) === String(id));
    }

    if (!category) {
      const numId = Number(id);
      if (!isNaN(numId)) {
        category = categories.find((cat) => Number(cat.id) === numId);
      }
    }

    if (!category) {
      console.warn(
        `Category not found for id: ${id}. Available:`,
        categories.map((c) => c.id)
      );
      return "Unknown";
    }

    return category.name;
  }

  const displayTransaction = {
    ...transaction,
    category: getCategoryName(transaction.category),
  };

  return (
    <div className="max-w-xl p-6 border border-gray-300 dark:border-gray-600  dark:text-white bg-[#f5f6fb] dark:bg-[#0c1017] rounded-lg shadow-md shadow-gray-500 dark:shadow-gray-800">
       <Head>
        <title>Transaction Profile | NextFinanceApp</title>
        <meta name="description" content="Detailed user profile and financial overview." />
      </Head>
      <Item variant="muted">
        <ItemContent>
          <ItemTitle className="border-b-2 ">
            Transaction ID: {transaction.id}
          </ItemTitle>
          <ItemDescription>
            Date: {new Date(transaction.date).toLocaleDateString("ru-RU")}
          </ItemDescription>
          <Separator className="my-4" />

 
<dl className="grid grid-cols-2 gap-x-6 gap-y-3">
  {Object.entries(displayTransaction).map(([key, value]) => {
    let displayValue: string;

    if (key === "date") {
      // Format the date string
      displayValue = new Date(value as string).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } else {
      // Default string conversion
      displayValue = String(value);
    }

    return (
      <div key={key}>
        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize border-b-2">
          {key.replace(/_/g, " ")}
        </dt>
        <dd className="mt-1 text-sm text-gray-900 dark:text-gray-200 dark:bg-gray-600 bg-gray-100 rounded-lg p-2">
          {displayValue}
        </dd>
      </div>
    );
  })}
</dl>


          <Separator className="my-4" />

          <ItemActions>
            <Button asChild>
              <a
                href={`/users/${transaction.id}/edit`}
                className=" px-4 py-2 rounded-lg border border-gray-400 dark:bg-blue-900 bg-blue-300 hover:bg-blue-400 dark:hover:bg-gray-500"
              >
                Edit
              </a>
            </Button>
            <Button asChild>
              <a
                href="/"
                className=" px-4 py-2 rounded-lg border border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Back to Transactions
              </a>
            </Button>
          </ItemActions>
        </ItemContent>
      </Item>
    </div>
  );
}


