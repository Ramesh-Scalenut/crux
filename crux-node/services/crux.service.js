import axios from "axios";

export async function fetchCruxMetrics(urls) {
  const API_KEY = process.env.CRUX_API_KEY;
  const endpoint =
    "https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=" + API_KEY;

  const requests = urls.map(async (url) => {
    const body = { url };

    try {
      const resp = await axios.post(endpoint, body);
      const metric = resp.data.record?.metrics || {};

      return {
        url,
        fcp: +metric.first_contentful_paint?.percentiles?.p75 || null,
        lcp: +metric.largest_contentful_paint?.percentiles?.p75 || null,
        cls: +metric.cumulative_layout_shift?.percentiles?.p75 || null,
      };
    } catch (err) {
      return {
        url,
        error: "No CrUX data found",
      };
    }
  });

  return Promise.all(requests);
}
