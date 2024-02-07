import { ActionIcon, createStyles, keyframes, Image, rem, Tooltip } from "@mantine/core";
import { IconHome, IconNewSection, IconPhoto } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "../utils/auth";

const breathe = keyframes`
  0% { transform: translate(0); filter: brightness(1); }
  50% { transform: translate(0, -6px); filter: brightness(1.2); }
  100% { transform: translate(0); filter: brightness(1); }
`;

const useStyles = createStyles((theme) => ({
  iconButton: {
    width: rem(60),
    height: rem(60),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    animation: `${breathe} 6s ease-in-out infinite`,
  },
  icon: {
    position: 'absolute',
    width: '50%',
    height: '50%',
  },
}));

export const NavButton = () => {
  const { classes } = useStyles();
  const auth = useAuth();

  return (
    <div>
      <Tooltip label="Home" position="right" withArrow>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <ActionIcon
            variant="filled"
            radius={100}
            size={rem(80)}
            className={classes.iconButton}
          >
            <Image src="/home_button.svg" style={{ position: 'absolute', width: '100%', height: '100%' }} />
            <IconHome size={32} className={classes.icon} />
          </ActionIcon>
        </Link>
      </Tooltip>
      {auth.isAuthenticated && (
        <Tooltip label="New Session" position="right" withArrow>
          <Link to="/sessions/new" style={{ textDecoration: 'none' }}>
            <div style={{ position: 'relative', width: rem(80), height: rem(80), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ActionIcon
                variant="filled"
                radius={60}
                size={rem(60)}
                style={{ position: 'absolute' }}
                className={classes.iconButton}
              >
                <Image src="/home_button.svg" style={{ position: 'absolute', width: '100%', height: '100%' }} />
                <IconNewSection size={32} className={classes.icon} />
              </ActionIcon>
            </div>
          </Link>
        </Tooltip>
      )}
      {auth.isAuthenticated && (
        <Tooltip label="Past Sessions" position="right" withArrow>
          <Link to="/sessions" style={{ textDecoration: 'none' }}>
            <div style={{ position: 'relative', width: rem(80), height: rem(60), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ActionIcon
                variant="filled"
                radius={60}
                size={rem(60)}
                style={{ position: 'absolute' }}
                className={classes.iconButton}
              >
                <Image src="/home_button.svg" style={{ position: 'absolute', width: '100%', height: '100%' }} />
                <IconPhoto size={32} className={classes.icon} />
              </ActionIcon>
            </div>
          </Link>
        </Tooltip>
      )}
    </div>
  );
  
};

export default NavButton;