import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react";
import React from "react";

type ConfirmationDialogProps = {
    isOpen: boolean;
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
    onConfirm: () => void;
    title: string;
    description: string;
    isLoading?: boolean;
    confirmButtonText?: string;
    confirmButtonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    loadingText?: string;
}

const ConfirmationDialog = ({
    isLoading = false,
    onConfirm,
    isOpen,
    onOpenChange,
    title,
    description,
    confirmButtonText = "Confirm",
    confirmButtonVariant = "default",
    loadingText = "Processing..."
}: ConfirmationDialogProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant={confirmButtonVariant}
                        className={confirmButtonVariant === "destructive" ? "!text-white" : ""}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {loadingText}
                            </>
                        ) : (
                            confirmButtonText
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ConfirmationDialog;