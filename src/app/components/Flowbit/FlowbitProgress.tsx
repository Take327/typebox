import { Progress } from "flowbite-react";

export default function FlowbitProgress({ progress }: { progress: number }) {
  return (
    <Progress
      progress={progress}
      progressLabelPosition="inside"
      textLabelPosition="outside"
      size="lg"
      labelProgress
      color="accent"
    />
  );
}
