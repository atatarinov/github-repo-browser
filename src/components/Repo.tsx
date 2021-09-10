import styled from "styled-components";

const Container = styled.div`
  border: 1px solid lightgrey;
  padding: 15px;
  margin-bottom: 8px;
  border-radius: 2px;
`;

type RepoProps = {
  name: string;
};

export default function Repo({ name }: RepoProps) {
  return <Container>{name}</Container>;
}
