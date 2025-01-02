import { Fragment, useState } from 'react';
import { TEXT_CHARACTER_LIMIT } from '@constants';
import { isDataExists } from '@utils';

const TextLessMore = ({ text }) => {
	const [showFullText, setShowFullText] = useState(false);

	const toggleFullText = () => setShowFullText(!showFullText);

	return (
		<Fragment>
			{isDataExists(text) && text.length <= TEXT_CHARACTER_LIMIT && <span>{text}</span>}
			{isDataExists(text) && text.length > TEXT_CHARACTER_LIMIT && (
				<Fragment>
					<div className="mb-2">
						{text.slice(0, TEXT_CHARACTER_LIMIT)}
						{showFullText && <span>{text.slice(TEXT_CHARACTER_LIMIT, text.length)}</span>}
						{!showFullText && "..."}
					</div>
					<a className="fs-md-18 default-text fw-600 pointer" onClick={toggleFullText}>
						{showFullText && "Show less"}
						{!showFullText && "Read More"}
					</a>
				</Fragment>
			)}
		</Fragment>
	);
};

export default TextLessMore;
