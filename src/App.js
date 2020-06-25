import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom'
import Home from './pages/Home2'

class App extends Component {
	render() {
		return(
			<div>

				<BrowserRouter>
					<div>
						<Route exact={true} path="/" component={Home} />
					</div>
				</BrowserRouter>

			</div>
		)
	}
}

export default App;