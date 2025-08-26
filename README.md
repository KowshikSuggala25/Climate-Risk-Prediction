# AI for Climate Risk Prediction

An AI-powered system to predict climate-related risks such as floods, heatwaves, and air pollution spikes at the community level. The project provides localized forecasts, risk dashboards, and actionable alerts to help communities prepare and mitigate the impacts of climate change.

## Table of Contents

* [Overview](#overview)
* [Challenge Statement](#challenge-statement)
* [Core Features](#core-features)
* [Tech Stack](#tech-stack)
* [Example Use Case](#example-use-case)
* [Impact](#impact)
* [Getting Started](#getting-started)
* [Screenshots / Demo](#screenshots--demo)
* [Contributing](#contributing)
* [License](#license)

## Overview

Climate change is driving increasingly frequent and severe disasters:

* Floods caused by heavy rainfall and poor drainage
* Extreme heatwaves affecting health and productivity
* Air pollution spikes worsening respiratory diseases

### The Problem

* Existing warning systems are often generic and lack local insights
* Predictions are reactive rather than preventive
* Limited use of AI/ML with weather and historical climate data

### The Solution

This project introduces an AI-based Climate Risk Prediction System that provides:

* Localized risk forecasts (short-term and seasonal)
* Power BI dashboards for visualization and monitoring
* Actionable alerts via email and SMS

## Challenge Statement

Develop an AI-based system that predicts climate-related risks (floods, heatwaves, air pollution spikes) at a community level and provides actionable insights for preparedness and mitigation.

## Core Features

### Data Integration

* Integration of OpenWeather API for real-time weather data
* Use of open datasets such as NASA Climate Data, NOAA, AQI, and Kaggle climate datasets

### AI/ML Models

* Risk predictions for short-term (1–7 days) and long-term (seasonal) horizons
* Example predictive models:

  * Flood risk prediction using rainfall and soil saturation
  * Heatwave prediction using temperature, humidity, and wind speed
  * Air pollution spike prediction using AQI and weather patterns
* Algorithms include Random Forest, XGBoost, LSTM, GRU, and Transformers

### Visualization

* Power BI dashboards to display risk levels (Low, Medium, High)
* Forecast trends with confidence scores
* Zone-based risk segmentation

### Alerts

* Automated alerts delivered via Email and SMS
* Preparedness recommendations for authorities and citizens

## Tech Stack

* **AI/ML:** Python, Scikit-learn, TensorFlow, PyTorch, Prophet
* **Data Sources:** OpenWeather API, NASA Climate Data, NOAA, AQI datasets, Kaggle
* **Visualization:** Power BI
* **Deployment:** Google Cloud Platform (GCP)

## Example Use Case

A city prone to monsoon flooding:

1. Historical rainfall and soil saturation data from the past 10 years are processed.
2. The OpenWeather API reports an expected 200 mm of rainfall tomorrow.
3. The AI model predicts a "High Flood Risk" in three zones.
4. The Power BI dashboard and Email/SMS alerts notify:

   * Prepare flood barriers in Zone 4
   * Avoid travel in areas where waterlogging is expected
   * Flood probability is estimated to be 60% higher compared to last week
5. Local authorities and citizens can take preventive action before the disaster strikes.

## Impact

This solution directly supports the following United Nations Sustainable Development Goals (SDGs):

* SDG 11: Sustainable Cities and Communities
* SDG 13: Climate Action
* SDG 3: Good Health and Well-being

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/KowshikSuggala25/Climate-Risk-Prediction.git
cd Climate-Risk-Prediction
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Run the model

```bash
python main.py
```

### 4. View results

Open the Power BI reports to explore predictions and risk levels.

## Screenshots / Demo

(Add visuals of your Power BI dashboards or model outputs here.)

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository
2. Create a new branch (`feature/new-feature`)
3. Commit your changes
4. Open a Pull Request
