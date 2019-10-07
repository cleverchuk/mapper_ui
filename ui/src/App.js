import React,{ useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ControlsComponent from './components/ControlsComponent';
import GraphComponent from './components/GraphComponent';
import {interpolateBrBG} from 'd3'

const API = "http://127.0.0.1:8000/api/";
const axios = require("axios");
const drawerWidth = 450;
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function App(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});
  const [isColor, setIsColor] = useState(false);
  const [clusterinMechanism, setClusteringMechanism] = useState("cc");
  const [filter, setFilter] = useState("reading_level");
  const [layout, setLayout] = useState("forcedirected");
  const [colorScheme, setColorScheme] = useState({scheme:interpolateBrBG});
  const [color, setColor] = useState("#b4ccef");


  const handleSubredditSelect = (subreddit) =>{
    // Fetch subreddit data and update state
    axios.get(`${API}subreddit_edges?subreddit=${subreddit}`)
    .then((response) =>{
      setData(response.data.data)
      console.log(response);
    }).catch((error) =>{
      console.log(error);
    });
  }

  const handleClusteringMechanismSelect = (mechanism) =>{
    // set mechanism and update state
    setClusteringMechanism(mechanism);
    console.log(mechanism);
  }


  const handleFilterSelect = (filter) =>{
    // set filter and update state
    setFilter(filter);
    console.log(filter);
  }

  const handleLayoutSelect = (layout) =>{
    // set layout method and update state
    setLayout(layout);
    console.log(layout);
  }

  const handleEpsilonValueChange = (event, value) =>{
    // set epsilon and update state
    console.log(value);
  }

  const handleIntervalChange = (event, value) =>{
    // set interval and update state
    console.log(value);
  }

  const handleColorSchemeSelect = (scheme) =>{
    // set color and update state
    console.log("APP.JS scheme",scheme);
    setColorScheme({scheme:scheme});
    setIsColor(false);
  }

  const handleColorSelect = (color) =>{
    // set color and update state
    setColor(color);
    setIsColor(true);
    console.log(color);
  }

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        // clsx conditionally apply styling based on className
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Discussion Mapper
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <ControlsComponent 
            handleSubredditSelect={handleSubredditSelect} 
            handleClusteringMechanismSelect={handleClusteringMechanismSelect}
            handleFilterSelect={handleFilterSelect}
            handleLayoutSelect={handleLayoutSelect}
            handleEpsilonValueChange={handleEpsilonValueChange}
            handleIntervalChange={handleIntervalChange}
            handleColorSchemeSelect={handleColorSchemeSelect}
            handleColorSelect={handleColorSelect}
            />
      </Drawer>
      <main className={clsx(classes.content, {[classes.contentShift]: open, })}>
        <div className={classes.drawerHeader} />
        <GraphComponent 
            data={data} 
            layout={layout} 
            colorScheme={colorScheme} 
            color={color} 
            isColor={isColor}    
            filter={filter} 
            />
      </main>
    </div>
  );
}