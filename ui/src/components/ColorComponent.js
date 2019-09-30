import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import * as d3 from "d3";
const uuidv1 = require('uuid/v1');
// import { SketchPicker, CirclePicker ,
//       SwatchesPicker, TwitterPicker, } from 'react-color';

const types = {
    'divergent':'0',
    'discrete':'1',
    'sequential':'2'
}


class ColorAtom extends React.Component{
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        console.log(`Clicked ColorAtom: ${this.props.color}`)        
        this.props.onClick(this.props.color)
    }

    render(){
        const style = {
            background: this.props.color,
            width:"25px",
            height:"25px",
            margin:`${this.props.spacing} 0px 0px 0px`,
            borderRadius:this.props.radius,
        }


        return(
            <div style={style} onClick={this.handleClick}/>
        );
    }
}

class ColorMolecule extends React.Component{
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(){
        //Pass the color to the parent if the format is categorical else pass down the divergent or sequentail function
    }

    render(){

        const scale = d3.scaleLinear().domain([0, this.props.atomCount])
        const fn = this.props.fn;
        const atoms = [];
        const colors = typeof(fn) === "function" ? d3.range(0, this.props.atomCount, 1).map(t => fn(scale(t)) ) : fn.slice(0,8);
        var i = 0;

        const style = {
            float:'left',
            margin:'1px',
        }

        for(; i < colors.length; i++){
            atoms.push(<ColorAtom key={uuidv1()} color={colors[i]} radius={this.props.radius} spacing={this.props.spacing}/>);
        }
        // console.log(atoms)  
        return (
            <div style={style}>                  
                {atoms}
            </div>
        );
            
    }

}

class ColorCompound extends React.Component{
    render(){
        const count = 5;
        const atomCount = 10;
        const molecules = [];
        var i = 0;

        const style ={
            display:'flex',
            flexFlow:'row wrap',
            alignItems:'flex-end'
        }

        const divergent = [d3.interpolateBrBG, d3.interpolatePRGn, d3.interpolateRdBu, d3.interpolateRdYlGn, d3.interpolateRdGy];
        const sequential = [d3.interpolateBlues, d3.interpolateReds, d3.interpolatePurples, d3.interpolateGreys, d3.interpolateGreens];
        const discrete = [d3.schemeCategory10, d3.schemePaired, d3.schemeTableau10, d3.schemeSet3, d3.schemeDark2];

        if(types.sequential === this.props.format){ 
            for(; i < count; i++){
                molecules.push(<ColorMolecule key={uuidv1()} fn={sequential[i]} radius={'0px'} spacing={'0px'} atomCount={atomCount} />);
            }

            return (
                <div style={style}>                                
                    {molecules}
                </div>
            );         
        }
        
        if(types.discrete === this.props.format){ 
            for(; i < count; i++){
                molecules.push(<ColorMolecule key={uuidv1()} fn={discrete[i]} radius={'5px'} spacing={'5px'} atomCount={atomCount} />);
            }

            return (
                <div style={style}>                                
                    {molecules}
                </div>
            );
        }

        
        if(types.divergent === this.props.format){
            for(; i < count; i++){
                molecules.push(<ColorMolecule key={uuidv1()} fn={divergent[i]} radius={'0px'} spacing={'0px'} atomCount={atomCount}/>);
            }

            return (
                <div style={style}>                                
                    {molecules}
                </div>
            ); 
        }
    }
}

class ColorComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            format:types.divergent
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleColorAtomClick = this.handleColorAtomClick.bind(this)
    }


    handleChange(event){
        this.setState({format:event.target.value});
        // console.log(event.target.value)
    }

    handleColorAtomClick(color){
        //TODO
    }

    render() {
      const style ={
            display:'flex',
            flexFlow:'column wrap',
      };

    return (
        <div style={style}>
            <FormControl component="fieldset">
                <FormLabel component="legend">Color Scheme</FormLabel>                
                <RadioGroup aria-label="position" name="position" value={this.state.format}  onChange={this.handleChange} row>
                    <FormControlLabel value={types.divergent} control={<Radio />} label="Diverging" />
                    <FormControlLabel value={types.discrete} control={<Radio />} label="Discrete" />
                    <FormControlLabel value={types.sequential} control={<Radio />} label="Sequential" />
                </RadioGroup>
            </FormControl>
            <ColorCompound format={this.state.format} />
        </div>
    );
  }
}

export default ColorComponent;