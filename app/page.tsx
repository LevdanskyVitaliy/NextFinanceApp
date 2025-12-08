"use client";
import Header from "./components/Header";
import TableTransactions from "./components/TableTransactions";
import CreateTransaction from "./components/CreateTransaction";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";



export default function Home() {
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowCreate(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen ">
      <Header />

<main className="flex pt-16 mx-auto ">

<div className="lg:hidden fixed top-27 left-0 z-100">
  <Button
    className="dark:bg-gray-600 bg-gray-300 p-2 opacity-35 dark:border-gray-300 border rounded shadow-md"
    onClick={() => setShowCreate((v) => !v)}
    aria-label={
      showCreate ? "Hide Create Transaction" : "Show Create Transaction"
    }
  >
    {showCreate ? "<" : ">"}
  </Button>
</div>


        <div
          className={`
    fixed lg:hidden shrink-0 w-72 mt-4 shadow-md top-16 left-0 h-[calc(100vh-10rem)] z-50
    transition-transform duration-300 ease-in-out
    ${showCreate ? "translate-x-0" : "-translate-x-full"}
  `}
        >
          <CreateTransaction />
        </div>

        <div
          className={`
            hidden lg:flex shrink-0 w-50:ml-4 mt-4 shadow-md
            fixed top-16 left-5  z-30
          `}
        >
          <CreateTransaction />
        </div>

        {showCreate && (
          <div
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setShowCreate(false)}
            aria-hidden="true"
          />
        )}

        <div className="flex-1 flex items-center justify-center ml-0 lg:ml-70 mt-4">
          <div className="space-y-4">
            <TableTransactions />
          </div>
        </div>
      </main>
    </div>
  );
}
