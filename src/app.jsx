import React from "react";
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import store from "./store/store";
import { Main } from "./pages/main";

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
      		<Main />
		</Provider>
	</React.StrictMode>,
	document.getElementById('contentRoot')
);