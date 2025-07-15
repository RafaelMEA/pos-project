import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { useAlert } from "@/contexts/AlertContext";

export const AlertMessage = () => {
  const { alerts, removeAlert } = useAlert();

  if (alerts.length === 0) return null;

  const getIcon = (type: "success" | "error" | "info") => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`relative w-80 rounded-lg p-4 pr-10 shadow-lg ${
            alert.type === "error"
              ? "bg-red-50 text-red-800"
              : "bg-green-50 text-green-800"
          }`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3 mt-0.5">
              {getIcon(alert.type)}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium">{alert.title}</h3>
              <p className="mt-1 text-sm opacity-90">{alert.message}</p>
            </div>
          </div>
          <button
            onClick={() => removeAlert(alert.id)}
            className="absolute right-2 top-2 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
