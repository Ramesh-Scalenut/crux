import React, { useState, useMemo } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Typography,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import axios from "axios";





async function fetchCruxForUrls(urls = []) {


  const data = JSON.stringify({
    urls
  });

  const config = {
    method: 'post',
    url: '/get-crux-data',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    data: data
  };

  const res = await axios.request(config);

  if (res.status === 200 && res.data) {

    return res.data;

  } else {
    throw new Error('Failed to fetch CrUX data');
  }



}


function UrlListInput({ value, onChange }) {

  return (
    <TextField
      multiline
      minRows={1}
      maxRows={6}
      label="Enter one or more URLs (newline or comma separated)"
      placeholder="https://example.com\nhttps://sub.example.com"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
    />
  );
}


function MetricFilter({ metric, onChange }) {
  return (
    <FormControl sx={{ minWidth: 140 }}>
      <InputLabel id="metric-label">Metric</InputLabel>
      <Select labelId="metric-label" value={metric} label="Metric" onChange={(e) => onChange(e.target.value)}>
        <MenuItem value="lcp">LCP</MenuItem>
        <MenuItem value="fcp">FCP</MenuItem>
        <MenuItem value="cls">CLS</MenuItem>
      </Select>
    </FormControl>
  );
}


function ThresholdInput({ comparator, onComparatorChange, value, onValueChange }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <FormControl sx={{ minWidth: 80 }}>
        <InputLabel id="comp-label">Comp</InputLabel>
        <Select labelId="comp-label" value={comparator} label="Comp" onChange={(e) => onComparatorChange(e.target.value)}>
          <MenuItem value=">=">≥</MenuItem>
          <MenuItem value="<=">≤</MenuItem>
          <MenuItem value=">">&gt;</MenuItem>
          <MenuItem value="<">&lt;</MenuItem>
          <MenuItem value="=">=</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Threshold"
        placeholder="e.g. 2.0"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        sx={{ width: 120 }}
      />
    </Stack>
  );
}

function Loader() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 3 }}>
      <CircularProgress />
    </Box>
  );
}

function SortIcons({ order, onSort, metric, sortWithMetric }) {



  return (
    <Box display={"inline-flex"} flexDirection={"column"} alignItems={"center"} >
      <IconButton sx={{ padding: 0 }} onClick={() => {
        onSort("desc", metric);
      }}>
        <ArrowDropUpIcon sx={{ color: metric === sortWithMetric && order === "desc" ? "black" : "lightgray" }} />
      </IconButton>
      <IconButton sx={{ padding: 0 }} onClick={() => {
        onSort("asc", metric);
      }}>
        <ArrowDropDownIcon sx={{ color: metric === sortWithMetric && order === "asc" ? "black" : "lightgray" }} />
      </IconButton>
    </Box>
  );
}


function TableCellVisible({ children, visible = true }) {
  if (!visible) return null;
  return (
    <TableCell>
      {children || "-"}
    </TableCell>
  );
}

function CruxTable({ rows, order, setOrder, setSortWithMetric, sortWithMetric }) {

  const [visibleMetrics, setVisibleMetrics] = useState(["fcp", "lcp", "cls"]);

  function onSortCallback(_order, _metric) {

    setOrder(_order);

    setSortWithMetric(_metric);

  }

  return (
    <>

      <TableContainer component={Paper} sx={{ mt: 2, pt: 2 }}>
        <FormControl sx={{ marginLeft: "auto", float: "right" }}>
          <InputLabel id="demo-multiple-checkbox-label">Visible Metrics</InputLabel>
          <Select
            labelId="visible-metrics-label"
            multiple
            value={visibleMetrics}
            onChange={e => e.target.value.length && setVisibleMetrics(e.target.value)}
            input={<OutlinedInput sx={{ textTransform: "uppercase" }} label="Visible Metrics" />}
            renderValue={(selected) => selected.join(', ').toLocaleUpperCase()}

            sx={{ width: 200 }}


          >
            <MenuItem value="lcp">LCP</MenuItem>
            <MenuItem value="fcp">FCP</MenuItem>
            <MenuItem value="cls">CLS</MenuItem>
          </Select></FormControl>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>URL</TableCell>
              <TableCellVisible visible={visibleMetrics.includes("fcp")} align="right" >FCP <SortIcons sortWithMetric={sortWithMetric} metric={"fcp"} order={order} onSort={onSortCallback} /></TableCellVisible>
              <TableCellVisible visible={visibleMetrics.includes("lcp")} align="right">LCP <SortIcons sortWithMetric={sortWithMetric} metric={"lcp"} order={order} onSort={onSortCallback} /></TableCellVisible>
              <TableCellVisible visible={visibleMetrics.includes("cls")} align="right">CLS <SortIcons sortWithMetric={sortWithMetric} metric={"cls"} order={order} onSort={onSortCallback} /></TableCellVisible>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                  No data
                </TableCell>
              </TableRow>
            ) : (
              rows.map((r) => (
                <TableRow key={r.url} hover>
                  <TableCell style={{ maxWidth: 520, wordBreak: "break-all" }}>{r.url}</TableCell>
                  <TableCellVisible visible={visibleMetrics.includes("fcp")} align="right">{r.fcp}</TableCellVisible>
                  <TableCellVisible visible={visibleMetrics.includes("lcp")} align="right">{r.lcp}</TableCellVisible>
                  <TableCellVisible visible={visibleMetrics.includes("cls")} align="right">{r.cls}</TableCellVisible>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>

  );
}


export default function App() {
  const [urlsText, setUrlsText] = useState("https://developer.intuit.com\nhttps://quickbooks.intuit.com\nhttps://turbotax.intuit.com");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortWithMetric, setSortWithMetric] = useState("fcp");
  const [metric, setMetric] = useState("fcp");
  const [order, setOrder] = useState("asc");
  const [comparator, setComparator] = useState(">=");
  const [threshold, setThreshold] = useState(0);
  const [error, setError] = useState(null);

  const parsedUrls = useMemo(() => {
    if (!urlsText) return [];
    // Split by newline or comma; filter out empty strings and trim
    return urlsText
      .split(/\n|,|;/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }, [urlsText]);

  async function handleSearch() {
    setLoading(true);
    setError(null);
    setComparator(">=");
    setThreshold(0);
    try {
      const results = await fetchCruxForUrls(parsedUrls);
      setData(results);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch CrUX data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function applyComparator(val, comp, thresh) {
    const v = Number(val);
    const t = Number(thresh);
    if (Number.isNaN(v) || Number.isNaN(t)) return false;
    switch (comp) {
      case ">=":
        return v >= t;
      case "<=":
        return v <= t;
      case ">":
        return v > t;
      case "<":
        return v < t;
      case "=":
        return v === t;
      default:
        return false;
    }
  }

  const filteredAndSorted = useMemo(() => {
    if (!data) return [];
    // threshold filter
    const thresholdNum = Number(threshold);
    let res = data.slice();
    if (!Number.isNaN(thresholdNum)) {
      res = res.filter((r) => applyComparator(r[metric], comparator, thresholdNum));
    }
    // sort
    res.sort((a, b) => {
      const av = Number(a[sortWithMetric]);
      const bv = Number(b[sortWithMetric]);
      if (Number.isNaN(av) || Number.isNaN(bv)) return 0;
      return order === "asc" ? av - bv : bv - av;
    });
    return res;
  }, [data, sortWithMetric, comparator, threshold, order, metric]);


  const summary = useMemo(() => {
    if (!filteredAndSorted || filteredAndSorted.length === 0) return null;

    const totalFcp = filteredAndSorted.reduce((sum, r) => sum + (r.fcp || 0), 0);
    const totalLcp = filteredAndSorted.reduce((sum, r) => sum + (r.lcp || 0), 0);
    const totalCls = filteredAndSorted.reduce((sum, r) => sum + (r.cls || 0), 0);

    const count = filteredAndSorted.length;

    return {
      avgFcp: (totalFcp / count).toFixed(2),
      avgLcp: (totalLcp / count).toFixed(2),
      avgCls: (totalCls / count).toFixed(3),
      sumFcp: totalFcp.toFixed(2),
      sumLcp: totalLcp.toFixed(2),
      sumCls: totalCls.toFixed(3),
    };
  }, [filteredAndSorted]);


  const noDataUrls = useMemo(() => {

    return data.filter(({ error }) => !!error);
  }, [data]);


  return (
    <Container maxWidth="md" sx={{ py: 6, width: "800px" }}>
      <Paper sx={{ p: 4 }} elevation={3}>
        <Typography variant="h4" component="h1" textAlign={"center"} gutterBottom>
          CrUX Data
        </Typography>

        <Stack spacing={2} direction={{ xs: "column", sm: "row" }} alignItems="flex-start" sx={{ mt: 2 }}>
          <Box sx={{ flex: 1 }}>
            <UrlListInput value={urlsText} onChange={setUrlsText} />
          </Box>

          <Box sx={{ minWidth: 110 }}>
            <Button variant="contained" size="large" onClick={handleSearch} disabled={loading}>
              Search
            </Button>
          </Box>
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" sx={{ mt: 3 }}>
          <Box sx={{ ml: "auto" }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <MetricFilter metric={metric} onChange={setMetric} />
              {metric !== "all" && <ThresholdInput
                comparator={comparator}
                onComparatorChange={setComparator}
                value={threshold}
                onValueChange={setThreshold}
              />}
            </Stack>
          </Box>
        </Stack>

        {loading ? <Loader /> : <><CruxTable sortWithMetric={sortWithMetric} setSortWithMetric={setSortWithMetric} order={order} setOrder={setOrder} rows={filteredAndSorted} />
          {summary && (
            <Paper sx={{ p: 2, mt: 3, mb: 2 }} elevation={1}>
              <Typography variant="h6">Summary</Typography>

              <Stack direction="row" spacing={4} sx={{ mt: 1 }}>
                <Box>
                  <Typography variant="subtitle2">Avg. FCP</Typography>
                  <Typography>{summary.avgFcp}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2">Avg. LCP</Typography>
                  <Typography>{summary.avgLcp}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2">Avg. CLS</Typography>
                  <Typography>{summary.avgCls}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2">Sum LCP</Typography>
                  <Typography>{summary.sumLcp}</Typography>
                </Box>
              </Stack>
            </Paper>
          )}
        </>}


        {noDataUrls.length > 0 && !loading &&

          <Paper sx={{ p: 2, mt: 3, mb: 2 }} elevation={1}>

            <Typography variant="h6" sx={{ mt: 3 }}>
              URLs with No Data
            </Typography>

            <List dense={true}>
              {noDataUrls.map(({ url, error }) =>
                <ListItem>
                  <ListItemText
                    sx={{ color: "red" }}
                    primary={url}
                  />
                </ListItem>,
              )}
            </List>
          </Paper>




        }


        {error && !loading && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}


      </Paper>
    </Container>
  );
}
