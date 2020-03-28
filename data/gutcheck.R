setwd("~/UPENN/Box Sync/4th_SEMESTER/Javascript/Harth_Leo_Midterm/data")

library(tidyverse)
library(scales)

df <- read.csv("2018_Building_Energy_Benchmarking.csv")

dat <- filter(df, df$Latitude > 47 & df$Latitude < 48)

summary(dat$Longitude)

dat <- dat %>% 
  dplyr::select(
    BuildingName, 
    BuildingType,
    Latitude, 
    Longitude, 
    YearBuilt,
    NumberofFloors,
    NumberofBuildings,
    PropertyGFATotal,
    ENERGYSTARScore,
    Electricity.kBtu.,
    NaturalGas.kBtu.,
    SteamUse.kBtu.,
    SiteEnergyUseWN.kBtu.
  )

dat$electricity_kbtu <- if_else(dat$Electricity.kBtu. > 0, rescale(dat$Electricity.kBtu., to = c(50, 800)), 0)
dat$total_energy_kbtu <- if_else(dat$SiteEnergyUseWN.kBtu. > 0, rescale(dat$SiteEnergyUseWN.kBtu.., to = c(50, 800)), 0)
dat$energy_score <- rescale(dat$ENERGYSTARScore, to = c(50, 800))
dat$nat_gas_kbtu <- if_else(dat$NaturalGas.kBtu. > 0, rescale(dat$NaturalGas.kBtu., to = c(50, 800)), 0)
dat$steam_kbtu <- if_else(dat$SteamUse.kBtu. > 0, rescale(dat$SteamUse.kBtu., to = c(50, 800)), 0)

hist(dat$electricity_kbtu)
hist(dat$total_energy_kbtu)
hist(dat$energy_score)
hist(dat$nat_gas_kbtu)
hist(dat$steam_kbtu)

dat_filter <- filter(dat, dat$total_energy_kbtu < 200)

