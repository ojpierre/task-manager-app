/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import styled from 'styled-components';

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #007bff;
  padding: 10px;
`;

const NavLeft = styled.div`
  .brand {
    color: #fff;
    text-decoration: none;
    font-size: 20px;
    font-weight: bold;
  }
`;

const NavRight = styled.div`
  .tabs {
    a {
      color: #fff;
      text-decoration: none;
      font-size: 14px;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

function Header() {
  return (
    <div>
      <Nav>
        <NavLeft>
          <a className="brand" href="#">My Web Task Manager</a>
        </NavLeft>
        <NavRight>
          <div className="tabs">
            <a href="/">By Pierre.</a>
          </div>
        </NavRight>
      </Nav>
    </div>
  );
}

export default Header;
