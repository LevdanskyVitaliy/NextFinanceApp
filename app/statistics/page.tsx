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
    <div className="h-screen w-screen flex flex-col p-0 overflow-hidden">
      {/* Remove pt-20/pt-25 - let it take full height */}
      <div className="flex-1 w-full h-full flex flex-col pt-20 pb-7">
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full w-full"
        >
          <ResizablePanel
            defaultSize={35}
            minSize={20}
            maxSize={50}
            className="h-full"
          >
            <div className="h-full w-full flex justify-center p-0 pl-5 bg-muted/50 overflow-hidden">
              <AmountsTable />
            </div>
          </ResizablePanel>

          <ResizableHandle
            withHandle
            className="bg-border hover:bg-primary/20 transition-colors w-1"
          />

          <ResizablePanel  
            defaultSize={65} 
            minSize={50} 
            maxSize={99}
            className="h-full"
          >
            <ResizablePanelGroup direction="vertical" className="h-full">
              <ResizablePanel defaultSize={55} minSize={0} maxSize={99} className="h-full">
                <div className="h-full w-full bg-card px-2 overflow-hidden">
                  <CircularDiagram />
                </div>
              </ResizablePanel>

              <ResizableHandle
                withHandle
                className="bg-border hover:bg-primary/20 transition-colors h-1"
              />

              <ResizablePanel defaultSize={45} minSize={0} maxSize={99} className="h-full">
                <div className="h-full w-full bg-card px-2 overflow-hidden">
                  <MonthlyDiagramCard />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
