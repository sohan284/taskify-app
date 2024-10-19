import { useEffect } from "react";
import ReactGA from "react-ga4";
import { useLocation } from "react-router-dom";

const GoogleAnalytics = ({ trackingId }) => {
  const location = useLocation();

  useEffect(() => {
    if (trackingId) {
      ReactGA.initialize(trackingId); // Initialize GA with the provided tracking ID
      ReactGA.send({ hitType: "pageview", page: location.pathname });
    }
  }, [trackingId, location]);

  return null; // This component doesn't render anything
};

export default GoogleAnalytics;
