import  React, { useState, useEffect } from 'react';
import DropDownListComponent from './DropDownListComponent';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import { Button } from '@material-ui/core';
import Axios from 'axios';
import GlobalVar from './GlobalVars.js'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {
    useHistory
  } from "react-router-dom";
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

      containerDefault:{transform:"translate(125%, 250%)", width:500},
      container:{transform:"translate(125%, 25%)", width:500},

      button:{position: 'absolute', left: '25%'},
      sep:{height: theme.spacing(5), width:theme.spacing(1)},
      dropdown:{width:theme.spacing(50), marginTop:theme.spacing(2)}
  }));

var dataStore;
export default function EntryComponent(props){
    const [subreddit, setSubreddit] = useState("legaladvice");
    const [isSubredittSelected, setSubredittSelected] = useState(false);
    const [data, setData] = useState([]);
    const classes = useStyles();
    let history = useHistory();

    const handleSubredditSelect = (subreddit) =>{   
        setSubreddit(subreddit);
        setSubredittSelected(true);
        Axios.get(`${GlobalVar.API}articles/${subreddit}`)
        .then((response) =>{
            console.log(`Loaded articles from ${subreddit}`);
            console.log(response);
            setData(response.data)
            dataStore = response.data;
        })
        .catch((error)=>{
            console.log(error);
        });
    }


    const filterArticles = (event)=>{
        const data = dataStore.filter((element)=>{
            const prefix = event.target.value;
            return element.title.toLowerCase().startsWith(prefix.toLowerCase()) || prefix === ""
        })
        setData(data)
    }

    const handleArticleSelect = (articleId)=>{
        console.log(articleId);
        props.handleArticleSelect(articleId);
        history.push("/visualization")
    }

    const cards = data.map((aritcle, index)=>{
        return(
                <Card key={aritcle.id} className={classes.card}>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                        {aritcle.title}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" color="primary" onClick={(event)=>{handleArticleSelect(aritcle.id)}}>
                        Select
                        </Button>
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
            </div>

            <div className={classes.sep}/>
            <div style={{display:"flex", flexFlow:'row wrap'}}>
                {cards}
            </div>
        </div>
    );
}