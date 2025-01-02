import { useNavigate } from 'react-router-dom';

const NotFound = () => {
	const navigate = useNavigate();
	return (
		<div className="container text-center justify-content-center">
			<div className="row">
				<div className="col-md-5">
					<div className={`notFound`}>
						<img loading="lazy" src="/assets/images/404.webp" width="100%" alt="" />
					</div>
				</div>
				<div className="col-md-5">
					<div className={`headingNot`}>404</div>
					<div className={`mt-4 textFont`}>
						<p>
							Ooops! <br /> Page Not Found
						</p>
						<p>This page doesn't exist or was removed! We suggest you back to home.</p>
					</div>
					<div className={`buttonHome`}>
						<button onClick={() => navigate(-1)} className="btn btnPrimary">
							Go Back!
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NotFound;
