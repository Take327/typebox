import { Flowbite, Progress } from "flowbite-react";
import customTheme from "./customTheme";

export default function FlowbitProgress({ progress }: { progress: number }) {
  return (
    <Flowbite theme={{ theme: customTheme }}>
      <Progress
        progress={progress}
        progressLabelPosition="inside"
        textLabelPosition="outside"
        size="lg"
        labelProgress
        color="81d8d0"
      />
    </Flowbite>
  );
}
