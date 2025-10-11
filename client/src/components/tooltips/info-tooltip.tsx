import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { IoIosInformationCircleOutline } from "react-icons/io";

interface tooltipProps {
    text: string
}

export function InfoTooltip({ text }: tooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
            <div>
                <IoIosInformationCircleOutline className="h-4 w-4 mx-5 cursor-help"/> 
            </div>
            {/* <IoIosInformationCircleOutline className="h-4 w-4 mx-5"/> */}
        {/* <Button variant="outline">Hover</Button> */}
        </TooltipTrigger>
        <TooltipContent side="top" align="start" sideOffset={4} className="max-w-xs">
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
