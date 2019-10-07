import  React, { useState, useEffect } from 'react';
import  Select from 'react-select'

export default function DropDownListComponent(props) {

    const [isLoading, setLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState("None");
    const [options, setOptions] = useState({});

    const handleChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        // Call handler to load the data for the selected subreddit
        props.handleChange(selectedOption.value);
    }

    // Lifecycle events in this one function
    useEffect(()=>{
        setOptions(props.data)
    });

     return( 
            <Select  
                    defaultValue={props.defaultValue}
                    className={props.className}
                    placeholder={props.placeholder}
                    value={selectedOption}
                    options={options}
                    onChange={handleChange}
                />
        );
    
}

