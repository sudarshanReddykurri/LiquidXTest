import ReactGA from "react-ga";

export const initGA = (trackingID) => {
  ReactGA.initialize(trackingID);
};

export const PageView = () => {
  ReactGA.set({
    location: `${window.location.origin}${window.location.pathname}${window.location.search}`,
  });
  ReactGA.pageview(window.location.pathname + window.location.search);
};

export const PageViewOnlyPath = () => {
  ReactGA.set({
    location: `${window.location.origin}${window.location.pathname}`,
  });
  ReactGA.pageview(window.location.pathname);
};

/**
 * Event - Add custom tracking event.
 * @param {string} category
 * @param {string} action
 * @param {string} label
 */
export const Event = (category, action, label) => {
  ReactGA.event({
    category: category,
    action: action,
    label: label,
  });
};
