import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class NotFound extends Component {
    render() {
        return (
            <div style={{ fontFamily: 'Gotham Bold' }}>
                <h1>Page Not Found</h1>
                <p>No match for {this.props.location.pathname}</p>
            </div>
        )
    }
}
export default withRouter(NotFound);