import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangleIcon, Info, CheckCheck, SquareX } from "lucide-react";

type AppAlertProps = {
  type?: "info" | "warning" | "error" | "success";
  title: string;
  description?: string;
};

const alertStyles = {
  info: "border-primary bg-primary/10 text-sm text-primary dark:border-blue-900 dark:bg-blue-950 dark:text-blue-50",
  warning:
    "border-yellow-200 bg-yellow-50 text-sm text-yellow-900 dark:border-yellow-900 dark:bg-yellow-950 dark:text-yellow-50",
  error:
    "border-red-200 bg-red-50 text-sm text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-50",
  success:
    "border-green-200 bg-green-50 text-sm text-green-900 dark:border-green-900 dark:bg-green-950 dark:text-green-50",
};

const icons = {
  info: <Info size={16} color="blue" />,
  warning: <AlertTriangleIcon size={16} />,
  error: <SquareX size={16} color="red" />,
  success: <CheckCheck size={16} color="green" />,
};

export default function AppAlert({
  type = "info",
  title,
  description,
}: AppAlertProps) {
  return (
    <Alert className={alertStyles[type]}>
      {icons[type]}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {description ||
          "This is an important notice. Please read it carefully."}
      </AlertDescription>
    </Alert>
  );
}
