import React, { useContext, useEffect, useState } from 'react';
import "../header/navbaar.css";
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { NavLink } from 'react-router-dom';
import { Logincontext } from '../context/Contextprovider';
import { ToastContainer, toast } from 'react-toastify';
import LogoutIcon from '@mui/icons-material/Logout';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { Drawer, IconButton, List, ListItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Rightheader from './Rightheader';
import { getProducts } from '../redux/actions/action';
import { useSelector, useDispatch } from "react-redux";

const Navbaar = () => {
  const navigate = useNavigate();
  const [text, setText] = useState();
  const { products } = useSelector(state => state.getproductsdata);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const [open, setOpen] = useState(null);
  const [dropen, setDropen] = useState(false);
  const [liopen, setLiopen] = useState(true);

  // Safe destructuring with fallback to empty object
  const { account, setAccount } = useContext(Logincontext) || {};  

  useEffect(() => {
    const getdetailsvaliduser = async () => {
      const res = await fetch("/validuser", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        credentials: "include"
      });
      const data = await res.json();
      if (res.status !== 201) {
        console.log("first login");
      } else {
        setAccount(data);
      }
    };
    getdetailsvaliduser();
  }, [setAccount]);

  const logoutuser = async () => {
    const res = await fetch("/logout", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      credentials: "include"
    });
    const data = await res.json();
    if (res.status === 201) {
      setAccount(null); // Clear account data from context
      toast.success("User logged out 😃!", { position: "top-center" });
      navigate("/"); // Redirect to home page
    } else {
      const error = new Error(res.error);
      throw error;
    }
  };

  const getText = (text) => {
    setText(text);
    setLiopen(false);
  };

  const handelopen = () => setDropen(true);
  const handleClosedr = () => setDropen(false);

  return (
    <header>
      <nav>
        <div className="left">
          <IconButton className="hamburgur" onClick={handelopen}>
            <MenuIcon style={{ color: "#fff" }} />
          </IconButton>
          <Drawer open={dropen} onClose={handleClosedr}>
            <Rightheader userlog={logoutuser} logclose={handleClosedr} />
          </Drawer>
          <div className="navlogo">
            <NavLink to="/">
              <img src="./amazon_PNG25.png" alt="logo" />
            </NavLink>
          </div>
          <div className="nav_searchbaar">
            <input
              type="text"
              onChange={(e) => getText(e.target.value)}
              placeholder="Search Your Products"
            />
            <div className="search_icon">
              <i className="fas fa-search" id="search"></i>
            </div>
            {text && (
              <List className="extrasearch" hidden={liopen}>
                {products
                  .filter((product) =>
                    product.title.longTitle
                      .toLowerCase()
                      .includes(text.toLowerCase())
                  )
                  .map((product) => (
                    <ListItem key={product.id}>
                      <NavLink
                        to={`/getproductsone/${product.id}`}
                        onClick={() => setLiopen(true)}
                      >
                        {product.title.longTitle}
                      </NavLink>
                    </ListItem>
                  ))}
              </List>
            )}
          </div>
        </div>
        <div className="right">
          <div className="nav_btn">
            {!account && <NavLink to="/login">Sign in</NavLink>}
          </div>
          {account ? (
            <NavLink to="/buynow">
              <div className="cart_btn">
                <Badge badgeContent={account.carts.length} color="secondary">
                  <i className="fas fa-shopping-cart" id="icon"></i>
                </Badge>
                <p>Cart</p>
              </div>
            </NavLink>
          ) : (
            <NavLink to="/login">
              <div className="cart_btn">
                <Badge badgeContent={0} color="secondary">
                  <i className="fas fa-shopping-cart" id="icon"></i>
                </Badge>
                <p>Cart</p>
              </div>
            </NavLink>
          )}

          {account ? (
            <Avatar
              className="avtar2"
              onClick={(e) => setOpen(e.currentTarget)}
              title={account.fname.toUpperCase()}
            >
              {account.fname[0].toUpperCase()}
            </Avatar>
          ) : (
            <Avatar className="avtar" onClick={(e) => setOpen(e.currentTarget)} />
          )}

          <Menu
            anchorEl={open}
            open={Boolean(open)}
            onClose={() => setOpen(null)}
            className="menu_component"
          >
            <MenuItem onClick={() => setOpen(null)} style={{ margin: 10 }}>
              My account
            </MenuItem>
            {account && (
              <MenuItem
                onClick={() => {
                  logoutuser();
                  setOpen(null);
                }}
                style={{ margin: 10 }}
              >
                <LogoutIcon style={{ fontSize: 16, marginRight: 3 }} /> Logout
              </MenuItem>
            )}
          </Menu>
          <ToastContainer />
        </div>
      </nav>
    </header>
  );
};

export default Navbaar;
