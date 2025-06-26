import React, { useEffect, useState } from "react";
// For autocomplete and mobile-friendly UI
import { TextField, MenuItem, Select, FormControl, InputLabel, Button, Box } from "@mui/material";

// Replace with your actual Google Sheets published CSV URL
const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/your-sheet-id/export?format=csv";

const ISSUE_OPTIONS = [
  "Billing Issue",
  "Service Disruption",
  "Technical Support",
  "Account Management",
  "Other"
];

function parseCSV(csv) {
  const lines = csv.trim().split("\n");
  const headers = lines[0].split(",");
  return lines.slice(1).map(line => {
    const cols = line.split(",");
    const obj = {};
    headers.forEach((header, i) => {
      obj[header.trim()] = cols[i]?.trim();
    });
    return obj;
  });
}

export default function ComplaintManagerApp() {
  const [customers, setCustomers] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [issue, setIssue] = useState("");

  useEffect(() => {
    // Fetch customer data from Google Sheets (CSV)
    fetch(GOOGLE_SHEET_CSV_URL)
      .then(res => res.text())
      .then(csv => setCustomers(parseCSV(csv)));
  }, []);

  useEffect(() => {
    // Autofill address and location when name is selected
    const customer = customers.find(
      c => c.Name && c.Name.toLowerCase() === searchName.toLowerCase()
    );
    setSelectedCustomer(customer || null);
  }, [searchName, customers]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here, implement what should happen on submit (e.g., save to DB, notify, etc.)
    alert("Complaint submitted!");
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        my: 2,
        p: 2,
        boxShadow: 2,
        borderRadius: 2,
        bgcolor: "#fff"
      }}
      component="form"
      onSubmit={handleSubmit}
    >
      <TextField
        label="Customer Name"
        value={searchName}
        onChange={e => setSearchName(e.target.value)}
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
          onChange={e => setIssue(e.target.value)}
          required
        >
          {ISSUE_OPTIONS.map((option, i) => (
            <MenuItem key={i} value={option}>{option}</MenuItem>
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
