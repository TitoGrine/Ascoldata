import React, { useEffect } from 'react';
import ReactGA from 'react-ga';
import HeaderBar from '../Common/HeaderBar';
import { Helmet } from 'react-helmet';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

function PrivacyPolicy() {
	const history = useHistory();

	useEffect(() => {
		ReactGA.pageview('/privacy_policy');
	});

	const redirectBack = () => {
		history.goBack();
	};

	return (
		<React.Fragment>
			<Helmet>
				<title>Privacy Policy - Ascoldata</title>
			</Helmet>
			<HeaderBar />
			<div id="corporum">
				<section className="content-section privacy-policy">
					<h2>Privacy Policy for Ascoldata</h2>
					<p>
						At Ascoldata, accessible from <a href="https://www.ascoldata.xyz">https://www.ascoldata.xyz</a>,
						one of our main priorities is the privacy of our visitors. This Privacy Policy document contains
						types of information that is collected and recorded by Ascoldata and how we use it.
					</p>
					<p>
						This Privacy Policy applies only to our online activities and is valid for visitors to our
						website with regards to the information that they shared and/or collect in Ascoldata. This
						policy is not applicable to any information collected offline or via channels other than this
						website.
					</p>
					<h3>Consent</h3>
					<p>By using our website, you hereby consent to our Privacy Policy and agree to its terms.</p>
					<h3>Information Collection and Use</h3>
					<p>
						Ascoldata relies on the Spotify API but is in no way affiliated with Spotify. In order to use
						our website you are asked to login using your Spotify account. This grants Ascoldata permission
						to:
						<ul>
							<li>Read profile and subscription details.</li>
							<li>Read your email address.</li>
							<li>Read your top artists and tracks.</li>
							<li>Read your public and private playlists.</li>
							<li>Read your followed artists.</li>
							<li>Read recently played tracks.</li>
							<li>Read your liked songs.</li>
							<li>Create private playlists.</li>
							<li>Add tracks to your playlists.</li>
							<li>Upload a custom playlist cover image.</li>
						</ul>
						This information is only used in order to show you statistics about you, your favourite tracks,
						albums, artists, playlists among other things. Although this is personally identifiable
						information, Ascoldata doesn't store it or share it with third parties and is only retained on
						your browser.
					</p>
					<p>
						Ascoldata uses Firebase and Google analytics to monitor and gather information on website
						traffic and crashes. None of the collected information can be used to identify the user. For
						more information about Google Analytics privacy policy see{' '}
						<a
							href="https://firebase.google.com/policies/analytics"
							target="_blank"
							rel="noopener noreferrer"
						>
							Google Analytics for Firebase
						</a>.
					</p>
					<h3>Log Files</h3>
					<p>
						Ascoldata follows a standard procedure of using log files. These files log visitors when they
						visit websites. All hosting companies do this and a part of hosting services' analytics. The
						information collected by log files include internet protocol (IP) addresses, browser type,
						Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the
						number of clicks. These are not linked to any information that is personally identifiable. The
						purpose of the information is for analyzing trends, administering the site, tracking users'
						movement on the website, and gathering demographic information.
					</p>
					<h3>Security</h3>
					<p>
						We value your trust in providing us your Personal Information, thus we are striving to use
						commercially acceptable means of protecting it. But remember that no method of transmission over
						the internet, or method of electronic storage is 100% secure and reliable, and I cannot
						guarantee its absolute security.
					</p>
					<h3>Links to Other Sites and Third Party Privacy Policies</h3>
					<p>
						This Service may contain links to other sites. If you click on a third-party link, you will be
						directed to that site. Note that these external sites are not operated by Ascoldata. Therefore,
						It's strongly advised that you review the Privacy Policy of these websites. Ascoldata has no
						control over and assumes no responsibility for the content, privacy policies, or practices of
						any third-party sites or services.
					</p>
					<h3>CCPA Privacy Rights (Do Not Sell My Personal Information)</h3>
					<p>Under the CCPA, among other rights, California consumers have the right to:</p>
					<p>
						Request that a business that collects a consumer's personal data disclose the categories and
						specific pieces of personal data that a business has collected about consumers.
					</p>
					<p>
						Request that a business delete any personal data about the consumer that a business has
						collected.
					</p>
					<p>
						Request that a business that sells a consumer's personal data, not sell the consumer's personal
						data.
					</p>
					<p>
						If you make a request, we have one month to respond to you. If you would like to exercise any of
						these rights, please contact us.
					</p>
					<h3>GDPR Data Protection Rights</h3>
					<p>
						We would like to make sure you are fully aware of all of your data protection rights. Every user
						is entitled to the following:
					</p>
					<p>
						The right to access – You have the right to request copies of your personal data. We may charge
						you a small fee for this service.
					</p>
					<p>
						The right to rectification – You have the right to request that we correct any information you
						believe is inaccurate. You also have the right to request that we complete the information you
						believe is incomplete.
					</p>
					<p>
						The right to erasure – You have the right to request that we erase your personal data, under
						certain conditions.
					</p>
					<p>
						The right to restrict processing – You have the right to request that we restrict the processing
						of your personal data, under certain conditions.
					</p>
					<p>
						The right to object to processing – You have the right to object to our processing of your
						personal data, under certain conditions.
					</p>
					<p>
						The right to data portability – You have the right to request that we transfer the data that we
						have collected to another organization, or directly to you, under certain conditions.
					</p>
					<p>
						If you make a request, we have one month to respond to you. If you would like to exercise any of
						these rights, please contact us.
					</p>
					<h3>Children's Information</h3>
					<p>
						Another part of our priority is adding protection for children while using the internet. We
						encourage parents and guardians to observe, participate in, and/or monitor and guide their
						online activity.
					</p>
					<p>
						Ascoldata does not knowingly collect any Personal Identifiable Information from children under
						the age of 13. If you think that your child provided this kind of information on our website, we
						strongly encourage you to contact us immediately and we will do our best efforts to promptly
						remove such information from our records.
					</p>
					<h3>Changes to This Privacy Policy</h3>
					<p>
						We may update our Privacy Policy from time to time. Thus, you are advised to review this page
						periodically for any changes. We will notify you of any changes by posting the new Privacy
						Policy on this page. This policy is effective as of 2020-09-01.
					</p>
					<Button
						className="go-back-button"
						size="lg"
						onClick={() => {
							redirectBack();
						}}
					>
						<strong>Go Back</strong>
					</Button>
				</section>
				<section className="sidebar-section slide-in-right sidebar-nothing" />
			</div>
		</React.Fragment>
	);
}

export default PrivacyPolicy;
