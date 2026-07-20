import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "./ui/spinner";

type DeleteActionProps = {
  entityName?: string;
  isPending: boolean;
  handleConfirm: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteAction({
  entityName = "item",
  isOpen,
  onOpenChange,
  handleConfirm,
  isPending,
}: DeleteActionProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader className="mb-4">
          <AlertDialogTitle>Delete {entityName}?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button
            disabled={isPending}
            onClick={handleConfirm}
            type="button"
            size="lg"
            variant="destructive"
          >
            {isPending && <Spinner className="mr-2" />}
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
