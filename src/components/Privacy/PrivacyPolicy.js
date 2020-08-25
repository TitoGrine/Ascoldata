import React from 'react';
import HeaderBar from '../Common/HeaderBar';

function PrivacyPolicy() {
	return (
		<React.Fragment>
			<HeaderBar />
			<div id="corporum">
				<section className="content-section">
					<div
						className="col d-flex flex-column align-items-center justify-content-center"
						style={{ height: '100%' }}
					>
						Privacy Policy page.
					</div>
				</section>
				<section className="sidebar-section slide-in-right sidebar-nothing" />
			</div>
		</React.Fragment>
	);
}

export default PrivacyPolicy;
