import { fetchCruxMetrics } from "../services/crux.service.js";

export const getCruxData = async (req, res) => {
  try {
    const { urls } = req.body;

    if (!urls || !Array.isArray(urls)) {
      return res.status(400).json({ error: "urls[] is required" });
    }

    const results = await fetchCruxMetrics(urls);

    res.json(results);
  } catch (err) {
    console.error("CrUX fetch failed:", err.message);
    res.status(500).json({ error: "Failed to fetch CrUX data" });
  }
};
