// components/ExportSheets.jsx
import { Button } from "@/shadcn/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shadcn/components/ui/dialog";
import { Input } from "@/shadcn/components/ui/input";
import { Label } from "@/shadcn/components/ui/label";

export default function ExportSheets({ open, setOpen }) {
  const handleClickExport = (e) => {
    window.location.href =
      "https://wa.me/+5537999286153/?text=Quero importar uma planilha para o despesa simples";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Exportar Planilhas</DialogTitle>
          <DialogDescription className="text-lg">
            Para exportar uma planilha que você já usa, seja de google ou excel.
            Basta clicar no botão de exportar que você entrará em contato com o
            nosso suporte que fará o trabalho de pegar a sua planilha e
            implementar no despesa simples.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleClickExport}>Exportar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
