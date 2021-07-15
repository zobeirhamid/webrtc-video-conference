import styled, { css } from "styled-components";

const Button = styled.button`
  padding: 0.5em 1em;
  border-style: solid;
  border-width: 2px;
  border-color: #005450;
  border-radius: 3px;
  background-color: #005450;
  color: white;
  font-weight: 800;
  font-size: 1em;
  cursor: pointer;

  &:hover {
    opacity: 0.75;
  }

  &:focus {
    outline: none;
  }

  ${({
    disabled,
  }: React.HTMLAttributes<HTMLButtonElement> & { disabled?: boolean }) =>
    disabled &&
    css`
      opacity: 0.75;
    `}
`;

export default Button;
