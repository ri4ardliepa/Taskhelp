import React, { useContext, useEffect, useState } from "react";
import "./Header.css";
import { BiMenuAltRight } from "react-icons/bi";
import { getMenuStyles } from "../../utils/common";
import useHeaderColor from "../../hooks/useHeaderColor";
import OutsideClickHandler from "react-outside-click-handler";
import { Link, NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import UserMenu from "../UserMenu/UserMenu";
import NewPropertyModal from "../NewPropertyModal/NewPropertyModal";
import useAuthentication from "../../hooks/useAuthentication.jsx";
import UserDetailContext from "../../context/UserDetailContext.js";
import { whoAmI } from "../../utils/api"


const Header = () => {
  const [menuOpened, setMenuOpened] = useState(false);
  const headerColor = useHeaderColor();
  const [modalOpened, setModalOpened] = useState(false);
  const { loginWithRedirect, isAuthenticated, user, isLoading, logout } = useAuth0();
  const { validateLogin } = useAuthentication();

  const { setUserDetails } = useContext(UserDetailContext)

  const handleAddPropertyClick = () => {
    if (validateLogin()) {
      setModalOpened(true);
    }
  }

  useEffect(() => {
    const getToken = async () => {
      const data = {
        email: user.email,
        image: user.picture || null,
        name: user.nickname || user.name || null,
      }

      const res = await whoAmI(data)

      setUserDetails(res.data)
    }

    if (user && user.email) getToken()
  }, [user])

  return (
    <section className="h-wrapper" style={{ background: headerColor }}>
      <div className="flexSpaceBetween innerWidth paddings h-container">
        {/* logo */}
        <Link to="/">
          <img src="/graduation.png" alt="logo" width={100} />
        </Link>

        {/* menu */}
        <OutsideClickHandler
          onOutsideClick={() => {
            setMenuOpened(false);
          }}
        >
          <div
            // ref={menuRef}
            className="flexCenter h-menu"
            style={getMenuStyles(menuOpened)}
          >
            <NavLink to="/properties">Find your property</NavLink>

            <a href="mailto:zainkeepscode@gmail.com">Contact Us</a>

            {/* add property */}
            <div onClick={handleAddPropertyClick}>Add Property</div>
            <NewPropertyModal opened={modalOpened} setOpened={setModalOpened} />
            {/* login button */}
            {
              !isLoading && (
                <>
                  {
                    !isAuthenticated ? (
                      <button className="button" onClick={loginWithRedirect}>
                        Login
                      </button>
                    ) : (
                      <UserMenu user={user} logout={logout} />
                    )
                  }
                </>
              )
            }
          </div>
        </OutsideClickHandler>
        <div
          className="menu-icon"
          onClick={() => setMenuOpened((prev) => !prev)}
        >
          <BiMenuAltRight size={30} />
        </div>
      </div>
    </section>
  )
}


export default Header;