import React from 'react';

export default class GoCell extends React.Component {
   
    renderDiv(){
        switch(this.props.indentifier){
            case 1:
                return <div style={{height: "22px",
                width: "22px",
                margin: "3px",
           backgroundImage: `url("https://via.placeholder.com/500//goplayer1.png")`}} title="🔵"></div>
            case 2:
                return <div style={{height: "22px",
                    width: "22px",
                    margin: "3px",
               backgroundImage: `url("https://via.placeholder.com/500//goplayer2.png")`}} 
                    title="🔴"></div>
            default:
                return <div onClick={() => this.props.dropper(this.props.coordinates)}   style={{height: "22px",
                width: "22px",
                margin: "3px",
            backgroundImage: `url("https://via.placeholder.com/500/emptygocell.png")`}} title="⚫" ></div>
        }
    }

    render(){
        return this.renderDiv()
    }
}
