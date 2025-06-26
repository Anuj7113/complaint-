import React, { useEffect, useState } from "react";
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Box,
  Typography,
} from "@mui/material";

// Replace with your actual Google Sheets published CSV URL
const GOOGLE_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv";

const ISSUE_OPTIONS = [
  "Billing Issue",
  "Service Disruption",
  "Technical Support",
  "Account Management",
  "Other",
];

function parseCSV(csv) {
  const lines = csv.trim().split("\n");
  const headers = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const cols = line.split(",");
    const obj = {};
    headers.forEach((header, i) => {
      obj[header.trim()] = cols[i]?.trim();
    });
    return obj;
  });
}

function App() {
  const [customers, setCustomers] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [issue, setIssue] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(GOOGLE_SHEET_CSV_URL)
      .then((res) => res.text())
      .then((csv) => setCustomers(parseCSV(csv)))
      .catch(() => setError("Failed to load customer data"));
  }, []);

  useEffect(() => {
    const customer = customers.find(
      (c) => c.Name && c.Name.toLowerCase() === searchName.toLowerCase()
    );
    setSelectedCustomer(customer || null);
  }, [searchName, customers]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Complaint submitted!");
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        my: 2,
        p: 2,
        boxShadow: 2,
        borderRadius: 2,
        bgcolor: "#fff",
      }}
      component="form"
      onSubmit={handleSubmit}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        Complaint Manager
      </Typography>

      <TextField
        label="Customer Name"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
        fullWidth
        margin="normal"
        list="customer-names"
        autoComplete="off"
      />
      <datalist id="customer-names">
        {customers.map((c, i) => (
          <option key={i} value={c.Name} />
        ))}
      </datalist>

      <TextField
        label="Address"
        value={selectedCustomer?.Address || ""}
        fullWidth
        margin="normal"
        InputProps={{
          readOnly: true,
        }}
      />

      <TextField
        label="Location"
        value={selectedCustomer?.Location || ""}
        fullWidth
        margin="normal"
        InputProps={{
          readOnly: true,
        }}
      />

      <FormControl margin="normal" fullWidth>
        <InputLabel id="issue-label">Issue</InputLabel>
        <Select
          labelId="issue-label"
          value={issue}
          label="Issue"
          onChange={(e) => setIssue(e.target.value)}
          required
        >
          {ISSUE_OPTIONS.map((option, i) => (
            <MenuItem key={i} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        disabled={!searchName || !issue}
      >
        Submit Complaint
      </Button>
    </Box>
  );
}

export default App;
