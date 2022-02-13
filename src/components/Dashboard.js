import { Grid, Paper } from "@mui/material";
import React from "react";
import "../mystyle.css";

const Dashboard = () => {
  return (
    <div className="container">
        <div className="title">Dashboard</div>
        <br/>
        <div className="content">
            <table>
                <div className="exit-button">
                    <input type="submit" value="Search a Devotee" />
                </div><br/>
                <div className="exit-button">
                    <input type="submit" value="All Devotees" />
                </div><br/>
                <div className="exit-button">
                    <input type="submit" value="Weekly Email Subscribers" />
                </div><br/>
                <div className="exit-button">
                    <input type="submit" value="Volunteers" />
                </div><br/>
                <div className="exit-button">
                    <input type="submit" value="Whatsapp Subscribers" />
                </div><br/>
                <div className="exit-button">
                    <input type="submit" value="Maha Rudra Subscribers" />
                </div>
            </table>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <input type="submit" value="Whatsapp Subscribers" />
                </Grid>
                <Grid item xs={12} sm={6}>
                <div className="exit-button">
                    <input type="submit" value="Maha Rudra Subscribers" />
                </div>
                </Grid>
            </Grid>
            
        </div>
      </div>
  );
};

export default Dashboard;
