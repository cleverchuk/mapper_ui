import  React, { useState, useEffect } from 'react';
import DropDownListComponent from './DropDownListComponent';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import { Button, Checkbox } from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import {API, dataStore, apiRequest} from './GlobalVars.js'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import {
    useHistory
  } from "react-router-dom";
import RadioButtonsGroup from './RadioButtonGroupComponent';

const defaultSubreddits =  [{
    value: "programming",
    label: "Programming"
},
{
    value: "legaladvice",
    label: "Legal Advice"
},
{
    value: "politics",
    label: "Politics"
}
]

const useStyles = makeStyles(theme => ({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: 400,
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
     fab: {
        margin: theme.spacing(1),
        marginLeft:theme.spacing(30),
      },
      extendedIcon: {
        marginRight: theme.spacing(1),
      },
      card: {
        maxWidth: 345,
        marginLeft:10,
        marginTop:10,
        boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
      },

      containerDefault:{transform:"translate(100%, 50%)", width:500},
      container:{transform:"translate(100%, 10%)", width:500},

      fab:{ 
            position: "fixed",
            bottom: "50px",
            right: "50px"
      },
      sep:{height: theme.spacing(7), width:theme.spacing(1)},
      dropdown:{width:theme.spacing(50), marginTop:theme.spacing(2)}
  }));

export default function EntryComponent(props){
    const [subreddit, setSubreddit] = useState("legaladvice");
    const [isSubredittSelected, setSubredittSelected] = useState(false);
    const [data, setData] = useState([]);
    const classes = useStyles();
    let history = useHistory();
    const selectedArticles = new Set();

    const handleSubredditSelect = (subreddit) =>{   
        setSubreddit(subreddit);
        setSubredittSelected(true);
        apiRequest(`${API}articles/${subreddit}`, "GET")
        .then((response) =>{
            setData(response)
            dataStore.data = response;
        })
        .catch((error)=>{
            console.log(error);
        });
    }


    const filterArticles = (event)=>{
        const data = dataStore.data.filter((element)=>{
            const prefix = event.target.value;
            return element.title.toLowerCase().startsWith(prefix.toLowerCase()) || prefix === ""
        })
        setData(data)
    }

    const handleArticleSelect = (checked, articleId)=>{
        if(checked)
            selectedArticles.add(articleId);
        else
            selectedArticles.delete(articleId);
    }

    const handleProceed = ()=>{
        props.handleProceed(selectedArticles);        
        history.push("/visualization")
    }

    const handleSortOrderChange = (ordering)=>{
        //Todo ui does not update after sorting

        if(ordering === "time"){
            const data = dataStore.data.sort((a,b)=>{
                return a.timestamp - b.timestamp;
            }).slice(0)
            setData(data);

        }else if(ordering === "view count"){
            const data = dataStore.data.sort((a,b)=>{
                return a.view_count - b.view_count;
            }).reverse().slice(0)
            setData(data);

        }else if(ordering === "comment count"){
            const data = dataStore.data.sort((a,b)=>{
                return a.comment_count - b.comment_count;
            }).reverse().slice(0)
            setData(data);

        }else if(ordering === "upvote ratio"){
            const data = dataStore.data.sort((a,b)=>{
                return a.upvote_ratio - b.upvote_ratio;
            }).reverse().slice(0)
            setData(data);

        }else{
            console.log("Sorting by title");
            const data = dataStore.data.sort((a,b)=>{
                return a.title.localeCompare(b.title);
            }).slice(0)
            setData(data);
        }        
    }

    const cards = data.map((article)=>{
        return(
                <Card key={article.id} className={classes.card}>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                        {article.title}
                        </Typography>
                        <Typography gutterBottom>
                        View Count: {article.view_count} <br/>
                        Upvote ratio: {article.upvote_ratio}<br/>
                        Is video: {article.isVideo.toString()}<br/>
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Checkbox size="small" color="primary" onClick={(event)=>{handleArticleSelect(event.target.checked, article.id)}}/>
                    </CardActions>
                </Card>
        );
    });
    
    return(
        <div>
            <div className={isSubredittSelected ? classes.container : classes.containerDefault}>
                <DropDownListComponent
                    className={classes.dropdown}
                    handleChange={handleSubredditSelect} 
                    options={defaultSubreddits} 
                    placeholder={"Select a Subreddit"}
                />
                <div className={classes.sep}/>
                <Paper className={classes.root}>
                    <InputBase
                        className={classes.input}
                        placeholder="Filter by title"
                        onChange={filterArticles}
                    />
                    {/* <IconButton className={classes.iconButton} aria-label="search">
                        <SearchIcon />
                    </IconButton> */}
                </Paper>
                
                <div className={classes.sep}/>
                <RadioButtonsGroup 
                    onChange={handleSortOrderChange} 
                    orientation={"row"}
                    default={"time"} 
                    title={"Sort by:"}
                    values={["Time","Title","View count","Upvote ratio","Comment count"]}/>
            </div>
            <div style={{display:"flex", flexFlow:'row wrap'}}>
                {cards}
            </div>
            <Fab color={"primary"} onClick={handleProceed} className={classes.fab}>
                <ArrowForwardIcon/>
            </Fab>
        </div>
    );
}