import  React from 'react';
import  Select from 'react-select'

class DropDownListComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(selectedOption){
        this.setState({selectedOption:selectedOption});
        // Call handler to load the data for the selected subreddit
        this.props.onChange(selectedOption.label);
    }

    componentDidMount() {
        this.setState({options: this.props.data})
    }

    render() {

     return( 
            <Select  
                    className={"select"}
                    placeholder={this.props.placeholder}
                    value={this.state.selectedOption}
                    options={this.state.options}
                    onChange={this.handleChange}
                />
        );
    }
}

export default DropDownListComponent;