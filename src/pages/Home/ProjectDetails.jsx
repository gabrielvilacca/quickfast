import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import { useFirestore } from "@/hooks/useFirestore";
import { Button } from "@/shadcn/components/ui/button";
import { Separator } from "@/shadcn/components/ui/separator";
import { Input } from "@/shadcn/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shadcn/components/ui/tabs";
import Overview from "@/components/Overview";
import ExpenseList from "@/components/Expenses/ExpenseList";
import NewExpenseDialog from "../Expenses/NewExpenseDialog";
import Chart from "@/components/Charts/Chart";
import { useAuthContext } from "@/hooks/useAuthContext";
import { MessageCircle, X } from "lucide-react";

const ProjectDetails = () => {
  const { id } = useParams();
  const { document: project } = useFirestore("projects", id);
  const { user } = useAuthContext();
  const { addSubDocument, getSubDocuments } = useFirestore("projects");
  const [chartData, setChartData] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [open, setOpen] = useState(false);
  const [showComments, setShowComments] = useState(false); // Controle de visibilidade dos comentários
  const captureRef = useRef(null);

  useEffect(() => {
    const fetchComments = async () => {
      const commentsData = await getSubDocuments(id, "comments");
      setComments(commentsData);
    };
    fetchComments();
  }, [id, getSubDocuments]);

  const handleAddComment = async () => {
    if (newComment.trim()) {
      const commentData = {
        author: user.displayName || "Anônimo",
        comment: newComment,
        createdAt: new Date(),
      };
      await addSubDocument(id, "comments", commentData);
      setNewComment("");
      const updatedComments = await getSubDocuments(id, "comments");
      setComments(updatedComments);
    }
  };

  const handleShare = async () => {
    if (captureRef.current) {
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: "#fff",
        useCORS: true,
        scale: window.devicePixelRatio,
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
    <div className="p-5 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Detalhes do Projeto</h1>
        <div>
          <Button onClick={handleShare} className="ml-4">
            Compartilhar
          </Button>
          {user && user.role !== "client" && (
            <NewExpenseDialog open={open} setOpen={setOpen} projectId={id}>
              <Button onClick={() => setOpen(true)} className="ml-4">
                Nova Despesa
              </Button>
            </NewExpenseDialog>
          )}
        </div>
      </div>

      <Separator />

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3">
          <Tabs defaultValue="overview" className="w-full">
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

        <div className="relative w-full md:w-1/3">
          <Button
            onClick={() => setShowComments(!showComments)}
            className="absolute top-0 right-0 mb-4 h-14 w-14 rounded-full flex items-center justify-center"
          >
            {showComments ? (
              <X className="h-8 w-8" />
            ) : (
              <MessageCircle className="h-8 w-8" />
            )}
          </Button>

          {showComments && (
            <div className="absolute top-14 right-0 w-full bg-slate-200 p-4 rounded-lg shadow-lg z-10">
              <h2 className="text-lg font-bold">Observações</h2>
              <div className="space-y-4 ">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="border rounded-md p-2 bg-white"
                  >
                    <p className="font-semibold">{comment.author}</p>
                    <p>{comment.comment}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(
                        comment.createdAt.seconds * 1000
                      ).toLocaleString()}
                    </p>
                  </div>
                ))}
                <div className="flex items-center space-x-2 mt-4">
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Adicione um comentário"
                    className="w-full bg-white bg-opacity-100"
                  />
                  <Button onClick={handleAddComment}>Comentar</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
