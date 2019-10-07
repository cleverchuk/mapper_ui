import React from 'react'
import DropDownListComponent from './DropDownListComponent';
import Slider from '@material-ui/core/Slider';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ColorComponent from './ColorComponent';

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

const defaultMechanism =  [{
    value: "cc",
    label: "Connected Components"
},
]

const defaultFilters =  [{
    value: "reading_level",
    label: "Reading Level"
},
{
    value: "sentiment",
    label: "Sentiment"
}
]

const defaultLayout =  [{
    value: "tree",
    label: "Hierarchy"
},
{
    value: "forcedirected",
    label: "Force Directed"
},
]
const useStyles = makeStyles(theme => ({
    select: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),  
    },
        
    sliders:{
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),        
    },
    
    separator :{
        height: "25px",
    },

    colors:{
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),   
    },

}));

export default function ControlsComponent(props) {
    const classNames = useStyles();

    return(
        <div >
            <DropDownListComponent handleChange={props.handleSubredditSelect} className={classNames.select} data={defaultSubreddits} placeholder={"Select a Subreddit"}/>
            <div className={classNames.separator}/>
            
            <DropDownListComponent handleChange={props.handleFilterSelect} 
                className={classNames.select} 
                data={defaultFilters} 
                placeholder={"Select filter"}/>
            <div className={classNames.separator}/>

            <DropDownListComponent handleChange={props.handleClusteringMechanismSelect} className={classNames.select} data={defaultMechanism} placeholder={"Select Clustering Algorithm"}/>
            <div className={classNames.separator}/>

            <DropDownListComponent handleChange={props.handleLayoutSelect} className={classNames.select} data={defaultLayout} placeholder={"Select Layout"}/>
            <div className={classNames.separator}/>

            <Typography className={classNames.sliders} id="discrete-slider" gutterBottom>
                Epsilon
            </Typography>
            <Slider 
                className={classNames.sliders}
                valueLabelDisplay={'auto'}                    
                aria-labelledby="discrete-slider-small-steps"
                min={0}
                step={0.001}
                onChange={props.handleEpsilonValueChange}
                />
            
            <div className={classNames.separator}/>
            <Typography className={classNames.sliders} id="discrete-slider" gutterBottom>
                Intervals
            </Typography>
            <Slider 
                className={classNames.sliders}
                valueLabelDisplay={'auto'}
                min={1}
                onChange={props.handleIntervalChange}
                />

            <div className={classNames.separator}/>
            <ColorComponent 
                    className={classNames.colors} 
                    handleColorSchemeSelect={props.handleColorSchemeSelect} 
                    handleColorSelect={props.handleColorSelect}/>
        </div>
    );

}

