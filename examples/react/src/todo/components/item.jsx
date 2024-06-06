import { memo, useState, useCallback } from "react";
import classnames from "classnames";

import { Input } from "./input";

import { TOGGLE_ITEM, REMOVE_ITEM, UPDATE_ITEM } from "../constants";

export const Item = memo(function Item({ todo, dispatch, index }) {
	const [isWritable, setIsWritable] = useState(false);
	const { title, completed, id, createdAt, completedAt } = todo;

	const toggleItem = useCallback(
		() => dispatch({ type: TOGGLE_ITEM, payload: { id } }),
		[dispatch]
	);
	const removeItem = useCallback(
		() => dispatch({ type: REMOVE_ITEM, payload: { id } }),
		[dispatch]
	);
	const updateItem = useCallback(
		(id, title) => dispatch({ type: UPDATE_ITEM, payload: { id, title } }),
		[dispatch]
	);

	const handleDoubleClick = useCallback(() => {
		setIsWritable(true);
	}, []);

	const handleBlur = useCallback(() => {
		setIsWritable(false);
	}, []);

	const handleUpdate = useCallback(
		(title) => {
			if (title.length === 0) removeItem(id);
			else updateItem(id, title);

			setIsWritable(false);
		},
		[id, removeItem, updateItem]
	);

	return (
		<li
			className={classnames({ completed: todo.completed })}
			data-testid="todo-item"
		>
			<div className="view">
				{isWritable ? (
					<Input
						onSubmit={handleUpdate}
						label="Edit Todo Input"
						defaultValue={title}
						onBlur={handleBlur}
					/>
				) : (
					<>
						<div className="todo-content">
							<input
								className="toggle"
								type="checkbox"
								data-testid="todo-item-toggle"
								checked={completed}
								onChange={toggleItem}
							/>
							<label
								data-testid="todo-item-label"
								id={todo.id}
								onDoubleClick={handleDoubleClick}
							>
								{title}
							</label>
							<button
								className="destroy"
								data-testid="todo-item-button"
								onClick={removeItem}
							/>
						</div>
						<div className="time-stamp">{createdAt}</div>
						<div className="time-stamp">{completedAt}</div>
					</>
				)}
			</div>
		</li>
	);
});
