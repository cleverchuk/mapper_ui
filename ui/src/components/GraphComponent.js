import React from 'react'



class GraphComponent extends React.Component{

    render(){
        const style = {
            width:"100%",
            height:"100%",

        }
        return(
            <div style={style}>
               <center> <h1>Graph Area</h1></center>
            </div>
        );
    }
}

export default GraphComponent;