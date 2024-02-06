import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Container, Text, Button, Group, createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  inner: {
    position: "relative",
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      paddingBottom: 80,
      paddingTop: 80,
    },
  },
  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: 62,
    fontWeight: 900,
    lineHeight: 1.1,
    margin: 0,
    padding: 0,
    color:
      theme.colorScheme === "dark" ? theme.colors.white : theme.colors.black,
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      fontSize: 42,
      lineHeight: 1.2,
    },
  },
  description: {
    marginTop: theme.spacing.xl,
    fontSize: 24,
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      fontSize: 18,
    },
  },
  wordContainer: {
    position: "relative",
    height: 80, // Ensure this is enough height to accommodate your largest word
    display: "flex",
    alignItems: "center", // Center the words vertically
    justifyContent: "center", // Center the words horizontally
  },
  word: {
    position: "absolute",
    opacity: 0,
    transition: "opacity 1s ease-in-out",
  },
  visibleWord: {
    opacity: 1,
  },
}));

export function HeroTitle() {
  const { classes } = useStyles();
  const words = ["Learn", "Talk", "Explore", "Think", "Discover"];
  const [currentWord, setCurrentWord] = useState(words[0]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentWord(words[(words.indexOf(currentWord) + 1) % words.length]);
        setIsTransitioning(false);
      }, 700); // Half the interval time to change the word after fade out
    }, 4000); // Interval for the whole cycle (fade out + change word + fade in)

    return () => clearInterval(intervalId); // Clean up on unmount
  }, [currentWord, words]);

  return (
    <Container size={700} className={classes.inner}>
      <h1 className={classes.title}>
        <span className={classes.wordContainer}>
          {words.map((word) => (
            <Text
              key={word}
              component="span"
              variant="gradient"
              gradient={{ from: "blue", to: "#40A2E3" }}
              inherit
              className={`${classes.word} ${word === currentWord && !isTransitioning ? classes.visibleWord : ""}`}
            >
              {word}
            </Text>
          ))}
        </span>{" "}
        with Feynman
      </h1>
    </Container>
  );
}
