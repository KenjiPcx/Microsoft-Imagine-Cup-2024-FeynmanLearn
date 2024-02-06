import { ActionIcon, createStyles, keyframes, Image, rem } from "@mantine/core";
import { IconHome } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

const breathe = keyframes`
  0% { transform: translate(0); filter: brightness(1); }
  50% { transform: translate(0, -6px); filter: brightness(1.2); }
  100% { transform: translate(0); filter: brightness(1); }
`;

const useStyles = createStyles((theme) => ({
  iconButton: {
    width: rem(80),
    height: rem(80),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    animation: `${breathe} 6s ease-in-out infinite`,
    '&:hover': {
      // Define styles for hover state
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2],
    },
    '&:hover $hoverText': {
      // Show text on hover
      display: 'block',
    },
  },
  iconHome: {
    position: 'absolute',
    width: '50%', // Adjust size of IconHome as needed
    height: '50%', // Adjust size of IconHome as needed
    zIndex: 2, // Ensure the icon is above the text
  },
  hoverText: {
    display: 'none', // Hide text by default
    position: 'absolute',
    bottom: '-20px', // Adjust position as needed
    whiteSpace: 'nowrap',
    color: theme.colors.gray[9], // Adjust text color as needed
    fontSize: theme.fontSizes.sm,
    zIndex: 1, // Ensure the text does not overlap the icon in an unwanted way
  },
}));

export const NavButton = () => {
  const { classes } = useStyles();

  return (
    <Link to="/" style={{ textDecoration: 'none', position: 'relative' }}> {/* Use Link component for navigation */}
      <ActionIcon
        variant="filled"
        radius={100}
        size={rem(80)}
        className={classes.iconButton}
      >
        <Image src="/home_button.svg" style={{ position: 'absolute', width: '100%', height: '100%' }} />
        <IconHome size={32} className={classes.iconHome} />
        <span className={classes.hoverText}>Home</span> {/* Text to display on hover */}
      </ActionIcon>
    </Link>
  );
};

export default NavButton;