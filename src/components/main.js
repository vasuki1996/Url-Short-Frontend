import React from 'react';

class MainArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = { short_url: "https://google.com", _buildUrl: null };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        console.log(event.target.value);
        this.setState({ short_url: event.target.value });
    }

    handleSubmit(event) {
        //alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
        fetch("https://radiant-spire-23461.herokuapp.com/shorten", {
            method: "POST",
            body: JSON.stringify({
                url: this.state.short_url.trim()
            })
        }).then(res => res.json())
            .then(data => {
                console.log(data);
                var _buildUrl = window.location.origin + '/' + data.hash;
                this.setState({ _buildUrl: _buildUrl });
                document.getElementById("final").innerHTML = `<a href="${this.state._buildUrl}">${this.state._buildUrl}</a>`;
                console.log("States ", this.state);
            })
}

render(){
    return (
        <div class="container mt-5">
            <form id="form_shorten" role="form" onSubmit={this.handleSubmit}>
                <div class="input-group">
                    <input value={this.state.short_url} onChange={this.handleChange} type="url" class="form-control text-url" placeholder="Enter a URL to shorten..." />
                    <span class="input-group-btn">
                        <button type="submit" class="btn btn-success btn-shorten">Shorten</button>
                    </span>
                </div>
            </form>
            <div id="shorten_area">Shortened URL: <span id="final" class="shortened-url">{this.state._buildUrl}</span></div>
        </div>);
}
}


// const Main = () => {

// }

export default MainArea;