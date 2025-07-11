import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";

const LoadingAnimation = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
    <Button size="sm" disabled>
      <Loader2Icon className="animate-spin"/>
      Please wait
    </Button>
    </div>
  );
};

export default LoadingAnimation;
