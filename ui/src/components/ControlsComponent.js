import React from 'react'
import DropDownListComponent from './DropDownListComponent';
import Slider from '@material-ui/core/Slider';
import '../style/Controls.css'

import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
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



class ControlsComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            clustering:"readinglevel"
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleColorChange = this.handleColorChange.bind(this);
    }

    
    handleChange(event) {
      this.setState({clustering:event.target.value});
      //TODO: make request to backend to serve up data with the specified clustering
    }

    handleColorChange(color){
        //TODO
    }

    render(){

        return(
            <div className="Controls">
                <DropDownListComponent data={defaultSubreddits}/>

                <div className={"separator"}/>
                <FormControl component="fieldset" className={"form-control"}>
                    <FormLabel component="legend">Clustering Mechanism</FormLabel>
                    <RadioGroup value={this.state.clustering} aria-label="Mechanism" name="mechanism"  onChange={this.handleChange}>
                        <FormControlLabel value="readinglevel" control={<Radio />} label="Reading level" />
                        <FormControlLabel value="sentiment" control={<Radio />} label="Sentiment" />
                        <FormControlLabel value="averagewordlength" control={<Radio />} label="Average word length" />
                    </RadioGroup>
                </FormControl>

                <div className={"separator"}/>
                <Typography id="discrete-slider" gutterBottom>
                    Epsilon
                </Typography>
                <Slider 
                    className={"sliders"}
                    valueLabelDisplay={'auto'}                    
                    aria-labelledby="discrete-slider-small-steps"
                    min={0}
                    step={0.001}
                    />
                
                <div className={"separator"}/>
                <Typography id="discrete-slider" gutterBottom>
                    Intervals
                </Typography>
                <Slider 
                    className={"sliders"}
                    valueLabelDisplay={'auto'}
                    min={1}
                    />

                <div className={"separator"}/>
                <ColorComponent/>
            </div>
        );
    }
}

export default ControlsComponent;