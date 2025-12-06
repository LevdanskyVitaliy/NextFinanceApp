"use client";
import AmountsTable from "../components/Amounts";
import CircularDiagram from "../components/Diagram";
import { useTransactions } from "../contexts/TransactionContext";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function ResizableDemo() {
  const { transactions } = useTransactions();

  return (
    <div className="min-h-screen w-screen bg-background mt-10">
      <ResizablePanelGroup
        direction="horizontal"
        className="w-full h-full pt-20 md:pt-10"
      >
        <ResizablePanel
          defaultSize={35}
          minSize={30}
          maxSize={40}
          className="min-w-[150px]"
        >
          <div className="flex h-full w-full items-center justify-center p-4 bg-muted/50">
            <AmountsTable />
          </div>
        </ResizablePanel>

        <ResizableHandle
          withHandle
          className="bg-border hover:bg-primary/20 transition-colors"
        />

        <ResizablePanel defaultSize={70} minSize={55} maxSize={75}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={70} minSize={60} maxSize={80}>
              <div className="flex h-full w-full bg-card p-4">
                <CircularDiagram />
              </div>
            </ResizablePanel>

            <ResizableHandle
              withHandle
              className="bg-border hover:bg-primary/20 transition-colors"
            />

            <ResizablePanel defaultSize={20} minSize={15} maxSize={40}>
              <div className="flex h-full items-center justify-center p-4 bg-muted/30">
                <div className="text-center">
                  <span className="font-semibold text-lg">
                    Transactions Summary
                  </span>
                  <div className="mt-2 space-y-1 text-sm sm:items-center">
                  
                    <p className="text-muted-foreground">
                      Total: <strong>{transactions.length}</strong> transactions
                    </p>
                    <div className="mt-2 space-y-1 text-sm flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                    <p className="text-muted-foreground">
                      Income:{" "}
                      <strong className="text-green-600">
                        {transactions.filter((t) => t.type === "income").length}
                      </strong>
                    </p>
                    <p className="text-muted-foreground">
                      Expenses:{" "}
                      <strong className="text-red-600">
                        {
                          transactions.filter(
                            (t) => t.type === "expense" || t.type === "expence"
                          ).length
                        }
                      </strong>
                    </p>
                    </div>
                  </div>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
