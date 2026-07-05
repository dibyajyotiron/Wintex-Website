import { useMemo, useState } from "react";
import { ExternalLink, Mail, MapPin } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import {
  address,
  contactEmail,
  mapEmbedUrl,
  mapUrl,
  phoneNumbers,
  whatsappNumber,
} from "../../config/site";
import { branchLocations } from "../../data/siteContent";

export function ContactSection() {
  const [formState, setFormState] = useState({
    name: "",
    company: "",
    phone: "",
    requirement: "",
  });

  const message = useMemo(
    () =>
      [
        "Hello Wintex, I would like to discuss a weighing system requirement.",
        formState.name && `Name: ${formState.name}`,
        formState.company && `Company: ${formState.company}`,
        formState.phone && `Phone: ${formState.phone}`,
        formState.requirement && `Requirement: ${formState.requirement}`,
      ]
        .filter(Boolean)
        .join("\n"),
    [formState],
  );

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  const emailUrl = `mailto:${contactEmail}?subject=${encodeURIComponent(
    "Wintex weighing system enquiry",
  )}&body=${encodeURIComponent(message)}`;

  const handleFormSubmit = (event) => {
    event.preventDefault();
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const updateField = (field, value) => {
    setFormState((current) => ({ ...current, [field]: value }));
  };

  return (
    <section className="section-band contact reveal" id="contact">
      <div className="contact-copy">
        <span>Contact</span>
        <h2>Get the right weighing system specified.</h2>
        <p>
          Tell us what you need to weigh, where it will run, and the accuracy or
          capacity you need. We will continue the conversation on WhatsApp or
          phone.
        </p>
        <address>
          {address}
          <br />
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
          <br />
          <a href={phoneNumbers.officeHref}>{phoneNumbers.office}</a> /{" "}
          <a href={phoneNumbers.primaryHref}>{phoneNumbers.primary}</a>
        </address>
        <a className="map-link" href={mapUrl} target="_blank" rel="noreferrer">
          <MapPin size={18} />
          Open Pionear Scales Industries on Google Maps
          <ExternalLink size={16} />
        </a>
        <div
          className="embedded-map"
          aria-label="Map showing Pionear Scales Industries location"
        >
          <iframe
            title="Pionear Scales Industries map"
            src={mapEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="map-pin-card">
            <MapPin size={18} />
            <span>Pionear Scales Industries</span>
          </div>
        </div>
        <div className="branch-list" aria-label="Branch offices">
          {branchLocations.map((branch) => (
            <span key={branch}>{branch}</span>
          ))}
        </div>
      </div>

      <form className="quote-form" onSubmit={handleFormSubmit}>
        <label>
          Name
          <input
            value={formState.name}
            onChange={(event) => updateField("name", event.target.value)}
            type="text"
            name="name"
            autoComplete="name"
            required
          />
        </label>
        <label>
          Company
          <input
            value={formState.company}
            onChange={(event) => updateField("company", event.target.value)}
            type="text"
            name="company"
            autoComplete="organization"
          />
        </label>
        <label>
          Phone
          <input
            value={formState.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            type="tel"
            name="phone"
            autoComplete="tel"
            required
          />
        </label>
        <label>
          Requirement
          <textarea
            value={formState.requirement}
            onChange={(event) => updateField("requirement", event.target.value)}
            name="requirement"
            rows="4"
            placeholder="Example: 60 ton pitless weighbridge for factory dispatch"
            required
          />
        </label>
        <button type="submit" className="primary-action form-action">
          Send on WhatsApp
          <FaWhatsapp size={20} />
        </button>
        <a className="secondary-action form-email-action" href={emailUrl}>
          Send by email
          <Mail size={18} />
        </a>
      </form>
    </section>
  );
}

