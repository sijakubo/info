import styled from '@emotion/styled'
import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'

const Content = styled.div`
  max-width: 860px;
  padding: 1rem 0;
  font-size: 1.2rem;
`

const NavLink = styled(Link)`
  color: #CECECE;
  text-decoration: none;
  display: inline-block;
  position: relative;

  ::after {
    content: "";
    position: absolute;
    width: 100%;
    transform: scaleX(0);
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: #B77800;
    transform-origin: bottom right;
    transition: transform 0.4s cubic-bezier(0.86, 0, 0.07, 1);
  }

  :hover::after {
    transform: scaleX(1);
    transform-origin: bottom left;
  }
`

const GitHubLink = styled.a`
  color: #CECECE;
  text-decoration: none;
  display: inline-block;
  position: relative;

  ::after {
    content: "";
    position: absolute;
    width: 100%;
    transform: scaleX(0);
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: #B77800;
    transform-origin: bottom right;
    transition: transform 0.4s cubic-bezier(0.86, 0, 0.07, 1);
  }

  :hover::after {
    transform: scaleX(1);
    transform-origin: bottom left;
  }
`

const HomeLink = styled(NavLink)`
  margin-left: 0;
`

const SiteHeader = styled.header`
  background: transparent;
  display: flex;
  align-content: center;
  justify-content: center;
`

const Header = ({ siteTitle }) => (
        <SiteHeader>
          <Content>
            <p style={ { display: `flex`, gap: `3rem` } }>
              <HomeLink to="/">{ siteTitle }</HomeLink>
              <NavLink to="/notes">Notes</NavLink>
              <GitHubLink href="https://github.com/sijakubo">
                GitHub
              </GitHubLink>
            </p>
          </Content>
        </SiteHeader>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
