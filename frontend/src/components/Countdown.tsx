import { Box, Center, Text } from "@mantine/core";
import React, { useState, useEffect } from "react";

export type Timer = {
  minutes: number;
  seconds: number;
};

export interface CountdownTimerProps {
  minutes: number;
  pauseTimer: boolean;
  onTimeUp: () => void;
}

const CountdownTimer = ({
  minutes,
  pauseTimer,
  onTimeUp,
}: CountdownTimerProps) => {
  const refTime = new Date().getTime() + minutes * 60000;
  const [timeLeft, setTimeLeft] = useState<Timer>(calculateTimeLeft(refTime));

  function calculateTimeLeft(endTime: number) {
    const difference = endTime - new Date().getTime();
    let timeLeft = {} as Timer;

    if (difference > 0) {
      timeLeft = {
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (!pauseTimer) {
        const timeLeftTemp = calculateTimeLeft(refTime);
        setTimeLeft(timeLeftTemp);
        if (timeLeftTemp.minutes === 0 && timeLeftTemp.seconds === 0) {
          onTimeUp();
          clearInterval(interval);
        }
      }
    }, 1000);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  return (
    <Box>
      <Text size={"lg"} fw={"bold"}>
        Time Left
      </Text>
      <Center>
        <Text
          size={"xl"}
          fw={"bold"}
          color={timeLeft.minutes <= 1 ? "red" : ""}
        >
          {timeLeft.minutes < 10
            ? "0" + timeLeft.minutes
            : timeLeft.minutes || "00"}
          :
          {timeLeft.seconds < 10
            ? "0" + timeLeft.seconds
            : timeLeft.seconds || "00"}
        </Text>
      </Center>
    </Box>
  );
};

export default CountdownTimer;
