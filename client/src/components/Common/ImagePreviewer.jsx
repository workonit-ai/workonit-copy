const ImagePreviewer = ({ selectedImage, setSelectedImage }) => {
	return (
		<div>
			{!!selectedImage && (
				// <div className="chatOverlay ">
				// <div className="chatFullImg">
				<>
					<img src={selectedImage.url} alt="" height={100} />
					<a className="primary-text closechat" onClick={() => setSelectedImage(null)}>
						<iconify-icon icon="entypo:circle-with-cross"></iconify-icon>
					</a>
					<a href={selectedImage.url} download target="_blank" className="downloadChat primary-bg" rel="noreferrer">
						<span className="iconify" data-icon="material-symbols:download"></span>
					</a>
				</>
				// </div>
				// </div>
			)}
		</div>
	);
};

export default ImagePreviewer;
