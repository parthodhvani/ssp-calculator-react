import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface NoReportDialogProps {
    open: boolean;
    onClose: () => void;
    onGoToCalculator: () => void;
}

export function NoReportDialog({ open, onClose, onGoToCalculator }: NoReportDialogProps) {
    return (

        <Dialog open={open} onOpenChange={(open) => !open && onClose()}> <DialogContent className="sm:max-w-md"> <DialogHeader> <DialogTitle className="font-serif text-xl">Complete your entitlement test</DialogTitle> <DialogDescription className="text-sm text-muted-foreground pt-2"> Please complete <span className="font-medium text-foreground">"Your Entitlement Test"</span> before generating a personalised report. </DialogDescription> </DialogHeader> <DialogFooter className="flex flex-row justify-end gap-2 sm:gap-2"> <Button variant="outline" onClick={onClose}> Cancel </Button> <Button onClick={onGoToCalculator}> Go to Calculator </Button> </DialogFooter> </DialogContent> </Dialog>);
}