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
import Grid from '@material-ui/core/Grid';
const uuidv1 = require('uuid/v1');

const API = "http://127.0.0.1:8000/api/";
const axios = require('axios').default;
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
  const [mapper, setMapper] = useState({});

  const [subreddit, setSubreddit] = useState("legaladvice");
  const [lens, setLens] = useState("reading_level");
  const [clusterinAlgorithm, setClusteringAlgorithm] = useState("cc");
  const [layout, setLayout] = useState("force_directed");
  const [interval, setInterval] = useState(3);
  const [epsilon, setEpsilon] = useState(0.05);


  const [colorScheme, setColorScheme] = useState({scheme:interpolateBrBG});
  const [isColor, setIsColor] = useState(false);
  const [color, setColor] = useState("#b4ccef");
  const [lenses, setLenses]=useState([]);


  const handleSubredditSelect = (subreddit) =>{
    // Fetch subreddit data and update state
    axios.get(`${API}subreddit?subreddit=${subreddit}`)
    .then((response)=>{
      // console.log("Main response:",response.data);
      setData(response.data);
    }).catch((error)=>{
      console.log(error);
    })

    setSubreddit(subreddit);
    handleloadGraphClick();// Avoiding multiple calls to fetchLens in useEffect
  }

  const handleClusteringAlgorithmSelect = (mechanism) =>{
    // set mechanism and update state
    setClusteringAlgorithm(mechanism);
    handleloadGraphClick();// Avoiding multiple calls to fetchLens in useEffect
    // console.log(mechanism);
  }


  const handleFilterSelect = (lens) =>{
    // set lens and update state
    setLens(lens);
    handleloadGraphClick(); // Avoiding multiple calls to fetchLens in useEffect
    console.log(lens);
  }

  const handleLayoutSelect = (layout) =>{
    // set layout method and update state
    setLayout(layout);
    handleloadGraphClick(); // Avoiding multiple calls to fetchLens in useEffect
    // console.log(layout);
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

  const generateEndpointWithParams = (API, params)=>{
    let queryParams = Object.keys(params).reduce((out, key)=>{
      return out + key+"="+params[key]+"&";
    },"?")
    return API+queryParams.substr(0,queryParams.length-1);
  }

  const handleloadGraphClick = ()=>{
    let params = {
      subreddit:subreddit,
      lens:lens,
      clustering_algorithm:clusterinAlgorithm,
      graph_layout:layout,
      interval:interval,
      epsilon:epsilon,
    }

    const endpoint = API+"mapper";
    // console.log("Making api call to:", endpoint);
    // console.log("With params:", params);
    console.log("endpoint: ", generateEndpointWithParams(endpoint, params))
    axios.get(generateEndpointWithParams(endpoint, params))
    .then((response)=>{
      // console.log("Mapper",response);
      setMapper(response.data);
      // setData(response.data);
    }).catch((error)=>{
      console.log(error);
    })
  }

  useEffect(()=>{
    const fetchLens = async ()=>{
      const response = await axios.get("http://127.0.0.1:8000/api/lenses")      
      setLenses(response.data.data);
    };
    fetchLens();
    // handleloadGraphClick();

  },["layout"])

  console.log("Main:", data)
  console.log("Mapper:", mapper)
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
            lenses={lenses}
            handleloadGraphClick={handleloadGraphClick}
            handleSubredditSelect={handleSubredditSelect} 
            handleClusteringAlgorithmSelect={handleClusteringAlgorithmSelect}
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
        <div style={{display:"flex", flexFlow:"row"}}>
          <GraphComponent 
              name={"main"}
              data={data} 
              layout={layout} 
              colorScheme={colorScheme} 
              color={color} 
              isColor={isColor}    
              lens={lens} 
              />

          <GraphComponent 
              name={"mapper"}
              data={mapper} 
              layout={layout} 
              colorScheme={colorScheme} 
              color={color} 
              isColor={isColor}    
              lens={lens} 
              />
        </div>
      </main>
    </div>
  );
}