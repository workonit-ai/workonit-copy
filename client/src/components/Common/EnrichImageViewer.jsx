import Viewer from 'react-viewer';
import { NO_IMAGE } from '@constants';

// Helping Link
// https://github.com/infeng/react-viewer

const EnrichImageViewer = ({ previewImages, previewVisible, setPreviewVisible, selectedImageIndex }) => {
	let tempImages = [];

	if (previewImages?.length > 0) {
		previewImages.forEach((ele) => {
			tempImages.push({ src: ele?.url, alt: NO_IMAGE });
		});
	}

	return (
		<div>
			<Viewer
				visible={previewVisible}
				onClose={() => {
					setPreviewVisible(false);
				}}
				downloadable={true}
				noImgDetails={false}
				images={tempImages}
				activeIndex={selectedImageIndex}
			/>
		</div>
	);
};

export default EnrichImageViewer;
