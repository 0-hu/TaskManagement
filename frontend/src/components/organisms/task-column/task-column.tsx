import { Box } from "@/components/atoms/box/box";
import { Text } from "@/components/atoms/text/text";
import { TaskCard } from "@/components/molecules/task-card/task-card";
import type { Task } from "@/types/task";
import { Button } from "@/components/atoms/button/button";

type TaskColumnProps = {
  title: string;
  count: number;
  tasks: Task[];
};

export function TaskColumn({ title, count, tasks }: TaskColumnProps) {
  return (
    <Box className="flex flex-1 flex-col gap-3">
      <Box className="flex items-center gap-2">
        <Text weight="semibold">{title}</Text>
        <Text size="sm" color="subtle">
          {count}
        </Text>
      </Box>
      <Box className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </Box>
      <Button variant="ghost" className="self-center text-neutral-700">
        더 보기
      </Button>
    </Box>
  );
}
