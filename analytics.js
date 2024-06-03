// src/analytics.js
import ReactGA from 'react-ga';

const TRACKING_ID = "G-TB1KEYVPFN"; // Replace with your Google Analytics tracking ID
ReactGA.initialize(TRACKING_ID);

export const logEvent = (category = "", action = "") => {
  if (category && action) {
    ReactGA.event({ category, action });
  }
};

export const logPageView = () => {
  ReactGA.pageview(window.location.pathname + window.location.search);
};
