import { toast } from "sonner";

const DIRECTION = "top-center";

const DURATION = 3000;

export const notify = {
  success: (message: string) =>
    toast.success(message, { duration: DURATION, position: DIRECTION }),
  error: (message: string) =>
    toast.error(message, { duration: DURATION, position: DIRECTION }),
  info: (message: string) =>
    toast.info(message, { duration: DURATION, position: DIRECTION }),
  warning: (message: string) =>
    toast.warning(message, { duration: DURATION, position: DIRECTION }),
};
