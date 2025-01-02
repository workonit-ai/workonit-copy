import React, { Fragment } from 'react';
import { NO_IMAGE } from '@constants';

const Slider = ({ images, startingIndex, closeSlider }) => {
	const [current, setCurrent] = React.useState(startingIndex);

	return (
		<Fragment>
			<div className="slider-bg" onClick={closeSlider}></div>
			<div className="slider-view">
				<div className="view-img">
					<img src={images[current]?.url} alt={NO_IMAGE} />
				</div>
				<a href={images[current]?.url} rel="noreferrer" download target="_blank" className="downloader-btn">
					<span className="iconify" data-icon="material-symbols:download"></span>
				</a>
				{images[current]?.caption && images[current]?.caption.length > 0 && <div className="fs-14 fw-500 text-white text-center mt-4 caption-text">{images[current]?.caption}</div>}
			</div>

			<div
				className="slider-arrows next"
				onClick={() => {
					setCurrent((current + 1) % images.length);
				}}
			>
				<span className="iconify" data-icon="ooui:arrow-next-ltr"></span>
			</div>
			<div
				className="slider-arrows prev"
				onClick={() => {
					current === 0 ? setCurrent(images.length - 1) : setCurrent(current - 1);
				}}
			>
				<span className="iconify" data-icon="ooui:arrow-previous-ltr"></span>
			</div>
		</Fragment>
	);
};

export default Slider;
