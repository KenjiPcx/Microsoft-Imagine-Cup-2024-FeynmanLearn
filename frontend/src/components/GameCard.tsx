import { Card, Image, Text, AspectRatio } from "@mantine/core";

interface GameCardProps {
  label: string;
  image: string;
  selected: boolean;
  onChoose: () => void;
}

export default function GameCard({ label, image, selected, onChoose }: GameCardProps) {
  return (
    <Card
      p="md"
      radius="md"
      onClick={onChoose}
      style={{ outline: selected ? "3px solid white" : "" }}
    >
      <AspectRatio ratio={1920 / 1080}>
        <Image src={image} />
      </AspectRatio>
      <Text c="dimmed" size="xs" tt="uppercase" fw={700} mt="md">
        {label}
      </Text>
    </Card>
  );
}
