import { useMemo, useCallback, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { Item } from "./item";
import classnames from "classnames";

import { TOGGLE_ALL } from "../constants";

export function Main({ todos, dispatch }) {
	const { pathname: route } = useLocation();

	const [lastSelectedArray, setLastSelectedArray] = useState([]);

	/*change the styling/color coding of the 3 last selected todos dynamically
	as the last selected array list is updated*/

	useEffect(() => {
		for (let i = 1; i <= lastSelectedArray.length; i++) {
			let labelElement = document.getElementById(lastSelectedArray[i - 1]);
			labelElement &&
				((labelElement.style.animation = "none"),
				(labelElement.className = `last${i}`));
		}
	}, [lastSelectedArray]);

	const visibleTodos = useMemo(
		() =>
			todos.filter((todo) => {
				if (route === "/active") return !todo.completed;

				if (route === "/completed") return todo.completed;

				return todo;
			}),
		[todos, route]
	);

	/* ul todo list change handler that dynamically keeps track of 
	last selected todo items*/

	const todoListChangeHandler = (e) => {
		//access the currently ticked todo item's label
		let liElement = e.target.parentNode;
		let currentLabel = liElement.getElementsByTagName("label")[0];

		/*if todo item is ticked/completed, push the item to the 
		last selected array for styling updates*/
		if (e.target.checked) {
			setLastSelectedArray([currentLabel.id, ...lastSelectedArray]);

			/*at any given point, the idea is to only style/color code last 3 selected 
			todos and hence the array should be capped at 3 items and pop the existing 
			item to maintain the array length at 3 if a new item is to be pushed*/

			if (lastSelectedArray.length >= 2) {
				lastSelectedArray.pop();

				/*update the removed last selected todo's class 
				to the original completed*/

				document.getElementById(lastSelectedArray.pop()).className =
					"todo-list li.completed label";
			}
		} else {
			/*if todo item is unticked, remove the item from the 
		existing last selected array for styling updates*/
			setLastSelectedArray((existingValues) => {
				return existingValues.filter((id) => id !== currentLabel.id);
			});
			//update the unticked todo to the original styling
			currentLabel.className = "ul.todo-list li label";
			currentLabel.style.animation = "changeColor 15s ease-in both";
		}
	};

	const toggleAll = useCallback(
		(e) =>
			dispatch({ type: TOGGLE_ALL, payload: { completed: e.target.checked } }),
		[dispatch]
	);

	return (
		<main className="main" data-testid="main">
			{visibleTodos.length > 0 ? (
				<div className="toggle-all-container">
					<input
						className="toggle-all"
						type="checkbox"
						data-testid="toggle-all"
						checked={visibleTodos.every((todo) => todo.completed)}
						onChange={toggleAll}
					/>
					<label className="toggle-all-label" htmlFor="toggle-all">
						Toggle All Input
					</label>
				</div>
			) : null}
			<ul
				onChange={(e) => todoListChangeHandler(e)}
				className={classnames("todo-list")}
				data-testid="todo-list"
			>
				{visibleTodos.map((todo, index) => (
					<Item todo={todo} key={todo.id} dispatch={dispatch} index={index} />
				))}
			</ul>
		</main>
	);
}
