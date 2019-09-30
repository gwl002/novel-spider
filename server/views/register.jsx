const React = require('react');


class RegisterView extends React.Component {
    render () {

        return (
            <form action="/register" method="post" >
            	<div>
            		<label>Email:</label>
            		<input type="text" name="email" defaultValue=""/>
            	</div>
            	<div>
            		<label>Password:</label>
            		<input type="password" name="password" defaultValue="" />
            	</div>
            	<div>
            		<input type="submit" defaultValue="register" />
            	</div>
                <div style={{color:"red",fontSize:12}}>{this.props.message}</div>
            </form>
        );
    }
}


module.exports = RegisterView;