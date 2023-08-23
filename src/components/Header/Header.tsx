import "./styles.css";
import { Button, ButtonGroup, Text } from "@chakra-ui/react";
import { Outlet, Link as RouterLink } from "react-router-dom";

export function Header() {
  return (
    <>
      <header className={"header"}>
        <div className={"header__logo"}>
          <img src={"/logo.svg"} alt={"logo"} />
          <Text className={"header__name"} color={"#805ad5"}>
            Visual Grid Builder
          </Text>
        </div>
        <nav className={"header__links"}>
          <ButtonGroup size={"sm"} variant={"ghost"} colorScheme={"purple"}>
            <RouterLink to={"about"}>
              <Button>About</Button>
            </RouterLink>

            <RouterLink to={"login"}>
              <Button>Login</Button>
            </RouterLink>
          </ButtonGroup>
        </nav>
      </header>

      <Outlet />
    </>
  );
}
