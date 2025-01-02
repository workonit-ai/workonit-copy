import { failureToaster, setSizeInMBs } from '@utils';
import { fileTypes, imageTypes, MAX_UPLOAD_SIZE_IN_MB } from '@constants';
import { UploadFileOnServer } from '../../services/Upload.Service';

const FileUploader = ({ onUploadFile, setIsLoading, isImage = true, isLoading, prevUploadedSize = 0 }) => {
	const onFileChange = async (e) => {
		const file = e.target.files[0];

		if (!isImage) {
			if (!fileTypes.includes(file?.type)) {
				e.target.value = null;
				return failureToaster("Only pdf, doc and docx files are allowed");
			}
		} else {
			if (!imageTypes.includes(file.type)) {
				e.target.value = null;
				return failureToaster("Only jpeg, jpg and png files are allowed");
			}
		}

		if (prevUploadedSize + setSizeInMBs(file.size) > MAX_UPLOAD_SIZE_IN_MB) {
			e.target.value = null;
			return failureToaster("Total upload size should not exceed 20mb");
		}

		try {
			setIsLoading(true);

			const uploadedFile = await UploadFileOnServer(file, isImage);

			onUploadFile({
				url: uploadedFile.url,
				name: file.name,
				size: setSizeInMBs(file.size),
			});
			setIsLoading(false);
		} catch (error) {
			failureToaster(error);
			setIsLoading(false);
		}
	};

	return (
		<>
			<div className="file-uploader">
				<input
					disabled={isLoading}
					onChange={(e) => {
						onFileChange(e);
						e.target.value = null;
					}}
					type="file"
				/>
			</div>
		</>
	);
};

export default FileUploader;
