import { useCallback } from "react";
import { Input } from "./input";

import { ADD_ITEM } from "../constants";

export function Header({ dispatch }) {
	const addItem = useCallback(
		(title) => dispatch({ type: ADD_ITEM, payload: { title } }),
		[dispatch]
	);

	return (
		<header className="header" data-testid="header">
			<h1>todos</h1>
			<div className="header-columns">
				<Input
					onSubmit={addItem}
					label="New Todo Input"
					placeholder="What needs to be done?"
				/>
				<div className="time-stamp">Created</div>
				<div className="time-stamp">Completed</div>
			</div>
		</header>
	);
}
