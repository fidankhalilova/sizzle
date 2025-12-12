import ContactHeroBanner from "../Sections/ContactUs/ContactBanner";
import Socials from "../Sections/ContactUs/Socials";
import SupportPage from "../Sections/ContactUs/SupportSection";

const ContactTemplate = () => {
  return (
    <div className="flex flex-col gap-10 mb-20">
      <ContactHeroBanner />
      <SupportPage />
      <Socials />
    </div>
  );
};

export default ContactTemplate;
