import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import { useFirestore } from "@/hooks/useFirestore";
import { Button } from "@/shadcn/components/ui/button";
import { Separator } from "@/shadcn/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shadcn/components/ui/tabs";
import Overview from "@/components/Overview";
import ExpenseList from "@/components/Expenses/ExpenseList"; // Certifique-se de que o caminho está correto
import NewExpenseDialog from "../Expenses/NewExpenseDialog";
import Chart from "@/components/Charts/Chart";

const ProjectDetails = () => {
  const { id } = useParams(); // Obter o ID da URL
  const { document: project } = useFirestore("projects", id); // Carregar o projeto pelo ID
  const [chartData, setChartData] = useState({});
  const [open, setOpen] = useState(false);
  const captureRef = useRef(null);

  useEffect(() => {
    if (project) {
      const fetchExpenses = async () => {
        const expenses = await fetch(`/api/expenses?projectId=${id}`).then(
          (res) => res.json()
        );
        const data = {
          labels: expenses.map((exp) => exp.date),
          datasets: [
            {
              label: "Expenses",
              data: expenses.map((exp) => exp.amount),
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
          ],
        };
        setChartData(data);
      };
      fetchExpenses();
    }
  }, [project, id]);

  const handleShare = async () => {
    if (captureRef.current) {
      // Configurações adicionais para html2canvas
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: "#fff", // Definindo fundo branco
        useCORS: true, // Para resolver problemas de recursos externos
        scale: window.devicePixelRatio, // Melhorar a resolução da imagem
        logging: true,
        letterRendering: 1,
        allowTaint: false,
      });

      const imgData = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = imgData;
      link.download = `project-${id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Compartilhar através da Web Share API se suportado
      if (navigator.share) {
        const blob = await (await fetch(imgData)).blob();
        const filesArray = [
          new File([blob], `project-${id}.png`, { type: "image/png" }),
        ];
        navigator
          .share({
            title: `Project ${id}`,
            text: "Confira os detalhes do projeto",
            files: filesArray,
          })
          .catch((error) => console.error("Error sharing", error));
      } else {
        console.log("Web Share API não suportada no navegador.");
      }
    }
  };

  return (
    <div>
      <div className="flex m-5 justify-between">
        <h1 className="text-3xl font-bold">Despesas</h1>
        <NewExpenseDialog open={open} setOpen={setOpen} projectId={id}>
          <Button onClick={() => setOpen(true)}>Nova Despesa</Button>
        </NewExpenseDialog>
      </div>
      <Separator />
      <div
        ref={captureRef}
        className="m-5 flex md:flex-row flex-col justify-between bg-white"
      >
        {" "}
        {/* Define um fundo branco */}
        <div>
          <Tabs defaultValue="account" className="w-[400px]">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="graphics">Gráficos</TabsTrigger>
              <TabsTrigger value="expenses">Despesas</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <Overview projectId={id} />
            </TabsContent>
            <TabsContent value="graphics">
              <Chart projectId={id} />
            </TabsContent>
            <TabsContent value="expenses">
              <ExpenseList projectId={id} />
            </TabsContent>
          </Tabs>
        </div>
        <div className="flex gap-5 mt-5 md:mt-0">
          <Button onClick={handleShare} className="w-[1000px] md:w-28">
            Compartilhar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
