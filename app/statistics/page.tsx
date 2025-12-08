"use client";
import AmountsTable from "../components/Amounts";
import CircularDiagram from "../components/Diagram";
import MonthlyDiagramCard from "../components/MonthlyGraphs";


import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function ResizableDemo() {
 

  return (
    <div className="w-full h-full p-0">
      <ResizablePanelGroup
        direction="horizontal"
        className="w-full h-full md:pt-20 pt-25 "
      >
        <ResizablePanel
          defaultSize={35}
          minSize={0}
          maxSize={50}
          className=""
        >
          <div className="flex h-full w-full items-center justify-center p-0  pl-5 bg-muted/50">
            <AmountsTable />
          </div>
        </ResizablePanel>

        <ResizableHandle
          withHandle
          className="bg-border hover:bg-primary/20 transition-colors"
        />

        <ResizablePanel  
        defaultSize={65} minSize={50} maxSize={99}  >
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel  defaultSize={55} minSize={0} maxSize={100}>
              <div className="flex h-full w-full bg-card px-2 ">
                <CircularDiagram />
              </div>
            </ResizablePanel>

            <ResizableHandle
              withHandle
              className="bg-border hover:bg-primary/20 transition-colors"
            />

            <ResizablePanel defaultSize={45} minSize={0} maxSize={100} >
              {/* <div className="flex h-full items-center justify-center p-4 bg-muted/30">
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
              </div> */}
              <div className="flex h-full w-full bg-card px-2 ">
               <MonthlyDiagramCard />
               </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
