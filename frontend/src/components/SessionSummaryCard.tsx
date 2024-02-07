import { Card, Image, Text, AspectRatio, Group } from "@mantine/core";
import { Link } from "@tanstack/react-router";

interface SessionSummaryCardProps {
  id: string;
  label: string;
  image_url: string;
  last_date_attempt: string;
}

export default function SessionSummaryCard({
  id,
  label,
  image_url,
  last_date_attempt,
}: SessionSummaryCardProps) {
  return (
    <Card
      p="xs"
      radius="md"
      component={Link}
      to={"/sessions/analysis/$sessionId"}
      params={{
        sessionId: id,
      }}
    >
      <AspectRatio ratio={1920 / 1080}>
        <Image src={image_url} />
      </AspectRatio>
      <Group position="apart">
        <Text c="dimmed" size="xs" tt="uppercase" fw={700} mt="md">
          {label}
        </Text>
        <Text c="dimmed" size="xs" tt="uppercase" fw={700} mt="md">
          {last_date_attempt}
        </Text>
      </Group>
    </Card>
  );
}
