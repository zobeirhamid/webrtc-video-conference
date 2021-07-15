import React from "react";
import styled, { css } from "styled-components";

const Select = styled.select`
  padding: 10px;
  border-style: solid;
  border-width: 1px;
  border-radius: 3px;
  border-color: #353640;
  color: #353640;
  font-weight: 800;
  font-size: 1em;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  ${(props: React.HTMLAttributes<HTMLSelectElement> & { width?: string }) =>
    props.width &&
    css`
      width: ${props.width};
    `}
`;

export default Select;
