import React, { useState } from "react";
import axios from "axios";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Box,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { areas } from "../areas1";

const theme = createTheme({
  palette: {
    primary: {
      main: "#5292c7", // Set your primary color
    },
    secondary: {
      main: "#FF5722", // Set your secondary color
    },
  },
});

const PropertyForm = () => {
  const [transactionType, setTransactionType] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [propertyUsage, setPropertyUsage] = useState("");
  const [regType, setRegType] = useState("");
  const [propertySize, setPropertySize] = useState("");
  const [location, setLocation] = useState(null);
  const [nearestMetro, setNearestMetro] = useState("");
  const [propertyArea, setPropertyArea] = useState("");
  const [hasParking, setHasParking] = useState("Yes");
  const [predictedPrice, setPredictedPrice] = useState(null); // To store and display prediction result

  const transactionTypes = ["Sales", "Mortgages"];
  const propertyTypes = ["Unit", "Villa", "Land", "Building"];
  const propertyUsages = [
    "Commercial",
    "Residential",
    "Hospitality",
    "Industrial",
    "Agricultural",
    "Multi-Use",
    "Storage",
    "Residential / Commercial",
    "Other",
  ];
  const regTypes = ["Off-Plan Properties", "Existing Properties"];
  const propertySizes = [
    "Studio",
    "1 B/R",
    "2 B/R",
    "3 B/R",
    "Office",
    "Others",
  ];

  // Handle form submission using Axios
  const handleSubmit = async (e) => {
    e.preventDefault();
    const inputData = {
      trans_group: transactionType,
      property_type_en: propertyType,
      property_usage_en: propertyUsage,
      reg_type_en: regType,
      room_value: propertySize,
      area_name_en: location ? location.area_name_en : "",
      nearest_metro_en: nearestMetro,
      procedure_area: parseFloat(propertyArea),
      hasParking: hasParking === "Yes" ? 1 : 0,
    };

    try {
      const response = await axios.post(
        "https://qurancms-ecf1e.uc.r.appspot.com/predict",
        inputData
      );
      setPredictedPrice(response.data.predicted_price); // Set the predicted price to be displayed
    } catch (error) {
      console.error("Error fetching prediction:", error);
    }

    console.log("input data", inputData);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          p: 3,
          maxWidth: 600,
          width: "100%", // Allow full width in its container
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          margin: "0 auto", // Center the form in the container
        }}
      >
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          {/* Transaction Type */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Transaction Type</InputLabel>
            <Select
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              label="Transaction Type"
            >
              {transactionTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Property Type */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Property Type</InputLabel>
            <Select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              label="Property Type"
            >
              {propertyTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Property Usage */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Property Usage</InputLabel>
            <Select
              value={propertyUsage}
              onChange={(e) => setPropertyUsage(e.target.value)}
              label="Property Usage"
            >
              {propertyUsages.map((usage) => (
                <MenuItem key={usage} value={usage}>
                  {usage}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Registration Type */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Registration Type</InputLabel>
            <Select
              value={regType}
              onChange={(e) => setRegType(e.target.value)}
              label="Registration Type"
            >
              {regTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Property Size */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Rooms</InputLabel>
            <Select
              value={propertySize}
              onChange={(e) => setPropertySize(e.target.value)}
              label="Rooms"
            >
              {propertySizes.map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Location (Area) */}
          <Autocomplete
            options={areas}
            getOptionLabel={(option) => option.area_name_en}
            onChange={(event, newValue) => {
              setLocation(newValue);
              setNearestMetro(null);
            }}
            filterOptions={(options, { inputValue }) =>
              options.filter((option) =>
                option.area_name_en
                  .toLowerCase()
                  .includes(inputValue.toLowerCase())
              )
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Location"
                variant="outlined"
                margin="normal"
                fullWidth
              />
            )}
          />

          {/* Nearest Metro */}
          <Autocomplete
            options={location ? location.nearest_metro_en : []}
            getOptionLabel={(option) => option}
            onChange={(event, newValue) => setNearestMetro(newValue)}
            filterOptions={(options, { inputValue }) =>
              options.filter((option) =>
                option.toLowerCase().includes(inputValue.toLowerCase())
              )
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Nearest Metro"
                variant="outlined"
                margin="normal"
                fullWidth
              />
            )}
          />

          {/* Property Area */}
          <TextField
            label="Property Area (sq.ft.)"
            variant="outlined"
            fullWidth
            margin="normal"
            type="number"
            value={propertyArea}
            onChange={(e) => setPropertyArea(e.target.value)}
          />

          {/* Has Parking */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Has Parking?</InputLabel>
            <Select
              value={hasParking}
              onChange={(e) => setHasParking(e.target.value)}
              label="Has Parking?"
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
          </FormControl>

          {/* Submit Button */}
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Box>
        </form>

        {/* Display the predicted price after form submission */}
        {predictedPrice && (
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Predicted Price (AED)"
              variant="outlined"
              fullWidth
              value={predictedPrice}
              InputProps={{
                readOnly: true,
              }}
            />
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default PropertyForm;
