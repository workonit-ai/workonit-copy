
import { useState, useRef, useEffect } from 'react';

const isCloseToBottom = (e) => {
  const target = e.target;
  const paddingToBottom = 20;
  return target.scrollHeight - target.scrollTop <= target.clientHeight + paddingToBottom;
};

const TermsAndConditions = () => {
  const [accepted, setAccepted] = useState(false);
  const containerRef = useRef(null);

  const handleScroll = (e) => {
    if (isCloseToBottom(e)) {
      setAccepted(true);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container && container.scrollHeight <= container.clientHeight) {
      setAccepted(true);
    }
  }, []);

  return (
    <div style={styles.container}>
      <div
        style={styles.tcContainer}
        onScroll={handleScroll}
        ref={containerRef}
      >
        <div style={styles.toc}>
          <h1>Terms and conditions</h1>
          <div id="intro" style={styles.tcSection}>
          <p>These Terms of Service, which we'll refer to simply as the "Terms," set out the rules by which you may use our Services. The Terms explain how our Services work and provide you with a list the "dos and don'ts" when using them. These Terms are more than just rules, though – they form a legally binding contract between us and you that you accept when clicking on the box marked "I agree". Please read through this document carefully and make sure these Terms are acceptable to you. If you don't agree to any of these Terms, do not click "I agree" and do not continue using the Services. If you have any questions, please don't hesitate to contact us at <a href="mailto:team@workonit.ai">team@workonit.ai</a>.</p>
          <h2>Table of Contents</h2>
        </div>
          <ul>
            <li><a href="#section1">1. The Basics</a></li>
            <li><a href="#section2">2. Our Services</a></li>
            <li><a href="#section3">3. User Accounts</a></li>
            <li><a href="#section4">4. Fees and Payment</a></li>
            <li><a href="#section5">5. Use Restrictions</a></li>
            <li><a href="#section6">6. Representations</a></li>
            <li><a href="#section7">7. Intellectual Property</a></li>
            <li><a href="#section8">8. Content and User Content</a></li>
            <li><a href="#section9">9. Copyright – DMCA</a></li>
            <li><a href="#section10">10. Indemnification</a></li>
            <li><a href="#section11">11. Disclaimers</a></li>
            <li><a href="#section12">12. Limitation of Liability</a></li>
            <li><a href="#section13">13. Term and Account Termination</a></li>
            <li><a href="#section14">14. Force Majeure</a></li>
            <li><a href="#section15">15. Notices</a></li>
            <li><a href="#section16">16. General</a></li>
          </ul>
        </div>
        <div id="section1" style={styles.tcSection}>
            <h2>1. The Basics</h2>
            <h3>1.1. Fees and Payment</h3>
            <p>In consideration of using our Services, you agree to pay Workonit the fees specified in accordance with the plan for which you have registered (“Plan”). Except as expressly provided in these Terms or the Plan, fees, including prepaid fees, are non-refundable. Where applicable, taxes, including VAT, may also be charged. If payments are subject to tax withholding, the amount to be withheld will be added to the fees charged.</p>

            <h3>1.2. Third-Party Payment Processor</h3>
            <p>If you are directed to a third-party payment processor, you may be subject to terms and conditions governing the use of that service. Please review the payment processor's terms and conditions and privacy notice before using such services.</p>

            <h3>1.3. Free Services for Workers</h3>
            <p>Notwithstanding the foregoing, if you are using the Services as a Worker, the Services are currently provided free of charge. Workonit may decide to charge a fee for such Services at any time in the future, at its discretion, by providing you with 15 days’ prior written notice.</p>

            <h3>1.4. Free Services for Non-Profit Entities</h3>
            <p>Notwithstanding the foregoing, if you represent and warrant that you are a Business that is a non-profit entity using the Services solely for seeking voluntary non-paying Works, you may use the Services free of charge; provided however that (i) you will provide and agree that Workonit may seek any evidence reasonably necessary to verify such voluntary aspect of your use of the Services, and (ii) Workonit may decide to charge a fee for such Services at any time in the future, at its discretion, by providing you with 15 days’ prior written notice.</p>
            </div>

        <div id="section2" style={styles.tcSection}>
            <h2>2. Our Services</h2>
            <p>Subject to these Terms, Workonit allows you to use the Services on a non-exclusive basis for your own personal and/or internal business purposes, as applicable.</p>

            <h3>2.1. Key Terms</h3>
            <h4>2.1.1. Workonit</h4>
            <p>We are Work On It Ltd., and we'll refer to ourselves as "Workonit," "us," "our," or "we." Our offices are located at HaNarkisim 52, Ramat Gan 5259729, and our registration number is 515862779.</p>

            <h4>2.1.2. You</h4>
            <p>When we use the term "you," we mean anyone using our Services. If you are registering for the Services on behalf of a company or organization, the term "you" is also meant to refer to that company or organization, where it makes sense from the context. When we mean to refer only to your company, we'll use the term "Customer."</p>

            <h4>2.1.3. Platform</h4>
            <p>When we refer to our "Platform," we mean our web/mobile application and our social-media-based service (for example on Facebook or LinkedIn) that facilitates engagement between users who are interested in offering themselves or applying for certain work or projects ("Workers" and "Work", respectively) and individuals or entities looking to engage with Workers ("Businesses"). When we refer to our "Services," we mean any services available on the Platform. Our services operate by scanning textual input, including User Content (as defined below), using large language models, including third-party AI-powered services, to generate and propose potential matches between Workers and Businesses. By using the Services, you allow Workonit to read and write posts on your behalf in each social media platform separately, in the designated group or page.</p>

            <h4>2.1.4. Disclaimer</h4>
            <p>WITHOUT DEROGATING FROM THE PROVISIONS OF SECTION 11 BELOW, BY USING THE PLATFORM AND SERVICES, YOU ACKNOWLEDGE THAT WORKONIT DOES NOT PROVIDE OWN, RENT, LEASE, SELL, RESELL, FURNISH, MANAGE, ENDORSE, PROMOTE OR CONTROL ANY WORK, WORKER OR BUSINESS AVAILABLE ON THE PLATFORM AND/OR THROUGH THE SERVICES. WORKONIT IS NOT AND SHALL NOT BE RESPONSIBLE FOR THE TERMS OR QUALITY OR PROVISION OF THE FOREGOING OR THE CONDUCT OR BEHAVIOR OF ANY PERSON OR ENTITY, INCLUDING ANY WORKER OR BUSINESS, ON OR OFF THE PLATFORM AND/OR SERVICES. WORKONIT DOES NOT VERIFY THE AUTHENTICITY AND/OR TRUSTWORTHINESS OF ANY WORKER, WORK OFFER OR BUSINESS. WORKONIT IS NOT RESPONSIBLE FOR ANY DAMAGE CAUSED IN THE CONTEXT OF PROVISION AND/OR EXECUTION OF WORK. WORKONIT IS NOT A PARTY TO ANY ENGAGEMENT UNDER WHICH WORK IS CONDUCTED. IT IS HEREBY CLARIFIED THAT WORK MAY BE CONDUCTED WITH OR WITHOUT COMPENSATION, AS AGREED UPON BETWEEN THE WORKER AND THE BUSINESS.</p>

            <h3>2.2. Privacy</h3>
            <p>When you use our Services, we collect Personal Data (as defined in the Privacy Notice) about you. Check out our Privacy Notice at <a href="https://workonit.ai/privacy" target="_blank" rel="noopener noreferrer">https://workonit.ai/privacy</a> for details about the types of Personal Data we collect, what we do with it, the security measures we use to keep it safe, and the rights you have regarding your Personal Data.</p>

            <h3>2.3. Changes to these Terms</h3>
            <p>We may update these Terms from time to time and will post the updated version on this page with the date it was published. Please check this page occasionally to make sure you’re aware of the Terms that apply to you. We will notify you if we make any material changes before the updated Terms take effect. If you continue to use our Services after we update the Terms, that means that you agree to and accept the updated version.</p>
            </div>

        <div id="section3" style={styles.tcSection}>
            <h2>3. User Accounts</h2>
            <p>In order to use the Services, you will need to create an account. You can also register by logging in through your Facebook, LinkedIn, or other third-party account, as may be available from time to time at our discretion (“Social Media Account”). You may only do so if the Social Media Account is yours and you have the right to use that account with our Services. By using our Services as integrated with a Social Media Account, you acknowledge and agree that your use of such social media is subject to the terms and conditions set forth by the applicable third-party service provider.</p>

            <h3>3.1. Account Refusal</h3>
            <p>Subject to applicable law, Workonit may refuse to open an account for any individual or entity at its sole discretion.</p>

            <h3>3.2. Unauthorized Use</h3>
            <p>You agree to notify us immediately of any unauthorized use of your account. You are solely responsible for all activity on your account, even if that activity was not actually performed by you. To the fullest extent permitted by applicable law, Workonit will not be responsible for any losses or damage arising from unauthorized use of your account. While we reserve the right to investigate suspected violations of these Terms or illegal and inappropriate behavior through the Services, we cannot guarantee that we will learn of or prevent any inappropriate use of the Services.</p>
        </div>

        <div id="section4" style={styles.tcSection}>
            <h2>4. Fees and Payment</h2>
            <p>In consideration of using our Services, you agree to pay Workonit the fees specified in accordance with the plan for which you have registered (“Plan”). Except as expressly provided in these Terms or the Plan, fees, including prepaid fees, are non-refundable. Where applicable, taxes, including VAT, may also be charged. If payments are subject to tax withholding, the amount to be withheld will be added to the fees charged.</p>

            <h3>4.1. Third-Party Payment Processor</h3>
            <p>If you are directed to a third-party payment processor, you may be subject to terms and conditions governing the use of that service. Please review the payment processor's terms and conditions and privacy notice before using such services.</p>

            <h3>4.2. Free Services for Workers</h3>
            <p>Notwithstanding the foregoing, if you are using the Services as a Worker, the Services are currently provided free of charge. Workonit may decide to charge a fee for such Services at any time in the future, at its discretion, by providing you with 15 days’ prior written notice.</p>

            <h3>4.3. Free Services for Non-Profit Entities</h3>
            <p>Notwithstanding the foregoing, if you represent and warrant that you are a Business that is a non-profit entity using the Services solely for seeking voluntary non-paying Works, you may use the Services free of charge; provided however that (i) you will provide and agree that Workonit may seek any evidence reasonably necessary to verify such voluntary aspect of your use of the Services, and (ii) Workonit may decide to charge a fee for such Services at any time in the future, at its discretion, by providing you with 15 days’ prior written notice.</p>
        </div>

        <div id="section5" style={styles.tcSection}>
            <h2>5. Use Restrictions</h2>
            <p>You may not do or attempt to do or allow a third party to do any of the following:</p>
            <ul style={styles.tcUL}>
                <li style={styles.tcL}>Decipher, decompile, disassemble, or reverse-engineer any of the code or software used to provide the Services, including framing or mirroring the Services;</li>
                <li style={styles.tcL}>Copy, modify, or distribute the Services in any manner not permitted by these Terms;</li>
                <li style={styles.tcL}>Circumvent or interfere with security-related features of the Services or features that restrict unauthorized use of or access to any Content (as defined below);</li>
                <li style={styles.tcL}>Use any robot, spider, site search or retrieval application, or any other process to retrieve, index, and/or data-mine the Content or circumvent the navigational structure of the Services in any other way;</li>
                <li style={styles.tcL}>Use another's account without permission;</li>
                <li style={styles.tcL}>Remove, alter, or conceal any copyright, trademark, service mark or other such notices incorporated in the Services;</li>
                <li style={styles.tcL}>Use the Services in any manner not permitted by applicable law, including all applicable export laws and regulations to (re)export the Services and/or any related materials in violation of such laws or use in countries subject to sanctions under applicable law.</li>
            </ul>
            <p>You may not use our Services if doing so is unlawful. We will cooperate with any law enforcement authorities or court orders requesting that we disclose the identity, behavior, or User Content (as defined below) of anyone believed to have violated these Terms or to have engaged in illegal behavior in connection with the Services.</p>
        </div>

        <div id="section6" style={styles.tcSection}>
            <h2>6. Representations</h2>
            <h3>6.1. Our Representations</h3>
            <p>We represent that Workonit is organized under applicable law, has the ability to enter into and perform its obligations under these Terms, and doing so does not conflict with any of our commitments to any third party nor with any applicable legal obligation. We will use commercially reasonable efforts to provide our Services faithfully, diligently, and in accordance with the standard practices in our industry.</p>

            <h3>6.2. Your Representations</h3>
            <p>By accepting these Terms, you represent that:</p>
            <ul style={styles.tcUL}>
                <li style={styles.tcL}>You are at least 18 years old, or otherwise have your parent’s or legal guardian’s consent to enter into these Terms, and have the ability to form a binding contract;</li>
                <li style={styles.tcL}>Your use of the Services will not violate any applicable law or any obligation you have to a third party;</li>
                <li style={styles.tcL}>All the registration information you submit is and will remain truthful and accurate;</li>
                <li style={styles.tcL}>You have all necessary rights, consents, and licenses needed to provide any User Content (defined below) that you provide; and the User Content is compliant with applicable law and does not infringe on the intellectual property, privacy, publicity, moral, or any other rights of any third party;</li>
                <li style={styles.tcL}>Our use of your User Content as allowed under these Terms will not cause us to infringe on the rights of any third party.</li>
            </ul>
            <p>You also undertake that you will use the Services in compliance with applicable law at all times, including all applicable export laws to ensure that neither the Services nor any related materials are unlawfully exported. If you are registering on behalf of a Customer, you further represent that you are authorized to bind the Customer to these Terms. You also represent that the Customer is duly organized under applicable law, it has the authority to enter into these Terms, and that by doing so and using the Service, it will not be in conflict with any obligations it has to any third party or any legal requirement.</p>
            <h4>6.2.1 Your Data</h4>
            <p>If you provide us with any Personal Data you represent that: (i) you have provided all necessary notices and have, and will maintain all necessary rights and legal bases required under applicable law to provide Workonit with the Personal Data of such individuals in order to allow Workonit to process and share such data in order to provide the Services and for Workonit's internal business purposes, including the improvement of our Services, all as detailed in Workonit's Privacy Notice, and (ii) you will maintain a record of such legal bases, as required under applicable law; and (iii) you will not provide Workonit with any sensitive or other categories of data that are subject to additional protections under law, such as data regarding children, finance, and health. </p>
            <h4>6.2.1 If You Are a Minor</h4>
            <p>If you are a minor in your jurisdiction, you must have your parent’s or legal guardian's permission to create an account. Please have your parent or legal guardian read these Terms with you and consent to them before proceeding. Parents and legal guardians: by granting your child permission to enter into these Terms, you agree to these Terms on behalf of your child; you are responsible for monitoring and supervising your child's usage of the Service; if your child does not have your permission to use the Services, please contact us immediately so that we can disable his or her access. </p>
        </div>

        <div id="section7" style={styles.tcSection}>
            <h2>7. Intellectual Property</h2>
            <h3>7.1. Our Property</h3>
            <p>We retain all worldwide intellectual property rights, title, and interest in our Platform, our Services, including its overall appearance and any text, graphics, designs, videos, interfaces, and underlying source files of the Services, any Content we provide, and our name, trademarks, and logos. In some cases we have gotten the right to use certain elements from others as part of our Services and in that case, those elements are owned by their respective owner/s. Even though we're allowing you to use our Services, that doesn't mean that we're transferring ownership or any other rights to you or that we're allowing you to use our name, any trademarks, logos, or similar property as your own.</p>

            <h3>7.2. Your Property</h3>
            <p>When you provide User Content through the Services, that content remains yours. By providing User Content, you do allow us to use it in connection with the Services, including copying, modifying, and preparing derivative works of it where necessary in order to provide the Services, as well as for analytics purposes and for improvement of our Services and for developing new services. If you provide us with any feedback regarding our Services, you agree that we may use it and share it freely.</p>
        </div>

        <div id="section8" style={styles.tcSection}>
            <h2>8. Content and User Content</h2>
            <h3>8.1. Definitions</h3>
            <p>We may provide certain materials, such as images, articles, posts, videos, and reports, including information about Works, Businesses or Workers, through the Services and may also allow you and other users to provide certain types of material, such as images, photos, pictures, videos, reports, recommendations, reviews, comments, and feedback. "User Content" means materials you provide and "Content" means any content available through the Services, including User Content that may be provided by other users.</p>

            <h3>8.2. User Content Restrictions</h3>
            <p>You are fully and solely responsible for any User Content that you provide. You may not provide any User Content or act in any way that:</p>
            <ul style={styles.tcUL}>
                <li style={styles.tcL}>violates the legal rights of others, including defaming, abuse, stalking or threatening others;</li>
                <li style={styles.tcL}>infringes (or results in the infringement of) the intellectual property, moral, publicity, privacy, or other rights of any third party;</li>
                <li style={styles.tcL}>is (or you reasonably believe or should reasonably believe to be) in furtherance of any illegal, counterfeiting, fraudulent, pirating, unauthorized, or violent activity, or that involves (or you reasonably believe or should reasonably believe to involve) any stolen, illegal, counterfeit, fraudulent, pirated, or unauthorized material;</li>
                <li style={styles.tcL}>does not comply with any applicable laws, rules, or regulations;</li>
                <li style={styles.tcL}>restricts or inhibits use of the Services;</li>
                <li style={styles.tcL}>posts, stores, transmits, offers, or solicits anything that contains the following, or that you know or should know contains links to the following or to locations that in turn contain links to the following:</li>
                <ul style={styles.tcUL}>
                <li style={styles.tcL}>material that we determine to be offensive (including material promoting or glorifying hate, violence, bigotry, or any entity (past or present) principally dedicated to such causes or items associated with such causes),</li>
                <li style={styles.tcL}>material that is racially or ethnically insensitive, defamatory, harassing or threatening,</li>
                <li style={styles.tcL}>pornography or obscene material,</li>
                <li style={styles.tcL}>any virus, worm, trojan horse, or other harmful or disruptive component; or</li>
                <li style={styles.tcL}>anything that encourages conduct that would be considered a criminal offense, give rise to civil liability, violate any law or regulation or is otherwise inappropriate or offensive.</li>
                </ul>
            </ul>
        </div>

        <div id="section9" style={styles.tcSection}>
            <h2>9. Copyright – DMCA</h2>
            <p>You may not post User Content that violates another's intellectual property rights. As the provider of your User Content, you are responsible for ensuring, to the best of your ability, that the User Content is non-infringing. If we are notified that certain User Content violates intellectual property rights, we may remove that User Content at any time and at our sole discretion, without notifying you, in accordance with the Digital Millennium Copyright Act of 1998 ("DMCA"). We reserve the right to take any additional measures we deem appropriate, including suspending and/or terminating your accounts. If you believe that something appearing on the Services infringes your or another's intellectual property rights, please notify us at <a href="mailto:team@workonit.ai">team@workonit.ai</a>. If you believe that a notice has been wrongly filed against you, you may send us a counter-notice to the address above. Please note that notices and counter-notices must meet the DMCA's requirements and that there can be substantial penalties for false claims under the DMCA. We suggest consulting with your legal advisor before filing a notice or counter-notice.</p>
        </div>

        <div id="section10" style={styles.tcSection}>
            <h2>10. Indemnification</h2>
            <p>You agree to indemnify, defend, and hold harmless Workonit, its affiliates, and its/their respective directors, officers, employees, subcontractors, and agents from and against any claim, damage, or loss, including reasonable court costs, attorneys' fees, and any fines that may be incurred, that arise directly or indirectly from your:</p>
            <ul style={styles.tcUL}>
                <li style={styles.tcL}>breach of these Terms, including any of your representations or warranties, whether by you or by anyone using your account or device, and whether or not that use was authorized by you;</li>
                <li style={styles.tcL}>use or misuse of the Services;</li>
                <li style={styles.tcL}>violation of any law or regulation, including breach of applicable data protection laws; and</li>
                <li style={styles.tcL}>infringement of any right of any third party.</li>
            </ul>
        </div>

        <div id="section11" style={styles.tcSection}>
            <h2>11. Disclaimers</h2>
            <h3>11.1. General Disclaimers</h3>
            <p>OTHER THAN THE WARRANTIES MADE EXPLICITLY IN THESE TERMS, WE DO NOT MAKE ANY ADDITIONAL WARRANTIES (IMPLIED, STATUTORY, OR OTHERWISE) ABOUT THE PLATFORM, SERVICES (INCLUDING ANY MATCHES PROPOSED BETWEEN WORKERS AND BUSINESSES) OR ANY CONTENT, INCLUDING WITHOUT LIMITATION THAT THE SERVICES WILL BE OF GOOD QUALITY, USEFUL FOR YOUR OR CUSTOMER'S, AS APPLICABLE, SPECIFIC NEEDS OR ANY PARTICULAR PURPOSE, ACCURATE, ERROR-FREE (OR THAT ERRORS WILL BE CORRECTED), RELIABLE, SECURE, COMPLETE, NON-INFRINGING, OR THAT THE SERVICES WILL BE PROVIDED IN A TIMELY MANNER. THE SERVICES ARE PROVIDED ON AN "AS-IS" AND "AS AVAILABLE" BASIS.</p>

            <h3>11.2. Third-Party Services</h3>
            <p>We cannot control the functionality of services provided by third parties and assume no responsibility for any telephone or network line failure or interruption, or traffic congestion on the Internet or on the Services themselves. We cannot control the actions of bad actors and do not guarantee that we will successfully prevent unauthorized access to or alteration of the Services.</p>

            <h3>11.3. Users</h3>
            <p>We cannot anticipate or control the actions or inactions of anyone else, including our clients, users, or unauthorized users. Therefore, we disclaim all liability, regardless of the form of action, for the acts or omissions of any and all users (including unauthorized users), that are not solely due to our gross negligence or willful misconduct.</p>

            <h3>11.4. User Content</h3>
            <p>User Content comes from sources outside of our control, we take no responsibility for the accuracy, usefulness, safety, appropriateness, or non-infringement of any User Content; your use of any User Content is at your own risk. We do not endorse any opinions or recommendations expressed in any User Content. We have no obligation to display or maintain any User Content and may remove it without notice to you and for any reason. If you make User Content available through the Services, it may be possible for others to obtain Personal Data about you (such as your contact details, location, or the entity you represent). We have no control over the use of this data by others and are not responsible for the use of any Personal Data that you disclose through the Services by any third party.</p>

            <h3>11.5. Data Retention</h3>
            <p>We are not a data retention service. It is your sole responsibility to back up any data you provide to us. If data you provide to us is lost or corrupted for any reason, we shall not be responsible for any damage or loss you experience if you are unable to recover that data.</p>

            <h3>11.6. Third-Party Content</h3>
            <p>Our Platform may provide you with links to third-party sites/services. We make no promises regarding and are not liable for the content, goods, or services provided by such third parties, including any payments submitted through such links. We also cannot make any promises about and are not liable for another party's data protection policies. When you click on any of these links, you do so at your own risk. We urge you to exercise caution when using third-party services.</p>

            <h3>11.7. Risks</h3>
            <p>In light of the above, you understand that using the Services entails some degree of risk. When you choose to use the Services, you do so at your sole discretion and risk. Some jurisdictions do not allow the exclusion of certain warranties and therefore some of the above exclusions may not apply to you. Check your local laws for any restrictions regarding the exclusion of implied warranties.</p>
        </div>

        <div id="section12" style={styles.tcSection}>
            <h2>12. Limitation of Liability</h2>
            <h3>12.1. General Limitation</h3>
            <p>TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, WORKONIT (AND ITS AFFILIATES OR ANY OF THEIR RESPECTIVE OFFICERS, EMPLOYEES, OR SUBCONTRACTORS) SHALL NOT BE RESPONSIBLE TO YOU OR ANY THIRD PARTY FOR ANY DAMAGE OR LOSS THAT IS NOT A DIRECT RESULT OF YOUR USE OF THE SERVICES. THIS INCLUDES ANY INDIRECT, INCIDENTAL, SPECIAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES, WHETHER OR NOT SUCH DAMAGES ARE FORESEEABLE AND WHETHER OR NOT WORKONIT HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>

            <h3>12.2. Maximum Liability</h3>
            <p>OUR MAXIMUM AND AGGREGATE LIABILITY UNDER THESE TERMS AND UNDER ANY CAUSE OF ACTION WILL NOT EXCEED THE HIGHER OF: (A) A CUMULATIVE AMOUNT OF USD $50, OR (B) THE AMOUNT YOU HAVE PAID US IN THE THREE MONTHS PRECEDING THE DATE ON WHICH THE APPLICABLE CLAIM OR CAUSE OF ACTION AROSE, IF APPLICABLE.</p>
        </div>

        <div id="section13" style={styles.tcSection}>
            <h2>13. Term and Account Termination</h2>
            <h3>13.1. Term</h3>
            <p>These Terms will take effect when you accept them and shall continue in full force and effect until they are terminated in one of the ways described below.</p>

            <h3>13.2. How to Terminate Your Account</h3>
            <p>You may request to terminate your account at any time by sending an email to <a href="mailto:team@workonit.ai">team@workonit.ai</a>. We will process your request promptly after receiving your notice. Notwithstanding the foregoing, termination of these Terms and your engagement with us, will be subject to the terms of the Plan for which you have subscribed.</p>

            <h3>13.3. Termination by Workonit</h3>
            <p>We reserve the right to suspend or terminate your account (and, by association, these Terms) at any time and for any reason by providing three days' prior notice. We also have the right to suspend or terminate your account (and, by association, these Terms) immediately if: (i) you violate the letter or spirit of these Terms; or (ii) you engage in fraudulent, abusive, or illegal behavior or harass or harm other users, third parties, or our business interests. If your account is terminated, you may not rejoin by opening a new account without our permission.</p>

            <h3>13.4. Post-Termination Obligations</h3>
            <p>Even if your account is terminated, you will still be bound by the sections of these Terms which, by their nature, are meant to survive termination.</p>
        </div>

        <div id="section14" style={styles.tcSection}>
            <h2>14. Force Majeure</h2>
            <p>Neither party will be liable for any default or delay in its performance of its obligations under this Agreement to the extent caused by a natural disaster, act of God, act of war or terrorism, riot, third-party labor strike, pandemic, or other similar occurrence beyond its reasonable control, provided that the affected party makes all reasonable efforts to comply with its obligations despite the occurrence. The affected party shall, as soon as reasonably practicable, notify the other party of the occurrence. It is clarified that payment obligations hereunder may be delayed due to a force majeure event but will not be excused.</p>
        </div>

        <div id="section15" style={styles.tcSection}>
            <h2>15. Notices</h2>
            <p>To provide an official notice in accordance with these Terms, either we or you may send a notice by courier, registered mail, or by email to the addresses we provide each other. Either party may assume its notice has been received one after: (1) business day following delivery by courier, four (4) business days following delivery by registered mail, and one (1) business day after email transmission.</p>
        </div>

        <div id="section16" style={styles.tcSection}>
            <h2>16. General </h2>
            <p>These Terms constitute the entire agreement between us and you regarding our Services, and any and all other agreements existing between us regarding the Services are hereby terminated. We may assign our rights and obligations in these Terms to any third party. You may not assign any of your rights or obligations in these Terms to anyone else and any attempt to do so will be void. If either party waives any rights regarding any breach or default of these Terms, that waiver shall not be deemed to waive any other breach or default. The courts in the State of Israel shall have exclusive jurisdiction over any disputes regarding these Terms. The laws of the State of Israel shall govern these Terms without regard to the United Nations Convention on the International Sales of Goods. In the event that a court rules that a provision of these Terms is unenforceable, that provision shall be replaced with an enforceable provision which most closely achieves the effect of the original and the remaining terms of these Terms shall remain in full force and effect. Nothing in these Terms creates any agency, employment, joint venture, or partnership relationship between us and you, and nothing in these Terms enables you to act on our behalf.</p>
        </div>



      </div>
      <button
        disabled={!accepted}
        onClick={() => alert("Terms and conditions accepted")}
        style={accepted ? styles.button : styles.buttonDisabled}
      >
        Accept
      </button>
    </div>
  );
}

const styles = {
  container: {
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  title: {
    fontSize: 22,
    alignSelf: 'center',
  },
  toc: {
    marginBottom: 20,
  },
  tcSection: {
    marginBottom: 20,
  },
  tcP: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 12,
  },
  tcUL: {
    marginLeft: 10,
    listStyleType: 'none',
  },
  tcL: {
    marginTop: 10,
    fontSize: 12,
  },
  tcContainer: {
    marginTop: 15,
    marginBottom: 15,
    height: '70vh',
    overflowY: 'scroll',
    border: '1px solid #ccc',
    padding: '10px',
  },
  button: {
    backgroundColor: '#136AC7',
    borderRadius: 5,
    padding: 10,
    color: '#FFF',
    cursor: 'pointer',
  },
  buttonDisabled: {
    backgroundColor: '#999',
    borderRadius: 5,
    padding: 10,
    color: '#FFF',
    cursor: 'not-allowed',
  },
};

export default TermsAndConditions;
