import React, { useState, useEffect } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import * as d3 from "d3";
import '../style/coloratom.css'
const uuidv1 = require('uuid/v1');
// import { SketchPicker, CirclePicker ,
//       SwatchesPicker, TwitterPicker, } from 'react-color';

const colorSchemes = {
    'divergent':'0',
    'discrete':'1',
    'sequential':'2'
}


function ColorAtom (props){
    const handleClick = () => {      
        props.onClick(props.index, props.color)
    }


    const style = {
        background: props.color,
        width:"25px",
        height:"25px",
        margin:`${props.spacing} 0px 0px 0px`,
        borderRadius:props.radius,
        boxShadow:props.shadow
    }

    const style2 = {
        background: props.color,
        width:"25px",
        height:"25px",
        margin:`${props.spacing} 0px 0px 0px`,
        borderRadius:props.radius,
        boxShadow:props.shadow,
        border:'2px solid green'
    }

    return(
        <div style={props.selected? style2: style} onClick={handleClick}/>
    );

}

function ColorMolecule(props){
    const scale = d3.scaleLinear().domain([0, props.atomCount])
    const fn = props.fn;
    const atoms = [];
    const colors = typeof(fn) === "function" ? d3.range(0, props.atomCount, 1).map(t => fn(scale(t)) ) : fn.slice(0,8);
    const style = {
        float:'left',
        margin:'1px',
    }

    const style2 = {
        float:'left',
        margin:'1px',
        border:'2px solid green'
    }

    const handleClick = (index, color) =>{
        //Pass the color to the parent if the colorScheme is categorical else pass down the divergent or sequentail function
        if(props.colorScheme === colorSchemes.discrete){
            props.handleColorSelect(props.index, index, color);

        }else{
            props.handleColorSchemeSelect(props.index, fn)
        }
    }


    
    for(var i = 0; i < colors.length; i++){
        // draw atom border only when scheme is discrete
        atoms.push(<ColorAtom selected={props.atomWhich===i && props.selected} 
            key={uuidv1()} 
            index={i}
            color={colors[i]} 
            radius={props.radius} 
            spacing={props.spacing}
            shadow={props.shadow}
            onClick={handleClick}
        />);
    }
    return (
        <div id={"color-molecule-container"} style={props.selected && props.colorScheme !== colorSchemes.discrete ? style2 : style}>                  
            {atoms}
        </div>
    );
}

function ColorCompound (props){
    const [which, setWhich] = useState(0)
    const [atomWhich, setAtomWhich] = useState(0)
        const count = 5;
        const atomCount = 10;
        const molecules = [];
        

        const style ={
            display:'flex',
            flexFlow:'row wrap',
            alignItems:'flex-end'
        }

        const divergent = [d3.interpolateBrBG, d3.interpolatePRGn, d3.interpolateRdBu, d3.interpolateRdYlGn, d3.interpolateRdGy];
        const sequential = [d3.interpolateBlues, d3.interpolateReds, d3.interpolatePurples, d3.interpolateGreys, d3.interpolateGreens];
        const discrete = [d3.schemeCategory10, d3.schemePaired, d3.schemeTableau10, d3.schemeSet3, d3.schemeDark2];

        const handleMoleculeSelect = (index, fn)=>{
            props.handleColorSchemeSelect(fn);
            setWhich(index);
        }

        const handleColorSelect = (index,aindex, fn)=>{
            props.handleColorSelect(fn);
            setAtomWhich(aindex)
            setWhich(index)
        }

        var i = 0
        if(colorSchemes.sequential === props.colorScheme){ 

            for(; i < count; i++){
                molecules.push(<ColorMolecule 
                    key={uuidv1()} 
                    fn={sequential[i]} 
                    selected={which===i}
                    index={i}
                    radius={'0px'} 
                    spacing={'0px'} 
                    atomCount={atomCount} 
                    handleColorSchemeSelect={handleMoleculeSelect}
                    colorScheme={props.colorScheme}
                    />);
            }

            return (
                <div style={style}>                                
                    {molecules}
                </div>
            );         
        }
        
        if(colorSchemes.discrete === props.colorScheme){ 
            for(; i < count; i++){
                molecules.push(<ColorMolecule 
                    key={uuidv1()} 
                    fn={discrete[i]} 
                    selected={which===i}
                    index={i}
                    atomWhich={atomWhich}
                    radius={'5px'} 
                    spacing={'5px'}
                    atomCount={atomCount} 
                    shadow={"0 2px 4px 0"}
                    handleColorSelect={handleColorSelect}
                    colorScheme={props.colorScheme}
                />);
            }

            return (
                <div style={style}>                                
                    {molecules}
                </div>
            );
        }

        
        if(colorSchemes.divergent === props.colorScheme){
            for(; i < count; i++){
                molecules.push(<ColorMolecule 
                    key={uuidv1()} 
                    fn={divergent[i]} 
                    selected={which===i}
                    index={i}
                    radius={'0px'} 
                    spacing={'0px'} 
                    atomCount={atomCount}
                    handleColorSchemeSelect={handleMoleculeSelect}
                    colorScheme={props.colorScheme}
                />);
            }

            return (
                <div style={style}>                                
                    {molecules}
                </div>
            ); 
        }

}

export default function ColorComponent(props) {
    const [colorScheme, setColorScheme] = useState(colorSchemes.divergent);
    useEffect(()=>{
        //TODO manage state lifecyle here
    });

    const handleChange = (event) =>{
        setColorScheme(event.target.value);
        // console.log(event.target.value);
    }

    const handleColorSelect = (color) =>{
        props.handleColorSelect(color);
    }

    const handleColorSchemeSelect =(func)=>{
        props.handleColorSchemeSelect(func);
    }

      const style ={
            display:'flex',
            flexFlow:'column wrap',
      };

    return (
        <div style={style} className={props.className}>            
            <ColorCompound 
            colorScheme={colorScheme}
            handleColorSchemeSelect={handleColorSchemeSelect}
            handleColorSelect={handleColorSelect}
            />
            <FormControl component="fieldset">
                <FormLabel component="legend">Color Scheme</FormLabel>                
                <RadioGroup aria-label="position" name="position" value={colorScheme}  onChange={handleChange} row>
                    <FormControlLabel value={colorSchemes.divergent} control={<Radio />} label="Diverging" />
                    <FormControlLabel value={colorSchemes.discrete} control={<Radio />} label="Discrete" />
                    <FormControlLabel value={colorSchemes.sequential} control={<Radio />} label="Sequential" />
                </RadioGroup>
            </FormControl>
        </div>
    );

}

