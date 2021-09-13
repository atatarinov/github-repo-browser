import styled from "styled-components";
import { Github } from "@styled-icons/entypo-social/Github";

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 70px;
  background-color: #24292e;
  box-shadow: 0px 0px 10px lightgray;
`;

const Title = styled.h2`
  color: white;
  margin-top: 30px;
  margin-right: auto;
  @media (max-width: 760px) {
    font-size: 20px;
  }
  @media (max-width: 600px) {
    display: none;
  }
`;

const GithubIcon = styled(Github)`
  height: 2.5rem;
  color: white;
  margin-right: auto;
  margin-left: 3rem;
  margin-top: 20px;
`;

export default function Header() {
  return (
    <Container>
      <GithubIcon />
      <Title>Welcome to Chegg GitHub Repository and Issue Browser</Title>
    </Container>
  );
}
