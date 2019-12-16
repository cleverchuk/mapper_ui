import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(3),
  },
}));

export default function RadioButtonsGroup(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(props.default);

  const handleChange = (event) => {
    setValue(event.target.value);
    props.onChange(event.target.value);
  };

  let values = props.values;
  const radios = values.map((val)=>{
    return (<FormControlLabel key={val} value={val.toLowerCase()} control={<Radio />} label={val} />)
  });
  return (
    <div>
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend">{props.title}</FormLabel>
        <RadioGroup row={props.orientation === "row"} aria-label={props.title} value={value} onChange={handleChange}>
            {radios}
        </RadioGroup>
      </FormControl>
      </div>
  );
}