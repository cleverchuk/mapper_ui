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
import ControlsComponent from './ControlsComponent';
import GraphComponent from './GraphComponent';
import {interpolateBlues} from 'd3'
import {API, apiRequest} from './GlobalVars'

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

export default function VisualiztionComponent(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});
  const [mapper, setMapper] = useState({});

  const [subreddit, setSubreddit] = useState("legaladvice");
  const [lens, setLens] = useState("reading_level");
  const [clusterinAlgorithm, setClusteringAlgorithm] = useState("cc");
  const [layout, setLayout] = useState("hierarchy");
  const [interval, setInterval] = useState(3);
  const [epsilon, setEpsilon] = useState(0.05);


  const [colorScheme, setColorScheme] = useState({scheme:interpolateBlues});
  const [isColor, setIsColor] = useState(false);
  const [color, setColor] = useState("#b4ccef");
  const [lenses, setLenses]=useState([]);
  const [articles, setArticles] = useState(Array.from(props.articles))



  const handleClusteringAlgorithmSelect = (mechanism) =>{
    // set mechanism and update state
    setClusteringAlgorithm(mechanism);
    // console.log(mechanism);
  }


  const handleFilterSelect = (lens) =>{
    // set lens and update state
    setLens(lens);
  }

  const handleLayoutSelect = (_layout) =>{
    // set layout method and update state
    if(layout !== _layout){
      handleloadGraph(_layout).then((data)=>{
        console.log("Layout change load")
        console.log(data)
        setLayout(_layout);
        setData(data);
      }).catch((error)=>{
        console.log(error);
      });
    }
  }

  const handleEpsilonValueChange = (event, value) =>{
    // set epsilon and update state
    setEpsilon(value);
  }

  const handleIntervalChange = (event, value) =>{
    // set interval and update state
    setInterval(value)
  }

  const handleColorSchemeSelect = (scheme) =>{
    // set color and update state
    setColorScheme({scheme:scheme});
    setIsColor(false);
  }

  const handleColorSelect = (color) =>{
    // set color and update state
    setColor(color);
    setIsColor(true);
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

  const handleloadGraph = (layout)=>{
    const endpoint = API+"article/nodes";
    let body = {
      "ids":articles,
      "layout":layout,
      "mapper":false,
      "m_params":{}
    }

    return apiRequest(endpoint,"POST",body);
  }



  const handleloadMapper = ()=>{
    let body = {
      "ids":articles,
      "layout":layout,
      "mapper":true,
      "m_params":{
        "lens":lens,
        "clustering_algorithm":clusterinAlgorithm,
        "interval":interval,
        "k":interval,
        "epsilon":epsilon,
      }
    }

    const endpoint = API+"article/nodes";    
    apiRequest(endpoint,"POST",body)
    .then((data)=>{
      setMapper(data);
    }).catch((error)=>{
      console.log(error);
    });
  }

  useEffect(()=>{
    const fetchLens = async ()=>{
      apiRequest(`${API}lenses`,"GET")
      .then(response=>{
        setLenses(response.data);
      })
      .catch(error=>console.log("Lens fetch failed with: ",error));

    };
    fetchLens();
    handleloadGraph(layout).then((data)=>{
      setData(data);
    }).catch((error)=>{
      console.log(error);
    });

  },["layout"])


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
            handleloadGraphClick={handleloadMapper}
            handleClusteringAlgorithmSelect={handleClusteringAlgorithmSelect}
            handleFilterSelect={handleFilterSelect}
            handleLayoutSelect={handleLayoutSelect}
            handleEpsilonValueChange={handleEpsilonValueChange}
            handleIntervalChange={handleIntervalChange}
            handleColorSchemeSelect={handleColorSchemeSelect}
            handleColorSelect={handleColorSelect}
            algorithm={clusterinAlgorithm}
            />
      </Drawer>
      <main className={clsx(classes.content, {[classes.contentShift]: open, })}>
        <div className={classes.drawerHeader} />
        <div style={{display:"flex", flexFlow:"row", justify:"space-around"}}>
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