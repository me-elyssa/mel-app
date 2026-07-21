"use client";

import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";
import TarefaCard from "./TarefaCard";
import type { Tarefa } from "@/types/entities";

const COLUNAS: { status: Tarefa["status"]; label: string }[] = [
  { status: "pendente", label: "Pendente" },
  { status: "em_progresso", label: "Em progresso" },
  { status: "concluido", label: "Concluído" },
];

interface KanbanBoardProps {
  tarefas: Tarefa[];
  onEditar: (tarefa: Tarefa) => void;
  onExcluir: (id: string) => void;
  onStatusChange: (id: string, status: Tarefa["status"]) => void;
}

export default function KanbanBoard({ tarefas, onEditar, onExcluir, onStatusChange }: KanbanBoardProps) {
  const handleDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination) return;
    const novoStatus = destination.droppableId as Tarefa["status"];
    onStatusChange(draggableId, novoStatus);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUNAS.map((coluna) => {
          const items = tarefas.filter((t) => t.status === coluna.status);
          return (
            <div key={coluna.status} className="bg-[#F8F9FB] rounded-[16px] p-3 flex flex-col gap-3 min-h-[200px]">
              <div className="flex items-center justify-between px-1">
                <h4 className="text-sm font-semibold text-[#545F6C]">{coluna.label}</h4>
                <span className="text-xs font-semibold text-[#9AA0A6] bg-white px-2 py-0.5 rounded-full">
                  {items.length}
                </span>
              </div>
              <Droppable droppableId={coluna.status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex flex-col gap-2 flex-1"
                  >
                    {items.map((tarefa, index) => (
                      <Draggable key={tarefa.id} draggableId={tarefa.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TarefaCard
                              tarefa={tarefa}
                              onEditar={() => onEditar(tarefa)}
                              onExcluir={() => onExcluir(tarefa.id)}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
