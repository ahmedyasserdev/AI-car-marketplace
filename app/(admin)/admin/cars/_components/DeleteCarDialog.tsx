import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { SerializedCarType } from "@/types";
import { Loader2 } from "lucide-react";
import React from "react";

type DeleteCarDialogProps = {
    deleteDialogOpen : boolean
    setDeleteDialogOpen :  React.Dispatch<React.SetStateAction<boolean>>;
    handleDeleteCar  : () => void;
    carToDelete  : SerializedCarType | null ;
    deleteCarActionLoading : boolean | null
}

const DeleteCarDialog = ({deleteCarActionLoading,carToDelete ,handleDeleteCar , deleteDialogOpen , setDeleteDialogOpen}: DeleteCarDialogProps) => {
  return (
    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete {carToDelete?.make}{" "}
          {carToDelete?.model} ({carToDelete?.year})? This action cannot be
          undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => setDeleteDialogOpen(false)}
          disabled={deleteCarActionLoading as boolean}
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={handleDeleteCar}
          disabled={deleteCarActionLoading}
        >
          {deleteCarActionLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deleting...
            </>
          ) : (
            "Delete Car"
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  )
}

export default DeleteCarDialog